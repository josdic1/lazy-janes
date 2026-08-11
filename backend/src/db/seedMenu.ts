import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pool } from "./pool.js";

const seedPath = resolve(
  process.cwd(),
  "db",
  "seeds",
  "001_lazy_janes_menu.sql",
);

async function seedMenu() {
  try {
    const sql = await readFile(seedPath, "utf8");

    await pool.query(sql);

    const result = await pool.query<{
      menu_items: string;
      categories: string;
    }>(`
      SELECT
        count(*) AS menu_items,
        count(DISTINCT category) AS categories
      FROM menu_items
    `);

    const totals = result.rows[0];

    console.log(
      `Menu seeded: ${totals?.menu_items ?? "0"} items across ${
        totals?.categories ?? "0"
      } categories`,
    );
  } finally {
    await pool.end();
  }
}

seedMenu().catch((error: unknown) => {
  console.error("Menu seed failed:", error);
  process.exitCode = 1;
});
