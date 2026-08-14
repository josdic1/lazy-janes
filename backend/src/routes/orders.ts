import {
  cancelOrderInputSchema,
  createOrderInputSchema,
  deliverOrderItemsInputSchema,
  fireOrderInputSchema,
  markKitchenItemsReadyInputSchema,
  voidOrderItemsInputSchema,
  type AllergenFlag,
  type KitchenChit,
  type Order,
  type OrderItem,
  type OrderItemChoiceSelection,
  type OrderItemIngredientChange,
  type OrderItemModifier,
  type PartyStatus,
} from "@lazy-janes/shared";
import { Router } from "express";
import { z } from "zod";
import {
  getAuthenticatedUser,
  requireAnyRole,
  requireAuthenticatedUser,
} from "../auth/session.js";
import { pool } from "../db/pool.js";

type MenuRow = {
  id: string;
  name: string;
  price: string;
  status: string;
  is_modifier: boolean;
};

type OrderRow = {
  id: string;
  party_id: string | null;
  fulfillment_type: Order["fulfillmentType"];
  created_by_user_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  requested_for: Date | null;
  delivery_address: string | null;
  submitted_at: Date;
  cancelled_at: Date | null;
  cancelled_by_user_id: string | null;
  cancellation_reason: string | null;
  created_at: Date;
};

type OrderItemRow = {
  id: string;
  menu_item_id: string;
  seat_number: number | null;
  item_name: string;
  unit_price: string;
  quantity: number;
  kitchen_note: string | null;
  status: OrderItem["status"];
  submitted_at: Date;
  fired_at: Date | null;
  ready_at: Date | null;
  fulfilled_at: Date | null;
  voided_at: Date | null;
  voided_by_user_id: string | null;
  void_reason: string | null;
};

type ModifierRow = {
  id: string;
  menu_item_id: string;
  modifier_name: string;
  price_adjustment: string;
};

type IngredientRuleRow = {
  ingredient_id: string;
  ingredient_name: string;
  allergen_flags: AllergenFlag[];
  is_active: boolean;
  can_remove: boolean;
  can_side: boolean;
  can_extra: boolean;
  extra_price: string;
  extra_price_configured: boolean;
  default_add_price: string;
  add_price_configured: boolean;
};

type ChoiceRuleRow = {
  group_id: string;
  group_label: string;
  min_selections: number;
  max_selections: number | null;
  option_id: string;
  option_label: string;
  ingredient_id: string | null;
  price_adjustment: string;
};

type IngredientChangeRow = {
  id: string;
  ingredient_id: string;
  ingredient_name: string;
  change_kind: OrderItemIngredientChange["changeKind"];
  price_adjustment: string;
  price_configured: boolean;
  allergen_flags: AllergenFlag[];
};

type ChoiceSelectionRow = {
  id: string;
  choice_group_id: string | null;
  choice_option_id: string | null;
  group_label: string;
  option_label: string;
  ingredient_id: string | null;
  price_adjustment: string;
};

type ItemCustomizationRules = {
  includedById: Map<string, IngredientRuleRow>;
  addableById: Map<string, IngredientRuleRow>;
  choiceRows: ChoiceRuleRow[];
};

function toModifier(row: ModifierRow): OrderItemModifier {
  return {
    id: row.id,
    menuItemId: row.menu_item_id,
    modifierName: row.modifier_name,
    priceAdjustment: Number(row.price_adjustment),
  };
}

function toIngredientChange(
  row: IngredientChangeRow,
): OrderItemIngredientChange {
  return {
    id: row.id,
    ingredientId: row.ingredient_id,
    ingredientName: row.ingredient_name,
    changeKind: row.change_kind,
    priceAdjustment: Number(row.price_adjustment),
    priceConfigured: row.price_configured,
    allergenFlags: row.allergen_flags,
  };
}

function toChoiceSelection(
  row: ChoiceSelectionRow,
): OrderItemChoiceSelection {
  return {
    id: row.id,
    choiceGroupId: row.choice_group_id,
    choiceOptionId: row.choice_option_id,
    groupLabel: row.group_label,
    optionLabel: row.option_label,
    ingredientId: row.ingredient_id,
    priceAdjustment: Number(row.price_adjustment),
  };
}

