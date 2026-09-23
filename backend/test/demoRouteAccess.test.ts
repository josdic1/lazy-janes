import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

const adminUserId = randomUUID();
const secondaryAdminUserId = randomUUID();

afterAll(async () => {
  await deleteAuthenticatedTestUser(adminUserId).catch(() => undefined);
  await deleteAuthenticatedTestUser(secondaryAdminUserId).catch(() => undefined);
  await pool.end();
});

describe("demo route access", () => {
  it("keeps admin demo controls available outside development", async () => {
    const agent = await createAuthenticatedTestUser({
      userId: adminUserId,
      displayName: "Demo Route Admin",
      roles: ["admin"],
    });

    const response = await agent.post("/api/dev/demo/not-a-real-preset");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Unknown demo preset" });
  });

  it("keeps development login unavailable outside development", async () => {
    const agent = await createAuthenticatedTestUser({
      userId: secondaryAdminUserId,
      displayName: "Temporary Admin",
      roles: ["admin"],
    });

    const response = await agent.post("/api/dev/login").send({
      userId: adminUserId,
    });

    expect(response.status).toBe(404);
  });
});
