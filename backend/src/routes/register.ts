import {
  closeDrawerInputSchema,
  openDrawerInputSchema,
  type DrawerSession,
} from "@lazy-janes/shared";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";

type DrawerSessionRow = {
  id: string;
  opened_by_staff_id: string;
  opening_cash_amount: string;
  opened_at: Date;
  closed_by_staff_id: string | null;
  expected_cash_amount: string | null;
  counted_cash_amount: string | null;
  variance_amount: string | null;
  closed_at: Date | null;
};

const staffIdSchema = z.string().uuid();

const drawerColumns = `
  id,
  opened_by_staff_id,
  opening_cash_amount,
  opened_at,
  closed_by_staff_id,
  expected_cash_amount,
  counted_cash_amount,
  variance_amount,
  closed_at
`;

function toDrawerSession(
  row: DrawerSessionRow,
): DrawerSession {
  return {
    id: row.id,
    openedByStaffId: row.opened_by_staff_id,
    openingCashAmount: Number(row.opening_cash_amount),
    openedAt: row.opened_at.toISOString(),
    closedByStaffId: row.closed_by_staff_id,
    expectedCashAmount:
      row.expected_cash_amount === null
        ? null
        : Number(row.expected_cash_amount),
    countedCashAmount:
      row.counted_cash_amount === null
        ? null
        : Number(row.counted_cash_amount),
    varianceAmount:
      row.variance_amount === null
        ? null
        : Number(row.variance_amount),
    closedAt: row.closed_at?.toISOString() ?? null,
  };
}

export const registerRouter = Router();

registerRouter.get(
  "/current",
  async (request, response) => {
    const staffId = staffIdSchema.safeParse(
      request.header("x-staff-id"),
    );

    if (!staffId.success) {
      response.status(401).json({
        error: "A valid staff identity is required",
      });
      return;
    }

    const staff = await pool.query<{ id: string }>(
      `
        SELECT id
        FROM staff
        WHERE id = $1
          AND is_active = true
      `,
      [staffId.data],
    );

    if (!staff.rows[0]) {
      response.status(403).json({
        error: "Active staff member not found",
      });
      return;
    }

    const drawer = await pool.query<DrawerSessionRow>(
      `
        SELECT ${drawerColumns}
        FROM drawer_sessions
        WHERE closed_at IS NULL
      `,
    );

    response.json(
      drawer.rows[0]
        ? toDrawerSession(drawer.rows[0])
        : null,
    );
  },
);

