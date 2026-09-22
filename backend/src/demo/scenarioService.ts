import type { PoolClient } from "pg";
import { hashUserPin } from "../auth/security.js";
import { restoreRitzFloor } from "./ritzFloor.js";

export const DEMO_PRESETS = [
  "slow-day",
  "mildly-busy-day",
  "very-busy-day",
  "busy-week",
  "busy-month",
] as const;

export type DemoPreset = (typeof DEMO_PRESETS)[number];

type PresetDefinition = {
  label: string;
  days: number;
  averageCompletedSales: number;
  activeParties: number;
  waitingParties: number;
  activeStandaloneOrders: number;
};

const PRESET_DEFINITIONS: Record<DemoPreset, PresetDefinition> = {
  "slow-day": {
    label: "Slow Day",
    days: 1,
    averageCompletedSales: 10,
    activeParties: 2,
    waitingParties: 1,
    activeStandaloneOrders: 1,
  },
  "mildly-busy-day": {
    label: "Mildly Busy Day",
    days: 1,
    averageCompletedSales: 28,
    activeParties: 6,
    waitingParties: 2,
    activeStandaloneOrders: 2,
  },
  "very-busy-day": {
    label: "Very Busy Day",
    days: 1,
    averageCompletedSales: 58,
    activeParties: 12,
    waitingParties: 5,
    activeStandaloneOrders: 4,
  },
  "busy-week": {
    label: "Busy Week",
    days: 7,
    averageCompletedSales: 42,
    activeParties: 10,
    waitingParties: 4,
    activeStandaloneOrders: 3,
  },
  "busy-month": {
    label: "Busy Month",
    days: 30,
    averageCompletedSales: 34,
    activeParties: 10,
    waitingParties: 4,
    activeStandaloneOrders: 3,
  },
};

type MenuItem = {
  id: string;
  name: string;
  price: string;
};

type DemoUsers = {
  host: string;
  server: string;
  kitchen: string;
  manager: string;
};

type DemoRunRow = {
  id: string;
  preset: DemoPreset;
  anchor_date: string | Date;
  range_start: string | Date;
  range_end: string | Date;
  created_at: Date;
  cleared_at: Date | null;
  summary: Record<string, unknown>;
};

export type DemoRunStatus = {
  id: string;
  preset: DemoPreset;
  label: string;
  anchorDate: string;
  rangeStart: string;
  rangeEnd: string;
  createdAt: string;
  clearedAt: string | null;
  summary: Record<string, unknown>;
};

const DEMO_PIN = "1111";
const SALES_TAX_RATE = 0.06625;
const SCENARIO_LOCK = "lazy_janes_demo_scenario";
const PARTY_NAMES = [
  "Adams", "Baker", "Chen", "Davis", "Evans", "Garcia", "Harris",
  "Jackson", "Kim", "Lee", "Martin", "Miller", "Nguyen", "Ortiz",
  "Patel", "Rivera", "Robinson", "Smith", "Thompson", "Wilson",
];
const CUSTOMER_NAMES = [
  "Alex", "Avery", "Cameron", "Casey", "Jamie", "Jordan", "Morgan", "Riley",
];

function dateOnly(value: Date | string): string {
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export function parseAnchorDate(value: unknown): string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw Object.assign(new Error("Anchor date must use YYYY-MM-DD"), { statusCode: 400 });
  }
  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || dateOnly(parsed) !== value) {
    throw Object.assign(new Error("Anchor date is invalid"), { statusCode: 400 });
  }
  return value;
}

