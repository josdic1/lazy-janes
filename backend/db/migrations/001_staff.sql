CREATE TABLE staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  code text PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE staff_roles (
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  role_code text NOT NULL REFERENCES roles(code),
  assigned_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (staff_id, role_code)
);

INSERT INTO roles (code, name)
VALUES
  ('host', 'Host'),
  ('server', 'Server'),
  ('lead_server', 'Lead Server'),
  ('chef', 'Chef'),
  ('head_chef', 'Head Chef'),
  ('manager', 'Manager'),
  ('admin', 'Admin');
