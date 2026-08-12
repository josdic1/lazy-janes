import { describe, expect, it } from "vitest";
import {
  CHECK_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  checkSchema,
  checkStatusSchema,
  createCheckInputSchema,
  paymentMethodSchema,
  paymentStatusSchema,
} from "../src/index.js";

describe("billing contract", () => {
  it("accepts every check status", () => {
    for (const status of CHECK_STATUSES) {
      expect(checkStatusSchema.parse(status)).toBe(status);
    }
  });

  it("derives paid and records reopen as an action", () => {
    expect(checkStatusSchema.safeParse("paid").success).toBe(false);
    expect(
      checkStatusSchema.safeParse("reopened").success,
    ).toBe(false);
  });

  it("accepts every payment status", () => {
    for (const status of PAYMENT_STATUSES) {
      expect(paymentStatusSchema.parse(status)).toBe(status);
    }
  });

  it("keeps refunds separate from payment status", () => {
    expect(
      paymentStatusSchema.safeParse("refunded").success,
    ).toBe(false);
  });

  it("accepts cash and card payments", () => {
    for (const method of PAYMENT_METHODS) {
      expect(paymentMethodSchema.parse(method)).toBe(method);
    }
  });
});

describe("create check contract", () => {
  it("accepts whole and split item quantities", () => {
    const firstItemId =
      "59cef250-353c-451f-bbba-dba6ff724225";
    const sharedItemId =
      "292c45bf-cefb-47d0-899f-b7ded3a5c65b";

    expect(
      createCheckInputSchema.parse({
        label: "Seats 1, 6, and 7",
        items: [
          {
            orderItemId: firstItemId,
            allocatedQuantity: 1,
          },
          {
            orderItemId: sharedItemId,
            allocatedQuantity: 0.5,
          },
        ],
      }),
    ).toEqual({
      partyId: null,
      label: "Seats 1, 6, and 7",
      items: [
        {
          orderItemId: firstItemId,
          allocatedQuantity: 1,
        },
        {
          orderItemId: sharedItemId,
          allocatedQuantity: 0.5,
        },
      ],
    });
  });

  it("rejects duplicate items on one check", () => {
    const orderItemId =
      "59cef250-353c-451f-bbba-dba6ff724225";

    expect(
      createCheckInputSchema.safeParse({
        label: "Duplicate",
        items: [
          {
            orderItemId,
            allocatedQuantity: 0.5,
          },
          {
            orderItemId,
            allocatedQuantity: 0.5,
          },
        ],
      }).success,
    ).toBe(false);
  });
});

describe("check response contract", () => {
  it("preserves money, tax rate, and allocated items", () => {
    const check = {
      id: "b5e6b80d-bdf6-4c50-86ba-a763b49c665e",
      partyId: "7370e33a-a4c8-4183-8f49-984a59aa09c2",
      label: "Seats 1 and 2",
      status: "open" as const,
      openedByStaffId:
        "1994b589-470a-4d15-930f-cd59bc149c15",
      subtotalAmount: 16.95,
      salesTaxRate: 0.06625,
      taxAmount: 1.12,
      totalAmount: 18.07,
      presentedAt: null,
      closedAt: null,
      createdAt: "2026-08-12T15:00:00.000Z",
      updatedAt: "2026-08-12T15:00:00.000Z",
      items: [
        {
          id: "a8403b15-a551-4633-afd6-401f9751ed78",
          orderItemId:
            "59cef250-353c-451f-bbba-dba6ff724225",
          itemName: "Drunken Chicken",
          allocatedQuantity: 1,
          allocatedAmount: 16.95,
          createdAt: "2026-08-12T15:00:00.000Z",
        },
      ],
    };

    expect(checkSchema.parse(check)).toEqual(check);
  });
});
