-- Manual item-level safety changes are an admin-only emergency path.
-- Existing safety declarations remain source/menu truth; manual overrides are
-- additive and separately identifiable so they can be audited and cleared
-- without deleting source facts.

ALTER TABLE menu_item_safety_declarations
  ADD COLUMN source text NOT NULL DEFAULT 'source'
  CHECK (source IN ('source', 'manual_override'));

CREATE TABLE menu_item_safety_override_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  changed_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action text NOT NULL CHECK (action IN ('set', 'updated', 'cleared')),
  reason text NOT NULL CHECK (btrim(reason) <> '' AND length(reason) <= 500),
  before_declarations jsonb NOT NULL,
  after_declarations jsonb NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX menu_item_safety_override_audit_item_idx
  ON menu_item_safety_override_audit (menu_item_id, changed_at DESC, id DESC);
