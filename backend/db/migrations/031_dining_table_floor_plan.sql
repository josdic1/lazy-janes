ALTER TABLE dining_tables
  ADD COLUMN floor_x integer,
  ADD COLUMN floor_y integer;

WITH positioned AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY section_id
      ORDER BY created_at, id
    ) - 1 AS slot
  FROM dining_tables
)
UPDATE dining_tables
SET
  floor_x = 8 + ((positioned.slot % 5) * 20),
  floor_y = 10 + (((positioned.slot / 5) % 4) * 27)
FROM positioned
WHERE dining_tables.id = positioned.id;

ALTER TABLE dining_tables
  ALTER COLUMN floor_x SET DEFAULT 8,
  ALTER COLUMN floor_y SET DEFAULT 10,
  ALTER COLUMN floor_x SET NOT NULL,
  ALTER COLUMN floor_y SET NOT NULL,
  ADD CONSTRAINT dining_tables_floor_x_range
    CHECK (floor_x BETWEEN 0 AND 100),
  ADD CONSTRAINT dining_tables_floor_y_range
    CHECK (floor_y BETWEEN 0 AND 100);
