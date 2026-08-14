import {
  createIngredientInputSchema,
  createMenuItemInputSchema,
  replaceMenuItemCustomizationInputSchema,
  updateIngredientInputSchema,
  updateMenuItemInputSchema,
} from "@lazy-janes/shared";
import type {
  AllergenFlag,
  Ingredient,
  MenuCategory,
  MenuChoiceGroup,
  MenuCustomizationCatalog,
  MenuGroup,
  MenuItem,
  MenuItemIngredient,
  MenuItemSafetyDeclaration,
  MenuItemSafetyDeclarationInput,
  MenuItemStatus,
} from "@lazy-janes/shared";
import { Router } from "express";
import type { PoolClient } from "pg";
import { z } from "zod";
import {
  requireAnyRole,
  requireAuthenticatedUser,
} from "../auth/session.js";
import { pool } from "../db/pool.js";

type MenuItemRow = {
  id: string;
  parent_item_id: string | null;
  name: string;
  description: string | null;
  category_id: string;
  price: string;
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
  allergen_flags: AllergenFlag[];
  can_remove: boolean;
  can_side: boolean;
  can_extra: boolean;
  extra_price: string;
  extra_price_configured: boolean;
  sort_order: number;
};

type ChoiceRow = {
  group_id: string;
  menu_item_id: string;
  group_label: string;
  min_selections: number;
  max_selections: number | null;
  group_sort_order: number;
  group_is_active: boolean;
  option_id: string | null;
  option_label: string | null;
  ingredient_id: string | null;
  price_adjustment: string | null;
  option_sort_order: number | null;
  is_default: boolean | null;
  option_is_active: boolean | null;
};

const idSchema = z.string().uuid();

const menuSelect = `
  SELECT
    menu_items.id,
    menu_items.parent_item_id,
    menu_items.name,
    menu_items.description,
    menu_items.category_id,
    menu_items.price,
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
            'sortOrder', safety.sort_order
          )
          ORDER BY safety.sort_order, safety.kind, safety.id
        )
        FROM menu_item_safety_declarations safety
        WHERE safety.menu_item_id = menu_items.id
      ),
      '[]'::jsonb
    ) AS safety_declarations,
    menu_items.sort_order,
    menu_items.created_at,
    menu_items.updated_at
  FROM menu_items
`;

function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    parentItemId: row.parent_item_id,
    name: row.name,
    description: row.description,
    categoryId: row.category_id,
    price: Number(row.price),
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
    sortOrder: row.sort_order,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

