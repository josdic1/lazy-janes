import {
  userRecordSchema,
  type UserRoleCode,
} from "@lazy-janes/shared";
import request from "supertest";
import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { hashUserPin } from "../src/auth/security.js";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";

async function clearUsersTestUsers() {
  await pool.query(`
    DELETE FROM user_auth_events
    WHERE user_id IN (
      SELECT id
      FROM users
      WHERE display_name LIKE 'Users Test%'
    )
  `);

  await pool.query(`
    DELETE FROM users
    WHERE display_name LIKE 'Users Test%'
  `);
}

async function createTestUser(
  displayName: string,
  roles: UserRoleCode[],
) {
  const result = await pool.query<{ id: string }>(
    `
      INSERT INTO users (
        display_name
      )
      VALUES ($1)
      RETURNING id
    `,
    [displayName],
  );

  const userId = result.rows[0]?.id;

  if (!userId) {
    throw new Error("Users test user was not created.");
  }

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
    [userId, await hashUserPin("4826")],
  );

  return userId;
}

async function loginAs(
  agent: ReturnType<typeof request.agent>,
  userId: string,
) {
  const response = await agent
    .post("/api/auth/login")
    .send({
      userId,
      pin: "4826",
    });

  expect(response.status).toBe(200);
}

beforeEach(async () => {
  await clearUsersTestUsers();
});

afterAll(async () => {
  await clearUsersTestUsers();
  await pool.end();
});

describe("admin user management authorization", () => {
  it("rejects unauthenticated access", async () => {
    const response = await request(createApp()).get(
      "/api/users",
    );

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Authentication required",
    });
  });

  it("rejects an authenticated user without the admin role", async () => {
    const userId = await createTestUser(
      "Users Test Server",
      ["server"],
    );

    const agent = request.agent(createApp());

    await loginAs(agent, userId);

    const response = await agent.get("/api/users");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "Permission denied",
    });
  });

  it("allows an administrator to list users", async () => {
    const adminId = await createTestUser(
      "Users Test Admin",
      ["admin", "manager"],
    );

    const serverId = await createTestUser(
      "Users Test Jane",
      ["server"],
    );

    const agent = request.agent(createApp());

    await loginAs(agent, adminId);

    const response = await agent.get("/api/users");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.users)).toBe(true);

    const users = response.body.users.map(
      (user: unknown) => userRecordSchema.parse(user),
    );

    expect(
      users.find((user) => user.id === adminId),
    ).toMatchObject({
      displayName: "Users Test Admin",
      isActive: true,
      roles: ["admin", "manager"],
      hasPin: true,
    });

    expect(
      users.find((user) => user.id === serverId),
    ).toMatchObject({
      displayName: "Users Test Jane",
      isActive: true,
      roles: ["server"],
      hasPin: true,
    });
  });
});
