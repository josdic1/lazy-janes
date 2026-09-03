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

export const checkPriceRequirementSchema = z.object({
  source: z.enum(["ingredient_change", "ingredient_replacement"]),
  recordId: z.string().uuid(),
  orderItemId: z.string().uuid(),
  changeKind: z.enum(["extra", "add", "replace"]),
  label: z.string().min(1),
});

export type CheckPriceRequirement = z.infer<
  typeof checkPriceRequirementSchema
>;

export const checkPriceOverrideSchema = z.object({
  source: z.enum(["ingredient_change", "ingredient_replacement"]),
  recordId: z.string().uuid(),
  amount: z.number().nonnegative().multipleOf(0.01),
});

export type CheckPriceOverride = z.infer<
  typeof checkPriceOverrideSchema
>;

export const createCheckInputSchema = z
  .object({
    partyId: z.string().uuid().nullable().default(null),
    label: z.string().trim().min(1).max(100),
    items: z.array(createCheckItemInputSchema).min(1),
    priceOverrides: z.array(checkPriceOverrideSchema).optional(),
  })
  .refine(
    (check) =>
      new Set(
        check.items.map((item) => item.orderItemId),
      ).size === check.items.length,
    "An order item cannot appear twice on one check",
  )
  .refine(
    (check) => {
      const overrides = check.priceOverrides ?? [];
      return (
        new Set(
          overrides.map(
            (override) => `${override.source}:${override.recordId}`,
          ),
        ).size === overrides.length
      );
    },
    "A price override cannot appear twice on one check",
  );

export type CreateCheckInput = z.infer<
  typeof createCheckInputSchema
>;

export const checkItemSchema = z.object({
  id: z.string().uuid(),
  orderItemId: z.string().uuid(),
  itemName: z.string(),
  allocatedQuantity: z.number().positive(),
  allocatedAmount: z.number().nonnegative(),
  createdAt: z.string().datetime(),
});

export type CheckItem = z.infer<typeof checkItemSchema>;

export const checkSchema = z.object({
  id: z.string().uuid(),
  partyId: z.string().uuid().nullable(),
  label: z.string(),
  status: checkStatusSchema,
  openedByUserId: z.string().uuid(),
  subtotalAmount: z.number().nonnegative(),
  salesTaxRate: z.number().min(0).max(1),
  taxAmount: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
  presentedAt: z.string().datetime().nullable(),
  closedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  items: z.array(checkItemSchema),
});

export type Check = z.infer<typeof checkSchema>;

export const paymentAllocationInputSchema = z.object({
  checkId: z.string().uuid(),
  allocatedAmount: z
    .number()
    .positive()
    .multipleOf(0.01),
});

const paymentAllocationsSchema = z
  .array(paymentAllocationInputSchema)
  .min(1, "Choose at least one check")
  .refine(
    (allocations) =>
      new Set(
        allocations.map((allocation) => allocation.checkId),
      ).size === allocations.length,
    "A check cannot appear twice in one payment",
  );

const tipAmountSchema = z
  .number()
  .nonnegative()
  .multipleOf(0.01)
  .default(0);

const cashPaymentInputSchema = z
  .object({
    method: z.literal("cash"),
    allocations: paymentAllocationsSchema,
    tipAmount: tipAmountSchema,
    cashReceivedAmount: z
      .number()
      .positive()
      .multipleOf(0.01),
  })
  .refine(
    (payment) =>
      payment.cashReceivedAmount >=
      payment.allocations.reduce(
        (total, allocation) =>
          total + allocation.allocatedAmount,
        payment.tipAmount,
      ),
    {
      message:
        "Cash received must cover the payment and tip",
      path: ["cashReceivedAmount"],
    },
  );

const cardPaymentInputSchema = z.object({
  method: z.literal("card"),
  allocations: paymentAllocationsSchema,
  tipAmount: tipAmountSchema,
  processorReference: z.string().trim().min(1).max(200),
});

export const takePaymentInputSchema = z.discriminatedUnion(
  "method",
  [
    cashPaymentInputSchema,
    cardPaymentInputSchema,
  ],
);

export type TakePaymentInput = z.infer<
  typeof takePaymentInputSchema
>;

export const paymentCheckAllocationSchema = z.object({
  checkId: z.string().uuid(),
  allocatedAmount: z.number().positive(),
  createdAt: z.string().datetime(),
});

export type PaymentCheckAllocation = z.infer<
  typeof paymentCheckAllocationSchema
>;

export const paymentSchema = z.object({
  id: z.string().uuid(),
  method: paymentMethodSchema,
  status: paymentStatusSchema,
  paymentAmount: z.number().positive(),
  tipAmount: z.number().nonnegative(),
  receivedByUserId: z.string().uuid(),
  processorReference: z.string().nullable(),
  cashReceivedAmount: z.number().positive().nullable(),
  changeGivenAmount: z.number().nonnegative().nullable(),
  drawerSessionId: z.string().uuid().nullable(),
  succeededAt: z.string().datetime().nullable(),
  failedAt: z.string().datetime().nullable(),
  voidedAt: z.string().datetime().nullable(),
  voidedByUserId: z.string().uuid().nullable(),
  voidReason: z.string().nullable(),
  createdAt: z.string().datetime(),
  allocations: z.array(paymentCheckAllocationSchema).min(1),
});

export type Payment = z.infer<typeof paymentSchema>;
