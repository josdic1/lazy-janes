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
    const ingredientId = randomUUID();
    const ingredientName = `Order Test Cheddar ${ingredientId}`;
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
            category_id,
            price
          )
          VALUES ($1, 'Test Omelette', (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1), 12.50)
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO ingredients (
            id,
            name,
            allergen_flags
          )
          VALUES ($1, $2, ARRAY['milk']::text[])
        `,
        [ingredientId, ingredientName],
      );

      await pool.query(
        `
          INSERT INTO menu_item_ingredients (
            menu_item_id,
            ingredient_id,
            can_remove,
            can_extra,
            extra_price,
            extra_price_configured
          )
          VALUES ($1, $2, true, true, 1.25, true)
        `,
        [menuItemId, ingredientId],
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
              extraIngredientIds: [ingredientId],
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
      expect(order.items[0]?.ingredientChanges).toEqual([
        expect.objectContaining({
          ingredientId,
          ingredientName,
          changeKind: "extra",
          priceAdjustment: 1.25,
          priceConfigured: true,
          allergenFlags: ["milk"],
        }),
      ]);
      expect(order.items[0]?.modifiers).toEqual([]);

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
            DELETE FROM order_item_ingredient_changes
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
            DELETE FROM order_item_choice_selections
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
        "DELETE FROM menu_item_ingredients WHERE menu_item_id = $1",
        [menuItemId],
      );

      await pool.query(
        "DELETE FROM menu_items WHERE id = $1",
        [menuItemId],
      );

      await pool.query(
        "DELETE FROM ingredients WHERE id = $1",
        [ingredientId],
      );

      await deleteAuthenticatedTestUser(userId);
    }
  });
  it("rejects ADD when the ingredient is already included", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const ingredientId = randomUUID();

    try {
      const agent = await createAuthenticatedTestUser({
        userId,
        displayName: "Included Ingredient Rule Test Server",
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
          VALUES (
            $1,
            'Included Ingredient Rule Item',
            (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1),
            10
          )
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO ingredients (id, name)
          VALUES ($1, $2)
        `,
        [ingredientId, `Included Ingredient ${ingredientId}`],
      );

      await pool.query(
        `
          INSERT INTO menu_item_ingredients (
            menu_item_id,
            ingredient_id,
            can_remove,
            can_extra
          )
          VALUES ($1, $2, true, true)
        `,
        [menuItemId, ingredientId],
      );

      const response = await agent
        .post("/api/orders")
        .send({
          fulfillmentType: "takeout",
          items: [
            {
              menuItemId,
              addedIngredientIds: [ingredientId],
            },
          ],
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain("use Extra instead");

      const createdOrders = await pool.query<{ count: string }>(
        `
          SELECT count(*) AS count
          FROM orders
          WHERE created_by_user_id = $1
        `,
        [userId],
      );
      expect(Number(createdOrders.rows[0]?.count ?? "0")).toBe(0);
    } finally {
      await pool.query(
        "DELETE FROM menu_item_ingredients WHERE menu_item_id = $1",
        [menuItemId],
      );
      await pool.query("DELETE FROM menu_items WHERE id = $1", [menuItemId]);
      await pool.query("DELETE FROM ingredients WHERE id = $1", [ingredientId]);
      await deleteAuthenticatedTestUser(userId);
    }
  });

  it("allows ADD before price is known and records pricing truth explicitly", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const ingredientId = randomUUID();
    let orderId: string | undefined;

    try {
      const agent = await createAuthenticatedTestUser({
        userId,
        displayName: "Global Add Pricing Test Server",
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
          VALUES (
            $1,
            'Global Add Pricing Item',
            (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1),
            10
          )
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO ingredients (
            id,
            name,
            is_addable,
            default_add_price,
            add_price_configured
          )
          VALUES ($1, $2, true, 0, false)
        `,
        [ingredientId, `Global Add Ingredient ${ingredientId}`],
      );

      const response = await agent
        .post("/api/orders")
        .send({
          fulfillmentType: "takeout",
          items: [
            {
              menuItemId,
              addedIngredientIds: [ingredientId],
            },
          ],
        });

      expect(response.status).toBe(201);
      const order = orderSchema.parse(response.body);
      orderId = order.id;
      expect(order.items[0]?.ingredientChanges).toEqual([
        expect.objectContaining({
          ingredientId,
          changeKind: "add",
          priceAdjustment: 0,
          priceConfigured: false,
        }),
      ]);
    } finally {
      if (orderId) {
        await pool.query(
          `
            DELETE FROM order_item_ingredient_changes
            WHERE order_item_id IN (
              SELECT id FROM order_items WHERE order_id = $1
            )
          `,
          [orderId],
        );
        await pool.query(
          `
            DELETE FROM order_item_events
            WHERE order_item_id IN (
              SELECT id FROM order_items WHERE order_id = $1
            )
          `,
          [orderId],
        );
        await pool.query("DELETE FROM order_items WHERE order_id = $1", [orderId]);
        await pool.query("DELETE FROM order_events WHERE order_id = $1", [orderId]);
        await pool.query("DELETE FROM orders WHERE id = $1", [orderId]);
      }

      await pool.query("DELETE FROM menu_items WHERE id = $1", [menuItemId]);
      await pool.query("DELETE FROM ingredients WHERE id = $1", [ingredientId]);
      await deleteAuthenticatedTestUser(userId);
    }
  });

  it("rejects contradictory REMOVE and EXTRA for one ingredient", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const ingredientId = randomUUID();

    try {
      const agent = await createAuthenticatedTestUser({
        userId,
        displayName: "Contradictory Ingredient Rule Test Server",
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
          VALUES (
            $1,
            'Contradictory Ingredient Rule Item',
            (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1),
            10
          )
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO ingredients (id, name)
          VALUES ($1, $2)
        `,
        [ingredientId, `Contradictory Ingredient ${ingredientId}`],
      );

      await pool.query(
        `
          INSERT INTO menu_item_ingredients (
            menu_item_id,
            ingredient_id,
            can_remove,
            can_extra
          )
          VALUES ($1, $2, true, true)
        `,
        [menuItemId, ingredientId],
      );

      const response = await agent
        .post("/api/orders")
        .send({
          fulfillmentType: "takeout",
          items: [
            {
              menuItemId,
              removedIngredientIds: [ingredientId],
              extraIngredientIds: [ingredientId],
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(
        response.body.issues.some(
          (issue: { message?: string }) =>
            issue.message ===
            "An ingredient cannot have two contradictory changes",
        ),
      ).toBe(true);
    } finally {
      await pool.query(
        "DELETE FROM menu_item_ingredients WHERE menu_item_id = $1",
        [menuItemId],
      );
      await pool.query("DELETE FROM menu_items WHERE id = $1", [menuItemId]);
      await pool.query("DELETE FROM ingredients WHERE id = $1", [ingredientId]);
      await deleteAuthenticatedTestUser(userId);
    }
  });

  it("enforces required and maximum choice selections", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const groupId = randomUUID();
    const firstOptionId = randomUUID();
    const secondOptionId = randomUUID();
    const noProteinOptionId = randomUUID();
    let orderId: string | undefined;

    try {
      const agent = await createAuthenticatedTestUser({
        userId,
        displayName: "Choice Rule Test Server",
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
          VALUES (
            $1,
            'Choice Rule Item',
            (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1),
            10
          )
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO menu_choice_groups (
            id,
            menu_item_id,
            label,
            min_selections,
            max_selections
          )
          VALUES ($1, $2, 'Choose protein', 1, 1)
        `,
        [groupId, menuItemId],
      );

      await pool.query(
        `
          INSERT INTO menu_choice_options (
            id,
            choice_group_id,
            label,
            sort_order
          )
          VALUES
            ($1, $4, 'Chicken', 10),
            ($2, $4, 'Salmon', 20),
            ($3, $4, 'No Protein', 999)
        `,
        [firstOptionId, secondOptionId, noProteinOptionId, groupId],
      );

      const missing = await agent
        .post("/api/orders")
        .send({
          fulfillmentType: "takeout",
          items: [{ menuItemId }],
        });

      expect(missing.status).toBe(409);
      expect(missing.body.error).toBe(
        "Choose protein for Choice Rule Item",
      );

      const tooMany = await agent
        .post("/api/orders")
        .send({
          fulfillmentType: "takeout",
          items: [
            {
              menuItemId,
              choiceOptionIds: [firstOptionId, secondOptionId],
            },
          ],
        });

      expect(tooMany.status).toBe(409);
      expect(tooMany.body.error).toBe(
        "Too many selections in Choose protein for Choice Rule Item",
      );

      const declined = await agent
        .post("/api/orders")
        .send({
          fulfillmentType: "takeout",
          items: [
            {
              menuItemId,
              choiceOptionIds: [noProteinOptionId],
            },
          ],
        });

      expect(declined.status).toBe(201);
      const declinedOrder = orderSchema.parse(declined.body);
      orderId = declinedOrder.id;
      expect(declinedOrder.items[0]?.choiceSelections).toEqual([
        expect.objectContaining({
          choiceGroupId: groupId,
          choiceOptionId: noProteinOptionId,
          groupLabel: "Choose protein",
          optionLabel: "No Protein",
          ingredientId: null,
          priceAdjustment: 0,
        }),
      ]);

      const createdOrders = await pool.query<{ count: string }>(
        `
          SELECT count(*) AS count
          FROM orders
          WHERE created_by_user_id = $1
        `,
        [userId],
      );
      expect(Number(createdOrders.rows[0]?.count ?? "0")).toBe(1);
    } finally {
      if (orderId) {
        await pool.query(
          `
            DELETE FROM order_item_choice_selections
            WHERE order_item_id IN (
              SELECT id FROM order_items WHERE order_id = $1
            )
          `,
          [orderId],
        );
        await pool.query(
          `
            DELETE FROM order_item_events
            WHERE order_item_id IN (
              SELECT id FROM order_items WHERE order_id = $1
            )
          `,
          [orderId],
        );
        await pool.query("DELETE FROM order_items WHERE order_id = $1", [orderId]);
        await pool.query("DELETE FROM order_events WHERE order_id = $1", [orderId]);
        await pool.query("DELETE FROM orders WHERE id = $1", [orderId]);
      }

      await pool.query(
        "DELETE FROM menu_choice_groups WHERE id = $1",
        [groupId],
      );
      await pool.query("DELETE FROM menu_items WHERE id = $1", [menuItemId]);
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
            category_id,
            price
          )
          VALUES ($1, 'Fire Test Burger', (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1), 15.00)
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
            category_id,
            price
          )
          VALUES ($1, 'Ready Test Burger', (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1), 15.00)
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
            category_id,
            price
          )
          VALUES ($1, 'Delivery Test Burger', (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1), 15.00)
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
