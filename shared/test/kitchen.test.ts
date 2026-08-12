import { describe, expect, it } from "vitest";
import {
  KITCHEN_CHIT_PRINT_KINDS,
  kitchenChitPrintKindSchema,
  kitchenChitSchema,
  markKitchenItemsReadyInputSchema,
} from "../src/index.js";

describe("kitchen chit contract", () => {
  it("accepts initial and refire chits", () => {
    for (const kind of KITCHEN_CHIT_PRINT_KINDS) {
      expect(kitchenChitPrintKindSchema.parse(kind)).toBe(
        kind,
      );
    }
  });

  it("requires at least one printed order item", () => {
    const chit = {
      id: "cb73360f-8385-4d96-9022-1459823fef64",
      chitNumber: 1,
      orderId:
        "88e8ebf3-fcda-4a83-927e-bc29d1af3110",
      printKind: "initial",
      printedByStaffId:
        "bbfabd62-527b-4999-aaaf-6d35ed86716f",
      note: null,
      printedAt: "2026-08-12T15:30:00.000Z",
      cancelledAt: null,
      items: [
        {
          orderItemId:
            "bda780db-da46-4167-a129-e647881299f1",
          displayOrder: 0,
        },
      ],
    };

    expect(kitchenChitSchema.parse(chit)).toEqual(chit);

    expect(
      kitchenChitSchema.safeParse({
        ...chit,
        items: [],
      }).success,
    ).toBe(false);
  });
});

describe("mark kitchen items ready contract", () => {
  it("requires unique order item IDs", () => {
    const orderItemId =
      "bda780db-da46-4167-a129-e647881299f1";

    expect(
      markKitchenItemsReadyInputSchema.parse({
        orderItemIds: [orderItemId],
      }),
    ).toEqual({
      orderItemIds: [orderItemId],
    });

    expect(
      markKitchenItemsReadyInputSchema.safeParse({
        orderItemIds: [],
      }).success,
    ).toBe(false);

    expect(
      markKitchenItemsReadyInputSchema.safeParse({
        orderItemIds: [orderItemId, orderItemId],
      }).success,
    ).toBe(false);
  });
});
