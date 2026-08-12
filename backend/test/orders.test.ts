import { randomUUID } from "node:crypto";
import { orderSchema } from "@lazy-janes/shared";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";

afterAll(async () => {
  await pool.end();
});

describe("POST /api/orders", () => {
  it("submits a dine-in order and starts service", async () => {
    const staffId = randomUUID();
    const partyId = randomUUID();
    const menuItemId = randomUUID();
    const modifierId = randomUUID();
    let orderId: string | undefined;

    try {
      await pool.query(
        `
          INSERT INTO staff (id, display_name)
          VALUES ($1, 'Order Test Server')
        `,
        [staffId],
      );

      await pool.query(
        `
          INSERT INTO parties (
            id,
            guest_count,
            status,
            created_by_staff_id
          )
          VALUES ($1, 4, 'seated', $2)
        `,
        [partyId, staffId],
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
        [modifierId, menuItemId],
      );

      const response = await request(createApp())
        .post("/api/orders")
        .set("x-staff-id", staffId)
        .send({
          partyId,
          fulfillmentType: "dine_in",
          items: [
            {
              menuItemId,
              quantity: 1,
              seatNumber: 1,
              kitchenNote: "Well done",
              modifierItemIds: [modifierId],
            },
          ],
        });

      expect(response.status).toBe(201);

      const order = orderSchema.parse(response.body);
      orderId = order.id;

      expect(order.partyId).toBe(partyId);
      expect(order.items).toHaveLength(1);
      expect(order.items[0]?.itemName).toBe("Test Omelette");
      expect(order.items[0]?.unitPrice).toBe(12.5);
      expect(order.items[0]?.status).toBe("submitted");
      expect(order.items[0]?.modifiers).toEqual([
        expect.objectContaining({
          menuItemId: modifierId,
          modifierName: "Add Cheddar",
          priceAdjustment: 1.25,
        }),
      ]);

      const party = await pool.query<{ status: string }>(
        `
          SELECT status
          FROM parties
          WHERE id = $1
        `,
        [partyId],
      );

      expect(party.rows[0]?.status).toBe("in_service");

      const partyEvents = await pool.query<{
        event_type: string;
      }>(
        `
          SELECT event_type
          FROM party_events
          WHERE party_id = $1
          ORDER BY occurred_at, id
        `,
        [partyId],
      );

      expect(
        partyEvents.rows.map((event) => event.event_type),
      ).toEqual(["service_started"]);
    } finally {
      if (orderId) {
        await pool.query(
          `
            DELETE FROM order_item_modifiers
            WHERE order_item_id IN (
              SELECT id
              FROM order_items
              WHERE order_id = $1
            )
          `,
          [orderId],
        );

        await pool.query(
          `
            DELETE FROM order_item_events
            WHERE order_item_id IN (
              SELECT id
              FROM order_items
              WHERE order_id = $1
            )
          `,
          [orderId],
        );

        await pool.query(
          "DELETE FROM order_items WHERE order_id = $1",
          [orderId],
        );

        await pool.query(
          "DELETE FROM order_events WHERE order_id = $1",
          [orderId],
        );

        await pool.query(
          "DELETE FROM orders WHERE id = $1",
          [orderId],
        );
      }

      await pool.query(
        "DELETE FROM party_events WHERE party_id = $1",
        [partyId],
      );

      await pool.query(
        "DELETE FROM parties WHERE id = $1",
        [partyId],
      );

      await pool.query(
        "DELETE FROM menu_items WHERE id = $1",
        [modifierId],
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
