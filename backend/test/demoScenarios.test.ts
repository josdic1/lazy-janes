import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import {
  clearDemoRun,
  createDemoRun,
  getActiveDemoRun,
  parseAnchorDate,
} from "../src/demo/scenarioService.js";
import { pool } from "../src/db/pool.js";

afterAll(async () => {
  await pool.end();
});

async function prepareAdmin(client: Awaited<ReturnType<typeof pool.connect>>) {
  const userId = randomUUID();
  await client.query(
    `INSERT INTO users (id, display_name) VALUES ($1, $2)`,
    [userId, `Demo Scenario Test Admin ${userId}`],
  );
  await client.query(
    `INSERT INTO user_roles (user_id, role_code) VALUES ($1, 'admin')`,
    [userId],
  );
  return userId;
}

async function clearPreexistingActiveRun(
  client: Awaited<ReturnType<typeof pool.connect>>,
) {
  const active = await getActiveDemoRun(client);
  if (active) await clearDemoRun(client, active.id);
}

async function ensureTestMenu(
  client: Awaited<ReturnType<typeof pool.connect>>,
) {
  const existing = await client.query<{ count: number }>(`
    SELECT count(*)::int AS count
    FROM menu_items
    WHERE status = 'available'
      AND is_modifier = false
      AND price_configured = true
      AND price > 0
  `);
  const missing = Math.max(0, 8 - (existing.rows[0]?.count ?? 0));
  if (missing === 0) return;

  const category = await client.query<{ id: string }>(`
    SELECT id FROM menu_categories ORDER BY sort_order, name, id LIMIT 1
  `);
  const categoryId = category.rows[0]?.id;
  if (!categoryId) throw new Error("Test database has no menu category");

  for (let index = 0; index < missing; index += 1) {
    await client.query(
      `
        INSERT INTO menu_items (
          name, description, category_id, price, status,
          is_special, is_modifier, sort_order, price_configured
        ) VALUES ($1, 'Scenario test fixture', $2, $3, 'available', false, false, $4, true)
      `,
      [`Scenario Fixture ${randomUUID()}`, categoryId, 8 + index, 9000 + index],
    );
  }
}

describe("development demo scenarios", () => {
  it("clears only generated roots and preserves genuine records", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await clearPreexistingActiveRun(client);
      const adminId = await prepareAdmin(client);
      await ensureTestMenu(client);
      const genuinePartyId = randomUUID();
      await client.query(
        `
          INSERT INTO parties (
            id, name, guest_count, status, created_by_user_id
          ) VALUES ($1, 'Genuine Party', 2, 'waiting', $2)
        `,
        [genuinePartyId, adminId],
      );

      const run = await createDemoRun(client, {
        preset: "slow-day",
        anchorDate: new Date().toISOString().slice(0, 10),
        replaceActive: false,
        createdByUserId: adminId,
      });
      expect(Number(run.summary.orders)).toBeGreaterThan(0);

      const generatedBeforeClear = await client.query<{ count: number }>(
        `SELECT count(*)::int AS count FROM orders WHERE demo_scenario_run_id = $1`,
        [run.id],
      );
      expect(generatedBeforeClear.rows[0]?.count).toBeGreaterThan(0);

      await clearDemoRun(client, run.id);

      const generatedAfterClear = await client.query<{ count: number }>(
        `
          SELECT
            (SELECT count(*) FROM parties WHERE demo_scenario_run_id = $1) +
            (SELECT count(*) FROM orders WHERE demo_scenario_run_id = $1) +
            (SELECT count(*) FROM checks WHERE demo_scenario_run_id = $1) +
            (SELECT count(*) FROM payments WHERE demo_scenario_run_id = $1) AS count
        `,
        [run.id],
      );
      expect(Number(generatedAfterClear.rows[0]?.count)).toBe(0);

      const genuine = await client.query(
        `SELECT id FROM parties WHERE id = $1 AND demo_scenario_run_id IS NULL`,
        [genuinePartyId],
      );
      expect(genuine.rowCount).toBe(1);
      await client.query("ROLLBACK");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  it("replaces exactly one active run and leaves the earlier run cleared", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await clearPreexistingActiveRun(client);
      const adminId = await prepareAdmin(client);
      await ensureTestMenu(client);
      const anchorDate = new Date().toISOString().slice(0, 10);
      const first = await createDemoRun(client, {
        preset: "slow-day",
        anchorDate,
        replaceActive: false,
        createdByUserId: adminId,
      });
      const second = await createDemoRun(client, {
        preset: "mildly-busy-day",
        anchorDate,
        replaceActive: true,
        createdByUserId: adminId,
      });

      expect(second.id).not.toBe(first.id);
      expect((await getActiveDemoRun(client))?.id).toBe(second.id);
      const firstState = await client.query<{ cleared_at: Date | null; roots: number }>(
        `
          SELECT
            run.cleared_at,
            (
              (SELECT count(*) FROM parties WHERE demo_scenario_run_id = run.id) +
              (SELECT count(*) FROM orders WHERE demo_scenario_run_id = run.id)
            )::int AS roots
          FROM demo_scenario_runs run
          WHERE run.id = $1
        `,
        [first.id],
      );
      expect(firstState.rows[0]?.cleared_at).not.toBeNull();
      expect(firstState.rows[0]?.roots).toBe(0);
      await client.query("ROLLBACK");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  it("can roll back every partial write when scenario generation fails", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await clearPreexistingActiveRun(client);
      const adminId = await prepareAdmin(client);
      const before = await client.query<{ runs: number; menu: number }>(`
        SELECT
          (SELECT count(*)::int FROM demo_scenario_runs) AS runs,
          (SELECT count(*)::int FROM menu_items WHERE status = 'available') AS menu
      `);

      await client.query("SAVEPOINT failed_generation");
      await client.query(`UPDATE menu_items SET status = 'inactive'`);
      await expect(
        createDemoRun(client, {
          preset: "slow-day",
          anchorDate: new Date().toISOString().slice(0, 10),
          replaceActive: false,
          createdByUserId: adminId,
        }),
      ).rejects.toThrow("at least eight sellable menu items");
      await client.query("ROLLBACK TO SAVEPOINT failed_generation");

      const after = await client.query<{ runs: number; menu: number }>(`
        SELECT
          (SELECT count(*)::int FROM demo_scenario_runs) AS runs,
          (SELECT count(*)::int FROM menu_items WHERE status = 'available') AS menu
      `);
      expect(after.rows[0]).toEqual(before.rows[0]);
      expect(await getActiveDemoRun(client)).toBeNull();
      await client.query("ROLLBACK");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  it("rejects impossible calendar dates before touching PostgreSQL", () => {
    expect(() => parseAnchorDate("2026-02-30")).toThrow("invalid");
    expect(parseAnchorDate("2026-09-04")).toBe("2026-09-04");
  });
});
