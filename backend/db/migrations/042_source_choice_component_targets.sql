BEGIN;

-- Explicit foods present in retained menu choices but absent from the retained
-- flat ingredient catalog. Their selectable identity is source-proven; global
-- add-on permission is not, so keep them out of the restaurant-wide Add list.
INSERT INTO ingredients (
  name,
  kind,
  is_active,
  is_addable,
  default_add_price,
  add_price_configured,
  allergen_flags,
  sort_order
)
SELECT
  source.name,
  source.kind,
  true,
  false,
  0,
  false,
  '{}',
  0
FROM (
  VALUES
    ('Onion Rings', 'side'),
    ('Ice Cream', 'other'),
    ('Veggie Burger', 'protein'),
    ('White Clam Sauce', 'sauce'),
    ('Red Clam Sauce', 'sauce'),
    ('Blueberry Muffin', 'bread'),
    ('Apple Cinnamon Muffin', 'bread'),
    ('Corn Muffin', 'bread'),
    ('Bran Muffin', 'bread'),
    ('Plain Challah', 'bread'),
    ('Raisin Challah', 'bread')
) AS source(name, kind)
ON CONFLICT ((lower(name))) DO UPDATE
SET
  kind = EXCLUDED.kind,
  is_active = true,
  is_addable = false,
  updated_at = now();

-- Correct a misleading legacy text-match before linking the known component
-- targets below. In this item, "Apple" means the Apple Crumb Pie variant; it
-- does not mean the reusable Apple ingredient.
UPDATE menu_choice_options option
SET
  ingredient_id = NULL,
  updated_at = now()
FROM menu_choice_groups choice_group
JOIN menu_items item
  ON item.id = choice_group.menu_item_id
WHERE option.choice_group_id = choice_group.id
  AND item.source_key = 'apple_cherry_or_blueberry_crumb_pie'
  AND lower(choice_group.label) = 'choose pie'
  AND lower(option.label) = 'apple';

-- Link only source choices whose component identity is unambiguous from the
-- retained menu. Deliberately excluded: Soup, Full/Short Stack, Broiled/Fried,
-- Mild/Spicy, and pie-flavor labels. Those are not established component
-- identities and must remain unknown until modeled/confirmed correctly.
UPDATE menu_choice_options option
SET
  ingredient_id = ingredient.id,
  updated_at = now()
FROM menu_choice_groups choice_group
JOIN (
  VALUES
    ('Side', 'onion rings', 'Onion Rings'),
    ('Dessert', 'Ice Cream', 'Ice Cream'),
    ('Protein', 'Veggie Burger', 'Veggie Burger'),
    ('Choose Sauce', 'White Clam Sauce', 'White Clam Sauce'),
    ('Choose Sauce', 'Red Clam Sauce', 'Red Clam Sauce'),
    ('Side', 'Choose Side: Potato Salad', 'Potato Salad'),
    ('Choose Muffin', 'Blueberry Muffin', 'Blueberry Muffin'),
    ('Choose Muffin', 'Apple Cinnamon Muffin', 'Apple Cinnamon Muffin'),
    ('Choose Muffin', 'Corn Muffin', 'Corn Muffin'),
    ('Choose Muffin', 'Bran Muffin', 'Bran Muffin'),
    ('Choose Challah', 'Plain', 'Plain Challah'),
    ('Choose Challah', 'Raisin', 'Raisin Challah'),
    ('Choose Coffee', 'Regular', 'Regular Coffee'),
    ('Choose Coffee', 'Decaf', 'Decaf Coffee'),
    ('Choose Coffee', 'Iced Coffee', 'Regular Coffee'),
    ('Choose Coffee', 'Iced Decaf', 'Decaf Coffee')
) AS target(group_label, option_label, ingredient_name)
  ON lower(choice_group.label) = lower(target.group_label)
JOIN ingredients ingredient
  ON lower(ingredient.name) = lower(target.ingredient_name)
WHERE option.choice_group_id = choice_group.id
  AND option.is_active = true
  AND choice_group.is_active = true
  AND option.ingredient_id IS NULL
  AND lower(option.label) = lower(target.option_label);

COMMIT;
