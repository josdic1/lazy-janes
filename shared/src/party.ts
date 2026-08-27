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
  name: z.string().trim().min(1, "Party name is required").max(80),
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
  name: z.string().nullable(),
  guestCount: z.number().int().positive(),
  status: partyStatusSchema,
  createdByUserId: z.string().uuid(),
  arrivedAt: z.string().datetime(),
  statusChangedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  cancelledAt: z.string().datetime().nullable(),
  cancelledByUserId: z.string().uuid().nullable(),
  cancellationReason: z.string().nullable(),
});

export type Party = z.infer<typeof partySchema>;

export const partyListItemSchema = partySchema.extend({
  tableLabels: z.array(z.string()),
});

export type PartyListItem = z.infer<
  typeof partyListItemSchema
>;

export const diningRoomSectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  displayOrder: z.number().int(),
  isActive: z.boolean(),
});

export type DiningRoomSection = z.infer<
  typeof diningRoomSectionSchema
>;

export const createDiningRoomSectionInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export type CreateDiningRoomSectionInput = z.infer<
  typeof createDiningRoomSectionInputSchema
>;

export const diningTableOptionSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  capacity: z.number().int().positive(),
  sectionId: z.string().uuid(),
  sectionName: z.string(),
  occupied: z.boolean(),
  floorX: z.number().int().min(0).max(100),
  floorY: z.number().int().min(0).max(100),
});

export type DiningTableOption = z.infer<
  typeof diningTableOptionSchema
>;

export const diningTableRecordSchema = diningTableOptionSchema.extend({
  isActive: z.boolean(),
});

export type DiningTableRecord = z.infer<
  typeof diningTableRecordSchema
>;

export const createDiningTableInputSchema = z.object({
  sectionId: z.string().uuid(),
  label: z.string().trim().min(1).max(40),
  capacity: z.number().int().positive().max(30),
  floorX: z.number().int().min(0).max(100).optional(),
  floorY: z.number().int().min(0).max(100).optional(),
});

export type CreateDiningTableInput = z.infer<
  typeof createDiningTableInputSchema
>;

export const updateDiningTableInputSchema = z.object({
  sectionId: z.string().uuid().optional(),
  label: z.string().trim().min(1).max(40).optional(),
  capacity: z.number().int().positive().max(30).optional(),
  isActive: z.boolean().optional(),
  floorX: z.number().int().min(0).max(100).optional(),
  floorY: z.number().int().min(0).max(100).optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  'Provide at least one table change',
);

export type UpdateDiningTableInput = z.infer<
  typeof updateDiningTableInputSchema
>;

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
