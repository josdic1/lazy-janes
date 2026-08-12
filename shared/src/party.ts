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

export const partySchema = z.object({
  id: z.string().uuid(),
  guestCount: z.number().int().positive(),
  status: partyStatusSchema,
  createdByStaffId: z.string().uuid(),
  arrivedAt: z.string().datetime(),
  statusChangedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  cancelledAt: z.string().datetime().nullable(),
});

export type Party = z.infer<typeof partySchema>;
