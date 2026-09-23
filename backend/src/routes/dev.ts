import type { PoolClient } from "pg";
import { Router } from "express";
import {
  createSessionToken,
  hashSessionToken,
  hashUserPin,
} from "../auth/security.js";
import {
  getAuthenticatedUser,
  requireAuthenticatedUser,
  requireRole,
  setSessionCookie,
} from "../auth/session.js";
import { pool } from "../db/pool.js";
import { restoreRitzFloor } from "../demo/ritzFloor.js";
import { environment } from "../env.js";

export const devRouter = Router();

type DemoPreset =
  | "admin-menu-only"
  | "keep-floor-staff"
  | "wednesday-light"
  | "sunday-busy";

type DemoOrderItem = {
  name: string;
  status: "submitted" | "fired" | "ready" | "fulfilled";
  quantity?: number;
  seatNumber?: number;
  kitchenNote?: string | null;
};

type DemoPartySpec = {
  name: string;
  guestCount: number;
  status: "waiting" | "seated" | "in_service";
  tableLabel?: string;
  arrivedMinutesAgo: number;
  items?: DemoOrderItem[];
  checkStatus?: "open" | "presented";
};

type DemoStandaloneOrderSpec = {
  fulfillmentType: "takeout" | "delivery";
  customerName: string;
  deliveryAddress?: string;
  submittedMinutesAgo: number;
  items: DemoOrderItem[];
};

type DemoScenario = {
  users: Array<{
    displayName: string;
    roles: string[];
  }>;
  parties: DemoPartySpec[];
  standaloneOrders: DemoStandaloneOrderSpec[];
};

const DEMO_PIN = "1111";
const SALES_TAX_RATE = 0.06625;

const WEDNESDAY_LIGHT: DemoScenario = {
  users: [
    { displayName: "Mia Host", roles: ["host"] },
    { displayName: "Josh Server", roles: ["server"] },
    { displayName: "Rosa Kitchen", roles: ["chef"] },
    { displayName: "Casey Manager", roles: ["manager"] },
  ],
  parties: [
    {
      name: "Miller",
      guestCount: 2,
      status: "waiting",
      arrivedMinutesAgo: 6,
    },
    {
      name: "Garcia",
      guestCount: 2,
      status: "in_service",
      tableLabel: "1",
      arrivedMinutesAgo: 18,
      items: [
        { name: "French Toast", status: "fired", seatNumber: 1 },
        {
          name: "Fresh Ground Coffee (Regular or Decaf)",
          status: "ready",
          seatNumber: 2,
        },
      ],
    },
    {
      name: "Patel",
      guestCount: 3,
      status: "in_service",
      tableLabel: "2",
      arrivedMinutesAgo: 24,
      items: [
        { name: "Egg & Cheese", status: "fulfilled", quantity: 2 },
      ],
      checkStatus: "open",
    },
    {
      name: "Nguyen",
      guestCount: 2,
      status: "seated",
      tableLabel: "3",
      arrivedMinutesAgo: 9,
    },
  ],
  standaloneOrders: [
    {
      fulfillmentType: "takeout",
      customerName: "Alex",
      submittedMinutesAgo: 3,
      items: [{ name: "Cheesecake", status: "submitted" }],
    },
  ],
};

