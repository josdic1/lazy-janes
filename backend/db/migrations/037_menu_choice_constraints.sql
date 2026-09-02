CREATE TABLE IF NOT EXISTS menu_choice_constraints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  menu_item_id uuid NOT NULL
    REFERENCES menu_items(id)
    ON DELETE CASCADE,

  source_choice_group_id uuid NOT NULL
    REFERENCES menu_choice_groups(id)
    ON DELETE CASCADE,

  source_choice_option_id uuid NOT NULL
    REFERENCES menu_choice_options(id)
    ON DELETE CASCADE,

  target_choice_group_id uuid NOT NULL
    REFERENCES menu_choice_groups(id)
    ON DELETE CASCADE,

  min_selections integer CHECK (
    min_selections IS NULL OR min_selections >= 0
  ),

  max_selections integer CHECK (
    max_selections IS NULL OR max_selections >= 0
  ),

  label text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    min_selections IS NOT NULL
    OR max_selections IS NOT NULL
  ),

  CHECK (
    min_selections IS NULL
    OR max_selections IS NULL
    OR min_selections <= max_selections
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS menu_choice_constraints_unique_idx
  ON menu_choice_constraints (
    source_choice_option_id,
    target_choice_group_id
  );

CREATE INDEX IF NOT EXISTS menu_choice_constraints_item_idx
  ON menu_choice_constraints (menu_item_id)
  WHERE is_active = true;
