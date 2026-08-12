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
  printedByStaffId: z.string().uuid(),
  note: z.string().nullable(),
  printedAt: z.string().datetime(),
  cancelledAt: z.string().datetime().nullable(),
  items: z.array(kitchenChitItemSchema).min(1),
});

export type KitchenChit = z.infer<
  typeof kitchenChitSchema
>;
