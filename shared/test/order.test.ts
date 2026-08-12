import { describe, expect, it } from "vitest";
import {
  FULFILLMENT_TYPES,
  ORDER_ITEM_STATUSES,
  createOrderInputSchema,
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
      requestedFor: null,
      deliveryAddress: null,
      items: [
        {
          menuItemId,
          quantity: 1,
          seatNumber: null,
          kitchenNote: null,
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
});
