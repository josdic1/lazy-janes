import { randomUUID } from "node:crypto";
import { orderSchema } from "@lazy-janes/shared";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

afterAll(async () => {
  await pool.end();
});

describe("POST /api/orders", () => {
  it("submits a dine-in order and starts service", async () => {
    const userId = randomUUID();
    const partyId = randomUUID();
    const menuItemId = randomUUID();
    const modifierId = randomUUID();
    let orderId: string | undefined;

    try {
      const agent =
        await createAuthenticatedTestUser({
          userId,
          displayName: "Order Test Server",
          roles: ["server"],
        });

      await pool.query(
        `
          INSERT INTO parties (
            id,
            guest_count,
            status,
            created_by_user_id
          )
          VALUES ($1, 4, 'seated', $2)
        `,
        [partyId, userId],
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

      const response = await agent
        .post("/api/orders")
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

      await deleteAuthenticatedTestUser(userId);
    }
  });
});

describe("POST /api/orders/:orderId/fire", () => {
  it("fires submitted items and creates one kitchen chit", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const orderId = randomUUID();
    const orderItemId = randomUUID();

    try {
      const agent =
        await createAuthenticatedTestUser({
          userId,
          displayName: "Kitchen Fire Test Server",
          roles: ["server"],
        });

      await pool.query(
        `
          INSERT INTO menu_items (
            id,
            name,
            category,
            price
          )
          VALUES ($1, 'Fire Test Burger', 'Test', 15.00)
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO orders (
            id,
            fulfillment_type,
            created_by_user_id
          )
          VALUES ($1, 'takeout', $2)
        `,
        [orderId, userId],
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
            'Fire Test Burger',
            15.00
          )
        `,
        [orderItemId, orderId, menuItemId, userId],
      );

      const response = await agent
        .post(`/api/orders/${orderId}/fire`)
        .send({
          orderItemIds: [orderItemId],
          note: "Rush",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          orderId,
          printKind: "initial",
          note: "Rush",
          items: [
            {
              orderItemId,
              displayOrder: 0,
            },
          ],
        }),
      );

      const item = await pool.query<{
        status: string;
        fired_at: Date | null;
      }>(
        `
          SELECT status, fired_at
          FROM order_items
          WHERE id = $1
        `,
        [orderItemId],
      );

      expect(item.rows[0]?.status).toBe("fired");
      expect(item.rows[0]?.fired_at).toBeInstanceOf(Date);

      const history = await pool.query<{
        order_item_event: string;
        chit_event: string;
      }>(
        `
          SELECT
            order_item_events.event_type
              AS order_item_event,
            kitchen_chit_events.event_type
              AS chit_event
          FROM kitchen_chit_items
          JOIN kitchen_chit_events
            ON kitchen_chit_events.kitchen_chit_id =
               kitchen_chit_items.kitchen_chit_id
          JOIN order_item_events
            ON order_item_events.order_item_id =
               kitchen_chit_items.order_item_id
          WHERE kitchen_chit_items.order_item_id = $1
        `,
        [orderItemId],
      );

      expect(history.rows).toEqual([
        {
          order_item_event: "fired",
          chit_event: "printed",
        },
      ]);
    } finally {
      await pool.query(
        `
          DELETE FROM kitchen_chit_events
          WHERE kitchen_chit_id IN (
            SELECT kitchen_chit_id
            FROM kitchen_chit_items
            WHERE order_item_id = $1
          )
        `,
        [orderItemId],
      );

      await pool.query(
        "DELETE FROM kitchen_chit_items WHERE order_item_id = $1",
        [orderItemId],
      );

      await pool.query(
        "DELETE FROM kitchen_chits WHERE order_id = $1",
        [orderId],
      );

      await pool.query(
        "DELETE FROM order_item_events WHERE order_item_id = $1",
        [orderItemId],
      );

      await pool.query(
        "DELETE FROM order_items WHERE id = $1",
        [orderItemId],
      );

      await pool.query(
        "DELETE FROM orders WHERE id = $1",
        [orderId],
      );

      await pool.query(
        "DELETE FROM menu_items WHERE id = $1",
        [menuItemId],
      );

      await deleteAuthenticatedTestUser(userId);
    }
  });
});

describe("POST /api/orders/:orderId/ready", () => {
  it("marks fired items ready and records history", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const orderId = randomUUID();
    const orderItemId = randomUUID();

    try {
      const agent =
        await createAuthenticatedTestUser({
          userId,
          displayName: "Kitchen Ready Test Chef",
          roles: ["chef"],
        });

      await pool.query(
        `
          INSERT INTO menu_items (
            id,
            name,
            category,
            price
          )
          VALUES ($1, 'Ready Test Burger', 'Test', 15.00)
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO orders (
            id,
            fulfillment_type,
            created_by_user_id
          )
          VALUES ($1, 'takeout', $2)
        `,
        [orderId, userId],
      );

      await pool.query(
        `
          INSERT INTO order_items (
            id,
            order_id,
            menu_item_id,
            created_by_user_id,
            item_name,
            unit_price,
            status,
            fired_at
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            'Ready Test Burger',
            15.00,
            'fired',
            now()
          )
        `,
        [orderItemId, orderId, menuItemId, userId],
      );

      const response = await agent
        .post(`/api/orders/${orderId}/ready`)
        .send({
          orderItemIds: [orderItemId],
        });

      expect(response.status).toBe(204);

      const item = await pool.query<{
        status: string;
        fired_at: Date | null;
        ready_at: Date | null;
      }>(
        `
          SELECT status, fired_at, ready_at
          FROM order_items
          WHERE id = $1
        `,
        [orderItemId],
      );

      expect(item.rows[0]?.status).toBe("ready");
      expect(item.rows[0]?.fired_at).toBeInstanceOf(Date);
      expect(item.rows[0]?.ready_at).toBeInstanceOf(Date);

      const events = await pool.query<{
        event_type: string;
        actor_user_id: string;
      }>(
        `
          SELECT event_type, actor_user_id
          FROM order_item_events
          WHERE order_item_id = $1
        `,
        [orderItemId],
      );

      expect(events.rows).toEqual([
        {
          event_type: "ready",
          actor_user_id: userId,
        },
      ]);
    } finally {
      await pool.query(
        "DELETE FROM order_item_events WHERE order_item_id = $1",
        [orderItemId],
      );

      await pool.query(
        "DELETE FROM order_items WHERE id = $1",
        [orderItemId],
      );

      await pool.query(
        "DELETE FROM orders WHERE id = $1",
        [orderId],
      );

      await pool.query(
        "DELETE FROM menu_items WHERE id = $1",
        [menuItemId],
      );

      await deleteAuthenticatedTestUser(userId);
    }
  });
});

describe("POST /api/orders/:orderId/deliver", () => {
  it("delivers ready items and records history", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const orderId = randomUUID();
    const orderItemId = randomUUID();

    try {
      const agent =
        await createAuthenticatedTestUser({
          userId,
          displayName: "Delivery Test Server",
          roles: ["server"],
        });

      await pool.query(
        `
          INSERT INTO menu_items (
            id,
            name,
            category,
            price
          )
          VALUES ($1, 'Delivery Test Burger', 'Test', 15.00)
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO orders (
            id,
            fulfillment_type,
            created_by_user_id
          )
          VALUES ($1, 'takeout', $2)
        `,
        [orderId, userId],
      );

      await pool.query(
        `
          INSERT INTO order_items (
            id,
            order_id,
            menu_item_id,
            created_by_user_id,
            item_name,
            unit_price,
            status,
            fired_at,
            ready_at
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            'Delivery Test Burger',
            15.00,
            'ready',
            now(),
            now()
          )
        `,
        [orderItemId, orderId, menuItemId, userId],
      );

      const response = await agent
        .post(`/api/orders/${orderId}/deliver`)
        .send({
          orderItemIds: [orderItemId],
        });

      expect(response.status).toBe(204);

      const item = await pool.query<{
        status: string;
        fulfilled_at: Date | null;
      }>(
        `
          SELECT status, fulfilled_at
          FROM order_items
          WHERE id = $1
        `,
        [orderItemId],
      );

      expect(item.rows[0]?.status).toBe("fulfilled");
      expect(item.rows[0]?.fulfilled_at).toBeInstanceOf(Date);

      const events = await pool.query<{
        event_type: string;
        actor_user_id: string;
      }>(
        `
          SELECT event_type, actor_user_id
          FROM order_item_events
          WHERE order_item_id = $1
        `,
        [orderItemId],
      );

      expect(events.rows).toEqual([
        {
          event_type: "fulfilled",
          actor_user_id: userId,
        },
      ]);
    } finally {
      await pool.query(
        "DELETE FROM order_item_events WHERE order_item_id = $1",
        [orderItemId],
      );

      await pool.query(
        "DELETE FROM order_items WHERE id = $1",
        [orderItemId],
      );

      await pool.query(
        "DELETE FROM orders WHERE id = $1",
        [orderId],
      );

      await pool.query(
        "DELETE FROM menu_items WHERE id = $1",
        [menuItemId],
      );

      await deleteAuthenticatedTestUser(userId);
    }
  });
});
