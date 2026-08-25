import { z } from "zod";

export const KITCHEN_CHIT_PRINT_KINDS = [
  "initial",
  "refire",
] as const;

export const kitchenChitPrintKindSchema = z.enum(
  KITCHEN_CHIT_PRINT_KINDS,
);

export type KitchenChitPrintKind = z.infer<
  typeof kitchenChitPrintKindSchema
>;

export const kitchenChitItemSchema = z.object({
  orderItemId: z.string().uuid(),
  displayOrder: z.number().int().nonnegative(),
});

export type KitchenChitItem = z.infer<
  typeof kitchenChitItemSchema
>;

export const kitchenChitSchema = z.object({
  id: z.string().uuid(),
  chitNumber: z.number().int().positive(),
  orderId: z.string().uuid(),
  printKind: kitchenChitPrintKindSchema,
  printedByUserId: z.string().uuid(),
  note: z.string().nullable(),
  printedAt: z.string().datetime(),
  cancelledAt: z.string().datetime().nullable(),
  items: z.array(kitchenChitItemSchema).min(1),
});

export type KitchenChit = z.infer<
  typeof kitchenChitSchema
>;

export const markKitchenItemsReadyInputSchema = z.object({
  orderItemIds: z
    .array(z.string().uuid())
    .min(1, "Choose at least one order item")
    .refine(
      (orderItemIds) =>
        new Set(orderItemIds).size === orderItemIds.length,
      "An order item cannot be selected twice",
    ),
});

export type MarkKitchenItemsReadyInput = z.infer<
  typeof markKitchenItemsReadyInputSchema
>;
