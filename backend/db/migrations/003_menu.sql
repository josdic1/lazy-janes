CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  status text NOT NULL DEFAULT 'available' CHECK (
    status IN ('available', 'eighty_sixed', 'inactive')
  ),
  is_special boolean NOT NULL DEFAULT false,
  is_modifier boolean NOT NULL DEFAULT false,
  dietary_flags text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    is_modifier = false
    OR parent_item_id IS NOT NULL
  )
);

CREATE INDEX menu_items_parent_idx
  ON menu_items (parent_item_id);

CREATE INDEX menu_items_category_order_idx
  ON menu_items (category, sort_order, name);

CREATE INDEX menu_items_status_idx
  ON menu_items (status);
