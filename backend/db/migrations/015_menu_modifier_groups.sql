CREATE TABLE menu_modifier_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  category_id uuid REFERENCES menu_categories(id)
    ON DELETE CASCADE,

  menu_item_id uuid REFERENCES menu_items(id)
    ON DELETE CASCADE,

  name text NOT NULL,

  kind text NOT NULL CHECK (
    kind IN ('included', 'choice', 'addon')
  ),

  min_selections integer NOT NULL DEFAULT 0
    CHECK (min_selections >= 0),

  max_selections integer,

  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    (
      CASE WHEN category_id IS NOT NULL THEN 1 ELSE 0 END
      +
      CASE WHEN menu_item_id IS NOT NULL THEN 1 ELSE 0 END
    ) = 1
  ),

  CHECK (
    max_selections IS NULL
    OR max_selections >= min_selections
  )
);

CREATE UNIQUE INDEX menu_modifier_groups_category_name_idx
  ON menu_modifier_groups (
    category_id,
    lower(name)
  )
  WHERE category_id IS NOT NULL
    AND menu_item_id IS NULL;

CREATE UNIQUE INDEX menu_modifier_groups_item_name_idx
  ON menu_modifier_groups (
    menu_item_id,
    lower(name)
  )
  WHERE menu_item_id IS NOT NULL;


CREATE TABLE menu_modifier_group_items (
  group_id uuid NOT NULL
    REFERENCES menu_modifier_groups(id)
    ON DELETE CASCADE,

  menu_item_id uuid NOT NULL
    REFERENCES menu_items(id)
    ON DELETE CASCADE,

  sort_order integer NOT NULL DEFAULT 0,
  is_default boolean NOT NULL DEFAULT false,

  PRIMARY KEY (group_id, menu_item_id)
);


