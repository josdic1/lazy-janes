import {
  cancelPartyInputSchema,
  createDiningRoomSectionInputSchema,
  createDiningTableInputSchema,
  createPartyInputSchema,
  seatPartyInputSchema,
  updateDiningTableInputSchema,
  type DiningRoomSection,
  type DiningTableOption,
  type DiningTableRecord,
  type Party,
  type PartyListItem,
  type PartyStatus,
} from "@lazy-janes/shared";
import { Router } from "express";
import { z } from "zod";
import {
  getAuthenticatedUser,
  requireAnyRole,
  requireAuthenticatedUser,
} from "../auth/session.js";
import { pool } from "../db/pool.js";

type PartyRow = {
  id: string;
  guest_count: number;
  status: PartyStatus;
  created_by_user_id: string;
  arrived_at: Date;
  status_changed_at: Date;
  completed_at: Date | null;
  cancelled_at: Date | null;
  cancelled_by_user_id: string | null;
  cancellation_reason: string | null;
};

type PartyListRow = PartyRow & {
  table_labels: string[];
};

type DiningRoomSectionRow = {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
};

type DiningTableOptionRow = {
  id: string;
  label: string;
  capacity: number;
  section_id: string;
  section_name: string;
  occupied: boolean;
  is_active?: boolean;
  floor_x: number;
  floor_y: number;
};

const partySelect = `
  SELECT
    id,
    guest_count,
    status,
    created_by_user_id,
    arrived_at,
    status_changed_at,
    completed_at,
    cancelled_at,
    cancelled_by_user_id,
    cancellation_reason
  FROM parties
`;

function toParty(row: PartyRow): Party {
  return {
    id: row.id,
    guestCount: row.guest_count,
    status: row.status,
    createdByUserId: row.created_by_user_id,
    arrivedAt: row.arrived_at.toISOString(),
    statusChangedAt: row.status_changed_at.toISOString(),
    completedAt: row.completed_at?.toISOString() ?? null,
    cancelledAt: row.cancelled_at?.toISOString() ?? null,
    cancelledByUserId: row.cancelled_by_user_id,
    cancellationReason: row.cancellation_reason,
  };
}

function toPartyListItem(
  row: PartyListRow,
): PartyListItem {
  return {
    ...toParty(row),
    tableLabels: row.table_labels,
  };
}

function toDiningRoomSection(
  row: DiningRoomSectionRow,
): DiningRoomSection {
  return {
    id: row.id,
    name: row.name,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

export const partiesRouter = Router();

partiesRouter.use(requireAuthenticatedUser);
partiesRouter.use(
  requireAnyRole(
    "host",
    "server",
    "lead_server",
    "manager",
    "admin",
  ),
);

partiesRouter.get("/", async (_request, response) => {
  const result = await pool.query<PartyListRow>(`
    SELECT
      parties.id,
      parties.guest_count,
      parties.status,
      parties.created_by_user_id,
      parties.arrived_at,
      parties.status_changed_at,
      parties.completed_at,
      parties.cancelled_at,
      parties.cancelled_by_user_id,
      parties.cancellation_reason,
      COALESCE(
        (
          SELECT array_agg(
            dining_tables.label
            ORDER BY dining_tables.label
          )
          FROM seatings
          JOIN seating_tables
            ON seating_tables.seating_id = seatings.id
          JOIN dining_tables
            ON dining_tables.id =
              seating_tables.dining_table_id
          WHERE seatings.party_id = parties.id
            AND seatings.ended_at IS NULL
            AND seating_tables.released_at IS NULL
        ),
        ARRAY[]::text[]
      ) AS table_labels
    FROM parties
    ORDER BY parties.arrived_at DESC, parties.id
  `);

  response.json(result.rows.map(toPartyListItem));
});

partiesRouter.get(
  "/sections/manage",
  requireAnyRole("manager", "admin"),
  async (_request, response) => {
    const result = await pool.query<DiningRoomSectionRow>(`
      SELECT id, name, display_order, is_active
      FROM sections
      WHERE is_active = true
      ORDER BY display_order, name
    `);

    response.json(result.rows.map(toDiningRoomSection));
  },
);

partiesRouter.post(
  "/sections/manage",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const input = createDiningRoomSectionInputSchema.safeParse(request.body);

    if (!input.success) {
      response.status(400).json({
        error: "Invalid room",
        issues: input.error.issues,
      });
      return;
    }

    const name = input.data.name.trim();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existing = await client.query<{ id: string }>(`
        SELECT id
        FROM sections
        WHERE lower(btrim(name)) = lower(btrim($1))
        LIMIT 1
        FOR UPDATE
      `, [name]);

      if (existing.rows[0]) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "That room already exists",
        });
        return;
      }

      const displayOrderResult = await client.query<{ next_order: number }>(`
        SELECT COALESCE(max(display_order), -1) + 1 AS next_order
        FROM sections
      `);
      const displayOrder = displayOrderResult.rows[0]?.next_order ?? 0;

      const result = await client.query<DiningRoomSectionRow>(`
        INSERT INTO sections (name, display_order)
        VALUES ($1, $2)
        RETURNING id, name, display_order, is_active
      `, [name, displayOrder]);
      const room = result.rows[0];

      if (!room) {
        throw new Error("Room insert returned no record");
      }

      await client.query("COMMIT");
      response.status(201).json(toDiningRoomSection(room));
    } catch (error: any) {
      await client.query("ROLLBACK");

      if (error?.code === "23505") {
        response.status(409).json({
          error: "That room already exists",
        });
        return;
      }

      throw error;
    } finally {
      client.release();
    }
  },
);