registerRouter.post(
  "/open",
  async (request, response) => {
    const input = openDrawerInputSchema.safeParse(
      request.body,
    );
    const staffId = staffIdSchema.safeParse(
      request.header("x-staff-id"),
    );

    if (!input.success) {
      response.status(400).json({
        error: "Invalid opening cash count",
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

      const inserted = await client.query<DrawerSessionRow>(
        `
          INSERT INTO drawer_sessions (
            opened_by_staff_id,
            opening_cash_amount
          )
          VALUES ($1, $2)
          RETURNING ${drawerColumns}
        `,
        [staffId.data, input.data.openingCashAmount],
      );

      const drawer = inserted.rows[0];

      if (!drawer) {
        throw new Error(
          "Drawer session insert returned no record",
        );
      }

      const cashCount = await client.query<{ id: string }>(
        `
          INSERT INTO cash_counts (
            drawer_session_id,
            count_kind,
            counted_amount,
            counted_by_staff_id
          )
          VALUES ($1, 'opening', $2, $3)
          RETURNING id
        `,
        [
          drawer.id,
          input.data.openingCashAmount,
          staffId.data,
        ],
      );

      const cashCountId = cashCount.rows[0]?.id;

      if (!cashCountId) {
        throw new Error(
          "Opening cash count returned no record",
        );
      }

      await client.query(
        `
          INSERT INTO drawer_events (
            drawer_session_id,
            event_type,
            amount,
            cash_count_id,
            actor_staff_id
          )
          VALUES
            ($1, 'opened', $2, NULL, $3),
            ($1, 'counted', $2, $4, $3)
        `,
        [
          drawer.id,
          input.data.openingCashAmount,
          staffId.data,
          cashCountId,
        ],
      );

      await client.query("COMMIT");
      response.status(201).json(
        toDrawerSession(drawer),
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
      ) {
        response.status(409).json({
          error: "A drawer is already open",
        });
        return;
      }

      throw error;
    } finally {
      client.release();
    }
  },
);

registerRouter.post(
  "/close",
  async (request, response) => {
    const input = closeDrawerInputSchema.safeParse(
      request.body,
    );
    const staffId = staffIdSchema.safeParse(
      request.header("x-staff-id"),
    );

    if (!input.success) {
      response.status(400).json({
        error: "Invalid closing cash count",
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
        id: string;
        opening_cash_amount: string;
      }>(
        `
          SELECT id, opening_cash_amount
          FROM drawer_sessions
          WHERE closed_at IS NULL
          FOR UPDATE
        `,
      );

      const drawer = current.rows[0];

      if (!drawer) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "No drawer is open",
        });
        return;
      }

      const activity = await client.query<{
        activity_amount: string;
      }>(
        `
          SELECT
            COALESCE(
              SUM(
                CASE
                  WHEN event_type IN (
                    'cash_payment',
                    'paid_in'
                  )
                    THEN amount
                  WHEN event_type IN (
                    'cash_refund',
                    'paid_out',
                    'cash_drop'
                  )
                    THEN -amount
                  ELSE 0
                END
              ),
              0
            )::text AS activity_amount
          FROM drawer_events
          WHERE drawer_session_id = $1
        `,
        [drawer.id],
      );

      const expectedCashAmount =
        Math.round(
          (
            Number(drawer.opening_cash_amount) +
            Number(
              activity.rows[0]?.activity_amount ?? 0,
            )
          ) * 100,
        ) / 100;

      const varianceAmount =
        Math.round(
          (
            input.data.countedCashAmount -
            expectedCashAmount
          ) * 100,
        ) / 100;

      const cashCount = await client.query<{ id: string }>(
        `
          INSERT INTO cash_counts (
            drawer_session_id,
            count_kind,
            counted_amount,
            counted_by_staff_id
          )
          VALUES ($1, 'closing', $2, $3)
          RETURNING id
        `,
        [
          drawer.id,
          input.data.countedCashAmount,
          staffId.data,
        ],
      );

      const cashCountId = cashCount.rows[0]?.id;

      if (!cashCountId) {
        throw new Error(
          "Closing cash count returned no record",
        );
      }

      const closed = await client.query<DrawerSessionRow>(
        `
          UPDATE drawer_sessions
          SET
            closed_by_staff_id = $2,
            expected_cash_amount = $3,
            counted_cash_amount = $4,
            variance_amount = $5,
            closed_at = now()
          WHERE id = $1
          RETURNING ${drawerColumns}
        `,
        [
          drawer.id,
          staffId.data,
          expectedCashAmount,
          input.data.countedCashAmount,
          varianceAmount,
        ],
      );

      const closedDrawer = closed.rows[0];

      if (!closedDrawer) {
        throw new Error(
          "Drawer close returned no record",
        );
      }

      await client.query(
        `
          INSERT INTO drawer_events (
            drawer_session_id,
            event_type,
            amount,
            cash_count_id,
            actor_staff_id
          )
          VALUES
            ($1, 'counted', $2, $3, $4),
            ($1, 'closed', 0, NULL, $4)
        `,
        [
          drawer.id,
          input.data.countedCashAmount,
          cashCountId,
          staffId.data,
        ],
      );

      await client.query("COMMIT");
      response.json(toDrawerSession(closedDrawer));
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);
