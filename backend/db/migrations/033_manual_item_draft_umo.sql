-- Manual menu items are created as drafts and may only become sellable after
-- their explicit food structure is complete. Imported menu truth remains
-- untouched; nullable UMO role preserves unknown legacy evidence.

ALTER TABLE menu_items
  DROP CONSTRAINT IF EXISTS menu_items_status_check;

ALTER TABLE menu_items
  ADD CONSTRAINT menu_items_status_check
  CHECK (status IN ('available', 'eighty_sixed', 'inactive', 'draft'));

ALTER TABLE menu_item_ingredients
  ADD COLUMN IF NOT EXISTS umo_role text;

ALTER TABLE menu_item_ingredients
  DROP CONSTRAINT IF EXISTS menu_item_ingredients_umo_role_check;

ALTER TABLE menu_item_ingredients
  ADD CONSTRAINT menu_item_ingredients_umo_role_check
  CHECK (
    umo_role IS NULL
    OR umo_role IN (
      'base',
      'primary',
      'carrier',
      'filling',
      'topping',
      'sauce',
      'accompaniment'
    )
  );
