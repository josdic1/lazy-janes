-- Separate customization availability from pricing certainty, and add explicit
-- "none" choices where omission is a legitimate service decision.
--
-- A server must be able to say EXTRA or ADD even when management has not yet
-- configured the charge. Unknown is not the same thing as free, so pricing
-- certainty is stored explicitly and unresolved charges are blocked at check
-- creation rather than silently billed at $0.00.

ALTER TABLE ingredients
  ADD COLUMN IF NOT EXISTS add_price_configured boolean NOT NULL DEFAULT false;

ALTER TABLE menu_item_ingredients
  ADD COLUMN IF NOT EXISTS extra_price_configured boolean NOT NULL DEFAULT false;

ALTER TABLE order_item_ingredient_changes
  ADD COLUMN IF NOT EXISTS price_configured boolean NOT NULL DEFAULT true;

-- Positive prices are unquestionably configured. Zero-dollar rows created by
-- the old composition seed remain unconfigured until a manager explicitly
-- confirms that $0.00 really means no charge.
UPDATE ingredients
SET add_price_configured = true,
    updated_at = now()
WHERE default_add_price > 0
  AND add_price_configured = false;

UPDATE menu_item_ingredients
SET extra_price_configured = true,
    updated_at = now()
WHERE extra_price > 0
  AND extra_price_configured = false;

-- Migration 019 disabled every zero-dollar EXTRA because price truth was
-- unknown. That correctly protected billing but incorrectly conflated price
-- certainty with whether the kitchen can understand EXTRA. Restore the
-- original service capability; extra_price_configured now carries the pricing
-- certainty instead.
UPDATE menu_item_ingredients
SET can_extra = true,
    updated_at = now()
WHERE can_extra = false
  AND extra_price = 0;

-- Required means "the server must make an explicit decision," not "the guest
-- must consume one of these." Add real no-selection options only where the
-- current menu semantics clearly permit omission. These are normal choice
-- options, so existing min/max validation and historical snapshots continue to
-- work without a special bypass path.
WITH none_options AS (
  SELECT
    choice_group.id AS choice_group_id,
    CASE
      WHEN lower(choice_group.label) = 'choose side' THEN 'No Side'
      WHEN lower(choice_group.label) = 'choose starter' THEN 'No Starter'
      WHEN lower(choice_group.label) = 'choose dessert' THEN 'No Dessert'
      WHEN item.name = 'Strawberry Spinach Salad'
        AND lower(choice_group.label) = 'choose protein' THEN 'No Protein'
      WHEN item.name = 'Mango Barley Chicken Salad'
        AND lower(choice_group.label) = 'choose chicken' THEN 'No Chicken'
      WHEN item.name = 'Char-Grilled Chicken Breast Sandwich'
        AND lower(choice_group.label) = 'choose bread' THEN 'No Bread'
      WHEN item.name = 'Avocado Toast Platter'
        AND lower(choice_group.label) = 'egg style' THEN 'No Eggs'
      ELSE NULL
    END AS option_label
  FROM menu_choice_groups choice_group
  JOIN menu_items item
    ON item.id = choice_group.menu_item_id
  WHERE choice_group.is_active = true
    AND (
      lower(choice_group.label) IN ('choose side', 'choose starter', 'choose dessert')
      OR (
        item.name = 'Strawberry Spinach Salad'
        AND lower(choice_group.label) = 'choose protein'
      )
      OR (
        item.name = 'Mango Barley Chicken Salad'
        AND lower(choice_group.label) = 'choose chicken'
      )
      OR (
        item.name = 'Char-Grilled Chicken Breast Sandwich'
        AND lower(choice_group.label) = 'choose bread'
      )
      OR (
        item.name = 'Avocado Toast Platter'
        AND lower(choice_group.label) = 'egg style'
      )
    )
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
  none_options.choice_group_id,
  none_options.option_label,
  NULL,
  0,
  999,
  false,
  true
FROM none_options
WHERE none_options.option_label IS NOT NULL
ON CONFLICT (choice_group_id, (lower(label))) DO NOTHING;
