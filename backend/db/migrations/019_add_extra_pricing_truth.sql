-- Make ADD/EXTRA availability explicit instead of treating $0.00 as approval.
--
-- Why this exists:
-- migration 017 intentionally knew the service-visible composition, but it did
-- not know restaurant pricing for every possible extra. It therefore seeded
-- every standard component with can_extra=true and extra_price=0.00. That is
-- unsafe because $0.00 then looks like an intentional free-extra policy.
--
-- Pricing truth after this migration:
--   * ingredients.is_addable says whether an ingredient is approved for the
--     restaurant-wide ADD search.
--   * ingredients.default_add_price is the price for that global ADD and may
--     legitimately be $0.00 only when is_addable=true.
--   * menu_item_ingredients.can_extra says whether a standard component may be
--     ordered EXTRA for that particular dish.
--   * menu_item_ingredients.extra_price is the item-specific EXTRA price and
--     may legitimately be $0.00 only when can_extra=true was explicitly set.
--
-- We do not invent prices here. Existing positive prices are preserved. Where
-- a reusable ingredient already has an explicit positive default ADD price,
-- that known price can safely fill an otherwise-zero EXTRA price. Everything
-- else is disabled until a manager explicitly configures it.

ALTER TABLE ingredients
  ADD COLUMN IF NOT EXISTS is_addable boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION normalize_lazy_janes_add_extra_pricing()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- A positive existing default ADD price is explicit configuration, so keep
  -- that ingredient available in the global ADD search.
  UPDATE ingredients
  SET is_addable = true,
      updated_at = now()
  WHERE default_add_price > 0
    AND is_addable = false;

  -- If a standard component was marked EXTRA but its item-specific price was
  -- left at the seed placeholder of $0.00, use an already-known positive
  -- ingredient ADD price when one exists.
  UPDATE menu_item_ingredients link
  SET extra_price = ingredient.default_add_price,
      updated_at = now()
  FROM ingredients ingredient
  WHERE ingredient.id = link.ingredient_id
    AND link.can_extra = true
    AND link.extra_price = 0
    AND ingredient.default_add_price > 0;

  -- Remaining zero-dollar EXTRA rows were never explicitly priced. Disable
  -- them rather than silently treating them as free.
  UPDATE menu_item_ingredients
  SET can_extra = false,
      updated_at = now()
  WHERE can_extra = true
    AND extra_price = 0;
END;
$$;

SELECT normalize_lazy_janes_add_extra_pricing();
