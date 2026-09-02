import {
  createIngredientInputSchema,
  createMenuItemInputSchema,
  menuItemSafetyOverrideInputSchema,
  replaceMenuItemCustomizationInputSchema,
  updateIngredientInputSchema,
  updateMenuItemInputSchema,
} from "@lazy-janes/shared";
import type {
  AllergenFlag,
  ComponentRelationship,
  ComponentRole,
  Ingredient,
  IngredientKind,
  IngredientPopularity,
  MenuCategory,
  MenuCustomizationCatalog,
  MenuGroup,
  MenuItem,
  MenuItemIngredient,
  MenuItemIngredientReplacement,
  MenuItemSafetyDeclaration,
  MenuItemSafetyDeclarationInput,
  MenuItemSafetyOverrideAuditEvent,
  MenuItemStatus,
  PreparationKind,
  PreparationScheme,
  UniversalComponentRole,
} from "@lazy-janes/shared";
import { Router } from "express";
import type { PoolClient } from "pg";
import { z } from "zod";
import {
  getAuthenticatedUser,
  requireAnyRole,
  requireAuthenticatedUser,
  requireRole,
} from "../auth/session.js";
import { pool } from "../db/pool.js";
import { getCustomizationCatalog } from "../menuCustomizationCatalog.js";
import { getMenuRules } from "../menuRules.js";
import { normalizeLazyJanesMenu } from "../menuNormalization/lazyJanesMenuAdapter.js";

