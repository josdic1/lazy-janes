CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid REFERENCES parties(id),
  fulfillment_type text NOT NULL CHECK (
    fulfillment_type IN ('dine_in', 'takeout', 'delivery')
  ),
  created_by_staff_id uuid NOT NULL REFERENCES staff(id),
  customer_name text,
  customer_phone text,
  requested_for timestamptz,
  delivery_address text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  cancelled_by_staff_id uuid REFERENCES staff(id),
  cancellation_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    fulfillment_type <> 'dine_in'
    OR party_id IS NOT NULL
  ),

  CHECK (
    fulfillment_type <> 'delivery'
    OR delivery_address IS NOT NULL
  ),

  CHECK (
    cancelled_at IS NULL
    OR (
      cancelled_by_staff_id IS NOT NULL
      AND cancellation_reason IS NOT NULL
    )
  )
);

CREATE INDEX orders_party_idx
  ON orders (party_id, submitted_at);

CREATE INDEX orders_active_fulfillment_idx
  ON orders (fulfillment_type, submitted_at)
  WHERE cancelled_at IS NULL;


CREATE TABLE order_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id),
  event_type text NOT NULL CHECK (
    event_type IN ('submitted', 'cancelled')
  ),
  actor_kind text NOT NULL CHECK (
    actor_kind IN ('staff', 'system')
  ),
  actor_staff_id uuid REFERENCES staff(id),
  reason text,
  occurred_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    (actor_kind = 'staff' AND actor_staff_id IS NOT NULL)
    OR
    (actor_kind = 'system' AND actor_staff_id IS NULL)
  ),

  CHECK (
    event_type <> 'cancelled'
    OR reason IS NOT NULL
  )
);

CREATE INDEX order_events_order_time_idx
  ON order_events (order_id, occurred_at, id);


CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id),
  created_by_staff_id uuid NOT NULL REFERENCES staff(id),
  seat_number integer CHECK (seat_number > 0),
  item_name text NOT NULL,
  unit_price numeric(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  kitchen_note text,
  status text NOT NULL DEFAULT 'submitted' CHECK (
    status IN (
      'submitted',
      'fired',
      'ready',
      'fulfilled',
      'voided'
    )
  ),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  fired_at timestamptz,
  ready_at timestamptz,
  fulfilled_at timestamptz,
  voided_at timestamptz,
  voided_by_staff_id uuid REFERENCES staff(id),
  void_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    (status = 'submitted'
      AND fired_at IS NULL
      AND ready_at IS NULL
      AND fulfilled_at IS NULL
      AND voided_at IS NULL)
    OR
    (status = 'fired'
      AND fired_at IS NOT NULL
      AND ready_at IS NULL
      AND fulfilled_at IS NULL
      AND voided_at IS NULL)
    OR
    (status = 'ready'
      AND fired_at IS NOT NULL
      AND ready_at IS NOT NULL
      AND fulfilled_at IS NULL
      AND voided_at IS NULL)
    OR
    (status = 'fulfilled'
      AND fired_at IS NOT NULL
      AND ready_at IS NOT NULL
      AND fulfilled_at IS NOT NULL
      AND voided_at IS NULL)
    OR
    (status = 'voided'
      AND voided_at IS NOT NULL
      AND voided_by_staff_id IS NOT NULL
      AND void_reason IS NOT NULL)
  )
);

CREATE INDEX order_items_order_idx
  ON order_items (order_id, submitted_at);

CREATE INDEX order_items_kitchen_status_idx
  ON order_items (status, submitted_at)
  WHERE status IN ('submitted', 'fired', 'ready');


CREATE TABLE order_item_modifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES order_items(id),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id),
  modifier_name text NOT NULL,
  price_adjustment numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (order_item_id, menu_item_id)
);

CREATE INDEX order_item_modifiers_item_idx
  ON order_item_modifiers (order_item_id);


CREATE TABLE order_item_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_item_id uuid NOT NULL REFERENCES order_items(id),
  event_type text NOT NULL CHECK (
    event_type IN (
      'submitted',
      'fired',
      'ready',
      'fulfilled',
      'voided'
    )
  ),
  actor_kind text NOT NULL CHECK (
    actor_kind IN ('staff', 'system')
  ),
  actor_staff_id uuid REFERENCES staff(id),
  reason text,
  occurred_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    (actor_kind = 'staff' AND actor_staff_id IS NOT NULL)
    OR
    (actor_kind = 'system' AND actor_staff_id IS NULL)
  ),

  CHECK (
    event_type <> 'voided'
    OR reason IS NOT NULL
  )
);

CREATE INDEX order_item_events_item_time_idx
  ON order_item_events (order_item_id, occurred_at, id);
