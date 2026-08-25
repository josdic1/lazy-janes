-- Distinguish what an ingredient IS from the role it plays on an item.
--
-- ingredients.kind = bread
--
-- menu_item_ingredients.role = carrier
-- when that bread is the sandwich/burger/handheld carrier.
--
-- This prevents toast, bread sides, and bread served with another dish from
-- inheriting sandwich-carrier substitution behavior.

ALTER TABLE menu_item_ingredients
  DROP CONSTRAINT IF EXISTS menu_item_ingredients_role_check;

ALTER TABLE menu_item_ingredients
  ADD CONSTRAINT menu_item_ingredients_role_check
  CHECK (role IN (
    'protein',
    'egg',
    'bread',
    'carrier',
    'cheese',
    'sauce',
    'side',
    'veggie',
    'fruit',
    'other'
  ));

ALTER TABLE menu_choice_groups
  DROP CONSTRAINT IF EXISTS menu_choice_groups_role_check;

ALTER TABLE menu_choice_groups
  ADD CONSTRAINT menu_choice_groups_role_check
  CHECK (role IN (
    'protein',
    'egg',
    'bread',
    'carrier',
    'cheese',
    'sauce',
    'side',
    'veggie',
    'fruit',
    'other'
  ));
