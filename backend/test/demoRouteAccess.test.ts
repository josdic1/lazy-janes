import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

const adminUserId = randomUUID();

afterAll(async () => {
  await deleteAuthenticatedTestUser(adminUserId).catch(() => undefined);
  await pool.end();
});

describe("development route access", () => {
  it("keeps development demo routes unavailable outside development", async () => {
    const agent = await createAuthenticatedTestUser({
      userId: adminUserId,
      displayName: `Development Route Admin ${adminUserId.slice(0, 8)}`,
      roles: ["admin"],
    });

    const response = await agent.post("/api/dev/demo/admin-menu-only");
    expect(response.status).toBe(404);
  });
});