partiesRouter.get("/tables", async (_request, response) => {
  const result = await pool.query<DiningTableOptionRow>(
    `
      SELECT
        dining_tables.id,
        dining_tables.label,
        dining_tables.capacity,
        sections.id AS section_id,
        sections.name AS section_name,
        dining_tables.floor_x,
        dining_tables.floor_y,
        EXISTS (
          SELECT 1
          FROM seating_tables
          JOIN seatings
            ON seatings.id = seating_tables.seating_id
          WHERE seating_tables.dining_table_id =
            dining_tables.id
            AND seating_tables.released_at IS NULL
            AND seatings.ended_at IS NULL
        ) AS occupied
      FROM dining_tables
      JOIN sections
        ON sections.id = dining_tables.section_id
      WHERE dining_tables.is_active = true
        AND sections.is_active = true
      ORDER BY
        sections.display_order,
        sections.name,
        dining_tables.label
    `,
  );

  const tables: DiningTableOption[] =
    result.rows.map((row) => ({
      id: row.id,
      label: row.label,
      capacity: row.capacity,
      sectionId: row.section_id,
      sectionName: row.section_name,
      occupied: row.occupied,
      floorX: row.floor_x,
      floorY: row.floor_y,
    }));

  response.json(tables);
});

partiesRouter.get(
  "/tables/manage",
  requireAnyRole("manager", "admin"),
  async (_request, response) => {
    const result = await pool.query<DiningTableOptionRow>(`
      SELECT
        dining_tables.id,
        dining_tables.label,
        dining_tables.capacity,
        sections.id AS section_id,
        sections.name AS section_name,
        dining_tables.is_active,
        dining_tables.floor_x,
        dining_tables.floor_y,
        EXISTS (
          SELECT 1
          FROM seating_tables
          JOIN seatings ON seatings.id = seating_tables.seating_id
          WHERE seating_tables.dining_table_id = dining_tables.id
            AND seating_tables.released_at IS NULL
            AND seatings.ended_at IS NULL
        ) AS occupied
      FROM dining_tables
      JOIN sections ON sections.id = dining_tables.section_id
      ORDER BY sections.display_order, sections.name, dining_tables.label
    `);

    const tables: DiningTableRecord[] = result.rows.map((row) => ({
      id: row.id,
      label: row.label,
      capacity: row.capacity,
      sectionId: row.section_id,
      sectionName: row.section_name,
      occupied: row.occupied,
      isActive: row.is_active ?? true,
      floorX: row.floor_x,
      floorY: row.floor_y,
    }));

    response.json(tables);
  },
);

