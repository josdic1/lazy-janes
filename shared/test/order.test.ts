import { describe, expect, it } from "vitest";
import {
  FULFILLMENT_TYPES,
  ORDER_ITEM_STATUSES,
  fulfillmentTypeSchema,
  orderItemStatusSchema,
} from "../src/index.js";

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
    expect(fulfillmentTypeSchema.safeParse("to_go").success).toBe(false);
  });

  it("does not create fake draft or held statuses", () => {
    expect(orderItemStatusSchema.safeParse("draft").success).toBe(false);
    expect(orderItemStatusSchema.safeParse("held").success).toBe(false);
  });
});
