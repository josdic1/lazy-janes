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

    const response = await agent.get("/api/dev/demo");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("activeRun");
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
