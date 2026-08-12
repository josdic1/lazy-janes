import {
  userIdentitySchema,
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

async function clearSessionTestUsers() {
  await pool.query(`
    DELETE FROM user_auth_events
    WHERE user_id IN (
      SELECT id
      FROM users
      WHERE display_name LIKE 'Session Test%'
    )
  `);

  await pool.query(`
    DELETE FROM users
    WHERE display_name LIKE 'Session Test%'
  `);
}

async function createSessionTestUser() {
  const result = await pool.query<{
    id: string;
  }>(`
    INSERT INTO users (
      display_name
    )
    VALUES ('Session Test Josh')
    RETURNING id
  `);

  const userId = result.rows[0]?.id;

  if (!userId) {
    throw new Error("Session test user was not created.");
  }

  await pool.query(
    `
      INSERT INTO user_roles (
        user_id,
        role_code
      )
      VALUES
        ($1, 'admin'),
        ($1, 'manager')
    `,
    [userId],
  );

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

beforeEach(async () => {
  await clearSessionTestUsers();
});

afterAll(async () => {
  await clearSessionTestUsers();
  await pool.end();
});

describe("authenticated session lifecycle", () => {
  it("rejects /me without a session", async () => {
    const response = await request(createApp()).get(
      "/api/auth/me",
    );

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Authentication required",
    });
  });

  it("resolves the logged-in user from the session cookie", async () => {
    const userId = await createSessionTestUser();
    const agent = request.agent(createApp());

    const login = await agent
      .post("/api/auth/login")
      .send({
        userId,
        pin: "4826",
      });

    expect(login.status).toBe(200);

    const me = await agent.get("/api/auth/me");

    expect(me.status).toBe(200);

    expect(
      userIdentitySchema.parse(me.body),
    ).toEqual({
      id: userId,
      displayName: "Session Test Josh",
      roles: ["admin", "manager"],
    });

    const session = await pool.query<{
      last_seen_at: Date;
      created_at: Date;
    }>(
      `
        SELECT
          last_seen_at,
          created_at
        FROM user_sessions
        WHERE user_id = $1
      `,
      [userId],
    );

    expect(
      session.rows[0]?.last_seen_at.getTime(),
    ).toBeGreaterThanOrEqual(
      session.rows[0]?.created_at.getTime() ?? 0,
    );
  });

  it("revokes the current session on logout", async () => {
    const userId = await createSessionTestUser();
    const agent = request.agent(createApp());

    const login = await agent
      .post("/api/auth/login")
      .send({
        userId,
        pin: "4826",
      });

    expect(login.status).toBe(200);

    const logout = await agent.post(
      "/api/auth/logout",
    );

    expect(logout.status).toBe(204);

    const session = await pool.query<{
      revoked_at: Date | null;
    }>(
      `
        SELECT revoked_at
        FROM user_sessions
        WHERE user_id = $1
      `,
      [userId],
    );

    expect(session.rows[0]?.revoked_at).not.toBeNull();

    const events = await pool.query<{
      event_type: string;
    }>(
      `
        SELECT event_type
        FROM user_auth_events
        WHERE user_id = $1
        ORDER BY id
      `,
      [userId],
    );

    expect(
      events.rows.map((event) => event.event_type),
    ).toEqual([
      "login_succeeded",
      "logout",
    ]);

    const afterLogout = await agent.get(
      "/api/auth/me",
    );

    expect(afterLogout.status).toBe(401);
  });
});