type MenuItemRow = {
  id: string;
  parent_item_id: string | null;
  name: string;
  description: string | null;
  category_id: string;
  price: string;
  price_configured: boolean;
  status: MenuItemStatus;
  is_special: boolean;
  is_kids: boolean;
  has_kids_version: boolean;
  source_key: string | null;
  source_review_needed: boolean;
  source_review_notes: string;
  is_modifier: boolean;
  dietary_flags: string[];
  safety_declarations: MenuItemSafetyDeclaration[];
  has_manual_safety_override: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

type MenuGroupRow = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

type MenuCategoryRow = {
  id: string;
  group_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

type IngredientRow = {
  id: string;
  name: string;
  kind: IngredientKind;
  is_active: boolean;
  is_addable: boolean;
  default_add_price: string;
  add_price_configured: boolean;
  allergen_flags: AllergenFlag[];
  sort_order: number;
};

type ItemIngredientRow = {
  menu_item_id: string;
  ingredient_id: string;
  ingredient_name: string;
  ingredient_kind: IngredientKind;
  role: ComponentRole;
  contextual_role: UniversalComponentRole | null;
  relationship: ComponentRelationship | null;
  preparation_scheme_id: string | null;
  allergen_flags: AllergenFlag[];
  can_remove: boolean;
  can_side: boolean;
  can_extra: boolean;
  can_replace: boolean;
  replacement_options_configured: boolean;
  extra_price: string;
  extra_price_configured: boolean;
  sort_order: number;
};

type ItemIngredientReplacementRow = {
  menu_item_id: string;
  source_ingredient_id: string;
  replacement_ingredient_id: string;
  replacement_ingredient_name: string;
  replacement_ingredient_kind: IngredientKind;
  preparation_scheme_id: string | null;
  price_adjustment: string;
  price_adjustment_configured: boolean;
  sort_order: number;
};

type PreparationSchemeRow = {
  id: string;
  source_key: string;
  label: string;
  kind: PreparationKind;
  sort_order: number;
  is_active: boolean;
};

type PreparationOptionRow = {
  id: string;
  preparation_scheme_id: string;
  label: string;
  sort_order: number;
  is_default: boolean;
  is_active: boolean;
};

type IngredientPopularityAggregateRow = {
  ingredient_id: string;
  add_count: number;
  order_count: number;
};

const POPULARITY_WINDOW_DAYS = 90;
const ITEM_POPULARITY_MIN_ADDS = 3;
const ITEM_POPULARITY_MIN_RATE = 0.1;
const CATEGORY_POPULARITY_MIN_ADDS = 5;
const CATEGORY_POPULARITY_MIN_RATE = 0.05;

const idSchema = z.string().uuid();

const menuSelect = `
  SELECT
    menu_items.id,
    menu_items.parent_item_id,
    menu_items.name,
    menu_items.description,
    menu_items.category_id,
    menu_items.price,
    menu_items.price_configured,
    menu_items.status,
    menu_items.is_special,
    menu_items.is_kids,
    menu_items.has_kids_version,
    menu_items.source_key,
    menu_items.source_review_needed,
    menu_items.source_review_notes,
    menu_items.is_modifier,
    menu_items.dietary_flags,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', safety.id,
            'menuItemId', safety.menu_item_id,
            'kind', safety.kind,
            'allergenFlag', safety.allergen_flag,
            'note', safety.note,
            'sortOrder', safety.sort_order,
            'isManualOverride', safety.source = 'manual_override'
          )
          ORDER BY safety.sort_order, safety.kind, safety.id
        )
        FROM menu_item_safety_declarations safety
        WHERE safety.menu_item_id = menu_items.id
      ),
      '[]'::jsonb
    ) AS safety_declarations,
    EXISTS (
      SELECT 1
      FROM menu_item_safety_declarations manual_safety
      WHERE manual_safety.menu_item_id = menu_items.id
        AND manual_safety.source = 'manual_override'
    ) AS has_manual_safety_override,
    menu_items.sort_order,
    menu_items.created_at,
    menu_items.updated_at
  FROM menu_items
`;

export function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    parentItemId: row.parent_item_id,
    name: row.name,
    description: row.description,
    categoryId: row.category_id,
    price: Number(row.price),
    priceConfigured: row.price_configured,
    status: row.status,
    isSpecial: row.is_special,
    isKids: row.is_kids,
    hasKidsVersion: row.has_kids_version,
    sourceKey: row.source_key,
    sourceReviewNeeded: row.source_review_needed,
    sourceReviewNotes: row.source_review_notes,
    isModifier: row.is_modifier,
    dietaryFlags: row.dietary_flags,
    safetyDeclarations: row.safety_declarations,
    hasManualSafetyOverride: row.has_manual_safety_override,
    sortOrder: row.sort_order,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

async function getManualSafetyDeclarations(
  client: PoolClient,
  menuItemId: string,
): Promise<MenuItemSafetyDeclarationInput[]> {
  const result = await client.query<{
    kind: MenuItemSafetyDeclarationInput["kind"];
    allergen_flag: MenuItemSafetyDeclarationInput["allergenFlag"];
    note: string | null;
    sort_order: number;
  }>(
    `
      SELECT kind, allergen_flag, note, sort_order
      FROM menu_item_safety_declarations
      WHERE menu_item_id = $1
        AND source = 'manual_override'
      ORDER BY sort_order, kind, allergen_flag NULLS LAST, id
    `,
    [menuItemId],
  );

  return result.rows.map((row) => ({
    kind: row.kind,
    allergenFlag: row.allergen_flag,
    note: row.note,
    sortOrder: row.sort_order,
  }));
}

async function replaceManualSafetyDeclarations(
  client: PoolClient,
  menuItemId: string,
  declarations: MenuItemSafetyDeclarationInput[],
): Promise<void> {
  await client.query(
    `DELETE FROM menu_item_safety_declarations
     WHERE menu_item_id = $1 AND source = 'manual_override'`,
    [menuItemId],
  );

  for (const declaration of declarations) {
    await client.query(
      `
        INSERT INTO menu_item_safety_declarations (
          menu_item_id, kind, allergen_flag, note, sort_order, source
        )
        VALUES ($1, $2, $3, $4, $5, 'manual_override')
      `,
      [
        menuItemId,
        declaration.kind,
        declaration.allergenFlag,
        declaration.note,
        declaration.sortOrder,
      ],
    );
  }
}
function toIngredient(row: IngredientRow): Ingredient {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    isActive: row.is_active,
    isAddable: row.is_addable,
    defaultAddPrice: Number(row.default_add_price),
    addPriceConfigured: row.add_price_configured,
    allergenFlags: row.allergen_flags,
    sortOrder: row.sort_order,
  };
}

function toItemIngredient(
  row: ItemIngredientRow,
): MenuItemIngredient {
  return {
    menuItemId: row.menu_item_id,
    ingredientId: row.ingredient_id,
    ingredientName: row.ingredient_name,
    ingredientKind: row.ingredient_kind,
    role: row.role,
    contextualRole: row.contextual_role,
    relationship: row.relationship,
    preparationSchemeId: row.preparation_scheme_id,
    allergenFlags: row.allergen_flags,
    canRemove: row.can_remove,
    canSide: row.can_side,
    canExtra: row.can_extra,
    canReplace: row.can_replace,
    replacementOptionsConfigured: row.replacement_options_configured,
    extraPrice: Number(row.extra_price),
    extraPriceConfigured: row.extra_price_configured,
    sortOrder: row.sort_order,
  };
}

function toItemIngredientReplacement(
  row: ItemIngredientReplacementRow,
): MenuItemIngredientReplacement {
  return {
    menuItemId: row.menu_item_id,
    sourceIngredientId: row.source_ingredient_id,
    replacementIngredientId: row.replacement_ingredient_id,
    replacementIngredientName: row.replacement_ingredient_name,
    replacementIngredientKind: row.replacement_ingredient_kind,
    preparationSchemeId: row.preparation_scheme_id,
    priceAdjustment: Number(row.price_adjustment),
    priceAdjustmentConfigured: row.price_adjustment_configured,
    sortOrder: row.sort_order,
  };
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const result = await pool.query<MenuItemRow>(`
    ${menuSelect}
    WHERE is_modifier = false
    ORDER BY sort_order, name
  `);

  return result.rows.map(toMenuItem);
}



type ManualItemReadiness = {
  ready: boolean;
  issues: string[];
};

async function getManualItemReadiness(
  client: PoolClient,
  itemId: string,
): Promise<ManualItemReadiness> {
  const itemResult = await client.query<{
    source_key: string | null;
    price_configured: boolean;
  }>(
    "SELECT source_key, price_configured FROM menu_items WHERE id = $1",
    [itemId],
  );
  const item = itemResult.rows[0];
  if (!item) return { ready: false, issues: ["Menu item not found"] };

  // Imported menu items retain their historical evidence/unknowns. This gate
  // exists only for manually-created items, which start with source_key NULL.
  if (item.source_key !== null) return { ready: true, issues: [] };

  const componentResult = await client.query<{
    component_count: string;
    missing_relationship_count: string;
    missing_umo_role_count: string;
    unconfirmed_extra_price_count: string;
    incomplete_replacement_count: string;
  }>(
    `
      SELECT
        COUNT(*)::text AS component_count,
        COUNT(*) FILTER (WHERE relationship IS NULL)::text AS missing_relationship_count,
        COUNT(*) FILTER (WHERE umo_role IS NULL)::text AS missing_umo_role_count,
        COUNT(*) FILTER (
          WHERE can_extra = true AND extra_price_configured = false
        )::text AS unconfirmed_extra_price_count,
        COUNT(*) FILTER (
          WHERE can_replace = true
            AND (
              replacement_options_configured = false
              OR NOT EXISTS (
                SELECT 1
                FROM menu_item_ingredient_replacements replacement
                WHERE replacement.menu_item_id = menu_item_ingredients.menu_item_id
                  AND replacement.source_ingredient_id = menu_item_ingredients.ingredient_id
              )
            )
        )::text AS incomplete_replacement_count
      FROM menu_item_ingredients
      WHERE menu_item_id = $1
    `,
    [itemId],
  );

  const choiceResult = await client.query<{
    choice_count: string;
    missing_relationship_count: string;
    missing_maximum_count: string;
    unconfirmed_price_count: string;
  }>(
    `
      SELECT
        COUNT(DISTINCT group_record.id)::text AS choice_count,
        COUNT(DISTINCT group_record.id) FILTER (
          WHERE group_record.relationship IS NULL
        )::text AS missing_relationship_count,
        COUNT(DISTINCT group_record.id) FILTER (
          WHERE group_record.max_selections IS NULL
        )::text AS missing_maximum_count,
        COUNT(option_record.id) FILTER (
          WHERE option_record.price_adjustment_configured = false
        )::text AS unconfirmed_price_count
      FROM menu_choice_groups group_record
      LEFT JOIN menu_choice_options option_record
        ON option_record.choice_group_id = group_record.id
        AND option_record.is_active = true
      WHERE group_record.menu_item_id = $1
        AND group_record.is_active = true
    `,
    [itemId],
  );

  const replacementPriceResult = await client.query<{ count: string }>(
    `
      SELECT COUNT(*)::text AS count
      FROM menu_item_ingredient_replacements
      WHERE menu_item_id = $1
        AND price_adjustment_configured = false
    `,
    [itemId],
  );

  const components = componentResult.rows[0];
  const choices = choiceResult.rows[0];
  const issues: string[] = [];

  if (!item.price_configured) {
    issues.push("Add a selling price before publishing");
  }

  const componentCount = Number(components?.component_count ?? 0);
  const choiceCount = Number(choices?.choice_count ?? 0);
  if (componentCount + choiceCount === 0) {
    issues.push("Add at least one component or real customer choice");
  }
  if (Number(components?.missing_relationship_count ?? 0) > 0) {
    issues.push("Every component must say whether it is part of the item or comes alongside");
  }
  if (Number(components?.missing_umo_role_count ?? 0) > 0) {
    issues.push("Every component must have its job in this item defined");
  }
  if (Number(components?.unconfirmed_extra_price_count ?? 0) > 0) {
    issues.push("Confirm the price for every component that can be ordered EXTRA");
  }
  if (Number(components?.incomplete_replacement_count ?? 0) > 0) {
    issues.push("Every enabled substitution must have at least one configured replacement");
  }
  if (Number(choices?.missing_relationship_count ?? 0) > 0) {
    issues.push("Every component choice must say whether it belongs in the item or comes alongside");
  }
  if (Number(choices?.missing_maximum_count ?? 0) > 0) {
    issues.push("Every choice must have a maximum selection count");
  }
  if (Number(choices?.unconfirmed_price_count ?? 0) > 0) {
    issues.push("Confirm the price adjustment for every choice option, including $0");
  }
  if (Number(replacementPriceResult.rows[0]?.count ?? 0) > 0) {
    issues.push("Confirm the price adjustment for every substitution, including $0");
  }

  return { ready: issues.length === 0, issues };
}

export const menuRouter = Router();
menuRouter.use(requireAuthenticatedUser);

menuRouter.get("/taxonomy", async (_request, response) => {
  const [groupsResult, categoriesResult] = await Promise.all([
    pool.query<MenuGroupRow>(`
      SELECT id, name, sort_order, is_active
      FROM menu_groups
      ORDER BY sort_order, name
    `),
    pool.query<MenuCategoryRow>(`
      SELECT id, group_id, name, sort_order, is_active
      FROM menu_categories
      ORDER BY sort_order, name
    `),
  ]);

  const categoriesByGroup = new Map<string, MenuCategory[]>();

  for (const category of categoriesResult.rows) {
    const current = categoriesByGroup.get(category.group_id) ?? [];
    current.push({
      id: category.id,
      groupId: category.group_id,
      name: category.name,
      sortOrder: category.sort_order,
      isActive: category.is_active,
    });
    categoriesByGroup.set(category.group_id, current);
  }

  const taxonomy: MenuGroup[] = groupsResult.rows.map((group) => ({
    id: group.id,
    name: group.name,
    sortOrder: group.sort_order,
    isActive: group.is_active,
    categories: categoriesByGroup.get(group.id) ?? [],
  }));

  response.json(taxonomy);
});

menuRouter.get("/normalized", async (_request, response) => {
  const [items, catalog, rules] = await Promise.all([
    getAllMenuItems(),
    getCustomizationCatalog(),
    getMenuRules(),
  ]);

  response.json(
    normalizeLazyJanesMenu({
      items,
      catalog,
      rules,
    }),
  );
});

menuRouter.get("/customization-catalog", async (_request, response) => {
  response.json(await getCustomizationCatalog());
});

menuRouter.get("/:itemId/ingredient-popularity", async (request, response) => {
  const itemId = idSchema.safeParse(request.params.itemId);

  if (!itemId.success) {
    response.status(400).json({ error: "Invalid menu item" });
    return;
  }

  const itemResult = await pool.query<{ category_id: string }>(
    `
      SELECT category_id
      FROM menu_items
      WHERE id = $1
        AND is_modifier = false
    `,
    [itemId.data],
  );
  const categoryId = itemResult.rows[0]?.category_id;

  if (!categoryId) {
    response.status(404).json({ error: "Menu item not found" });
    return;
  }

  const [itemPopularityResult, categoryPopularityResult] = await Promise.all([
    pool.query<IngredientPopularityAggregateRow>(
      `
        WITH recent_orders AS (
          SELECT order_item.id, order_item.quantity
          FROM order_items order_item
          JOIN orders order_record
            ON order_record.id = order_item.order_id
          WHERE order_item.menu_item_id = $1
            AND order_record.cancelled_at IS NULL
            AND order_item.status <> 'voided'
            AND order_item.submitted_at >= now() - ($2::int * interval '1 day')
        ),
        order_total AS (
          SELECT COALESCE(SUM(quantity), 0)::int AS order_count
          FROM recent_orders
        )
        SELECT
          change.ingredient_id,
          SUM(recent_orders.quantity)::int AS add_count,
          order_total.order_count
        FROM recent_orders
        JOIN order_item_ingredient_changes change
          ON change.order_item_id = recent_orders.id
         AND change.change_kind = 'add'
        JOIN ingredients ingredient
          ON ingredient.id = change.ingredient_id
         AND ingredient.is_active = true
         AND ingredient.is_addable = true
        CROSS JOIN order_total
        GROUP BY change.ingredient_id, order_total.order_count
      `,
      [itemId.data, POPULARITY_WINDOW_DAYS],
    ),
    pool.query<IngredientPopularityAggregateRow>(
      `
        WITH recent_orders AS (
          SELECT order_item.id, order_item.quantity
          FROM order_items order_item
          JOIN orders order_record
            ON order_record.id = order_item.order_id
          JOIN menu_items menu_item
            ON menu_item.id = order_item.menu_item_id
          WHERE menu_item.category_id = $1
            AND order_record.cancelled_at IS NULL
            AND order_item.status <> 'voided'
            AND order_item.submitted_at >= now() - ($2::int * interval '1 day')
        ),
        order_total AS (
          SELECT COALESCE(SUM(quantity), 0)::int AS order_count
          FROM recent_orders
        )
        SELECT
          change.ingredient_id,
          SUM(recent_orders.quantity)::int AS add_count,
          order_total.order_count
        FROM recent_orders
        JOIN order_item_ingredient_changes change
          ON change.order_item_id = recent_orders.id
         AND change.change_kind = 'add'
        JOIN ingredients ingredient
          ON ingredient.id = change.ingredient_id
         AND ingredient.is_active = true
         AND ingredient.is_addable = true
        CROSS JOIN order_total
        GROUP BY change.ingredient_id, order_total.order_count
      `,
      [categoryId, POPULARITY_WINDOW_DAYS],
    ),
  ]);

  const ranked = new Map<
    string,
    IngredientPopularity & { rate: number }
  >();

  for (const row of itemPopularityResult.rows) {
    const rate = row.order_count > 0 ? row.add_count / row.order_count : 0;
    if (
      row.add_count >= ITEM_POPULARITY_MIN_ADDS &&
      rate >= ITEM_POPULARITY_MIN_RATE
    ) {
      ranked.set(row.ingredient_id, {
        ingredientId: row.ingredient_id,
        addCount: row.add_count,
        scope: "item",
        rate,
      });
    }
  }

  for (const row of categoryPopularityResult.rows) {
    if (ranked.has(row.ingredient_id)) continue;

    const rate = row.order_count > 0 ? row.add_count / row.order_count : 0;
    if (
      row.add_count >= CATEGORY_POPULARITY_MIN_ADDS &&
      rate >= CATEGORY_POPULARITY_MIN_RATE
    ) {
      ranked.set(row.ingredient_id, {
        ingredientId: row.ingredient_id,
        addCount: row.add_count,
        scope: "category",
        rate,
      });
    }
  }

  response.json(
    Array.from(ranked.values())
      .sort(
        (a, b) =>
          (a.scope === b.scope ? 0 : a.scope === "item" ? -1 : 1) ||
          b.rate - a.rate ||
          b.addCount - a.addCount,
      )
      .slice(0, 12)
      .map(({ rate: _rate, ...entry }) => entry),
  );
});

menuRouter.get("/ingredients", async (_request, response) => {
  const result = await pool.query<IngredientRow>(`
    SELECT
      id,
      name,
      kind,
      is_active,
      is_addable,
      default_add_price,
      add_price_configured,
      allergen_flags,
      sort_order
    FROM ingredients
    ORDER BY sort_order, lower(name), id
  `);

  response.json(result.rows.map(toIngredient));
});

menuRouter.post(
  "/ingredients",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const input = createIngredientInputSchema.safeParse(request.body);

    if (!input.success) {
      response.status(400).json({
        error: "Invalid ingredient",
        issues: input.error.issues,
      });
      return;
    }

    try {
      const result = await pool.query<IngredientRow>(
        `
          INSERT INTO ingredients (
            name,
            kind,
            is_addable,
            default_add_price,
            add_price_configured,
            allergen_flags,
            sort_order
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING
            id,
            name,
            kind,
            is_active,
            is_addable,
            default_add_price,
            add_price_configured,
            allergen_flags,
            sort_order
        `,
        [
          input.data.name,
          input.data.kind,
          input.data.isAddable,
          input.data.defaultAddPrice,
          input.data.addPriceConfigured,
          input.data.allergenFlags,
          input.data.sortOrder,
        ],
      );

      const ingredient = result.rows[0];
      if (!ingredient) {
        throw new Error("Ingredient insert returned no record");
      }
      response.status(201).json(toIngredient(ingredient));
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
      ) {
        response.status(409).json({ error: "Ingredient already exists" });
        return;
      }
      throw error;
    }
  },
);

