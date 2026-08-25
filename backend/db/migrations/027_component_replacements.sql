-- Menu-wide component capability upgrade.
--
-- Product rule:
--   ITEM -> PARTS -> allowed actions
--   NO / SIDE / EXTRA / REPLACE / PREP
--
-- A real choice group remains only when the server actually has to ask a
-- separate question. If one option is already a standard part of the item,
-- alternatives are replacements for that part rather than a second required
-- choice.

CREATE TABLE menu_item_ingredient_replacements (
  menu_item_id uuid NOT NULL,
  source_ingredient_id uuid NOT NULL,
  replacement_ingredient_id uuid NOT NULL
    REFERENCES ingredients(id)
    ON DELETE RESTRICT,
  preparation_scheme_id uuid
    REFERENCES preparation_schemes(id)
    ON DELETE SET NULL,
  price_adjustment numeric(10, 2) NOT NULL DEFAULT 0,
  price_adjustment_configured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (
    menu_item_id,
    source_ingredient_id,
    replacement_ingredient_id
  ),
  FOREIGN KEY (menu_item_id, source_ingredient_id)
    REFERENCES menu_item_ingredients(menu_item_id, ingredient_id)
    ON DELETE CASCADE,
  CHECK (source_ingredient_id <> replacement_ingredient_id)
);

CREATE INDEX menu_item_ingredient_replacements_item_idx
  ON menu_item_ingredient_replacements (
    menu_item_id,
    source_ingredient_id,
    sort_order,
    replacement_ingredient_id
  );

CREATE TABLE order_item_ingredient_replacements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL
    REFERENCES order_items(id)
    ON DELETE CASCADE,
  source_ingredient_id uuid NOT NULL
    REFERENCES ingredients(id)
    ON DELETE RESTRICT,
  replacement_ingredient_id uuid NOT NULL
    REFERENCES ingredients(id)
    ON DELETE RESTRICT,
  source_ingredient_name text NOT NULL,
  replacement_ingredient_name text NOT NULL,
  price_adjustment numeric(10, 2) NOT NULL DEFAULT 0,
  price_configured boolean NOT NULL DEFAULT false,
  allergen_flags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (order_item_id, source_ingredient_id),
  CHECK (source_ingredient_id <> replacement_ingredient_id)
);

CREATE INDEX order_item_ingredient_replacements_item_idx
  ON order_item_ingredient_replacements (order_item_id, created_at, id);

-- Convert old "choice" rows into component capabilities when the database can
-- prove the relationship without reading labels:
--
--   item already contains Chicken
--   choice options = Chicken / Beef / None
--
-- becomes:
--   Chicken [NO] [REPLACE -> Beef]
--
-- Groups that do not contain exactly one already-included component remain
-- real choice groups. Unresolved text-only options also remain choices rather
-- than being guessed.
CREATE OR REPLACE FUNCTION normalize_component_capabilities()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TEMP TABLE capability_groups ON COMMIT DROP AS
  WITH group_facts AS (
    SELECT
      choice_group.id AS group_id,
      choice_group.menu_item_id,
      count(*) FILTER (
        WHERE option_record.is_active
          AND option_record.is_none_option = false
      ) AS meaningful_count,
      count(*) FILTER (
        WHERE option_record.is_active
          AND option_record.is_none_option = false
          AND option_record.ingredient_id IS NOT NULL
      ) AS ingredient_backed_count,
      count(*) FILTER (
        WHERE option_record.is_active
          AND option_record.is_none_option = true
      ) AS none_count,
      count(*) FILTER (
        WHERE option_record.is_active
          AND option_record.is_none_option = false
          AND EXISTS (
            SELECT 1
            FROM menu_item_ingredients link
            WHERE link.menu_item_id = choice_group.menu_item_id
              AND link.ingredient_id = option_record.ingredient_id
          )
      ) AS included_option_count
    FROM menu_choice_groups choice_group
    JOIN menu_choice_options option_record
      ON option_record.choice_group_id = choice_group.id
    WHERE choice_group.is_active = true
    GROUP BY choice_group.id, choice_group.menu_item_id
  )
  SELECT group_id, menu_item_id
  FROM group_facts
  WHERE meaningful_count >= 1
    -- Every meaningful option must already resolve to a real ingredient.
    AND meaningful_count = ingredient_backed_count
    -- Exactly one option is the part the item already comes with.
    AND included_option_count = 1;

  CREATE TEMP TABLE capability_sources ON COMMIT DROP AS
  SELECT DISTINCT
    capability_group.group_id,
    capability_group.menu_item_id,
    option_record.ingredient_id AS source_ingredient_id,
    option_record.preparation_scheme_id AS source_preparation_scheme_id
  FROM capability_groups capability_group
  JOIN menu_choice_options option_record
    ON option_record.choice_group_id = capability_group.group_id
   AND option_record.is_active = true
   AND option_record.is_none_option = false
  JOIN menu_item_ingredients link
    ON link.menu_item_id = capability_group.menu_item_id
   AND link.ingredient_id = option_record.ingredient_id;

  -- Preserve preparation attached to the existing/default option and make NO
  -- available when the old group explicitly had a None option.
  UPDATE menu_item_ingredients link
  SET
    preparation_scheme_id = COALESCE(
      link.preparation_scheme_id,
      source.source_preparation_scheme_id
    ),
    can_remove = CASE
      WHEN EXISTS (
        SELECT 1
        FROM menu_choice_options option_record
        WHERE option_record.choice_group_id = source.group_id
          AND option_record.is_active = true
          AND option_record.is_none_option = true
      ) THEN true
      ELSE link.can_remove
    END,
    updated_at = now()
  FROM capability_sources source
  WHERE link.menu_item_id = source.menu_item_id
    AND link.ingredient_id = source.source_ingredient_id;

  -- Every other ingredient-backed option becomes an explicit allowed
  -- replacement of the default part. Price/prep travel with the replacement.
  INSERT INTO menu_item_ingredient_replacements (
    menu_item_id,
    source_ingredient_id,
    replacement_ingredient_id,
    preparation_scheme_id,
    price_adjustment,
    price_adjustment_configured,
    sort_order
  )
  SELECT
    source.menu_item_id,
    source.source_ingredient_id,
    option_record.ingredient_id,
    option_record.preparation_scheme_id,
    option_record.price_adjustment,
    option_record.price_adjustment_configured,
    option_record.sort_order
  FROM capability_sources source
  JOIN menu_choice_options option_record
    ON option_record.choice_group_id = source.group_id
   AND option_record.is_active = true
   AND option_record.is_none_option = false
   AND option_record.ingredient_id IS NOT NULL
   AND option_record.ingredient_id <> source.source_ingredient_id
  ON CONFLICT (
    menu_item_id,
    source_ingredient_id,
    replacement_ingredient_id
  ) DO UPDATE
  SET
    preparation_scheme_id = EXCLUDED.preparation_scheme_id,
    price_adjustment = EXCLUDED.price_adjustment,
    price_adjustment_configured = EXCLUDED.price_adjustment_configured,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

  -- These groups have now been represented by the part itself and its
  -- capabilities, so keeping them would create the fake duplicate question.
  DELETE FROM menu_choice_groups choice_group
  USING capability_groups capability_group
  WHERE choice_group.id = capability_group.group_id;
