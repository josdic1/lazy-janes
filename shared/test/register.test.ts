import { describe, expect, it } from "vitest";
import {
  closeDrawerInputSchema,
  drawerSessionSchema,
  openDrawerInputSchema,
} from "../src/index.js";

describe("register contract", () => {
  it("accepts opening and closing cash counts", () => {
    expect(
      openDrawerInputSchema.parse({
        openingCashAmount: 150,
      }),
    ).toEqual({
      openingCashAmount: 150,
    });

    expect(
      closeDrawerInputSchema.parse({
        countedCashAmount: 162.5,
      }),
    ).toEqual({
      countedCashAmount: 162.5,
    });
  });

  it("preserves the complete drawer session", () => {
    const drawer = {
      id: "369c99a9-824a-444a-9a4c-f98904873239",
      openedByUserId:
        "a49a6205-9db2-43c7-a917-3a6dc71c44f2",
      openingCashAmount: 150,
      openedAt: "2026-08-12T13:00:00.000Z",
      closedByUserId: null,
      expectedCashAmount: null,
      countedCashAmount: null,
      varianceAmount: null,
      closedAt: null,
    };

    expect(drawerSessionSchema.parse(drawer)).toEqual(drawer);
  });

  it("rejects negative or fractional-cent money", () => {
    expect(
      openDrawerInputSchema.safeParse({
        openingCashAmount: -1,
      }).success,
    ).toBe(false);

    expect(
      closeDrawerInputSchema.safeParse({
        countedCashAmount: 10.001,
      }).success,
    ).toBe(false);
  });
});