menuRouter.patch(
  "/ingredients/:ingredientId",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const ingredientId = idSchema.safeParse(request.params.ingredientId);
    const input = updateIngredientInputSchema.safeParse(request.body);

    if (!ingredientId.success || !input.success) {
      response.status(400).json({ error: "Invalid ingredient update" });
      return;
    }

    const assignments: string[] = [];
    const values: unknown[] = [];
    const assign = (column: string, value: unknown) => {
      values.push(value);
      assignments.push(`${column} = $${values.length}`);
    };

    if (input.data.name !== undefined) assign("name", input.data.name);
    if (input.data.kind !== undefined) assign("kind", input.data.kind);
    if (input.data.isActive !== undefined) assign("is_active", input.data.isActive);
    if (input.data.isAddable !== undefined) assign("is_addable", input.data.isAddable);
    if (input.data.defaultAddPrice !== undefined) {
      assign("default_add_price", input.data.defaultAddPrice);
    }
    if (input.data.addPriceConfigured !== undefined) {
      assign("add_price_configured", input.data.addPriceConfigured);
    }
    if (input.data.allergenFlags !== undefined) {
      assign("allergen_flags", input.data.allergenFlags);
    }
    if (input.data.sortOrder !== undefined) assign("sort_order", input.data.sortOrder);

    values.push(ingredientId.data);

    const result = await pool.query<IngredientRow>(
      `
        UPDATE ingredients
        SET
          ${assignments.join(", ")},
          updated_at = now()
        WHERE id = $${values.length}
        RETURNING
          id,
          name,
          kind,
          is_active,
          is_addable,
          default_add_price,
          add_price_configured,
          allergen_flags,
          sort_order
      `,
      values,
    );

    const ingredient = result.rows[0];
    if (!ingredient) {
      response.status(404).json({ error: "Ingredient not found" });
      return;
    }
    response.json(toIngredient(ingredient));
  },
);

