BEGIN;

-- Ritz confirmed vegetable availability:
-- Before 4 PM: Broccoli, Carrots
-- At/after 4 PM: Zucchini, Brussels Sprouts, Carrots

-- Zucchini is unavailable before 4 PM.
INSERT INTO menu_rules (
  source_key,
  target_kind,
  choice_option_id,
  condition_kind,
  local_time_before,
  effect_kind,
  availability,
  evidence_kind,
  is_active
)
SELECT
  'ritz-vegetables-before-1600-zucchini:' || item.id::text,
  'choice_option',
  option.id,
  'local_time',
  '16:00',
  'availability',
  false,
  'verified',
  true
FROM menu_items item
JOIN menu_choice_groups choice_group
  ON choice_group.menu_item_id = item.id
JOIN menu_choice_options option
  ON option.choice_group_id = choice_group.id
WHERE choice_group.is_active = true
  AND option.is_active = true
  AND lower(choice_group.label) = 'vegetables'
  AND lower(option.label) = 'zucchini'
ON CONFLICT (source_key) DO UPDATE SET
  is_active = true,
  updated_at = now();


-- Brussels Sprouts are unavailable before 4 PM.
INSERT INTO menu_rules (
  source_key,
  target_kind,
  choice_option_id,
  condition_kind,
  local_time_before,
  effect_kind,
  availability,
  evidence_kind,
  is_active
)
SELECT
  'ritz-vegetables-before-1600-brussels:' || item.id::text,
  'choice_option',
  option.id,
  'local_time',
  '16:00',
  'availability',
  false,
  'verified',
  true
FROM menu_items item
JOIN menu_choice_groups choice_group
  ON choice_group.menu_item_id = item.id
JOIN menu_choice_options option
  ON option.choice_group_id = choice_group.id
WHERE choice_group.is_active = true
  AND option.is_active = true
  AND lower(choice_group.label) = 'vegetables'
  AND lower(option.label) = 'brussels sprouts'
ON CONFLICT (source_key) DO UPDATE SET
  is_active = true,
  updated_at = now();


-- Broccoli is unavailable beginning exactly at 4 PM.
INSERT INTO menu_rules (
  source_key,
  target_kind,
  choice_option_id,
  condition_kind,
  local_time_at_or_after,
  effect_kind,
  availability,
  evidence_kind,
  is_active
)
SELECT
  'ritz-vegetables-at-or-after-1600-broccoli:' || item.id::text,
  'choice_option',
  option.id,
  'local_time',
  '16:00',
  'availability',
  false,
  'verified',
  true
FROM menu_items item
JOIN menu_choice_groups choice_group
  ON choice_group.menu_item_id = item.id
JOIN menu_choice_options option
  ON option.choice_group_id = choice_group.id
WHERE choice_group.is_active = true
  AND option.is_active = true
  AND lower(choice_group.label) = 'vegetables'
  AND lower(option.label) = 'broccoli'
ON CONFLICT (source_key) DO UPDATE SET
  is_active = true,
  updated_at = now();

COMMIT;
