CREATE TABLE drawer_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opened_by_staff_id uuid NOT NULL REFERENCES staff(id),
  opening_cash_amount numeric(10, 2) NOT NULL CHECK (
    opening_cash_amount >= 0
  ),
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_by_staff_id uuid REFERENCES staff(id),
  expected_cash_amount numeric(10, 2),
  counted_cash_amount numeric(10, 2),
  variance_amount numeric(10, 2),
  closed_at timestamptz,

  CHECK (
    closed_at IS NULL
    OR (
      closed_by_staff_id IS NOT NULL
      AND expected_cash_amount IS NOT NULL
      AND expected_cash_amount >= 0
      AND counted_cash_amount IS NOT NULL
      AND counted_cash_amount >= 0
      AND variance_amount =
        counted_cash_amount - expected_cash_amount
      AND closed_at >= opened_at
    )
  )
);

CREATE UNIQUE INDEX one_open_drawer_session_idx
  ON drawer_sessions ((true))
  WHERE closed_at IS NULL;


CREATE TABLE cash_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drawer_session_id uuid NOT NULL REFERENCES drawer_sessions(id),
  count_kind text NOT NULL CHECK (
    count_kind IN ('opening', 'spot', 'closing')
  ),
  counted_amount numeric(10, 2) NOT NULL CHECK (
    counted_amount >= 0
  ),
  counted_by_staff_id uuid NOT NULL REFERENCES staff(id),
  note text,
  counted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX cash_counts_session_time_idx
  ON cash_counts (drawer_session_id, counted_at, id);


CREATE TABLE drawer_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  drawer_session_id uuid NOT NULL REFERENCES drawer_sessions(id),
  event_type text NOT NULL CHECK (
    event_type IN (
      'opened',
      'cash_payment',
      'cash_refund',
      'paid_in',
      'paid_out',
      'cash_drop',
      'counted',
      'closed'
    )
  ),
  amount numeric(10, 2) NOT NULL DEFAULT 0 CHECK (
    amount >= 0
  ),
  payment_id uuid REFERENCES payments(id),
  cash_count_id uuid REFERENCES cash_counts(id),
  actor_staff_id uuid NOT NULL REFERENCES staff(id),
  reason text,
  occurred_at timestamptz NOT NULL DEFAULT now(),

  CHECK (
    event_type <> 'cash_payment'
    OR payment_id IS NOT NULL
  ),

  CHECK (
    event_type <> 'counted'
    OR cash_count_id IS NOT NULL
  ),

  CHECK (
    event_type NOT IN (
      'cash_refund',
      'paid_in',
      'paid_out',
      'cash_drop'
    )
    OR reason IS NOT NULL
  )
);

CREATE INDEX drawer_events_session_time_idx
  ON drawer_events (drawer_session_id, occurred_at, id);

CREATE INDEX drawer_events_payment_idx
  ON drawer_events (payment_id)
  WHERE payment_id IS NOT NULL;


ALTER TABLE payments
  ADD COLUMN drawer_session_id uuid
    REFERENCES drawer_sessions(id);

ALTER TABLE payments
  ADD CONSTRAINT cash_payment_requires_drawer_session
  CHECK (
    method <> 'cash'
    OR drawer_session_id IS NOT NULL
  );
