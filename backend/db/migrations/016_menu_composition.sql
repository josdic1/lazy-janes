-- Replace parent-menu-item modifier duplication with explicit restaurant truth:
--   menu item -> reusable ingredients -> remove/extra
--   menu item -> explicit choice groups/options
--   order item -> recorded deviations from the standard item
--
-- Legacy modifier tables remain readable for historical orders, but new ordering
-- does not write to them.

ALTER TABLE menu_items
  ADD COLUMN allergen_flags text[] NOT NULL DEFAULT '{}';

CREATE TABLE ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  default_add_price numeric(10, 2) NOT NULL DEFAULT 0
    CHECK (default_add_price >= 0),
  allergen_flags text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ingredients_name_ci_idx
  ON ingredients (lower(name));

CREATE INDEX ingredients_active_name_idx
  ON ingredients (is_active, lower(name));

CREATE TABLE menu_item_ingredients (
  menu_item_id uuid NOT NULL
    REFERENCES menu_items(id)
    ON DELETE CASCADE,
  ingredient_id uuid NOT NULL
    REFERENCES ingredients(id)
    ON DELETE RESTRICT,
  can_remove boolean NOT NULL DEFAULT true,
  can_extra boolean NOT NULL DEFAULT true,
  extra_price numeric(10, 2) NOT NULL DEFAULT 0
    CHECK (extra_price >= 0),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (menu_item_id, ingredient_id)
);

CREATE INDEX menu_item_ingredients_item_order_idx
  ON menu_item_ingredients (menu_item_id, sort_order, ingredient_id);

CREATE TABLE menu_choice_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL
    REFERENCES menu_items(id)
    ON DELETE CASCADE,
  label text NOT NULL,
  min_selections integer NOT NULL DEFAULT 0
    CHECK (min_selections >= 0),
  max_selections integer,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    max_selections IS NULL
    OR max_selections > 0
  ),
  CHECK (
    max_selections IS NULL
    OR max_selections >= min_selections
  )
);

CREATE UNIQUE INDEX menu_choice_groups_item_label_ci_idx
  ON menu_choice_groups (menu_item_id, lower(label));

CREATE TABLE menu_choice_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  choice_group_id uuid NOT NULL
    REFERENCES menu_choice_groups(id)
    ON DELETE CASCADE,
  label text NOT NULL,
  ingredient_id uuid
    REFERENCES ingredients(id)
    ON DELETE SET NULL,
  price_adjustment numeric(10, 2) NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX menu_choice_options_group_label_ci_idx
  ON menu_choice_options (choice_group_id, lower(label));

CREATE INDEX menu_choice_options_group_order_idx
  ON menu_choice_options (choice_group_id, sort_order, label);

CREATE TABLE order_item_ingredient_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL
    REFERENCES order_items(id)
    ON DELETE CASCADE,
  ingredient_id uuid NOT NULL
    REFERENCES ingredients(id)
    ON DELETE RESTRICT,
  change_kind text NOT NULL CHECK (
    change_kind IN ('remove', 'extra', 'add')
  ),
  ingredient_name text NOT NULL,
  price_adjustment numeric(10, 2) NOT NULL DEFAULT 0
    CHECK (price_adjustment >= 0),
  allergen_flags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),

  -- One ingredient has one meaning on one ordered item. This prevents
  -- impossible states such as NO BACON + EXTRA BACON.
  UNIQUE (order_item_id, ingredient_id)
);

CREATE INDEX order_item_ingredient_changes_item_idx
  ON order_item_ingredient_changes (order_item_id, created_at, id);

CREATE TABLE order_item_choice_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL
    REFERENCES order_items(id)
    ON DELETE CASCADE,
  choice_group_id uuid
    REFERENCES menu_choice_groups(id)
    ON DELETE SET NULL,
  choice_option_id uuid
    REFERENCES menu_choice_options(id)
    ON DELETE SET NULL,
  group_label text NOT NULL,
  option_label text NOT NULL,
  ingredient_id uuid
    REFERENCES ingredients(id)
    ON DELETE SET NULL,
  price_adjustment numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (order_item_id, choice_group_id, choice_option_id)
);

CREATE INDEX order_item_choice_selections_item_idx
  ON order_item_choice_selections (order_item_id, created_at, id);


-- Translate migration 015 data into the composition model. This function is
-- intentionally reusable because fresh databases run migrations before the
-- menu seed; the base menu SQL creates the legacy choice rows once, then
-- seedMenu.ts translates them and removes the temporary duplicate rows.
CREATE OR REPLACE FUNCTION migrate_lazy_janes_legacy_modifiers_to_composition()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  group_row record;
  base_item record;
  option_row record;
  new_group_id uuid;
  ingredient_id_value uuid;
