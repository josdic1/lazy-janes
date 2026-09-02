BEGIN;

-- Source-proven variant pricing. The menu item base price is the full/default
-- form; these values are the adjustment for the selected structural variant.
WITH variant_prices (
  item_source_key,
  group_label,
  option_label,
  price_adjustment
) AS (
  VALUES
    ('apple_cherry_or_blueberry_crumb_pie', 'Choose Pie', 'Apple', 0.00::numeric),
    ('apple_cherry_or_blueberry_crumb_pie', 'Choose Pie', 'Cherry', 0.00::numeric),
    ('apple_cherry_or_blueberry_crumb_pie', 'Choose Pie', 'Blueberry', 0.00::numeric),
    ('blueberry_pancakes', 'Choose Size', 'Full Stack', 0.00::numeric),
    ('blueberry_pancakes', 'Choose Size', 'Short Stack', -2.00::numeric),
    ('chocolate_chip_pancakes', 'Choose Size', 'Full Stack', 0.00::numeric),
    ('chocolate_chip_pancakes', 'Choose Size', 'Short Stack', -2.55::numeric)
)
UPDATE menu_choice_options option
SET
  price_adjustment = variant_prices.price_adjustment,
  price_adjustment_configured = true,
  updated_at = now()
FROM menu_choice_groups choice_group
JOIN menu_items item
  ON item.id = choice_group.menu_item_id
JOIN variant_prices
  ON variant_prices.item_source_key = item.source_key
  AND lower(variant_prices.group_label) = lower(choice_group.label)
WHERE option.choice_group_id = choice_group.id
  AND lower(option.label) = lower(variant_prices.option_label);

COMMIT;
