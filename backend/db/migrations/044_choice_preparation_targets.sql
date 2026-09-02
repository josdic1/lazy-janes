BEGIN;

-- A source choice may directly select a preparation state for the containing
-- offering (for example Broiled/Fried or Mild/Spicy). This is different from
-- preparation_scheme_id, which means the selected choice itself still needs a
-- separate preparation question.
ALTER TABLE menu_choice_options
  ADD COLUMN IF NOT EXISTS target_preparation_option_id uuid
    REFERENCES preparation_options(id)
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS menu_choice_options_target_preparation_idx
  ON menu_choice_options (target_preparation_option_id)
  WHERE target_preparation_option_id IS NOT NULL;

INSERT INTO preparation_schemes (
  source_key,
  label,
  kind,
  is_active,
  sort_order
)
VALUES
  ('prep_other_broiled_fried', 'Preparation', 'other', true, 9000),
  ('prep_other_mild_spicy', 'Heat', 'other', true, 9010)
ON CONFLICT (source_key) DO UPDATE SET
  label = EXCLUDED.label,
  kind = EXCLUDED.kind,
  is_active = true,
  updated_at = now();

WITH desired (source_key, label, sort_order) AS (
  VALUES
    ('prep_other_broiled_fried', 'Broiled', 1),
    ('prep_other_broiled_fried', 'Fried', 2),
    ('prep_other_mild_spicy', 'Mild', 1),
    ('prep_other_mild_spicy', 'Spicy', 2)
)
INSERT INTO preparation_options (
  preparation_scheme_id,
  label,
  sort_order,
  is_default,
  is_active
)
SELECT
  scheme.id,
  desired.label,
  desired.sort_order,
  false,
  true
FROM desired
JOIN preparation_schemes scheme
  ON scheme.source_key = desired.source_key
ON CONFLICT (preparation_scheme_id, (lower(label))) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  is_default = false,
  is_active = true,
  updated_at = now();

WITH targets (
  item_source_key,
  group_label,
  option_label,
  preparation_source_key,
  preparation_option_label
) AS (
  VALUES
    ('broiled_or_fried_combo_platter', 'Preparation', 'Broiled', 'prep_other_broiled_fried', 'Broiled'),
    ('broiled_or_fried_combo_platter', 'Preparation', 'Fried', 'prep_other_broiled_fried', 'Fried'),
    ('linguini_ala_ritz_spicy_or_mild', 'Choose Heat', 'Mild', 'prep_other_mild_spicy', 'Mild'),
    ('linguini_ala_ritz_spicy_or_mild', 'Choose Heat', 'Spicy', 'prep_other_mild_spicy', 'Spicy')
)
UPDATE menu_choice_options choice_option
SET
  target_preparation_option_id = preparation_option.id,
  price_adjustment = 0,
  price_adjustment_configured = true,
  updated_at = now()
FROM menu_choice_groups choice_group
JOIN menu_items item
  ON item.id = choice_group.menu_item_id
JOIN targets
  ON targets.item_source_key = item.source_key
  AND lower(targets.group_label) = lower(choice_group.label)
JOIN preparation_schemes preparation_scheme
  ON preparation_scheme.source_key = targets.preparation_source_key
JOIN preparation_options preparation_option
  ON preparation_option.preparation_scheme_id = preparation_scheme.id
  AND lower(preparation_option.label) = lower(targets.preparation_option_label)
WHERE choice_option.choice_group_id = choice_group.id
  AND lower(choice_option.label) = lower(targets.option_label)
  AND choice_option.ingredient_id IS NULL
  AND choice_option.is_none_option = false;

COMMIT;
