import {
  createMenuItemInputSchema,
  updateMenuItemInputSchema,
} from "@lazy-janes/shared";
import type {
  MenuItem,
  MenuItemStatus,
} from "@lazy-janes/shared";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";

type MenuItemRow = {
  id: string;
  parent_item_id: string | null;
  name: string;
  description: string | null;
  category: string;
  price: string;
  status: MenuItemStatus;
  is_special: boolean;
  is_modifier: boolean;
  dietary_flags: string[];
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

const menuItemIdSchema = z.string().uuid();

const menuSelect = `
  SELECT
    id,
    parent_item_id,
    name,
    description,
    category,
    price,
    status,
    is_special,
    is_modifier,
    dietary_flags,
    sort_order,
    created_at,
    updated_at
  FROM menu_items
`;

function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    parentItemId: row.parent_item_id,
    name: row.name,
    description: row.description,
    category: row.category,
    price: Number(row.price),
    status: row.status,
    isSpecial: row.is_special,
    isModifier: row.is_modifier,
    dietaryFlags: row.dietary_flags,
    sortOrder: row.sort_order,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export const menuRouter = Router();

menuRouter.get("/", async (_request, response) => {
  const result = await pool.query<MenuItemRow>(`
    ${menuSelect}
    ORDER BY sort_order, name
  `);

  response.json(result.rows.map(toMenuItem));
});

menuRouter.get("/available", async (_request, response) => {
  const result = await pool.query<MenuItemRow>(`
    ${menuSelect}
    WHERE status = 'available'
    ORDER BY sort_order, name
  `);

  response.json(result.rows.map(toMenuItem));
});

menuRouter.get("/:itemId/modifiers", async (request, response) => {
  const itemId = menuItemIdSchema.safeParse(request.params.itemId);

  if (!itemId.success) {
    response.status(400).json({ error: "Invalid menu item ID" });
    return;
  }

  const result = await pool.query<MenuItemRow>(
    `
      ${menuSelect}
      WHERE parent_item_id = $1
        AND status = 'available'
      ORDER BY sort_order, name
    `,
    [itemId.data],
  );

  response.json(result.rows.map(toMenuItem));
});

menuRouter.get("/:itemId", async (request, response) => {
  const itemId = menuItemIdSchema.safeParse(request.params.itemId);

  if (!itemId.success) {
    response.status(400).json({ error: "Invalid menu item ID" });
    return;
  }

  const result = await pool.query<MenuItemRow>(
    `
      ${menuSelect}
      WHERE id = $1
    `,
    [itemId.data],
  );

  const item = result.rows[0];

  if (!item) {
    response.status(404).json({ error: "Menu item not found" });
    return;
  }

  response.json(toMenuItem(item));
});

menuRouter.post("/", async (request, response) => {
  const parsed = createMenuItemInputSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({
      error: "Invalid menu item",
      issues: parsed.error.issues,
    });
    return;
  }

  const item = parsed.data;

  if (item.parentItemId !== null) {
    const parentResult = await pool.query<{
      is_modifier: boolean;
    }>(
      `
        SELECT is_modifier
        FROM menu_items
        WHERE id = $1
      `,
      [item.parentItemId],
    );

    const parent = parentResult.rows[0];

    if (!parent) {
      response.status(400).json({
        error: "Parent menu item not found",
      });
      return;
    }

    if (parent.is_modifier) {
      response.status(400).json({
        error: "A modifier cannot contain another modifier",
      });
      return;
    }
  }

  const result = await pool.query<MenuItemRow>(
    `
      INSERT INTO menu_items (
        parent_item_id,
        name,
        description,
        category,
        price,
        status,
        is_special,
        is_modifier,
        dietary_flags,
        sort_order
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id,
        parent_item_id,
        name,
        description,
        category,
        price,
        status,
        is_special,
        is_modifier,
        dietary_flags,
        sort_order,
        created_at,
        updated_at
    `,
    [
      item.parentItemId,
      item.name,
      item.description,
      item.category,
      item.price,
      item.status,
      item.isSpecial,
      item.isModifier,
      item.dietaryFlags,
      item.sortOrder,
    ],
  );

  const created = result.rows[0];

  if (!created) {
    throw new Error("Menu item was not returned after creation");
  }

  response.status(201).json(toMenuItem(created));
});

