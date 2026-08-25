-- Separate service-visible ingredient allergen facts from authoritative
-- menu-item safety declarations.
--
-- ingredients.allergen_flags = intrinsic facts about a reusable ingredient.
-- menu_item_safety_declarations = restaurant-declared item-level safety facts
-- that may not be derivable from the service-visible composition (hidden
-- sauces, marinades, cross-contact, shared fryer/equipment, etc.).

CREATE TABLE menu_item_safety_declarations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL
    REFERENCES menu_items(id)
    ON DELETE CASCADE,
  kind text NOT NULL CHECK (
    kind IN (
      'contains',
      'may_contain',
      'cross_contact',
      'shared_fryer',
      'shared_equipment',
      'other'
    )
  ),
  allergen_flag text CHECK (
    allergen_flag IS NULL
    OR allergen_flag IN (
      'milk',
      'egg',
      'wheat',
      'soy',
      'fish',
      'shellfish',
      'peanut',
      'tree_nut',
      'sesame'
    )
  ),
  note text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    kind NOT IN ('contains', 'may_contain', 'cross_contact')
    OR allergen_flag IS NOT NULL
  ),
  CHECK (
    kind NOT IN ('shared_fryer', 'shared_equipment', 'other')
    OR allergen_flag IS NULL
  ),
  CHECK (
    kind <> 'other'
    OR (note IS NOT NULL AND btrim(note) <> '')
  ),
  CHECK (
    note IS NULL
    OR (btrim(note) <> '' AND length(note) <= 500)
  )
);

CREATE UNIQUE INDEX menu_item_safety_declarations_allergen_unique_idx
  ON menu_item_safety_declarations (
    menu_item_id,
    kind,
    allergen_flag
  )
  WHERE allergen_flag IS NOT NULL;

CREATE UNIQUE INDEX menu_item_safety_declarations_process_unique_idx
  ON menu_item_safety_declarations (menu_item_id, kind)
  WHERE kind IN ('shared_fryer', 'shared_equipment');

CREATE UNIQUE INDEX menu_item_safety_declarations_other_unique_idx
  ON menu_item_safety_declarations (
    menu_item_id,
    lower(note)
  )
  WHERE kind = 'other';

CREATE INDEX menu_item_safety_declarations_item_idx
  ON menu_item_safety_declarations (
    menu_item_id,
    sort_order,
    kind,
    allergen_flag,
    id
  );

-- Preserve any item-level allergen flags already entered under the old,
-- ambiguous model. They become explicit authoritative CONTAINS declarations.
INSERT INTO menu_item_safety_declarations (
  menu_item_id,
  kind,
  allergen_flag,
  sort_order
)
SELECT
  item.id,
  'contains',
  declared.flag,
  declared.ordinality::integer * 10
FROM menu_items item
CROSS JOIN LATERAL unnest(item.allergen_flags)
  WITH ORDINALITY AS declared(flag, ordinality)
WHERE item.allergen_flags IS NOT NULL
  AND cardinality(item.allergen_flags) > 0
ON CONFLICT DO NOTHING;

ALTER TABLE menu_items
  DROP COLUMN allergen_flags;
