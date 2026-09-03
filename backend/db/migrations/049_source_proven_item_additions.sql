BEGIN;

-- Migration 048 tried to recover ADD options from current menu_choice_groups.
-- Those source ADD groups had already been normalized/deleted by earlier
-- migrations, so there was nothing left to copy.
--
-- This migration restores ONLY additions explicitly present in the retained
-- Ritz/Lazy Jane's source data. No category-wide or culinary inference.

WITH source_additions (
  item_source_key,
  ingredient_name,
  sort_order,
  price_adjustment,
  price_configured
) AS (
  VALUES
    ('grilled_american_or_swiss_cheese', 'Bacon',       6010, 2.00::numeric, true),
    ('grilled_american_or_swiss_cheese', 'Ham',         6020, 2.00::numeric, true),
    ('grilled_american_or_swiss_cheese', 'Taylor Ham',  6030, 2.00::numeric, true),
    ('grilled_american_or_swiss_cheese', 'Tomato',      7010, 1.00::numeric, true),

    ('buttermilk_pancakes', 'Ham',        5010, 3.00::numeric, true),
    ('buttermilk_pancakes', 'Bacon',      5020, 3.00::numeric, true),
    ('buttermilk_pancakes', 'Sausage',    5030, 3.00::numeric, true),
    ('buttermilk_pancakes', 'Taylor Ham', 5040, 3.00::numeric, true),

    ('blueberry_pancakes', 'Ham',         5010, 2.55::numeric, true),
    ('blueberry_pancakes', 'Bacon',       5020, 2.55::numeric, true),
    ('blueberry_pancakes', 'Sausage',     5030, 2.55::numeric, true),
    ('blueberry_pancakes', 'Taylor Ham',  5040, 2.55::numeric, true),

    ('belgian_waffle', 'Strawberries',    5010, 2.00::numeric, true),

    -- Printed menu text explicitly states this salad addition.
    ('greek_salad_small', 'Grilled Chicken', 9010, 5.95::numeric, true),
    ('greek_salad_large', 'Grilled Chicken', 9010, 5.95::numeric, true)
)
INSERT INTO menu_item_additions (
  menu_item_id,
  ingredient_id,
  sort_order,
  is_active,
  price_adjustment,
  price_configured
)
SELECT
  item.id,
  ingredient.id,
  source.sort_order,
  true,
  source.price_adjustment,
  source.price_configured
FROM source_additions source
JOIN menu_items item
  ON item.source_key = source.item_source_key
JOIN ingredients ingredient
  ON lower(ingredient.name) = lower(source.ingredient_name)
ON CONFLICT (menu_item_id, ingredient_id) DO UPDATE
SET
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  price_adjustment = EXCLUDED.price_adjustment,
  price_configured = EXCLUDED.price_configured,
  updated_at = now();

COMMIT;
