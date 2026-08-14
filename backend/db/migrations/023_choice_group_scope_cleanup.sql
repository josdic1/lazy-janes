-- Fix the one choice-group scope error introduced by migration 022 and make
-- future service-handling seeding category-aware instead of matching by item
-- name alone.
--
-- The Kids Korner item named "Cheeseburger" legitimately inherits the Kids
-- "Choose Dessert" group. It must NOT inherit the adult burger Temperature
-- group. Adult burger items are explicitly scoped to Lunch & Dinner / From the
-- Char-Broiler below.

DELETE FROM menu_choice_groups choice_group
USING menu_items item,
      menu_categories category,
      menu_groups group_record
WHERE choice_group.menu_item_id = item.id
  AND item.category_id = category.id
  AND category.group_id = group_record.id
  AND lower(choice_group.label) = 'temperature'
  AND group_record.name = 'Kids'
  AND category.name = 'Kids Korner'
  AND item.name = 'Cheeseburger';

CREATE OR REPLACE FUNCTION seed_lazy_janes_service_handling()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- ON SIDE is a handling instruction on the included ingredient, not a fake
  -- modifier item. Seed only clearly condiment/sauce-like ingredients.
  UPDATE menu_item_ingredients link
  SET
    can_side = true,
    updated_at = now()
  FROM ingredients ingredient
  WHERE ingredient.id = link.ingredient_id
    AND link.can_side = false
    AND (
      lower(ingredient.name) LIKE '%dressing%'
      OR lower(ingredient.name) LIKE '%vinaigrette%'
      OR lower(ingredient.name) LIKE '%sauce%'
      OR lower(ingredient.name) LIKE '%gravy%'
      OR lower(ingredient.name) LIKE '%mayo%'
      OR lower(ingredient.name) LIKE '%mustard%'
      OR lower(ingredient.name) LIKE '%ketchup%'
      OR lower(ingredient.name) LIKE '%relish%'
      OR lower(ingredient.name) LIKE '%tartar%'
      OR lower(ingredient.name) LIKE '%pesto%'
      OR lower(ingredient.name) LIKE '%glaze%'
      OR lower(ingredient.name) LIKE '%aioli%'
      OR lower(ingredient.name) LIKE '%syrup%'
      OR lower(ingredient.name) IN (
        'sour cream',
        'horseradish',
        'salsa',
        'guacamole',
        'butter',
        'cream cheese'
      )
    );

  -- Every temperature target is keyed by full taxonomy coordinates. Never
  -- attach a service choice by bare item name: names can be similar across
  -- Kids, Breakfast, Specials, and the adult menu.
  CREATE TEMP TABLE service_temperature_targets (
    group_name text NOT NULL,
    category_name text NOT NULL,
    item_name text NOT NULL,
    PRIMARY KEY (group_name, category_name, item_name)
  ) ON COMMIT DROP;

  INSERT INTO service_temperature_targets (
    group_name,
    category_name,
    item_name
  )
  VALUES
    ('Lunch & Dinner', 'Prime Steaks & Chops', 'New York Strip (16 oz.)'),
    ('Lunch & Dinner', 'Prime Steaks & Chops', 'Ground Sirloin'),
    ('Lunch & Dinner', 'Prime Steaks & Chops', 'Sliced Skirt Steak Platter'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Steak Sandwich'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Jumbo Burger — Regular'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Jumbo Burger — Deluxe'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Cheeseburger — Regular'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Cheeseburger — Deluxe'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Bacon Burger — Regular'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Bacon Burger — Deluxe'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Bacon Cheeseburger — Regular'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Bacon Cheeseburger — Deluxe'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Mushroom Burger — Regular'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Mushroom Burger — Deluxe'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Chili Burger — Regular'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Chili Burger — Deluxe'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Pizza Burger — Regular'),
    ('Lunch & Dinner', 'From the Char-Broiler', 'Pizza Burger — Deluxe'),
    ('Specials', 'Specials', 'Chopped Burger Salad'),
    ('Sandwiches & Deli', 'Triple Decker Sandwiches', 'Hamburger Club with Bacon, Lettuce & Tomato'),
    ('Breakfast', 'Eggs', 'Sliced Steak & Eggs');

  INSERT INTO menu_choice_groups (
    menu_item_id,
    label,
    min_selections,
    max_selections,
    sort_order,
    is_active
  )
  SELECT
    item.id,
    'Temperature',
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM menu_item_ingredients link
        JOIN ingredients ingredient
          ON ingredient.id = link.ingredient_id
        WHERE link.menu_item_id = item.id
          AND link.can_remove = true
          AND lower(ingredient.name) IN (
            'burger patty',
            'lean beef patty',
            'skirt steak',
            'steak'
          )
      ) THEN 0
      ELSE 1
    END,
    1,
    45,
    true
  FROM service_temperature_targets target
  JOIN menu_groups group_record
    ON group_record.name = target.group_name
  JOIN menu_categories category
    ON category.group_id = group_record.id
   AND category.name = target.category_name
  JOIN menu_items item
    ON item.category_id = category.id
   AND item.name = target.item_name
   AND item.is_modifier = false
  ON CONFLICT (menu_item_id, (lower(label))) DO UPDATE
  SET
    min_selections = EXCLUDED.min_selections,
    max_selections = EXCLUDED.max_selections,
    sort_order = EXCLUDED.sort_order,
    is_active = true,
    updated_at = now();

  WITH temperature_options(label, sort_order) AS (
    VALUES
      ('Rare', 10),
      ('Medium Rare', 20),
      ('Medium', 30),
      ('Medium Well', 40),
      ('Well Done', 50)
  )
  INSERT INTO menu_choice_options (
    choice_group_id,
    label,
    ingredient_id,
    price_adjustment,
    sort_order,
    is_default,
    is_active
  )
  SELECT
    choice_group.id,
    option.label,
    NULL,
    0,
    option.sort_order,
    false,
    true
  FROM service_temperature_targets target
  JOIN menu_groups group_record
    ON group_record.name = target.group_name
  JOIN menu_categories category
    ON category.group_id = group_record.id
   AND category.name = target.category_name
  JOIN menu_items item
    ON item.category_id = category.id
   AND item.name = target.item_name
   AND item.is_modifier = false
  JOIN menu_choice_groups choice_group
    ON choice_group.menu_item_id = item.id
   AND lower(choice_group.label) = 'temperature'
  CROSS JOIN temperature_options option
  ON CONFLICT (choice_group_id, (lower(label))) DO UPDATE
  SET
    price_adjustment = EXCLUDED.price_adjustment,
    sort_order = EXCLUDED.sort_order,
    is_default = EXCLUDED.is_default,
    is_active = true,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION assert_lazy_janes_choice_group_integrity()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  bad_record record;
