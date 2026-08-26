import {
  authSetupStatusSchema,
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
import { verifyUserPin } from "../src/auth/security.js";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";

beforeEach(async () => {
  await pool.query(`
    TRUNCATE TABLE users CASCADE
  `);
});

afterAll(async () => {
  await pool.query(`
    TRUNCATE TABLE users CASCADE
  `);

  await pool.end();
});

describe("initial administrator setup", () => {
  it("reports setup required only while no users exist", async () => {
    const before = await request(createApp()).get(
      "/api/auth/setup",
    );

    expect(before.status).toBe(200);
    expect(
      authSetupStatusSchema.parse(before.body),
    ).toEqual({
      requiresSetup: true,
    });

    const created = await request(createApp())
      .post("/api/auth/setup")
      .send({
        displayName: "Josh",
        pin: "4826",
      });

    expect(created.status).toBe(201);

    const identity = userIdentitySchema.parse(
      created.body,
    );

    expect(identity.displayName).toBe("Josh");
    expect(identity.roles).toEqual(["admin"]);

    const after = await request(createApp()).get(
      "/api/auth/setup",
    );

    expect(after.status).toBe(200);
    expect(
      authSetupStatusSchema.parse(after.body),
    ).toEqual({
      requiresSetup: false,
    });
  });

  it("stores a hashed PIN and refuses a second initial admin", async () => {
    const first = await request(createApp())
      .post("/api/auth/setup")
      .send({
        displayName: "Josh",
        pin: "4826",
      });

    expect(first.status).toBe(201);

    const identity = userIdentitySchema.parse(
      first.body,
    );

    const credential = await pool.query<{
      pin_hash: string;
    }>(
      `
        SELECT pin_hash
        FROM user_credentials
        WHERE user_id = $1
      `,
      [identity.id],
    );

    const pinHash = credential.rows[0]?.pin_hash;

    expect(pinHash).toBeTruthy();
    expect(pinHash).not.toContain("4826");
    await expect(
      verifyUserPin("4826", pinHash ?? ""),
    ).resolves.toBe(true);

    const second = await request(createApp())
      .post("/api/auth/setup")
      .send({
        displayName: "Someone Else",
        pin: "1111",
      });

    expect(second.status).toBe(409);
    expect(second.body).toEqual({
      error: "Initial administrator already exists",
    });

    const users = await pool.query<{ count: string }>(`
      SELECT count(*) AS count
      FROM users
    `);

    expect(Number(users.rows[0]?.count)).toBe(1);
  });
});
