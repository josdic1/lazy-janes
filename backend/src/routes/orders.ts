import {
  cancelOrderInputSchema,
  createOrderInputSchema,
  deliverOrderItemsInputSchema,
  fireOrderInputSchema,
  markKitchenItemsReadyInputSchema,
  voidOrderItemsInputSchema,
  type KitchenChit,
  type Order,
  type OrderItem,
  type OrderItemModifier,
  type PartyStatus,
} from "@lazy-janes/shared";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";

type MenuRow = {
  id: string;
  parent_item_id: string | null;
  name: string;
  price: string;
  status: string;
  is_modifier: boolean;
};

type OrderRow = {
  id: string;
  party_id: string | null;
  fulfillment_type: Order["fulfillmentType"];
  created_by_staff_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  requested_for: Date | null;
  delivery_address: string | null;
  submitted_at: Date;
  cancelled_at: Date | null;
  cancelled_by_staff_id: string | null;
  cancellation_reason: string | null;
  created_at: Date;
};

type OrderItemRow = {
  id: string;
  menu_item_id: string;
  seat_number: number | null;
  item_name: string;
  unit_price: string;
  quantity: number;
  kitchen_note: string | null;
  status: OrderItem["status"];
  submitted_at: Date;
  fired_at: Date | null;
  ready_at: Date | null;
  fulfilled_at: Date | null;
  voided_at: Date | null;
  voided_by_staff_id: string | null;
  void_reason: string | null;
};

type ModifierRow = {
  id: string;
  menu_item_id: string;
  modifier_name: string;
  price_adjustment: string;
};

const staffIdSchema = z.string().uuid();

function toModifier(row: ModifierRow): OrderItemModifier {
  return {
    id: row.id,
    menuItemId: row.menu_item_id,
    modifierName: row.modifier_name,
    priceAdjustment: Number(row.price_adjustment),
  };
}

function toOrderItem(
  row: OrderItemRow,
  modifiers: OrderItemModifier[],
): OrderItem {
  return {
    id: row.id,
    menuItemId: row.menu_item_id,
    seatNumber: row.seat_number,
    itemName: row.item_name,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    kitchenNote: row.kitchen_note,
    status: row.status,
    submittedAt: row.submitted_at.toISOString(),
    firedAt: row.fired_at?.toISOString() ?? null,
    readyAt: row.ready_at?.toISOString() ?? null,
    fulfilledAt: row.fulfilled_at?.toISOString() ?? null,
    voidedAt: row.voided_at?.toISOString() ?? null,
    voidedByStaffId: row.voided_by_staff_id,
    voidReason: row.void_reason,
    modifiers,
  };
}

function toOrder(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    partyId: row.party_id,
    fulfillmentType: row.fulfillment_type,
    createdByStaffId: row.created_by_staff_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    requestedFor: row.requested_for?.toISOString() ?? null,
    submittedAt: row.submitted_at.toISOString(),
    cancelledAt: row.cancelled_at?.toISOString() ?? null,
    cancelledByStaffId: row.cancelled_by_staff_id,
    cancellationReason: row.cancellation_reason,
    createdAt: row.created_at.toISOString(),
    items,
  };
}

export const ordersRouter = Router();

