import {
  createCheckInputSchema,
  type Check,
  type CheckItem,
  type CheckPriceRequirement,
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



checksRouter.get(
  "/audit",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const input = z
      .object({
        start: z.string().datetime(),
        end: z.string().datetime(),
      })
      .safeParse(request.query);

    if (!input.success) {
      response.status(400).json({ error: "Invalid audit range" });
      return;
    }

    const start = new Date(input.data.start);
    const end = new Date(input.data.end);

    if (
      end.getTime() <= start.getTime() ||
      end.getTime() - start.getTime() > 370 * 24 * 60 * 60 * 1000
    ) {
      response.status(400).json({ error: "Invalid audit range" });
      return;
    }

    type AuditRow = {
      id: string;
      entity_type: "party" | "order" | "order_item" | "check" | "payment";
      entity_id: string;
      entity_label: string;
      event_type: string;
      actor_name: string | null;
      actor_kind: string;
      reason: string | null;
      occurred_at: Date;
    };

    const result = await pool.query<AuditRow>(
      `
        SELECT *
        FROM (
          SELECT
            'party:' || event.id::text AS id,
            'party'::text AS entity_type,
            event.party_id AS entity_id,
            COALESCE(
              NULLIF(parties.name, ''),
              'Party of ' || parties.guest_count::text
            ) AS entity_label,
            event.event_type,
            users.display_name AS actor_name,
            CASE WHEN event.actor_user_id IS NULL THEN 'system' ELSE 'user' END AS actor_kind,
            event.reason,
            event.occurred_at
          FROM party_events event
          JOIN parties ON parties.id = event.party_id
          LEFT JOIN users ON users.id = event.actor_user_id
          WHERE event.occurred_at >= $1
            AND event.occurred_at < $2

          UNION ALL

          SELECT
            'order:' || event.id::text,
            'order'::text,
            event.order_id,
            COALESCE(
              NULLIF(parties.name, ''),
              NULLIF(orders.customer_name, ''),
              initcap(replace(orders.fulfillment_type::text, '_', ' ')) || ' order'
            ),
            event.event_type,
            users.display_name,
            event.actor_kind::text,
            event.reason,
            event.occurred_at
          FROM order_events event
          JOIN orders ON orders.id = event.order_id
          LEFT JOIN parties ON parties.id = orders.party_id
          LEFT JOIN users ON users.id = event.actor_user_id
          WHERE event.occurred_at >= $1
            AND event.occurred_at < $2

          UNION ALL

          SELECT
            'order_item:' || event.id::text,
            'order_item'::text,
            event.order_item_id,
            order_items.item_name,
            event.event_type,
            users.display_name,
            event.actor_kind::text,
            event.reason,
            event.occurred_at
          FROM order_item_events event
          JOIN order_items ON order_items.id = event.order_item_id
          LEFT JOIN users ON users.id = event.actor_user_id
          WHERE event.occurred_at >= $1
            AND event.occurred_at < $2

          UNION ALL

          SELECT
            'check:' || event.id::text,
            'check'::text,
            event.check_id,
            checks.label,
            event.event_type,
            users.display_name,
            event.actor_kind::text,
            NULL::text,
            event.occurred_at
          FROM check_events event
          JOIN checks ON checks.id = event.check_id
          LEFT JOIN users ON users.id = event.actor_user_id
          WHERE event.occurred_at >= $1
            AND event.occurred_at < $2

          UNION ALL

          SELECT
            'payment:' || event.id::text,
            'payment'::text,
            event.payment_id,
            initcap(payments.method::text) || ' ' ||
              to_char(payments.payment_amount, 'FM$999999990.00'),
            event.event_type,
            users.display_name,
            event.actor_kind::text,
            NULL::text,
            event.occurred_at
          FROM payment_events event
          JOIN payments ON payments.id = event.payment_id
          LEFT JOIN users ON users.id = event.actor_user_id
          WHERE event.occurred_at >= $1
            AND event.occurred_at < $2
        ) audit
        ORDER BY occurred_at DESC, id DESC
        LIMIT 1500
      `,
      [start, end],
    );

    response.json(
      result.rows.map((row) => ({
        id: row.id,
        entityType: row.entity_type,
        entityId: row.entity_id,
        entityLabel: row.entity_label,
        eventType: row.event_type,
        actorName: row.actor_name,
        actorKind: row.actor_kind,
        reason: row.reason,
        occurredAt: row.occurred_at.toISOString(),
      })),
    );
  },
);

