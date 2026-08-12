import {
  takePaymentInputSchema,
  type Payment,
  type PaymentCheckAllocation,
} from "@lazy-janes/shared";
import { Router } from "express";
import type { PoolClient } from "pg";
import { z } from "zod";
import { pool } from "../db/pool.js";

type PaymentRow = {
  id: string;
  method: Payment["method"];
  status: Payment["status"];
  payment_amount: string;
  tip_amount: string;
  received_by_staff_id: string;
  processor_reference: string | null;
  cash_received_amount: string | null;
  change_given_amount: string | null;
  drawer_session_id: string | null;
  succeeded_at: Date | null;
  failed_at: Date | null;
  voided_at: Date | null;
  voided_by_staff_id: string | null;
  void_reason: string | null;
  created_at: Date;
};

type PaymentAllocationRow = {
  check_id: string;
  allocated_amount: string;
  created_at: Date;
};

type PayableCheckRow = {
  id: string;
  status: string;
  total_amount: string;
};

type ExistingPaymentRow = {
  check_id: string;
  paid_amount: string;
};

const staffIdSchema = z.string().uuid();

function toAllocation(
  row: PaymentAllocationRow,
): PaymentCheckAllocation {
  return {
    checkId: row.check_id,
    allocatedAmount: Number(row.allocated_amount),
    createdAt: row.created_at.toISOString(),
  };
}

function toPayment(
  row: PaymentRow,
  allocations: PaymentCheckAllocation[],
): Payment {
  return {
    id: row.id,
    method: row.method,
    status: row.status,
    paymentAmount: Number(row.payment_amount),
    tipAmount: Number(row.tip_amount),
    receivedByStaffId: row.received_by_staff_id,
    processorReference: row.processor_reference,
    cashReceivedAmount:
      row.cash_received_amount === null
        ? null
        : Number(row.cash_received_amount),
    changeGivenAmount:
      row.change_given_amount === null
        ? null
        : Number(row.change_given_amount),
    drawerSessionId: row.drawer_session_id,
    succeededAt: row.succeeded_at?.toISOString() ?? null,
    failedAt: row.failed_at?.toISOString() ?? null,
    voidedAt: row.voided_at?.toISOString() ?? null,
    voidedByStaffId: row.voided_by_staff_id,
    voidReason: row.void_reason,
    createdAt: row.created_at.toISOString(),
    allocations,
  };
}

function toCents(amount: number | string): number {
  return Math.round(Number(amount) * 100);
}

export const paymentsRouter = Router();

