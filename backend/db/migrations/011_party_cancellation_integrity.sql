ALTER TABLE parties
  ADD COLUMN cancelled_by_staff_id uuid
    REFERENCES staff(id),
  ADD COLUMN cancellation_reason text;

ALTER TABLE parties
  ADD CONSTRAINT parties_cancellation_metadata_check
  CHECK (
    (
      status = 'cancelled'
      AND cancelled_by_staff_id IS NOT NULL
      AND cancellation_reason IS NOT NULL
    )
    OR
    (
      status <> 'cancelled'
      AND cancelled_by_staff_id IS NULL
      AND cancellation_reason IS NULL
    )
  );

ALTER TABLE party_events
  ADD COLUMN reason text;

ALTER TABLE party_events
  ADD CONSTRAINT cancelled_party_event_requires_reason
  CHECK (
    event_type <> 'cancelled'
    OR reason IS NOT NULL
  );
