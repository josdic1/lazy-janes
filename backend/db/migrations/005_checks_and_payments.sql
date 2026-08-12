CREATE TABLE checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid REFERENCES parties(id),
  label text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (
    status IN ('open', 'presented', 'closed')
  ),
  opened_by_staff_id uuid NOT NULL REFERENCES staff(id),
  subtotal_amount numeric(10, 2) NOT NULL DEFAULT 0 CHECK (
    subtotal_amount >= 0
  ),
  tax_amount numeric(10, 2) NOT NULL DEFAULT 0 CHECK (
    tax_amount >= 0
  ),
  total_amount numeric(10, 2) NOT NULL DEFAULT 0 CHECK (
    total_amount = subtotal_amount + tax_amount
  ),
  presented_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    (status = 'open' AND closed_at IS NULL)
    OR
    (status = 'presented'
      AND presented_at IS NOT NULL
      AND closed_at IS NULL)
    OR
    (status = 'closed'
      AND presented_at IS NOT NULL
      AND closed_at IS NOT NULL)
  )
);

CREATE INDEX checks_party_idx
  ON checks (party_id, created_at);

CREATE INDEX checks_open_status_idx
  ON checks (status, created_at)
  WHERE status <> 'closed';


CREATE TABLE check_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_id uuid NOT NULL REFERENCES checks(id),
  order_item_id uuid NOT NULL REFERENCES order_items(id),
  item_name text NOT NULL,
  allocated_quantity numeric(10, 3) NOT NULL CHECK (
    allocated_quantity > 0
  ),
  allocated_amount numeric(10, 2) NOT NULL CHECK (
    allocated_amount >= 0
  ),
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (check_id, order_item_id)
);

CREATE INDEX check_items_check_idx
  ON check_items (check_id);

CREATE INDEX check_items_order_item_idx
  ON check_items (order_item_id);


CREATE TABLE check_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  check_id uuid NOT NULL REFERENCES checks(id),
  event_type text NOT NULL CHECK (
    event_type IN (
      'created',
      'item_added',
      'item_removed',
      'item_split',
      'presented',
      'reopened',
      'closed'
    )
  ),
  actor_kind text NOT NULL CHECK (
    actor_kind IN ('staff', 'system')
  ),
  actor_staff_id uuid REFERENCES staff(id),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    (actor_kind = 'staff' AND actor_staff_id IS NOT NULL)
    OR
    (actor_kind = 'system' AND actor_staff_id IS NULL)
  )
);

CREATE INDEX check_events_check_time_idx
  ON check_events (check_id, occurred_at, id);


CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method text NOT NULL CHECK (
    method IN ('cash', 'card')
  ),
  status text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'succeeded', 'failed', 'voided')
  ),
  payment_amount numeric(10, 2) NOT NULL CHECK (
    payment_amount > 0
  ),
  tip_amount numeric(10, 2) NOT NULL DEFAULT 0 CHECK (
    tip_amount >= 0
  ),
  received_by_staff_id uuid NOT NULL REFERENCES staff(id),
  processor_reference text,
  cash_received_amount numeric(10, 2),
  change_given_amount numeric(10, 2),
  succeeded_at timestamptz,
  failed_at timestamptz,
  voided_at timestamptz,
  voided_by_staff_id uuid REFERENCES staff(id),
  void_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    method <> 'cash'
    OR (
      cash_received_amount IS NOT NULL
      AND cash_received_amount >= payment_amount + tip_amount
      AND change_given_amount IS NOT NULL
      AND change_given_amount =
        cash_received_amount - payment_amount - tip_amount
    )
  ),

  CHECK (
    method <> 'card'
    OR (
      cash_received_amount IS NULL
      AND change_given_amount IS NULL
    )
  ),

  CHECK (
    (status = 'pending'
      AND succeeded_at IS NULL
      AND failed_at IS NULL
      AND voided_at IS NULL)
    OR
    (status = 'succeeded'
      AND succeeded_at IS NOT NULL
      AND failed_at IS NULL
      AND voided_at IS NULL)
    OR
    (status = 'failed'
      AND succeeded_at IS NULL
      AND failed_at IS NOT NULL
      AND voided_at IS NULL)
    OR
    (status = 'voided'
      AND voided_at IS NOT NULL
      AND voided_by_staff_id IS NOT NULL
      AND void_reason IS NOT NULL)
  )
);

CREATE INDEX payments_status_time_idx
  ON payments (status, created_at);


CREATE TABLE payment_check_allocations (
  payment_id uuid NOT NULL REFERENCES payments(id),
  check_id uuid NOT NULL REFERENCES checks(id),
  allocated_amount numeric(10, 2) NOT NULL CHECK (
    allocated_amount > 0
  ),
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (payment_id, check_id)
);

CREATE INDEX payment_check_allocations_check_idx
  ON payment_check_allocations (check_id);


CREATE TABLE payment_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  payment_id uuid NOT NULL REFERENCES payments(id),
  event_type text NOT NULL CHECK (
    event_type IN (
      'created',
      'succeeded',
      'failed',
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

CREATE INDEX payment_events_payment_time_idx
  ON payment_events (payment_id, occurred_at, id);
