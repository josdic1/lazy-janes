import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { pool } from "../src/db/pool.js";

afterAll(async () => {
  await pool.end();
});

describe("order correction APIs", () => {
  it("cancels an order and voids selected items with reasons", async () => {
    const staffId = randomUUID();
    const menuItemId = randomUUID();

    const cancelledOrderId = randomUUID();
    const cancelledItemIds = [
      randomUUID(),
      randomUUID(),
    ];

    const correctedOrderId = randomUUID();
    const voidedItemId = randomUUID();
    const retainedItemId = randomUUID();

    try {
      await pool.query(
        `
          INSERT INTO staff (id, display_name)
          VALUES ($1, 'Order Correction Test Server')
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
          VALUES ($1, 'Correction Test Item', 'Test', 10)
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO orders (
            id,
            fulfillment_type,
            created_by_staff_id
          )
          VALUES
            ($1, 'takeout', $3),
            ($2, 'takeout', $3)
        `,
        [cancelledOrderId, correctedOrderId, staffId],
      );

      await pool.query(
        `
          INSERT INTO order_items (
            id,
            order_id,
            menu_item_id,
            created_by_staff_id,
            item_name,
            unit_price
          )
          VALUES
            (
              $1,
              $5,
              $7,
              $8,
              'Cancelled Item One',
              10
            ),
            (
              $2,
              $5,
              $7,
              $8,
              'Cancelled Item Two',
              10
            ),
            (
              $3,
              $6,
              $7,
              $8,
              'Mistaken Item',
              10
            ),
            (
              $4,
              $6,
              $7,
              $8,
              'Retained Item',
              10
            )
        `,
        [
          cancelledItemIds[0],
          cancelledItemIds[1],
          voidedItemId,
          retainedItemId,
          cancelledOrderId,
          correctedOrderId,
          menuItemId,
          staffId,
        ],
      );

      const cancelled = await request(createApp())
        .post(`/api/orders/${cancelledOrderId}/cancel`)
        .set("x-staff-id", staffId)
        .send({
          reason: "Customer cancelled takeout",
        });

      expect(cancelled.status).toBe(204);

      const cancelledOrder = await pool.query<{
        cancelled_at: Date | null;
        cancelled_by_staff_id: string | null;
        cancellation_reason: string | null;
      }>(
        `
          SELECT
            cancelled_at,
            cancelled_by_staff_id,
            cancellation_reason
          FROM orders
          WHERE id = $1
        `,
        [cancelledOrderId],
      );

      expect(
        cancelledOrder.rows[0]?.cancelled_at,
      ).not.toBeNull();
      expect(
        cancelledOrder.rows[0]?.cancelled_by_staff_id,
      ).toBe(staffId);
      expect(
        cancelledOrder.rows[0]?.cancellation_reason,
      ).toBe("Customer cancelled takeout");

      const cancelledItems = await pool.query<{
        status: string;
        void_reason: string | null;
      }>(
        `
          SELECT status, void_reason
          FROM order_items
          WHERE order_id = $1
          ORDER BY item_name
        `,
        [cancelledOrderId],
      );

      expect(cancelledItems.rows).toEqual([
        {
          status: "voided",
          void_reason: "Customer cancelled takeout",
        },
        {
          status: "voided",
          void_reason: "Customer cancelled takeout",
        },
      ]);

      const voided = await request(createApp())
        .post(`/api/orders/${correctedOrderId}/void`)
        .set("x-staff-id", staffId)
        .send({
          orderItemIds: [voidedItemId],
          reason: "Item entered twice",
        });

      expect(voided.status).toBe(204);

      const correctedItems = await pool.query<{
        id: string;
        status: string;
        void_reason: string | null;
      }>(
        `
          SELECT id, status, void_reason
          FROM order_items
          WHERE order_id = $1
        `,
        [correctedOrderId],
      );

      const correctedById = new Map(
        correctedItems.rows.map((item) => [item.id, item]),
      );

      expect(correctedById.get(voidedItemId)).toEqual({
        id: voidedItemId,
        status: "voided",
        void_reason: "Item entered twice",
      });

      expect(correctedById.get(retainedItemId)).toEqual({
        id: retainedItemId,
        status: "submitted",
        void_reason: null,
      });

      const orderEvents = await pool.query<{
        event_type: string;
        reason: string | null;
      }>(
        `
          SELECT event_type, reason
          FROM order_events
          WHERE order_id = $1
        `,
        [cancelledOrderId],
      );

      expect(orderEvents.rows).toEqual([
        {
          event_type: "cancelled",
          reason: "Customer cancelled takeout",
        },
      ]);

      const voidEvents = await pool.query<{
        order_item_id: string;
        reason: string | null;
      }>(
        `
          SELECT order_item_id, reason
          FROM order_item_events
          WHERE event_type = 'voided'
            AND order_item_id = ANY($1::uuid[])
        `,
        [[...cancelledItemIds, voidedItemId]],
      );

      expect(voidEvents.rows).toHaveLength(3);
      expect(
        voidEvents.rows.find(
          (event) => event.order_item_id === voidedItemId,
        )?.reason,
      ).toBe("Item entered twice");
    } finally {
      await pool.query(
        `
          DELETE FROM order_item_events
          WHERE order_item_id IN (
            SELECT id
            FROM order_items
            WHERE order_id = ANY($1::uuid[])
          )
        `,
        [[cancelledOrderId, correctedOrderId]],
      );

      await pool.query(
        `
          DELETE FROM order_events
          WHERE order_id = ANY($1::uuid[])
        `,
        [[cancelledOrderId, correctedOrderId]],
      );

      await pool.query(
        `
          DELETE FROM order_items
          WHERE order_id = ANY($1::uuid[])
        `,
        [[cancelledOrderId, correctedOrderId]],
      );

      await pool.query(
        `
          DELETE FROM orders
          WHERE id = ANY($1::uuid[])
        `,
        [[cancelledOrderId, correctedOrderId]],
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
