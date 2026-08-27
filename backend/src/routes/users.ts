import {
  createUserInputSchema,
  resetUserPinInputSchema,
  updateUserInputSchema,
  type UserRecord,
  type UserRoleCode,
} from "@lazy-janes/shared";
import { Router } from "express";
import {
  requireAuthenticatedUser,
  requireRole,
} from "../auth/session.js";
import { hashUserPin } from "../auth/security.js";
import { pool } from "../db/pool.js";

export const usersRouter = Router();

usersRouter.use(
  requireAuthenticatedUser,
  requireRole("admin"),
);

usersRouter.get("/", async (_request, response) => {
  const result = await pool.query<{
    id: string;
    display_name: string;
    is_active: boolean;
    roles: UserRoleCode[];
    has_pin: boolean;
    created_at: Date;
  }>(`
    SELECT
      u.id,
      u.display_name,
      u.is_active,
      COALESCE(
        array_agg(
          ur.role_code
          ORDER BY ur.role_code
        ) FILTER (
          WHERE ur.role_code IS NOT NULL
        ),
        ARRAY[]::text[]
      ) AS roles,
      EXISTS (
        SELECT 1
        FROM user_credentials c
        WHERE c.user_id = u.id
      ) AS has_pin,
      u.created_at
    FROM users u
    LEFT JOIN user_roles ur
      ON ur.user_id = u.id
    GROUP BY
      u.id,
      u.display_name,
      u.is_active,
      u.created_at
    ORDER BY
      lower(u.display_name),
      u.id
  `);

  const users: UserRecord[] = result.rows.map(
    (row) => ({
      id: row.id,
      displayName: row.display_name,
      isActive: row.is_active,
      roles: row.roles,
      hasPin: row.has_pin,
      createdAt: row.created_at.toISOString(),
    }),
  );

  response.json({ users });
});


