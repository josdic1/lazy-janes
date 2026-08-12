import {
  cancelPartyInputSchema,
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
  cancelled_by_staff_id: string | null;
  cancellation_reason: string | null;
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
    cancelled_at,
    cancelled_by_staff_id,
    cancellation_reason
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
    cancelledByStaffId: row.cancelled_by_staff_id,
    cancellationReason: row.cancellation_reason,
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
          cancelled_at,
          cancelled_by_staff_id,
          cancellation_reason
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
            cancelled_at,
            cancelled_by_staff_id,
            cancellation_reason
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

partiesRouter.post(
  "/:partyId/cancel",
  async (request, response) => {
    const partyId = z
      .string()
      .uuid()
      .safeParse(request.params.partyId);
    const input = cancelPartyInputSchema.safeParse(
      request.body,
    );
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
        error: "Invalid cancellation",
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

      const staff = await client.query<{ id: string }>(
        `
          SELECT id
          FROM staff
          WHERE id = $1
            AND is_active = true
        `,
        [staffId.data],
      );

      if (!staff.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active staff member not found",
        });
        return;
      }

      const current = await client.query<{
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

      const party = current.rows[0];

      if (!party) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Party not found",
        });
        return;
      }

      if (
        party.status === "completed" ||
        party.status === "cancelled"
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Party is already finished",
        });
        return;
      }

      const existingOrders = await client.query<{
        id: string;
      }>(
        `
          SELECT id
          FROM orders
          WHERE party_id = $1
            AND cancelled_at IS NULL
          LIMIT 1
        `,
        [partyId.data],
      );

      if (existingOrders.rows[0]) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error:
            "Cancel the party's active orders before cancelling the party",
        });
        return;
      }

      await client.query(
        `
          UPDATE seating_tables
          SET released_at = now()
          WHERE seating_id IN (
            SELECT id
            FROM seatings
            WHERE party_id = $1
              AND ended_at IS NULL
          )
            AND released_at IS NULL
        `,
        [partyId.data],
      );

      await client.query(
        `
          UPDATE seatings
          SET ended_at = now()
          WHERE party_id = $1
            AND ended_at IS NULL
        `,
        [partyId.data],
      );

      const updated = await client.query<PartyRow>(
        `
          UPDATE parties
          SET
            status = 'cancelled',
            status_changed_at = now(),
            cancelled_at = now(),
            cancelled_by_staff_id = $2,
            cancellation_reason = $3
          WHERE id = $1
          RETURNING
            id,
            guest_count,
            status,
            created_by_staff_id,
            arrived_at,
            status_changed_at,
            completed_at,
            cancelled_at,
            cancelled_by_staff_id,
            cancellation_reason
        `,
        [partyId.data, staffId.data, input.data.reason],
      );

      const cancelledParty = updated.rows[0];

      if (!cancelledParty) {
        throw new Error(
          "Party cancellation returned no record",
        );
      }

      await client.query(
        `
          INSERT INTO party_events (
            party_id,
            event_type,
            actor_staff_id,
            reason
          )
          VALUES ($1, 'cancelled', $2, $3)
        `,
        [partyId.data, staffId.data, input.data.reason],
      );

      await client.query("COMMIT");
      response.json(toParty(cancelledParty));
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);
