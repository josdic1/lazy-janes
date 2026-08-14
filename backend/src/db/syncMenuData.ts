import type { PoolClient } from "pg";
import {
  ingredients as sourceIngredients,
  itemIngredients as sourceItemIngredients,
  itemModifierGroups,
  items as sourceItems,
  modifierGroups,
  modifiers,
} from "../data/menuData.js";
import { pool } from "./pool.js";

type DbItem = {
  id: string;
  name: string;
  department: string;
  subcategory: string;
};

type DbIngredient = { id: string; name: string };

const key = (department: string, subcategory: string, name: string) =>
  [department, subcategory, name].join("\u001f").toLowerCase();

const unusableOption = (name: string) => {
  const value = name.toLowerCase();
  return (
    value.includes("verify") ||
    value === "substitution" ||
    value === "side" ||
    value === "bread type" ||
    value === "toast prep" ||
    value.startsWith("preparation —")
  );
};

export async function applyNormalizedMenuData(client: PoolClient): Promise<void> {
  const dbItemsResult = await client.query<DbItem>(`
    SELECT
      item.id,
      item.name,
      menu_group.name AS department,
      category.name AS subcategory
    FROM menu_items item
    JOIN menu_categories category ON category.id = item.category_id
    JOIN menu_groups menu_group ON menu_group.id = category.group_id
    WHERE item.is_modifier = false
  `);

  const dbItems = new Map(
    dbItemsResult.rows.map((item) => [
      key(item.department, item.subcategory, item.name),
      item,
    ]),
  );

  if (dbItems.size !== sourceItems.length) {
    throw new Error(
      `Normalized menu sync expected ${sourceItems.length} base items but found ${dbItems.size}`,
    );
  }

  const itemUuidBySourceId = new Map<string, string>();
  for (const item of sourceItems) {
    const dbItem = dbItems.get(key(item.department, item.subcategory, item.name));
    if (!dbItem) {
      throw new Error(
        `Normalized menu item not found: ${item.department} > ${item.subcategory} > ${item.name}`,
      );
    }
    itemUuidBySourceId.set(item.id, dbItem.id);
    await client.query(
      `
        UPDATE menu_items
        SET
          source_key = $2,
          is_kids = $3,
          has_kids_version = $4,
          source_review_needed = $5,
          source_review_notes = $6,
          updated_at = now()
        WHERE id = $1
      `,
      [
        dbItem.id,
        item.id,
        item.isKids,
        item.hasKidsVersion,
        item.reviewNeeded,
        item.reviewNotes,
      ],
    );
  }

  for (const ingredient of sourceIngredients) {
    await client.query(
      `
        INSERT INTO ingredients (
          name,
          is_active,
          is_addable,
          default_add_price,
          add_price_configured,
          allergen_flags,
          sort_order
        )
        VALUES ($1, true, true, 0, false, '{}', 0)
        ON CONFLICT ((lower(name))) DO UPDATE
        SET is_active = true, updated_at = now()
      `,
      [ingredient.name],
    );
  }

  const dbIngredientResult = await client.query<DbIngredient>(`
    SELECT id, name FROM ingredients
  `);
  const ingredientUuidByName = new Map(
    dbIngredientResult.rows.map((ingredient) => [
      ingredient.name.toLowerCase(),
      ingredient.id,
    ]),
  );

  const ingredientUuidBySourceId = new Map<string, string>();
  for (const ingredient of sourceIngredients) {
    const uuid = ingredientUuidByName.get(ingredient.name.toLowerCase());
    if (!uuid) throw new Error(`Ingredient not found after upsert: ${ingredient.name}`);
    ingredientUuidBySourceId.set(ingredient.id, uuid);
  }

  const desiredIngredientIdsByItem = new Map<string, string[]>();
  for (const link of sourceItemIngredients) {
    const itemId = itemUuidBySourceId.get(link.itemId);
    const ingredientId = ingredientUuidBySourceId.get(link.ingredientId);
    if (!itemId || !ingredientId) continue;

    const desired = desiredIngredientIdsByItem.get(itemId) ?? [];
    desired.push(ingredientId);
    desiredIngredientIdsByItem.set(itemId, desired);

    await client.query(
      `
        INSERT INTO menu_item_ingredients (
          menu_item_id,
          ingredient_id,
          can_remove,
          can_side,
          can_extra,
          extra_price,
          extra_price_configured,
          sort_order
        )
        VALUES ($1, $2, $3, $4, $5, 0, false, $6)
        ON CONFLICT (menu_item_id, ingredient_id) DO UPDATE
        SET
          can_remove = EXCLUDED.can_remove,
          can_side = EXCLUDED.can_side,
          can_extra = EXCLUDED.can_extra,
          sort_order = EXCLUDED.sort_order,
          updated_at = now()
      `,
      [
        itemId,
        ingredientId,
        link.canRemove,
        link.canSide,
        link.canExtra,
        link.sortOrder,
      ],
    );
  }

  for (const [itemId, ingredientIds] of desiredIngredientIdsByItem) {
    await client.query(
      `
        DELETE FROM menu_item_ingredients
        WHERE menu_item_id = $1
          AND NOT (ingredient_id = ANY($2::uuid[]))
      `,
      [itemId, ingredientIds],
    );
  }

  const groupById = new Map(modifierGroups.map((group) => [group.id, group]));
  const optionsByGroup = new Map<string, typeof modifiers>();
  for (const modifier of modifiers) {
    const current = optionsByGroup.get(modifier.modifierGroupId) ?? [];
    current.push(modifier);
    optionsByGroup.set(modifier.modifierGroupId, current);
  }

  const linksByItem = new Map<string, typeof itemModifierGroups>();
  for (const link of itemModifierGroups) {
    const current = linksByItem.get(link.itemId) ?? [];
    current.push(link);
    linksByItem.set(link.itemId, current);
  }

  for (const sourceItem of sourceItems) {
    const itemId = itemUuidBySourceId.get(sourceItem.id);
    if (!itemId) continue;
    for (const link of (linksByItem.get(sourceItem.id) ?? []).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    )) {
      const group = groupById.get(link.modifierGroupId);
      if (!group || group.kind === "sauce") continue;

      // Do not manufacture free optional add-ons from menu text that has no
      // price truth. Existing priced optional groups remain untouched; this
      // source sync adds the missing required operational decisions.
      if (group.minSelections === 0) continue;

      const usableOptions = (optionsByGroup.get(group.id) ?? [])
        .filter((option) => !unusableOption(option.name))
        .sort((a, b) => a.sortOrder - b.sortOrder);

      if (usableOptions.length < Math.max(group.minSelections, 2)) continue;
      const groupResult = await client.query<{ id: string }>(
        `
          INSERT INTO menu_choice_groups (
            menu_item_id,
            label,
            min_selections,
            max_selections,
            sort_order,
            is_active
          )
          VALUES ($1, $2, $3, $4, $5, true)
          ON CONFLICT (menu_item_id, (lower(label))) DO UPDATE
          SET
            min_selections = EXCLUDED.min_selections,
            max_selections = EXCLUDED.max_selections,
            sort_order = EXCLUDED.sort_order,
            is_active = true,
            updated_at = now()
          RETURNING id
        `,
        [
          itemId,
          group.displayName,
          group.minSelections,
          Math.min(group.maxSelections, usableOptions.length),
          link.sortOrder,
        ],
      );
      const groupId = groupResult.rows[0]?.id;
      if (!groupId) throw new Error(`Choice group upsert failed: ${group.displayName}`);

      const desiredOptions: string[] = [];
      for (const option of usableOptions) {
        desiredOptions.push(option.name);
        const ingredientId =
          ingredientUuidByName.get(option.name.toLowerCase()) ?? null;
        await client.query(
          `
            INSERT INTO menu_choice_options (
              choice_group_id,
              label,
              ingredient_id,
              price_adjustment,
              sort_order,
              is_default,
              is_active
            )
            VALUES ($1, $2, $3, 0, $4, false, true)
            ON CONFLICT (choice_group_id, (lower(label))) DO UPDATE
            SET
              ingredient_id = COALESCE(EXCLUDED.ingredient_id, menu_choice_options.ingredient_id),
              sort_order = EXCLUDED.sort_order,
              is_active = true,
              updated_at = now()
          `,
          [groupId, option.name, ingredientId, option.sortOrder],
        );
      }

      await client.query(
        `
          UPDATE menu_choice_options
          SET is_active = false, updated_at = now()
          WHERE choice_group_id = $1
            AND NOT (lower(label) = ANY($2::text[]))
        `,
        [groupId, desiredOptions.map((option) => option.toLowerCase())],
      );
    }
  }
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("LOCK TABLE menu_items IN SHARE ROW EXCLUSIVE MODE");
    await applyNormalizedMenuData(client);
    await client.query("COMMIT");
    console.log(
      `Normalized menu synchronized: ${sourceItems.length} items, ${sourceIngredients.length} ingredients, ${modifierGroups.length} reusable modifier definitions`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (process.argv[1]?.endsWith("syncMenuData.ts") || process.argv[1]?.endsWith("syncMenuData.js")) {
  main().catch((error: unknown) => {
    console.error("Normalized menu sync failed:", error);
    process.exitCode = 1;
  });
}
