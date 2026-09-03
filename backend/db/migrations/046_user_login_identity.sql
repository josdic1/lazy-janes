-- Login identity ignores capitalization and spaces.
-- Display name remains the human-facing value.

CREATE UNIQUE INDEX users_login_identity_unique
  ON users ((
    replace(lower(display_name), ' ', '')
  ));
