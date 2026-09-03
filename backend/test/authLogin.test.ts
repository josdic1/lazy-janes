import {
  userIdentitySchema,
  userLoginOptionSchema,
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

async function clearAuthTestUsers() {
  await pool.query(`
    DELETE FROM user_auth_events
    WHERE user_id IN (
      SELECT id
      FROM users
      WHERE display_name LIKE 'Auth Test%'
    )
  `);

  await pool.query(`
    DELETE FROM users
    WHERE display_name LIKE 'Auth Test%'
  `);
}

async function createLoginUser(
  displayName: string,
  pin = "4826",
) {
  const user = await pool.query<{
    id: string;
  }>(
    `
      INSERT INTO users (
        display_name
      )
      VALUES ($1)
      RETURNING id
    `,
    [displayName],
  );

  const userId = user.rows[0]?.id;

  if (!userId) {
    throw new Error("Test user was not created.");
  }

  await pool.query(
    `
      INSERT INTO user_roles (
        user_id,
        role_code
      )
      VALUES
        ($1, 'server'),
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
    [userId, await hashUserPin(pin)],
  );

  return userId;
}

beforeEach(async () => {
  await clearAuthTestUsers();
});

afterAll(async () => {
  await clearAuthTestUsers();
  await pool.end();
});

describe("PIN login", () => {
  it("lists active users with credentials as login options", async () => {
    const userId = await createLoginUser(
      "Auth Test Jane",
    );

    const response = await request(createApp()).get(
      "/api/auth/login-options",
    );

    expect(response.status).toBe(200);

    const option = response.body.find(
      (item: unknown) =>
        userLoginOptionSchema.safeParse(item).success &&
        (item as { id: string }).id === userId,
    );

    expect(option).toEqual({
      id: userId,
      displayName: "Auth Test Jane",
    });
  });

  it("creates an opaque server session for a valid PIN", async () => {
    const userId = await createLoginUser(
      "Auth Test Josh",
    );

    const response = await request(createApp())
      .post("/api/auth/login")
      .send({
        username: "A U T H T E S T J O S H",
        pin: "4826",
      });

    expect(response.status).toBe(200);

    expect(
      userIdentitySchema.parse(response.body),
    ).toEqual({
      id: userId,
      displayName: "Auth Test Josh",
      roles: ["manager", "server"],
    });

    const cookies = response.headers["set-cookie"];

    expect(cookies).toBeTruthy();
    expect(String(cookies)).toContain(
      "lazy_janes_session=",
    );
    expect(String(cookies)).toContain("HttpOnly");
    expect(String(cookies)).toContain(
      "SameSite=Strict",
    );

    const sessions = await pool.query<{
      token_hash: string;
      revoked_at: Date | null;
    }>(
      `
        SELECT
          token_hash,
          revoked_at
        FROM user_sessions
        WHERE user_id = $1
      `,
      [userId],
    );

    expect(sessions.rows).toHaveLength(1);
    expect(sessions.rows[0]?.token_hash).toHaveLength(
      64,
    );
    expect(sessions.rows[0]?.revoked_at).toBeNull();

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

    expect(events.rows.map((event) => event.event_type))
      .toEqual(["login_succeeded"]);
  });

  it("locks the PIN after five failed attempts", async () => {
    const userId = await createLoginUser(
      "Auth Test Locked",
    );

    for (let attempt = 1; attempt <= 4; attempt += 1) {
      const response = await request(createApp())
        .post("/api/auth/login")
        .send({
          userId,
          pin: "1111",
        });

      expect(response.status).toBe(401);
    }

    const fifth = await request(createApp())
      .post("/api/auth/login")
      .send({
        userId,
        pin: "1111",
      });

    expect(fifth.status).toBe(423);

    const credential = await pool.query<{
      locked_until: Date | null;
    }>(
      `
        SELECT locked_until
        FROM user_credentials
        WHERE user_id = $1
      `,
      [userId],
    );

    expect(
      credential.rows[0]?.locked_until?.getTime(),
    ).toBeGreaterThan(Date.now());

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
      events.rows.filter(
        (event) => event.event_type === "login_failed",
      ),
    ).toHaveLength(5);

    expect(events.rows.at(-1)?.event_type).toBe(
      "locked",
    );
  });
});