async function replaceItemSafetyDeclarations(
  client: PoolClient,
  menuItemId: string,
  declarations: MenuItemSafetyDeclarationInput[],
): Promise<void> {
  await client.query(
    "DELETE FROM menu_item_safety_declarations WHERE menu_item_id = $1",
    [menuItemId],
  );

  for (const declaration of declarations) {
    await client.query(
      `
        INSERT INTO menu_item_safety_declarations (
          menu_item_id,
          kind,
          allergen_flag,
          note,
          sort_order
        )
        VALUES ($1, $2, $3, $4, $5)
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
    allergenFlags: row.allergen_flags,
    canRemove: row.can_remove,
    canSide: row.can_side,
    canExtra: row.can_extra,
    extraPrice: Number(row.extra_price),
    extraPriceConfigured: row.extra_price_configured,
    sortOrder: row.sort_order,
  };
}

function toChoiceGroups(rows: ChoiceRow[]): MenuChoiceGroup[] {
  const groups = new Map<string, MenuChoiceGroup>();

  for (const row of rows) {
    let group = groups.get(row.group_id);

    if (!group) {
      group = {
        id: row.group_id,
        menuItemId: row.menu_item_id,
        label: row.group_label,
        minSelections: row.min_selections,
        maxSelections: row.max_selections,
        sortOrder: row.group_sort_order,
        isActive: row.group_is_active,
        options: [],
      };
      groups.set(row.group_id, group);
    }

    if (
      row.option_id &&
      row.option_label !== null &&
      row.price_adjustment !== null &&
      row.option_sort_order !== null &&
      row.is_default !== null &&
      row.option_is_active !== null
    ) {
      group.options.push({
        id: row.option_id,
        choiceGroupId: row.group_id,
        label: row.option_label,
        ingredientId: row.ingredient_id,
        priceAdjustment: Number(row.price_adjustment),
        sortOrder: row.option_sort_order,
        isDefault: row.is_default,
        isActive: row.option_is_active,
      });
    }
  }

  return Array.from(groups.values());
}

async function getCustomizationCatalog(): Promise<MenuCustomizationCatalog> {
  const [ingredientResult, itemIngredientResult, choiceResult] =
    await Promise.all([
      pool.query<IngredientRow>(`
        SELECT
          id,
          name,
          is_active,
          is_addable,
          default_add_price,
          add_price_configured,
          allergen_flags,
          sort_order
        FROM ingredients
        ORDER BY sort_order, lower(name), id
      `),
      pool.query<ItemIngredientRow>(`
        SELECT
          link.menu_item_id,
          ingredient.id AS ingredient_id,
          ingredient.name AS ingredient_name,
          ingredient.allergen_flags,
          link.can_remove,
          link.can_side,
          link.can_extra,
          link.extra_price,
          link.extra_price_configured,
          link.sort_order
        FROM menu_item_ingredients link
        JOIN ingredients ingredient
          ON ingredient.id = link.ingredient_id
        ORDER BY
          link.menu_item_id,
          link.sort_order,
          lower(ingredient.name)
      `),
      pool.query<ChoiceRow>(`
        SELECT
          group_record.id AS group_id,
          group_record.menu_item_id,
          group_record.label AS group_label,
          group_record.min_selections,
          group_record.max_selections,
          group_record.sort_order AS group_sort_order,
          group_record.is_active AS group_is_active,
          option_record.id AS option_id,
          option_record.label AS option_label,
          option_record.ingredient_id,
          option_record.price_adjustment,
          option_record.sort_order AS option_sort_order,
          option_record.is_default,
          option_record.is_active AS option_is_active
        FROM menu_choice_groups group_record
        LEFT JOIN menu_choice_options option_record
          ON option_record.choice_group_id = group_record.id
        ORDER BY
          group_record.menu_item_id,
          group_record.sort_order,
          group_record.label,
          option_record.sort_order,
          option_record.label
      `),
    ]);

  return {
    ingredients: ingredientResult.rows.map(toIngredient),
    itemIngredients: itemIngredientResult.rows.map(toItemIngredient),
    choiceGroups: toChoiceGroups(choiceResult.rows),
  };
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

menuRouter.get("/customization-catalog", async (_request, response) => {
  response.json(await getCustomizationCatalog());
});

menuRouter.get("/ingredients", async (_request, response) => {
  const result = await pool.query<IngredientRow>(`
    SELECT
      id,
      name,
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
            is_addable,
            default_add_price,
            add_price_configured,
            allergen_flags,
            sort_order
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING
            id,
            name,
            is_active,
            is_addable,
            default_add_price,
            add_price_configured,
            allergen_flags,
            sort_order
        `,
        [
          input.data.name,
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
      }>(
        `
          SELECT id, is_modifier
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
              can_remove,
              can_side,
              can_extra,
              extra_price,
              extra_price_configured,
              sort_order
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `,
          [
            item.id,
            ingredient.ingredientId,
            ingredient.canRemove,
            ingredient.canSide,
            ingredient.canExtra,
            ingredient.extraPrice,
            ingredient.extraPriceConfigured,
            ingredient.sortOrder,
          ],
        );
      }

      for (const group of input.data.choiceGroups) {
        const groupResult = await client.query<{ id: string }>(
          `
            INSERT INTO menu_choice_groups (
              menu_item_id,
              label,
              min_selections,
              max_selections,
              sort_order
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
          `,
          [
            item.id,
            group.label,
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
                price_adjustment,
                sort_order,
                is_default
              )
              VALUES ($1, $2, $3, $4, $5, $6)
            `,
            [
              groupId,
              option.label,
              option.ingredientId,
              option.priceAdjustment,
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
            status,
            is_special,
            is_kids,
            has_kids_version,
            is_modifier,
            dietary_flags,
            sort_order
          )
          VALUES (NULL, $1, $2, $3, $4, $5, $6, $7, $8, false, $9, $10)
          RETURNING id
        `,
        [
          item.name,
          item.description,
          item.categoryId,
          item.price,
          item.status,
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

      await replaceItemSafetyDeclarations(
        client,
        itemId,
        item.safetyDeclarations,
      );

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
      }>(
        `
          SELECT id, is_modifier
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

      if (changes.safetyDeclarations !== undefined) {
        await replaceItemSafetyDeclarations(
          client,
          itemId.data,
          changes.safetyDeclarations,
        );

        if (assignments.length === 0) {
          await client.query(
            "UPDATE menu_items SET updated_at = now() WHERE id = $1",
            [itemId.data],
          );
        }
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
