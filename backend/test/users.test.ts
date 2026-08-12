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
import {
  hashUserPin,
  verifyUserPin,
} from "../src/auth/security.js";
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

  it("allows an administrator to create a user with roles and a hashed PIN", async () => {
    const adminId = await createTestUser(
      "Users Test Admin Create",
      ["admin"],
    );

    const agent = request.agent(createApp());

    await loginAs(agent, adminId);

    const response = await agent
      .post("/api/users")
      .send({
        displayName: "Users Test New Server",
        roleCodes: ["server", "lead_server"],
        pin: "7391",
      });

    expect(response.status).toBe(201);

    const created = userRecordSchema.parse(
      response.body,
    );

    expect(created).toMatchObject({
      displayName: "Users Test New Server",
      isActive: true,
      roles: ["lead_server", "server"],
      hasPin: true,
    });

    const credential = await pool.query<{
      pin_hash: string;
    }>(
      `
        SELECT pin_hash
        FROM user_credentials
        WHERE user_id = $1
      `,
      [created.id],
    );

    const pinHash = credential.rows[0]?.pin_hash;

    expect(pinHash).toBeTruthy();
    expect(pinHash).not.toContain("7391");

    await expect(
      verifyUserPin("7391", pinHash ?? ""),
    ).resolves.toBe(true);
  });

  it("allows an administrator to edit a user and revoke sessions on deactivation", async () => {
    const adminId = await createTestUser(
      "Users Test Admin Edit",
      ["admin"],
    );

    const targetId = await createTestUser(
      "Users Test Editable",
      ["server"],
    );

    const targetAgent = request.agent(createApp());
    await loginAs(targetAgent, targetId);

    const adminAgent = request.agent(createApp());
    await loginAs(adminAgent, adminId);

    const response = await adminAgent
      .patch(`/api/users/${targetId}`)
      .send({
        displayName: "Users Test Edited",
        isActive: false,
        roleCodes: ["manager"],
      });

    expect(response.status).toBe(200);

    expect(
      userRecordSchema.parse(response.body),
    ).toMatchObject({
      id: targetId,
      displayName: "Users Test Edited",
      isActive: false,
      roles: ["manager"],
    });

    const session = await pool.query<{
      revoked_at: Date | null;
    }>(
      `
        SELECT revoked_at
        FROM user_sessions
        WHERE user_id = $1
      `,
      [targetId],
    );

    expect(
      session.rows[0]?.revoked_at,
    ).not.toBeNull();

    const me = await targetAgent.get(
      "/api/auth/me",
    );

    expect(me.status).toBe(401);
  });

  it("refuses to remove the last active administrator", async () => {
    const adminId = await createTestUser(
      "Users Test Last Admin",
      ["admin"],
    );

    const agent = request.agent(createApp());
    await loginAs(agent, adminId);

    const response = await agent
      .patch(`/api/users/${adminId}`)
      .send({
        roleCodes: ["manager"],
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error:
        "Cannot remove the last active administrator",
    });

    const roles = await pool.query<{
      role_code: string;
    }>(
      `
        SELECT role_code
        FROM user_roles
        WHERE user_id = $1
      `,
      [adminId],
    );

    expect(
      roles.rows.map((row) => row.role_code),
    ).toEqual(["admin"]);
  });

  it("allows an administrator to reset a user PIN and revokes existing sessions", async () => {
    const adminId = await createTestUser(
      "Users Test Admin PIN",
      ["admin"],
    );

    const targetId = await createTestUser(
      "Users Test PIN Target",
      ["server"],
    );

    const targetAgent = request.agent(createApp());
    await loginAs(targetAgent, targetId);

    await pool.query(
      `
        UPDATE user_credentials
        SET
          failed_attempt_count = 3,
          locked_until = now() + interval '5 minutes'
        WHERE user_id = $1
      `,
      [targetId],
    );

    const adminAgent = request.agent(createApp());
    await loginAs(adminAgent, adminId);

    const response = await adminAgent
      .put(`/api/users/${targetId}/pin`)
      .send({
        pin: "7391",
      });

    expect(response.status).toBe(204);

    const credential = await pool.query<{
      pin_hash: string;
      failed_attempt_count: number;
      locked_until: Date | null;
    }>(
      `
        SELECT
          pin_hash,
          failed_attempt_count,
          locked_until
        FROM user_credentials
        WHERE user_id = $1
      `,
      [targetId],
    );

    const row = credential.rows[0];

    expect(row).toBeTruthy();

    await expect(
      verifyUserPin("7391", row?.pin_hash ?? ""),
    ).resolves.toBe(true);

    await expect(
      verifyUserPin("4826", row?.pin_hash ?? ""),
    ).resolves.toBe(false);

    expect(row?.failed_attempt_count).toBe(0);
    expect(row?.locked_until).toBeNull();

    const sessions = await pool.query<{
      revoked_at: Date | null;
    }>(
      `
        SELECT revoked_at
        FROM user_sessions
        WHERE user_id = $1
      `,
      [targetId],
    );

    expect(
      sessions.rows.every(
        (session) => session.revoked_at !== null,
      ),
    ).toBe(true);

    const events = await pool.query<{
      event_type: string;
    }>(
      `
        SELECT event_type
        FROM user_auth_events
        WHERE user_id = $1
        ORDER BY id
      `,
      [targetId],
    );

    expect(events.rows.at(-1)?.event_type).toBe(
      "pin_changed",
    );

    const oldSession = await targetAgent.get(
      "/api/auth/me",
    );

    expect(oldSession.status).toBe(401);
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
