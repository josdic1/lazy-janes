import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pool } from "./pool.js";
import { applyNormalizedMenuData } from "./syncMenuData.js";

const seedPath = resolve(
  process.cwd(),
  "db",
  "seeds",
  "001_lazy_janes_menu.sql",
);

async function seedMenu() {
  const sql = await readFile(seedPath, "utf8");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "LOCK TABLE menu_items IN EXCLUSIVE MODE",
    );

    const existingResult = await client.query<{
      menu_items: string;
    }>(`
      SELECT count(*) AS menu_items
      FROM menu_items
    `);

    const existingCount = Number(
      existingResult.rows[0]?.menu_items ?? "0",
    );

    if (existingCount > 0) {
      throw new Error(
        `menu_items already contains ${existingCount} rows; seed cancelled`,
      );
    }

    await client.query(sql);

    // The SQL seed creates the temporary legacy choice rows exactly once.
    // Translate them into the composition model, then retire those rows.
    await client.query(
      "SELECT migrate_lazy_janes_legacy_modifiers_to_composition()",
    );
    await client.query(
      "SELECT seed_lazy_janes_menu_composition()",
    );
    await client.query(
      "SELECT normalize_lazy_janes_add_extra_pricing()",
    );
    await client.query(
      "SELECT seed_lazy_janes_service_handling()",
    );
    await client.query(
      "SELECT assert_lazy_janes_choice_group_integrity()",
    );
    await applyNormalizedMenuData(client);

    const result = await client.query<{
      menu_items: string;
      categories: string;
    }>(`
      SELECT
        count(*) AS menu_items,
        count(DISTINCT category_id) AS categories
      FROM menu_items
    `);

    await client.query("COMMIT");

    const totals = result.rows[0];

    console.log(
      `Menu seeded: ${totals?.menu_items ?? "0"} items across ${
        totals?.categories ?? "0"
      } categories`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedMenu().catch((error: unknown) => {
  console.error("Menu seed failed:", error);
  process.exitCode = 1;
});