partiesRouter.post(
  "/tables/manage",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const input = createDiningTableInputSchema.safeParse(request.body);
    if (!input.success) {
      response.status(400).json({
        error: "Invalid dining table",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const sectionResult = await client.query<{
        id: string;
        name: string;
      }>(`
        SELECT id, name
        FROM sections
        WHERE id = $1
          AND is_active = true
        FOR UPDATE
      `, [input.data.sectionId]);
      const section = sectionResult.rows[0];

      if (!section) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error: "Choose an active room",
        });
        return;
      }

      const tableCount = await client.query<{ count: number }>(`
        SELECT count(*)::int AS count
        FROM dining_tables
        WHERE section_id = $1
      `, [section.id]);
      const slot = tableCount.rows[0]?.count ?? 0;
      const floorX = input.data.floorX ?? 8 + ((slot % 5) * 20);
      const floorY = input.data.floorY ?? 10 + ((Math.floor(slot / 5) % 4) * 27);

      const result = await client.query<DiningTableOptionRow>(`
        INSERT INTO dining_tables (
          section_id,
          label,
          capacity,
          floor_x,
          floor_y
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          label,
          capacity,
          section_id,
          $6::text AS section_name,
          false AS occupied,
          is_active,
          floor_x,
          floor_y
      `, [
        section.id,
        input.data.label,
        input.data.capacity,
        floorX,
        floorY,
        section.name,
      ]);
      const row = result.rows[0];
      if (!row) {
        throw new Error("Dining table insert returned no record");
      }

      await client.query("COMMIT");
      response.status(201).json({
        id: row.id,
        label: row.label,
        capacity: row.capacity,
        sectionId: row.section_id,
        sectionName: row.section_name,
        occupied: false,
        isActive: row.is_active ?? true,
        floorX: row.floor_x,
        floorY: row.floor_y,
      });
    } catch (error: any) {
      await client.query("ROLLBACK");
      if (error?.code === "23505") {
        response.status(409).json({ error: "That table already exists in this room" });
        return;
      }
      throw error;
    } finally {
      client.release();
    }
  },
);

partiesRouter.patch(
  "/tables/manage/:tableId",
  requireAnyRole("manager", "admin"),
  async (request, response) => {
    const tableId = z.string().uuid().safeParse(request.params.tableId);
    const input = updateDiningTableInputSchema.safeParse(request.body);
    if (!tableId.success || !input.success) {
      response.status(400).json({ error: "Invalid dining table change" });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const current = await client.query<{
        section_id: string;
        section_name: string;
        label: string;
        capacity: number;
        is_active: boolean;
        floor_x: number;
        floor_y: number;
      }>(`
        SELECT dining_tables.section_id, sections.name AS section_name,
               dining_tables.label, dining_tables.capacity, dining_tables.is_active,
               dining_tables.floor_x, dining_tables.floor_y
        FROM dining_tables
        JOIN sections ON sections.id = dining_tables.section_id
        WHERE dining_tables.id = $1
        FOR UPDATE
      `, [tableId.data]);
      const row = current.rows[0];
      if (!row) {
        await client.query("ROLLBACK");
        response.status(404).json({ error: "Dining table not found" });
        return;
      }

      if (input.data.isActive === false) {
        const occupied = await client.query(`
          SELECT 1
          FROM seating_tables
          JOIN seatings ON seatings.id = seating_tables.seating_id
          WHERE seating_tables.dining_table_id = $1
            AND seating_tables.released_at IS NULL
            AND seatings.ended_at IS NULL
          LIMIT 1
        `, [tableId.data]);
        if ((occupied.rowCount ?? 0) > 0) {
          await client.query("ROLLBACK");
          response.status(409).json({ error: "An occupied table cannot be deactivated" });
          return;
        }
      }

      let sectionId = row.section_id;
      let sectionName = row.section_name;

      if (input.data.sectionId && input.data.sectionId !== row.section_id) {
        const sectionResult = await client.query<{
          id: string;
          name: string;
        }>(`
          SELECT id, name
          FROM sections
          WHERE id = $1
            AND is_active = true
          FOR UPDATE
        `, [input.data.sectionId]);
        const section = sectionResult.rows[0];

        if (!section) {
          await client.query("ROLLBACK");
          response.status(400).json({
            error: "Choose an active room",
          });
          return;
        }

        sectionId = section.id;
        sectionName = section.name;
      }

      const updated = await client.query<DiningTableOptionRow>(`
        UPDATE dining_tables
        SET
          section_id = $2,
          label = $3,
          capacity = $4,
          is_active = $5,
          floor_x = $6,
          floor_y = $7
        WHERE id = $1
        RETURNING
          id,
          label,
          capacity,
          section_id,
          $8::text AS section_name,
          is_active,
          false AS occupied,
          floor_x,
          floor_y
      `, [
        tableId.data,
        sectionId,
        input.data.label ?? row.label,
        input.data.capacity ?? row.capacity,
        input.data.isActive ?? row.is_active,
        input.data.floorX ?? row.floor_x,
        input.data.floorY ?? row.floor_y,
        sectionName,
      ]);
      const next = updated.rows[0];
      if (!next) {
        throw new Error("Dining table update returned no record");
      }

      await client.query("COMMIT");
      response.json({
        id: next.id,
        label: next.label,
        capacity: next.capacity,
        sectionId: next.section_id,
        sectionName: next.section_name,
        occupied: false,
        isActive: next.is_active ?? true,
        floorX: next.floor_x,
        floorY: next.floor_y,
      });
    } catch (error: any) {
      await client.query("ROLLBACK");
      if (error?.code === "23505") {
        response.status(409).json({ error: "That table already exists in this room" });
        return;
      }
      throw error;
    } finally {
      client.release();
    }
  },
);

