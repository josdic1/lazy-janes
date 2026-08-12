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
import { z } from "zod";
import { pool } from "../db/pool.js";

type PartyRow = {
  id: string;
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
  party_id: string;
  fulfillment_type: StackOrder["fulfillmentType"];
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
};

type CheckRow = {
  party_id: string;
  id: string;
  label: string;
  status: StackCheck["status"];
  total_amount: string;
  paid_amount: string;
};

type EventRow = {
  party_id: string;
  id: string;
  event_type: StackPartyEvent["eventType"];
  actor_user_id: string | null;
  reason: string | null;
  occurred_at: Date;
};

const userIdSchema = z.string().uuid();

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

export const stackRouter = Router();

stackRouter.get("/", async (request, response) => {
  const userId = userIdSchema.safeParse(
    request.header("x-user-id"),
  );

  if (!userId.success) {
    response.status(401).json({
      error: "A valid user identity is required",
    });
    return;
  }

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
      [userId.data],
    );

    if (!user.rows[0]) {
      await client.query("ROLLBACK");
      response.status(403).json({
        error: "Active user not found",
      });
      return;
    }

    const parties = await client.query<PartyRow>(
      `
        SELECT
          id,
          guest_count,
          status,
          arrived_at,
          status_changed_at
        FROM parties
        WHERE status NOT IN ('completed', 'cancelled')
          OR arrived_at >= (
            date_trunc(
              'day',
              now() AT TIME ZONE 'America/New_York'
            ) AT TIME ZONE 'America/New_York'
          )
        ORDER BY arrived_at, id
      `,
    );

    const partyIds = parties.rows.map((party) => party.id);

    if (partyIds.length === 0) {
      await client.query("COMMIT");

      const snapshot: StackSnapshot = {
        generatedAt: new Date().toISOString(),
        parties: [],
      };

      response.json(snapshot);
      return;
    }

    const tables = await client.query<TableRow>(
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

    const orders = await client.query<OrderRow>(
      `
        SELECT
          id,
          party_id,
          fulfillment_type,
          submitted_at,
          cancelled_at
        FROM orders
        WHERE party_id = ANY($1::uuid[])
        ORDER BY submitted_at, id
      `,
      [partyIds],
    );

    const orderIds = orders.rows.map((order) => order.id);

    const orderItems =
      orderIds.length === 0
        ? { rows: [] as OrderItemRow[] }
        : await client.query<OrderItemRow>(
            `
              SELECT
                order_id,
                id,
                item_name,
                seat_number,
                quantity,
                status
              FROM order_items
              WHERE order_id = ANY($1::uuid[])
              ORDER BY submitted_at, id
            `,
            [orderIds],
          );

    const checks = await client.query<CheckRow>(
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

    const events = await client.query<EventRow>(
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
    const itemsByOrder = new Map<
      string,
      StackOrderItem[]
    >();
    const ordersByParty = new Map<string, StackOrder[]>();
    const checksByParty = new Map<string, StackCheck[]>();
    const eventsByParty = new Map<
      string,
      StackPartyEvent[]
    >();

    for (const table of tables.rows) {
      addToGroup(tablesByParty, table.party_id, {
        id: table.id,
        label: table.label,
      });
    }

    for (const item of orderItems.rows) {
      addToGroup(itemsByOrder, item.order_id, {
        id: item.id,
        itemName: item.item_name,
        seatNumber: item.seat_number,
        quantity: item.quantity,
        status: item.status,
      });
    }

    for (const order of orders.rows) {
      addToGroup(ordersByParty, order.party_id, {
        id: order.id,
        fulfillmentType: order.fulfillment_type,
        submittedAt: order.submitted_at.toISOString(),
        cancelledAt:
          order.cancelled_at?.toISOString() ?? null,
        items: itemsByOrder.get(order.id) ?? [],
      });
    }

    for (const check of checks.rows) {
      const totalAmount = Number(check.total_amount);
      const paidAmount = Number(check.paid_amount);

      addToGroup(checksByParty, check.party_id, {
        id: check.id,
        label: check.label,
        status: check.status,
        totalAmount,
        paidAmount,
        balanceAmount: money(
          Math.max(0, totalAmount - paidAmount),
        ),
      });
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
