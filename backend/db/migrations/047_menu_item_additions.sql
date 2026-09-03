-- ADD is item-specific menu truth.
--
-- ingredients.is_addable remains the restaurant-wide safety/catalog gate.
-- It does NOT mean an ingredient may be added to every offering.
-- A row here is the explicit permission for one menu item.
--
-- Intentionally no backfill:
-- existing global addability is not evidence of item-level permission.

CREATE TABLE IF NOT EXISTS menu_item_additions (
  menu_item_id uuid NOT NULL
    REFERENCES menu_items(id) ON DELETE CASCADE,
  ingredient_id uuid NOT NULL
    REFERENCES ingredients(id) ON DELETE RESTRICT,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (menu_item_id, ingredient_id)
);

CREATE INDEX IF NOT EXISTS menu_item_additions_item_order_idx
  ON menu_item_additions (
    menu_item_id,
    is_active,
    sort_order,
    ingredient_id
  );
