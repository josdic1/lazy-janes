import { randomUUID } from "node:crypto";
import { paymentSchema } from "@lazy-janes/shared";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";

afterAll(async () => {
  await pool.end();
});

describe("POST /api/payments", () => {
  it("takes cash, records the drawer, and closes a paid check", async () => {
    const staffId = randomUUID();
    const drawerSessionId = randomUUID();
    const checkId = randomUUID();
    let paymentId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO staff (id, display_name)
          VALUES ($1, 'Cash Payment Test Server')
        `,
        [staffId],
      );

      await pool.query(
        `
          INSERT INTO drawer_sessions (
            id,
            opened_by_staff_id,
            opening_cash_amount
          )
          VALUES ($1, $2, 100.00)
        `,
        [drawerSessionId, staffId],
      );

      await pool.query(
        `
          INSERT INTO checks (
            id,
            label,
            status,
            opened_by_staff_id,
            subtotal_amount,
            tax_amount,
            total_amount,
            presented_at
          )
          VALUES (
            $1,
            'Cash Check',
            'presented',
            $2,
            10.00,
            0.66,
            10.66,
            now()
          )
        `,
        [checkId, staffId],
      );

      const response = await request(createApp())
        .post("/api/payments")
        .set("x-staff-id", staffId)
        .send({
          method: "cash",
          allocations: [
            {
              checkId,
              allocatedAmount: 10.66,
            },
          ],
          tipAmount: 1.34,
          cashReceivedAmount: 20,
        });

      expect(response.status).toBe(201);

      const payment = paymentSchema.parse(response.body);
      paymentId = payment.id;

      expect(payment.status).toBe("succeeded");
      expect(payment.paymentAmount).toBe(10.66);
      expect(payment.tipAmount).toBe(1.34);
      expect(payment.cashReceivedAmount).toBe(20);
      expect(payment.changeGivenAmount).toBe(8);
      expect(payment.drawerSessionId).toBe(
        drawerSessionId,
      );

      const check = await pool.query<{
        status: string;
        closed_at: Date | null;
      }>(
        `
          SELECT status, closed_at
          FROM checks
          WHERE id = $1
        `,
        [checkId],
      );

      expect(check.rows[0]?.status).toBe("closed");
      expect(check.rows[0]?.closed_at).not.toBeNull();

      const drawerEvent = await pool.query<{
        event_type: string;
        amount: string;
      }>(
        `
          SELECT event_type, amount
          FROM drawer_events
          WHERE payment_id = $1
        `,
        [paymentId],
      );

      expect(drawerEvent.rows).toEqual([
        {
          event_type: "cash_payment",
          amount: "12.00",
        },
      ]);

      const paymentEvents = await pool.query<{
        event_type: string;
      }>(
        `
          SELECT event_type
          FROM payment_events
          WHERE payment_id = $1
          ORDER BY occurred_at, id
        `,
        [paymentId],
      );

      expect(
        paymentEvents.rows.map(
          (event) => event.event_type,
        ),
      ).toEqual(["created", "succeeded"]);
    } finally {
      if (paymentId) {
        await pool.query(
          "DELETE FROM drawer_events WHERE payment_id = $1",
          [paymentId],
        );

        await pool.query(
          "DELETE FROM payment_events WHERE payment_id = $1",
          [paymentId],
        );

        await pool.query(
          `
            DELETE FROM payment_check_allocations
            WHERE payment_id = $1
          `,
          [paymentId],
        );

        await pool.query(
          "DELETE FROM payments WHERE id = $1",
          [paymentId],
        );
      }

      await pool.query(
        "DELETE FROM check_events WHERE check_id = $1",
        [checkId],
      );

      await pool.query(
        "DELETE FROM checks WHERE id = $1",
        [checkId],
      );

      await pool.query(
        "DELETE FROM drawer_sessions WHERE id = $1",
        [drawerSessionId],
      );

      await pool.query(
        "DELETE FROM staff WHERE id = $1",
        [staffId],
      );
    }
  });

  it("takes a partial card payment only once", async () => {
    const staffId = randomUUID();
    const checkId = randomUUID();
    const processorReference =
      `terminal-${randomUUID()}`;
    let paymentId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO staff (id, display_name)
          VALUES ($1, 'Card Payment Test Server')
        `,
        [staffId],
      );

      await pool.query(
        `
          INSERT INTO checks (
            id,
            label,
            status,
            opened_by_staff_id,
            subtotal_amount,
            tax_amount,
            total_amount,
            presented_at
          )
          VALUES (
            $1,
            'Card Check',
            'presented',
            $2,
            20.00,
            1.33,
            21.33,
            now()
          )
        `,
        [checkId, staffId],
      );

      const body = {
        method: "card",
        allocations: [
          {
            checkId,
            allocatedAmount: 5,
          },
        ],
        tipAmount: 1,
        processorReference,
      };

      const response = await request(createApp())
        .post("/api/payments")
        .set("x-staff-id", staffId)
        .send(body);

      expect(response.status).toBe(201);

      const payment = paymentSchema.parse(response.body);
      paymentId = payment.id;

      expect(payment.paymentAmount).toBe(5);
      expect(payment.tipAmount).toBe(1);
      expect(payment.processorReference).toBe(
        processorReference,
      );
      expect(payment.cashReceivedAmount).toBeNull();
      expect(payment.drawerSessionId).toBeNull();

      const check = await pool.query<{ status: string }>(
        "SELECT status FROM checks WHERE id = $1",
        [checkId],
      );

      expect(check.rows[0]?.status).toBe("presented");

      const repeated = await request(createApp())
        .post("/api/payments")
        .set("x-staff-id", staffId)
        .send(body);

      expect(repeated.status).toBe(409);
      expect(repeated.body.error).toBe(
        "Card transaction has already been recorded",
      );
    } finally {
      if (paymentId) {
        await pool.query(
          "DELETE FROM payment_events WHERE payment_id = $1",
          [paymentId],
        );

        await pool.query(
          `
            DELETE FROM payment_check_allocations
            WHERE payment_id = $1
          `,
          [paymentId],
        );

        await pool.query(
          "DELETE FROM payments WHERE id = $1",
          [paymentId],
        );
      }

      await pool.query(
        "DELETE FROM check_events WHERE check_id = $1",
        [checkId],
      );

      await pool.query(
        "DELETE FROM checks WHERE id = $1",
        [checkId],
      );

      await pool.query(
        "DELETE FROM staff WHERE id = $1",
        [staffId],
      );
    }
  });
});
