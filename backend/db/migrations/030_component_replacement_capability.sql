-- Component replacement capability truth.
--
-- can_replace:
--   the restaurant/menu permits replacing this component.
--
-- replacement_options_configured:
--   the complete allowed replacement set is known.
--
-- Concrete replacement rows remain the actual allowed targets.
-- Therefore:
--
--   false / false = SUB FOR not established
--   true  / false = SUB FOR exists, allowed choices not yet configured
--   true  / true  = SUB FOR configured with concrete replacement rows
--
-- This deliberately separates capability from replacement catalog data.

ALTER TABLE menu_item_ingredients
  ADD COLUMN can_replace boolean NOT NULL DEFAULT false,
  ADD COLUMN replacement_options_configured boolean NOT NULL DEFAULT false;

ALTER TABLE menu_item_ingredients
  ADD CONSTRAINT menu_item_ingredients_replacement_configuration_check
  CHECK (
    replacement_options_configured = false
    OR can_replace = true
  );

-- Existing concrete replacement rows prove both capability and configuration.
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
);