BEGIN
  -- Legacy INCLUDED options are standard service-visible components.
  INSERT INTO ingredients (
    name,
    default_add_price,
    sort_order
  )
  SELECT DISTINCT ON (
    lower(
      CASE
        WHEN lower(modifier.name) = 'pickle' THEN 'Pickles'
        ELSE modifier.name
      END
    )
  )
    CASE
      WHEN lower(modifier.name) = 'pickle' THEN 'Pickles'
      ELSE modifier.name
    END,
    GREATEST(modifier.price, 0),
    modifier.sort_order
  FROM menu_modifier_groups legacy_group
  JOIN menu_modifier_group_items legacy_option
    ON legacy_option.group_id = legacy_group.id
  JOIN menu_items modifier
    ON modifier.id = legacy_option.menu_item_id
  WHERE legacy_group.kind = 'included'
    AND lower(modifier.name) NOT IN (
      'choice of dressing',
      'one vegetable',
      'beverage'
    )
  ORDER BY
    lower(
      CASE
        WHEN lower(modifier.name) = 'pickle' THEN 'Pickles'
        ELSE modifier.name
      END
    ),
    modifier.sort_order,
    modifier.id
  ON CONFLICT ((lower(name))) DO NOTHING;

  INSERT INTO menu_item_ingredients (
    menu_item_id,
    ingredient_id,
    can_remove,
    can_extra,
    extra_price,
    sort_order
  )
  SELECT DISTINCT ON (
    modifier.parent_item_id,
    ingredient.id
  )
    modifier.parent_item_id,
    ingredient.id,
    true,
    true,
    GREATEST(modifier.price, 0),
    legacy_option.sort_order
  FROM menu_modifier_groups legacy_group
  JOIN menu_modifier_group_items legacy_option
    ON legacy_option.group_id = legacy_group.id
  JOIN menu_items modifier
    ON modifier.id = legacy_option.menu_item_id
  JOIN ingredients ingredient
    ON lower(ingredient.name) = lower(
      CASE
        WHEN lower(modifier.name) = 'pickle' THEN 'Pickles'
        ELSE modifier.name
      END
    )
  WHERE legacy_group.kind = 'included'
    AND modifier.parent_item_id IS NOT NULL
    AND lower(modifier.name) NOT IN (
      'choice of dressing',
      'one vegetable',
      'beverage'
    )
  ORDER BY
    modifier.parent_item_id,
    ingredient.id,
    legacy_option.sort_order
  ON CONFLICT (menu_item_id, ingredient_id) DO UPDATE
  SET
    sort_order = LEAST(
      menu_item_ingredients.sort_order,
      EXCLUDED.sort_order
    ),
    updated_at = now();

  -- Legacy CHOICE / ADDON groups become one explicit choice group per real
  -- base item. Category-scoped legacy groups are expanded here once, without
  -- creating child menu_items.
  FOR group_row IN
    SELECT
      id,
      category_id,
      menu_item_id,
      name,
      min_selections,
      max_selections,
      sort_order
    FROM menu_modifier_groups
    WHERE kind IN ('choice', 'addon')
      AND is_active = true
    ORDER BY sort_order, id
  LOOP
    FOR base_item IN
      SELECT item.id
      FROM menu_items item
      WHERE item.is_modifier = false
        AND (
          item.id = group_row.menu_item_id
          OR (
            group_row.menu_item_id IS NULL
            AND item.category_id = group_row.category_id
          )
        )
      ORDER BY item.sort_order, item.id
    LOOP
      INSERT INTO menu_choice_groups (
        menu_item_id,
        label,
        min_selections,
        max_selections,
        sort_order
      )
      VALUES (
        base_item.id,
        group_row.name,
        group_row.min_selections,
        group_row.max_selections,
        group_row.sort_order
      )
      ON CONFLICT (menu_item_id, (lower(label))) DO UPDATE
      SET
        min_selections = EXCLUDED.min_selections,
        max_selections = EXCLUDED.max_selections,
        sort_order = EXCLUDED.sort_order,
        is_active = true,
        updated_at = now()
      RETURNING id INTO new_group_id;

      FOR option_row IN
        SELECT
          modifier.name,
          modifier.price,
          legacy_option.sort_order,
          legacy_option.is_default
        FROM menu_modifier_group_items legacy_option
        JOIN menu_items modifier
          ON modifier.id = legacy_option.menu_item_id
        WHERE legacy_option.group_id = group_row.id
          AND modifier.parent_item_id = base_item.id
        ORDER BY legacy_option.sort_order, modifier.name
      LOOP
        SELECT ingredient.id
        INTO ingredient_id_value
        FROM ingredients ingredient
        WHERE lower(ingredient.name) = lower(
          CASE
            WHEN lower(option_row.name) = 'pickle' THEN 'Pickles'
            WHEN lower(option_row.name) = 'matzoh ball' THEN 'Matzoh Balls'
            WHEN lower(option_row.name) = 'add fries' THEN 'French Fries'
            WHEN lower(option_row.name) = 'add bacon' THEN 'Bacon'
            WHEN lower(option_row.name) = 'veggie burger' THEN 'Veggie Burger'
            ELSE option_row.name
          END
        )
        LIMIT 1;

        INSERT INTO menu_choice_options (
          choice_group_id,
          label,
          ingredient_id,
          price_adjustment,
          sort_order,
          is_default
        )
        VALUES (
          new_group_id,
          option_row.name,
          ingredient_id_value,
          GREATEST(option_row.price, 0),
          option_row.sort_order,
          false
        )
        ON CONFLICT (choice_group_id, (lower(label))) DO UPDATE
        SET
          ingredient_id = EXCLUDED.ingredient_id,
          price_adjustment = EXCLUDED.price_adjustment,
          sort_order = EXCLUDED.sort_order,
          is_default = EXCLUDED.is_default,
          is_active = true,
          updated_at = now();
      END LOOP;
    END LOOP;
  END LOOP;

  -- The old modifier model is now dead for new service. Keep only legacy
  -- modifier menu rows that are referenced by historical orders.
  UPDATE menu_modifier_groups
  SET is_active = false,
      updated_at = now()
  WHERE is_active = true;

  UPDATE menu_items
  SET status = 'inactive',
      updated_at = now()
  WHERE is_modifier = true
    AND status <> 'inactive';

  DELETE FROM menu_modifier_group_items;
  DELETE FROM menu_modifier_groups;

  DELETE FROM menu_items modifier
  WHERE modifier.is_modifier = true
    AND NOT EXISTS (
      SELECT 1
      FROM order_item_modifiers historical
      WHERE historical.menu_item_id = modifier.id
    );
END;
$$;

SELECT migrate_lazy_janes_legacy_modifiers_to_composition();
