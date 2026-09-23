import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

const adminUserId = randomUUID();
const nonAdminUserId = randomUUID();
const devAdminUserId = randomUUID();

afterAll(async () => {
  await deleteAuthenticatedTestUser(adminUserId).catch(() => undefined);
  await deleteAuthenticatedTestUser(nonAdminUserId).catch(() => undefined);
  await deleteAuthenticatedTestUser(devAdminUserId).catch(() => undefined);
  await pool.end();
});

describe("admin seed data access", () => {
  it("keeps production seed controls available to admins", async () => {
    const agent = await createAuthenticatedTestUser({
      userId: adminUserId,
      displayName: "Seed Data Admin",
      roles: ["admin"],
    });

    const response = await agent.post("/api/admin-data/preload/not-real");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Unknown preload" });
  });

  it("rejects seed controls for non-admin users", async () => {
    const agent = await createAuthenticatedTestUser({
      userId: nonAdminUserId,
      displayName: "Seed Data Server",
      roles: ["server"],
    });

    const response = await agent.post("/api/admin-data/preload/menu");

    expect(response.status).toBe(403);
  });

  it("keeps development login unavailable outside development", async () => {
    const agent = await createAuthenticatedTestUser({
      userId: devAdminUserId,
      displayName: "Development Login Admin",
      roles: ["admin"],
    });

    const response = await agent.post("/api/dev/login").send({
      userId: devAdminUserId,
    });

    expect(response.status).toBe(404);
  });
});