menuRouter.get("/", async (_request, response) => {
  const result = await pool.query<MenuItemRow>(`
    ${menuSelect}
    WHERE is_modifier = false
    ORDER BY sort_order, name
  `);
  response.json(result.rows.map(toMenuItem));
});

menuRouter.get("/available", async (_request, response) => {
  const result = await pool.query<MenuItemRow>(`
    ${menuSelect}
    WHERE status = 'available'
      AND is_modifier = false
    ORDER BY sort_order, name
  `);
  response.json(result.rows.map(toMenuItem));
});

menuRouter.put(
  "/:itemId/customization",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const itemId = idSchema.safeParse(request.params.itemId);
    const input = replaceMenuItemCustomizationInputSchema.safeParse(
      request.body,
    );

    if (!itemId.success || !input.success) {
      response.status(400).json({
        error: "Invalid menu customization",
        issues: input.success ? undefined : input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const itemResult = await client.query<{
        id: string;
        is_modifier: boolean;
        source_key: string | null;
        status: MenuItemStatus;
      }>(
        `
          SELECT id, is_modifier, source_key, status
          FROM menu_items
          WHERE id = $1
          FOR UPDATE
        `,
        [itemId.data],
      );

      const item = itemResult.rows[0];
      if (!item) {
        await client.query("ROLLBACK");
        response.status(404).json({ error: "Menu item not found" });
        return;
      }
      if (item.is_modifier) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Legacy modifier rows cannot have composition",
        });
        return;
      }

      const ingredientIds = new Set<string>();
      for (const ingredient of input.data.ingredients) {
        ingredientIds.add(ingredient.ingredientId);
      }
      for (const replacement of input.data.replacements) {
        ingredientIds.add(replacement.sourceIngredientId);
        ingredientIds.add(replacement.replacementIngredientId);
      }
      for (const group of input.data.choiceGroups) {
        for (const option of group.options) {
          if (option.ingredientId) ingredientIds.add(option.ingredientId);
        }
      }

      if (ingredientIds.size > 0) {
        const activeIngredients = await client.query<{ id: string }>(
          `
            SELECT id
            FROM ingredients
            WHERE id = ANY($1::uuid[])
              AND is_active = true
          `,
          [Array.from(ingredientIds)],
        );

        if (activeIngredients.rowCount !== ingredientIds.size) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "One or more selected ingredients are unavailable",
          });
          return;
        }
      }

      const preparationSchemeIds = new Set<string>();
      for (const ingredient of input.data.ingredients) {
        if (ingredient.preparationSchemeId) preparationSchemeIds.add(ingredient.preparationSchemeId);
      }
      for (const replacement of input.data.replacements) {
        if (replacement.preparationSchemeId) preparationSchemeIds.add(replacement.preparationSchemeId);
      }
      for (const group of input.data.choiceGroups) {
        for (const option of group.options) {
          if (option.preparationSchemeId) preparationSchemeIds.add(option.preparationSchemeId);
        }
      }

      if (preparationSchemeIds.size > 0) {
        const activeSchemes = await client.query<{ id: string }>(
          `
            SELECT id
            FROM preparation_schemes
            WHERE id = ANY($1::uuid[])
              AND is_active = true
          `,
          [Array.from(preparationSchemeIds)],
        );
        if (activeSchemes.rowCount !== preparationSchemeIds.size) {
          await client.query("ROLLBACK");
          response.status(409).json({ error: "One or more preparation schemes are unavailable" });
          return;
        }
      }

      await client.query(
        "DELETE FROM menu_item_ingredients WHERE menu_item_id = $1",
        [item.id],
      );
      await client.query(
        "DELETE FROM menu_choice_groups WHERE menu_item_id = $1",
        [item.id],
      );

      for (const ingredient of input.data.ingredients) {
        await client.query(
          `
            INSERT INTO menu_item_ingredients (
              menu_item_id,
              ingredient_id,
              role,
              umo_role,
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
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8,
              $9, $10, $11, $12, $13, $14
            )
          `,
          [
            item.id,
            ingredient.ingredientId,
            ingredient.role,
            ingredient.contextualRole,
            ingredient.relationship,
            ingredient.preparationSchemeId,
            ingredient.canRemove,
            ingredient.canSide,
            ingredient.canExtra,
            ingredient.canReplace,
            ingredient.replacementOptionsConfigured,
            ingredient.extraPrice,
            ingredient.extraPriceConfigured,
            ingredient.sortOrder,
          ],
        );
      }

      for (const replacement of input.data.replacements) {
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
          `,
          [
            item.id,
            replacement.sourceIngredientId,
            replacement.replacementIngredientId,
            replacement.preparationSchemeId,
            replacement.priceAdjustment,
            replacement.priceAdjustmentConfigured,
            replacement.sortOrder,
          ],
        );
      }

      for (const group of input.data.choiceGroups) {
        const groupResult = await client.query<{ id: string }>(
          `
            INSERT INTO menu_choice_groups (
              menu_item_id,
              label,
              role,
              relationship,
              min_selections,
              max_selections,
              sort_order
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
          `,
          [
            item.id,
            group.label,
            group.role,
            group.relationship,
            group.minSelections,
            group.maxSelections,
            group.sortOrder,
          ],
        );

        const groupId = groupResult.rows[0]?.id;
        if (!groupId) {
          throw new Error("Choice group insert returned no record");
        }

        for (const option of group.options) {
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
                is_default
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `,
            [
              groupId,
              option.label,
              option.ingredientId,
              option.preparationSchemeId,
              option.isNoneOption,
              option.priceAdjustment,
              option.priceAdjustmentConfigured,
              option.sortOrder,
              option.isDefault,
            ],
          );
        }
      }

      await client.query(
        "UPDATE menu_items SET updated_at = now() WHERE id = $1",
        [item.id],
      );

      if (item.source_key === null && item.status === "available") {
        const readiness = await getManualItemReadiness(client, item.id);
        if (!readiness.ready) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "An active item cannot be saved with incomplete food structure",
            issues: readiness.issues,
          });
          return;
        }
      }

      await client.query("COMMIT");
      response.json(await getCustomizationCatalog());
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

