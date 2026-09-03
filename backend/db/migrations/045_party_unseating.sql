ALTER TABLE party_events
  DROP CONSTRAINT party_events_event_type_check;

ALTER TABLE party_events
  ADD CONSTRAINT party_events_event_type_check
  CHECK (
    event_type IN (
      'arrived',
      'waiting_started',
      'seated',
      'unseated',
      'service_started',
      'completed',
      'cancelled'
    )
  );

ALTER TABLE party_events
  DROP CONSTRAINT cancelled_party_event_requires_reason;

ALTER TABLE party_events
  ADD CONSTRAINT party_event_reason_required
  CHECK (
    event_type NOT IN ('cancelled', 'unseated')
    OR reason IS NOT NULL
  );