END;
$$;

-- Promote a one-ingredient + NONE legacy group into the item-part table when
-- the old flat source omitted that obvious default part. This is generic: it
-- uses resolved ingredient identity and NONE semantics, never item names.
WITH promotable AS (
  SELECT
    choice_group.id AS group_id,
    choice_group.menu_item_id,
    choice_group.role,
    choice_group.sort_order,
    min(option_record.ingredient_id::text)::uuid AS ingredient_id
  FROM menu_choice_groups choice_group
  JOIN menu_choice_options option_record
    ON option_record.choice_group_id = choice_group.id
   AND option_record.is_active = true
  WHERE choice_group.is_active = true
  GROUP BY choice_group.id, choice_group.menu_item_id, choice_group.role, choice_group.sort_order
  HAVING
    count(*) FILTER (WHERE option_record.is_none_option = false) = 1
    AND count(*) FILTER (WHERE option_record.is_none_option = false AND option_record.ingredient_id IS NOT NULL) = 1
    AND count(*) FILTER (WHERE option_record.is_none_option = true) >= 1
)
INSERT INTO menu_item_ingredients (
  menu_item_id,
  ingredient_id,
  role,
  preparation_scheme_id,
  can_remove,
  can_side,
  can_extra,
  extra_price,
  extra_price_configured,
  sort_order
)
SELECT
  promotable.menu_item_id,
  promotable.ingredient_id,
  promotable.role,
  option_record.preparation_scheme_id,
  true,
  false,
  true,
  0,
  false,
  promotable.sort_order
FROM promotable
JOIN menu_choice_groups choice_group
  ON choice_group.id = promotable.group_id
JOIN menu_choice_options option_record
  ON option_record.choice_group_id = choice_group.id
 AND option_record.ingredient_id = promotable.ingredient_id
 AND option_record.is_none_option = false
ON CONFLICT (menu_item_id, ingredient_id) DO UPDATE
SET
  can_remove = true,
  can_extra = menu_item_ingredients.can_extra OR EXCLUDED.can_extra,
  preparation_scheme_id = COALESCE(menu_item_ingredients.preparation_scheme_id, EXCLUDED.preparation_scheme_id),
  updated_at = now();

-- A preparation already attached to a part must not also survive as a fake
-- standalone choice group. Remove a group only when its complete active option
-- label set exactly matches an active preparation scheme attached to this item.
DELETE FROM menu_choice_groups choice_group
WHERE EXISTS (
  SELECT 1
  FROM menu_item_ingredients link
  JOIN preparation_schemes scheme
    ON scheme.id = link.preparation_scheme_id
   AND scheme.is_active = true
  WHERE link.menu_item_id = choice_group.menu_item_id
    AND (
      SELECT array_agg(lower(option_record.label) ORDER BY lower(option_record.label))
      FROM menu_choice_options option_record
      WHERE option_record.choice_group_id = choice_group.id
        AND option_record.is_active = true
        AND option_record.is_none_option = false
    ) = (
      SELECT array_agg(lower(prep_option.label) ORDER BY lower(prep_option.label))
      FROM preparation_options prep_option
      WHERE prep_option.preparation_scheme_id = scheme.id
        AND prep_option.is_active = true
    )
);

SELECT normalize_component_capabilities();
