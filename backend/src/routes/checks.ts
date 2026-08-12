import {
  createCheckInputSchema,
  type Check,
  type CheckItem,
} from "@lazy-janes/shared";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";

type CheckRow = {
  id: string;
  party_id: string | null;
  label: string;
  status: Check["status"];
  opened_by_staff_id: string;
  subtotal_amount: string;
  sales_tax_rate: string;
  tax_amount: string;
  total_amount: string;
  presented_at: Date | null;
  closed_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type CheckItemRow = {
  id: string;
  order_item_id: string;
  item_name: string;
  allocated_quantity: string;
  allocated_amount: string;
  created_at: Date;
};

type BillableOrderItemRow = {
  id: string;
  order_id: string;
  party_id: string | null;
  item_name: string;
  unit_price: string;
  quantity: number;
  status: string;
};

type ExistingAllocationRow = {
  order_item_id: string;
  allocated_quantity: string;
};

type ModifierTotalRow = {
  order_item_id: string;
  modifier_total: string;
};

const staffIdSchema = z.string().uuid();

function toCheckItem(row: CheckItemRow): CheckItem {
  return {
    id: row.id,
    orderItemId: row.order_item_id,
    itemName: row.item_name,
    allocatedQuantity: Number(row.allocated_quantity),
    allocatedAmount: Number(row.allocated_amount),
    createdAt: row.created_at.toISOString(),
  };
}

function toCheck(
  row: CheckRow,
  items: CheckItem[],
): Check {
  return {
    id: row.id,
    partyId: row.party_id,
    label: row.label,
    status: row.status,
    openedByStaffId: row.opened_by_staff_id,
    subtotalAmount: Number(row.subtotal_amount),
    salesTaxRate: Number(row.sales_tax_rate),
    taxAmount: Number(row.tax_amount),
    totalAmount: Number(row.total_amount),
    presentedAt: row.presented_at?.toISOString() ?? null,
    closedAt: row.closed_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    items,
  };
}

export const checksRouter = Router();

checksRouter.post("/", async (request, response) => {
  const input = createCheckInputSchema.safeParse(request.body);

  if (!input.success) {
    response.status(400).json({
      error: "Invalid check",
      issues: input.error.issues,
    });
    return;
  }

  const staffId = staffIdSchema.safeParse(
    request.header("x-staff-id"),
  );

  if (!staffId.success) {
    response.status(401).json({
      error: "A valid staff identity is required",
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const staff = await client.query<{ id: string }>(
      `
        SELECT id
        FROM staff
        WHERE id = $1
          AND is_active = true
      `,
      [staffId.data],
    );

    if (!staff.rows[0]) {
      await client.query("ROLLBACK");
      response.status(403).json({
        error: "Active staff member not found",
      });
      return;
    }

    const requestedItemIds = input.data.items.map(
      (item) => item.orderItemId,
    );

    const orderItems =
      await client.query<BillableOrderItemRow>(
        `
          SELECT
            order_items.id,
            order_items.order_id,
            orders.party_id,
            order_items.item_name,
            order_items.unit_price,
            order_items.quantity,
            order_items.status
          FROM order_items
          JOIN orders
            ON orders.id = order_items.order_id
          WHERE order_items.id = ANY($1::uuid[])
          FOR UPDATE OF order_items
        `,
        [requestedItemIds],
      );

    if (orderItems.rows.length !== requestedItemIds.length) {
      await client.query("ROLLBACK");
      response.status(404).json({
        error: "One or more order items were not found",
      });
      return;
    }

    if (
      orderItems.rows.some(
        (item) => item.status === "voided",
      )
    ) {
      await client.query("ROLLBACK");
      response.status(409).json({
        error: "Voided order items cannot be checked",
      });
      return;
    }

    const cancelledOrders = await client.query<{
      id: string;
    }>(
      `
        SELECT id
        FROM orders
        WHERE id = ANY($1::uuid[])
          AND cancelled_at IS NOT NULL
      `,
      [
        Array.from(
          new Set(
            orderItems.rows.map((item) => item.order_id),
          ),
        ),
      ],
    );

    if (cancelledOrders.rows.length > 0) {
      await client.query("ROLLBACK");
      response.status(409).json({
        error: "Cancelled orders cannot be checked",
      });
      return;
    }

    if (input.data.partyId !== null) {
      const party = await client.query<{
        id: string;
        status: string;
      }>(
        `
          SELECT id, status
          FROM parties
          WHERE id = $1
          FOR UPDATE
        `,
        [input.data.partyId],
      );

      if (!party.rows[0]) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Party not found",
        });
        return;
      }

      if (
        party.rows[0].status === "completed" ||
        party.rows[0].status === "cancelled"
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A finished party cannot receive a check",
        });
        return;
      }

      if (
        orderItems.rows.some(
          (item) => item.party_id !== input.data.partyId,
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Every order item must belong to the party",
        });
        return;
      }
    } else {
      const orderIds = new Set(
        orderItems.rows.map((item) => item.order_id),
      );

      if (orderIds.size !== 1) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error:
            "A check without a party must use one order",
        });
        return;
      }
    }

    const allocations =
      await client.query<ExistingAllocationRow>(
        `
          SELECT
            order_item_id,
            COALESCE(
              SUM(allocated_quantity),
              0
            )::text AS allocated_quantity
          FROM check_items
          WHERE order_item_id = ANY($1::uuid[])
          GROUP BY order_item_id
        `,
        [requestedItemIds],
      );

    const allocatedByItem = new Map(
      allocations.rows.map((allocation) => [
        allocation.order_item_id,
        Number(allocation.allocated_quantity),
      ]),
    );

    const requestedByItem = new Map(
      input.data.items.map((item) => [
        item.orderItemId,
        item.allocatedQuantity,
      ]),
    );

    for (const item of orderItems.rows) {
      const existing = allocatedByItem.get(item.id) ?? 0;
      const requested = requestedByItem.get(item.id) ?? 0;

      if (existing + requested > item.quantity) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: `${item.item_name} is over-allocated`,
        });
        return;
      }
    }

    const modifierTotals =
      await client.query<ModifierTotalRow>(
        `
          SELECT
            order_item_id,
            COALESCE(
              SUM(price_adjustment),
              0
            )::text AS modifier_total
          FROM order_item_modifiers
          WHERE order_item_id = ANY($1::uuid[])
          GROUP BY order_item_id
        `,
        [requestedItemIds],
      );

    const modifierTotalByItem = new Map(
      modifierTotals.rows.map((modifier) => [
        modifier.order_item_id,
        Number(modifier.modifier_total),
      ]),
    );

    const calculatedItems = orderItems.rows.map((item) => {
      const allocatedQuantity =
        requestedByItem.get(item.id) ?? 0;
      const unitAmount =
        Number(item.unit_price) +
        (modifierTotalByItem.get(item.id) ?? 0);
      const allocatedAmount =
        Math.round(
          unitAmount * allocatedQuantity * 100,
        ) / 100;

      return {
        ...item,
        allocatedQuantity,
        allocatedAmount,
      };
    });

    const subtotalAmount =
      Math.round(
        calculatedItems.reduce(
          (total, item) =>
            total + item.allocatedAmount,
          0,
        ) * 100,
      ) / 100;

    const salesTaxRate = 0.06625;
    const taxAmount =
      Math.round(subtotalAmount * salesTaxRate * 100) /
      100;
    const totalAmount =
      Math.round(
        (subtotalAmount + taxAmount) * 100,
      ) / 100;

    const createdCheck = await client.query<CheckRow>(
      `
        INSERT INTO checks (
          party_id,
          label,
          opened_by_staff_id,
          subtotal_amount,
          sales_tax_rate,
          tax_amount,
          total_amount
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          party_id,
          label,
          status,
          opened_by_staff_id,
          subtotal_amount,
          sales_tax_rate,
          tax_amount,
          total_amount,
          presented_at,
          closed_at,
          created_at,
          updated_at
      `,
      [
        input.data.partyId,
        input.data.label,
        staffId.data,
        subtotalAmount,
        salesTaxRate,
        taxAmount,
        totalAmount,
      ],
    );

    const check = createdCheck.rows[0];

    if (!check) {
      throw new Error("Check insert returned no record");
    }

    const createdItems: CheckItem[] = [];

    for (const item of calculatedItems) {
      const inserted =
        await client.query<CheckItemRow>(
          `
            INSERT INTO check_items (
              check_id,
              order_item_id,
              item_name,
              allocated_quantity,
              allocated_amount
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
              id,
              order_item_id,
              item_name,
              allocated_quantity,
              allocated_amount,
              created_at
          `,
          [
            check.id,
            item.id,
            item.item_name,
            item.allocatedQuantity,
            item.allocatedAmount,
          ],
        );

      const createdItem = inserted.rows[0];

      if (!createdItem) {
        throw new Error(
          "Check item insert returned no record",
        );
      }

      createdItems.push(toCheckItem(createdItem));
    }

    await client.query(
      `
        INSERT INTO check_events (
          check_id,
          event_type,
          actor_kind,
          actor_staff_id,
          details
        )
        VALUES (
          $1,
          'created',
          'staff',
          $2,
          jsonb_build_object(
            'itemCount',
            $3::integer
          )
        )
      `,
      [check.id, staffId.data, createdItems.length],
    );

    await client.query("COMMIT");
    response.status(201).json(
      toCheck(check, createdItems),
    );
  } catch (error: unknown) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});
