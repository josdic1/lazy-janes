import { describe, expect, it } from "vitest";
import {
  cancelOrderInputSchema,
  voidOrderItemsInputSchema,
} from "../src/index.js";

describe("order correction contracts", () => {
  const orderItemId =
    "629836bb-811f-40dd-b686-61136c981597";

  it("requires a reason to cancel an order", () => {
    expect(
      cancelOrderInputSchema.parse({
        reason: "Customer changed their mind",
      }),
    ).toEqual({
      reason: "Customer changed their mind",
    });

    expect(
      cancelOrderInputSchema.safeParse({
        reason: " ",
      }).success,
    ).toBe(false);
  });

  it("requires unique items and a reason to void", () => {
    expect(
      voidOrderItemsInputSchema.parse({
        orderItemIds: [orderItemId],
        reason: "Entered twice",
      }),
    ).toEqual({
      orderItemIds: [orderItemId],
      reason: "Entered twice",
    });

    expect(
      voidOrderItemsInputSchema.safeParse({
        orderItemIds: [orderItemId, orderItemId],
        reason: "Entered twice",
      }).success,
    ).toBe(false);

    expect(
      voidOrderItemsInputSchema.safeParse({
        orderItemIds: [orderItemId],
        reason: "",
      }).success,
    ).toBe(false);
  });
});
