import { describe, expect, it } from "vitest";
import {
  CHECK_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  checkSchema,
  checkStatusSchema,
  createCheckInputSchema,
  takePaymentInputSchema,
  paymentMethodSchema,
  paymentSchema,
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

describe("take payment contract", () => {
  const checkId =
    "b5e6b80d-bdf6-4c50-86ba-a763b49c665e";

  it("accepts cash and derives the default tip", () => {
    expect(
      takePaymentInputSchema.parse({
        method: "cash",
        allocations: [
          {
            checkId,
            allocatedAmount: 18.07,
          },
        ],
        cashReceivedAmount: 20,
      }),
    ).toEqual({
      method: "cash",
      allocations: [
        {
          checkId,
          allocatedAmount: 18.07,
        },
      ],
      tipAmount: 0,
      cashReceivedAmount: 20,
    });
  });

  it("rejects insufficient cash", () => {
    expect(
      takePaymentInputSchema.safeParse({
        method: "cash",
        allocations: [
          {
            checkId,
            allocatedAmount: 18.07,
          },
        ],
        tipAmount: 2,
        cashReceivedAmount: 20,
      }).success,
    ).toBe(false);
  });

  it("requires a card processor reference", () => {
    expect(
      takePaymentInputSchema.safeParse({
        method: "card",
        allocations: [
          {
            checkId,
            allocatedAmount: 18.07,
          },
        ],
      }).success,
    ).toBe(false);

    expect(
      takePaymentInputSchema.parse({
        method: "card",
        allocations: [
          {
            checkId,
            allocatedAmount: 18.07,
          },
        ],
        processorReference: "terminal-transaction-123",
      }),
    ).toEqual({
      method: "card",
      allocations: [
        {
          checkId,
          allocatedAmount: 18.07,
        },
      ],
      tipAmount: 0,
      processorReference: "terminal-transaction-123",
    });
  });

  it("rejects duplicate check allocations", () => {
    expect(
      takePaymentInputSchema.safeParse({
        method: "cash",
        allocations: [
          {
            checkId,
            allocatedAmount: 10,
          },
          {
            checkId,
            allocatedAmount: 8.07,
          },
        ],
        cashReceivedAmount: 20,
      }).success,
    ).toBe(false);
  });
});

describe("payment response contract", () => {
  it("preserves cash, change, drawer, and allocation", () => {
    const payment = {
      id: "61281c06-b78c-44e6-a747-529e21654b62",
      method: "cash" as const,
      status: "succeeded" as const,
      paymentAmount: 18.07,
      tipAmount: 1.93,
      receivedByStaffId:
        "1994b589-470a-4d15-930f-cd59bc149c15",
      processorReference: null,
      cashReceivedAmount: 20,
      changeGivenAmount: 0,
      drawerSessionId:
        "eff1d8c8-252a-471d-a999-a082b4ef9be1",
      succeededAt: "2026-08-12T17:00:00.000Z",
      failedAt: null,
      voidedAt: null,
      voidedByStaffId: null,
      voidReason: null,
      createdAt: "2026-08-12T17:00:00.000Z",
      allocations: [
        {
          checkId:
            "b5e6b80d-bdf6-4c50-86ba-a763b49c665e",
          allocatedAmount: 18.07,
          createdAt: "2026-08-12T17:00:00.000Z",
        },
      ],
    };

    expect(paymentSchema.parse(payment)).toEqual(payment);
  });
});
