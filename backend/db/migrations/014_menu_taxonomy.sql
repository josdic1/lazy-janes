-- Introduce first-class ordered menu taxonomy.
--
-- Menu structure becomes:
--   menu_group -> menu_category -> menu_item -> modifier
--
-- Existing menu item ordering is preserved. Existing category strings are
-- mapped explicitly, with a safe "Other" fallback for any locally-created
-- categories not represented in the original Lazy Jane's seed.

CREATE TABLE menu_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL
    REFERENCES menu_groups(id)
    ON DELETE RESTRICT,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (group_id, name)
);

CREATE INDEX menu_categories_group_order_idx
  ON menu_categories (group_id, sort_order, name);

CREATE TEMP TABLE menu_taxonomy_map (
  source_category text PRIMARY KEY,
  group_name text NOT NULL,
  group_sort_order integer NOT NULL,
  category_name text NOT NULL,
  category_sort_order integer NOT NULL
) ON COMMIT DROP;

INSERT INTO menu_taxonomy_map (
  source_category,
  group_name,
  group_sort_order,
  category_name,
  category_sort_order
)
VALUES
  -- Specials
  ('Specials', 'Specials', 10, 'Specials', 10),

  -- Breakfast
  ('Breakfast - Eggs', 'Breakfast', 20, 'Eggs', 10),
  ('Breakfast - Egg Sandwiches', 'Breakfast', 20, 'Egg Sandwiches', 20),
  ('Breakfast - Omelettes', 'Breakfast', 20, 'Omelettes', 30),
  ('Breakfast - From the Griddle', 'Breakfast', 20, 'From the Griddle', 40),
  ('Breakfast - Bagel Bin', 'Breakfast', 20, 'Bagel Bin', 50),

  -- Lunch & Dinner
  ('Appetizers & Fruits', 'Lunch & Dinner', 30, 'Appetizers & Fruits', 10),
  ('Soups', 'Lunch & Dinner', 30, 'Soups', 20),
  ('Refreshing Cold Platters & Salads', 'Lunch & Dinner', 30, 'Cold Platters & Salads', 30),
  ('Distinctive Specialties', 'Lunch & Dinner', 30, 'Distinctive Specialties', 40),
  ('Trim Line Features', 'Lunch & Dinner', 30, 'Trim Line Features', 50),
  ('From the Char-Broiler', 'Lunch & Dinner', 30, 'From the Char-Broiler', 60),
  ('Entrees', 'Lunch & Dinner', 30, 'Entrees', 70),
  ('From the Sea', 'Lunch & Dinner', 30, 'From the Sea', 80),
  ('Prime Streaks & Chops', 'Lunch & Dinner', 30, 'Prime Steaks & Chops', 90),
  ('Italian Specialties', 'Lunch & Dinner', 30, 'Italian Specialties', 100),
  ('Jewish Specialties', 'Lunch & Dinner', 30, 'Jewish Specialties', 110),

  -- Sandwiches & Deli
  ('Chicken Cutlet Sandwiches', 'Sandwiches & Deli', 40, 'Chicken Cutlet Sandwiches', 10),
  ('Buttermilk Fried Chicken Sandwiches', 'Sandwiches & Deli', 40, 'Fried Chicken Sandwiches', 20),
  ('Wraps', 'Sandwiches & Deli', 40, 'Wraps', 30),
  ('Deli', 'Sandwiches & Deli', 40, 'Deli', 40),
  ('Sandwiches', 'Sandwiches & Deli', 40, 'Sandwiches', 50),
  ('Hot Open Sandwiches', 'Sandwiches & Deli', 40, 'Hot Open Sandwiches', 60),
  ('Triple Decker Sandwiches', 'Sandwiches & Deli', 40, 'Triple Decker Sandwiches', 70),

  -- Gluten Free
  ('Gluten Free Dinner - Pasta', 'Gluten Free', 50, 'Dinner — Pasta', 10),
  ('Gluten Free Dinner - Chicken', 'Gluten Free', 50, 'Dinner — Chicken', 20),
  ('Gluten Free Dinner - Fish', 'Gluten Free', 50, 'Dinner — Fish', 30),
  ('Gluten Free Dinner - Meat', 'Gluten Free', 50, 'Dinner — Meat', 40),
  ('Gluten Free Lunch - Pasta', 'Gluten Free', 50, 'Lunch — Pasta', 50),
  ('Gluten Free Lunch - Chicken', 'Gluten Free', 50, 'Lunch — Chicken', 60),
  ('Gluten Free Lunch - Sandwiches', 'Gluten Free', 50, 'Lunch — Sandwiches', 70),

  -- Kids
  ('Kids Korner', 'Kids', 60, 'Kids Korner', 10),

  -- Sides & Sweets
  ('Side Orders', 'Sides & Sweets', 70, 'Side Orders', 10),
  ('Homemade Desserts', 'Sides & Sweets', 70, 'Homemade Desserts', 20),

  -- Drinks & Ice Cream
  ('Drinks - Beverages', 'Drinks & Ice Cream', 80, 'Beverages', 10),
  ('Shakes, Sundaes & Ice Cream', 'Drinks & Ice Cream', 80, 'Shakes, Sundaes & Ice Cream', 20);

