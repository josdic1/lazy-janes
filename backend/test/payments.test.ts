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
    const userId = randomUUID();
    const drawerSessionId = randomUUID();
    const checkId = randomUUID();
    let paymentId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO users (id, display_name)
          VALUES ($1, 'Cash Payment Test Server')
        `,
        [userId],
      );

      await pool.query(
        `
          INSERT INTO drawer_sessions (
            id,
            opened_by_user_id,
            opening_cash_amount
          )
          VALUES ($1, $2, 100.00)
        `,
        [drawerSessionId, userId],
      );

      await pool.query(
        `
          INSERT INTO checks (
            id,
            label,
            status,
            opened_by_user_id,
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
        [checkId, userId],
      );

      const response = await request(createApp())
        .post("/api/payments")
        .set("x-user-id", userId)
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
        "DELETE FROM users WHERE id = $1",
        [userId],
      );
    }
  });

  it("takes a partial card payment only once", async () => {
    const userId = randomUUID();
    const checkId = randomUUID();
    const processorReference =
      `terminal-${randomUUID()}`;
    let paymentId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO users (id, display_name)
          VALUES ($1, 'Card Payment Test Server')
        `,
        [userId],
      );

      await pool.query(
        `
          INSERT INTO checks (
            id,
            label,
            status,
            opened_by_user_id,
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
        [checkId, userId],
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
        .set("x-user-id", userId)
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
        .set("x-user-id", userId)
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
        "DELETE FROM users WHERE id = $1",
        [userId],
      );
    }
  });
});

describe("automatic party completion", () => {
  it("completes the paid party and releases its table", async () => {
    const userId = randomUUID();
    const sectionId = randomUUID();
    const tableId = randomUUID();
    const partyId = randomUUID();
    const seatingId = randomUUID();
    const seatingTableId = randomUUID();
    const menuItemId = randomUUID();
    const orderId = randomUUID();
    const orderItemId = randomUUID();
    const checkId = randomUUID();
    let paymentId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO users (id, display_name)
          VALUES ($1, 'Completion Test Server')
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
          VALUES ($1, $2, $3, 4)
        `,
        [tableId, sectionId, `Test ${tableId}`],
      );

      await pool.query(
        `
          INSERT INTO parties (
            id,
            guest_count,
            status,
            created_by_user_id
          )
          VALUES ($1, 2, 'in_service', $2)
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
          INSERT INTO menu_items (
            id,
            name,
            category,
            price
          )
          VALUES ($1, 'Completion Test Meal', 'Test', 10)
        `,
        [menuItemId],
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

      await pool.query(
        `
          INSERT INTO order_items (
            id,
            order_id,
            menu_item_id,
            created_by_user_id,
            item_name,
            unit_price
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            'Completion Test Meal',
            10
          )
        `,
        [orderItemId, orderId, menuItemId, userId],
      );

      await pool.query(
        `
          INSERT INTO checks (
            id,
            party_id,
            label,
            status,
            opened_by_user_id,
            subtotal_amount,
            tax_amount,
            total_amount,
            presented_at
          )
          VALUES (
            $1,
            $2,
            'Final Check',
            'presented',
            $3,
            10.00,
            0.66,
            10.66,
            now()
          )
        `,
        [checkId, partyId, userId],
      );

      await pool.query(
        `
          INSERT INTO check_items (
            check_id,
            order_item_id,
            item_name,
            allocated_quantity,
            allocated_amount
          )
          VALUES (
            $1,
            $2,
            'Completion Test Meal',
            1,
            10.00
          )
        `,
        [checkId, orderItemId],
      );

      const response = await request(createApp())
        .post("/api/payments")
        .set("x-user-id", userId)
        .send({
          method: "card",
          allocations: [
            {
              checkId,
              allocatedAmount: 10.66,
            },
          ],
          processorReference: `terminal-${randomUUID()}`,
        });

      expect(response.status).toBe(201);
      paymentId = paymentSchema.parse(response.body).id;

      const party = await pool.query<{
        status: string;
        completed_at: Date | null;
      }>(
        `
          SELECT status, completed_at
          FROM parties
          WHERE id = $1
        `,
        [partyId],
      );

      expect(party.rows[0]?.status).toBe("completed");
      expect(party.rows[0]?.completed_at).not.toBeNull();

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

      const events = await pool.query<{
        event_type: string;
        actor_user_id: string | null;
      }>(
        `
          SELECT event_type, actor_user_id
          FROM party_events
          WHERE party_id = $1
        `,
        [partyId],
      );

      expect(events.rows).toEqual([
        {
          event_type: "completed",
          actor_user_id: null,
        },
      ]);
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
        "DELETE FROM check_items WHERE check_id = $1",
        [checkId],
      );

      await pool.query(
        "DELETE FROM checks WHERE id = $1",
        [checkId],
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
        "DELETE FROM order_items WHERE order_id = $1",
        [orderId],
      );

      await pool.query(
        "DELETE FROM orders WHERE id = $1",
        [orderId],
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
        "DELETE FROM menu_items WHERE id = $1",
        [menuItemId],
      );

      await pool.query(
        "DELETE FROM users WHERE id = $1",
        [userId],
      );
    }
  });
});