partiesRouter.post("/", async (request, response) => {
  const input = createPartyInputSchema.safeParse(request.body);

  if (!input.success) {
    response.status(400).json({
      error: "Invalid party",
      issues: input.error.issues,
    });
    return;
  }

  const userId = getAuthenticatedUser(request).id;


  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query<{ id: string }>(
      `
        SELECT id
        FROM users
        WHERE id = $1
          AND is_active = true
      `,
      [userId],
    );

    if (!userResult.rows[0]) {
      await client.query("ROLLBACK");
      response.status(403).json({
        error: "Active user not found",
      });
      return;
    }

    const partyResult = await client.query<PartyRow>(
      `
        INSERT INTO parties (
          guest_count,
          status,
          created_by_user_id
        )
        VALUES ($1, 'waiting', $2)
        RETURNING
          id,
          guest_count,
          status,
          created_by_user_id,
          arrived_at,
          status_changed_at,
          completed_at,
          cancelled_at,
          cancelled_by_user_id,
          cancellation_reason
      `,
      [input.data.guestCount, userId],
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
          actor_user_id
        )
        VALUES ($1, 'arrived', $2)
      `,
      [party.id, userId],
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

    const userId = getAuthenticatedUser(request).id;

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


    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const userResult = await client.query<{
        id: string;
      }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!userResult.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
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
            seated_by_user_id
          )
          VALUES ($1, $2)
          RETURNING id
        `,
        [partyId.data, userId],
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
            created_by_user_id,
            arrived_at,
            status_changed_at,
            completed_at,
            cancelled_at,
            cancelled_by_user_id,
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
            actor_user_id
          )
          VALUES ($1, 'seated', $2)
        `,
        [party.id, userId],
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
    const userId = getAuthenticatedUser(request).id;

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


    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
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
            cancelled_by_user_id = $2,
            cancellation_reason = $3
          WHERE id = $1
          RETURNING
            id,
            guest_count,
            status,
            created_by_user_id,
            arrived_at,
            status_changed_at,
            completed_at,
            cancelled_at,
            cancelled_by_user_id,
            cancellation_reason
        `,
        [partyId.data, userId, input.data.reason],
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
            actor_user_id,
            reason
          )
          VALUES ($1, 'cancelled', $2, $3)
        `,
        [partyId.data, userId, input.data.reason],
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
