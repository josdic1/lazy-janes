ALTER TABLE parties
ADD COLUMN name text;

ALTER TABLE parties
ADD CONSTRAINT parties_name_not_blank_check
CHECK (
  name IS NULL
  OR (
    char_length(btrim(name)) BETWEEN 1 AND 80
    AND name = btrim(name)
  )
);
