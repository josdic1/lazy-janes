-- A component's relationship to a menu preset is separate from:
--   ingredients.kind  = what the food is
--   component role    = what job it performs
--
-- Examples:
--   Cheddar in omelette -> contains
--   Home Fries with omelette -> comes_with
--   Toast with omelette -> comes_with
--
-- Nullable intentionally: unknown truth must remain unknown until the
-- canonical importer explicitly classifies it. Do not default to 'contains'.

ALTER TABLE menu_item_ingredients
  ADD COLUMN IF NOT EXISTS relationship text;

ALTER TABLE menu_item_ingredients
  DROP CONSTRAINT IF EXISTS menu_item_ingredients_relationship_check;

ALTER TABLE menu_item_ingredients
  ADD CONSTRAINT menu_item_ingredients_relationship_check
  CHECK (
    relationship IS NULL
    OR relationship IN ('contains', 'comes_with')
  );

ALTER TABLE menu_choice_groups
  ADD COLUMN IF NOT EXISTS relationship text;

ALTER TABLE menu_choice_groups
  DROP CONSTRAINT IF EXISTS menu_choice_groups_relationship_check;

ALTER TABLE menu_choice_groups
  ADD CONSTRAINT menu_choice_groups_relationship_check
  CHECK (
    relationship IS NULL
    OR relationship IN ('contains', 'comes_with')
  );
