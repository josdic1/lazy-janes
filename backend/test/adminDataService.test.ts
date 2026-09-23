import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import {
  clearAllExceptAdmin,
  loadSampleActivity,
  preloadAdminData,
} from "../src/adminData/adminDataService.js";
import { pool } from "../src/db/pool.js";

async function addUser(
  client: Awaited<ReturnType<typeof pool.connect>>,
  id: string,
  displayName: string,
  role: "admin" | "server",
) {
  await client.query(
    `INSERT INTO users (id, display_name) VALUES ($1, $2)`,
    [id, displayName],
  );
  await client.query(
    `INSERT INTO user_roles (user_id, role_code) VALUES ($1, $2)`,
    [id, role],
  );
}

afterAll(async () => {
  await pool.end();
});

describe("admin seed data service", () => {
  it("clears project data while preserving exactly the current admin", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const adminId = randomUUID();
      const otherId = randomUUID();
      await addUser(client, adminId, `Reset Admin ${adminId}`, "admin");
      await addUser(client, otherId, `Reset Server ${otherId}`, "server");

      const section = await client.query<{ id: string }>(`
        INSERT INTO sections (name, display_order)
        VALUES ('Reset Fixture', 9999)
        RETURNING id
      `);
      await client.query(
        `
          INSERT INTO dining_tables (section_id, label, capacity)
          VALUES ($1, 'RESET', 2)
        `,
        [section.rows[0]!.id],
      );

      const result = await clearAllExceptAdmin(client, adminId);

      expect(result.summary.users).toBe(1);
      expect(result.summary.menuItems).toBe(0);
      expect(result.summary.tables).toBe(0);

      const users = await client.query<{ id: string; role_code: string }>(`
        SELECT u.id, role.role_code
        FROM users u
        JOIN user_roles role ON role.user_id = u.id
      `);
      expect(users.rows).toEqual([{ id: adminId, role_code: "admin" }]);

      await client.query("ROLLBACK");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  it("preloads tables without deleting or duplicating an existing floor", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`TRUNCATE TABLE sections RESTART IDENTITY CASCADE`);

      const first = await preloadAdminData(client, "tables");
      const firstCount = first.summary.tables;
      expect(firstCount).toBeGreaterThan(0);

      const second = await preloadAdminData(client, "tables");
      expect(second.summary.tables).toBe(firstCount);
      expect(second.message).toContain("already configured");

      await client.query("ROLLBACK");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  it("preloads sample staff idempotently", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const adminId = randomUUID();
      await addUser(client, adminId, `Staff Preload Admin ${adminId}`, "admin");
      await clearAllExceptAdmin(client, adminId);

      const first = await preloadAdminData(client, "staff");
      const second = await preloadAdminData(client, "staff");

      const demoUsers = await client.query<{ count: number }>(`
        SELECT count(*)::int AS count
        FROM users
        WHERE is_demo = true
      `);
      expect(demoUsers.rows[0]?.count).toBe(4);
      expect(second.summary.users).toBe(first.summary.users);

      await client.query("ROLLBACK");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

  it("populates a complete demo from an empty project in one action", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const adminId = randomUUID();
      await addUser(client, adminId, `Demo Populate Admin ${adminId}`, "admin");
      await clearAllExceptAdmin(client, adminId);

      const result = await loadSampleActivity(client, {
        preset: "slow-day",
        anchorDate: "2026-09-23",
        adminUserId: adminId,
      });

      expect(result.summary.users).toBe(5);
      expect(result.summary.menuItems).toBeGreaterThan(0);
      expect(result.summary.tables).toBeGreaterThan(0);
      expect(result.summary.orders).toBeGreaterThan(0);

      await client.query("ROLLBACK");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

});
