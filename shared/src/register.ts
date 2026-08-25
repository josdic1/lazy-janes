import { z } from "zod";

const moneySchema = z
  .number()
  .nonnegative()
  .multipleOf(0.01);

export const openDrawerInputSchema = z.object({
  openingCashAmount: moneySchema,
});

export type OpenDrawerInput = z.infer<
  typeof openDrawerInputSchema
>;

export const closeDrawerInputSchema = z.object({
  countedCashAmount: moneySchema,
});

export type CloseDrawerInput = z.infer<
  typeof closeDrawerInputSchema
>;

export const drawerSessionSchema = z.object({
  id: z.string().uuid(),
  openedByUserId: z.string().uuid(),
  openingCashAmount: moneySchema,
  openedAt: z.string().datetime(),
  closedByUserId: z.string().uuid().nullable(),
  expectedCashAmount: moneySchema.nullable(),
  countedCashAmount: moneySchema.nullable(),
  varianceAmount: z.number().multipleOf(0.01).nullable(),
  closedAt: z.string().datetime().nullable(),
});

export type DrawerSession = z.infer<
  typeof drawerSessionSchema
>;
