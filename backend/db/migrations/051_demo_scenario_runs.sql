-- Development/demo scenario ownership. Every generated operational root row
-- belongs to one run so clearing or replacing a scenario cannot touch real data.

CREATE TABLE demo_scenario_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preset text NOT NULL CHECK (
    preset IN (
      'slow-day',
      'mildly-busy-day',
      'very-busy-day',
      'busy-week',
      'busy-month'
    )
  ),
  anchor_date date NOT NULL,
  range_start date NOT NULL,
  range_end date NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  cleared_at timestamptz,

  CHECK (range_start <= range_end),
  CHECK (anchor_date = range_end),
  CHECK (cleared_at IS NULL OR cleared_at >= created_at)
);

CREATE UNIQUE INDEX one_active_demo_scenario_run_idx
  ON demo_scenario_runs ((true))
  WHERE cleared_at IS NULL;

ALTER TABLE users
  ADD COLUMN is_demo boolean NOT NULL DEFAULT false;

ALTER TABLE parties
  ADD COLUMN demo_scenario_run_id uuid
    REFERENCES demo_scenario_runs(id) ON DELETE RESTRICT;

ALTER TABLE orders
  ADD COLUMN demo_scenario_run_id uuid
    REFERENCES demo_scenario_runs(id) ON DELETE RESTRICT;

ALTER TABLE checks
  ADD COLUMN demo_scenario_run_id uuid
    REFERENCES demo_scenario_runs(id) ON DELETE RESTRICT;

ALTER TABLE payments
  ADD COLUMN demo_scenario_run_id uuid
    REFERENCES demo_scenario_runs(id) ON DELETE RESTRICT;

ALTER TABLE kitchen_chits
  ADD COLUMN demo_scenario_run_id uuid
    REFERENCES demo_scenario_runs(id) ON DELETE RESTRICT;

ALTER TABLE drawer_sessions
  ADD COLUMN demo_scenario_run_id uuid
    REFERENCES demo_scenario_runs(id) ON DELETE RESTRICT;

CREATE INDEX parties_demo_scenario_run_idx
  ON parties (demo_scenario_run_id)
  WHERE demo_scenario_run_id IS NOT NULL;

CREATE INDEX orders_demo_scenario_run_idx
  ON orders (demo_scenario_run_id)
  WHERE demo_scenario_run_id IS NOT NULL;

CREATE INDEX checks_demo_scenario_run_idx
  ON checks (demo_scenario_run_id)
  WHERE demo_scenario_run_id IS NOT NULL;

CREATE INDEX payments_demo_scenario_run_idx
  ON payments (demo_scenario_run_id)
  WHERE demo_scenario_run_id IS NOT NULL;

CREATE INDEX kitchen_chits_demo_scenario_run_idx
  ON kitchen_chits (demo_scenario_run_id)
  WHERE demo_scenario_run_id IS NOT NULL;

CREATE INDEX drawer_sessions_demo_scenario_run_idx
  ON drawer_sessions (demo_scenario_run_id)
  WHERE demo_scenario_run_id IS NOT NULL;
