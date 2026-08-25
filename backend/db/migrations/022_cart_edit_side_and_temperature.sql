-- Add explicit ON SIDE handling for sauce-like included ingredients and seed
-- obvious beef temperature choices. Cart-line editing is a frontend concern;
-- this migration only extends the normalized menu/order model needed by it.

ALTER TABLE menu_item_ingredients
  ADD COLUMN IF NOT EXISTS can_side boolean NOT NULL DEFAULT false;

-- Historical rows remain valid; new order rows may now snapshot ON SIDE.
ALTER TABLE order_item_ingredient_changes
  DROP CONSTRAINT IF EXISTS order_item_ingredient_changes_change_kind_check;

ALTER TABLE order_item_ingredient_changes
  ADD CONSTRAINT order_item_ingredient_changes_change_kind_check
  CHECK (change_kind IN ('remove', 'side', 'extra', 'add'));

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

  -- Doneness is seeded only where a beef temperature is an obvious service
  -- decision. Conditional burger/chicken combo items are intentionally skipped
  -- because they need dependent choice groups rather than a misleading prompt.
  WITH temperature_items(name) AS (
    VALUES
      ('New York Strip (16 oz.)'),
      ('Ground Sirloin'),
      ('Sliced Skirt Steak Platter'),
      ('Steak Sandwich'),
      ('Chopped Burger Salad'),
      ('Jumbo Burger — Regular'),
      ('Jumbo Burger — Deluxe'),
      ('Cheeseburger — Regular'),
      ('Cheeseburger — Deluxe'),
      ('Bacon Burger — Regular'),
      ('Bacon Burger — Deluxe'),
      ('Bacon Cheeseburger — Regular'),
      ('Bacon Cheeseburger — Deluxe'),
      ('Mushroom Burger — Regular'),
      ('Mushroom Burger — Deluxe'),
      ('Chili Burger — Regular'),
      ('Chili Burger — Deluxe'),
      ('Pizza Burger — Regular'),
      ('Pizza Burger — Deluxe'),
      ('Hamburger Club with Bacon, Lettuce & Tomato'),
      ('Cheeseburger'),
      ('Sliced Steak & Eggs')
  )
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
  FROM menu_items item
  JOIN temperature_items target
    ON target.name = item.name
  WHERE item.is_modifier = false
  ON CONFLICT (menu_item_id, (lower(label))) DO NOTHING;

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
  FROM menu_choice_groups choice_group
  JOIN menu_items item
    ON item.id = choice_group.menu_item_id
  CROSS JOIN temperature_options option
  WHERE lower(choice_group.label) = 'temperature'
    AND item.name IN (
      'New York Strip (16 oz.)',
      'Ground Sirloin',
      'Sliced Skirt Steak Platter',
      'Steak Sandwich',
      'Chopped Burger Salad',
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
      'Pizza Burger — Deluxe',
      'Hamburger Club with Bacon, Lettuce & Tomato',
      'Cheeseburger',
      'Sliced Steak & Eggs'
    )
  ON CONFLICT (choice_group_id, (lower(label))) DO NOTHING;
END;
$$;

SELECT seed_lazy_janes_service_handling();
