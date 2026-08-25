import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const migrationLockName = "lazy_janes_migrations";
const migrationFilePattern = /^\d{3}_[a-z0-9_]+\.sql$/;

const migrationsDirectory = fileURLToPath(
  new URL("../../db/migrations/", import.meta.url),
);

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query("SELECT pg_advisory_lock(hashtext($1))", [
      migrationLockName,
    ]);

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const directoryEntries = await readdir(migrationsDirectory, {
      withFileTypes: true,
    });

    const migrationFiles = directoryEntries
      .filter(
        (entry) =>
          entry.isFile() && migrationFilePattern.test(entry.name),
      )
      .map((entry) => entry.name)
      .sort();

    const appliedResult = await client.query<{ id: string }>(
      "SELECT id FROM schema_migrations",
    );

    const appliedMigrations = new Set(
      appliedResult.rows.map((row) => row.id),
    );

    for (const migrationFile of migrationFiles) {
      if (appliedMigrations.has(migrationFile)) {
        continue;
      }

      const migrationSql = await readFile(
        new URL(`../../db/migrations/${migrationFile}`, import.meta.url),
        "utf8",
      );

      try {
        await client.query("BEGIN");
        await client.query(migrationSql);
        await client.query(
          "INSERT INTO schema_migrations (id) VALUES ($1)",
          [migrationFile],
        );
        await client.query("COMMIT");

        console.log(`Applied migration ${migrationFile}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    await client
      .query("SELECT pg_advisory_unlock(hashtext($1))", [
        migrationLockName,
      ])
      .catch(() => undefined);

    client.release();
  }
}

try {
  await runMigrations();
} catch (error) {
  console.error("Migration failed", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
