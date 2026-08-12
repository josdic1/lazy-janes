import {
  createPartyInputSchema,
  seatPartyInputSchema,
  type Party,
  type PartyStatus,
} from "@lazy-janes/shared";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";

type PartyRow = {
  id: string;
  guest_count: number;
  status: PartyStatus;
  created_by_staff_id: string;
  arrived_at: Date;
  status_changed_at: Date;
  completed_at: Date | null;
  cancelled_at: Date | null;
};

const staffIdSchema = z.string().uuid();

const partySelect = `
  SELECT
    id,
    guest_count,
    status,
    created_by_staff_id,
    arrived_at,
    status_changed_at,
    completed_at,
    cancelled_at
  FROM parties
`;

function toParty(row: PartyRow): Party {
  return {
    id: row.id,
    guestCount: row.guest_count,
    status: row.status,
    createdByStaffId: row.created_by_staff_id,
    arrivedAt: row.arrived_at.toISOString(),
    statusChangedAt: row.status_changed_at.toISOString(),
    completedAt: row.completed_at?.toISOString() ?? null,
    cancelledAt: row.cancelled_at?.toISOString() ?? null,
  };
}

export const partiesRouter = Router();

partiesRouter.get("/", async (_request, response) => {
  const result = await pool.query<PartyRow>(`
    ${partySelect}
    ORDER BY arrived_at DESC, id
  `);

  response.json(result.rows.map(toParty));
});

partiesRouter.post("/", async (request, response) => {
  const input = createPartyInputSchema.safeParse(request.body);

  if (!input.success) {
    response.status(400).json({
      error: "Invalid party",
      issues: input.error.issues,
    });
    return;
  }

  const staffId = staffIdSchema.safeParse(
    request.header("x-staff-id"),
  );

  if (!staffId.success) {
    response.status(401).json({
      error: "A valid staff identity is required",
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const staffResult = await client.query<{ id: string }>(
      `
        SELECT id
        FROM staff
        WHERE id = $1
          AND is_active = true
      `,
      [staffId.data],
    );

    if (!staffResult.rows[0]) {
      await client.query("ROLLBACK");
      response.status(403).json({
        error: "Active staff member not found",
      });
      return;
    }

    const partyResult = await client.query<PartyRow>(
      `
        INSERT INTO parties (
          guest_count,
          status,
          created_by_staff_id
        )
        VALUES ($1, 'waiting', $2)
        RETURNING
          id,
          guest_count,
          status,
          created_by_staff_id,
          arrived_at,
          status_changed_at,
          completed_at,
          cancelled_at
      `,
      [input.data.guestCount, staffId.data],
    );

    const party = partyResult.rows[0];

    if (!party) {
      throw new Error("Party insert returned no record");
    }

    await client.query(
      `
        INSERT INTO party_events (
          party_id,
          event_type,
          actor_staff_id
        )
        VALUES ($1, 'arrived', $2)
      `,
      [party.id, staffId.data],
    );

    await client.query("COMMIT");
    response.status(201).json(toParty(party));
  } catch (error: unknown) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

partiesRouter.post(
  "/:partyId/seat",
  async (request, response) => {
    const partyId = z
      .string()
      .uuid()
      .safeParse(request.params.partyId);

    const input = seatPartyInputSchema.safeParse(request.body);

    const staffId = staffIdSchema.safeParse(
      request.header("x-staff-id"),
    );

    if (!partyId.success) {
      response.status(400).json({
        error: "Invalid party ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid seating",
        issues: input.error.issues,
      });
      return;
    }

    if (!staffId.success) {
      response.status(401).json({
        error: "A valid staff identity is required",
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const staffResult = await client.query<{
        id: string;
      }>(
        `
          SELECT id
          FROM staff
          WHERE id = $1
            AND is_active = true
        `,
        [staffId.data],
      );

      if (!staffResult.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active staff member not found",
        });
        return;
      }

      const currentParty = await client.query<{
        status: PartyStatus;
      }>(
        `
          SELECT status
          FROM parties
          WHERE id = $1
          FOR UPDATE
        `,
        [partyId.data],
      );

      const currentStatus = currentParty.rows[0]?.status;

      if (!currentStatus) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Party not found",
        });
        return;
      }

      if (currentStatus !== "waiting") {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only a waiting party can be seated",
        });
        return;
      }

      const tables = await client.query<{ id: string }>(
        `
          SELECT id
          FROM dining_tables
          WHERE id = ANY($1::uuid[])
            AND is_active = true
          FOR UPDATE
        `,
        [input.data.tableIds],
      );

      if (tables.rowCount !== input.data.tableIds.length) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error: "One or more dining tables are unavailable",
        });
        return;
      }

      const seating = await client.query<{ id: string }>(
        `
          INSERT INTO seatings (
            party_id,
            seated_by_staff_id
          )
          VALUES ($1, $2)
          RETURNING id
        `,
        [partyId.data, staffId.data],
      );

      const seatingId = seating.rows[0]?.id;

      if (!seatingId) {
        throw new Error("Seating insert returned no record");
      }

      await client.query(
        `
          INSERT INTO seating_tables (
            seating_id,
            dining_table_id
          )
          SELECT $1, table_id
          FROM unnest($2::uuid[]) AS selected(table_id)
        `,
        [seatingId, input.data.tableIds],
      );

      const updatedParty = await client.query<PartyRow>(
        `
          UPDATE parties
          SET
            status = 'seated',
            status_changed_at = now()
          WHERE id = $1
          RETURNING
            id,
            guest_count,
            status,
            created_by_staff_id,
            arrived_at,
            status_changed_at,
            completed_at,
            cancelled_at
        `,
        [partyId.data],
      );

      const party = updatedParty.rows[0];

      if (!party) {
        throw new Error("Party update returned no record");
      }

      await client.query(
        `
          INSERT INTO party_events (
            party_id,
            event_type,
            actor_staff_id
          )
          VALUES ($1, 'seated', $2)
        `,
        [party.id, staffId.data],
      );

      await client.query("COMMIT");
      response.json(toParty(party));
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
      ) {
        response.status(409).json({
          error: "One or more dining tables are occupied",
        });
        return;
      }

      throw error;
    } finally {
      client.release();
    }
  },
);