const SUNDAY_BUSY: DemoScenario = {
  users: [
    { displayName: "Mia Host", roles: ["host"] },
    { displayName: "Josh Server", roles: ["server"] },
    { displayName: "Ava Server", roles: ["server"] },
    { displayName: "Leo Server", roles: ["lead_server"] },
    { displayName: "Rosa Kitchen", roles: ["chef"] },
    { displayName: "Marco Kitchen", roles: ["head_chef"] },
    { displayName: "Casey Manager", roles: ["manager"] },
  ],
  parties: [
    { name: "Thompson", guestCount: 4, status: "waiting", arrivedMinutesAgo: 17 },
    { name: "Rivera", guestCount: 2, status: "waiting", arrivedMinutesAgo: 12 },
    { name: "Brooks", guestCount: 5, status: "waiting", arrivedMinutesAgo: 8 },
    { name: "Chen", guestCount: 3, status: "waiting", arrivedMinutesAgo: 4 },
    {
      name: "Harris",
      guestCount: 2,
      status: "in_service",
      tableLabel: "1",
      arrivedMinutesAgo: 38,
      items: [
        { name: "Buttermilk Pancakes", status: "fired", quantity: 2 },
        { name: "Fresh Ground Coffee (Regular or Decaf)", status: "ready", quantity: 2 },
      ],
    },
    {
      name: "Ortiz",
      guestCount: 4,
      status: "in_service",
      tableLabel: "2",
      arrivedMinutesAgo: 34,
      items: [
        { name: "French Toast", status: "ready", quantity: 2 },
        { name: "Egg & Cheese", status: "fired", quantity: 2 },
      ],
    },
    {
      name: "Lee",
      guestCount: 2,
      status: "seated",
      tableLabel: "3",
      arrivedMinutesAgo: 7,
    },
    {
      name: "Wilson",
      guestCount: 3,
      status: "in_service",
      tableLabel: "4",
      arrivedMinutesAgo: 21,
      items: [
        { name: "Taylor Ham, Egg & Cheese", status: "submitted", quantity: 2 },
      ],
    },
    {
      name: "Martin",
      guestCount: 2,
      status: "in_service",
      tableLabel: "5",
      arrivedMinutesAgo: 42,
      items: [
        { name: "Bacon Cheeseburger — Regular", status: "fulfilled" },
        { name: "Cheesecake", status: "fulfilled" },
      ],
      checkStatus: "presented",
    },
    {
      name: "Davis",
      guestCount: 4,
      status: "in_service",
      tableLabel: "6",
      arrivedMinutesAgo: 28,
      items: [
        { name: "Crock of Onion Soup", status: "ready", quantity: 2 },
        { name: "Paulo’s Salad with Grilled Chicken", status: "fired" },
      ],
    },
    {
      name: "Garcia",
      guestCount: 2,
      status: "in_service",
      tableLabel: "7",
      arrivedMinutesAgo: 31,
      items: [
        { name: "French Toast", status: "fulfilled", quantity: 2 },
      ],
      checkStatus: "open",
    },
    {
      name: "Kim",
      guestCount: 2,
      status: "seated",
      tableLabel: "8",
      arrivedMinutesAgo: 5,
    },
  ],
  standaloneOrders: [
    {
      fulfillmentType: "takeout",
      customerName: "Sam",
      submittedMinutesAgo: 7,
      items: [{ name: "Cheesecake", status: "submitted", quantity: 2 }],
    },
    {
      fulfillmentType: "delivery",
      customerName: "Jordan",
      deliveryAddress: "25 Main Street, West Orange, NJ",
      submittedMinutesAgo: 11,
      items: [{ name: "Bacon Cheeseburger — Deluxe", status: "fired" }],
    },
  ],
};

function assertDevelopment() {
  if (environment.NODE_ENV !== "development") {
    const error = new Error("Development route unavailable");
    Object.assign(error, { statusCode: 404 });
    throw error;
  }
}

function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60_000);
}

async function clearServiceData(client: PoolClient) {
  await client.query(`
    TRUNCATE TABLE
      drawer_sessions,
      payments,
      checks,
      kitchen_chits,
      orders,
      parties
    RESTART IDENTITY CASCADE
  `);
}

async function resetToAdminAndMenu(client: PoolClient) {
  await clearServiceData(client);

  await client.query(`
    TRUNCATE TABLE dining_tables, sections
    RESTART IDENTITY CASCADE
  `);

  // Manual safety overrides are demo/user activity, not source menu truth.
  await client.query(`DELETE FROM menu_item_safety_override_audit`);
  await client.query(`
    DELETE FROM menu_item_safety_declarations
    WHERE source = 'manual_override'
  `);

  await client.query(`
    DELETE FROM user_auth_events
    WHERE user_id IN (
      SELECT u.id
      FROM users u
      WHERE NOT EXISTS (
        SELECT 1
        FROM user_roles ur
        WHERE ur.user_id = u.id
          AND ur.role_code = 'admin'
      )
    )
  `);

  await client.query(`
    DELETE FROM users u
    WHERE NOT EXISTS (
      SELECT 1
      FROM user_roles ur
      WHERE ur.user_id = u.id
        AND ur.role_code = 'admin'
    )
  `);
}

