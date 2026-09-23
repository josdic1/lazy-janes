ALTER TABLE demo_scenario_runs
  DROP CONSTRAINT IF EXISTS demo_scenario_runs_preset_check;

ALTER TABLE demo_scenario_runs
  ADD CONSTRAINT demo_scenario_runs_preset_check
  CHECK (
    preset IN (
      'slow-day',
      'slow-week',
      'mildly-busy-day',
      'very-busy-day',
      'busy-week',
      'busy-month'
    )
  );