function toOrderItem(
  row: OrderItemRow,
  modifiers: OrderItemModifier[] = [],
  ingredientChanges: OrderItemIngredientChange[] = [],
  choiceSelections: OrderItemChoiceSelection[] = [],
): OrderItem {
  return {
    id: row.id,
    menuItemId: row.menu_item_id,
    seatNumber: row.seat_number,
    itemName: row.item_name,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    kitchenNote: row.kitchen_note,
    status: row.status,
    submittedAt: row.submitted_at.toISOString(),
    firedAt: row.fired_at?.toISOString() ?? null,
    readyAt: row.ready_at?.toISOString() ?? null,
    fulfilledAt: row.fulfilled_at?.toISOString() ?? null,
    voidedAt: row.voided_at?.toISOString() ?? null,
    voidedByUserId: row.voided_by_user_id,
    voidReason: row.void_reason,
    ingredientChanges,
    choiceSelections,
    modifiers,
  };
}

function toOrder(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    partyId: row.party_id,
    fulfillmentType: row.fulfillment_type,
    createdByUserId: row.created_by_user_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    requestedFor: row.requested_for?.toISOString() ?? null,
    submittedAt: row.submitted_at.toISOString(),
    cancelledAt: row.cancelled_at?.toISOString() ?? null,
    cancelledByUserId: row.cancelled_by_user_id,
    cancellationReason: row.cancellation_reason,
    createdAt: row.created_at.toISOString(),
    items,
  };
}

export const ordersRouter = Router();
ordersRouter.use(requireAuthenticatedUser);

