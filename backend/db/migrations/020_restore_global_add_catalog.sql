-- Restore the restaurant-wide ADD catalog after migration 019 separated
-- EXTRA pricing truth from ADD availability.
--
-- Migration 019 correctly disabled zero-dollar EXTRA relationships because
-- those $0.00 values were seed placeholders, not confirmed free-extra policy.
-- It went too far by also using ingredient ADD pricing as a discoverability
-- gate. The established order-entry behavior is that the reusable active
-- ingredient catalog is searchable for ADD. Keep that behavior independent
-- from item-specific EXTRA pricing.
--
-- Existing ingredient default_add_price values are preserved exactly; this
-- migration does not invent or change any dollar amount.

UPDATE ingredients
SET is_addable = true,
    updated_at = now()
WHERE is_active = true
  AND is_addable = false;
