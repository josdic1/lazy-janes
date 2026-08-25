CREATE TABLE parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_count integer NOT NULL CHECK (guest_count > 0),
  status text NOT NULL CHECK (
    status IN (
      'waiting',
      'seated',
      'in_service',
      'completed',
      'cancelled'
    )
  ),
  created_by_staff_id uuid NOT NULL REFERENCES staff(id),
  arrived_at timestamptz NOT NULL DEFAULT now(),
  status_changed_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  cancelled_at timestamptz,

  CHECK (
    (
      status = 'completed'
      AND completed_at IS NOT NULL
      AND cancelled_at IS NULL
    )
    OR (
      status = 'cancelled'
      AND cancelled_at IS NOT NULL
      AND completed_at IS NULL
    )
    OR (
      status IN ('waiting', 'seated', 'in_service')
      AND completed_at IS NULL
      AND cancelled_at IS NULL
    )
  )
);

CREATE TABLE party_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  party_id uuid NOT NULL REFERENCES parties(id),
  event_type text NOT NULL CHECK (
    event_type IN (
      'arrived',
      'waiting_started',
      'seated',
      'service_started',
      'completed',
      'cancelled'
    )
  ),
  actor_staff_id uuid REFERENCES staff(id),
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX party_events_party_time_idx
  ON party_events (party_id, occurred_at, id);

CREATE TABLE seatings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid NOT NULL REFERENCES parties(id),
  seated_by_staff_id uuid NOT NULL REFERENCES staff(id),
  seated_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,

  CHECK (ended_at IS NULL OR ended_at >= seated_at)
);

CREATE UNIQUE INDEX one_active_seating_per_party_idx
  ON seatings (party_id)
  WHERE ended_at IS NULL;

CREATE TABLE seating_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seating_id uuid NOT NULL REFERENCES seatings(id),
  dining_table_id uuid NOT NULL REFERENCES dining_tables(id),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz,

  CHECK (released_at IS NULL OR released_at >= assigned_at)
);

CREATE UNIQUE INDEX one_active_assignment_per_table_idx
  ON seating_tables (dining_table_id)
  WHERE released_at IS NULL;

CREATE UNIQUE INDEX one_active_table_per_seating_idx
  ON seating_tables (seating_id, dining_table_id)
  WHERE released_at IS NULL;
