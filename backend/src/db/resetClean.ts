import { hashUserPin } from "../auth/security.js";
import { environment } from "../env.js";
import { pool } from "./pool.js";

const databaseName = new URL(environment.DATABASE_URL)
  .pathname
  .replace(/^\//, "");

if (databaseName !== "lazy_janes_clean") {
  throw new Error(
    `Refusing destructive reset of database "${databaseName}". ` +
      "This command only runs against lazy_janes_clean.",
  );
}

const client = await pool.connect();

try {
  await client.query("BEGIN");

  // Wipe every operational record and every user.
  // CASCADE clears parties/guests, orders, checks, payments,
  // kitchen tickets, register history, sessions, auth events,
  // seatings, and dining tables while leaving menu data intact.
  await client.query(`
    TRUNCATE TABLE
      users,
      sections
    RESTART IDENTITY CASCADE
  `);

  const userResult = await client.query<{ id: string }>(`
    INSERT INTO users (
      display_name,
      is_active
    )
    VALUES ('admin', true)
    RETURNING id
  `);

  const adminId = userResult.rows[0]?.id;

  if (!adminId) {
    throw new Error("PostgreSQL did not return the admin user.");
  }

  await client.query(
    `
      INSERT INTO user_roles (
        user_id,
        role_code
      )
      VALUES ($1, 'admin')
    `,
    [adminId],
  );

  const passwordHash = await hashUserPin("admin");

  await client.query(
    `
      INSERT INTO user_credentials (
        user_id,
        pin_hash,
        failed_attempt_count,
        locked_until
      )
      VALUES ($1, $2, 0, NULL)
    `,
    [adminId, passwordHash],
  );

  await client.query("COMMIT");

  const counts = await pool.query<{
    users: string;
    parties: string;
    orders: string;
    tables: string;
  }>(`
    SELECT
      (SELECT count(*) FROM users) AS users,
      (SELECT count(*) FROM parties) AS parties,
      (SELECT count(*) FROM orders) AS orders,
      (SELECT count(*) FROM dining_tables) AS tables
  `);

  const row = counts.rows[0];

  console.log("✓ lazy_janes_clean reset complete");
  console.log("✓ username: admin");
  console.log("✓ password: admin");
  console.log(`✓ users: ${row?.users ?? "?"}`);
  console.log(`✓ parties/guests: ${row?.parties ?? "?"}`);
  console.log(`✓ orders: ${row?.orders ?? "?"}`);
  console.log(`✓ dining tables: ${row?.tables ?? "?"}`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
