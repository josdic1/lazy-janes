import { randomUUID } from "node:crypto";
import { checkSchema } from "@lazy-janes/shared";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

afterAll(async () => {
  await pool.end();
});

describe("POST /api/checks", () => {
  it("creates a taxed check and prevents over-allocation", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const modifierMenuItemId = randomUUID();
    const orderId = randomUUID();
    const orderItemId = randomUUID();
    let checkId: string | undefined;

    try {
      const agent =
        await createAuthenticatedTestUser({
          userId,
          displayName: "Check Test Server",
          roles: ["server"],
        });

      await pool.query(
        `
          INSERT INTO menu_items (
            id,
            name,
            category_id,
            price
          )
          VALUES ($1, 'Test Omelette', (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1), 12.50)
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO menu_items (
            id,
            parent_item_id,
            name,
            category_id,
            price,
            is_modifier
          )
          VALUES (
            $1,
            $2,
            'Add Cheddar',
            (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1),
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
        [orderItemId, orderId, menuItemId, userId],
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

      const created = await agent
        .post("/api/checks")
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

      const overAllocated = await agent
        .post("/api/checks")
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

      await deleteAuthenticatedTestUser(userId);
    }
  });
});

describe("POST /api/checks/:checkId/present", () => {
  it("presents an open check and records the action", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const orderId = randomUUID();
    const orderItemId = randomUUID();
    const checkId = randomUUID();

    try {
      const agent =
        await createAuthenticatedTestUser({
          userId,
          displayName: "Present Check Test Server",
          roles: ["server"],
        });

      await pool.query(
        `
          INSERT INTO menu_items (
            id,
            name,
            category_id,
            price
          )
          VALUES ($1, 'Test Coffee', (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1), 3.00)
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
            'Test Coffee',
            3.00
          )
        `,
        [orderItemId, orderId, menuItemId, userId],
      );

      await pool.query(
        `
          INSERT INTO checks (
            id,
            label,
            opened_by_user_id,
            subtotal_amount,
            tax_amount,
            total_amount
          )
          VALUES ($1, 'Takeout', $2, 3.00, 0.20, 3.20)
        `,
        [checkId, userId],
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
          VALUES ($1, $2, 'Test Coffee', 1, 3.00)
        `,
        [checkId, orderItemId],
      );

      const response = await agent
        .post(`/api/checks/${checkId}/present`);

      expect(response.status).toBe(200);

      const check = checkSchema.parse(response.body);

      expect(check.status).toBe("presented");
      expect(check.presentedAt).not.toBeNull();
      expect(check.closedAt).toBeNull();
      expect(check.items).toEqual([
        expect.objectContaining({
          orderItemId,
          itemName: "Test Coffee",
          allocatedQuantity: 1,
          allocatedAmount: 3,
        }),
      ]);

      const events = await pool.query<{
        event_type: string;
        actor_user_id: string | null;
      }>(
        `
          SELECT event_type, actor_user_id
          FROM check_events
          WHERE check_id = $1
          ORDER BY occurred_at, id
        `,
        [checkId],
      );

      expect(events.rows).toEqual([
        {
          event_type: "presented",
          actor_user_id: userId,
        },
      ]);

      const repeated = await agent
        .post(`/api/checks/${checkId}/present`);

      expect(repeated.status).toBe(409);
      expect(repeated.body.error).toBe(
        "Only an open check can be presented",
      );
    } finally {
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
        "DELETE FROM order_items WHERE order_id = $1",
        [orderId],
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