async function ensureDemoUser(
  client: PoolClient,
  displayName: string,
  roles: string[],
): Promise<string> {
  const loginKey = displayName.replace(/\s+/g, "").toLowerCase();
  const existing = await client.query<{ id: string }>(
    `
      SELECT id
      FROM users
      WHERE replace(lower(display_name), ' ', '') = $1
      LIMIT 1
    `,
    [loginKey],
  );

  let userId = existing.rows[0]?.id;

  if (!userId) {
    const created = await client.query<{ id: string }>(
      `
        INSERT INTO users (display_name, is_active)
        VALUES ($1, true)
        RETURNING id
      `,
      [displayName],
    );
    userId = created.rows[0]?.id;
  } else {
    await client.query(
      `UPDATE users SET display_name = $2, is_active = true WHERE id = $1`,
      [userId, displayName],
    );
  }

  if (!userId) throw new Error(`Unable to create demo user ${displayName}`);

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
      ON CONFLICT (user_id)
      DO UPDATE SET
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

async function getMenuItems(client: PoolClient, names: string[]) {
  const uniqueNames = [...new Set(names)];
  const result = await client.query<{
    id: string;
    name: string;
    price: string;
  }>(
    `
      SELECT id, name, price::text
      FROM menu_items
      WHERE name = ANY($1::text[])
        AND is_modifier = false
    `,
    [uniqueNames],
  );

  const map = new Map(result.rows.map((row) => [row.name, row]));
  const missing = uniqueNames.filter((name) => !map.has(name));
  if (missing.length > 0) {
    throw new Error(`Demo menu items missing: ${missing.join(", ")}`);
  }
  return map;
}

async function getTableId(client: PoolClient, label: string): Promise<string> {
  const result = await client.query<{ id: string }>(
    `
      SELECT t.id
      FROM dining_tables t
      JOIN sections s ON s.id = t.section_id
      WHERE s.name = 'Main Dining Room'
        AND t.label = $1
    `,
    [label],
  );
  const id = result.rows[0]?.id;
  if (!id) throw new Error(`Demo table ${label} not found`);
  return id;
}

async function createParty(
  client: PoolClient,
  spec: DemoPartySpec,
  actorUserId: string,
  menu: Map<string, { id: string; name: string; price: string }>,
) {
  const arrivedAt = minutesAgo(spec.arrivedMinutesAgo);
  const statusChangedAt =
    spec.status === "waiting" ? arrivedAt : minutesAgo(Math.max(1, spec.arrivedMinutesAgo - 3));

  const partyResult = await client.query<{ id: string }>(
    `
      INSERT INTO parties (
        name,
        guest_count,
        status,
        created_by_user_id,
        arrived_at,
        status_changed_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
    [spec.name, spec.guestCount, spec.status, actorUserId, arrivedAt, statusChangedAt],
  );
  const partyId = partyResult.rows[0]?.id;
  if (!partyId) throw new Error(`Unable to create demo party ${spec.name}`);

  await client.query(
    `
      INSERT INTO party_events (party_id, event_type, actor_user_id, occurred_at)
      VALUES
        ($1, 'arrived', $2, $3),
        ($1, 'waiting_started', $2, $3)
    `,
    [partyId, actorUserId, arrivedAt],
  );

  if (spec.status !== "waiting") {
    const tableId = await getTableId(client, spec.tableLabel ?? "");
    const seatedAt = minutesAgo(Math.max(1, spec.arrivedMinutesAgo - 2));
    const seatingResult = await client.query<{ id: string }>(
      `
        INSERT INTO seatings (party_id, seated_by_user_id, seated_at)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      [partyId, actorUserId, seatedAt],
    );
    const seatingId = seatingResult.rows[0]?.id;
    if (!seatingId) throw new Error("Unable to create demo seating");

    await client.query(
      `
        INSERT INTO seating_tables (seating_id, dining_table_id, assigned_at)
        VALUES ($1, $2, $3)
      `,
      [seatingId, tableId, seatedAt],
    );
    await client.query(
      `
        INSERT INTO party_events (party_id, event_type, actor_user_id, occurred_at)
        VALUES ($1, 'seated', $2, $3)
      `,
      [partyId, actorUserId, seatedAt],
    );
  }

  if (spec.status === "in_service") {
    await client.query(
      `
        INSERT INTO party_events (party_id, event_type, actor_user_id, occurred_at)
        VALUES ($1, 'service_started', $2, $3)
      `,
      [partyId, actorUserId, minutesAgo(Math.max(1, spec.arrivedMinutesAgo - 5))],
    );
  }

  const itemIds: string[] = [];
  if (spec.items && spec.items.length > 0) {
    const orderId = await createOrder(
      client,
      {
        partyId,
        fulfillmentType: "dine_in",
        customerName: null,
        deliveryAddress: null,
        submittedMinutesAgo: Math.max(1, spec.arrivedMinutesAgo - 7),
        items: spec.items,
      },
      actorUserId,
      menu,
      itemIds,
    );

    if (!orderId) throw new Error("Unable to create demo dine-in order");
  }

  if (spec.checkStatus && itemIds.length > 0) {
    await createCheck(client, partyId, `${spec.name} · Table ${spec.tableLabel}`, itemIds, spec.checkStatus, actorUserId);
  }
}