menuRouter.get(
  "/:itemId/safety-override-history",
  requireRole("admin"),
  async (request, response) => {
    const itemId = idSchema.safeParse(request.params.itemId);
    if (!itemId.success) {
      response.status(400).json({ error: "Invalid menu item ID" });
      return;
    }

    const result = await pool.query<{
      id: string;
      menu_item_id: string;
      changed_by_user_id: string;
      changed_by_display_name: string;
      action: MenuItemSafetyOverrideAuditEvent["action"];
      reason: string;
      before_declarations: MenuItemSafetyDeclarationInput[];
      after_declarations: MenuItemSafetyDeclarationInput[];
      changed_at: Date;
    }>(
      `
        SELECT
          audit.id,
          audit.menu_item_id,
          audit.changed_by_user_id,
          users.display_name AS changed_by_display_name,
          audit.action,
          audit.reason,
          audit.before_declarations,
          audit.after_declarations,
          audit.changed_at
        FROM menu_item_safety_override_audit audit
        JOIN users ON users.id = audit.changed_by_user_id
        WHERE audit.menu_item_id = $1
        ORDER BY audit.changed_at DESC, audit.id DESC
      `,
      [itemId.data],
    );

    response.json(
      result.rows.map((row): MenuItemSafetyOverrideAuditEvent => ({
        id: row.id,
        menuItemId: row.menu_item_id,
        changedByUserId: row.changed_by_user_id,
        changedByDisplayName: row.changed_by_display_name,
        action: row.action,
        reason: row.reason,
        beforeDeclarations: row.before_declarations,
        afterDeclarations: row.after_declarations,
        changedAt: row.changed_at.toISOString(),
      })),
    );
  },
);

