import { randomUUID } from "node:crypto";
import { drawerSessionSchema } from "@lazy-janes/shared";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";

afterAll(async () => {
  await pool.end();
});

describe("register API", () => {
  it("opens, reports, and closes the cash drawer", async () => {
    const staffId = randomUUID();
    let drawerSessionId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO staff (id, display_name)
          VALUES ($1, 'Register Test Staff')
        `,
        [staffId],
      );

      const initiallyClosed = await request(createApp())
        .get("/api/register/current")
        .set("x-staff-id", staffId);

      expect(initiallyClosed.status).toBe(200);
      expect(initiallyClosed.body).toBeNull();

      const opened = await request(createApp())
        .post("/api/register/open")
        .set("x-staff-id", staffId)
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

      const duplicate = await request(createApp())
        .post("/api/register/open")
        .set("x-staff-id", staffId)
        .send({
          openingCashAmount: 100,
        });

      expect(duplicate.status).toBe(409);
      expect(duplicate.body.error).toBe(
        "A drawer is already open",
      );

      const current = await request(createApp())
        .get("/api/register/current")
        .set("x-staff-id", staffId);

      expect(current.status).toBe(200);
      expect(
        drawerSessionSchema.parse(current.body).id,
      ).toBe(drawerSessionId);

      const closed = await request(createApp())
        .post("/api/register/close")
        .set("x-staff-id", staffId)
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
      expect(closedDrawer.closedByStaffId).toBe(staffId);
      expect(closedDrawer.closedAt).not.toBeNull();

      const afterClose = await request(createApp())
        .get("/api/register/current")
        .set("x-staff-id", staffId);

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

      await pool.query(
        "DELETE FROM staff WHERE id = $1",
        [staffId],
      );
    }
  });
});