paymentsRouter.post("/", async (request, response) => {
  const input = takePaymentInputSchema.safeParse(request.body);

  if (!input.success) {
    response.status(400).json({
      error: "Invalid payment",
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

    const checkIds = input.data.allocations.map(
      (allocation) => allocation.checkId,
    );

    const checks = await client.query<PayableCheckRow>(
      `
        SELECT id, status, total_amount
        FROM checks
        WHERE id = ANY($1::uuid[])
        FOR UPDATE
      `,
      [checkIds],
    );

    if (checks.rows.length !== checkIds.length) {
      await client.query("ROLLBACK");
      response.status(404).json({
        error: "One or more checks were not found",
      });
      return;
    }

    if (
      checks.rows.some(
        (check) => check.status !== "presented",
      )
    ) {
      await client.query("ROLLBACK");
      response.status(409).json({
        error: "Only presented checks can be paid",
      });
      return;
    }

    const existingPayments =
      await client.query<ExistingPaymentRow>(
        `
          SELECT
            allocations.check_id,
            COALESCE(
              SUM(allocations.allocated_amount),
              0
            )::text AS paid_amount
          FROM payment_check_allocations AS allocations
          JOIN payments
            ON payments.id = allocations.payment_id
          WHERE allocations.check_id = ANY($1::uuid[])
            AND payments.status = 'succeeded'
          GROUP BY allocations.check_id
        `,
        [checkIds],
      );

    const paidCentsByCheck = new Map(
      existingPayments.rows.map((payment) => [
        payment.check_id,
        toCents(payment.paid_amount),
      ]),
    );

    const requestedCentsByCheck = new Map(
      input.data.allocations.map((allocation) => [
        allocation.checkId,
        toCents(allocation.allocatedAmount),
      ]),
    );

    for (const check of checks.rows) {
      const totalCents = toCents(check.total_amount);
      const paidCents =
        paidCentsByCheck.get(check.id) ?? 0;
      const requestedCents =
        requestedCentsByCheck.get(check.id) ?? 0;

      if (paidCents + requestedCents > totalCents) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Payment exceeds a check balance",
        });
        return;
      }
    }

    const paymentAmountCents =
      input.data.allocations.reduce(
        (total, allocation) =>
          total + toCents(allocation.allocatedAmount),
        0,
      );

    const tipAmountCents = toCents(input.data.tipAmount);
    let drawerSessionId: string | null = null;
    let processorReference: string | null = null;
    let cashReceivedCents: number | null = null;
    let changeGivenCents: number | null = null;

    if (input.data.method === "cash") {
      const drawer = await client.query<{ id: string }>(
        `
          SELECT id
          FROM drawer_sessions
          WHERE closed_at IS NULL
          LIMIT 1
          FOR UPDATE
        `,
      );

      drawerSessionId = drawer.rows[0]?.id ?? null;

      if (drawerSessionId === null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "An open drawer is required for cash",
        });
        return;
      }

      cashReceivedCents = toCents(
        input.data.cashReceivedAmount,
      );
      changeGivenCents =
        cashReceivedCents -
        paymentAmountCents -
        tipAmountCents;
    } else {
      processorReference =
        input.data.processorReference;
    }

    const insertedPayment =
      await client.query<PaymentRow>(
        `
          INSERT INTO payments (
            method,
            status,
            payment_amount,
            tip_amount,
            received_by_staff_id,
            processor_reference,
            cash_received_amount,
            change_given_amount,
            succeeded_at,
            drawer_session_id
          )
          VALUES (
            $1,
            'succeeded',
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            now(),
            $8
          )
          RETURNING
            id,
            method,
            status,
            payment_amount,
            tip_amount,
            received_by_staff_id,
            processor_reference,
            cash_received_amount,
            change_given_amount,
            drawer_session_id,
            succeeded_at,
            failed_at,
            voided_at,
            voided_by_staff_id,
            void_reason,
            created_at
        `,
        [
          input.data.method,
          paymentAmountCents / 100,
          tipAmountCents / 100,
          staffId.data,
          processorReference,
          cashReceivedCents === null
            ? null
            : cashReceivedCents / 100,
          changeGivenCents === null
            ? null
            : changeGivenCents / 100,
          drawerSessionId,
        ],
      );

    const payment = insertedPayment.rows[0];

    if (!payment) {
      throw new Error(
        "Payment insert returned no record",
      );
    }

    const createdAllocations: PaymentCheckAllocation[] = [];

    for (const allocation of input.data.allocations) {
      const inserted =
        await client.query<PaymentAllocationRow>(
          `
            INSERT INTO payment_check_allocations (
              payment_id,
              check_id,
              allocated_amount
            )
            VALUES ($1, $2, $3)
            RETURNING
              check_id,
              allocated_amount,
              created_at
          `,
          [
            payment.id,
            allocation.checkId,
            allocation.allocatedAmount,
          ],
        );

      const createdAllocation = inserted.rows[0];

      if (!createdAllocation) {
        throw new Error(
          "Payment allocation insert returned no record",
        );
      }

      createdAllocations.push(
        toAllocation(createdAllocation),
      );
    }

    await client.query(
      `
        INSERT INTO payment_events (
          payment_id,
          event_type,
          actor_kind,
          actor_staff_id
        )
        VALUES
          ($1, 'created', 'staff', $2),
          ($1, 'succeeded', 'staff', $2)
      `,
      [payment.id, staffId.data],
    );

    if (drawerSessionId !== null) {
      await client.query(
        `
          INSERT INTO drawer_events (
            drawer_session_id,
            event_type,
            amount,
            payment_id,
            actor_staff_id
          )
          VALUES (
            $1,
            'cash_payment',
            $2,
            $3,
            $4
          )
        `,
        [
          drawerSessionId,
          (paymentAmountCents + tipAmountCents) / 100,
          payment.id,
          staffId.data,
        ],
      );
    }

    for (const check of checks.rows) {
      const totalCents = toCents(check.total_amount);
      const paidCents =
        paidCentsByCheck.get(check.id) ?? 0;
      const requestedCents =
        requestedCentsByCheck.get(check.id) ?? 0;

      if (paidCents + requestedCents !== totalCents) {
        continue;
      }

      await client.query(
        `
          UPDATE checks
          SET
            status = 'closed',
            closed_at = now(),
            updated_at = now()
          WHERE id = $1
        `,
        [check.id],
      );

      await client.query(
        `
          INSERT INTO check_events (
            check_id,
            event_type,
            actor_kind,
            details
          )
          VALUES (
            $1,
            'closed',
            'system',
            jsonb_build_object(
              'paymentId',
              $2::text
            )
          )
        `,
        [check.id, payment.id],
      );
    }

    await completePaidParties(
      client,
      checkIds,
    );

    await client.query("COMMIT");

    response.status(201).json(
      toPayment(payment, createdAllocations),
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
        error:
          "Card transaction has already been recorded",
      });
      return;
    }

    throw error;
  } finally {
    client.release();
  }
});

