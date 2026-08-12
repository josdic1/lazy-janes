import { describe, expect, it } from "vitest";
import {
  CHECK_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
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
    expect(checkStatusSchema.safeParse("reopened").success).toBe(false);
  });

  it("accepts every payment status", () => {
    for (const status of PAYMENT_STATUSES) {
      expect(paymentStatusSchema.parse(status)).toBe(status);
    }
  });

  it("keeps refunds separate from payment status", () => {
    expect(paymentStatusSchema.safeParse("refunded").success).toBe(false);
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
