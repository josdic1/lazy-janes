import type { PoolClient } from "pg";
import {
  ingredients as sourceIngredients,
  items as sourceItems,
} from "./menuImport/menuData.js";
import { buildMenuOntology, ingredientKind } from "./menuImport/menuOntology.js";

type DbItem = {
  id: string;
  name: string;
  department: string;
  subcategory: string;
};

type DbIngredient = { id: string; name: string };

const key = (department: string, subcategory: string, name: string) =>
  [department, subcategory, name].join("\u001f").toLowerCase();

/**
 * ONE-TIME IMPORT ONLY.
 *
 * This translates the retained source snapshot into relational menu rows while
 * seeding a brand-new database. It is deliberately not a runtime sync path:
 * once seeded, PostgreSQL is the canonical menu source and manager edits win.
 */
export async function importLegacyMenuData(client: PoolClient): Promise<void> {
  const ontology = buildMenuOntology();

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
          kind,
          is_active,
          is_addable,
          default_add_price,
          add_price_configured,
          allergen_flags,
          sort_order
        )
        VALUES ($1, $2, true, true, 0, false, '{}', 0)
        ON CONFLICT ((lower(name))) DO UPDATE
        SET
          kind = EXCLUDED.kind,
          is_active = true,
          updated_at = now()
      `,
      [ingredient.name, ingredientKind(ingredient.name)],
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

  const preparationUuidBySourceKey = new Map<string, string>();
  for (const [schemeIndex, scheme] of ontology.preparationSchemes.entries()) {
    const schemeResult = await client.query<{ id: string }>(
      `
        INSERT INTO preparation_schemes (
          source_key,
          label,
          kind,
          is_active,
          sort_order
        )
        VALUES ($1, $2, $3, true, $4)
        ON CONFLICT (source_key) DO UPDATE
        SET
          label = EXCLUDED.label,
          kind = EXCLUDED.kind,
          is_active = true,
          sort_order = EXCLUDED.sort_order,
          updated_at = now()
        RETURNING id
      `,
      [scheme.sourceKey, scheme.label, scheme.kind, (schemeIndex + 1) * 10],
    );
    const schemeId = schemeResult.rows[0]?.id;
    if (!schemeId) throw new Error(`Preparation scheme upsert failed: ${scheme.sourceKey}`);
    preparationUuidBySourceKey.set(scheme.sourceKey, schemeId);

    const desiredLabels: string[] = [];
    for (const option of scheme.options) {
      desiredLabels.push(option.label.toLowerCase());
      await client.query(
        `
          INSERT INTO preparation_options (
            preparation_scheme_id,
            label,
            sort_order,
            is_default,
            is_active
          )
          VALUES ($1, $2, $3, $4, true)
          ON CONFLICT (preparation_scheme_id, (lower(label))) DO UPDATE
          SET
            sort_order = EXCLUDED.sort_order,
            is_default = EXCLUDED.is_default,
            is_active = true,
            updated_at = now()
        `,
        [schemeId, option.label, option.sortOrder, option.isDefault],
      );
    }

    await client.query(
      `
        UPDATE preparation_options
        SET is_active = false, updated_at = now()
        WHERE preparation_scheme_id = $1
          AND NOT (lower(label) = ANY($2::text[]))
      `,
      [schemeId, desiredLabels],
    );
  }

  await client.query(`
    UPDATE preparation_schemes
    SET is_active = false, updated_at = now()
    WHERE NOT (source_key = ANY($1::text[]))
  `, [ontology.preparationSchemes.map((scheme) => scheme.sourceKey)]);

  const desiredIngredientIdsByItem = new Map<string, string[]>();
  for (const rule of ontology.componentRules) {
    const itemId = itemUuidBySourceId.get(rule.itemId);
    const ingredientId = ingredientUuidBySourceId.get(rule.ingredientId);
    if (!itemId || !ingredientId) continue;

    const preparationSchemeId = rule.preparationSourceKey
      ? preparationUuidBySourceKey.get(rule.preparationSourceKey) ?? null
      : null;

    const desired = desiredIngredientIdsByItem.get(itemId) ?? [];
    desired.push(ingredientId);
    desiredIngredientIdsByItem.set(itemId, desired);

    await client.query(
      `
        INSERT INTO menu_item_ingredients (
          menu_item_id,
          ingredient_id,
          role,
          relationship,
          preparation_scheme_id,
          can_remove,
          can_side,
          can_extra,
          can_replace,
          replacement_options_configured,
          extra_price,
          extra_price_configured,
          sort_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, false, $11)
        ON CONFLICT (menu_item_id, ingredient_id) DO UPDATE
        SET
          role = EXCLUDED.role,
          relationship = EXCLUDED.relationship,
          preparation_scheme_id = EXCLUDED.preparation_scheme_id,
          can_remove = EXCLUDED.can_remove,
          can_side = EXCLUDED.can_side,
          can_extra = EXCLUDED.can_extra,
          can_replace = EXCLUDED.can_replace,
          replacement_options_configured =
            EXCLUDED.replacement_options_configured,
          sort_order = EXCLUDED.sort_order,
          updated_at = now()
      `,
      [
        itemId,
        ingredientId,
        rule.role,
        rule.relationship,
        preparationSchemeId,
        rule.canRemove,
        rule.canSide,
        rule.canExtra,
        rule.canReplace,
        rule.replacementOptionsConfigured,
        rule.sortOrder,
      ],
    );
  }

  for (const itemId of itemUuidBySourceId.values()) {
    const ingredientIds = desiredIngredientIdsByItem.get(itemId) ?? [];
    if (ingredientIds.length === 0) {
      await client.query(
        "DELETE FROM menu_item_ingredients WHERE menu_item_id = $1",
        [itemId],
      );
      continue;
    }
    await client.query(
      `
        DELETE FROM menu_item_ingredients
        WHERE menu_item_id = $1
          AND NOT (ingredient_id = ANY($2::uuid[]))
      `,
      [itemId, ingredientIds],
    );
  }

  // Rebuild explicit PART -> SUB FOR permissions from canonical policy.
  // Carrier identity alone grants no substitution permission.
  // Retained choice-group replacements are normalized separately after import.
  for (const itemId of itemUuidBySourceId.values()) {
    await client.query(
      "DELETE FROM menu_item_ingredient_replacements WHERE menu_item_id = $1",
      [itemId],
    );
  }

  for (const rule of ontology.replacementRules) {
    const itemId = itemUuidBySourceId.get(rule.itemId);
    const sourceIngredientId =
      ingredientUuidBySourceId.get(rule.sourceIngredientId);
    const replacementIngredientId =
      ingredientUuidBySourceId.get(rule.replacementIngredientId);

    if (!itemId || !sourceIngredientId || !replacementIngredientId) continue;

    const preparationSchemeId = rule.preparationSourceKey
      ? preparationUuidBySourceKey.get(rule.preparationSourceKey) ?? null
      : null;

    await client.query(
      `
        INSERT INTO menu_item_ingredient_replacements (
          menu_item_id,
          source_ingredient_id,
          replacement_ingredient_id,
          preparation_scheme_id,
          price_adjustment,
          price_adjustment_configured,
          sort_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (
          menu_item_id,
          source_ingredient_id,
          replacement_ingredient_id
        ) DO UPDATE
        SET
          preparation_scheme_id = EXCLUDED.preparation_scheme_id,
          price_adjustment = EXCLUDED.price_adjustment,
          price_adjustment_configured = EXCLUDED.price_adjustment_configured,
          sort_order = EXCLUDED.sort_order,
          updated_at = now()
      `,
      [
        itemId,
        sourceIngredientId,
        replacementIngredientId,
        preparationSchemeId,
        rule.priceAdjustment,
        rule.priceConfigured,
        rule.sortOrder,
      ],
    );
  }

  // Choice groups are rebuilt from the component graph. This deliberately
  // removes the old flat modifier-derived groups such as Protein + Bacon +
  // Chicken + No Protein when Bacon and Chicken are already standard recipe
  // components. Historical order snapshots survive because their FKs are SET NULL.
  for (const itemId of itemUuidBySourceId.values()) {
    await client.query("DELETE FROM menu_choice_groups WHERE menu_item_id = $1", [itemId]);
  }

  for (const slot of ontology.choiceSlots) {
    const itemId = itemUuidBySourceId.get(slot.itemId);
    if (!itemId) continue;

    const groupResult = await client.query<{ id: string }>(
      `
        INSERT INTO menu_choice_groups (
          menu_item_id,
          label,
          role,
          relationship,
          min_selections,
          max_selections,
          sort_order,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        RETURNING id
      `,
      [
        itemId,
        slot.label,
        slot.role,
        slot.relationship,
        slot.minSelections,
        slot.maxSelections,
        slot.sortOrder,
      ],
    );
    const groupId = groupResult.rows[0]?.id;
    if (!groupId) throw new Error(`Choice slot insert failed: ${slot.label}`);

    for (const option of slot.options) {
      const ingredientId = option.ingredientId
        ? ingredientUuidBySourceId.get(option.ingredientId) ?? null
        : null;
      const preparationSchemeId = option.preparationSourceKey
        ? preparationUuidBySourceKey.get(option.preparationSourceKey) ?? null
        : null;

      await client.query(
        `
          INSERT INTO menu_choice_options (
            choice_group_id,
            label,
            ingredient_id,
            preparation_scheme_id,
            is_none_option,
            price_adjustment,
            price_adjustment_configured,
            sort_order,
            is_default,
            is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        `,
        [
          groupId,
          option.label,
          ingredientId,
          preparationSchemeId,
          option.isNoneOption,
          option.priceAdjustment ?? 0,
          option.priceConfigured,
          option.sortOrder,
          option.isDefault,
        ],
      );
    }
  }
}
