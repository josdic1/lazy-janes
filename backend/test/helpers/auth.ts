import type {
  UserRoleCode,
} from "@lazy-janes/shared";
import request from "supertest";
import { hashUserPin } from "../../src/auth/security.js";
import { createApp } from "../../src/app.js";
import { pool } from "../../src/db/pool.js";

const TEST_PIN = "4826";

type CreateAuthenticatedTestUserInput = {
  userId: string;
  displayName: string;
  roles: UserRoleCode[];
};

export async function createAuthenticatedTestUser({
  userId,
  displayName,
  roles,
}: CreateAuthenticatedTestUserInput) {
  await pool.query(
    `
      INSERT INTO users (
        id,
        display_name
      )
      VALUES ($1, $2)
    `,
    [userId, displayName],
  );

  for (const role of roles) {
    await pool.query(
      `
        INSERT INTO user_roles (
          user_id,
          role_code
        )
        VALUES ($1, $2)
      `,
      [userId, role],
    );
  }

  await pool.query(
    `
      INSERT INTO user_credentials (
        user_id,
        pin_hash
      )
      VALUES ($1, $2)
    `,
    [userId, await hashUserPin(TEST_PIN)],
  );

  const agent = request.agent(createApp());

  const login = await agent
    .post("/api/auth/login")
    .send({
      userId,
      pin: TEST_PIN,
    });

  if (login.status !== 200) {
    throw new Error(
      `Test login failed with status ${login.status}`,
    );
  }

  return agent;
}

export async function deleteAuthenticatedTestUser(
  userId: string,
) {
  await pool.query(
    `
      DELETE FROM user_auth_events
      WHERE user_id = $1
    `,
    [userId],
  );

  await pool.query(
    `
      DELETE FROM users
      WHERE id = $1
    `,
    [userId],
  );
}
