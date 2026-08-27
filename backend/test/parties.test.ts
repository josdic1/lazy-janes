import { randomUUID } from "node:crypto";
import {
  diningRoomSectionSchema,
  diningTableOptionSchema,
  diningTableRecordSchema,
  partySchema,
} from "@lazy-janes/shared";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { hashUserPin } from "../src/auth/security.js";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";

const TEST_PIN = "4826";

async function createAuthenticatedUser(
  userId: string,
  displayName: string,
  roleCode: "host" | "manager",
) {
  await pool.query(
    `
      INSERT INTO users (
        id,
        display_name
      )
      VALUES ($1, $2)
    `,
    [userId, displayName],
  );

  await pool.query(
    `
      INSERT INTO user_roles (
        user_id,
        role_code
      )
      VALUES ($1, $2)
    `,
    [userId, roleCode],
  );

  await pool.query(
    `
      INSERT INTO user_credentials (
        user_id,
        pin_hash
      )
      VALUES ($1, $2)
    `,
    [userId, await hashUserPin(TEST_PIN)],
  );

  const agent = request.agent(createApp());

  const login = await agent
    .post("/api/auth/login")
    .send({
      userId,
      pin: TEST_PIN,
    });

  expect(login.status).toBe(200);

  return agent;
}

async function createAuthenticatedHost(
  userId: string,
  displayName: string,
) {
  return createAuthenticatedUser(userId, displayName, "host");
}

async function createAuthenticatedManager(
  userId: string,
  displayName: string,
) {
  return createAuthenticatedUser(userId, displayName, "manager");
}

async function deleteAuthenticatedUser(
  userId: string,
) {
  await pool.query(
    `
      DELETE FROM user_auth_events
      WHERE user_id = $1
    `,
    [userId],
  );

  await pool.query(
    "DELETE FROM users WHERE id = $1",
    [userId],
  );
}

afterAll(async () => {
  await pool.end();
});

describe("POST /api/parties", () => {
  it("creates a waiting party and records arrival", async () => {
    const userId = randomUUID();
    let partyId: string | undefined;

    try {
      const agent = await createAuthenticatedHost(
        userId,
        "Party API Test Host",
      );

      const response = await agent
        .post("/api/parties")
                .send({ name: "Dicker", guestCount: 7 });

      expect(response.status).toBe(201);

      const party = partySchema.parse(response.body);
      partyId = party.id;

      expect(party.name).toBe("Dicker");
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

      await deleteAuthenticatedUser(userId);
    }
  });
});

describe("dining room management", () => {
  it("creates each room once and adds tables by room ID", async () => {
    const userId = randomUUID();
    let roomId: string | undefined;
    let tableId: string | undefined;
    const roomName = `Main Room ${randomUUID()}`;

    try {
      const agent = await createAuthenticatedManager(
        userId,
        "Dining Room Test Manager",
      );

      const roomResponse = await agent
        .post("/api/parties/sections/manage")
        .send({ name: roomName });

      expect(roomResponse.status).toBe(201);
      const room = diningRoomSectionSchema.parse(roomResponse.body);
      roomId = room.id;
      expect(room.name).toBe(roomName);

      const duplicateResponse = await agent
        .post("/api/parties/sections/manage")
        .send({ name: roomName.toUpperCase() });

      expect(duplicateResponse.status).toBe(409);
      expect(duplicateResponse.body.error).toBe(
        "That room already exists",
      );

      const roomsResponse = await agent.get(
        "/api/parties/sections/manage",
      );
      expect(roomsResponse.status).toBe(200);
      const rooms = diningRoomSectionSchema.array().parse(
        roomsResponse.body,
      );
      expect(rooms.some((candidate) => candidate.id === room.id)).toBe(true);

      const tableResponse = await agent
        .post("/api/parties/tables/manage")
        .send({
          sectionId: room.id,
          label: "1",
          capacity: 4,
        });

      expect(tableResponse.status).toBe(201);
      const table = diningTableRecordSchema.parse(tableResponse.body);
      tableId = table.id;
      expect(table).toMatchObject({
        sectionId: room.id,
        sectionName: roomName,
        label: "1",
        capacity: 4,
      });
      expect(table.floorX % 5).toBe(0);
      expect(table.floorY % 5).toBe(0);
    } finally {
      if (tableId) {
        await pool.query(
          "DELETE FROM dining_tables WHERE id = $1",
          [tableId],
        );
      }

      if (roomId) {
        await pool.query(
          "DELETE FROM sections WHERE id = $1",
          [roomId],
        );
      }

      await deleteAuthenticatedUser(userId);
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
      const agent = await createAuthenticatedHost(
        userId,
        "Seating Test Host",
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

      const floorResponse = await agent.get("/api/parties/tables");
      expect(floorResponse.status).toBe(200);
      const floorTables = diningTableOptionSchema.array().parse(floorResponse.body);
      const floorTable = floorTables.find((table) => table.id === tableId);
      expect(floorTable).toMatchObject({
        id: tableId,
        label: "T1",
        capacity: 4,
        floorX: 8,
        floorY: 10,
        occupied: false,
      });

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

      const firstResponse = await agent
        .post(`/api/parties/${firstPartyId}/seat`)
                .send({ tableIds: [tableId] });

      const secondResponse = await agent
        .post(`/api/parties/${secondPartyId}/seat`)
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

      await deleteAuthenticatedUser(userId);
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
      const agent = await createAuthenticatedHost(
        userId,
        "Party Cancellation Test Host",
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

      const blocked = await agent
        .post(`/api/parties/${partyId}/cancel`)
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

      const response = await agent
        .post(`/api/parties/${partyId}/cancel`)
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

      await deleteAuthenticatedUser(userId);
    }
  });
});