usersRouter.post("/", async (request, response) => {
  const input = createUserInputSchema.safeParse(
    request.body,
  );

  if (!input.success) {
    response.status(400).json({
      error: "Invalid user",
      issues: input.error.issues,
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query<{
      id: string;
      display_name: string;
      is_active: boolean;
      created_at: Date;
    }>(
      `
        INSERT INTO users (
          display_name
        )
        VALUES ($1)
        RETURNING
          id,
          display_name,
          is_active,
          created_at
      `,
      [input.data.displayName],
    );

    const user = userResult.rows[0];

    if (!user) {
      throw new Error(
        "PostgreSQL did not return the created user.",
      );
    }

    for (const roleCode of input.data.roleCodes) {
      await client.query(
        `
          INSERT INTO user_roles (
            user_id,
            role_code
          )
          VALUES ($1, $2)
        `,
        [user.id, roleCode],
      );
    }

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

    const created: UserRecord = {
      id: user.id,
      displayName: user.display_name,
      isActive: user.is_active,
      roles: [...input.data.roleCodes].sort(),
      hasPin: true,
      createdAt: user.created_at.toISOString(),
    };

    response.status(201).json(created);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});


usersRouter.patch(
  "/:userId",
  async (request, response) => {
    const input = updateUserInputSchema.safeParse(
      request.body,
    );

    if (!input.success) {
      response.status(400).json({
        error: "Invalid user update",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      /*
       * Lock every currently active administrator in a
       * deterministic order. This serializes competing
       * attempts to remove/deactivate admins and prevents
       * two requests from both observing "another admin".
       */
      const activeAdminResult = await client.query<{
        id: string;
      }>(`
        SELECT u.id
        FROM users u
        JOIN user_roles ur
          ON ur.user_id = u.id
        WHERE u.is_active = true
          AND ur.role_code = 'admin'
        ORDER BY u.id
        FOR UPDATE OF u, ur
      `);

      /*
       * Lock the target user separately. Do not combine
       * row locking with GROUP BY / array_agg.
       */
      const currentResult = await client.query<{
        id: string;
        display_name: string;
        is_active: boolean;
        created_at: Date;
      }>(
        `
          SELECT
            id,
            display_name,
            is_active,
            created_at
          FROM users
          WHERE id = $1
          FOR UPDATE
        `,
        [request.params.userId],
      );

      const currentUser = currentResult.rows[0];

      if (!currentUser) {
        await client.query("ROLLBACK");

        response.status(404).json({
          error: "User not found",
        });
        return;
      }

      const currentRolesResult =
        await client.query<{
          role_code: UserRoleCode;
        }>(
          `
            SELECT role_code
            FROM user_roles
            WHERE user_id = $1
            ORDER BY role_code
          `,
          [currentUser.id],
        );

      const currentRoles =
        currentRolesResult.rows.map(
          (row) => row.role_code,
        );

      const nextIsActive =
        input.data.isActive ??
        currentUser.is_active;

      const nextRoles =
        input.data.roleCodes ?? currentRoles;

      const removesActiveAdmin =
        currentUser.is_active &&
        currentRoles.includes("admin") &&
        (
          !nextIsActive ||
          !nextRoles.includes("admin")
        );

      if (
        removesActiveAdmin &&
        activeAdminResult.rows.length <= 1
      ) {
        await client.query("ROLLBACK");

        response.status(409).json({
          error:
            "Cannot remove the last active administrator",
        });
        return;
      }

      const updatedResult = await client.query<{
        id: string;
        display_name: string;
        is_active: boolean;
        created_at: Date;
      }>(
        `
          UPDATE users
          SET
            display_name =
              COALESCE($2, display_name),
            is_active =
              COALESCE($3, is_active)
          WHERE id = $1
          RETURNING
            id,
            display_name,
            is_active,
            created_at
        `,
        [
          currentUser.id,
          input.data.displayName ?? null,
          input.data.isActive ?? null,
        ],
      );

      const updated = updatedResult.rows[0];

      if (!updated) {
        throw new Error(
          "PostgreSQL did not return the updated user.",
        );
      }

      if (input.data.roleCodes) {
        await client.query(
          `
            DELETE FROM user_roles
            WHERE user_id = $1
          `,
          [currentUser.id],
        );

        for (
          const roleCode of input.data.roleCodes
        ) {
          await client.query(
            `
              INSERT INTO user_roles (
                user_id,
                role_code
              )
              VALUES ($1, $2)
            `,
            [currentUser.id, roleCode],
          );
        }
      }

      if (
        currentUser.is_active &&
        input.data.isActive === false
      ) {
        await client.query(
          `
            UPDATE user_sessions
            SET revoked_at = now()
            WHERE user_id = $1
              AND revoked_at IS NULL
          `,
          [currentUser.id],
        );
      }

      await client.query("COMMIT");

      const result: UserRecord = {
        id: updated.id,
        displayName: updated.display_name,
        isActive: updated.is_active,
        roles: [...nextRoles].sort(),
        hasPin: true,
        createdAt:
          updated.created_at.toISOString(),
      };

      response.json(result);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);


usersRouter.put(
  "/:userId/pin",
  async (request, response) => {
    const input = resetUserPinInputSchema.safeParse(
      request.body,
    );

    if (!input.success) {
      response.status(400).json({
        error: "Invalid password",
        issues: input.error.issues,
      });
      return;
    }

    const pinHash = await hashUserPin(input.data.pin);
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const userResult = await client.query<{
        id: string;
      }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
          FOR UPDATE
        `,
        [request.params.userId],
      );

      const user = userResult.rows[0];

      if (!user) {
        await client.query("ROLLBACK");

        response.status(404).json({
          error: "User not found",
        });
        return;
      }

      await client.query(
        `
          INSERT INTO user_credentials (
            user_id,
            pin_hash
          )
          VALUES ($1, $2)
          ON CONFLICT (user_id)
          DO UPDATE SET
            pin_hash = EXCLUDED.pin_hash,
            failed_attempt_count = 0,
            locked_until = NULL,
            pin_changed_at = now(),
            updated_at = now()
        `,
        [user.id, pinHash],
      );

      await client.query(
        `
          UPDATE user_sessions
          SET revoked_at = now()
          WHERE user_id = $1
            AND revoked_at IS NULL
        `,
        [user.id],
      );

      await client.query(
        `
          INSERT INTO user_auth_events (
            user_id,
            event_type
          )
          VALUES ($1, 'pin_changed')
        `,
        [user.id],
      );

      await client.query("COMMIT");

      response.status(204).end();
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);
