import { randomUUID } from "node:crypto";
import { checkSchema } from "@lazy-janes/shared";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";

afterAll(async () => {
  await pool.end();
});

describe("POST /api/checks", () => {
  it("creates a taxed check and prevents over-allocation", async () => {
    const staffId = randomUUID();
    const menuItemId = randomUUID();
    const modifierMenuItemId = randomUUID();
    const orderId = randomUUID();
    const orderItemId = randomUUID();
    let checkId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO staff (id, display_name)
          VALUES ($1, 'Check Test Server')
        `,
        [staffId],
      );

      await pool.query(
        `
          INSERT INTO menu_items (
            id,
            name,
            category,
            price
          )
          VALUES ($1, 'Test Omelette', 'Test', 12.50)
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO menu_items (
            id,
            parent_item_id,
            name,
            category,
            price,
            is_modifier
          )
          VALUES (
            $1,
            $2,
            'Add Cheddar',
            'Test',
            1.25,
            true
          )
        `,
        [modifierMenuItemId, menuItemId],
      );

      await pool.query(
        `
          INSERT INTO orders (
            id,
            fulfillment_type,
            created_by_staff_id
          )
          VALUES ($1, 'takeout', $2)
        `,
        [orderId, staffId],
      );

      await pool.query(
        `
          INSERT INTO order_items (
            id,
            order_id,
            menu_item_id,
            created_by_staff_id,
            item_name,
            unit_price,
            quantity
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            'Test Omelette',
            12.50,
            2
          )
        `,
        [orderItemId, orderId, menuItemId, staffId],
      );

      await pool.query(
        `
          INSERT INTO order_item_modifiers (
            order_item_id,
            menu_item_id,
            modifier_name,
            price_adjustment
          )
          VALUES ($1, $2, 'Add Cheddar', 1.25)
        `,
        [orderItemId, modifierMenuItemId],
      );

      const created = await request(createApp())
        .post("/api/checks")
        .set("x-staff-id", staffId)
        .send({
          label: "First half",
          items: [
            {
              orderItemId,
              allocatedQuantity: 0.5,
            },
          ],
        });

      expect(created.status).toBe(201);

      const check = checkSchema.parse(created.body);
      checkId = check.id;

      expect(check.partyId).toBeNull();
      expect(check.subtotalAmount).toBe(6.88);
      expect(check.salesTaxRate).toBe(0.06625);
      expect(check.taxAmount).toBe(0.46);
      expect(check.totalAmount).toBe(7.34);
      expect(check.items).toEqual([
        expect.objectContaining({
          orderItemId,
          itemName: "Test Omelette",
          allocatedQuantity: 0.5,
          allocatedAmount: 6.88,
        }),
      ]);

      const events = await pool.query<{
        event_type: string;
      }>(
        `
          SELECT event_type
          FROM check_events
          WHERE check_id = $1
          ORDER BY occurred_at, id
        `,
        [checkId],
      );

      expect(
        events.rows.map((event) => event.event_type),
      ).toEqual(["created"]);

      const overAllocated = await request(createApp())
        .post("/api/checks")
        .set("x-staff-id", staffId)
        .send({
          label: "Too much",
          items: [
            {
              orderItemId,
              allocatedQuantity: 1.75,
            },
          ],
        });

      expect(overAllocated.status).toBe(409);
      expect(overAllocated.body.error).toBe(
        "Test Omelette is over-allocated",
      );
    } finally {
      if (checkId) {
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
      }

      await pool.query(
        `
          DELETE FROM order_item_modifiers
          WHERE order_item_id = $1
        `,
        [orderItemId],
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
        "DELETE FROM menu_items WHERE id = $1",
        [modifierMenuItemId],
      );

      await pool.query(
        "DELETE FROM menu_items WHERE id = $1",
        [menuItemId],
      );

      await pool.query(
        "DELETE FROM staff WHERE id = $1",
        [staffId],
      );
    }
  });
});
