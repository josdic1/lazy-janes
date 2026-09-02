import { randomUUID } from "node:crypto";
import { checkSchema, orderSchema, stackSnapshotSchema } from "@lazy-janes/shared";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

afterAll(async () => {
  await pool.end();
});

describe("GET /api/stack", () => {
  it("derives the observable diner state", async () => {
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
    const checkItemId = randomUUID();
    const paymentId = randomUUID();

    try {
      const agent =
        await createAuthenticatedTestUser({
          userId,
          displayName: "Stack Test Server",
          roles: ["server"],
        });

      await pool.query(
        `
          INSERT INTO sections (id, name)
          VALUES ($1, $2)
        `,
        [sectionId, `Stack Test ${sectionId}`],
      );

      await pool.query(
        `
          INSERT INTO dining_tables (
            id,
            section_id,
            label,
            capacity
          )
          VALUES ($1, $2, '12', 4)
        `,
        [tableId, sectionId],
      );

      await pool.query(
        `
          INSERT INTO parties (
            id,
            name,
            guest_count,
            status,
            created_by_user_id
          )
          VALUES ($1, 'Stack Party', 2, 'in_service', $2)
        `,
        [partyId, userId],
      );

      await pool.query(
        `
          INSERT INTO party_events (
            party_id,
            event_type,
            actor_user_id
          )
          VALUES
            ($1, 'arrived', $2),
            ($1, 'service_started', $2)
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
            category_id,
            price
          )
          VALUES ($1, 'Stack Test Meal', (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1), 10)
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
            seat_number,
            item_name,
            unit_price,
            kitchen_note,
            status,
            fired_at,
            ready_at
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            1,
            'Stack Test Meal',
            10,
            'NO SALT',
            'ready',
            now(),
            now()
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
            'Table 12',
            'presented',
            $3,
            10,
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
            id,
            check_id,
            order_item_id,
            item_name,
            allocated_quantity,
            allocated_amount
          )
          VALUES (
            $1,
            $2,
            $3,
            'Stack Test Meal',
            1,
            10
          )
        `,
        [checkItemId, checkId, orderItemId],
      );

      await pool.query(
        `
          INSERT INTO payments (
            id,
            method,
            status,
            payment_amount,
            received_by_user_id,
            processor_reference,
            succeeded_at
          )
          VALUES (
            $1,
            'card',
            'succeeded',
            5,
            $2,
            $3,
            now()
          )
        `,
        [
          paymentId,
          userId,
          `stack-terminal-${paymentId}`,
        ],
      );

      await pool.query(
        `
          INSERT INTO payment_check_allocations (
            payment_id,
            check_id,
            allocated_amount
          )
          VALUES ($1, $2, 5)
        `,
        [paymentId, checkId],
      );

      const response = await agent
        .get("/api/stack");

      expect(response.status).toBe(200);

      const snapshot = stackSnapshotSchema.parse(
        response.body,
      );

      const party = snapshot.parties.find(
        (candidate) => candidate.id === partyId,
      );

      expect(party).toBeDefined();
      expect(party?.name).toBe("Stack Party");
      expect(party?.status).toBe("in_service");
      expect(party?.tables).toEqual([
        {
          id: tableId,
          label: "12",
        },
      ]);

      expect(party?.orders).toEqual([
        expect.objectContaining({
          id: orderId,
          fulfillmentType: "dine_in",
          items: [
            expect.objectContaining({
              id: orderItemId,
              itemName: "Stack Test Meal",
              seatNumber: 1,
              status: "ready",
              kitchenNote: "NO SALT",
              kitchenDetails: [],
              allocatedQuantity: 1,
              remainingQuantity: 0,
            }),
          ],
        }),
      ]);

      expect(party?.checks).toEqual([
        {
          id: checkId,
          label: "Table 12",
          status: "presented",
          totalAmount: 10.66,
          paidAmount: 5,
          balanceAmount: 5.66,
          orderIds: [orderId],
        },
      ]);

      expect(
        party?.events.map((event) => event.eventType),
      ).toEqual(["arrived", "service_started"]);

      expect(
        party?.events.every((event) =>
          /^[1-9][0-9]*$/.test(event.id),
        ),
      ).toBe(true);
    } finally {
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

      await pool.query(
        "DELETE FROM check_items WHERE id = $1",
        [checkItemId],
      );

      await pool.query(
        "DELETE FROM checks WHERE id = $1",
        [checkId],
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
        "DELETE FROM party_events WHERE party_id = $1",
        [partyId],
      );

      await pool.query(
        "DELETE FROM seating_tables WHERE id = $1",
        [seatingTableId],
      );

      await pool.query(
        "DELETE FROM seatings WHERE id = $1",
        [seatingId],
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

      await deleteAuthenticatedTestUser(userId);
    }
  });
  it("carries customized order truth through kitchen and check", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const choiceGroupId = randomUUID();
    const choiceOptionId = randomUUID();
    const preparationSchemeId = randomUUID();
    const preparationOptionId = randomUUID();

    let orderId: string | undefined;
    let orderItemId: string | undefined;
    let checkId: string | undefined;

    try {
      const agent = await createAuthenticatedTestUser({
        userId,
        displayName: "Lifecycle Truth Test Server",
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
            'Lifecycle Test Burger',
            (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1),
            10
          )
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO preparation_schemes (
            id,
            source_key,
            label,
            kind,
            is_active,
            sort_order
          )
          VALUES (
            $1,
            $2,
            'Temperature',
            'other',
            true,
            1
          )
        `,
        [
          preparationSchemeId,
          `lifecycle_temperature_${preparationSchemeId}`,
        ],
      );

      await pool.query(
        `
          INSERT INTO preparation_options (
            id,
            preparation_scheme_id,
            label,
            sort_order,
            is_default,
            is_active
          )
          VALUES (
            $1,
            $2,
            'Well Done',
            1,
            false,
            true
          )
        `,
        [preparationOptionId, preparationSchemeId],
      );

      await pool.query(
        `
          INSERT INTO menu_choice_groups (
            id,
            menu_item_id,
            label,
            min_selections,
            max_selections,
            sort_order,
            is_active
          )
          VALUES (
            $1,
            $2,
            'Burger Style',
            1,
            1,
            1,
            true
          )
        `,
        [choiceGroupId, menuItemId],
      );

      await pool.query(
        `
          INSERT INTO menu_choice_options (
            id,
            choice_group_id,
            label,
            preparation_scheme_id,
            price_adjustment,
            price_adjustment_configured,
            sort_order,
            is_active
          )
          VALUES (
            $1,
            $2,
            'Deluxe',
            $3,
            2.50,
            true,
            1,
            true
          )
        `,
        [
          choiceOptionId,
          choiceGroupId,
          preparationSchemeId,
        ],
      );

      const created = await agent
        .post("/api/orders")
        .send({
          fulfillmentType: "takeout",
          items: [
            {
              menuItemId,
              kitchenNote: "CUT IN HALF",
              choiceOptionIds: [choiceOptionId],
              preparationSelections: [
                {
                  choiceOptionId,
                  preparationOptionId,
                },
              ],
            },
          ],
        });

      expect(created.status).toBe(201);

      const order = orderSchema.parse(created.body);
      orderId = order.id;
      orderItemId = order.items[0]?.id;

      expect(orderItemId).toBeDefined();

      expect(order.items[0]?.choiceSelections).toEqual([
        expect.objectContaining({
          choiceGroupId,
          choiceOptionId,
          groupLabel: "Burger Style",
          optionLabel: "Deluxe",
          priceAdjustment: 2.5,
        }),
      ]);

      expect(order.items[0]?.preparationSelections).toEqual([
        expect.objectContaining({
          choiceOptionId,
          preparationSchemeId,
          preparationOptionId,
          targetLabel: "Deluxe",
          schemeLabel: "Temperature",
          optionLabel: "Well Done",
        }),
      ]);

      const fired = await agent
        .post(`/api/orders/${orderId}/fire`)
        .send({
          orderItemIds: [orderItemId],
          note: null,
        });

      expect(fired.status).toBe(201);

      const stackResponse = await agent.get("/api/stack");
      expect(stackResponse.status).toBe(200);

      const snapshot = stackSnapshotSchema.parse(
        stackResponse.body,
      );
      const serialized = JSON.stringify(snapshot);

      expect(serialized).toContain(
        "Burger Style: Deluxe",
      );
      expect(serialized).toContain(
        "Deluxe: Well Done",
      );
      expect(serialized).toContain(
        "CUT IN HALF",
      );

      const createdCheck = await agent
        .post("/api/checks")
        .send({
          label: "Lifecycle check",
          items: [
            {
              orderItemId,
              allocatedQuantity: 1,
            },
          ],
        });

      expect(createdCheck.status).toBe(201);

      const check = checkSchema.parse(
        createdCheck.body,
      );
      checkId = check.id;

      expect(check.subtotalAmount).toBe(12.5);
      expect(check.items).toEqual([
        expect.objectContaining({
          orderItemId,
          itemName: "Lifecycle Test Burger",
          allocatedQuantity: 1,
          allocatedAmount: 12.5,
        }),
      ]);
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

      if (orderItemId) {
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
          "DELETE FROM order_item_preparation_selections WHERE order_item_id = $1",
          [orderItemId],
        );

        await pool.query(
          "DELETE FROM order_item_choice_selections WHERE order_item_id = $1",
          [orderItemId],
        );

        await pool.query(
          "DELETE FROM order_item_events WHERE order_item_id = $1",
          [orderItemId],
        );
      }

      if (orderId) {
        await pool.query(
          "DELETE FROM kitchen_chits WHERE order_id = $1",
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
        "DELETE FROM menu_choice_groups WHERE id = $1",
        [choiceGroupId],
      );

      await pool.query(
        "DELETE FROM menu_items WHERE id = $1",
        [menuItemId],
      );

      await pool.query(
        "DELETE FROM preparation_schemes WHERE id = $1",
        [preparationSchemeId],
      );

      await deleteAuthenticatedTestUser(userId);
    }
  });

  it("includes active takeout and delivery orders without a party", async () => {
    const userId = randomUUID();
    const menuItemId = randomUUID();
    const orderId = randomUUID();
    const orderItemId = randomUUID();

    try {
      const agent = await createAuthenticatedTestUser({
        userId,
        displayName: "Standalone Stack Test Server",
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
            'Standalone Stack Meal',
            (SELECT id FROM menu_categories ORDER BY sort_order, name LIMIT 1),
            12
          )
        `,
        [menuItemId],
      );

      await pool.query(
        `
          INSERT INTO orders (
            id,
            party_id,
            fulfillment_type,
            created_by_user_id,
            customer_name
          )
          VALUES ($1, NULL, 'takeout', $2, 'Taylor')
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
            quantity,
            status
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            'Standalone Stack Meal',
            12,
            2,
            'submitted'
          )
        `,
        [orderItemId, orderId, menuItemId, userId],
      );

      const response = await agent.get("/api/stack");

      expect(response.status).toBe(200);

      const snapshot = stackSnapshotSchema.parse(response.body);
      const order = snapshot.standaloneOrders.find(
        (candidate) => candidate.id === orderId,
      );

      expect(order).toEqual(
        expect.objectContaining({
          id: orderId,
          fulfillmentType: "takeout",
          customerName: "Taylor",
          items: [
            expect.objectContaining({
              id: orderItemId,
              quantity: 2,
              status: "submitted",
              allocatedQuantity: 0,
              remainingQuantity: 2,
            }),
          ],
        }),
      );
    } finally {
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