menuRouter.put(
  "/:itemId/safety-override",
  requireRole("admin"),
  async (request, response) => {
    const itemId = idSchema.safeParse(request.params.itemId);
    const parsed = menuItemSafetyOverrideInputSchema.safeParse(request.body);

    if (!itemId.success || !parsed.success) {
      response.status(400).json({
        error: "Invalid safety override",
        issues: parsed.success ? undefined : parsed.error.issues,
      });
      return;
    }

    const user = getAuthenticatedUser(request);
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const itemResult = await client.query<{ id: string }>(
        `SELECT id FROM menu_items WHERE id = $1 AND is_modifier = false FOR UPDATE`,
        [itemId.data],
      );
      if (!itemResult.rows[0]) {
        await client.query("ROLLBACK");
        response.status(404).json({ error: "Menu item not found" });
        return;
      }

      const before = await getManualSafetyDeclarations(client, itemId.data);
      const after = parsed.data.declarations;

      const sourceSafetyResult = await client.query<{
        kind: MenuItemSafetyDeclarationInput["kind"];
        allergen_flag: MenuItemSafetyDeclarationInput["allergenFlag"];
        note: string | null;
      }>(
        `
          SELECT kind, allergen_flag, note
          FROM menu_item_safety_declarations
          WHERE menu_item_id = $1
            AND source = 'source'
        `,
        [itemId.data],
      );
      const sourceKeys = new Set(
        sourceSafetyResult.rows.map((row) =>
          JSON.stringify([
            row.kind,
            row.allergen_flag,
            row.note?.trim().toLowerCase() ?? null,
          ]),
        ),
      );
      const duplicateSourceFact = after.find((declaration) =>
        sourceKeys.has(
          JSON.stringify([
            declaration.kind,
            declaration.allergenFlag,
            declaration.note?.trim().toLowerCase() ?? null,
          ]),
        ),
      );
      if (duplicateSourceFact) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "This safety fact is already recorded on the item",
        });
        return;
      }

      if (JSON.stringify(before) === JSON.stringify(after)) {
        await client.query("ROLLBACK");
        response.status(409).json({ error: "Safety override did not change" });
        return;
      }

      await replaceManualSafetyDeclarations(client, itemId.data, after);
      await client.query(
        `UPDATE menu_items SET updated_at = now() WHERE id = $1`,
        [itemId.data],
      );

      const action: MenuItemSafetyOverrideAuditEvent["action"] =
        after.length === 0 ? "cleared" : before.length === 0 ? "set" : "updated";

      await client.query(
        `
          INSERT INTO menu_item_safety_override_audit (
            menu_item_id,
            changed_by_user_id,
            action,
            reason,
            before_declarations,
            after_declarations
          )
          VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)
        `,
        [
          itemId.data,
          user.id,
          action,
          parsed.data.reason,
          JSON.stringify(before),
          JSON.stringify(after),
        ],
      );

      const result = await client.query<MenuItemRow>(
        `${menuSelect} WHERE menu_items.id = $1`,
        [itemId.data],
      );
      const updated = result.rows[0];
      if (!updated) {
        throw new Error("Updated menu item could not be reloaded");
      }

      await client.query("COMMIT");
      response.json(toMenuItem(updated));
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

