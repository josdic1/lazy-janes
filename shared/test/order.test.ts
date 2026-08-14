import { describe, expect, it } from "vitest";
import {
  FULFILLMENT_TYPES,
  ORDER_ITEM_STATUSES,
  createOrderInputSchema,
  deliverOrderItemsInputSchema,
  fireOrderInputSchema,
  orderSchema,
  fulfillmentTypeSchema,
  orderItemStatusSchema,
} from "../src/index.js";

const menuItemId =
  "75a063fd-b37a-48af-a0bb-457504cdc51e";

describe("order contract", () => {
  it("accepts every fulfillment type", () => {
    for (const type of FULFILLMENT_TYPES) {
      expect(fulfillmentTypeSchema.parse(type)).toBe(type);
    }
  });

  it("accepts every order-item status", () => {
    for (const status of ORDER_ITEM_STATUSES) {
      expect(orderItemStatusSchema.parse(status)).toBe(status);
    }
  });

  it("uses takeout as the canonical term", () => {
    expect(
      fulfillmentTypeSchema.safeParse("to_go").success,
    ).toBe(false);
  });

  it("does not create fake draft or held statuses", () => {
    expect(
      orderItemStatusSchema.safeParse("draft").success,
    ).toBe(false);

    expect(
      orderItemStatusSchema.safeParse("held").success,
    ).toBe(false);
  });

  it("applies safe defaults to a takeout order", () => {
    expect(
      createOrderInputSchema.parse({
        fulfillmentType: "takeout",
        items: [{ menuItemId }],
      }),
    ).toEqual({
      partyId: null,
      fulfillmentType: "takeout",
      customerName: null,
      customerPhone: null,
      deliveryAddress: null,
      requestedFor: null,
      items: [
        {
          menuItemId,
          quantity: 1,
          seatNumber: null,
          kitchenNote: null,
          removedIngredientIds: [],
          sideIngredientIds: [],
          extraIngredientIds: [],
          addedIngredientIds: [],
          choiceOptionIds: [],
          modifierItemIds: [],
        },
      ],
    });
  });

  it("requires a party for dine-in", () => {
    expect(
      createOrderInputSchema.safeParse({
        fulfillmentType: "dine_in",
        items: [{ menuItemId }],
      }).success,
    ).toBe(false);
  });

  it("requires an address for delivery", () => {
    expect(
      createOrderInputSchema.safeParse({
        fulfillmentType: "delivery",
        items: [{ menuItemId }],
      }).success,
    ).toBe(false);
  });

  it("rejects a repeated modifier on one item", () => {
    const modifierId =
      "47f58dcf-d8a4-466a-a534-f62e182e936b";

    expect(
      createOrderInputSchema.safeParse({
        fulfillmentType: "takeout",
        items: [
          {
            menuItemId,
            modifierItemIds: [modifierId, modifierId],
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("rejects contradictory changes to one ingredient", () => {
    const ingredientId =
      "47f58dcf-d8a4-466a-a534-f62e182e936b";

    expect(
      createOrderInputSchema.safeParse({
        fulfillmentType: "takeout",
        items: [
          {
            menuItemId,
            removedIngredientIds: [ingredientId],
            sideIngredientIds: [ingredientId],
          },
        ],
      }).success,
    ).toBe(false);

    expect(
      createOrderInputSchema.safeParse({
        fulfillmentType: "takeout",
        items: [
          {
            menuItemId,
            sideIngredientIds: [ingredientId],
            extraIngredientIds: [ingredientId],
          },
        ],
      }).success,
    ).toBe(false);
  });
});

describe("order response", () => {
  it("accepts a submitted order with its items", () => {
    const order = {
      id: "959083d6-538c-465d-9c4b-b16da2565744",
      partyId: null,
      fulfillmentType: "takeout",
      createdByUserId:
        "96a370c4-c87d-465c-99fd-d41d480a102d",
      customerName: "Jane",
      customerPhone: null,
      deliveryAddress: null,
      requestedFor: null,
      submittedAt: "2026-08-12T15:00:00.000Z",
      cancelledAt: null,
      cancelledByUserId: null,
      cancellationReason: null,
      createdAt: "2026-08-12T15:00:00.000Z",
      items: [
        {
          id: "629836bb-811f-40dd-b686-61136c981597",
          menuItemId,
          seatNumber: null,
          itemName: "Coffee",
          unitPrice: 3,
          quantity: 1,
          kitchenNote: null,
          status: "submitted",
          submittedAt: "2026-08-12T15:00:00.000Z",
          firedAt: null,
          readyAt: null,
          fulfilledAt: null,
          voidedAt: null,
          voidedByUserId: null,
          voidReason: null,
          ingredientChanges: [],
          choiceSelections: [],
          modifiers: [],
        },
      ],
    };

    expect(orderSchema.parse(order)).toEqual(order);
  });
});

describe("fire order contract", () => {
  it("requires unique submitted item IDs", () => {
    const orderItemId =
      "629836bb-811f-40dd-b686-61136c981597";

    expect(
      fireOrderInputSchema.parse({
        orderItemIds: [orderItemId],
      }),
    ).toEqual({
      orderItemIds: [orderItemId],
      note: null,
    });

    expect(
      fireOrderInputSchema.safeParse({
        orderItemIds: [],
      }).success,
    ).toBe(false);

    expect(
      fireOrderInputSchema.safeParse({
        orderItemIds: [orderItemId, orderItemId],
      }).success,
    ).toBe(false);
  });
});

describe("deliver order items contract", () => {
  it("requires unique order item IDs", () => {
    const orderItemId =
      "629836bb-811f-40dd-b686-61136c981597";

    expect(
      deliverOrderItemsInputSchema.parse({
        orderItemIds: [orderItemId],
      }),
    ).toEqual({
      orderItemIds: [orderItemId],
    });

    expect(
      deliverOrderItemsInputSchema.safeParse({
        orderItemIds: [],
      }).success,
    ).toBe(false);

    expect(
      deliverOrderItemsInputSchema.safeParse({
        orderItemIds: [orderItemId, orderItemId],
      }).success,
    ).toBe(false);
  });
});
