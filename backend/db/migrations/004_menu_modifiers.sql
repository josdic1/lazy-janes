CREATE TABLE modifier_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE modifier_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modifier_group_id uuid NOT NULL REFERENCES modifier_groups(id),
  name text NOT NULL,
  kitchen_name text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (modifier_group_id, name),
  UNIQUE (modifier_group_id, id)
);

CREATE TABLE menu_item_modifier_groups (
  menu_item_id uuid NOT NULL REFERENCES menu_items(id),
  modifier_group_id uuid NOT NULL REFERENCES modifier_groups(id),
  minimum_selections integer NOT NULL DEFAULT 0,
  maximum_selections integer,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (menu_item_id, modifier_group_id),

  CHECK (minimum_selections >= 0),
  CHECK (
    maximum_selections IS NULL
    OR maximum_selections >= minimum_selections
  )
);

CREATE TABLE menu_item_modifier_choices (
  menu_item_id uuid NOT NULL,
  modifier_group_id uuid NOT NULL,
  modifier_option_id uuid NOT NULL,
  price_adjustment_cents integer NOT NULL DEFAULT 0,
  is_default boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (
    menu_item_id,
    modifier_group_id,
    modifier_option_id
  ),

  FOREIGN KEY (menu_item_id, modifier_group_id)
    REFERENCES menu_item_modifier_groups (
      menu_item_id,
      modifier_group_id
    ),

  FOREIGN KEY (modifier_group_id, modifier_option_id)
    REFERENCES modifier_options (
      modifier_group_id,
      id
    )
);
