-- Stable source metadata for the normalized 427-item menu data layer.
-- Runtime customization data is synchronized from backend/src/data/menuData.ts
-- by `npm run db:sync:menu` so fresh and existing databases use the same source.
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS source_key text,
  ADD COLUMN IF NOT EXISTS is_kids boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_kids_version boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS source_review_needed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS source_review_notes text NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS menu_items_source_key_idx
  ON menu_items (source_key)
  WHERE source_key IS NOT NULL;
