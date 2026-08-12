CREATE TABLE staff_credentials (
  staff_id uuid PRIMARY KEY
    REFERENCES staff(id) ON DELETE CASCADE,
  pin_hash text NOT NULL,
  failed_attempt_count integer NOT NULL DEFAULT 0 CHECK (
    failed_attempt_count >= 0
  ),
  locked_until timestamptz,
  pin_changed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);


CREATE TABLE staff_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL
    REFERENCES staff(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE CHECK (
    length(token_hash) = 64
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,

  CHECK (expires_at > created_at),

  CHECK (
    revoked_at IS NULL
    OR revoked_at >= created_at
  )
);

CREATE INDEX staff_sessions_active_staff_idx
  ON staff_sessions (staff_id, expires_at)
  WHERE revoked_at IS NULL;


CREATE TABLE staff_auth_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  staff_id uuid NOT NULL REFERENCES staff(id),
  session_id uuid REFERENCES staff_sessions(id)
    ON DELETE SET NULL,
  event_type text NOT NULL CHECK (
    event_type IN (
      'login_succeeded',
      'login_failed',
      'locked',
      'logout',
      'pin_changed'
    )
  ),
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX staff_auth_events_staff_time_idx
  ON staff_auth_events (staff_id, occurred_at, id);
