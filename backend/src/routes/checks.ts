import {
  createCheckInputSchema,
  type Check,
  type CheckItem,
} from "@lazy-janes/shared";
import { Router } from "express";
import { z } from "zod";
import {
  getAuthenticatedUser,
  requireAnyRole,
  requireAuthenticatedUser,
} from "../auth/session.js";
import { pool } from "../db/pool.js";

type CheckRow = {
  id: string;
  party_id: string | null;
  label: string;
  status: Check["status"];
  opened_by_user_id: string;
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
    openedByUserId: row.opened_by_user_id,
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

checksRouter.use(requireAuthenticatedUser);
checksRouter.use(
  requireAnyRole(
    "server",
    "lead_server",
    "manager",
    "admin",
  ),
);

checksRouter.post("/", async (request, response) => {
  const input = createCheckInputSchema.safeParse(request.body);

  if (!input.success) {
    response.status(400).json({
      error: "Invalid check",
      issues: input.error.issues,
    });
    return;
  }

  const userId = getAuthenticatedUser(request).id;


  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const user = await client.query<{ id: string }>(
      `
        SELECT id
        FROM users
        WHERE id = $1
          AND is_active = true
      `,
      [userId],
    );

    if (!user.rows[0]) {
      await client.query("ROLLBACK");
      response.status(403).json({
        error: "Active user not found",
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

    // Resolve any ADD / EXTRA prices that were unknown when the order was
    // entered. Availability and price certainty are intentionally separate:
    // the kitchen can receive the order immediately, but billing must never
    // silently treat an unknown charge as free.
    await client.query(
      `
        UPDATE order_item_ingredient_changes change_record
        SET
          price_adjustment = link.extra_price,
          price_configured = true
        FROM order_items order_item,
             menu_item_ingredients link
        WHERE change_record.order_item_id = order_item.id
          AND link.menu_item_id = order_item.menu_item_id
          AND link.ingredient_id = change_record.ingredient_id
          AND change_record.order_item_id = ANY($1::uuid[])
          AND change_record.change_kind = 'extra'
          AND change_record.price_configured = false
          AND link.extra_price_configured = true
      `,
      [requestedItemIds],
    );

    await client.query(
      `
        UPDATE order_item_ingredient_changes change_record
        SET
          price_adjustment = ingredient.default_add_price,
          price_configured = true
        FROM ingredients ingredient
        WHERE ingredient.id = change_record.ingredient_id
          AND change_record.order_item_id = ANY($1::uuid[])
          AND change_record.change_kind = 'add'
          AND change_record.price_configured = false
          AND ingredient.is_active = true
          AND ingredient.is_addable = true
          AND ingredient.add_price_configured = true
      `,
      [requestedItemIds],
    );

    const unresolvedPrices = await client.query<{
      change_kind: "extra" | "add";
      ingredient_name: string;
    }>(
      `
        SELECT DISTINCT
          change_kind,
          ingredient_name
        FROM order_item_ingredient_changes
        WHERE order_item_id = ANY($1::uuid[])
          AND change_kind IN ('extra', 'add')
          AND price_configured = false
        ORDER BY change_kind, ingredient_name
      `,
      [requestedItemIds],
    );

    if (unresolvedPrices.rows.length > 0) {
      await client.query("ROLLBACK");
      response.status(409).json({
        error: `Price required before check: ${unresolvedPrices.rows
          .map(
            (change) =>
              `${change.change_kind.toUpperCase()} ${change.ingredient_name}`,
          )
          .join(", ")}`,
      });
      return;
    }

    const modifierTotals =
      await client.query<ModifierTotalRow>(
        `
          SELECT
            adjustments.order_item_id,
            COALESCE(
              SUM(adjustments.price_adjustment),
              0
            )::text AS modifier_total
          FROM (
            SELECT
              order_item_id,
              price_adjustment
            FROM order_item_modifiers
            WHERE order_item_id = ANY($1::uuid[])

            UNION ALL

            SELECT
              order_item_id,
              price_adjustment
            FROM order_item_ingredient_changes
            WHERE order_item_id = ANY($1::uuid[])
              AND change_kind IN ('extra', 'add')

            UNION ALL

            SELECT
              order_item_id,
              price_adjustment
            FROM order_item_choice_selections
            WHERE order_item_id = ANY($1::uuid[])
          ) adjustments
          GROUP BY adjustments.order_item_id
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
          opened_by_user_id,
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
          opened_by_user_id,
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
        userId,
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
          actor_user_id,
          details
        )
        VALUES (
          $1,
          'created',
          'user',
          $2,
          jsonb_build_object(
            'itemCount',
            $3::integer
          )
        )
      `,
      [check.id, userId, createdItems.length],
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

const checkIdSchema = z.string().uuid();

checksRouter.post(
  "/:checkId/present",
  async (request, response) => {
    const checkId = checkIdSchema.safeParse(
      request.params.checkId,
    );

    if (!checkId.success) {
      response.status(400).json({
        error: "Invalid check ID",
      });
      return;
    }

    const userId = getAuthenticatedUser(request).id;


    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const current = await client.query<{
        status: Check["status"];
      }>(
        `
          SELECT status
          FROM checks
          WHERE id = $1
          FOR UPDATE
        `,
        [checkId.data],
      );

      const currentCheck = current.rows[0];

      if (!currentCheck) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Check not found",
        });
        return;
      }

      if (currentCheck.status !== "open") {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only an open check can be presented",
        });
        return;
      }

      const updated = await client.query<CheckRow>(
        `
          UPDATE checks
          SET
            status = 'presented',
            presented_at = now(),
            updated_at = now()
          WHERE id = $1
          RETURNING
            id,
            party_id,
            label,
            status,
            opened_by_user_id,
            subtotal_amount,
            sales_tax_rate,
            tax_amount,
            total_amount,
            presented_at,
            closed_at,
            created_at,
            updated_at
        `,
        [checkId.data],
      );

      const presentedCheck = updated.rows[0];

      if (!presentedCheck) {
        throw new Error(
          "Presented check update returned no record",
        );
      }

      await client.query(
        `
          INSERT INTO check_events (
            check_id,
            event_type,
            actor_kind,
            actor_user_id
          )
          VALUES ($1, 'presented', 'user', $2)
        `,
        [checkId.data, userId],
      );

      const items = await client.query<CheckItemRow>(
        `
          SELECT
            id,
            order_item_id,
            item_name,
            allocated_quantity,
            allocated_amount,
            created_at
          FROM check_items
          WHERE check_id = $1
          ORDER BY created_at, id
        `,
        [checkId.data],
      );

      await client.query("COMMIT");
      response.json(
        toCheck(
          presentedCheck,
          items.rows.map(toCheckItem),
        ),
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);
