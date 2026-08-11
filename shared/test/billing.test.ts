import { describe, expect, it } from "vitest";
import {
  CHECK_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  checkStatusSchema,
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
