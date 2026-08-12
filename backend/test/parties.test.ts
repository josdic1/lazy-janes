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

describe("POST /api/parties/:partyId/seat", () => {
  it("seats one party and rejects an occupied table", async () => {
    const staffId = randomUUID();
    const sectionId = randomUUID();
    const tableId = randomUUID();
    const firstPartyId = randomUUID();
    const secondPartyId = randomUUID();

    try {
      await pool.query(
        `
          INSERT INTO staff (id, display_name)
          VALUES ($1, 'Seating Test Host')
        `,
        [staffId],
      );

      await pool.query(
        `
          INSERT INTO sections (id, name)
          VALUES ($1, $2)
        `,
        [sectionId, `Test Section ${sectionId}`],
      );

      await pool.query(
        `
          INSERT INTO dining_tables (
            id,
            section_id,
            label,
            capacity
          )
          VALUES ($1, $2, 'T1', 4)
        `,
        [tableId, sectionId],
      );

      await pool.query(
        `
          INSERT INTO parties (
            id,
            guest_count,
            status,
            created_by_staff_id
          )
          VALUES
            ($1, 4, 'waiting', $3),
            ($2, 2, 'waiting', $3)
        `,
        [firstPartyId, secondPartyId, staffId],
      );

      const firstResponse = await request(createApp())
        .post(`/api/parties/${firstPartyId}/seat`)
        .set("x-staff-id", staffId)
        .send({ tableIds: [tableId] });

      const secondResponse = await request(createApp())
        .post(`/api/parties/${secondPartyId}/seat`)
        .set("x-staff-id", staffId)
        .send({ tableIds: [tableId] });

      expect(firstResponse.status).toBe(200);
      expect(firstResponse.body.status).toBe("seated");

      expect(secondResponse.status).toBe(409);
      expect(secondResponse.body.error).toBe(
        "One or more dining tables are occupied",
      );

      const parties = await pool.query<{
        id: string;
        status: string;
      }>(
        `
          SELECT id, status
          FROM parties
          WHERE id = ANY($1::uuid[])
          ORDER BY id
        `,
        [[firstPartyId, secondPartyId]],
      );

      expect(
        parties.rows.find(
          (party) => party.id === firstPartyId,
        )?.status,
      ).toBe("seated");

      expect(
        parties.rows.find(
          (party) => party.id === secondPartyId,
        )?.status,
      ).toBe("waiting");
    } finally {
      await pool.query(
        `
          DELETE FROM seating_tables
          WHERE seating_id IN (
            SELECT id
            FROM seatings
            WHERE party_id = ANY($1::uuid[])
          )
        `,
        [[firstPartyId, secondPartyId]],
      );

      await pool.query(
        "DELETE FROM seatings WHERE party_id = ANY($1::uuid[])",
        [[firstPartyId, secondPartyId]],
      );

      await pool.query(
        "DELETE FROM party_events WHERE party_id = ANY($1::uuid[])",
        [[firstPartyId, secondPartyId]],
      );

      await pool.query(
        "DELETE FROM parties WHERE id = ANY($1::uuid[])",
        [[firstPartyId, secondPartyId]],
      );

      await pool.query(
        "DELETE FROM dining_tables WHERE id = $1",
        [tableId],
      );

      await pool.query(
        "DELETE FROM sections WHERE id = $1",
        [sectionId],
      );

      await pool.query(
        "DELETE FROM staff WHERE id = $1",
        [staffId],
      );
    }
  });
});