async function createOrder(
  client: PoolClient,
  spec: {
    partyId: string | null;
    fulfillmentType: "dine_in" | "takeout" | "delivery";
    customerName: string | null;
    deliveryAddress: string | null;
    submittedMinutesAgo: number;
    items: DemoOrderItem[];
  },
  actorUserId: string,
  menu: Map<string, { id: string; name: string; price: string }>,
  collectItemIds?: string[],
): Promise<string> {
  const submittedAt = minutesAgo(spec.submittedMinutesAgo);
  const orderResult = await client.query<{ id: string }>(
    `
      INSERT INTO orders (
        party_id,
        fulfillment_type,
        created_by_user_id,
        customer_name,
        delivery_address,
        submitted_at,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $6)
      RETURNING id
    `,
    [
      spec.partyId,
      spec.fulfillmentType,
      actorUserId,
      spec.customerName,
      spec.deliveryAddress,
      submittedAt,
    ],
  );
  const orderId = orderResult.rows[0]?.id;
  if (!orderId) throw new Error("Unable to create demo order");

  await client.query(
    `
      INSERT INTO order_events (
        order_id, event_type, actor_kind, actor_user_id, occurred_at
      ) VALUES ($1, 'submitted', 'user', $2, $3)
    `,
    [orderId, actorUserId, submittedAt],
  );

  for (let index = 0; index < spec.items.length; index += 1) {
    const itemSpec = spec.items[index]!;
    const menuItem = menu.get(itemSpec.name);
    if (!menuItem) throw new Error(`Demo menu item missing: ${itemSpec.name}`);

    const quantity = itemSpec.quantity ?? 1;
    const firedAt = itemSpec.status === "submitted" ? null : new Date(submittedAt.getTime() + 2 * 60_000);
    const readyAt = ["ready", "fulfilled"].includes(itemSpec.status)
      ? new Date(submittedAt.getTime() + 5 * 60_000)
      : null;
    const fulfilledAt = itemSpec.status === "fulfilled"
      ? new Date(submittedAt.getTime() + 7 * 60_000)
      : null;

    const itemResult = await client.query<{ id: string }>(
      `
        INSERT INTO order_items (
          order_id,
          menu_item_id,
          created_by_user_id,
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
          created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $10
        )
        RETURNING id
      `,
      [
        orderId,
        menuItem.id,
        actorUserId,
        itemSpec.seatNumber ?? null,
        menuItem.name,
        menuItem.price,
        quantity,
        itemSpec.kitchenNote ?? null,
        itemSpec.status,
        submittedAt,
        firedAt,
        readyAt,
        fulfilledAt,
      ],
    );

    const itemId = itemResult.rows[0]?.id;
    if (!itemId) throw new Error("Unable to create demo order item");
    collectItemIds?.push(itemId);

    const events: Array<{ type: string; at: Date }> = [
      { type: "submitted", at: submittedAt },
    ];
    if (firedAt) events.push({ type: "fired", at: firedAt });
    if (readyAt) events.push({ type: "ready", at: readyAt });
    if (fulfilledAt) events.push({ type: "fulfilled", at: fulfilledAt });

    for (const event of events) {
      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id, event_type, actor_kind, actor_user_id, occurred_at
          ) VALUES ($1, $2, 'user', $3, $4)
        `,
        [itemId, event.type, actorUserId, event.at],
      );
    }
  }

  return orderId;
}

async function createCheck(
  client: PoolClient,
  partyId: string,
  label: string,
  itemIds: string[],
  status: "open" | "presented",
  actorUserId: string,
) {
  const itemResult = await client.query<{
    id: string;
    item_name: string;
    quantity: number;
    amount: string;
  }>(
    `
      SELECT
        id,
        item_name,
        quantity,
        (unit_price * quantity)::numeric(10,2)::text AS amount
      FROM order_items
      WHERE id = ANY($1::uuid[])
    `,
    [itemIds],
  );

  const subtotal = itemResult.rows.reduce((sum, row) => sum + Number(row.amount), 0);
  const tax = Math.round(subtotal * SALES_TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const createdAt = status === "presented" ? minutesAgo(3) : new Date();
  const presentedAt = status === "presented" ? minutesAgo(2) : null;

  const checkResult = await client.query<{ id: string }>(
    `
      INSERT INTO checks (
        party_id,
        label,
        status,
        opened_by_user_id,
        subtotal_amount,
        tax_amount,
        total_amount,
        sales_tax_rate,
        presented_at,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
      RETURNING id
    `,
    [
      partyId,
      label,
      status,
      actorUserId,
      subtotal,
      tax,
      total,
      SALES_TAX_RATE,
      presentedAt,
      createdAt,
    ],
  );
  const checkId = checkResult.rows[0]?.id;
  if (!checkId) throw new Error("Unable to create demo check");

  for (const item of itemResult.rows) {
    await client.query(
      `
        INSERT INTO check_items (
          check_id,
          order_item_id,
          item_name,
          allocated_quantity,
          allocated_amount
        ) VALUES ($1, $2, $3, $4, $5)
      `,
      [checkId, item.id, item.item_name, item.quantity, item.amount],
    );
  }

  await client.query(
    `
      INSERT INTO check_events (
        check_id, event_type, actor_kind, actor_user_id, details, occurred_at
      ) VALUES ($1, 'created', 'user', $2, jsonb_build_object('demo', true), $3)
    `,
    [checkId, actorUserId, createdAt],
  );

  if (presentedAt) {
    await client.query(
      `
        INSERT INTO check_events (
          check_id, event_type, actor_kind, actor_user_id, occurred_at
        ) VALUES ($1, 'presented', 'user', $2, $3)
      `,
      [checkId, actorUserId, presentedAt],
    );
  }
}

async function openDemoDrawer(client: PoolClient, userId: string) {
  const drawer = await client.query<{ id: string }>(
    `
      INSERT INTO drawer_sessions (
        opened_by_user_id, opening_cash_amount, opened_at
      ) VALUES ($1, 200, now() - interval '2 hours')
      RETURNING id
    `,
    [userId],
  );
  const drawerId = drawer.rows[0]?.id;
  if (!drawerId) throw new Error("Unable to open demo drawer");

  const count = await client.query<{ id: string }>(
    `
      INSERT INTO cash_counts (
        drawer_session_id, count_kind, counted_amount, counted_by_user_id,
        counted_at, note
      ) VALUES ($1, 'opening', 200, $2, now() - interval '2 hours', 'Demo opening count')
      RETURNING id
    `,
    [drawerId, userId],
  );
  const countId = count.rows[0]?.id;

  await client.query(
    `
      INSERT INTO drawer_events (
        drawer_session_id, event_type, amount, cash_count_id, actor_user_id,
        occurred_at
      ) VALUES
        ($1, 'opened', 200, NULL, $2, now() - interval '2 hours'),
        ($1, 'counted', 200, $3, $2, now() - interval '2 hours')
    `,
    [drawerId, userId, countId],
  );
}

async function seedScenario(client: PoolClient, scenario: DemoScenario, adminUserId: string) {
  await resetToAdminAndMenu(client);
  await restoreRitzFloor(client);

  const users = new Map<string, string>();
  for (const user of scenario.users) {
    users.set(user.displayName, await ensureDemoUser(client, user.displayName, user.roles));
  }

  const actorUserId = users.get("Josh Server") ?? users.get("Casey Manager") ?? adminUserId;
  const drawerUserId = users.get("Casey Manager") ?? adminUserId;

  const itemNames = [
    ...scenario.parties.flatMap((party) => party.items?.map((item) => item.name) ?? []),
    ...scenario.standaloneOrders.flatMap((order) => order.items.map((item) => item.name)),
  ];
  const menu = await getMenuItems(client, itemNames);

  for (const party of scenario.parties) {
    await createParty(client, party, actorUserId, menu);
  }

  for (const order of scenario.standaloneOrders) {
    await createOrder(
      client,
      {
        partyId: null,
        fulfillmentType: order.fulfillmentType,
        customerName: order.customerName,
        deliveryAddress: order.deliveryAddress ?? null,
        submittedMinutesAgo: order.submittedMinutesAgo,
        items: order.items,
      },
      actorUserId,
      menu,
    );
  }

  await openDemoDrawer(client, drawerUserId);
}

async function summary(client: PoolClient) {
  const result = await client.query<{
    users: string;
    sections: string;
    tables: string;
    parties: string;
    orders: string;
  }>(`
    SELECT
      (SELECT count(*) FROM users)::text AS users,
      (SELECT count(*) FROM sections)::text AS sections,
      (SELECT count(*) FROM dining_tables)::text AS tables,
      (SELECT count(*) FROM parties WHERE status NOT IN ('completed', 'cancelled'))::text AS parties,
      (SELECT count(*) FROM orders WHERE cancelled_at IS NULL)::text AS orders
  `);

  const row = result.rows[0]!;
  return {
    users: Number(row.users),
    sections: Number(row.sections),
    tables: Number(row.tables),
    activeParties: Number(row.parties),
    activeOrders: Number(row.orders),
  };
}

devRouter.use((_request, response, next) => {
  if (environment.NODE_ENV !== "development") {
    response.status(404).json({ error: "Not found" });
    return;
  }
  next();
});

devRouter.get("/users", async (_request, response) => {
  const result = await pool.query<{
    id: string;
    display_name: string;
    roles: string[];
  }>(`
    SELECT
      u.id,
      u.display_name,
      COALESCE(
        array_agg(ur.role_code ORDER BY ur.role_code)
          FILTER (WHERE ur.role_code IS NOT NULL),
        ARRAY[]::text[]
      ) AS roles
    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    WHERE u.is_active = true
    GROUP BY u.id, u.display_name
    ORDER BY lower(u.display_name), u.id
  `);

  response.json(
    result.rows.map((row) => ({
      id: row.id,
      displayName: row.display_name,
      roles: row.roles,
    })),
  );
});

devRouter.post("/login", async (request, response) => {
  const userId = typeof request.body?.userId === "string" ? request.body.userId : "";
  if (!/^[0-9a-f-]{36}$/i.test(userId)) {
    response.status(400).json({ error: "Invalid development user" });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userResult = await client.query<{
      id: string;
      display_name: string;
      roles: string[];
    }>(
      `
        SELECT
          u.id,
          u.display_name,
          COALESCE(
            array_agg(ur.role_code ORDER BY ur.role_code)
              FILTER (WHERE ur.role_code IS NOT NULL),
            ARRAY[]::text[]
          ) AS roles
        FROM users u
        LEFT JOIN user_roles ur ON ur.user_id = u.id
        WHERE u.id = $1
          AND u.is_active = true
        GROUP BY u.id, u.display_name
      `,
      [userId],
    );
    const user = userResult.rows[0];
    if (!user) {
      await client.query("ROLLBACK");
      response.status(404).json({ error: "Development user not found" });
      return;
    }

    const token = createSessionToken();
    const tokenHash = hashSessionToken(token);
    const sessionResult = await client.query<{ id: string }>(
      `
        INSERT INTO user_sessions (user_id, token_hash, expires_at)
        VALUES ($1, $2, now() + interval '12 hours')
        RETURNING id
      `,
      [user.id, tokenHash],
    );
    const sessionId = sessionResult.rows[0]?.id;
    if (!sessionId) throw new Error("Unable to create development session");

    await client.query(
      `
        INSERT INTO user_auth_events (user_id, session_id, event_type)
        VALUES ($1, $2, 'login_succeeded')
      `,
      [user.id, sessionId],
    );
    await client.query("COMMIT");
    setSessionCookie(response, token);
    response.json({ id: user.id, displayName: user.display_name, roles: user.roles });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

devRouter.post(
  "/demo/:preset",
  requireAuthenticatedUser,
  requireRole("admin"),
  async (request, response) => {
    assertDevelopment();
    const preset = request.params.preset as DemoPreset;
    if (!["admin-menu-only", "keep-floor-staff", "wednesday-light", "sunday-busy"].includes(preset)) {
      response.status(400).json({ error: "Unknown demo preset" });
      return;
    }

    const adminUserId = getAuthenticatedUser(request).id;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      if (preset === "admin-menu-only") {
        await resetToAdminAndMenu(client);
        await restoreRitzFloor(client);
      } else if (preset === "keep-floor-staff") {
        await clearServiceData(client);
        await restoreRitzFloor(client);
      } else if (preset === "wednesday-light") {
        await seedScenario(client, WEDNESDAY_LIGHT, adminUserId);
      } else {
        await seedScenario(client, SUNDAY_BUSY, adminUserId);
      }
      const counts = await summary(client);
      await client.query("COMMIT");
      response.json({ preset, ...counts });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);
