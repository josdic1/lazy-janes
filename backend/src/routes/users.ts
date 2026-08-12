import type {
  UserRecord,
  UserRoleCode,
} from "@lazy-janes/shared";
import { Router } from "express";
import {
  requireAuthenticatedUser,
  requireRole,
} from "../auth/session.js";
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