ordersRouter.post(
  "/",
  requireAnyRole("server", "lead_server", "manager", "admin"),
  async (request, response) => {
    const input = createOrderInputSchema.safeParse(request.body);

    if (!input.success) {
      response.status(400).json({
        error: "Invalid order",
        issues: input.error.issues,
      });
      return;
    }

    const userId = getAuthenticatedUser(request).id;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `SELECT id FROM users WHERE id = $1 AND is_active = true`,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({ error: "Active user not found" });
        return;
      }

      let partyStatus: PartyStatus | null = null;

      if (input.data.partyId !== null) {
        const party = await client.query<{ status: PartyStatus }>(
          `SELECT status FROM parties WHERE id = $1 FOR UPDATE`,
          [input.data.partyId],
        );
        partyStatus = party.rows[0]?.status ?? null;

        if (partyStatus === null) {
          await client.query("ROLLBACK");
          response.status(404).json({ error: "Party not found" });
          return;
        }
        if (partyStatus === "completed" || partyStatus === "cancelled") {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "Orders cannot be added to a finished party",
          });
          return;
        }
        if (
          input.data.fulfillmentType === "dine_in" &&
          partyStatus !== "seated" &&
          partyStatus !== "in_service"
        ) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "A dine-in party must be seated first",
          });
          return;
        }
      }

      const requestedMenuIds = Array.from(
        new Set(input.data.items.map((item) => item.menuItemId)),
      );

      const menuResult = await client.query<MenuRow>(
        `
          SELECT id, name, price, status, is_modifier
          FROM menu_items
          WHERE id = ANY($1::uuid[])
          FOR SHARE
        `,
        [requestedMenuIds],
      );
      const menuById = new Map(menuResult.rows.map((item) => [item.id, item]));
      const rulesByMenuItem = new Map<string, ItemCustomizationRules>();

      for (const requestedItem of input.data.items) {
        const menuItem = menuById.get(requestedItem.menuItemId);

        if (!menuItem || menuItem.is_modifier || menuItem.status !== "available") {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "One or more menu items are unavailable",
          });
          return;
        }

        if (requestedItem.modifierItemIds.length > 0) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "Legacy menu modifiers are no longer accepted",
          });
          return;
        }

        let rules = rulesByMenuItem.get(menuItem.id);
        if (!rules) {
          const includedResult =
            await client.query<IngredientRuleRow>(
              `
                SELECT
                  ingredient.id AS ingredient_id,
                  ingredient.name AS ingredient_name,
                  ingredient.allergen_flags,
                  ingredient.is_active,
                  link.can_remove,
                  link.can_side,
                  link.can_extra,
                  link.extra_price,
                  link.extra_price_configured,
                  ingredient.default_add_price,
                  ingredient.add_price_configured
                FROM menu_item_ingredients link
                JOIN ingredients ingredient
                  ON ingredient.id = link.ingredient_id
                WHERE link.menu_item_id = $1
              `,
              [menuItem.id],
            );

          const ingredientResult =
            await client.query<IngredientRuleRow>(`
              SELECT
                ingredient.id AS ingredient_id,
                ingredient.name AS ingredient_name,
                ingredient.allergen_flags,
                ingredient.is_active,
                false AS can_remove,
                false AS can_side,
                false AS can_extra,
                0::numeric AS extra_price,
                false AS extra_price_configured,
                ingredient.default_add_price,
                ingredient.add_price_configured
              FROM ingredients ingredient
              WHERE ingredient.is_active = true
                AND ingredient.is_addable = true
            `);

          const choiceResult =
            await client.query<ChoiceRuleRow>(
              `
                SELECT
                  group_record.id AS group_id,
                  group_record.label AS group_label,
                  group_record.min_selections,
                  group_record.max_selections,
                  option_record.id AS option_id,
                  option_record.label AS option_label,
                  option_record.ingredient_id,
                  option_record.price_adjustment
                FROM menu_choice_groups group_record
                JOIN menu_choice_options option_record
                  ON option_record.choice_group_id = group_record.id
                WHERE group_record.menu_item_id = $1
                  AND group_record.is_active = true
                  AND option_record.is_active = true
                ORDER BY
                  group_record.sort_order,
                  option_record.sort_order,
                  option_record.label
              `,
              [menuItem.id],
            );

          rules = {
            includedById: new Map(
              includedResult.rows.map((row) => [row.ingredient_id, row]),
            ),
            addableById: new Map(
              ingredientResult.rows.map((row) => [row.ingredient_id, row]),
            ),
            choiceRows: choiceResult.rows,
          };
          rulesByMenuItem.set(menuItem.id, rules);
        }

        for (const ingredientId of requestedItem.removedIngredientIds) {
          const rule = rules.includedById.get(ingredientId);
          if (!rule || !rule.is_active || !rule.can_remove) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `That ingredient cannot be removed from ${menuItem.name}`,
            });
            return;
          }
        }

        for (const ingredientId of requestedItem.sideIngredientIds) {
          const rule = rules.includedById.get(ingredientId);
          if (!rule || !rule.is_active || !rule.can_side) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `That ingredient cannot be put on the side for ${menuItem.name}`,
            });
            return;
          }
        }

        for (const ingredientId of requestedItem.extraIngredientIds) {
          const rule = rules.includedById.get(ingredientId);
          if (!rule || !rule.is_active || !rule.can_extra) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `That ingredient cannot be made extra on ${menuItem.name}`,
            });
            return;
          }
        }

        for (const ingredientId of requestedItem.addedIngredientIds) {
          const includedIngredient = rules.includedById.get(ingredientId);
          if (includedIngredient) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `${includedIngredient.ingredient_name} is already in ${menuItem.name}; use Extra instead`,
            });
            return;
          }

          const ingredient = rules.addableById.get(ingredientId);
          if (!ingredient || !ingredient.is_active) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: "One or more added ingredients are not configured for ADD",
            });
            return;
          }
        }

        const selectedOptions = new Set(requestedItem.choiceOptionIds);
        const choiceByOptionId = new Map(
          rules.choiceRows.map((row) => [row.option_id, row]),
        );

        for (const optionId of selectedOptions) {
          if (!choiceByOptionId.has(optionId)) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `One or more choices are unavailable for ${menuItem.name}`,
            });
            return;
          }
        }

        const selectedChoiceIngredientIds = Array.from(selectedOptions)
          .map((optionId) => choiceByOptionId.get(optionId)?.ingredient_id ?? null)
          .filter((ingredientId): ingredientId is string => ingredientId !== null);

        if (
          new Set(selectedChoiceIngredientIds).size !==
          selectedChoiceIngredientIds.length
        ) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: `The same ingredient cannot be selected twice for ${menuItem.name}`,
          });
          return;
        }

        for (const ingredientId of requestedItem.addedIngredientIds) {
          if (selectedChoiceIngredientIds.includes(ingredientId)) {
            const ingredient = rules.addableById.get(ingredientId);
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `${ingredient?.ingredient_name ?? "That ingredient"} is already selected for ${menuItem.name}`,
            });
            return;
          }
        }

        const groups = new Map<
          string,
          { label: string; min: number; max: number | null; optionIds: string[] }
        >();

        for (const row of rules.choiceRows) {
          const current = groups.get(row.group_id);
          if (current) {
            current.optionIds.push(row.option_id);
          } else {
            groups.set(row.group_id, {
              label: row.group_label,
              min: row.min_selections,
              max: row.max_selections,
              optionIds: [row.option_id],
            });
          }
        }

        for (const group of groups.values()) {
          const selectedCount = group.optionIds.filter((id) =>
            selectedOptions.has(id),
          ).length;
          if (selectedCount < group.min) {
            const prompt = /^choose\b/i.test(group.label)
              ? group.label
              : `Choose ${group.label}`;
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `${prompt} for ${menuItem.name}`,
            });
            return;
          }
          if (group.max !== null && selectedCount > group.max) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `Too many selections in ${group.label} for ${menuItem.name}`,
            });
            return;
          }
        }
      }

      const orderResult = await client.query<OrderRow>(
        `
          INSERT INTO orders (
            party_id,
            fulfillment_type,
            created_by_user_id,
            customer_name,
            customer_phone,
            requested_for,
            delivery_address
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING
            id,
            party_id,
            fulfillment_type,
            created_by_user_id,
            customer_name,
            customer_phone,
            requested_for,
            delivery_address,
            submitted_at,
            cancelled_at,
            cancelled_by_user_id,
            cancellation_reason,
            created_at
        `,
        [
          input.data.partyId,
          input.data.fulfillmentType,
          userId,
          input.data.customerName,
          input.data.customerPhone,
          input.data.requestedFor,
          input.data.deliveryAddress,
        ],
      );

      const orderRow = orderResult.rows[0];
      if (!orderRow) throw new Error("Order insert returned no record");

      await client.query(
        `
          INSERT INTO order_events (
            order_id,
            event_type,
            actor_kind,
            actor_user_id
          )
          VALUES ($1, 'submitted', 'user', $2)
        `,
        [orderRow.id, userId],
      );

      const orderItems: OrderItem[] = [];

      for (const requestedItem of input.data.items) {
        const menuItem = menuById.get(requestedItem.menuItemId);
        const rules = rulesByMenuItem.get(requestedItem.menuItemId);
        if (!menuItem || !rules) {
          throw new Error("Validated menu item disappeared");
        }

        const itemResult = await client.query<OrderItemRow>(
          `
            INSERT INTO order_items (
              order_id,
              menu_item_id,
              created_by_user_id,
              seat_number,
              item_name,
              unit_price,
              quantity,
              kitchen_note
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING
              id,
              menu_item_id,
              seat_number,
              item_name,
              unit_price,
              quantity,
              kitchen_note,
              status,
              submitted_at,
              fired_at,
              ready_at,
              fulfilled_at,
              voided_at,
              voided_by_user_id,
              void_reason
          `,
          [
            orderRow.id,
            menuItem.id,
            userId,
            requestedItem.seatNumber,
            menuItem.name,
            menuItem.price,
            requestedItem.quantity,
            requestedItem.kitchenNote,
          ],
        );

        const itemRow = itemResult.rows[0];
        if (!itemRow) throw new Error("Order item insert returned no record");

        await client.query(
          `
            INSERT INTO order_item_events (
              order_item_id,
              event_type,
              actor_kind,
              actor_user_id
            )
            VALUES ($1, 'submitted', 'user', $2)
          `,
          [itemRow.id, userId],
        );

        const ingredientChanges: OrderItemIngredientChange[] = [];
        const changeSets = [
          ["remove", requestedItem.removedIngredientIds],
          ["side", requestedItem.sideIngredientIds],
          ["extra", requestedItem.extraIngredientIds],
          ["add", requestedItem.addedIngredientIds],
        ] as const;

        for (const [changeKind, ingredientIds] of changeSets) {
          for (const ingredientId of ingredientIds) {
            const ingredient =
              changeKind === "add"
                ? rules.addableById.get(ingredientId)
                : rules.includedById.get(ingredientId);
            if (!ingredient) {
              throw new Error("Validated ingredient disappeared");
            }

            const priceAdjustment =
              changeKind === "extra"
                ? Number(ingredient.extra_price)
                : changeKind === "add"
                  ? Number(ingredient.default_add_price)
                  : 0;

            const changeResult = await client.query<IngredientChangeRow>(
              `
                INSERT INTO order_item_ingredient_changes (
                  order_item_id,
                  ingredient_id,
                  change_kind,
                  ingredient_name,
                  price_adjustment,
                  price_configured,
                  allergen_flags
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING
                  id,
                  ingredient_id,
                  ingredient_name,
                  change_kind,
                  price_adjustment,
                  price_configured,
                  allergen_flags
              `,
              [
                itemRow.id,
                ingredient.ingredient_id,
                changeKind,
                ingredient.ingredient_name,
                priceAdjustment,
                changeKind === "remove" || changeKind === "side"
                  ? true
                  : changeKind === "extra"
                    ? ingredient.extra_price_configured
                    : ingredient.add_price_configured,
                ingredient.allergen_flags,
              ],
            );
            const row = changeResult.rows[0];
            if (!row) throw new Error("Ingredient change insert returned no record");
            ingredientChanges.push(toIngredientChange(row));
          }
        }

        const choiceSelections: OrderItemChoiceSelection[] = [];
        const choiceByOptionId = new Map(
          rules.choiceRows.map((row) => [row.option_id, row]),
        );

        for (const optionId of requestedItem.choiceOptionIds) {
          const choice = choiceByOptionId.get(optionId);
          if (!choice) throw new Error("Validated choice disappeared");

          const selectionResult = await client.query<ChoiceSelectionRow>(
            `
              INSERT INTO order_item_choice_selections (
                order_item_id,
                choice_group_id,
                choice_option_id,
                group_label,
                option_label,
                ingredient_id,
                price_adjustment
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING
                id,
                choice_group_id,
                choice_option_id,
                group_label,
                option_label,
                ingredient_id,
                price_adjustment
            `,
            [
              itemRow.id,
              choice.group_id,
              choice.option_id,
              choice.group_label,
              choice.option_label,
              choice.ingredient_id,
              choice.price_adjustment,
            ],
          );
          const row = selectionResult.rows[0];
          if (!row) throw new Error("Choice selection insert returned no record");
          choiceSelections.push(toChoiceSelection(row));
        }

        orderItems.push(
          toOrderItem(itemRow, [], ingredientChanges, choiceSelections),
        );
      }

      if (
        input.data.fulfillmentType === "dine_in" &&
        input.data.partyId !== null &&
        partyStatus === "seated"
      ) {
        await client.query(
          `
            UPDATE parties
            SET status = 'in_service', status_changed_at = now()
            WHERE id = $1
          `,
          [input.data.partyId],
        );
        await client.query(
          `
            INSERT INTO party_events (
              party_id,
              event_type,
              actor_user_id
            )
            VALUES ($1, 'service_started', $2)
          `,
          [input.data.partyId, userId],
        );
      }

      await client.query("COMMIT");
      response.status(201).json(toOrder(orderRow, orderItems));
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/fire",
  requireAnyRole(
    "server",
    "lead_server",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);

    const input = fireOrderInputSchema.safeParse(request.body);

    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({
        error: "Invalid order ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid kitchen fire",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        id: string;
        cancelled_at: Date | null;
      }>(
        `
          SELECT id, cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      const orderRow = order.rows[0];

      if (!orderRow) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (orderRow.cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A cancelled order cannot be fired",
        });
        return;
      }

      const selectedItems = await client.query<{
        id: string;
        status: OrderItem["status"];
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        selectedItems.rowCount !==
        input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error:
            "One or more order items do not belong to this order",
        });
        return;
      }

      if (
        selectedItems.rows.some(
          (item) => item.status !== "submitted",
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only submitted items can be fired",
        });
        return;
      }

      const chitResult = await client.query<{
        id: string;
        chit_number: string;
        order_id: string;
        print_kind: "initial";
        printed_by_user_id: string;
        note: string | null;
        printed_at: Date;
        cancelled_at: Date | null;
      }>(
        `
          INSERT INTO kitchen_chits (
            order_id,
            print_kind,
            printed_by_user_id,
            note
          )
          VALUES ($1, 'initial', $2, $3)
          RETURNING
            id,
            chit_number,
            order_id,
            print_kind,
            printed_by_user_id,
            note,
            printed_at,
            cancelled_at
        `,
        [orderId.data, userId, input.data.note],
      );

      const chitRow = chitResult.rows[0];

      if (!chitRow) {
        throw new Error("Kitchen chit insert returned no record");
      }

      await client.query(
        `
          INSERT INTO kitchen_chit_items (
            kitchen_chit_id,
            order_id,
            order_item_id,
            display_order
          )
          SELECT
            $1,
            $2,
            selected.order_item_id,
            (selected.position - 1)::integer
          FROM unnest($3::uuid[]) WITH ORDINALITY
            AS selected(order_item_id, position)
        `,
        [
          chitRow.id,
          orderId.data,
          input.data.orderItemIds,
        ],
      );

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'fired',
            fired_at = now()
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
        `,
        [orderId.data, input.data.orderItemIds],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_user_id
          )
          SELECT
            selected.order_item_id,
            'fired',
            'user',
            $2
          FROM unnest($1::uuid[])
            AS selected(order_item_id)
        `,
        [input.data.orderItemIds, userId],
      );

      await client.query(
        `
          INSERT INTO kitchen_chit_events (
            kitchen_chit_id,
            event_type,
            actor_user_id
          )
          VALUES ($1, 'printed', $2)
        `,
        [chitRow.id, userId],
      );

      await client.query("COMMIT");

      const chit: KitchenChit = {
        id: chitRow.id,
        chitNumber: Number(chitRow.chit_number),
        orderId: chitRow.order_id,
        printKind: chitRow.print_kind,
        printedByUserId: chitRow.printed_by_user_id,
        note: chitRow.note,
        printedAt: chitRow.printed_at.toISOString(),
        cancelledAt:
          chitRow.cancelled_at?.toISOString() ?? null,
        items: input.data.orderItemIds.map(
          (orderItemId, displayOrder) => ({
            orderItemId,
            displayOrder,
          }),
        ),
      };

      response.status(201).json(chit);
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/ready",
  requireAnyRole(
    "chef",
    "head_chef",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);

    const input =
      markKitchenItemsReadyInputSchema.safeParse(request.body);

    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({
        error: "Invalid order ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid ready action",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      const currentOrder = order.rows[0];

      if (!currentOrder) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (currentOrder.cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A cancelled order cannot be marked ready",
        });
        return;
      }

      const selectedItems = await client.query<{
        id: string;
        status: OrderItem["status"];
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        selectedItems.rowCount !==
        input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error:
            "One or more order items do not belong to this order",
        });
        return;
      }

      if (
        selectedItems.rows.some(
          (item) => item.status !== "fired",
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only fired items can be marked ready",
        });
        return;
      }

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'ready',
            ready_at = now()
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
        `,
        [orderId.data, input.data.orderItemIds],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_user_id
          )
          SELECT
            selected.order_item_id,
            'ready',
            'user',
            $2
          FROM unnest($1::uuid[])
            AS selected(order_item_id)
        `,
        [input.data.orderItemIds, userId],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/deliver",
  requireAnyRole(
    "server",
    "lead_server",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);

    const input =
      deliverOrderItemsInputSchema.safeParse(request.body);

    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({
        error: "Invalid order ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid delivery action",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      const currentOrder = order.rows[0];

      if (!currentOrder) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (currentOrder.cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A cancelled order cannot be delivered",
        });
        return;
      }

      const selectedItems = await client.query<{
        id: string;
        status: OrderItem["status"];
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        selectedItems.rowCount !==
        input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error:
            "One or more order items do not belong to this order",
        });
        return;
      }

      if (
        selectedItems.rows.some(
          (item) => item.status !== "ready",
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only ready items can be delivered",
        });
        return;
      }

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'fulfilled',
            fulfilled_at = now()
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
        `,
        [orderId.data, input.data.orderItemIds],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_user_id
          )
          SELECT
            selected.order_item_id,
            'fulfilled',
            'user',
            $2
          FROM unnest($1::uuid[])
            AS selected(order_item_id)
        `,
        [input.data.orderItemIds, userId],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/cancel",
  requireAnyRole(
    "lead_server",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);
    const input = cancelOrderInputSchema.safeParse(
      request.body,
    );
    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({ error: "Invalid order ID" });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid cancellation",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      if (!order.rows[0]) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (order.rows[0].cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Order is already cancelled",
        });
        return;
      }

      const checkedItems = await client.query<{ id: string }>(
        `
          SELECT check_items.id
          FROM check_items
          JOIN order_items
            ON order_items.id = check_items.order_item_id
          WHERE order_items.order_id = $1
          LIMIT 1
        `,
        [orderId.data],
      );

      if (checkedItems.rows[0]) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error:
            "An order cannot be cancelled after items are checked",
        });
        return;
      }

      const voidedItems = await client.query<{ id: string }>(
        `
          UPDATE order_items
          SET
            status = 'voided',
            voided_at = now(),
            voided_by_user_id = $2,
            void_reason = $3
          WHERE order_id = $1
            AND status <> 'voided'
          RETURNING id
        `,
        [orderId.data, userId, input.data.reason],
      );

      if (voidedItems.rows.length > 0) {
        await client.query(
          `
            INSERT INTO order_item_events (
              order_item_id,
              event_type,
              actor_kind,
              actor_user_id,
              reason
            )
            SELECT
              unnest($1::uuid[]),
              'voided',
              'user',
              $2,
              $3
          `,
          [
            voidedItems.rows.map((item) => item.id),
            userId,
            input.data.reason,
          ],
        );
      }

      await client.query(
        `
          UPDATE orders
          SET
            cancelled_at = now(),
            cancelled_by_user_id = $2,
            cancellation_reason = $3
          WHERE id = $1
        `,
        [orderId.data, userId, input.data.reason],
      );

      await client.query(
        `
          INSERT INTO order_events (
            order_id,
            event_type,
            actor_kind,
            actor_user_id,
            reason
          )
          VALUES ($1, 'cancelled', 'user', $2, $3)
        `,
        [orderId.data, userId, input.data.reason],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/void",
  requireAnyRole(
    "lead_server",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);
    const input = voidOrderItemsInputSchema.safeParse(
      request.body,
    );
    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({ error: "Invalid order ID" });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid item void",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      if (!order.rows[0]) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (order.rows[0].cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Items cannot be voided on a cancelled order",
        });
        return;
      }

      const items = await client.query<{
        id: string;
        status: string;
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        items.rows.length !== input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error:
            "One or more order items were not found on this order",
        });
        return;
      }

      if (
        items.rows.some((item) => item.status === "voided")
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "An order item is already voided",
        });
        return;
      }

      const checkedItems = await client.query<{ id: string }>(
        `
          SELECT id
          FROM check_items
          WHERE order_item_id = ANY($1::uuid[])
          LIMIT 1
        `,
        [input.data.orderItemIds],
      );

      if (checkedItems.rows[0]) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error:
            "An item cannot be voided after it is placed on a check",
        });
        return;
      }

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'voided',
            voided_at = now(),
            voided_by_user_id = $2,
            void_reason = $3
          WHERE id = ANY($1::uuid[])
        `,
        [
          input.data.orderItemIds,
          userId,
          input.data.reason,
        ],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_user_id,
            reason
          )
          SELECT
            unnest($1::uuid[]),
            'voided',
            'user',
            $2,
            $3
        `,
        [
          input.data.orderItemIds,
          userId,
          input.data.reason,
        ],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);
