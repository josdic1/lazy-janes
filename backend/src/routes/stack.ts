import {
  type StackCheck,
  type StackOrder,
  type StackOrderItem,
  type StackParty,
  type StackPartyEvent,
  type StackSnapshot,
  type StackTable,
} from "@lazy-janes/shared";
import { Router } from "express";
import {
  getAuthenticatedUser,
  requireAuthenticatedUser,
} from "../auth/session.js";
import { pool } from "../db/pool.js";

type PartyRow = {
  id: string;
  name: string | null;
  guest_count: number;
  status: StackParty["status"];
  arrived_at: Date;
  status_changed_at: Date;
};

type TableRow = {
  party_id: string;
  id: string;
  label: string;
};

type OrderRow = {
  id: string;
  party_id: string | null;
  fulfillment_type: StackOrder["fulfillmentType"];
  customer_name: string | null;
  customer_phone: string | null;
  delivery_address: string | null;
  requested_for: Date | null;
  submitted_at: Date;
  cancelled_at: Date | null;
};

type OrderItemRow = {
  order_id: string;
  id: string;
  item_name: string;
  seat_number: number | null;
  quantity: number;
  status: StackOrderItem["status"];
  kitchen_note: string | null;
  allocated_quantity: string;
};

type KitchenDetailRow = {
  order_item_id: string;
  detail: string;
  sort_order: number;
};

type CheckRow = {
  party_id: string | null;
  id: string;
  label: string;
  status: StackCheck["status"];
  total_amount: string;
  paid_amount: string;
};

type CheckOrderRow = {
  check_id: string;
  order_id: string;
};

type EventRow = {
  party_id: string;
  id: string;
  event_type: StackPartyEvent["eventType"];
  actor_user_id: string | null;
  reason: string | null;
  occurred_at: Date;
};

function addToGroup<T>(
  groups: Map<string, T[]>,
  key: string,
  value: T,
): void {
  const current = groups.get(key) ?? [];
  current.push(value);
  groups.set(key, current);
}

function money(amount: number): number {
  return Math.round(amount * 100) / 100;
}

function toStackOrder(
  row: OrderRow,
  itemsByOrder: Map<string, StackOrderItem[]>,
): StackOrder {
  return {
    id: row.id,
    fulfillmentType: row.fulfillment_type,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    requestedFor: row.requested_for?.toISOString() ?? null,
    submittedAt: row.submitted_at.toISOString(),
    cancelledAt: row.cancelled_at?.toISOString() ?? null,
    items: itemsByOrder.get(row.id) ?? [],
  };
}

function toStackCheck(
  row: CheckRow,
  orderIdsByCheck: Map<string, string[]>,
): StackCheck {
  const totalAmount = Number(row.total_amount);
  const paidAmount = Number(row.paid_amount);

  return {
    id: row.id,
    label: row.label,
    status: row.status,
    totalAmount,
    paidAmount,
    balanceAmount: money(Math.max(0, totalAmount - paidAmount)),
    orderIds: orderIdsByCheck.get(row.id) ?? [],
  };
}

export const stackRouter = Router();

stackRouter.use(requireAuthenticatedUser);

