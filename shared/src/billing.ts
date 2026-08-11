import { z } from "zod";

export const CHECK_STATUSES = [
  "open",
  "presented",
  "closed",
] as const;

export const checkStatusSchema = z.enum(CHECK_STATUSES);

export type CheckStatus = z.infer<typeof checkStatusSchema>;

export const PAYMENT_STATUSES = [
  "pending",
  "succeeded",
  "failed",
  "voided",
] as const;

export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const PAYMENT_METHODS = ["cash", "card"] as const;

export const paymentMethodSchema = z.enum(PAYMENT_METHODS);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
