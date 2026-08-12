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

export const createCheckItemInputSchema = z.object({
  orderItemId: z.string().uuid(),
  allocatedQuantity: z
    .number()
    .positive()
    .multipleOf(0.001),
});

export type CreateCheckItemInput = z.infer<
  typeof createCheckItemInputSchema
>;

export const createCheckInputSchema = z
  .object({
    partyId: z.string().uuid().nullable().default(null),
    label: z.string().trim().min(1).max(100),
    items: z.array(createCheckItemInputSchema).min(1),
  })
  .refine(
    (check) =>
      new Set(
        check.items.map((item) => item.orderItemId),
      ).size === check.items.length,
    "An order item cannot appear twice on one check",
  );

export type CreateCheckInput = z.infer<
  typeof createCheckInputSchema
>;