stackRouter.get("/", async (request, response) => {
  const userId = getAuthenticatedUser(request).id;

  const client = await pool.connect();

  try {
    await client.query(
      "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY",
    );

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

    const dayStartExpression = `
      date_trunc(
        'day',
        now() AT TIME ZONE 'America/New_York'
      ) AT TIME ZONE 'America/New_York'
    `;

    const parties = await client.query<PartyRow>(
      `
        SELECT
          id,
          name,
          guest_count,
          status,
          arrived_at,
          status_changed_at
        FROM parties
        WHERE status NOT IN ('completed', 'cancelled')
          OR arrived_at >= (${dayStartExpression})
        ORDER BY arrived_at, id
      `,
    );

    const partyIds = parties.rows.map((party) => party.id);

    const tables =
      partyIds.length === 0
        ? { rows: [] as TableRow[] }
        : await client.query<TableRow>(
            `
              SELECT DISTINCT
                seatings.party_id,
                dining_tables.id,
                dining_tables.label
              FROM seatings
              JOIN seating_tables
                ON seating_tables.seating_id = seatings.id
              JOIN dining_tables
                ON dining_tables.id =
                  seating_tables.dining_table_id
              WHERE seatings.party_id = ANY($1::uuid[])
              ORDER BY seatings.party_id, dining_tables.label
            `,
            [partyIds],
          );

    const partyOrders =
      partyIds.length === 0
        ? { rows: [] as OrderRow[] }
        : await client.query<OrderRow>(
            `
              SELECT
                id,
                party_id,
                fulfillment_type,
                customer_name,
                customer_phone,
                delivery_address,
                requested_for,
                submitted_at,
                cancelled_at
              FROM orders
              WHERE party_id = ANY($1::uuid[])
              ORDER BY submitted_at, id
            `,
            [partyIds],
          );

    const standaloneOrders = await client.query<OrderRow>(
      `
        SELECT
          id,
          party_id,
          fulfillment_type,
          customer_name,
          customer_phone,
          delivery_address,
          requested_for,
          submitted_at,
          cancelled_at
        FROM orders
        WHERE party_id IS NULL
          AND (
            submitted_at >= (${dayStartExpression})
            OR EXISTS (
              SELECT 1
              FROM order_items
              WHERE order_items.order_id = orders.id
                AND order_items.status NOT IN ('fulfilled', 'voided')
            )
          )
        ORDER BY submitted_at, id
      `,
    );

    const allOrders = [
      ...partyOrders.rows,
      ...standaloneOrders.rows,
    ];
    const orderIds = allOrders.map((order) => order.id);

    const orderItems =
      orderIds.length === 0
        ? { rows: [] as OrderItemRow[] }
        : await client.query<OrderItemRow>(
            `
              SELECT
                order_items.order_id,
                order_items.id,
                order_items.item_name,
                order_items.seat_number,
                order_items.quantity,
                order_items.status,
                order_items.kitchen_note,
                COALESCE(
                  (
                    SELECT SUM(check_items.allocated_quantity)
                    FROM check_items
                    WHERE check_items.order_item_id = order_items.id
                  ),
                  0
                )::text AS allocated_quantity
              FROM order_items
              WHERE order_items.order_id = ANY($1::uuid[])
              ORDER BY order_items.submitted_at, order_items.id
            `,
            [orderIds],
          );

    const kitchenDetails =
      orderIds.length === 0
        ? { rows: [] as KitchenDetailRow[] }
        : await client.query<KitchenDetailRow>(
            `
              SELECT order_item_id, detail, sort_order
              FROM (
                SELECT
                  change.order_item_id,
                  CASE change.change_kind
                    WHEN 'remove' THEN 'NO ' || change.ingredient_name
                    WHEN 'side' THEN change.ingredient_name || ' ON SIDE'
                    WHEN 'extra' THEN 'EXTRA ' || change.ingredient_name
                    WHEN 'add' THEN 'ADD ' || change.ingredient_name
                  END AS detail,
                  10 AS sort_order,
                  change.created_at,
                  change.id
                FROM order_item_ingredient_changes AS change
                JOIN order_items ON order_items.id = change.order_item_id
                WHERE order_items.order_id = ANY($1::uuid[])

                UNION ALL

                SELECT
                  replacement.order_item_id,
                  'SUB ' || replacement.source_ingredient_name ||
                    ' → ' || replacement.replacement_ingredient_name AS detail,
                  20 AS sort_order,
                  replacement.created_at,
                  replacement.id
                FROM order_item_ingredient_replacements AS replacement
                JOIN order_items ON order_items.id = replacement.order_item_id
                WHERE order_items.order_id = ANY($1::uuid[])

                UNION ALL

                SELECT
                  choice.order_item_id,
                  choice.group_label || ': ' || choice.option_label AS detail,
                  30 AS sort_order,
                  choice.created_at,
                  choice.id
                FROM order_item_choice_selections AS choice
                JOIN order_items ON order_items.id = choice.order_item_id
                WHERE order_items.order_id = ANY($1::uuid[])

                UNION ALL

                SELECT
                  prep.order_item_id,
                  prep.target_label || ': ' || prep.option_label AS detail,
                  40 AS sort_order,
                  prep.created_at,
                  prep.id
                FROM order_item_preparation_selections AS prep
                JOIN order_items ON order_items.id = prep.order_item_id
                WHERE order_items.order_id = ANY($1::uuid[])

                UNION ALL

                SELECT
                  modifier.order_item_id,
                  modifier.modifier_name AS detail,
                  50 AS sort_order,
                  modifier.created_at,
                  modifier.id
                FROM order_item_modifiers AS modifier
                JOIN order_items ON order_items.id = modifier.order_item_id
                WHERE order_items.order_id = ANY($1::uuid[])
              ) AS detail_rows
              ORDER BY order_item_id, sort_order, created_at, id
            `,
            [orderIds],
          );

    const partyChecks =
      partyIds.length === 0
        ? { rows: [] as CheckRow[] }
        : await client.query<CheckRow>(
            `
              SELECT
                checks.party_id,
                checks.id,
                checks.label,
                checks.status,
                checks.total_amount,
                COALESCE(
                  SUM(allocations.allocated_amount)
                    FILTER (
                      WHERE payments.status = 'succeeded'
                    ),
                  0
                )::text AS paid_amount
              FROM checks
              LEFT JOIN payment_check_allocations AS allocations
                ON allocations.check_id = checks.id
              LEFT JOIN payments
                ON payments.id = allocations.payment_id
              WHERE checks.party_id = ANY($1::uuid[])
              GROUP BY checks.id
              ORDER BY checks.created_at, checks.id
            `,
            [partyIds],
          );

    const standaloneChecks = await client.query<CheckRow>(
      `
        SELECT
          checks.party_id,
          checks.id,
          checks.label,
          checks.status,
          checks.total_amount,
          COALESCE(
            SUM(allocations.allocated_amount)
              FILTER (
                WHERE payments.status = 'succeeded'
              ),
            0
          )::text AS paid_amount
        FROM checks
        LEFT JOIN payment_check_allocations AS allocations
          ON allocations.check_id = checks.id
        LEFT JOIN payments
          ON payments.id = allocations.payment_id
        WHERE checks.party_id IS NULL
          AND (
            checks.status <> 'closed'
            OR checks.created_at >= (${dayStartExpression})
          )
        GROUP BY checks.id
        ORDER BY checks.created_at, checks.id
      `,
    );

    const allChecks = [
      ...partyChecks.rows,
      ...standaloneChecks.rows,
    ];
    const checkIds = allChecks.map((check) => check.id);

    const checkOrders =
      checkIds.length === 0
        ? { rows: [] as CheckOrderRow[] }
        : await client.query<CheckOrderRow>(
            `
              SELECT DISTINCT
                check_items.check_id,
                order_items.order_id
              FROM check_items
              JOIN order_items
                ON order_items.id = check_items.order_item_id
              WHERE check_items.check_id = ANY($1::uuid[])
              ORDER BY check_items.check_id, order_items.order_id
            `,
            [checkIds],
          );

    const events =
      partyIds.length === 0
        ? { rows: [] as EventRow[] }
        : await client.query<EventRow>(
            `
              SELECT
                party_id,
                id::text,
                event_type,
                actor_user_id,
                reason,
                occurred_at
              FROM party_events
              WHERE party_id = ANY($1::uuid[])
              ORDER BY occurred_at, id
            `,
            [partyIds],
          );

    const tablesByParty = new Map<string, StackTable[]>();
    const kitchenDetailsByItem = new Map<string, string[]>();
    const itemsByOrder = new Map<string, StackOrderItem[]>();
    const ordersByParty = new Map<string, StackOrder[]>();
    const checksByParty = new Map<string, StackCheck[]>();
    const eventsByParty = new Map<string, StackPartyEvent[]>();
    const orderIdsByCheck = new Map<string, string[]>();

    for (const table of tables.rows) {
      addToGroup(tablesByParty, table.party_id, {
        id: table.id,
        label: table.label,
      });
    }

    for (const detail of kitchenDetails.rows) {
      addToGroup(
        kitchenDetailsByItem,
        detail.order_item_id,
        detail.detail,
      );
    }

    for (const item of orderItems.rows) {
      const allocatedQuantity = Number(item.allocated_quantity);
      addToGroup(itemsByOrder, item.order_id, {
        id: item.id,
        itemName: item.item_name,
        seatNumber: item.seat_number,
        quantity: item.quantity,
        status: item.status,
        kitchenNote: item.kitchen_note,
        kitchenDetails: kitchenDetailsByItem.get(item.id) ?? [],
        allocatedQuantity,
        remainingQuantity: Math.max(
          0,
          item.quantity - allocatedQuantity,
        ),
      });
    }

    for (const checkOrder of checkOrders.rows) {
      addToGroup(
        orderIdsByCheck,
        checkOrder.check_id,
        checkOrder.order_id,
      );
    }

    for (const order of partyOrders.rows) {
      if (order.party_id === null) continue;
      addToGroup(
        ordersByParty,
        order.party_id,
        toStackOrder(order, itemsByOrder),
      );
    }

    for (const check of partyChecks.rows) {
      if (check.party_id === null) continue;
      addToGroup(
        checksByParty,
        check.party_id,
        toStackCheck(check, orderIdsByCheck),
      );
    }

    for (const event of events.rows) {
      addToGroup(eventsByParty, event.party_id, {
        id: event.id,
        eventType: event.event_type,
        actorUserId: event.actor_user_id,
        reason: event.reason,
        occurredAt: event.occurred_at.toISOString(),
      });
    }

    const snapshot: StackSnapshot = {
      generatedAt: new Date().toISOString(),
      parties: parties.rows.map((party) => ({
        id: party.id,
        name: party.name,
        guestCount: party.guest_count,
        status: party.status,
        arrivedAt: party.arrived_at.toISOString(),
        statusChangedAt:
          party.status_changed_at.toISOString(),
        tables: tablesByParty.get(party.id) ?? [],
        orders: ordersByParty.get(party.id) ?? [],
        checks: checksByParty.get(party.id) ?? [],
        events: eventsByParty.get(party.id) ?? [],
      })),
      standaloneOrders: standaloneOrders.rows.map((order) =>
        toStackOrder(order, itemsByOrder),
      ),
      standaloneChecks: standaloneChecks.rows.map((check) =>
        toStackCheck(check, orderIdsByCheck),
      ),
    };

    await client.query("COMMIT");
    response.json(snapshot);
  } catch (error: unknown) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});