INSERT INTO menu_groups (
  name,
  sort_order
)
SELECT DISTINCT
  group_name,
  group_sort_order
FROM menu_taxonomy_map
ORDER BY group_sort_order;

INSERT INTO menu_categories (
  group_id,
  name,
  sort_order
)
SELECT
  groups.id,
  mapping.category_name,
  mapping.category_sort_order
FROM menu_taxonomy_map AS mapping
JOIN menu_groups AS groups
  ON groups.name = mapping.group_name
ORDER BY
  mapping.group_sort_order,
  mapping.category_sort_order;

-- Preserve any categories created locally outside the original seed.
INSERT INTO menu_groups (
  name,
  sort_order
)
SELECT
  'Other',
  999
WHERE EXISTS (
  SELECT 1
  FROM menu_items AS items
  LEFT JOIN menu_taxonomy_map AS mapping
    ON mapping.source_category = items.category
  WHERE mapping.source_category IS NULL
);

INSERT INTO menu_categories (
  group_id,
  name,
  sort_order
)
SELECT
  groups.id,
  unknown.category,
  unknown.sort_order
FROM (
  SELECT
    items.category,
    row_number() OVER (
      ORDER BY min(items.sort_order), items.category
    ) * 10 AS sort_order
  FROM menu_items AS items
  LEFT JOIN menu_taxonomy_map AS mapping
    ON mapping.source_category = items.category
  WHERE mapping.source_category IS NULL
  GROUP BY items.category
) AS unknown
JOIN menu_groups AS groups
  ON groups.name = 'Other';

ALTER TABLE menu_items
  ADD COLUMN category_id uuid
    REFERENCES menu_categories(id)
    ON DELETE RESTRICT;

UPDATE menu_items AS items
SET category_id = categories.id
FROM menu_taxonomy_map AS mapping
JOIN menu_groups AS groups
  ON groups.name = mapping.group_name
JOIN menu_categories AS categories
  ON categories.group_id = groups.id
 AND categories.name = mapping.category_name
WHERE items.category = mapping.source_category;

UPDATE menu_items AS items
SET category_id = categories.id
FROM menu_groups AS groups
JOIN menu_categories AS categories
  ON categories.group_id = groups.id
WHERE items.category_id IS NULL
  AND groups.name = 'Other'
  AND categories.name = items.category;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM menu_items
    WHERE category_id IS NULL
  ) THEN
    RAISE EXCEPTION
      'Menu taxonomy migration left one or more menu items without a category';
  END IF;
END
$$;

ALTER TABLE menu_items
  ALTER COLUMN category_id SET NOT NULL;

DROP INDEX menu_items_category_order_idx;

ALTER TABLE menu_items
  DROP COLUMN category;

CREATE INDEX menu_items_category_order_idx
  ON menu_items (category_id, sort_order, name);