function addDays(value: string, amount: number): string {
  const date = new Date(`${value}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return dateOnly(date);
}

function todayDate(): string {
  return dateOnly(new Date());
}

function atTime(date: string, localHour: number, minute = 0): Date {
  // Noon UTC is 8am in New Jersey during daylight time. Keeping generated
  // service between noon and 22:00 UTC also avoids date-boundary drift.
  const result = new Date(`${date}T12:00:00.000Z`);
  result.setUTCHours(12 + localHour - 8, minute, 0, 0);
  return result;
}

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRandom(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function choose<T>(values: readonly T[], random: () => number): T {
  return values[Math.floor(random() * values.length)]!;
}

function formatRun(row: DemoRunRow): DemoRunStatus {
  return {
    id: row.id,
    preset: row.preset,
    label: PRESET_DEFINITIONS[row.preset].label,
    anchorDate: dateOnly(row.anchor_date),
    rangeStart: dateOnly(row.range_start),
    rangeEnd: dateOnly(row.range_end),
    createdAt: row.created_at.toISOString(),
    clearedAt: row.cleared_at?.toISOString() ?? null,
    summary: row.summary ?? {},
  };
}

export function isDemoPreset(value: string): value is DemoPreset {
  return (DEMO_PRESETS as readonly string[]).includes(value);
}

export async function getActiveDemoRun(client: PoolClient): Promise<DemoRunStatus | null> {
  const result = await client.query<DemoRunRow>(`
    SELECT id, preset, anchor_date, range_start, range_end, created_at, cleared_at, summary
    FROM demo_scenario_runs
    WHERE cleared_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `);
  return result.rows[0] ? formatRun(result.rows[0]) : null;
}

async function ensureFloor(client: PoolClient): Promise<void> {
  const counts = await client.query<{ sections: number; tables: number }>(`
    SELECT
      (SELECT count(*)::int FROM sections) AS sections,
      (SELECT count(*)::int FROM dining_tables) AS tables
  `);
  const row = counts.rows[0]!;
  if (row.sections === 0 && row.tables === 0) {
    await restoreRitzFloor(client);
    return;
  }
  if (row.tables === 0) {
    throw Object.assign(
      new Error("Demo data needs at least one configured dining table"),
      { statusCode: 409 },
    );
  }
}

async function ensureDemoUser(
  client: PoolClient,
  displayName: string,
  roles: string[],
): Promise<string> {
  const loginKey = displayName.replace(/\s+/g, "").toLowerCase();
  const existing = await client.query<{ id: string; is_demo: boolean }>(
    `
      SELECT id, is_demo
      FROM users
      WHERE replace(lower(display_name), ' ', '') = $1
      LIMIT 1
    `,
    [loginKey],
  );
  let userId = existing.rows[0]?.id;
  if (userId && !existing.rows[0]?.is_demo) {
    throw Object.assign(
      new Error(`Cannot replace genuine user identity ${displayName}`),
      { statusCode: 409 },
    );
  }
  if (!userId) {
    const created = await client.query<{ id: string }>(
      `
        INSERT INTO users (display_name, is_active, is_demo)
        VALUES ($1, true, true)
        RETURNING id
      `,
      [displayName],
    );
    userId = created.rows[0]?.id;
  }
  if (!userId) throw new Error(`Unable to create ${displayName}`);

  await client.query(`UPDATE users SET is_active = true WHERE id = $1`, [userId]);
  await client.query(`DELETE FROM user_roles WHERE user_id = $1`, [userId]);
  for (const role of roles) {
    await client.query(
      `INSERT INTO user_roles (user_id, role_code) VALUES ($1, $2)`,
      [userId, role],
    );
  }
  const pinHash = await hashUserPin(DEMO_PIN);
  await client.query(
    `
      INSERT INTO user_credentials (user_id, pin_hash)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET
        pin_hash = EXCLUDED.pin_hash,
        failed_attempt_count = 0,
        locked_until = NULL,
        pin_changed_at = now(),
        updated_at = now()
    `,
    [userId, pinHash],
  );
  return userId;
}

async function ensureDemoUsers(client: PoolClient): Promise<DemoUsers> {
  return {
    host: await ensureDemoUser(client, "Demo Mia Host", ["host"]),
    server: await ensureDemoUser(client, "Demo Josh Server", ["server"]),
    kitchen: await ensureDemoUser(client, "Demo Rosa Kitchen", ["chef"]),
    manager: await ensureDemoUser(client, "Demo Casey Manager", ["manager"]),
  };
}

async function loadMenu(client: PoolClient): Promise<MenuItem[]> {
  const result = await client.query<MenuItem>(`
    SELECT id, name, price::text
    FROM menu_items
    WHERE status = 'available'
      AND is_modifier = false
      AND price_configured = true
      AND price > 0
    ORDER BY category_id, sort_order, name, id
  `);
  if (result.rows.length < 8) {
    throw Object.assign(new Error("Demo data needs at least eight sellable menu items"), {
      statusCode: 409,
    });
  }
  return result.rows;
}

async function loadTables(client: PoolClient): Promise<string[]> {
  const result = await client.query<{ id: string }>(`
    SELECT id
    FROM dining_tables
    WHERE is_active = true
    ORDER BY section_id, label, id
  `);
  return result.rows.map((row) => row.id);
}

async function loadFreeTables(client: PoolClient): Promise<string[]> {
  const result = await client.query<{ id: string }>(`
    SELECT table_record.id
    FROM dining_tables table_record
    WHERE table_record.is_active = true
      AND NOT EXISTS (
        SELECT 1
        FROM seating_tables assignment
        WHERE assignment.dining_table_id = table_record.id
          AND assignment.released_at IS NULL
      )
    ORDER BY table_record.section_id, table_record.label, table_record.id
  `);
  return result.rows.map((row) => row.id);
}

async function createDrawer(
  client: PoolClient,
  runId: string,
  date: string,
  managerId: string,
  shouldBeOpen: boolean,
): Promise<string> {
  let open = shouldBeOpen;
  if (open) {
    const existing = await client.query(`
      SELECT 1 FROM drawer_sessions WHERE closed_at IS NULL LIMIT 1
    `);
    open = existing.rowCount === 0;
  }
  const openedAt = open
    ? new Date(Date.now() - 6 * 60 * 60_000)
    : atTime(date, 7, 0);
  const closedAt = open ? null : atTime(date, 18, 0);
  const drawer = await client.query<{ id: string }>(
    `
      INSERT INTO drawer_sessions (
        opened_by_user_id, opening_cash_amount, opened_at,
        closed_by_user_id, expected_cash_amount, counted_cash_amount,
        variance_amount, closed_at, demo_scenario_run_id
      ) VALUES (
        $1, 250, $2,
        $3, $4, $4, 0, $5, $6
      )
      RETURNING id
    `,
    [managerId, openedAt, open ? null : managerId, open ? null : 250, closedAt, runId],
  );
  const drawerId = drawer.rows[0]?.id;
  if (!drawerId) throw new Error("Unable to create demo drawer");

  const openingCount = await client.query<{ id: string }>(
    `
      INSERT INTO cash_counts (
        drawer_session_id, count_kind, counted_amount, counted_by_user_id, note, counted_at
      ) VALUES ($1, 'opening', 250, $2, 'Generated demo opening count', $3)
      RETURNING id
    `,
    [drawerId, managerId, openedAt],
  );
  await client.query(
    `
      INSERT INTO drawer_events (
        drawer_session_id, event_type, amount, cash_count_id, actor_user_id, occurred_at
      ) VALUES
        ($1, 'opened', 250, NULL, $2, $3),
        ($1, 'counted', 250, $4, $2, $3)
    `,
    [drawerId, managerId, openedAt, openingCount.rows[0]!.id],
  );
  if (closedAt) {
    const closingCount = await client.query<{ id: string }>(
      `
        INSERT INTO cash_counts (
          drawer_session_id, count_kind, counted_amount, counted_by_user_id, note, counted_at
        ) VALUES ($1, 'closing', 250, $2, 'Generated demo closing count', $3)
        RETURNING id
      `,
      [drawerId, managerId, closedAt],
    );
    await client.query(
      `
        INSERT INTO drawer_events (
          drawer_session_id, event_type, amount, cash_count_id, actor_user_id, occurred_at
        ) VALUES
          ($1, 'counted', 250, $2, $3, $4),
          ($1, 'closed', 0, NULL, $3, $4)
      `,
      [drawerId, closingCount.rows[0]!.id, managerId, closedAt],
    );
  }
  return drawerId;
}

async function createPartyRoot(
  client: PoolClient,
  runId: string,
  name: string,
  guestCount: number,
  status: "waiting" | "seated" | "in_service" | "completed",
  arrivedAt: Date,
  actorId: string,
  completedAt: Date | null,
): Promise<string> {
  const result = await client.query<{ id: string }>(
    `
      INSERT INTO parties (
        name, guest_count, status, created_by_user_id, arrived_at,
        status_changed_at, completed_at, demo_scenario_run_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `,
    [name, guestCount, status, actorId, arrivedAt, completedAt ?? arrivedAt, completedAt, runId],
  );
  const partyId = result.rows[0]?.id;
  if (!partyId) throw new Error("Unable to create demo party");
  return partyId;
}

async function createPartyEvents(
  client: PoolClient,
  partyId: string,
  actorId: string,
  arrivedAt: Date,
  seatedAt: Date | null,
  serviceAt: Date | null,
  completedAt: Date | null,
) {
  await client.query(
    `INSERT INTO party_events (party_id, event_type, actor_user_id, occurred_at)
     VALUES ($1, 'arrived', $2, $3), ($1, 'waiting_started', $2, $3)`,
    [partyId, actorId, arrivedAt],
  );
  if (seatedAt) {
    await client.query(
      `INSERT INTO party_events (party_id, event_type, actor_user_id, occurred_at)
       VALUES ($1, 'seated', $2, $3)`,
      [partyId, actorId, seatedAt],
    );
  }
  if (serviceAt) {
    await client.query(
      `INSERT INTO party_events (party_id, event_type, actor_user_id, occurred_at)
       VALUES ($1, 'service_started', $2, $3)`,
      [partyId, actorId, serviceAt],
    );
  }
  if (completedAt) {
    await client.query(
      `INSERT INTO party_events (party_id, event_type, actor_user_id, occurred_at)
       VALUES ($1, 'completed', $2, $3)`,
      [partyId, actorId, completedAt],
    );
  }
}

async function createSeating(
  client: PoolClient,
  partyId: string,
  tableId: string,
  actorId: string,
  seatedAt: Date,
  endedAt: Date | null,
) {
  const seating = await client.query<{ id: string }>(
    `
      INSERT INTO seatings (party_id, seated_by_user_id, seated_at, ended_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    [partyId, actorId, seatedAt, endedAt],
  );
  await client.query(
    `
      INSERT INTO seating_tables (seating_id, dining_table_id, assigned_at, released_at)
      VALUES ($1, $2, $3, $4)
    `,
    [seating.rows[0]!.id, tableId, seatedAt, endedAt],
  );
}

async function createOrder(
  client: PoolClient,
  runId: string,
  partyId: string | null,
  fulfillmentType: "dine_in" | "takeout" | "delivery",
  actorId: string,
  submittedAt: Date,
  menu: MenuItem[],
  itemCount: number,
  status: "submitted" | "fired" | "ready" | "fulfilled",
  random: () => number,
): Promise<{ id: string; itemIds: string[]; subtotal: number }> {
  const customerName = partyId ? null : choose(CUSTOMER_NAMES, random);
  const address = fulfillmentType === "delivery"
    ? `${10 + Math.floor(random() * 190)} Main Street, West Orange, NJ`
    : null;
  const order = await client.query<{ id: string }>(
    `
      INSERT INTO orders (
        party_id, fulfillment_type, created_by_user_id, customer_name,
        delivery_address, submitted_at, created_at, demo_scenario_run_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $6, $7)
      RETURNING id
    `,
    [partyId, fulfillmentType, actorId, customerName, address, submittedAt, runId],
  );
  const orderId = order.rows[0]!.id;
  await client.query(
    `
      INSERT INTO order_events (order_id, event_type, actor_kind, actor_user_id, occurred_at)
      VALUES ($1, 'submitted', 'user', $2, $3)
    `,
    [orderId, actorId, submittedAt],
  );

  const itemIds: string[] = [];
  let subtotal = 0;
  for (let index = 0; index < itemCount; index += 1) {
    const item = choose(menu, random);
    const firedAt = status === "submitted" ? null : new Date(submittedAt.getTime() + 3 * 60_000);
    const readyAt = ["ready", "fulfilled"].includes(status)
      ? new Date(submittedAt.getTime() + 13 * 60_000)
      : null;
    const fulfilledAt = status === "fulfilled"
      ? new Date(submittedAt.getTime() + 18 * 60_000)
      : null;
    const inserted = await client.query<{ id: string }>(
      `
        INSERT INTO order_items (
          order_id, menu_item_id, created_by_user_id, seat_number, item_name,
          unit_price, quantity, kitchen_note, status, submitted_at,
          fired_at, ready_at, fulfilled_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, 1, $7, $8, $9, $10, $11, $12, $9)
        RETURNING id
      `,
      [
        orderId, item.id, actorId, fulfillmentType === "dine_in" ? index + 1 : null,
        item.name, item.price, index === 0 && random() < 0.12 ? "Generated demo note" : null,
        status, submittedAt, firedAt, readyAt, fulfilledAt,
      ],
    );
    const itemId = inserted.rows[0]!.id;
    itemIds.push(itemId);
    subtotal += Number(item.price);
    const events: Array<[string, Date]> = [["submitted", submittedAt]];
    if (firedAt) events.push(["fired", firedAt]);
    if (readyAt) events.push(["ready", readyAt]);
    if (fulfilledAt) events.push(["fulfilled", fulfilledAt]);
    for (const [eventType, occurredAt] of events) {
      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id, event_type, actor_kind, actor_user_id, occurred_at
          ) VALUES ($1, $2, 'user', $3, $4)
        `,
        [itemId, eventType, actorId, occurredAt],
      );
    }
  }
  return { id: orderId, itemIds, subtotal };
}

async function createKitchenChit(
  client: PoolClient,
  runId: string,
  orderId: string,
  itemIds: string[],
  kitchenId: string,
  printedAt: Date,
) {
  const chit = await client.query<{ id: string }>(
    `
      INSERT INTO kitchen_chits (
        order_id, print_kind, printed_by_user_id, printed_at, demo_scenario_run_id
      ) VALUES ($1, 'initial', $2, $3, $4)
      RETURNING id
    `,
    [orderId, kitchenId, printedAt, runId],
  );
  const chitId = chit.rows[0]!.id;
  for (let index = 0; index < itemIds.length; index += 1) {
    await client.query(
      `
        INSERT INTO kitchen_chit_items (
          kitchen_chit_id, order_id, order_item_id, display_order, created_at
        ) VALUES ($1, $2, $3, $4, $5)
      `,
      [chitId, orderId, itemIds[index], index, printedAt],
    );
  }
  await client.query(
    `
      INSERT INTO kitchen_chit_events (
        kitchen_chit_id, event_type, actor_user_id, occurred_at
      ) VALUES ($1, 'printed', $2, $3)
    `,
    [chitId, kitchenId, printedAt],
  );
}

async function createCheck(
  client: PoolClient,
  runId: string,
  partyId: string | null,
  itemIds: string[],
  subtotal: number,
  actorId: string,
  openedAt: Date,
  status: "open" | "presented" | "closed",
): Promise<{ id: string; total: number }> {
  const normalizedSubtotal = Math.round(subtotal * 100) / 100;
  const tax = Math.round(normalizedSubtotal * SALES_TAX_RATE * 100) / 100;
  const total = Math.round((normalizedSubtotal + tax) * 100) / 100;
  const presentedAt = status === "open" ? null : new Date(openedAt.getTime() + 22 * 60_000);
  const closedAt = status === "closed" ? new Date(openedAt.getTime() + 27 * 60_000) : null;
  const check = await client.query<{ id: string }>(
    `
      INSERT INTO checks (
        party_id, label, status, opened_by_user_id, subtotal_amount, tax_amount,
        total_amount, sales_tax_rate, presented_at, closed_at, created_at,
        updated_at, demo_scenario_run_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, COALESCE($10::timestamptz, $11::timestamptz), $12)
      RETURNING id
    `,
    [
      partyId, partyId ? "Generated dine-in check" : "Generated takeout check", status,
      actorId, normalizedSubtotal, tax, total, SALES_TAX_RATE, presentedAt, closedAt,
      openedAt, runId,
    ],
  );
  const checkId = check.rows[0]!.id;
  const allocation = Math.round((normalizedSubtotal / itemIds.length) * 100) / 100;
  let allocated = 0;
  for (let index = 0; index < itemIds.length; index += 1) {
    const amount = index === itemIds.length - 1
      ? Math.round((normalizedSubtotal - allocated) * 100) / 100
      : allocation;
    allocated += amount;
    await client.query(
      `
        INSERT INTO check_items (
          check_id, order_item_id, item_name, allocated_quantity, allocated_amount
        )
        SELECT $1, id, item_name, 1, $3 FROM order_items WHERE id = $2
      `,
      [checkId, itemIds[index], amount],
    );
  }
  await client.query(
    `
      INSERT INTO check_events (
        check_id, event_type, actor_kind, actor_user_id, details, occurred_at
      ) VALUES ($1, 'created', 'user', $2, '{"demo":true}'::jsonb, $3)
    `,
    [checkId, actorId, openedAt],
  );
  if (presentedAt) {
    await client.query(
      `INSERT INTO check_events (check_id, event_type, actor_kind, actor_user_id, occurred_at)
       VALUES ($1, 'presented', 'user', $2, $3)`,
      [checkId, actorId, presentedAt],
    );
  }
  if (closedAt) {
    await client.query(
      `INSERT INTO check_events (check_id, event_type, actor_kind, actor_user_id, occurred_at)
       VALUES ($1, 'closed', 'user', $2, $3)`,
      [checkId, actorId, closedAt],
    );
  }
  return { id: checkId, total };
}

async function createPayment(
  client: PoolClient,
  runId: string,
  checkId: string,
  total: number,
  actorId: string,
  drawerId: string,
  paidAt: Date,
  useCash: boolean,
) {
  const cashReceived = useCash ? Math.ceil(total / 10) * 10 : null;
  const change = cashReceived === null ? null : Math.round((cashReceived - total) * 100) / 100;
  const payment = await client.query<{ id: string }>(
    `
      INSERT INTO payments (
        method, status, payment_amount, tip_amount, received_by_user_id,
        processor_reference, cash_received_amount, change_given_amount,
        succeeded_at, created_at, drawer_session_id, demo_scenario_run_id
      ) VALUES ($1, 'succeeded', $2, 0, $3, $4, $5, $6, $7, $7, $8, $9)
      RETURNING id
    `,
    [
      useCash ? "cash" : "card", total, actorId,
      useCash ? null : `demo-${runId}-${checkId}`, cashReceived, change, paidAt,
      useCash ? drawerId : null, runId,
    ],
  );
  const paymentId = payment.rows[0]!.id;
  await client.query(
    `INSERT INTO payment_check_allocations (payment_id, check_id, allocated_amount, created_at)
     VALUES ($1, $2, $3, $4)`,
    [paymentId, checkId, total, paidAt],
  );
  await client.query(
    `
      INSERT INTO payment_events (
        payment_id, event_type, actor_kind, actor_user_id, occurred_at
      ) VALUES
        ($1, 'created', 'user', $2, $3),
        ($1, 'succeeded', 'user', $2, $3)
    `,
    [paymentId, actorId, paidAt],
  );
  if (useCash) {
    await client.query(
      `
        INSERT INTO drawer_events (
          drawer_session_id, event_type, amount, payment_id, actor_user_id, occurred_at
        ) VALUES ($1, 'cash_payment', $2, $3, $4, $5)
      `,
      [drawerId, total, paymentId, actorId, paidAt],
    );
  }
}

function completedSalesForDay(
  definition: PresetDefinition,
  date: string,
  random: () => number,
): number {
  const weekday = new Date(`${date}T12:00:00.000Z`).getUTCDay();
  const weekendFactor = weekday === 0 ? 1.45 : weekday === 6 ? 1.25 : 1;
  const variation = 0.82 + random() * 0.36;
  return Math.max(4, Math.round(definition.averageCompletedSales * weekendFactor * variation));
}

async function createCompletedSale(
  client: PoolClient,
  runId: string,
  date: string,
  sequence: number,
  users: DemoUsers,
  menu: MenuItem[],
  tables: string[],
  drawerId: string,
  random: () => number,
) {
  const fulfillmentRoll = random();
  const fulfillmentType = fulfillmentRoll < 0.78
    ? "dine_in"
    : fulfillmentRoll < 0.94
      ? "takeout"
      : "delivery";
  const guestCount = 1 + Math.floor(random() * 5);
  const arrivedAt = atTime(date, 8 + Math.floor(random() * 7), Math.floor(random() * 60));
  const seatedAt = new Date(arrivedAt.getTime() + (3 + Math.floor(random() * 12)) * 60_000);
  const submittedAt = new Date(seatedAt.getTime() + (4 + Math.floor(random() * 10)) * 60_000);
  const completedAt = new Date(submittedAt.getTime() + (38 + Math.floor(random() * 35)) * 60_000);
  let partyId: string | null = null;
  if (fulfillmentType === "dine_in") {
    partyId = await createPartyRoot(
      client, runId, `${choose(PARTY_NAMES, random)} ${sequence + 1}`,
      guestCount, "completed", arrivedAt, users.host, completedAt,
    );
    await createPartyEvents(client, partyId, users.host, arrivedAt, seatedAt, submittedAt, completedAt);
    await createSeating(
      client, partyId, tables[sequence % tables.length]!, users.host, seatedAt, completedAt,
    );
  }
  const order = await createOrder(
    client, runId, partyId, fulfillmentType, users.server, submittedAt,
    menu, Math.max(1, Math.min(4, guestCount)), "fulfilled", random,
  );
  await createKitchenChit(
    client, runId, order.id, order.itemIds, users.kitchen,
    new Date(submittedAt.getTime() + 60_000),
  );
  const check = await createCheck(
    client, runId, partyId, order.itemIds, order.subtotal, users.server,
    new Date(submittedAt.getTime() + 18 * 60_000), "closed",
  );
  await createPayment(
    client, runId, check.id, check.total, users.server, drawerId,
    new Date(submittedAt.getTime() + 46 * 60_000), random() < 0.38,
  );
}

async function createActiveSnapshot(
  client: PoolClient,
  runId: string,
  date: string,
  definition: PresetDefinition,
  users: DemoUsers,
  menu: MenuItem[],
  random: () => number,
) {
  const freeTables = await loadFreeTables(client);
  const activeCount = Math.min(definition.activeParties, freeTables.length);
  const waitingCount = definition.waitingParties + (definition.activeParties - activeCount);
  const now = date === todayDate() ? new Date() : atTime(date, 13, 0);

  for (let index = 0; index < waitingCount; index += 1) {
    const arrivedAt = new Date(now.getTime() - (2 + index * 3) * 60_000);
    const partyId = await createPartyRoot(
      client, runId, `${choose(PARTY_NAMES, random)} Waiting ${index + 1}`,
      2 + Math.floor(random() * 5), "waiting", arrivedAt, users.host, null,
    );
    await createPartyEvents(client, partyId, users.host, arrivedAt, null, null, null);
  }

  const statuses = ["submitted", "fired", "ready", "fulfilled"] as const;
  for (let index = 0; index < activeCount; index += 1) {
    const arrivedAt = new Date(now.getTime() - (12 + index * 3) * 60_000);
    const seatedAt = new Date(arrivedAt.getTime() + 4 * 60_000);
    const submittedAt = new Date(seatedAt.getTime() + 5 * 60_000);
    const partyStatus = index % 5 === 0 ? "seated" : "in_service";
    const partyId = await createPartyRoot(
      client, runId, `${choose(PARTY_NAMES, random)} Active ${index + 1}`,
      2 + Math.floor(random() * 4), partyStatus, arrivedAt, users.host, null,
    );
    await createPartyEvents(
      client, partyId, users.host, arrivedAt, seatedAt,
      partyStatus === "in_service" ? submittedAt : null, null,
    );
    await createSeating(client, partyId, freeTables[index]!, users.host, seatedAt, null);
    if (partyStatus === "seated") continue;
    const status = statuses[index % statuses.length]!;
    const order = await createOrder(
      client, runId, partyId, "dine_in", users.server, submittedAt,
      menu, 2 + (index % 3), status, random,
    );
    await createKitchenChit(
      client, runId, order.id, order.itemIds, users.kitchen,
      new Date(submittedAt.getTime() + 60_000),
    );
    if (status === "fulfilled") {
      await createCheck(
        client, runId, partyId, order.itemIds, order.subtotal, users.server,
        new Date(submittedAt.getTime() + 18 * 60_000), index % 2 === 0 ? "open" : "presented",
      );
    }
  }

  for (let index = 0; index < definition.activeStandaloneOrders; index += 1) {
    const submittedAt = new Date(now.getTime() - (3 + index * 4) * 60_000);
    const status = statuses[index % 3]!;
    const order = await createOrder(
      client, runId, null, index % 3 === 2 ? "delivery" : "takeout",
      users.server, submittedAt, menu, 1 + (index % 3), status, random,
    );
    await createKitchenChit(
      client, runId, order.id, order.itemIds, users.kitchen,
      new Date(submittedAt.getTime() + 60_000),
    );
  }
}

async function runSummary(client: PoolClient, runId: string) {
  const result = await client.query<{
    parties: number;
    active_parties: number;
    orders: number;
    order_items: number;
    checks: number;
    payments: number;
    sales: string;
  }>(
    `
      SELECT
        (SELECT count(*)::int FROM parties WHERE demo_scenario_run_id = $1) AS parties,
        (SELECT count(*)::int FROM parties WHERE demo_scenario_run_id = $1 AND status NOT IN ('completed', 'cancelled')) AS active_parties,
        (SELECT count(*)::int FROM orders WHERE demo_scenario_run_id = $1) AS orders,
        (SELECT count(*)::int FROM order_items item JOIN orders root ON root.id = item.order_id WHERE root.demo_scenario_run_id = $1) AS order_items,
        (SELECT count(*)::int FROM checks WHERE demo_scenario_run_id = $1) AS checks,
        (SELECT count(*)::int FROM payments WHERE demo_scenario_run_id = $1) AS payments,
        (SELECT COALESCE(sum(payment_amount), 0)::numeric(12,2)::text FROM payments WHERE demo_scenario_run_id = $1 AND status = 'succeeded') AS sales
    `,
    [runId],
  );
  const row = result.rows[0]!;
  return {
    parties: row.parties,
    activeParties: row.active_parties,
    orders: row.orders,
    orderItems: row.order_items,
    checks: row.checks,
    payments: row.payments,
    sales: Number(row.sales),
  };
}

async function clearRunRecords(client: PoolClient, runId: string): Promise<void> {
  await client.query(
    `DELETE FROM drawer_events WHERE drawer_session_id IN (
       SELECT id FROM drawer_sessions WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM cash_counts WHERE drawer_session_id IN (
       SELECT id FROM drawer_sessions WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM payment_check_allocations WHERE payment_id IN (
       SELECT id FROM payments WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM payment_events WHERE payment_id IN (
       SELECT id FROM payments WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(`DELETE FROM payments WHERE demo_scenario_run_id = $1`, [runId]);
  await client.query(
    `DELETE FROM check_events WHERE check_id IN (
       SELECT id FROM checks WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM check_items WHERE check_id IN (
       SELECT id FROM checks WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(`DELETE FROM checks WHERE demo_scenario_run_id = $1`, [runId]);
  await client.query(
    `DELETE FROM kitchen_chit_events WHERE kitchen_chit_id IN (
       SELECT id FROM kitchen_chits WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM kitchen_chit_items WHERE kitchen_chit_id IN (
       SELECT id FROM kitchen_chits WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(`DELETE FROM kitchen_chits WHERE demo_scenario_run_id = $1`, [runId]);
  await client.query(
    `DELETE FROM order_item_events WHERE order_item_id IN (
       SELECT item.id FROM order_items item
       JOIN orders root ON root.id = item.order_id
       WHERE root.demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM order_item_modifiers WHERE order_item_id IN (
       SELECT item.id FROM order_items item
       JOIN orders root ON root.id = item.order_id
       WHERE root.demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM order_items WHERE order_id IN (
       SELECT id FROM orders WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM order_events WHERE order_id IN (
       SELECT id FROM orders WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(`DELETE FROM orders WHERE demo_scenario_run_id = $1`, [runId]);
  await client.query(
    `DELETE FROM seating_tables WHERE seating_id IN (
       SELECT seating.id FROM seatings seating
       JOIN parties root ON root.id = seating.party_id
       WHERE root.demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM seatings WHERE party_id IN (
       SELECT id FROM parties WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(
    `DELETE FROM party_events WHERE party_id IN (
       SELECT id FROM parties WHERE demo_scenario_run_id = $1
     )`,
    [runId],
  );
  await client.query(`DELETE FROM parties WHERE demo_scenario_run_id = $1`, [runId]);
  await client.query(`DELETE FROM drawer_sessions WHERE demo_scenario_run_id = $1`, [runId]);
}

export async function clearDemoRun(
  client: PoolClient,
  runId: string,
): Promise<DemoRunStatus | null> {
  await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [SCENARIO_LOCK]);
  const run = await client.query<DemoRunRow>(
    `
      SELECT id, preset, anchor_date, range_start, range_end, created_at, cleared_at, summary
      FROM demo_scenario_runs
      WHERE id = $1 AND cleared_at IS NULL
      FOR UPDATE
    `,
    [runId],
  );
  const row = run.rows[0];
  if (!row) return null;
  await clearRunRecords(client, runId);
  const cleared = await client.query<DemoRunRow>(
    `
      UPDATE demo_scenario_runs
      SET cleared_at = now()
      WHERE id = $1
      RETURNING id, preset, anchor_date, range_start, range_end, created_at, cleared_at, summary
    `,
    [runId],
  );
  return formatRun(cleared.rows[0]!);
}

export async function createDemoRun(
  client: PoolClient,
  input: {
    preset: DemoPreset;
    anchorDate: string;
    replaceActive: boolean;
    createdByUserId: string;
  },
): Promise<DemoRunStatus> {
  await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [SCENARIO_LOCK]);
  const active = await getActiveDemoRun(client);
  if (active && !input.replaceActive) {
    throw Object.assign(new Error("A demo scenario is already active"), { statusCode: 409 });
  }
  if (active) await clearDemoRun(client, active.id);

  const definition = PRESET_DEFINITIONS[input.preset];
  const rangeStart = addDays(input.anchorDate, -(definition.days - 1));
  const inserted = await client.query<DemoRunRow>(
    `
      INSERT INTO demo_scenario_runs (
        preset, anchor_date, range_start, range_end, created_by_user_id
      ) VALUES ($1, $2, $3, $2, $4)
      RETURNING id, preset, anchor_date, range_start, range_end, created_at, cleared_at, summary
    `,
    [input.preset, input.anchorDate, rangeStart, input.createdByUserId],
  );
  const runId = inserted.rows[0]!.id;
  await ensureFloor(client);
  const users = await ensureDemoUsers(client);
  const menu = await loadMenu(client);
  const tables = await loadTables(client);
  const random = createRandom(`${input.preset}:${input.anchorDate}`);

  for (let offset = 0; offset < definition.days; offset += 1) {
    const date = addDays(rangeStart, offset);
    const isAnchor = date === input.anchorDate;
    const drawerId = await createDrawer(
      client, runId, date, users.manager, isAnchor && date === todayDate(),
    );
    const completedSales = completedSalesForDay(definition, date, random);
    for (let index = 0; index < completedSales; index += 1) {
      await createCompletedSale(
        client, runId, date, index, users, menu, tables, drawerId, random,
      );
    }
  }
  if (input.anchorDate === todayDate()) {
    await createActiveSnapshot(
      client, runId, input.anchorDate, definition, users, menu, random,
    );
  }

  const summary = await runSummary(client, runId);
  const updated = await client.query<DemoRunRow>(
    `
      UPDATE demo_scenario_runs
      SET summary = $2::jsonb
      WHERE id = $1
      RETURNING id, preset, anchor_date, range_start, range_end, created_at, cleared_at, summary
    `,
    [runId, JSON.stringify(summary)],
  );
  return formatRun(updated.rows[0]!);
}
