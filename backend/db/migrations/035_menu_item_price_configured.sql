-- Draft menu items may be saved before a selling price is known.
-- Existing/imported menu prices remain confirmed by default.

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS price_configured boolean NOT NULL DEFAULT true;
