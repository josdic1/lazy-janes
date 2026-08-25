ALTER TABLE order_items
  ADD CONSTRAINT order_items_order_id_id_unique
  UNIQUE (order_id, id);

CREATE TABLE kitchen_chits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chit_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  order_id uuid NOT NULL REFERENCES orders(id),
  print_kind text NOT NULL CHECK (
    print_kind IN ('initial', 'refire')
  ),
  printed_by_staff_id uuid NOT NULL REFERENCES staff(id),
  note text,
  printed_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  cancelled_by_staff_id uuid REFERENCES staff(id),
  cancellation_reason text,

  CHECK (
    cancelled_at IS NULL
    OR (
      cancelled_by_staff_id IS NOT NULL
      AND cancellation_reason IS NOT NULL
    )
  )
);

CREATE INDEX kitchen_chits_order_time_idx
  ON kitchen_chits (order_id, printed_at, chit_number);

CREATE INDEX kitchen_chits_active_time_idx
  ON kitchen_chits (printed_at, chit_number)
  WHERE cancelled_at IS NULL;


CREATE TABLE kitchen_chit_items (
  kitchen_chit_id uuid NOT NULL REFERENCES kitchen_chits(id),
  order_id uuid NOT NULL,
  order_item_id uuid NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (kitchen_chit_id, order_item_id),

  FOREIGN KEY (order_id, order_item_id)
    REFERENCES order_items (order_id, id)
);

CREATE INDEX kitchen_chit_items_order_item_idx
  ON kitchen_chit_items (order_item_id);


CREATE TABLE kitchen_chit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kitchen_chit_id uuid NOT NULL REFERENCES kitchen_chits(id),
  event_type text NOT NULL CHECK (
    event_type IN ('printed', 'reprinted', 'cancelled')
  ),
  actor_staff_id uuid NOT NULL REFERENCES staff(id),
  reason text,
  occurred_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    event_type NOT IN ('reprinted', 'cancelled')
    OR reason IS NOT NULL
  )
);

CREATE INDEX kitchen_chit_events_chit_time_idx
  ON kitchen_chit_events (
    kitchen_chit_id,
    occurred_at,
    id
  );
