ALTER TABLE payments
  ADD CONSTRAINT payment_processor_reference_matches_method
  CHECK (
    (
      method = 'card'
      AND processor_reference IS NOT NULL
    )
    OR
    (
      method = 'cash'
      AND processor_reference IS NULL
    )
  );

CREATE UNIQUE INDEX one_payment_per_processor_reference_idx
  ON payments (processor_reference)
  WHERE processor_reference IS NOT NULL;
