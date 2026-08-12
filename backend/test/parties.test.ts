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
    const userId = randomUUID();
    let partyId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO users (id, display_name)
          VALUES ($1, 'Party API Test Host')
        `,
        [userId],
      );

      const response = await request(createApp())
        .post("/api/parties")
        .set("x-user-id", userId)
        .send({ guestCount: 7 });

      expect(response.status).toBe(201);

      const party = partySchema.parse(response.body);
      partyId = party.id;

      expect(party.guestCount).toBe(7);
      expect(party.status).toBe("waiting");
      expect(party.createdByUserId).toBe(userId);

      const event = await pool.query<{
        event_type: string;
        actor_user_id: string;
      }>(
        `
          SELECT event_type, actor_user_id
          FROM party_events
          WHERE party_id = $1
        `,
        [partyId],
      );

      expect(event.rows).toEqual([
        {
          event_type: "arrived",
          actor_user_id: userId,
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
        "DELETE FROM users WHERE id = $1",
        [userId],
      );
    }
  });
});

describe("POST /api/parties/:partyId/seat", () => {
  it("seats one party and rejects an occupied table", async () => {
    const userId = randomUUID();
    const sectionId = randomUUID();
    const tableId = randomUUID();
    const firstPartyId = randomUUID();
    const secondPartyId = randomUUID();

    try {
      await pool.query(
        `
          INSERT INTO users (id, display_name)
          VALUES ($1, 'Seating Test Host')
        `,
        [userId],
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
            created_by_user_id
          )
          VALUES
            ($1, 4, 'waiting', $3),
            ($2, 2, 'waiting', $3)
        `,
        [firstPartyId, secondPartyId, userId],
      );

      const firstResponse = await request(createApp())
        .post(`/api/parties/${firstPartyId}/seat`)
        .set("x-user-id", userId)
        .send({ tableIds: [tableId] });

      const secondResponse = await request(createApp())
        .post(`/api/parties/${secondPartyId}/seat`)
        .set("x-user-id", userId)
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
        "DELETE FROM users WHERE id = $1",
        [userId],
      );
    }
  });
});

describe("POST /api/parties/:partyId/cancel", () => {
  it("preserves the reason and releases the table", async () => {
    const userId = randomUUID();
    const sectionId = randomUUID();
    const tableId = randomUUID();
    const partyId = randomUUID();
    const seatingId = randomUUID();
    const seatingTableId = randomUUID();
    const orderId = randomUUID();

    try {
      await pool.query(
        `
          INSERT INTO users (id, display_name)
          VALUES ($1, 'Party Cancellation Test Host')
        `,
        [userId],
      );

      await pool.query(
        `
          INSERT INTO sections (id, name)
          VALUES ($1, $2)
        `,
        [sectionId, `Cancel Test ${sectionId}`],
      );

      await pool.query(
        `
          INSERT INTO dining_tables (
            id,
            section_id,
            label,
            capacity
          )
          VALUES ($1, $2, $3, 4)
        `,
        [tableId, sectionId, `Cancel ${tableId}`],
      );

      await pool.query(
        `
          INSERT INTO parties (
            id,
            guest_count,
            status,
            created_by_user_id
          )
          VALUES ($1, 2, 'seated', $2)
        `,
        [partyId, userId],
      );

      await pool.query(
        `
          INSERT INTO seatings (
            id,
            party_id,
            seated_by_user_id
          )
          VALUES ($1, $2, $3)
        `,
        [seatingId, partyId, userId],
      );

      await pool.query(
        `
          INSERT INTO seating_tables (
            id,
            seating_id,
            dining_table_id
          )
          VALUES ($1, $2, $3)
        `,
        [seatingTableId, seatingId, tableId],
      );

      await pool.query(
        `
          INSERT INTO orders (
            id,
            party_id,
            fulfillment_type,
            created_by_user_id
          )
          VALUES ($1, $2, 'dine_in', $3)
        `,
        [orderId, partyId, userId],
      );

      const blocked = await request(createApp())
        .post(`/api/parties/${partyId}/cancel`)
        .set("x-user-id", userId)
        .send({
          reason: "Party left",
        });

      expect(blocked.status).toBe(409);
      expect(blocked.body.error).toBe(
        "Cancel the party's active orders before cancelling the party",
      );

      await pool.query(
        "DELETE FROM orders WHERE id = $1",
        [orderId],
      );

      const response = await request(createApp())
        .post(`/api/parties/${partyId}/cancel`)
        .set("x-user-id", userId)
        .send({
          reason: "Party left before ordering",
        });

      expect(response.status).toBe(200);

      const party = partySchema.parse(response.body);

      expect(party.status).toBe("cancelled");
      expect(party.cancelledAt).not.toBeNull();
      expect(party.cancelledByUserId).toBe(userId);
      expect(party.cancellationReason).toBe(
        "Party left before ordering",
      );

      const seating = await pool.query<{
        ended_at: Date | null;
        released_at: Date | null;
      }>(
        `
          SELECT
            seatings.ended_at,
            seating_tables.released_at
          FROM seatings
          JOIN seating_tables
            ON seating_tables.seating_id = seatings.id
          WHERE seatings.id = $1
        `,
        [seatingId],
      );

      expect(seating.rows[0]?.ended_at).not.toBeNull();
      expect(seating.rows[0]?.released_at).not.toBeNull();

      const event = await pool.query<{
        event_type: string;
        actor_user_id: string | null;
        reason: string | null;
      }>(
        `
          SELECT event_type, actor_user_id, reason
          FROM party_events
          WHERE party_id = $1
        `,
        [partyId],
      );

      expect(event.rows).toEqual([
        {
          event_type: "cancelled",
          actor_user_id: userId,
          reason: "Party left before ordering",
        },
      ]);
    } finally {
      await pool.query(
        "DELETE FROM orders WHERE id = $1",
        [orderId],
      );

      await pool.query(
        "DELETE FROM party_events WHERE party_id = $1",
        [partyId],
      );

      await pool.query(
        "DELETE FROM seating_tables WHERE seating_id = $1",
        [seatingId],
      );

      await pool.query(
        "DELETE FROM seatings WHERE id = $1",
        [seatingId],
      );

      await pool.query(
        "DELETE FROM parties WHERE id = $1",
        [partyId],
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
        "DELETE FROM users WHERE id = $1",
        [userId],
      );
    }
  });
});