async function completePaidParties(
  client: PoolClient,
  checkIds: string[],
): Promise<void> {
  const parties = await client.query<{
    id: string;
    status: string;
  }>(
    `
      SELECT id, status
      FROM parties
      WHERE id IN (
        SELECT party_id
        FROM checks
        WHERE id = ANY($1::uuid[])
          AND party_id IS NOT NULL
      )
      ORDER BY id
      FOR UPDATE
    `,
    [checkIds],
  );

  for (const party of parties.rows) {
    if (party.status !== "in_service") {
      continue;
    }

    const readiness = await client.query<{
      has_open_checks: boolean;
      has_unallocated_items: boolean;
    }>(
      `
        SELECT
          EXISTS (
            SELECT 1
            FROM checks
            WHERE party_id = $1
              AND status <> 'closed'
          ) AS has_open_checks,

          EXISTS (
            SELECT 1
            FROM order_items
            JOIN orders
              ON orders.id = order_items.order_id
            LEFT JOIN (
              SELECT
                order_item_id,
                SUM(allocated_quantity) AS allocated_quantity
              FROM check_items
              GROUP BY order_item_id
            ) AS allocations
              ON allocations.order_item_id = order_items.id
            WHERE orders.party_id = $1
              AND orders.cancelled_at IS NULL
              AND order_items.status <> 'voided'
              AND COALESCE(
                allocations.allocated_quantity,
                0
              ) < order_items.quantity
          ) AS has_unallocated_items
      `,
      [party.id],
    );

    const state = readiness.rows[0];

    if (
      !state ||
      state.has_open_checks ||
      state.has_unallocated_items
    ) {
      continue;
    }

    const completed = await client.query<{ id: string }>(
      `
        UPDATE parties
        SET
          status = 'completed',
          status_changed_at = now(),
          completed_at = now()
        WHERE id = $1
          AND status = 'in_service'
        RETURNING id
      `,
      [party.id],
    );

    if (!completed.rows[0]) {
      continue;
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
      [party.id],
    );

    await client.query(
      `
        UPDATE seatings
        SET ended_at = now()
        WHERE party_id = $1
          AND ended_at IS NULL
      `,
      [party.id],
    );

    await client.query(
      `
        INSERT INTO party_events (
          party_id,
          event_type
        )
        VALUES ($1, 'completed')
      `,
      [party.id],
    );
  }
}
