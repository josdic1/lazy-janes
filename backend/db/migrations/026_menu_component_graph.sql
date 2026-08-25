-- Normalize menu customization around three concepts:
--   1) ingredients: reusable restaurant-wide food catalog
--   2) preparation schemes: reusable ways a component can be prepared
--   3) item composition: standard ingredients plus real choice slots
--
-- Existing menu_item_ingredients are the recipe-component relation. Existing
-- menu_choice_groups/options are retained as the item choice-slot relation.
-- This migration adds only the missing semantics instead of creating a second
-- parallel component model.

ALTER TABLE ingredients
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'other';

ALTER TABLE ingredients
  DROP CONSTRAINT IF EXISTS ingredients_kind_check;
ALTER TABLE ingredients
  ADD CONSTRAINT ingredients_kind_check
  CHECK (kind IN (
    'protein', 'egg', 'bread', 'cheese', 'sauce',
    'side', 'veggie', 'fruit', 'other'
  ));

CREATE TABLE IF NOT EXISTS preparation_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key text NOT NULL UNIQUE,
  label text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('meat_cook', 'egg_cook', 'bread_prep', 'other')),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS preparation_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preparation_scheme_id uuid NOT NULL
    REFERENCES preparation_schemes(id)
    ON DELETE CASCADE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS preparation_options_scheme_label_ci_idx
  ON preparation_options (preparation_scheme_id, lower(label));

ALTER TABLE menu_item_ingredients
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS preparation_scheme_id uuid
    REFERENCES preparation_schemes(id)
    ON DELETE SET NULL;

ALTER TABLE menu_item_ingredients
  DROP CONSTRAINT IF EXISTS menu_item_ingredients_role_check;
ALTER TABLE menu_item_ingredients
  ADD CONSTRAINT menu_item_ingredients_role_check
  CHECK (role IN (
    'protein', 'egg', 'bread', 'cheese', 'sauce',
    'side', 'veggie', 'fruit', 'other'
  ));

ALTER TABLE menu_choice_groups
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'other';

ALTER TABLE menu_choice_groups
  DROP CONSTRAINT IF EXISTS menu_choice_groups_role_check;
ALTER TABLE menu_choice_groups
  ADD CONSTRAINT menu_choice_groups_role_check
  CHECK (role IN (
    'protein', 'egg', 'bread', 'cheese', 'sauce',
    'side', 'veggie', 'fruit', 'other'
  ));

ALTER TABLE menu_choice_options
  ADD COLUMN IF NOT EXISTS preparation_scheme_id uuid
    REFERENCES preparation_schemes(id)
    ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_none_option boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price_adjustment_configured boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS order_item_preparation_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL
    REFERENCES order_items(id)
    ON DELETE CASCADE,
  ingredient_id uuid
    REFERENCES ingredients(id)
    ON DELETE SET NULL,
  choice_option_id uuid
    REFERENCES menu_choice_options(id)
    ON DELETE SET NULL,
  preparation_scheme_id uuid
    REFERENCES preparation_schemes(id)
    ON DELETE SET NULL,
  preparation_option_id uuid
    REFERENCES preparation_options(id)
    ON DELETE SET NULL,
  target_label text NOT NULL,
  scheme_label text NOT NULL,
  option_label text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  -- New writes target exactly one relation (enforced by API). Both FKs may
  -- later become NULL via ON DELETE SET NULL while the snapshot labels remain.
  CHECK (NOT (ingredient_id IS NOT NULL AND choice_option_id IS NOT NULL)),
  UNIQUE (order_item_id, ingredient_id, preparation_scheme_id),
  UNIQUE (order_item_id, choice_option_id, preparation_scheme_id)
);

CREATE INDEX IF NOT EXISTS order_item_preparation_selections_item_idx
  ON order_item_preparation_selections (order_item_id, created_at, id);
