import { z } from "zod";

export const PARTY_STATUSES = [
  "waiting",
  "seated",
  "in_service",
  "completed",
  "cancelled",
] as const;

export const partyStatusSchema = z.enum(PARTY_STATUSES);

export type PartyStatus = z.infer<typeof partyStatusSchema>;

export const createPartyInputSchema = z.object({
  guestCount: z.number().int().positive(),
});

export type CreatePartyInput = z.infer<
  typeof createPartyInputSchema
>;

export const seatPartyInputSchema = z.object({
  tableIds: z
    .array(z.string().uuid())
    .min(1, "Choose at least one table")
    .refine(
      (tableIds) =>
        new Set(tableIds).size === tableIds.length,
      "A table cannot be assigned twice",
    ),
});

export type SeatPartyInput = z.infer<
  typeof seatPartyInputSchema
>;

export const partySchema = z.object({
  id: z.string().uuid(),
  guestCount: z.number().int().positive(),
  status: partyStatusSchema,
  createdByStaffId: z.string().uuid(),
  arrivedAt: z.string().datetime(),
  statusChangedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  cancelledAt: z.string().datetime().nullable(),
  cancelledByStaffId: z.string().uuid().nullable(),
  cancellationReason: z.string().nullable(),
});

export type Party = z.infer<typeof partySchema>;

export const cancelPartyInputSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "A reason is required")
    .max(500),
});

export type CancelPartyInput = z.infer<
  typeof cancelPartyInputSchema
>;
