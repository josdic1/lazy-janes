import { randomUUID } from "node:crypto";
import { drawerSessionSchema } from "@lazy-janes/shared";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

afterAll(async () => {
  await pool.end();
});

describe("register API", () => {
  it("opens, reports, and closes the cash drawer", async () => {
    const userId = randomUUID();
    let drawerSessionId: string | undefined;

    try {
      const agent =
        await createAuthenticatedTestUser({
          userId,
          displayName: "Register Test Manager",
          roles: ["manager"],
        });

      const initiallyClosed = await agent
        .get("/api/register/current");

      expect(initiallyClosed.status).toBe(200);
      expect(initiallyClosed.body).toBeNull();

      const opened = await agent
        .post("/api/register/open")
        .send({
          openingCashAmount: 150,
        });

      expect(opened.status).toBe(201);

      const openDrawer = drawerSessionSchema.parse(
        opened.body,
      );
      drawerSessionId = openDrawer.id;

      expect(openDrawer.openingCashAmount).toBe(150);
      expect(openDrawer.closedAt).toBeNull();

      const duplicate = await agent
        .post("/api/register/open")
        .send({
          openingCashAmount: 100,
        });

      expect(duplicate.status).toBe(409);
      expect(duplicate.body.error).toBe(
        "A drawer is already open",
      );

      const current = await agent
        .get("/api/register/current");

      expect(current.status).toBe(200);
      expect(
        drawerSessionSchema.parse(current.body).id,
      ).toBe(drawerSessionId);

      const closed = await agent
        .post("/api/register/close")
        .send({
          countedCashAmount: 149.5,
        });

      expect(closed.status).toBe(200);

      const closedDrawer = drawerSessionSchema.parse(
        closed.body,
      );

      expect(closedDrawer.expectedCashAmount).toBe(150);
      expect(closedDrawer.countedCashAmount).toBe(149.5);
      expect(closedDrawer.varianceAmount).toBe(-0.5);
      expect(closedDrawer.closedByUserId).toBe(userId);
      expect(closedDrawer.closedAt).not.toBeNull();

      const afterClose = await agent
        .get("/api/register/current");

      expect(afterClose.status).toBe(200);
      expect(afterClose.body).toBeNull();

      const events = await pool.query<{
        event_type: string;
      }>(
        `
          SELECT event_type
          FROM drawer_events
          WHERE drawer_session_id = $1
          ORDER BY occurred_at, id
        `,
        [drawerSessionId],
      );

      expect(
        events.rows.map((event) => event.event_type),
      ).toEqual([
        "opened",
        "counted",
        "counted",
        "closed",
      ]);
    } finally {
      if (drawerSessionId) {
        await pool.query(
          `
            DELETE FROM drawer_events
            WHERE drawer_session_id = $1
          `,
          [drawerSessionId],
        );

        await pool.query(
          `
            DELETE FROM cash_counts
            WHERE drawer_session_id = $1
          `,
          [drawerSessionId],
        );

        await pool.query(
          `
            DELETE FROM drawer_sessions
            WHERE id = $1
          `,
          [drawerSessionId],
        );
      }

      await deleteAuthenticatedTestUser(userId);
    }
  });
});
