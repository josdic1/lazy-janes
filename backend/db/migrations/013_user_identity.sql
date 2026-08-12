-- Authentication belongs to system users. Employment remains a separate concern.

ALTER TABLE staff RENAME TO users;
ALTER TABLE staff_roles RENAME TO user_roles;
ALTER TABLE user_roles RENAME COLUMN staff_id TO user_id;

ALTER TABLE staff_credentials RENAME TO user_credentials;
ALTER TABLE user_credentials RENAME COLUMN staff_id TO user_id;

ALTER TABLE staff_sessions RENAME TO user_sessions;
ALTER TABLE user_sessions RENAME COLUMN staff_id TO user_id;

ALTER TABLE staff_auth_events RENAME TO user_auth_events;
ALTER TABLE user_auth_events RENAME COLUMN staff_id TO user_id;

ALTER TABLE parties
  RENAME COLUMN created_by_staff_id TO created_by_user_id;
ALTER TABLE parties
  RENAME COLUMN cancelled_by_staff_id TO cancelled_by_user_id;
ALTER TABLE party_events
  RENAME COLUMN actor_staff_id TO actor_user_id;
ALTER TABLE seatings
  RENAME COLUMN seated_by_staff_id TO seated_by_user_id;

ALTER TABLE orders
  RENAME COLUMN created_by_staff_id TO created_by_user_id;
ALTER TABLE orders
  RENAME COLUMN cancelled_by_staff_id TO cancelled_by_user_id;
ALTER TABLE order_events
  RENAME COLUMN actor_staff_id TO actor_user_id;
ALTER TABLE order_items
  RENAME COLUMN created_by_staff_id TO created_by_user_id;
ALTER TABLE order_items
  RENAME COLUMN voided_by_staff_id TO voided_by_user_id;
ALTER TABLE order_item_events
  RENAME COLUMN actor_staff_id TO actor_user_id;

ALTER TABLE checks
  RENAME COLUMN opened_by_staff_id TO opened_by_user_id;
ALTER TABLE check_events
  RENAME COLUMN actor_staff_id TO actor_user_id;

ALTER TABLE payments
  RENAME COLUMN received_by_staff_id TO received_by_user_id;
ALTER TABLE payments
  RENAME COLUMN voided_by_staff_id TO voided_by_user_id;
ALTER TABLE payment_events
  RENAME COLUMN actor_staff_id TO actor_user_id;

ALTER TABLE kitchen_chits
  RENAME COLUMN printed_by_staff_id TO printed_by_user_id;
ALTER TABLE kitchen_chits
  RENAME COLUMN cancelled_by_staff_id TO cancelled_by_user_id;
ALTER TABLE kitchen_chit_events
  RENAME COLUMN actor_staff_id TO actor_user_id;

ALTER TABLE drawer_sessions
  RENAME COLUMN opened_by_staff_id TO opened_by_user_id;
ALTER TABLE drawer_sessions
  RENAME COLUMN closed_by_staff_id TO closed_by_user_id;
ALTER TABLE cash_counts
  RENAME COLUMN counted_by_staff_id TO counted_by_user_id;
ALTER TABLE drawer_events
  RENAME COLUMN actor_staff_id TO actor_user_id;

-- Replace actor-kind constraints that still encode "staff" as the identity type.
DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT
      conrelid::regclass AS table_name,
      conname
    FROM pg_constraint
    WHERE contype = 'c'
      AND conrelid = ANY (
        ARRAY[
          'order_events'::regclass,
          'order_item_events'::regclass,
          'check_events'::regclass,
          'payment_events'::regclass
        ]
      )
      AND pg_get_constraintdef(oid) LIKE '%staff%'
  LOOP
    EXECUTE format(
      'ALTER TABLE %s DROP CONSTRAINT %I',
      item.table_name,
      item.conname
    );
  END LOOP;
END
$$;

UPDATE order_events
SET actor_kind = 'user'
WHERE actor_kind = 'staff';

UPDATE order_item_events
SET actor_kind = 'user'
WHERE actor_kind = 'staff';

UPDATE check_events
SET actor_kind = 'user'
WHERE actor_kind = 'staff';

UPDATE payment_events
SET actor_kind = 'user'
WHERE actor_kind = 'staff';

ALTER TABLE order_events
  ADD CONSTRAINT order_events_actor_kind_check
    CHECK (actor_kind IN ('user', 'system')),
  ADD CONSTRAINT order_events_actor_identity_check
    CHECK (
      (actor_kind = 'user' AND actor_user_id IS NOT NULL)
      OR
      (actor_kind = 'system' AND actor_user_id IS NULL)
    );

ALTER TABLE order_item_events
  ADD CONSTRAINT order_item_events_actor_kind_check
    CHECK (actor_kind IN ('user', 'system')),
  ADD CONSTRAINT order_item_events_actor_identity_check
    CHECK (
      (actor_kind = 'user' AND actor_user_id IS NOT NULL)
      OR
      (actor_kind = 'system' AND actor_user_id IS NULL)
    );

ALTER TABLE check_events
  ADD CONSTRAINT check_events_actor_kind_check
    CHECK (actor_kind IN ('user', 'system')),
  ADD CONSTRAINT check_events_actor_identity_check
    CHECK (
      (actor_kind = 'user' AND actor_user_id IS NOT NULL)
      OR
      (actor_kind = 'system' AND actor_user_id IS NULL)
    );

ALTER TABLE payment_events
  ADD CONSTRAINT payment_events_actor_kind_check
    CHECK (actor_kind IN ('user', 'system')),
  ADD CONSTRAINT payment_events_actor_identity_check
    CHECK (
      (actor_kind = 'user' AND actor_user_id IS NOT NULL)
      OR
      (actor_kind = 'system' AND actor_user_id IS NULL)
    );

-- Constraint/index/sequence names are schema too. Remove stale staff naming.
DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT
      conrelid::regclass AS table_name,
      conname
    FROM pg_constraint
    WHERE conname LIKE '%staff%'
  LOOP
    EXECUTE format(
      'ALTER TABLE %s RENAME CONSTRAINT %I TO %I',
      item.table_name,
      item.conname,
      replace(item.conname, 'staff', 'user')
    );
  END LOOP;
END
$$;

DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT schemaname, indexname
    FROM pg_indexes
    WHERE schemaname = current_schema()
      AND indexname LIKE '%staff%'
  LOOP
    EXECUTE format(
      'ALTER INDEX %I.%I RENAME TO %I',
      item.schemaname,
      item.indexname,
      replace(item.indexname, 'staff', 'user')
    );
  END LOOP;
END
$$;

DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT
      namespace.nspname AS schemaname,
      relation.relname AS sequence_name
    FROM pg_class AS relation
    JOIN pg_namespace AS namespace
      ON namespace.oid = relation.relnamespace
    WHERE relation.relkind = 'S'
      AND namespace.nspname = current_schema()
      AND relation.relname LIKE '%staff%'
  LOOP
    EXECUTE format(
      'ALTER SEQUENCE %I.%I RENAME TO %I',
      item.schemaname,
      item.sequence_name,
      replace(item.sequence_name, 'staff', 'user')
    );
  END LOOP;
END
$$;
