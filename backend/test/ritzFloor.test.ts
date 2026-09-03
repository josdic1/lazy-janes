import { afterAll, describe, expect, it } from "vitest";
import { restoreRitzFloor } from "../src/demo/ritzFloor.js";
import { pool } from "../src/db/pool.js";

afterAll(async () => {
  await pool.end();
});

describe("Ritz floor restoration", () => {
  it("restores the canonical areas and tables exactly", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await restoreRitzFloor(client);

      const sections = await client.query<{ name: string; display_order: number }>(`
        SELECT name, display_order
        FROM sections
        ORDER BY display_order, name
      `);
      const tableCount = await client.query<{ count: number }>(`
        SELECT count(*)::int AS count
        FROM dining_tables
      `);
      const main = await client.query<{ label: string; floor_x: number; floor_y: number }>(`
        SELECT t.label, t.floor_x, t.floor_y
        FROM dining_tables t
        JOIN sections s ON s.id = t.section_id
        WHERE s.name = 'Main Dining Room'
        ORDER BY t.label
      `);

      expect(sections.rows.map((row) => row.name)).toEqual([
        "Main Dining Room",
        "Center Booths",
        "Counter",
        "Window Booths",
        "Front Booths",
      ]);
      expect(tableCount.rows[0]?.count).toBe(38);
      expect(main.rows).toHaveLength(15);
      expect(main.rows.some((table) => table.label === "1")).toBe(true);
      expect(main.rows.some((table) => table.label === "8")).toBe(true);

      await client.query("ROLLBACK");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });
});