menuRouter.get("/:itemId", async (request, response) => {
  const itemId = idSchema.safeParse(request.params.itemId);
  if (!itemId.success) {
    response.status(400).json({ error: "Invalid menu item ID" });
    return;
  }

  const result = await pool.query<MenuItemRow>(
    `${menuSelect} WHERE id = $1 AND is_modifier = false`,
    [itemId.data],
  );
  const item = result.rows[0];
  if (!item) {
    response.status(404).json({ error: "Menu item not found" });
    return;
  }
  response.json(toMenuItem(item));
});

menuRouter.post(
  "/",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const parsed = createMenuItemInputSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({
        error: "Invalid menu item",
        issues: parsed.error.issues,
      });
      return;
    }

    const item = parsed.data;
    if (item.safetyDeclarations.length > 0) {
      response.status(400).json({
        error: "Use the admin safety override after creating the item",
      });
      return;
    }
    if (item.isModifier || item.parentItemId !== null) {
      response.status(400).json({
        error: "Create ingredients or choice options instead of modifier menu items",
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const categoryResult = await client.query<{ id: string }>(
        `
          SELECT categories.id
          FROM menu_categories categories
          JOIN menu_groups groups ON groups.id = categories.group_id
          WHERE categories.id = $1
            AND categories.is_active = true
            AND groups.is_active = true
        `,
        [item.categoryId],
      );

      if (!categoryResult.rows[0]) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error: "Active menu category not found",
        });
        return;
      }

      const createdResult = await client.query<{ id: string }>(
        `
          INSERT INTO menu_items (
            parent_item_id,
            name,
            description,
            category_id,
            price,
            price_configured,
            status,
            is_special,
            is_kids,
            has_kids_version,
            is_modifier,
            dietary_flags,
            sort_order
          )
          VALUES (NULL, $1, $2, $3, $4, $5, $6, $7, $8, $9, false, $10, $11)
          RETURNING id
        `,
        [
          item.name,
          item.description,
          item.categoryId,
          item.price,
          item.priceConfigured,
          "draft",
          item.isSpecial,
          item.isKids,
          item.hasKidsVersion,
          item.dietaryFlags,
          item.sortOrder,
        ],
      );

      const itemId = createdResult.rows[0]?.id;
      if (!itemId) {
        throw new Error("Menu item insert returned no record");
      }

      const result = await client.query<MenuItemRow>(
        `${menuSelect} WHERE menu_items.id = $1`,
        [itemId],
      );

      const created = result.rows[0];
      if (!created) {
        throw new Error("Created menu item could not be reloaded");
      }

      await client.query("COMMIT");
      response.status(201).json(toMenuItem(created));
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