checksRouter.get(
  "/reporting",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const input = z
      .object({
        start: z.string().datetime(),
        end: z.string().datetime(),
        timezone: z.string().trim().min(1).max(100).default("UTC"),
      })
      .safeParse(request.query);

    if (!input.success) {
      response.status(400).json({ error: "Invalid reporting range" });
      return;
    }

    const start = new Date(input.data.start);
    const end = new Date(input.data.end);

    if (
      end.getTime() <= start.getTime() ||
      end.getTime() - start.getTime() > 370 * 24 * 60 * 60 * 1000
    ) {
      response.status(400).json({ error: "Invalid reporting range" });
      return;
    }

    const timezoneResult = await pool.query<{ valid: boolean }>(
      `
        SELECT EXISTS (
          SELECT 1
          FROM pg_timezone_names
          WHERE name = $1
        ) AS valid
      `,
      [input.data.timezone],
    );

    const timezone = timezoneResult.rows[0]?.valid
      ? input.data.timezone
      : "UTC";

    type ReportingCheckRow = {
      id: string;
      party_id: string | null;
      party_name: string | null;
      guest_count: number | null;
      table_labels: string[];
      fulfillment_types: Array<"dine_in" | "takeout" | "delivery">;
      label: string;
      status: Check["status"];
      opened_by_name: string;
      subtotal_amount: string;
      tax_amount: string;
      total_amount: string;
      paid_amount: string;
      created_at: Date;
      presented_at: Date | null;
      closed_at: Date | null;
      total_rows: number;
    };

    const checksResult = await pool.query<ReportingCheckRow>(
      `
        SELECT
          checks.id,
          checks.party_id,
          parties.name AS party_name,
          parties.guest_count,
          COALESCE(
            (
              SELECT array_agg(
                DISTINCT dining_tables.label
                ORDER BY dining_tables.label
              )
              FROM seatings
              JOIN seating_tables
                ON seating_tables.seating_id = seatings.id
              JOIN dining_tables
                ON dining_tables.id = seating_tables.dining_table_id
              WHERE seatings.party_id = checks.party_id
            ),
            ARRAY[]::text[]
          ) AS table_labels,
          COALESCE(
            (
              SELECT array_agg(
                DISTINCT orders.fulfillment_type
                ORDER BY orders.fulfillment_type
              )
              FROM check_items
              JOIN order_items
                ON order_items.id = check_items.order_item_id
              JOIN orders
                ON orders.id = order_items.order_id
              WHERE check_items.check_id = checks.id
            ),
            ARRAY[]::text[]
          ) AS fulfillment_types,
          checks.label,
          checks.status,
          users.display_name AS opened_by_name,
          checks.subtotal_amount::text,
          checks.tax_amount::text,
          checks.total_amount::text,
          COALESCE(
            (
              SELECT SUM(payment_check_allocations.allocated_amount)
              FROM payment_check_allocations
              JOIN payments
                ON payments.id = payment_check_allocations.payment_id
              WHERE payment_check_allocations.check_id = checks.id
                AND payments.status = 'succeeded'
            ),
            0
          )::text AS paid_amount,
          checks.created_at,
          checks.presented_at,
          checks.closed_at,
          COUNT(*) OVER()::int AS total_rows
        FROM checks
        LEFT JOIN parties
          ON parties.id = checks.party_id
        JOIN users
          ON users.id = checks.opened_by_user_id
        WHERE COALESCE(
          checks.closed_at,
          checks.presented_at,
          checks.created_at
        ) >= $1
          AND COALESCE(
            checks.closed_at,
            checks.presented_at,
            checks.created_at
          ) < $2
        ORDER BY COALESCE(
          checks.closed_at,
          checks.presented_at,
          checks.created_at
        ) DESC, checks.id DESC
        LIMIT 500
      `,
      [start, end],
    );

    const checkIds = checksResult.rows.map((check) => check.id);
    const partyIds = Array.from(
      new Set(
        checksResult.rows
          .map((check) => check.party_id)
          .filter((partyId): partyId is string => partyId !== null),
      ),
    );

    type ReportingItemRow = {
      check_id: string;
      id: string;
      order_item_id: string;
      order_id: string;
      item_name: string;
      allocated_quantity: string;
      allocated_amount: string;
      seat_number: number | null;
      fulfillment_type: "dine_in" | "takeout" | "delivery";
    };

    type ReportingPaymentRow = {
      check_id: string;
      id: string;
      method: "cash" | "card";
      tip_amount: string;
      allocated_amount: string;
      succeeded_at: Date;
    };

    type ReportingPartyEventRow = {
      party_id: string;
      id: string;
      event_type:
        | "arrived"
        | "waiting_started"
        | "seated"
        | "unseated"
        | "service_started"
        | "completed"
        | "cancelled";
      actor_name: string | null;
      reason: string | null;
      occurred_at: Date;
    };

    const itemsPromise =
      checkIds.length > 0
        ? pool.query<ReportingItemRow>(
            `
              SELECT
                check_items.check_id,
                check_items.id,
                check_items.order_item_id,
                order_items.order_id,
                check_items.item_name,
                check_items.allocated_quantity::text,
                check_items.allocated_amount::text,
                order_items.seat_number,
                orders.fulfillment_type
              FROM check_items
              JOIN order_items
                ON order_items.id = check_items.order_item_id
              JOIN orders
                ON orders.id = order_items.order_id
              WHERE check_items.check_id = ANY($1::uuid[])
              ORDER BY check_items.created_at, check_items.id
            `,
            [checkIds],
          )
        : Promise.resolve({ rows: [] as ReportingItemRow[] });

    const paymentsPromise =
      checkIds.length > 0
        ? pool.query<ReportingPaymentRow>(
            `
              SELECT
                payment_check_allocations.check_id,
                payments.id,
                payments.method,
                payments.tip_amount::text,
                payment_check_allocations.allocated_amount::text,
                payments.succeeded_at
              FROM payment_check_allocations
              JOIN payments
                ON payments.id = payment_check_allocations.payment_id
              WHERE payment_check_allocations.check_id = ANY($1::uuid[])
                AND payments.status = 'succeeded'
              ORDER BY payments.succeeded_at, payments.id
            `,
            [checkIds],
          )
        : Promise.resolve({ rows: [] as ReportingPaymentRow[] });

    const eventsPromise =
      partyIds.length > 0
        ? pool.query<ReportingPartyEventRow>(
            `
              SELECT
                party_events.party_id,
                party_events.id::text,
                party_events.event_type,
                users.display_name AS actor_name,
                party_events.reason,
                party_events.occurred_at
              FROM party_events
              LEFT JOIN users
                ON users.id = party_events.actor_user_id
              WHERE party_events.party_id = ANY($1::uuid[])
              ORDER BY party_events.occurred_at, party_events.id
            `,
            [partyIds],
          )
        : Promise.resolve({ rows: [] as ReportingPartyEventRow[] });

    const [itemsResult, paymentsResult, eventsResult] = await Promise.all([
      itemsPromise,
      paymentsPromise,
      eventsPromise,
    ]);

    const itemsByCheck = new Map<string, ReportingItemRow[]>();
    for (const item of itemsResult.rows) {
      const current = itemsByCheck.get(item.check_id) ?? [];
      current.push(item);
      itemsByCheck.set(item.check_id, current);
    }

    const paymentsByCheck = new Map<string, ReportingPaymentRow[]>();
    for (const payment of paymentsResult.rows) {
      const current = paymentsByCheck.get(payment.check_id) ?? [];
      current.push(payment);
      paymentsByCheck.set(payment.check_id, current);
    }

    const eventsByParty = new Map<string, ReportingPartyEventRow[]>();
    for (const event of eventsResult.rows) {
      const current = eventsByParty.get(event.party_id) ?? [];
      current.push(event);
      eventsByParty.set(event.party_id, current);
    }

    const trendFormat =
      end.getTime() - start.getTime() <= 2 * 24 * 60 * 60 * 1000
        ? "YYYY-MM-DD HH24"
        : "YYYY-MM-DD";

    const [
      salesResult,
      coversResult,
      ordersResult,
      voidedResult,
      manualPricesResult,
      tipsResult,
      paymentMixResult,
      serviceMixResult,
      trendResult,
      topItemsResult,
    ] = await Promise.all([
      pool.query<{
        sales: string;
        tax: string;
        closed_checks: number;
      }>(
        `
          SELECT
            COALESCE(SUM(subtotal_amount), 0)::text AS sales,
            COALESCE(SUM(tax_amount), 0)::text AS tax,
            COUNT(*)::int AS closed_checks
          FROM checks
          WHERE status = 'closed'
            AND closed_at >= $1
            AND closed_at < $2
        `,
        [start, end],
      ),
      pool.query<{ covers: number }>(
        `
          SELECT COALESCE(SUM(guest_count), 0)::int AS covers
          FROM parties
          WHERE status = 'completed'
            AND completed_at >= $1
            AND completed_at < $2
        `,
        [start, end],
      ),
      pool.query<{
        orders: number;
        cancelled_orders: number;
      }>(
        `
          SELECT
            COUNT(*)::int AS orders,
            COUNT(*) FILTER (
              WHERE cancelled_at IS NOT NULL
            )::int AS cancelled_orders
          FROM orders
          WHERE submitted_at >= $1
            AND submitted_at < $2
        `,
        [start, end],
      ),
      pool.query<{ voided_items: number }>(
        `
          SELECT COUNT(*)::int AS voided_items
          FROM order_items
          WHERE voided_at >= $1
            AND voided_at < $2
        `,
        [start, end],
      ),
      pool.query<{ manual_prices: number }>(
        `
          SELECT COALESCE(
            SUM(
              jsonb_array_length(
                CASE
                  WHEN jsonb_typeof(check_events.details -> 'priceOverrides') = 'array'
                    THEN check_events.details -> 'priceOverrides'
                  ELSE '[]'::jsonb
                END
              )
            ),
            0
          )::int AS manual_prices
          FROM check_events
          JOIN checks
            ON checks.id = check_events.check_id
          WHERE check_events.event_type = 'created'
            AND checks.created_at >= $1
            AND checks.created_at < $2
        `,
        [start, end],
      ),
      pool.query<{ tips: string }>(
        `
          SELECT COALESCE(SUM(tip_amount), 0)::text AS tips
          FROM payments
          WHERE status = 'succeeded'
            AND succeeded_at >= $1
            AND succeeded_at < $2
        `,
        [start, end],
      ),
      pool.query<{
        method: "cash" | "card";
        amount: string;
        count: number;
      }>(
        `
          SELECT
            method,
            COALESCE(SUM(payment_amount), 0)::text AS amount,
            COUNT(*)::int AS count
          FROM payments
          WHERE status = 'succeeded'
            AND succeeded_at >= $1
            AND succeeded_at < $2
          GROUP BY method
          ORDER BY method
        `,
        [start, end],
      ),
      pool.query<{
        fulfillment_type: "dine_in" | "takeout" | "delivery";
        count: number;
      }>(
        `
          SELECT
            fulfillment_type,
            COUNT(*)::int AS count
          FROM orders
          WHERE submitted_at >= $1
            AND submitted_at < $2
            AND cancelled_at IS NULL
          GROUP BY fulfillment_type
          ORDER BY fulfillment_type
        `,
        [start, end],
      ),
      pool.query<{
        bucket: string;
        sales: string;
        checks: number;
      }>(
        `
          SELECT
            to_char(
              closed_at AT TIME ZONE $3,
              $4
            ) AS bucket,
            COALESCE(SUM(subtotal_amount), 0)::text AS sales,
            COUNT(*)::int AS checks
          FROM checks
          WHERE status = 'closed'
            AND closed_at >= $1
            AND closed_at < $2
          GROUP BY 1
          ORDER BY 1
        `,
        [start, end, timezone, trendFormat],
      ),
      pool.query<{
        name: string;
        quantity: string;
        sales: string;
      }>(
        `
          SELECT
            check_items.item_name AS name,
            COALESCE(SUM(check_items.allocated_quantity), 0)::text AS quantity,
            COALESCE(SUM(check_items.allocated_amount), 0)::text AS sales
          FROM check_items
          JOIN checks
            ON checks.id = check_items.check_id
          WHERE checks.status = 'closed'
            AND checks.closed_at >= $1
            AND checks.closed_at < $2
          GROUP BY check_items.item_name
          ORDER BY SUM(check_items.allocated_quantity) DESC,
                   SUM(check_items.allocated_amount) DESC,
                   check_items.item_name
          LIMIT 8
        `,
        [start, end],
      ),
    ]);


    const durationsResult = await pool.query<{
      average_wait_minutes: string;
      average_table_minutes: string;
      average_service_minutes: string;
      average_kitchen_minutes: string;
      average_check_minutes: string;
    }>(
      `
        WITH party_stage AS (
          SELECT
            parties.id,
            parties.arrived_at,
            parties.completed_at,
            (
              SELECT MIN(event.occurred_at)
              FROM party_events event
              WHERE event.party_id = parties.id
                AND event.event_type = 'seated'
            ) AS seated_at,
            (
              SELECT MIN(event.occurred_at)
              FROM party_events event
              WHERE event.party_id = parties.id
                AND event.event_type = 'service_started'
            ) AS service_started_at
          FROM parties
          WHERE parties.arrived_at >= $1
            AND parties.arrived_at < $2
        ),
        kitchen_stage AS (
          SELECT fired_at, ready_at
          FROM order_items
          WHERE submitted_at >= $1
            AND submitted_at < $2
        ),
        check_stage AS (
          SELECT presented_at, closed_at
          FROM checks
          WHERE created_at >= $1
            AND created_at < $2
        )
        SELECT
          COALESCE(
            (
              SELECT AVG(EXTRACT(EPOCH FROM (seated_at - arrived_at)) / 60.0)
              FROM party_stage
              WHERE seated_at IS NOT NULL
                AND seated_at >= arrived_at
            ),
            0
          )::text AS average_wait_minutes,
          COALESCE(
            (
              SELECT AVG(EXTRACT(EPOCH FROM (completed_at - seated_at)) / 60.0)
              FROM party_stage
              WHERE seated_at IS NOT NULL
                AND completed_at IS NOT NULL
                AND completed_at >= seated_at
            ),
            0
          )::text AS average_table_minutes,
          COALESCE(
            (
              SELECT AVG(EXTRACT(EPOCH FROM (completed_at - service_started_at)) / 60.0)
              FROM party_stage
              WHERE service_started_at IS NOT NULL
                AND completed_at IS NOT NULL
                AND completed_at >= service_started_at
            ),
            0
          )::text AS average_service_minutes,
          COALESCE(
            (
              SELECT AVG(EXTRACT(EPOCH FROM (ready_at - fired_at)) / 60.0)
              FROM kitchen_stage
              WHERE fired_at IS NOT NULL
                AND ready_at IS NOT NULL
                AND ready_at >= fired_at
            ),
            0
          )::text AS average_kitchen_minutes,
          COALESCE(
            (
              SELECT AVG(EXTRACT(EPOCH FROM (closed_at - presented_at)) / 60.0)
              FROM check_stage
              WHERE presented_at IS NOT NULL
                AND closed_at IS NOT NULL
                AND closed_at >= presented_at
            ),
            0
          )::text AS average_check_minutes
      `,
      [start, end],
    );

    const sales = Number(salesResult.rows[0]?.sales ?? 0);
    const tax = Number(salesResult.rows[0]?.tax ?? 0);
    const closedChecks = salesResult.rows[0]?.closed_checks ?? 0;
    const covers = coversResult.rows[0]?.covers ?? 0;

    response.json({
      generatedAt: new Date().toISOString(),
      rangeStart: start.toISOString(),
      rangeEnd: end.toISOString(),
      timezone,
      metrics: {
        sales,
        tax,
        tips: Number(tipsResult.rows[0]?.tips ?? 0),
        closedChecks,
        covers,
        averageCheck: closedChecks > 0 ? sales / closedChecks : 0,
        averageCover: covers > 0 ? sales / covers : 0,
        orders: ordersResult.rows[0]?.orders ?? 0,
        voidedItems: voidedResult.rows[0]?.voided_items ?? 0,
        cancelledOrders: ordersResult.rows[0]?.cancelled_orders ?? 0,
        manualPrices: manualPricesResult.rows[0]?.manual_prices ?? 0,
        averageWaitMinutes: Number(
          durationsResult.rows[0]?.average_wait_minutes ?? 0,
        ),
        averageTableMinutes: Number(
          durationsResult.rows[0]?.average_table_minutes ?? 0,
        ),
        averageServiceMinutes: Number(
          durationsResult.rows[0]?.average_service_minutes ?? 0,
        ),
        averageKitchenMinutes: Number(
          durationsResult.rows[0]?.average_kitchen_minutes ?? 0,
        ),
        averageCheckMinutes: Number(
          durationsResult.rows[0]?.average_check_minutes ?? 0,
        ),
      },
      trend: trendResult.rows.map((point) => ({
        bucket: point.bucket,
        sales: Number(point.sales),
        checks: point.checks,
      })),
      topItems: topItemsResult.rows.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity),
        sales: Number(item.sales),
      })),
      paymentMix: paymentMixResult.rows.map((payment) => ({
        method: payment.method,
        amount: Number(payment.amount),
        count: payment.count,
      })),
      serviceMix: serviceMixResult.rows.map((service) => ({
        fulfillmentType: service.fulfillment_type,
        count: service.count,
      })),
      checks: checksResult.rows.map((check) => {
        const paidAmount = Number(check.paid_amount);

        return {
          id: check.id,
          partyId: check.party_id,
          partyName: check.party_name,
          guestCount: check.guest_count,
          tableLabels: check.table_labels,
          fulfillmentTypes: check.fulfillment_types,
          label: check.label,
          status: check.status,
          openedByName: check.opened_by_name,
          subtotalAmount: Number(check.subtotal_amount),
          taxAmount: Number(check.tax_amount),
          totalAmount: Number(check.total_amount),
          paidAmount,
          balanceAmount: Math.max(
            0,
            Number(check.total_amount) - paidAmount,
          ),
          createdAt: check.created_at.toISOString(),
          presentedAt: check.presented_at?.toISOString() ?? null,
          closedAt: check.closed_at?.toISOString() ?? null,
          items: (itemsByCheck.get(check.id) ?? []).map((item) => ({
            id: item.id,
            orderItemId: item.order_item_id,
            orderId: item.order_id,
            itemName: item.item_name,
            allocatedQuantity: Number(item.allocated_quantity),
            allocatedAmount: Number(item.allocated_amount),
            seatNumber: item.seat_number,
            fulfillmentType: item.fulfillment_type,
          })),
          payments: (paymentsByCheck.get(check.id) ?? []).map(
            (payment) => ({
              id: payment.id,
              method: payment.method,
              allocatedAmount: Number(payment.allocated_amount),
              tipAmount: Number(payment.tip_amount),
              succeededAt: payment.succeeded_at.toISOString(),
            }),
          ),
          partyEvents:
            check.party_id === null
              ? []
              : (eventsByParty.get(check.party_id) ?? []).map((event) => ({
                  id: event.id,
                  eventType: event.event_type,
                  actorName: event.actor_name,
                  reason: event.reason,
                  occurredAt: event.occurred_at.toISOString(),
                })),
        };
      }),
      reportingTotal: checksResult.rows[0]?.total_rows ?? 0,
    });
  },
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
  const priceOverrides = input.data.priceOverrides ?? [];

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

    await client.query(
      `
        UPDATE order_item_ingredient_replacements replacement_record
        SET
          price_adjustment = configured.price_adjustment,
          price_configured = true
        FROM order_items order_item,
             menu_item_ingredient_replacements configured
        WHERE replacement_record.order_item_id = order_item.id
          AND configured.menu_item_id = order_item.menu_item_id
          AND configured.source_ingredient_id = replacement_record.source_ingredient_id
          AND configured.replacement_ingredient_id = replacement_record.replacement_ingredient_id
          AND replacement_record.order_item_id = ANY($1::uuid[])
          AND replacement_record.price_configured = false
          AND configured.price_adjustment_configured = true
      `,
      [requestedItemIds],
    );

    const unresolvedPrices = await client.query<{
      source: "ingredient_change" | "ingredient_replacement";
      record_id: string;
      order_item_id: string;
      change_kind: "extra" | "add" | "replace";
      item_name: string;
      ingredient_name: string;
    }>(
      `
        SELECT
          source,
          record_id,
          order_item_id,
          change_kind,
          item_name,
          ingredient_name
        FROM (
          SELECT
            'ingredient_change'::text AS source,
            change_record.id AS record_id,
            change_record.order_item_id,
            change_record.change_kind,
            order_item.item_name,
            change_record.ingredient_name
          FROM order_item_ingredient_changes change_record
          JOIN order_items order_item
            ON order_item.id = change_record.order_item_id
          WHERE change_record.order_item_id = ANY($1::uuid[])
            AND change_record.change_kind IN ('extra', 'add')
            AND change_record.price_configured = false

          UNION ALL

          SELECT
            'ingredient_replacement'::text AS source,
            replacement_record.id AS record_id,
            replacement_record.order_item_id,
            'replace'::text AS change_kind,
            order_item.item_name,
            replacement_record.replacement_ingredient_name AS ingredient_name
          FROM order_item_ingredient_replacements replacement_record
          JOIN order_items order_item
            ON order_item.id = replacement_record.order_item_id
          WHERE replacement_record.order_item_id = ANY($1::uuid[])
            AND replacement_record.price_configured = false
        ) unresolved
        ORDER BY order_item_id, change_kind, ingredient_name, record_id
      `,
      [requestedItemIds],
    );

    const pricingRequired: CheckPriceRequirement[] =
      unresolvedPrices.rows.map((change) => ({
        source: change.source,
        recordId: change.record_id,
        orderItemId: change.order_item_id,
        changeKind: change.change_kind,
        label: `${change.item_name} · ${change.change_kind.toUpperCase()} ${change.ingredient_name}`,
      }));

    if (pricingRequired.length > 0) {
      const requiredKeys = new Set(
        pricingRequired.map(
          (requirement) => `${requirement.source}:${requirement.recordId}`,
        ),
      );

      const overrideByKey = new Map(
        priceOverrides.map((override) => [
          `${override.source}:${override.recordId}`,
          override,
        ]),
      );

      if (
        priceOverrides.some(
          (override) =>
            !requiredKeys.has(`${override.source}:${override.recordId}`),
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Pricing changed. Review the current prices and try again.",
          pricingRequired,
        });
        return;
      }

      if (
        pricingRequired.some(
          (requirement) =>
            !overrideByKey.has(`${requirement.source}:${requirement.recordId}`),
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: `Price required before check: ${pricingRequired
            .map((requirement) => requirement.label)
            .join(", ")}`,
          pricingRequired,
        });
        return;
      }

      for (const requirement of pricingRequired) {
        const override = overrideByKey.get(
          `${requirement.source}:${requirement.recordId}`,
        );

        if (!override) {
          throw new Error("Missing validated price override");
        }

        const updated =
          requirement.source === "ingredient_change"
            ? await client.query(
                `
                  UPDATE order_item_ingredient_changes
                  SET
                    price_adjustment = $1,
                    price_configured = true
                  WHERE id = $2
                    AND order_item_id = $3
                    AND price_configured = false
                `,
                [
                  override.amount,
                  requirement.recordId,
                  requirement.orderItemId,
                ],
              )
            : await client.query(
                `
                  UPDATE order_item_ingredient_replacements
                  SET
                    price_adjustment = $1,
                    price_configured = true
                  WHERE id = $2
                    AND order_item_id = $3
                    AND price_configured = false
                `,
                [
                  override.amount,
                  requirement.recordId,
                  requirement.orderItemId,
                ],
              );

        if (updated.rowCount !== 1) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error:
              "Pricing changed while the check was being created. Try again.",
          });
          return;
        }
      }
    } else if (priceOverrides.length > 0) {
      await client.query("ROLLBACK");
      response.status(409).json({
        error:
          "Those price entries are no longer required. Create the check again.",
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
            FROM order_item_ingredient_replacements
            WHERE order_item_id = ANY($1::uuid[])

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
            $3::integer,
            'priceOverrides',
            $4::jsonb
          )
        )
      `,
      [
        check.id,
        userId,
        createdItems.length,
        JSON.stringify(
          pricingRequired.map((requirement) => ({
            ...requirement,
            amount:
              priceOverrides.find(
                (override) =>
                  override.source === requirement.source &&
                  override.recordId === requirement.recordId,
              )?.amount ?? null,
          })),
        ),
      ],
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
