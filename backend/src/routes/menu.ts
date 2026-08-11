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
