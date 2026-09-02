-- Persistent source truth for menu-wide and targeted UMO rules.
-- This stores restaurant policy; the UMO adapter translates these rows into
-- MenuRule objects. No restaurant-specific behavior belongs in this table.

CREATE TABLE IF NOT EXISTS menu_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key text NOT NULL UNIQUE,

  target_kind text NOT NULL CHECK (
    target_kind IN ('menu', 'offering', 'choice_option')
  ),
  menu_item_id uuid
    REFERENCES menu_items(id)
    ON DELETE CASCADE,
  choice_group_id uuid
    REFERENCES menu_choice_groups(id)
    ON DELETE CASCADE,
  choice_option_id uuid
    REFERENCES menu_choice_options(id)
    ON DELETE CASCADE,

  condition_kind text NOT NULL CHECK (
    condition_kind IN ('local_time', 'guest_count')
  ),
  local_time_before time,
  local_time_at_or_after time,
  guest_count_minimum integer CHECK (
    guest_count_minimum IS NULL OR guest_count_minimum > 0
  ),
  guest_count_maximum integer CHECK (
    guest_count_maximum IS NULL OR guest_count_maximum > 0
  ),

  effect_kind text NOT NULL CHECK (
    effect_kind IN (
      'availability',
      'minimum_participants',
      'whole_party_required'
    )
  ),
  availability boolean,
  minimum_participants integer CHECK (
    minimum_participants IS NULL OR minimum_participants > 0
  ),
  whole_party_required boolean,

  evidence_kind text CHECK (
    evidence_kind IS NULL
    OR evidence_kind IN ('explicit', 'verified', 'inferred', 'unknown')
  ),

  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    (target_kind = 'menu'
      AND menu_item_id IS NULL
      AND choice_group_id IS NULL
      AND choice_option_id IS NULL)
    OR
    (target_kind = 'offering'
      AND menu_item_id IS NOT NULL
      AND choice_group_id IS NULL
      AND choice_option_id IS NULL)
    OR
    (target_kind = 'choice_option'
      AND menu_item_id IS NULL
      AND choice_group_id IS NULL
      AND choice_option_id IS NOT NULL)
  ),

  CHECK (
    (condition_kind = 'local_time'
      AND (local_time_before IS NOT NULL OR local_time_at_or_after IS NOT NULL)
      AND guest_count_minimum IS NULL
      AND guest_count_maximum IS NULL)
    OR
    (condition_kind = 'guest_count'
      AND local_time_before IS NULL
      AND local_time_at_or_after IS NULL
      AND (guest_count_minimum IS NOT NULL OR guest_count_maximum IS NOT NULL))
  ),

  CHECK (
    guest_count_minimum IS NULL
    OR guest_count_maximum IS NULL
    OR guest_count_minimum <= guest_count_maximum
  ),

  CHECK (
    (effect_kind = 'availability'
      AND availability IS NOT NULL
      AND minimum_participants IS NULL
      AND whole_party_required IS NULL)
    OR
    (effect_kind = 'minimum_participants'
      AND availability IS NULL
      AND minimum_participants IS NOT NULL
      AND whole_party_required IS NULL)
    OR
    (effect_kind = 'whole_party_required'
      AND availability IS NULL
      AND minimum_participants IS NULL
      AND whole_party_required IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS menu_rules_menu_item_idx
  ON menu_rules (menu_item_id)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS menu_rules_choice_option_idx
  ON menu_rules (choice_option_id)
  WHERE is_active = true;
