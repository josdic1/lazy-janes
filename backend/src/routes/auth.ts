import {
  createInitialAdminInputSchema,
  type UserIdentity,
} from "@lazy-janes/shared";
import { Router } from "express";
import { hashUserPin } from "../auth/security.js";
import { pool } from "../db/pool.js";

export const authRouter = Router();

authRouter.get("/setup", async (_request, response) => {
  const result = await pool.query<{ requires_setup: boolean }>(`
    SELECT NOT EXISTS (
      SELECT 1
      FROM users
    ) AS requires_setup
  `);

  response.json({
    requiresSetup:
      result.rows[0]?.requires_setup ?? false,
  });
});

authRouter.post("/setup", async (request, response) => {
  const input = createInitialAdminInputSchema.safeParse(
    request.body,
  );

  if (!input.success) {
    response.status(400).json({
      error: "Invalid initial administrator",
      issues: input.error.issues,
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /*
     * Two concurrent first-run requests must not both
     * observe an empty users table.
     */
    await client.query(
      "LOCK TABLE users IN EXCLUSIVE MODE",
    );

    const existingUsers = await client.query<{
      count: string;
    }>(`
      SELECT count(*) AS count
      FROM users
    `);

    if (Number(existingUsers.rows[0]?.count ?? "0") > 0) {
      await client.query("ROLLBACK");

      response.status(409).json({
        error: "Initial administrator already exists",
      });
      return;
    }

    const userResult = await client.query<{
      id: string;
      display_name: string;
    }>(
      `
        INSERT INTO users (
          display_name
        )
        VALUES ($1)
        RETURNING
          id,
          display_name
      `,
      [input.data.displayName],
    );

    const user = userResult.rows[0];

    if (!user) {
      throw new Error(
        "PostgreSQL did not return the initial administrator.",
      );
    }

    await client.query(
      `
        INSERT INTO user_roles (
          user_id,
          role_code
        )
        VALUES ($1, 'admin')
      `,
      [user.id],
    );

    const pinHash = await hashUserPin(input.data.pin);

    await client.query(
      `
        INSERT INTO user_credentials (
          user_id,
          pin_hash
        )
        VALUES ($1, $2)
      `,
      [user.id, pinHash],
    );

    await client.query("COMMIT");

    const identity: UserIdentity = {
      id: user.id,
      displayName: user.display_name,
      roles: ["admin"],
    };

    response.status(201).json(identity);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});