menuRouter.patch(
  "/:itemId",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const itemId = idSchema.safeParse(request.params.itemId);
    const parsed = updateMenuItemInputSchema.safeParse(request.body);

    if (!itemId.success || !parsed.success) {
      response.status(400).json({
        error: "Invalid menu item update",
        issues: parsed.success ? undefined : parsed.error.issues,
      });
      return;
    }

    const changes = parsed.data;
    if (changes.safetyDeclarations !== undefined) {
      response.status(400).json({
        error: "Use the admin safety override for item-level safety changes",
      });
      return;
    }
    if (
      changes.isModifier !== undefined ||
      changes.parentItemId !== undefined
    ) {
      response.status(400).json({
        error: "Legacy modifier relationships cannot be created or changed",
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existingResult = await client.query<{
        id: string;
        is_modifier: boolean;
        source_key: string | null;
        status: MenuItemStatus;
      }>(
        `
          SELECT id, is_modifier, source_key, status
          FROM menu_items
          WHERE id = $1
          FOR UPDATE
        `,
        [itemId.data],
      );

      const existing = existingResult.rows[0];
      if (!existing || existing.is_modifier) {
        await client.query("ROLLBACK");
        response.status(404).json({ error: "Menu item not found" });
        return;
      }

      const nextStatus = changes.status ?? existing.status;
      if (
        existing.source_key === null &&
        nextStatus === "available" &&
        changes.priceConfigured === false
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Add a selling price before publishing this item",
        });
        return;
      }

      if (changes.status === "available" && existing.source_key === null) {
        const readiness = await getManualItemReadiness(client, itemId.data);
        if (!readiness.ready) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "Finish the food structure before publishing this item",
            issues: readiness.issues,
          });
          return;
        }
      }

      if (changes.categoryId !== undefined) {
        const categoryResult = await client.query<{ id: string }>(
          `
            SELECT categories.id
            FROM menu_categories categories
            JOIN menu_groups groups ON groups.id = categories.group_id
            WHERE categories.id = $1
              AND categories.is_active = true
              AND groups.is_active = true
          `,
          [changes.categoryId],
        );

        if (!categoryResult.rows[0]) {
          await client.query("ROLLBACK");
          response.status(400).json({
            error: "Active menu category not found",
          });
          return;
        }
      }

      const assignments: string[] = [];
      const values: unknown[] = [];
      const assign = (column: string, value: unknown) => {
        values.push(value);
        assignments.push(`${column} = $${values.length}`);
      };

      if (changes.name !== undefined) assign("name", changes.name);
      if (changes.description !== undefined) {
        assign("description", changes.description);
      }
      if (changes.categoryId !== undefined) {
        assign("category_id", changes.categoryId);
      }
      if (changes.price !== undefined) assign("price", changes.price);
      if (changes.priceConfigured !== undefined) {
        assign("price_configured", changes.priceConfigured);
      }
      if (changes.status !== undefined) assign("status", changes.status);
      if (changes.isSpecial !== undefined) {
        assign("is_special", changes.isSpecial);
      }
      if (changes.isKids !== undefined) {
        assign("is_kids", changes.isKids);
      }
      if (changes.hasKidsVersion !== undefined) {
        assign("has_kids_version", changes.hasKidsVersion);
      }
      if (changes.dietaryFlags !== undefined) {
        assign("dietary_flags", changes.dietaryFlags);
      }
      if (changes.sortOrder !== undefined) {
        assign("sort_order", changes.sortOrder);
      }

      if (assignments.length > 0) {
        values.push(itemId.data);
        await client.query(
          `
            UPDATE menu_items
            SET ${assignments.join(", ")}, updated_at = now()
            WHERE id = $${values.length}
          `,
          values,
        );
      }

      const result = await client.query<MenuItemRow>(
        `${menuSelect} WHERE menu_items.id = $1`,
        [itemId.data],
      );
      const updated = result.rows[0];
      if (!updated) {
        throw new Error("Updated menu item could not be reloaded");
      }

      await client.query("COMMIT");
      response.json(toMenuItem(updated));
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

menuRouter.delete(
  "/:itemId",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const itemId = idSchema.safeParse(request.params.itemId);
    if (!itemId.success) {
      response.status(400).json({ error: "Invalid menu item ID" });
      return;
    }

    const result = await pool.query<{ id: string }>(
      `
        UPDATE menu_items
        SET status = 'inactive', updated_at = now()
        WHERE id = $1
          AND is_modifier = false
        RETURNING id
      `,
      [itemId.data],
    );
    if (!result.rows[0]) {
      response.status(404).json({ error: "Menu item not found" });
      return;
    }
    response.status(204).send();
  },
);