ordersRouter.post("/", async (request, response) => {
  const input = createOrderInputSchema.safeParse(request.body);

  if (!input.success) {
    response.status(400).json({
      error: "Invalid order",
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

    let partyStatus: PartyStatus | null = null;

    if (input.data.partyId !== null) {
      const party = await client.query<{
        status: PartyStatus;
      }>(
        `
          SELECT status
          FROM parties
          WHERE id = $1
          FOR UPDATE
        `,
        [input.data.partyId],
      );

      partyStatus = party.rows[0]?.status ?? null;

      if (partyStatus === null) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Party not found",
        });
        return;
      }

      if (
        partyStatus === "completed" ||
        partyStatus === "cancelled"
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Orders cannot be added to a finished party",
        });
        return;
      }

      if (
        input.data.fulfillmentType === "dine_in" &&
        partyStatus !== "seated" &&
        partyStatus !== "in_service"
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A dine-in party must be seated first",
        });
        return;
      }
    }

    const requestedMenuIds = Array.from(
      new Set(
        input.data.items.flatMap((item) => [
          item.menuItemId,
          ...item.modifierItemIds,
        ]),
      ),
    );

    const menuResult = await client.query<MenuRow>(
      `
        SELECT
          id,
          parent_item_id,
          name,
          price,
          status,
          is_modifier
        FROM menu_items
        WHERE id = ANY($1::uuid[])
        FOR SHARE
      `,
      [requestedMenuIds],
    );

    const menuById = new Map(
      menuResult.rows.map((item) => [item.id, item]),
    );

    for (const requestedItem of input.data.items) {
      const menuItem = menuById.get(requestedItem.menuItemId);

      if (
        !menuItem ||
        menuItem.is_modifier ||
        menuItem.status !== "available"
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "One or more menu items are unavailable",
        });
        return;
      }

      for (const modifierId of requestedItem.modifierItemIds) {
        const modifier = menuById.get(modifierId);

        if (
          !modifier ||
          !modifier.is_modifier ||
          modifier.status !== "available" ||
          modifier.parent_item_id !== menuItem.id
        ) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error:
              "One or more modifiers are unavailable for the selected item",
          });
          return;
        }
      }
    }

    const orderResult = await client.query<OrderRow>(
      `
        INSERT INTO orders (
          party_id,
          fulfillment_type,
          created_by_staff_id,
          customer_name,
          customer_phone,
          requested_for,
          delivery_address
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          party_id,
          fulfillment_type,
          created_by_staff_id,
          customer_name,
          customer_phone,
          requested_for,
          delivery_address,
          submitted_at,
          cancelled_at,
          cancelled_by_staff_id,
          cancellation_reason,
          created_at
      `,
      [
        input.data.partyId,
        input.data.fulfillmentType,
        staffId.data,
        input.data.customerName,
        input.data.customerPhone,
        input.data.requestedFor,
        input.data.deliveryAddress,
      ],
    );

    const orderRow = orderResult.rows[0];

    if (!orderRow) {
      throw new Error("Order insert returned no record");
    }

    await client.query(
      `
        INSERT INTO order_events (
          order_id,
          event_type,
          actor_kind,
          actor_staff_id
        )
        VALUES ($1, 'submitted', 'staff', $2)
      `,
      [orderRow.id, staffId.data],
    );

    const orderItems: OrderItem[] = [];

    for (const requestedItem of input.data.items) {
      const menuItem = menuById.get(requestedItem.menuItemId);

      if (!menuItem) {
        throw new Error("Validated menu item disappeared");
      }

      const itemResult = await client.query<OrderItemRow>(
        `
          INSERT INTO order_items (
            order_id,
            menu_item_id,
            created_by_staff_id,
            seat_number,
            item_name,
            unit_price,
            quantity,
            kitchen_note
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING
            id,
            menu_item_id,
            seat_number,
            item_name,
            unit_price,
            quantity,
            kitchen_note,
            status,
            submitted_at,
            fired_at,
            ready_at,
            fulfilled_at,
            voided_at,
            voided_by_staff_id,
            void_reason
        `,
        [
          orderRow.id,
          menuItem.id,
          staffId.data,
          requestedItem.seatNumber,
          menuItem.name,
          menuItem.price,
          requestedItem.quantity,
          requestedItem.kitchenNote,
        ],
      );

      const itemRow = itemResult.rows[0];

      if (!itemRow) {
        throw new Error("Order item insert returned no record");
      }

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_staff_id
          )
          VALUES ($1, 'submitted', 'staff', $2)
        `,
        [itemRow.id, staffId.data],
      );

      const modifiers: OrderItemModifier[] = [];

      for (const modifierId of requestedItem.modifierItemIds) {
        const modifier = menuById.get(modifierId);

        if (!modifier) {
          throw new Error("Validated modifier disappeared");
        }

        const modifierResult =
          await client.query<ModifierRow>(
            `
              INSERT INTO order_item_modifiers (
                order_item_id,
                menu_item_id,
                modifier_name,
                price_adjustment
              )
              VALUES ($1, $2, $3, $4)
              RETURNING
                id,
                menu_item_id,
                modifier_name,
                price_adjustment
            `,
            [
              itemRow.id,
              modifier.id,
              modifier.name,
              modifier.price,
            ],
          );

        const modifierRow = modifierResult.rows[0];

        if (!modifierRow) {
          throw new Error(
            "Order item modifier insert returned no record",
          );
        }

        modifiers.push(toModifier(modifierRow));
      }

      orderItems.push(toOrderItem(itemRow, modifiers));
    }

    if (
      input.data.fulfillmentType === "dine_in" &&
      input.data.partyId !== null &&
      partyStatus === "seated"
    ) {
      await client.query(
        `
          UPDATE parties
          SET
            status = 'in_service',
            status_changed_at = now()
          WHERE id = $1
        `,
        [input.data.partyId],
      );

      await client.query(
        `
          INSERT INTO party_events (
            party_id,
            event_type,
            actor_staff_id
          )
          VALUES ($1, 'service_started', $2)
        `,
        [input.data.partyId, staffId.data],
      );
    }

    await client.query("COMMIT");

    response.status(201).json(
      toOrder(orderRow, orderItems),
    );
  } catch (error: unknown) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

ordersRouter.post(
  "/:orderId/fire",
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);

    const input = fireOrderInputSchema.safeParse(request.body);

    const staffId = staffIdSchema.safeParse(
      request.header("x-staff-id"),
    );

    if (!orderId.success) {
      response.status(400).json({
        error: "Invalid order ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid kitchen fire",
        issues: input.error.issues,
      });
      return;
    }

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

      const order = await client.query<{
        id: string;
        cancelled_at: Date | null;
      }>(
        `
          SELECT id, cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      const orderRow = order.rows[0];

      if (!orderRow) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (orderRow.cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A cancelled order cannot be fired",
        });
        return;
      }

      const selectedItems = await client.query<{
        id: string;
        status: OrderItem["status"];
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        selectedItems.rowCount !==
        input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error:
            "One or more order items do not belong to this order",
        });
        return;
      }

      if (
        selectedItems.rows.some(
          (item) => item.status !== "submitted",
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only submitted items can be fired",
        });
        return;
      }

      const chitResult = await client.query<{
        id: string;
        chit_number: string;
        order_id: string;
        print_kind: "initial";
        printed_by_staff_id: string;
        note: string | null;
        printed_at: Date;
        cancelled_at: Date | null;
      }>(
        `
          INSERT INTO kitchen_chits (
            order_id,
            print_kind,
            printed_by_staff_id,
            note
          )
          VALUES ($1, 'initial', $2, $3)
          RETURNING
            id,
            chit_number,
            order_id,
            print_kind,
            printed_by_staff_id,
            note,
            printed_at,
            cancelled_at
        `,
        [orderId.data, staffId.data, input.data.note],
      );

      const chitRow = chitResult.rows[0];

      if (!chitRow) {
        throw new Error("Kitchen chit insert returned no record");
      }

      await client.query(
        `
          INSERT INTO kitchen_chit_items (
            kitchen_chit_id,
            order_id,
            order_item_id,
            display_order
          )
          SELECT
            $1,
            $2,
            selected.order_item_id,
            (selected.position - 1)::integer
          FROM unnest($3::uuid[]) WITH ORDINALITY
            AS selected(order_item_id, position)
        `,
        [
          chitRow.id,
          orderId.data,
          input.data.orderItemIds,
        ],
      );

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'fired',
            fired_at = now()
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
        `,
        [orderId.data, input.data.orderItemIds],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_staff_id
          )
          SELECT
            selected.order_item_id,
            'fired',
            'staff',
            $2
          FROM unnest($1::uuid[])
            AS selected(order_item_id)
        `,
        [input.data.orderItemIds, staffId.data],
      );

      await client.query(
        `
          INSERT INTO kitchen_chit_events (
            kitchen_chit_id,
            event_type,
            actor_staff_id
          )
          VALUES ($1, 'printed', $2)
        `,
        [chitRow.id, staffId.data],
      );

      await client.query("COMMIT");

      const chit: KitchenChit = {
        id: chitRow.id,
        chitNumber: Number(chitRow.chit_number),
        orderId: chitRow.order_id,
        printKind: chitRow.print_kind,
        printedByStaffId: chitRow.printed_by_staff_id,
        note: chitRow.note,
        printedAt: chitRow.printed_at.toISOString(),
        cancelledAt:
          chitRow.cancelled_at?.toISOString() ?? null,
        items: input.data.orderItemIds.map(
          (orderItemId, displayOrder) => ({
            orderItemId,
            displayOrder,
          }),
        ),
      };

      response.status(201).json(chit);
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/ready",
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);

    const input =
      markKitchenItemsReadyInputSchema.safeParse(request.body);

    const staffId = staffIdSchema.safeParse(
      request.header("x-staff-id"),
    );

    if (!orderId.success) {
      response.status(400).json({
        error: "Invalid order ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid ready action",
        issues: input.error.issues,
      });
      return;
    }

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

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      const currentOrder = order.rows[0];

      if (!currentOrder) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (currentOrder.cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A cancelled order cannot be marked ready",
        });
        return;
      }

      const selectedItems = await client.query<{
        id: string;
        status: OrderItem["status"];
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        selectedItems.rowCount !==
        input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error:
            "One or more order items do not belong to this order",
        });
        return;
      }

      if (
        selectedItems.rows.some(
          (item) => item.status !== "fired",
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only fired items can be marked ready",
        });
        return;
      }

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'ready',
            ready_at = now()
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
        `,
        [orderId.data, input.data.orderItemIds],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_staff_id
          )
          SELECT
            selected.order_item_id,
            'ready',
            'staff',
            $2
          FROM unnest($1::uuid[])
            AS selected(order_item_id)
        `,
        [input.data.orderItemIds, staffId.data],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/deliver",
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);

    const input =
      deliverOrderItemsInputSchema.safeParse(request.body);

    const staffId = staffIdSchema.safeParse(
      request.header("x-staff-id"),
    );

    if (!orderId.success) {
      response.status(400).json({
        error: "Invalid order ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid delivery action",
        issues: input.error.issues,
      });
      return;
    }

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

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      const currentOrder = order.rows[0];

      if (!currentOrder) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (currentOrder.cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A cancelled order cannot be delivered",
        });
        return;
      }

      const selectedItems = await client.query<{
        id: string;
        status: OrderItem["status"];
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        selectedItems.rowCount !==
        input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error:
            "One or more order items do not belong to this order",
        });
        return;
      }

      if (
        selectedItems.rows.some(
          (item) => item.status !== "ready",
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only ready items can be delivered",
        });
        return;
      }

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'fulfilled',
            fulfilled_at = now()
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
        `,
        [orderId.data, input.data.orderItemIds],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_staff_id
          )
          SELECT
            selected.order_item_id,
            'fulfilled',
            'staff',
            $2
          FROM unnest($1::uuid[])
            AS selected(order_item_id)
        `,
        [input.data.orderItemIds, staffId.data],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/cancel",
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);
    const input = cancelOrderInputSchema.safeParse(
      request.body,
    );
    const staffId = staffIdSchema.safeParse(
      request.header("x-staff-id"),
    );

    if (!orderId.success) {
      response.status(400).json({ error: "Invalid order ID" });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid cancellation",
        issues: input.error.issues,
      });
      return;
    }

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

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      if (!order.rows[0]) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (order.rows[0].cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Order is already cancelled",
        });
        return;
      }

      const checkedItems = await client.query<{ id: string }>(
        `
          SELECT check_items.id
          FROM check_items
          JOIN order_items
            ON order_items.id = check_items.order_item_id
          WHERE order_items.order_id = $1
          LIMIT 1
        `,
        [orderId.data],
      );

      if (checkedItems.rows[0]) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error:
            "An order cannot be cancelled after items are checked",
        });
        return;
      }

      const voidedItems = await client.query<{ id: string }>(
        `
          UPDATE order_items
          SET
            status = 'voided',
            voided_at = now(),
            voided_by_staff_id = $2,
            void_reason = $3
          WHERE order_id = $1
            AND status <> 'voided'
          RETURNING id
        `,
        [orderId.data, staffId.data, input.data.reason],
      );

      if (voidedItems.rows.length > 0) {
        await client.query(
          `
            INSERT INTO order_item_events (
              order_item_id,
              event_type,
              actor_kind,
              actor_staff_id,
              reason
            )
            SELECT
              unnest($1::uuid[]),
              'voided',
              'staff',
              $2,
              $3
          `,
          [
            voidedItems.rows.map((item) => item.id),
            staffId.data,
            input.data.reason,
          ],
        );
      }

      await client.query(
        `
          UPDATE orders
          SET
            cancelled_at = now(),
            cancelled_by_staff_id = $2,
            cancellation_reason = $3
          WHERE id = $1
        `,
        [orderId.data, staffId.data, input.data.reason],
      );

      await client.query(
        `
          INSERT INTO order_events (
            order_id,
            event_type,
            actor_kind,
            actor_staff_id,
            reason
          )
          VALUES ($1, 'cancelled', 'staff', $2, $3)
        `,
        [orderId.data, staffId.data, input.data.reason],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/void",
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);
    const input = voidOrderItemsInputSchema.safeParse(
      request.body,
    );
    const staffId = staffIdSchema.safeParse(
      request.header("x-staff-id"),
    );

    if (!orderId.success) {
      response.status(400).json({ error: "Invalid order ID" });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid item void",
        issues: input.error.issues,
      });
      return;
    }

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

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      if (!order.rows[0]) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (order.rows[0].cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Items cannot be voided on a cancelled order",
        });
        return;
      }

      const items = await client.query<{
        id: string;
        status: string;
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        items.rows.length !== input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error:
            "One or more order items were not found on this order",
        });
        return;
      }

      if (
        items.rows.some((item) => item.status === "voided")
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "An order item is already voided",
        });
        return;
      }

      const checkedItems = await client.query<{ id: string }>(
        `
          SELECT id
          FROM check_items
          WHERE order_item_id = ANY($1::uuid[])
          LIMIT 1
        `,
        [input.data.orderItemIds],
      );

      if (checkedItems.rows[0]) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error:
            "An item cannot be voided after it is placed on a check",
        });
        return;
      }

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'voided',
            voided_at = now(),
            voided_by_staff_id = $2,
            void_reason = $3
          WHERE id = ANY($1::uuid[])
        `,
        [
          input.data.orderItemIds,
          staffId.data,
          input.data.reason,
        ],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_staff_id,
            reason
          )
          SELECT
            unnest($1::uuid[]),
            'voided',
            'staff',
            $2,
            $3
        `,
        [
          input.data.orderItemIds,
          staffId.data,
          input.data.reason,
        ],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);