CREATE OR REPLACE FUNCTION ensure_lazy_janes_modifier_group(
  p_category_name text,
  p_item_name text,
  p_group_name text,
  p_kind text,
  p_min_selections integer,
  p_max_selections integer,
  p_sort_order integer DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_category_id uuid;
  v_item_id uuid;
  v_group_id uuid;
BEGIN
  SELECT c.id
  INTO v_category_id
  FROM menu_categories c
  WHERE lower(c.name) = lower(p_category_name)
  ORDER BY c.sort_order, c.id
  LIMIT 1;

  IF v_category_id IS NULL THEN
    RETURN NULL;
  END IF;

  IF p_item_name IS NOT NULL THEN
    SELECT i.id
    INTO v_item_id
    FROM menu_items i
    WHERE i.category_id = v_category_id
      AND lower(i.name) = lower(p_item_name)
      AND i.is_modifier = false
    ORDER BY i.sort_order, i.id
    LIMIT 1;

    IF v_item_id IS NULL THEN
      RETURN NULL;
    END IF;

    SELECT g.id
    INTO v_group_id
    FROM menu_modifier_groups g
    WHERE g.menu_item_id = v_item_id
      AND lower(g.name) = lower(p_group_name)
    LIMIT 1;
  ELSE
    SELECT g.id
    INTO v_group_id
    FROM menu_modifier_groups g
    WHERE g.category_id = v_category_id
      AND g.menu_item_id IS NULL
      AND lower(g.name) = lower(p_group_name)
    LIMIT 1;
  END IF;

  IF v_group_id IS NULL THEN
    INSERT INTO menu_modifier_groups (
      category_id,
      menu_item_id,
      name,
      kind,
      min_selections,
      max_selections,
      sort_order
    )
    VALUES (
      CASE
        WHEN p_item_name IS NULL
          THEN v_category_id
        ELSE NULL
      END,
      v_item_id,
      p_group_name,
      p_kind,
      p_min_selections,
      p_max_selections,
      p_sort_order
    )
    RETURNING id INTO v_group_id;
  ELSE
    UPDATE menu_modifier_groups
    SET
      kind = p_kind,
      min_selections = p_min_selections,
      max_selections = p_max_selections,
      sort_order = p_sort_order,
      is_active = true,
      updated_at = now()
    WHERE id = v_group_id;
  END IF;

  RETURN v_group_id;
END;
$$;


CREATE OR REPLACE FUNCTION ensure_lazy_janes_modifier_option(
  p_group_id uuid,
  p_name text,
  p_price numeric,
  p_sort_order integer DEFAULT 0,
  p_is_default boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_group menu_modifier_groups%ROWTYPE;
  v_parent record;
  v_modifier_id uuid;
  v_first_modifier_id uuid;
BEGIN
  IF p_group_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT *
  INTO v_group
  FROM menu_modifier_groups
  WHERE id = p_group_id;

  IF v_group.id IS NULL THEN
    RETURN NULL;
  END IF;

  /*
   * ITEM-SPECIFIC GROUP
   *
   * Create/find one modifier child whose parent is the
   * actual menu item.
   */
  IF v_group.menu_item_id IS NOT NULL THEN
    SELECT
      i.id,
      i.category_id
    INTO
      v_parent
    FROM menu_items i
    WHERE i.id = v_group.menu_item_id;

    SELECT i.id
    INTO v_modifier_id
    FROM menu_items i
    WHERE i.parent_item_id = v_parent.id
      AND i.category_id = v_parent.category_id
      AND i.is_modifier = true
      AND lower(i.name) = lower(p_name)
    ORDER BY i.id
    LIMIT 1;

    IF v_modifier_id IS NULL THEN
      INSERT INTO menu_items (
        parent_item_id,
        name,
        description,
        category_id,
        price,
        status,
        is_special,
        is_modifier,
        dietary_flags,
        sort_order
      )
      VALUES (
        v_parent.id,
        p_name,
        NULL,
        v_parent.category_id,
        p_price,
        'available',
        false,
        true,
        ARRAY[]::text[],
        p_sort_order
      )
      RETURNING id INTO v_modifier_id;
    ELSE
      UPDATE menu_items
      SET
        price = p_price,
        status = 'available',
        sort_order = p_sort_order,
        updated_at = now()
      WHERE id = v_modifier_id;
    END IF;

    INSERT INTO menu_modifier_group_items (
      group_id,
      menu_item_id,
      sort_order,
      is_default
    )
    VALUES (
      p_group_id,
      v_modifier_id,
      p_sort_order,
      p_is_default
    )
    ON CONFLICT (group_id, menu_item_id)
    DO UPDATE SET
      sort_order = EXCLUDED.sort_order,
      is_default = EXCLUDED.is_default;

    RETURN v_modifier_id;
  END IF;

  /*
   * CATEGORY-WIDE GROUP
   *
   * The rule is shared by the category, but modifier menu
   * items remain real children of each individual base item.
   */
  FOR v_parent IN
    SELECT
      i.id,
      i.category_id
    FROM menu_items i
    WHERE i.category_id = v_group.category_id
      AND i.is_modifier = false
      AND i.status <> 'inactive'
    ORDER BY i.sort_order, i.id
  LOOP
    v_modifier_id := NULL;

    SELECT i.id
    INTO v_modifier_id
    FROM menu_items i
    WHERE i.parent_item_id = v_parent.id
      AND i.category_id = v_parent.category_id
      AND i.is_modifier = true
      AND lower(i.name) = lower(p_name)
    ORDER BY i.id
    LIMIT 1;

    IF v_modifier_id IS NULL THEN
      INSERT INTO menu_items (
        parent_item_id,
        name,
        description,
        category_id,
        price,
        status,
        is_special,
        is_modifier,
        dietary_flags,
        sort_order
      )
      VALUES (
        v_parent.id,
        p_name,
        NULL,
        v_parent.category_id,
        p_price,
        'available',
        false,
        true,
        ARRAY[]::text[],
        p_sort_order
      )
      RETURNING id INTO v_modifier_id;
    ELSE
      UPDATE menu_items
      SET
        price = p_price,
        status = 'available',
        sort_order = p_sort_order,
        updated_at = now()
      WHERE id = v_modifier_id;
    END IF;

    INSERT INTO menu_modifier_group_items (
      group_id,
      menu_item_id,
      sort_order,
      is_default
    )
    VALUES (
      p_group_id,
      v_modifier_id,
      p_sort_order,
      p_is_default
    )
    ON CONFLICT (group_id, menu_item_id)
    DO UPDATE SET
      sort_order = EXCLUDED.sort_order,
      is_default = EXCLUDED.is_default;

    IF v_first_modifier_id IS NULL THEN
      v_first_modifier_id := v_modifier_id;
    END IF;
  END LOOP;

  RETURN v_first_modifier_id;
END;
$$;

CREATE OR REPLACE FUNCTION seed_lazy_janes_modifiers()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  g uuid;
  r record;
BEGIN
  /* =====================================================
     BREAKFAST — CATEGORY RULES
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Eggs',
    NULL,
    'Comes With',
    'included',
    0,
    0,
    10
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Home Fries', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Toast', 0, 20, true
  );


  g := ensure_lazy_janes_modifier_group(
    'Omelettes',
    NULL,
    'Comes With',
    'included',
    0,
    0,
    10
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Home Fries', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Toast', 0, 20, true
  );


  /* =====================================================
     TWO EGGS / SINGLE EGG
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Eggs',
    'Two Eggs (Any Style)',
    'Add Breakfast Meat',
    'choice',
    0,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Bacon', 4.00, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Ham', 4.00, 20, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Pork Sausage', 4.00, 30, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Turkey Sausage', 4.00, 40, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Taylor Ham', 4.00, 50, false
  );


  g := ensure_lazy_janes_modifier_group(
    'Eggs',
    'Single Egg',
    'Add Breakfast Meat',
    'choice',
    0,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Bacon', 3.00, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Ham', 3.00, 20, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Pork Sausage', 3.00, 30, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Turkey Sausage', 3.00, 40, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Taylor Ham', 3.00, 50, false
  );


  /* =====================================================
     AVOCADO TOAST
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Egg Sandwiches',
    'Avocado Toast Platter',
    'Choose Side',
    'choice',
    1,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Home Fries', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Vegetables', 0, 20, false
  );


  /* =====================================================
     CHALLAH FRENCH TOAST
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'From the Griddle',
    'Challah French Toast',
    'Choose Bread',
    'choice',
    1,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Plain', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Raisin', 0, 20, false
  );


  /* =====================================================
     SPECIAL SALADS
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Specials',
    'Mango Barley Chicken Salad',
    'Choose Chicken',
    'choice',
    1,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Sesame Chicken', 0, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Marinated Chicken', 0, 20, false
  );


  g := ensure_lazy_janes_modifier_group(
    'Specials',
    'Strawberry Spinach Salad',
    'Choose Protein',
    'choice',
    1,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Blackened Salmon', 0, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Chicken', 0, 20, false
  );


  /* =====================================================
     SALADS
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Cold Platters & Salads',
    'Greek Salad — Small',
    'Add-On',
    'addon',
    0,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Grilled Chicken', 5.95, 10, false
  );


  g := ensure_lazy_janes_modifier_group(
    'Cold Platters & Salads',
    'Greek Salad — Large',
    'Add-On',
    'addon',
    0,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Grilled Chicken', 5.95, 10, false
  );


  g := ensure_lazy_janes_modifier_group(
    'Cold Platters & Salads',
    'Tossed Salad',
    'Add Protein',
    'choice',
    0,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Tuna Salad', 9.00, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Chicken Salad', 9.00, 20, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Shrimp Salad', 16.00, 30, false
  );


  /* =====================================================
     WRAPS
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Wraps',
    NULL,
    'Comes With',
    'included',
    0,
    0,
    10
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'French Fries', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Cole Slaw', 0, 20, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Pickle', 0, 30, true
  );


  /* =====================================================
     FRIED CHICKEN SANDWICHES
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Fried Chicken Sandwiches',
    NULL,
    'Comes With',
    'included',
    0,
    0,
    10
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'French Fries', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Cole Slaw', 0, 20, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Pickle', 0, 30, true
  );


  /* =====================================================
     GYRO
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Distinctive Specialties',
    'Gyro',
    'Choose Gyro',
    'choice',
    1,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Meat', 0, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Chicken', 0, 20, false
  );


  /* =====================================================
     MEATBALL PARMIGIANA
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Distinctive Specialties',
    'Beef Meatball Sandwich',
    'Add-On',
    'addon',
    0,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Parmigiana', 2.00, 10, false
  );


  /* =====================================================
     LINGUINI ALA RITZ
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Italian Specialties',
    'Linguini Ala Ritz (Spicy or Mild)',
    'Choose Heat',
    'choice',
    1,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Mild', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Spicy', 0, 20, false
  );


  /* =====================================================
     ENTREE ACCOMPANIMENTS
     ===================================================== */

  FOR r IN
    SELECT unnest(
      ARRAY[
        'Entrees',
        'From the Sea',
        'Prime Steaks & Chops'
      ]
    ) AS category_name
  LOOP
    g := ensure_lazy_janes_modifier_group(
      r.category_name,
      NULL,
      'Choose Side',
      'choice',
      1,
      1,
      20
    );

    PERFORM ensure_lazy_janes_modifier_option(
      g, 'Two Vegetables', 0, 10, false
    );

    PERFORM ensure_lazy_janes_modifier_option(
      g, 'Side of Spaghetti', 0, 20, false
    );

    g := ensure_lazy_janes_modifier_group(
      r.category_name,
      NULL,
      'Choose Starter',
      'choice',
      1,
      1,
      30
    );

    PERFORM ensure_lazy_janes_modifier_option(
      g, 'Soup', 0, 10, false
    );

    PERFORM ensure_lazy_janes_modifier_option(
      g, 'Tossed Salad', 0, 20, false
    );
  END LOOP;


  /* =====================================================
     ITALIAN SPECIALTIES
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Italian Specialties',
    NULL,
    'Comes With',
    'included',
    0,
    0,
    10
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Tossed Salad', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Choice of Dressing', 0, 20, true
  );


  /* =====================================================
     GLUTEN-FREE DINNER
     ===================================================== */

  FOR r IN
    SELECT unnest(
      ARRAY[
        'Dinner — Chicken',
        'Dinner — Fish',
        'Dinner — Meat'
      ]
    ) AS category_name
  LOOP
    g := ensure_lazy_janes_modifier_group(
      r.category_name,
      NULL,
      'Choose Side',
      'choice',
      1,
      1,
      20
    );

    PERFORM ensure_lazy_janes_modifier_option(
      g, 'Pasta', 0, 10, false
    );

    PERFORM ensure_lazy_janes_modifier_option(
      g, 'Vegetables', 0, 20, false
    );
  END LOOP;


  /* =====================================================
     BURGER TYPE
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'From the Char-Broiler',
    'Turkey or Veggie or Chicken Burger — Regular',
    'Choose Burger',
    'choice',
    1,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Turkey Burger', 0, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Veggie Burger', 0, 20, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Chicken Burger', 0, 30, false
  );


  g := ensure_lazy_janes_modifier_group(
    'From the Char-Broiler',
    'Turkey or Veggie or Chicken Burger — Deluxe',
    'Choose Burger',
    'choice',
    1,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Turkey Burger', 0, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Veggie Burger', 0, 20, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Chicken Burger', 0, 30, false
  );


  /* Deluxe burgers explicitly include these. */

  FOR r IN
    SELECT i.name
    FROM menu_items i
    JOIN menu_categories c
      ON c.id = i.category_id
    WHERE lower(c.name) =
      lower('From the Char-Broiler')
      AND i.is_modifier = false
      AND i.name LIKE '%— Deluxe'
  LOOP
    g := ensure_lazy_janes_modifier_group(
      'From the Char-Broiler',
      r.name,
      'Comes With',
      'included',
      0,
      0,
      10
    );

    PERFORM ensure_lazy_janes_modifier_option(
      g, 'Lettuce', 0, 10, true
    );

    PERFORM ensure_lazy_janes_modifier_option(
      g, 'Tomato', 0, 20, true
    );

    PERFORM ensure_lazy_janes_modifier_option(
      g, 'French Fries', 0, 30, true
    );
  END LOOP;


  /* =====================================================
     HOT OPEN SANDWICHES
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Hot Open Sandwiches',
    NULL,
    'Comes With',
    'included',
    0,
    0,
    10
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Gravy', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'French Fries', 0, 20, true
  );


  /* =====================================================
     KIDS
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Kids Korner',
    NULL,
    'Comes With',
    'included',
    0,
    0,
    10
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'French Fries', 0, 10, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'One Vegetable', 0, 20, true
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Beverage', 0, 30, true
  );


  g := ensure_lazy_janes_modifier_group(
    'Kids Korner',
    NULL,
    'Choose Dessert',
    'choice',
    1,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Jello', 0, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Ice Cream', 0, 20, false
  );


  g := ensure_lazy_janes_modifier_group(
    'Kids Korner',
    'Hamburger or Grilled Chicken Sandwich',
    'Choose Sandwich',
    'choice',
    1,
    1,
    30
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Hamburger', 0, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Grilled Chicken Sandwich', 0, 20, false
  );


  /* =====================================================
     FRENCH FRIES
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Side Orders',
    'French Fries',
    'Add-On',
    'choice',
    0,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Gravy', 0.55, 10, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Cheese', 1.05, 20, false
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Cheese & Gravy', 2.00, 30, false
  );


  /* =====================================================
     SHAKE
     ===================================================== */

  g := ensure_lazy_janes_modifier_group(
    'Shakes, Sundaes & Ice Cream',
    'Old Fashioned Shake',
    'Add-On',
    'addon',
    0,
    1,
    20
  );

  PERFORM ensure_lazy_janes_modifier_option(
    g, 'Extra Thick', 1.00, 10, false
  );
END;
$$;

SELECT seed_lazy_janes_modifiers();