menuRouter.patch("/:itemId", async (request, response) => {
  const itemId = menuItemIdSchema.safeParse(request.params.itemId);

  if (!itemId.success) {
    response.status(400).json({ error: "Invalid menu item ID" });
    return;
  }

  const parsed = updateMenuItemInputSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({
      error: "Invalid menu item update",
      issues: parsed.error.issues,
    });
    return;
  }

  const existingResult = await pool.query<MenuItemRow>(
    `
      ${menuSelect}
      WHERE id = $1
    `,
    [itemId.data],
  );

  const existing = existingResult.rows[0];

  if (!existing) {
    response.status(404).json({ error: "Menu item not found" });
    return;
  }

  const changes = parsed.data;
  const nextIsModifier =
    changes.isModifier ?? existing.is_modifier;
  const nextParentItemId =
    changes.parentItemId === undefined
      ? existing.parent_item_id
      : changes.parentItemId;

  if (nextIsModifier && nextParentItemId === null) {
    response.status(400).json({
      error: "A modifier requires a parent item",
    });
    return;
  }

  if (!nextIsModifier && nextParentItemId !== null) {
    response.status(400).json({
      error: "Only a modifier can have a parent item",
    });
    return;
  }

  if (nextParentItemId === itemId.data) {
    response.status(400).json({
      error: "A menu item cannot be its own parent",
    });
    return;
  }

  if (nextParentItemId !== null) {
    const parentResult = await pool.query<{
      is_modifier: boolean;
    }>(
      `
        SELECT is_modifier
        FROM menu_items
        WHERE id = $1
      `,
      [nextParentItemId],
    );

    const parent = parentResult.rows[0];

    if (!parent) {
      response.status(400).json({
        error: "Parent menu item not found",
      });
      return;
    }

    if (parent.is_modifier) {
      response.status(400).json({
        error: "A modifier cannot contain another modifier",
      });
      return;
    }
  }

  if (nextIsModifier) {
    const childResult = await pool.query<{ has_children: boolean }>(
      `
        SELECT EXISTS (
          SELECT 1
          FROM menu_items
          WHERE parent_item_id = $1
        ) AS has_children
      `,
      [itemId.data],
    );

    if (childResult.rows[0]?.has_children) {
      response.status(400).json({
        error: "An item with modifiers cannot become a modifier",
      });
      return;
    }
  }

  const assignments: string[] = [];
  const values: unknown[] = [];

  function assign(column: string, value: unknown) {
    values.push(value);
    assignments.push(`${column} = $${values.length}`);
  }

  if (changes.parentItemId !== undefined) {
    assign("parent_item_id", changes.parentItemId);
  }
  if (changes.name !== undefined) {
    assign("name", changes.name);
  }
  if (changes.description !== undefined) {
    assign("description", changes.description);
  }
  if (changes.category !== undefined) {
    assign("category", changes.category);
  }
  if (changes.price !== undefined) {
    assign("price", changes.price);
  }
  if (changes.status !== undefined) {
    assign("status", changes.status);
  }
  if (changes.isSpecial !== undefined) {
    assign("is_special", changes.isSpecial);
  }
  if (changes.isModifier !== undefined) {
    assign("is_modifier", changes.isModifier);
  }
  if (changes.dietaryFlags !== undefined) {
    assign("dietary_flags", changes.dietaryFlags);
  }
  if (changes.sortOrder !== undefined) {
    assign("sort_order", changes.sortOrder);
  }

  values.push(itemId.data);

  const result = await pool.query<MenuItemRow>(
    `
      UPDATE menu_items
      SET
        ${assignments.join(", ")},
        updated_at = now()
      WHERE id = $${values.length}
      RETURNING
        id,
        parent_item_id,
        name,
        description,
        category,
        price,
        status,
        is_special,
        is_modifier,
        dietary_flags,
        sort_order,
        created_at,
        updated_at
    `,
    values,
  );

  const updated = result.rows[0];

  if (!updated) {
    throw new Error("Menu item was not returned after update");
  }

  response.json(toMenuItem(updated));
});

menuRouter.delete("/:itemId", async (request, response) => {
  const itemId = menuItemIdSchema.safeParse(request.params.itemId);

  if (!itemId.success) {
    response.status(400).json({ error: "Invalid menu item ID" });
    return;
  }

  const result = await pool.query<{ id: string }>(
    `
      UPDATE menu_items
      SET
        status = 'inactive',
        updated_at = now()
      WHERE id = $1
      RETURNING id
    `,
    [itemId.data],
  );

  if (!result.rows[0]) {
    response.status(404).json({ error: "Menu item not found" });
    return;
  }

  response.status(204).send();
});