BEGIN
  -- Active choice groups must always belong to real base menu items.
  SELECT
    choice_group.id,
    item.name AS item_name,
    choice_group.label
  INTO bad_record
  FROM menu_choice_groups choice_group
  JOIN menu_items item
    ON item.id = choice_group.menu_item_id
  WHERE choice_group.is_active = true
    AND item.is_modifier = true
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION
      'Choice group % is attached to modifier item %',
      bad_record.label,
      bad_record.item_name;
  END IF;

  -- Required choice groups must be satisfiable by the currently active
  -- options. This checks every active choice group, not just seeded groups.
  SELECT
    choice_group.id,
    item.name AS item_name,
    choice_group.label,
    choice_group.min_selections,
    choice_group.max_selections,
    count(option_record.id) FILTER (WHERE option_record.is_active) AS active_options
  INTO bad_record
  FROM menu_choice_groups choice_group
  JOIN menu_items item
    ON item.id = choice_group.menu_item_id
  LEFT JOIN menu_choice_options option_record
    ON option_record.choice_group_id = choice_group.id
  WHERE choice_group.is_active = true
  GROUP BY
    choice_group.id,
    item.name,
    choice_group.label,
    choice_group.min_selections,
    choice_group.max_selections
  HAVING
    count(option_record.id) FILTER (WHERE option_record.is_active) < choice_group.min_selections
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION
      'Unsatisfiable choice group % on %: min %, active options %',
      bad_record.label,
      bad_record.item_name,
      bad_record.min_selections,
      bad_record.active_options;
  END IF;

  -- System-seeded Temperature choices are intentionally narrow. This catches
  -- the exact class of regression that put Temperature on Kids Cheeseburger.
  SELECT
    group_record.name AS group_name,
    category.name AS category_name,
    item.name AS item_name
  INTO bad_record
  FROM menu_choice_groups choice_group
  JOIN menu_items item
    ON item.id = choice_group.menu_item_id
  JOIN menu_categories category
    ON category.id = item.category_id
  JOIN menu_groups group_record
    ON group_record.id = category.group_id
  WHERE choice_group.is_active = true
    AND lower(choice_group.label) = 'temperature'
    AND NOT (
      (group_record.name = 'Lunch & Dinner' AND category.name = 'Prime Steaks & Chops' AND item.name IN (
        'New York Strip (16 oz.)',
        'Ground Sirloin',
        'Sliced Skirt Steak Platter'
      ))
      OR (group_record.name = 'Lunch & Dinner' AND category.name = 'From the Char-Broiler' AND item.name IN (
        'Steak Sandwich',
        'Jumbo Burger — Regular',
        'Jumbo Burger — Deluxe',
        'Cheeseburger — Regular',
        'Cheeseburger — Deluxe',
        'Bacon Burger — Regular',
        'Bacon Burger — Deluxe',
        'Bacon Cheeseburger — Regular',
        'Bacon Cheeseburger — Deluxe',
        'Mushroom Burger — Regular',
        'Mushroom Burger — Deluxe',
        'Chili Burger — Regular',
        'Chili Burger — Deluxe',
        'Pizza Burger — Regular',
        'Pizza Burger — Deluxe'
      ))
      OR (group_record.name = 'Specials' AND category.name = 'Specials' AND item.name = 'Chopped Burger Salad')
      OR (group_record.name = 'Sandwiches & Deli' AND category.name = 'Triple Decker Sandwiches' AND item.name = 'Hamburger Club with Bacon, Lettuce & Tomato')
      OR (group_record.name = 'Breakfast' AND category.name = 'Eggs' AND item.name = 'Sliced Steak & Eggs')
    )
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION
      'Unexpected Temperature choice on % / % / %',
      bad_record.group_name,
      bad_record.category_name,
      bad_record.item_name;
  END IF;

  -- The legacy Choose Dessert group is a Kids Korner meal choice. Keep it
  -- there; do not "fix" the legitimate dessert choice on a kids cheeseburger.
  SELECT
    group_record.name AS group_name,
    category.name AS category_name,
    item.name AS item_name
  INTO bad_record
  FROM menu_choice_groups choice_group
  JOIN menu_items item
    ON item.id = choice_group.menu_item_id
  JOIN menu_categories category
    ON category.id = item.category_id
  JOIN menu_groups group_record
    ON group_record.id = category.group_id
  WHERE choice_group.is_active = true
    AND lower(choice_group.label) = 'choose dessert'
    AND NOT (
      group_record.name = 'Kids'
      AND category.name = 'Kids Korner'
    )
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION
      'Unexpected Choose Dessert choice on % / % / %',
      bad_record.group_name,
      bad_record.category_name,
      bad_record.item_name;
  END IF;
END;
$$;

SELECT seed_lazy_janes_service_handling();
SELECT assert_lazy_janes_choice_group_integrity();
