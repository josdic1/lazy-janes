import type { PoolClient } from "pg";
import {
  createDemoRun,
  ensureDemoUsers,
  parseAnchorDate,
  type DemoPreset,
  type DemoRunStatus,
} from "../demo/scenarioService.js";
import { preloadRitzFloor } from "../demo/ritzFloor.js";
import { preloadCanonicalMenu } from "./menuSeed.js";

export const ADMIN_SAMPLE_PRESETS = [
  "slow-day",
  "very-busy-day",
  "slow-week",
  "busy-week",
] as const satisfies readonly DemoPreset[];

export type AdminSamplePreset = (typeof ADMIN_SAMPLE_PRESETS)[number];
export type AdminPreloadKind = "menu" | "staff" | "tables";

const ADMIN_SAMPLE_LABELS: Record<AdminSamplePreset, string> = {
  "slow-day": "Slow Day",
  "very-busy-day": "Busy Day",
  "slow-week": "Slow Week",
  "busy-week": "Busy Week",
};

export type AdminDataSummary = {
  users: number;
  menuItems: number;
  sections: number;
  tables: number;
  activeParties: number;
  orders: number;
};

export type AdminDataActionResult = {
  action: string;
  message: string;
  summary: AdminDataSummary;
  demoRun?: DemoRunStatus;
};

export function isAdminSamplePreset(value: string): value is AdminSamplePreset {
  return (ADMIN_SAMPLE_PRESETS as readonly string[]).includes(value);
}

export function isAdminPreloadKind(value: string): value is AdminPreloadKind {
  return ["menu", "staff", "tables"].includes(value);
}

export async function getAdminDataSummary(
  client: PoolClient,
): Promise<AdminDataSummary> {
  const result = await client.query<{
    users: number;
    menu_items: number;
    sections: number;
    tables: number;
    active_parties: number;
    orders: number;
  }>(`
    SELECT
      (SELECT count(*)::int FROM users) AS users,
      (SELECT count(*)::int FROM menu_items) AS menu_items,
      (SELECT count(*)::int FROM sections) AS sections,
      (SELECT count(*)::int FROM dining_tables) AS tables,
      (
        SELECT count(*)::int
        FROM parties
        WHERE status NOT IN ('completed', 'cancelled')
      ) AS active_parties,
      (SELECT count(*)::int FROM orders) AS orders
  `);

  const row = result.rows[0]!;
  return {
    users: row.users,
    menuItems: row.menu_items,
    sections: row.sections,
    tables: row.tables,
    activeParties: row.active_parties,
    orders: row.orders,
  };
}

export async function clearAllExceptAdmin(
  client: PoolClient,
  adminUserId: string,
): Promise<AdminDataActionResult> {
  const admin = await client.query<{ id: string }>(
    `
      SELECT u.id
      FROM users u
      JOIN user_roles role
        ON role.user_id = u.id
       AND role.role_code = 'admin'
      WHERE u.id = $1
        AND u.is_active = true
      FOR UPDATE OF u
    `,
    [adminUserId],
  );

  if (!admin.rows[0]) {
    throw Object.assign(
      new Error("The current user is not an active administrator"),
      { statusCode: 403 },
    );
  }

  // Clear all user-visible restaurant/demo data. The canonical empty menu
  // taxonomy (groups/categories) is structural seed scaffolding, like schema,
  // and remains so the Menu button can repopulate the canonical menu cleanly.
  // Roles and the current administrator identity/login also remain.
  await client.query(`
    TRUNCATE TABLE
      sections,
      parties,
      orders,
      checks,
      payments,
      kitchen_chits,
      drawer_sessions,
      menu_modifier_groups,
      menu_rules,
      menu_choice_constraints,
      menu_item_additions,
      menu_item_safety_override_audit,
      menu_item_safety_declarations,
      menu_items,
      ingredients,
      preparation_schemes,
      demo_scenario_runs
    RESTART IDENTITY CASCADE
  `);

  // Auth history is data too, but keeping the administrator's session and
  // credential prevents the reset button from logging the administrator out.
  await client.query(`DELETE FROM user_auth_events`);
  await client.query(`DELETE FROM users WHERE id <> $1`, [adminUserId]);
  await client.query(
    `DELETE FROM user_roles WHERE user_id = $1 AND role_code <> 'admin'`,
    [adminUserId],
  );
  await client.query(
    `
      INSERT INTO user_roles (user_id, role_code)
      VALUES ($1, 'admin')
      ON CONFLICT (user_id, role_code) DO NOTHING
    `,
    [adminUserId],
  );
  await client.query(
    `UPDATE users SET is_active = true, is_demo = false WHERE id = $1`,
    [adminUserId],
  );

  return {
    action: "reset",
    message: "Empty project ready. Only the current Admin account remains.",
    summary: await getAdminDataSummary(client),
  };
}

export async function preloadAdminData(
  client: PoolClient,
  kind: AdminPreloadKind,
): Promise<AdminDataActionResult> {
  if (kind === "menu") {
    const result = await preloadCanonicalMenu(client);
    return {
      action: "preload-menu",
      message: result.loaded
        ? `Menu loaded · ${result.menuItems} items`
        : `Menu already loaded · ${result.menuItems} items`,
      summary: await getAdminDataSummary(client),
    };
  }

  if (kind === "staff") {
    await ensureDemoUsers(client);
    return {
      action: "preload-staff",
      message: "Sample staff ready · 4 users · PIN 1111",
      summary: await getAdminDataSummary(client),
    };
  }

  const result = await preloadRitzFloor(client);
  return {
    action: "preload-tables",
    message: result.loaded
      ? `Ritz floor loaded · ${result.tables} tables`
      : `Tables already configured · ${result.tables} tables`,
    summary: await getAdminDataSummary(client),
  };
}

export async function loadSampleActivity(
  client: PoolClient,
  input: {
    preset: AdminSamplePreset;
    anchorDate: string;
    adminUserId: string;
  },
): Promise<AdminDataActionResult> {
  // Sample scenarios are one-click demo builders: they ensure the complete
  // foundation exists before adding activity. Each preload is idempotent.
  await preloadCanonicalMenu(client);
  await ensureDemoUsers(client);
  await preloadRitzFloor(client);

  const demoRun = await createDemoRun(client, {
    preset: input.preset,
    anchorDate: parseAnchorDate(input.anchorDate),
    replaceActive: true,
    createdByUserId: input.adminUserId,
    useExistingFoundation: true,
  });

  return {
    action: `sample-${input.preset}`,
    message: `${ADMIN_SAMPLE_LABELS[input.preset]} ready`,
    summary: await getAdminDataSummary(client),
    demoRun,
  };
}
