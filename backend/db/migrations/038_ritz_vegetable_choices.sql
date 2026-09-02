BEGIN;

-- Confirmed Ritz restaurant truth learned after the retained source snapshot.
INSERT INTO ingredients (
  name,
  kind,
  is_active,
  is_addable,
  default_add_price,
  add_price_configured,
  allergen_flags,
  sort_order
)
VALUES (
  'Brussels Sprouts',
  'veggie',
  true,
  false,
  0,
  false,
  '{}',
  0
)
ON CONFLICT DO NOTHING;


-- Every item whose existing Side choice contains "One Vegetable" or
-- "Two Vegetables" receives the real child choice slot "Vegetables".
INSERT INTO menu_choice_groups (
  menu_item_id,
  label,
  role,
  relationship,
  min_selections,
  max_selections,
  sort_order,
  is_active
)
SELECT DISTINCT
  source_group.menu_item_id,
  'Vegetables',
  'veggie',
  'comes_with',
  0,
  2,
  source_group.sort_order + 1,
  true
FROM menu_choice_groups source_group
JOIN menu_choice_options source_option
  ON source_option.choice_group_id = source_group.id
WHERE source_group.is_active = true
  AND source_option.is_active = true
  AND lower(source_option.label) IN (
    'one vegetable',
    'two vegetables'
  )
ON CONFLICT DO NOTHING;


-- Add the four confirmed Ritz vegetable choices to each child slot.
INSERT INTO menu_choice_options (
  choice_group_id,
  label,
  ingredient_id,
  preparation_scheme_id,
  is_none_option,
  price_adjustment,
  price_adjustment_configured,
  sort_order,
  is_default,
  is_active
)
SELECT
  vegetable_group.id,
  ingredient.name,
  ingredient.id,
  NULL,
  false,
  0,
  false,
  values_to_add.sort_order,
  false,
  true
FROM menu_choice_groups vegetable_group
CROSS JOIN (
  VALUES
    ('Carrots', 10),
    ('Broccoli', 20),
    ('Zucchini', 30),
    ('Brussels Sprouts', 40)
) AS values_to_add(ingredient_name, sort_order)
JOIN ingredients ingredient
  ON lower(ingredient.name) = lower(values_to_add.ingredient_name)
WHERE lower(vegetable_group.label) = 'vegetables'
  AND EXISTS (
    SELECT 1
    FROM menu_choice_groups source_group
    JOIN menu_choice_options source_option
      ON source_option.choice_group_id = source_group.id
    WHERE source_group.menu_item_id = vegetable_group.menu_item_id
      AND source_group.is_active = true
      AND source_option.is_active = true
      AND lower(source_option.label) IN (
        'one vegetable',
        'two vegetables'
      )
  )
ON CONFLICT DO NOTHING;


-- One Vegetable -> Vegetables must contain exactly 1 selection.
INSERT INTO menu_choice_constraints (
  menu_item_id,
  source_choice_group_id,
  source_choice_option_id,
  target_choice_group_id,
  min_selections,
  max_selections,
  label,
  sort_order,
  is_active
)
SELECT
  source_group.menu_item_id,
  source_group.id,
  source_option.id,
  target_group.id,
  CASE
    WHEN lower(source_option.label) = 'one vegetable' THEN 1
    WHEN lower(source_option.label) = 'two vegetables' THEN 2
  END,
  CASE
    WHEN lower(source_option.label) = 'one vegetable' THEN 1
    WHEN lower(source_option.label) = 'two vegetables' THEN 2
  END,
  source_option.label || ' activates Vegetables',
  10,
  true
FROM menu_choice_groups source_group
JOIN menu_choice_options source_option
  ON source_option.choice_group_id = source_group.id
JOIN menu_choice_groups target_group
  ON target_group.menu_item_id = source_group.menu_item_id
 AND lower(target_group.label) = 'vegetables'
WHERE source_group.is_active = true
  AND source_option.is_active = true
  AND target_group.is_active = true
  AND lower(source_option.label) IN (
    'one vegetable',
    'two vegetables'
  )
ON CONFLICT (
  source_choice_option_id,
  target_choice_group_id
)
DO UPDATE SET
  min_selections = EXCLUDED.min_selections,
  max_selections = EXCLUDED.max_selections,
  label = EXCLUDED.label,
  is_active = true,
  updated_at = now();

COMMIT;
