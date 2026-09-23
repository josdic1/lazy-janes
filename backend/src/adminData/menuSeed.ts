import { readFile } from "node:fs/promises";
import type { PoolClient } from "pg";
import { importLegacyMenuData } from "../db/importLegacyMenuData.js";

export type MenuSeedSummary = {
  loaded: boolean;
  menuItems: number;
  categories: number;
};

const seedUrl = new URL(
  "../../db/seeds/001_lazy_janes_menu.sql",
  import.meta.url,
);

async function currentMenuSummary(client: PoolClient) {
  const result = await client.query<{
    menu_items: number;
    categories: number;
    groups: number;
    ingredients: number;
  }>(`
    SELECT
      (SELECT count(*)::int FROM menu_items) AS menu_items,
      (SELECT count(*)::int FROM menu_categories) AS categories,
      (SELECT count(*)::int FROM menu_groups) AS groups,
      (SELECT count(*)::int FROM ingredients) AS ingredients
  `);

  return {
    menuItems: result.rows[0]?.menu_items ?? 0,
    categories: result.rows[0]?.categories ?? 0,
    groups: result.rows[0]?.groups ?? 0,
    ingredients: result.rows[0]?.ingredients ?? 0,
  };
}

export async function preloadCanonicalMenu(
  client: PoolClient,
): Promise<MenuSeedSummary> {
  await client.query("LOCK TABLE menu_items IN EXCLUSIVE MODE");

  const current = await currentMenuSummary(client);
  if (current.menuItems > 0) {
    return {
      loaded: false,
      menuItems: current.menuItems,
      categories: current.categories,
    };
  }

  if (current.groups === 0 || current.categories === 0) {
    throw Object.assign(
      new Error("Canonical menu taxonomy is unavailable. Run database migrations before loading the menu."),
      { statusCode: 409 },
    );
  }

  if (current.ingredients > 0) {
    throw Object.assign(
      new Error("Menu composition data exists without menu items. Clear ALL Except Admin before loading the canonical menu."),
      { statusCode: 409 },
    );
  }

  const sql = await readFile(seedUrl, "utf8");
  await client.query(sql);

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
  await importLegacyMenuData(client);
  await client.query(
    "SELECT normalize_component_capabilities()",
  );

  await client.query(`
    UPDATE menu_item_ingredients component
    SET
      can_replace = true,
      replacement_options_configured = true,
      updated_at = now()
    WHERE EXISTS (
      SELECT 1
      FROM menu_item_ingredient_replacements replacement
      WHERE replacement.menu_item_id = component.menu_item_id
        AND replacement.source_ingredient_id = component.ingredient_id
    )
  `);

  const seeded = await currentMenuSummary(client);
  return {
    loaded: true,
    menuItems: seeded.menuItems,
    categories: seeded.categories,
  };
}
