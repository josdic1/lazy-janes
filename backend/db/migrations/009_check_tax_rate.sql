ALTER TABLE checks
  ADD COLUMN sales_tax_rate numeric(7, 6)
    NOT NULL DEFAULT 0.066250,

  ADD CONSTRAINT checks_sales_tax_rate_check
    CHECK (
      sales_tax_rate >= 0
      AND sales_tax_rate <= 1
    );
