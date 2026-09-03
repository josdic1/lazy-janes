BEGIN;

ALTER TABLE menu_item_additions
  ADD COLUMN IF NOT EXISTS price_adjustment numeric(10, 2) NOT NULL DEFAULT 0
    CHECK (price_adjustment >= 0);

ALTER TABLE menu_item_additions
  ADD COLUMN IF NOT EXISTS price_configured boolean NOT NULL DEFAULT false;

-- Convert only source/configuration groups whose labels explicitly say ADD.
-- This is menu truth, not category or culinary inference.
INSERT INTO menu_item_additions (
  menu_item_id,
  ingredient_id,
  sort_order,
  is_active,
  price_adjustment,
  price_configured
)
SELECT
  choice_group.menu_item_id,
  choice_option.ingredient_id,
  choice_group.sort_order * 100 + choice_option.sort_order,
  true,
  GREATEST(choice_option.price_adjustment, 0),
  choice_option.price_adjustment_configured
FROM menu_choice_groups choice_group
JOIN menu_choice_options choice_option
  ON choice_option.choice_group_id = choice_group.id
WHERE choice_group.is_active = true
  AND choice_option.is_active = true
  AND choice_option.ingredient_id IS NOT NULL
  AND (
    lower(choice_group.label) LIKE 'add %'
    OR lower(choice_group.label) = 'add-on'
  )
ON CONFLICT (menu_item_id, ingredient_id) DO UPDATE
SET
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  price_adjustment = EXCLUDED.price_adjustment,
  price_configured = EXCLUDED.price_configured,
  updated_at = now();

-- The retained printed menu explicitly states these two additions, but they
-- were not represented as structured source choice groups.
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
  true
FROM (
  VALUES
    ('greek_salad_small', 'Grilled Chicken', 9000, 5.95::numeric),
    ('greek_salad_large', 'Grilled Chicken', 9000, 5.95::numeric)
) AS source(source_key, ingredient_name, sort_order, price_adjustment)
JOIN menu_items item
  ON item.source_key = source.source_key
JOIN ingredients ingredient
  ON lower(ingredient.name) = lower(source.ingredient_name)
ON CONFLICT (menu_item_id, ingredient_id) DO UPDATE
SET
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  price_adjustment = EXCLUDED.price_adjustment,
  price_configured = true,
  updated_at = now();

-- These source ADD groups are now represented by menu_item_additions / UMO
-- AddCatalog. Keep the records for history but stop rendering them twice.
UPDATE menu_choice_groups
SET
  is_active = false,
  updated_at = now()
WHERE is_active = true
  AND (
    lower(label) LIKE 'add %'
    OR lower(label) = 'add-on'
  );

COMMIT;
