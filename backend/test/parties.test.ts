import { randomUUID } from "node:crypto";
import { partySchema } from "@lazy-janes/shared";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";

afterAll(async () => {
  await pool.end();
});

describe("POST /api/parties", () => {
  it("creates a waiting party and records arrival", async () => {
    const staffId = randomUUID();
    let partyId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO staff (id, display_name)
          VALUES ($1, 'Party API Test Host')
        `,
        [staffId],
      );

      const response = await request(createApp())
        .post("/api/parties")
        .set("x-staff-id", staffId)
        .send({ guestCount: 7 });

      expect(response.status).toBe(201);

      const party = partySchema.parse(response.body);
      partyId = party.id;

      expect(party.guestCount).toBe(7);
      expect(party.status).toBe("waiting");
      expect(party.createdByStaffId).toBe(staffId);

      const event = await pool.query<{
        event_type: string;
        actor_staff_id: string;
      }>(
        `
          SELECT event_type, actor_staff_id
          FROM party_events
          WHERE party_id = $1
        `,
        [partyId],
      );

      expect(event.rows).toEqual([
        {
          event_type: "arrived",
          actor_staff_id: staffId,
        },
      ]);
    } finally {
      if (partyId) {
        await pool.query(
          "DELETE FROM party_events WHERE party_id = $1",
          [partyId],
        );

        await pool.query(
          "DELETE FROM parties WHERE id = $1",
          [partyId],
        );
      }

      await pool.query(
        "DELETE FROM staff WHERE id = $1",
        [staffId],
      );
    }
  });
});
