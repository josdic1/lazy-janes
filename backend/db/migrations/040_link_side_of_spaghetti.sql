BEGIN;

UPDATE menu_choice_options option
SET
  ingredient_id = ingredient.id,
  updated_at = now()
FROM ingredients ingredient
WHERE option.ingredient_id IS NULL
  AND option.is_active = true
  AND lower(option.label) = 'side of spaghetti'
  AND ingredient.is_active = true
  AND lower(ingredient.name) = 'spaghetti';

COMMIT;
