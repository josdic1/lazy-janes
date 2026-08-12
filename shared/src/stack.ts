import { z } from "zod";
import { checkStatusSchema } from "./billing.js";
import {
  fulfillmentTypeSchema,
  orderItemStatusSchema,
} from "./order.js";
import { partyStatusSchema } from "./party.js";

export const stackTableSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
});

export type StackTable = z.infer<typeof stackTableSchema>;

export const stackOrderItemSchema = z.object({
  id: z.string().uuid(),
  itemName: z.string(),
  seatNumber: z.number().int().positive().nullable(),
  quantity: z.number().int().positive(),
  status: orderItemStatusSchema,
});

export type StackOrderItem = z.infer<
  typeof stackOrderItemSchema
>;

export const stackOrderSchema = z.object({
  id: z.string().uuid(),
  fulfillmentType: fulfillmentTypeSchema,
  submittedAt: z.string().datetime(),
  cancelledAt: z.string().datetime().nullable(),
  items: z.array(stackOrderItemSchema),
});

export type StackOrder = z.infer<typeof stackOrderSchema>;

export const stackCheckSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  status: checkStatusSchema,
  totalAmount: z.number().nonnegative(),
  paidAmount: z.number().nonnegative(),
  balanceAmount: z.number().nonnegative(),
});

export type StackCheck = z.infer<typeof stackCheckSchema>;

export const STACK_PARTY_EVENT_TYPES = [
  "arrived",
  "waiting_started",
  "seated",
  "service_started",
  "completed",
  "cancelled",
] as const;

export const stackPartyEventTypeSchema = z.enum(
  STACK_PARTY_EVENT_TYPES,
);

export const stackPartyEventSchema = z.object({
  id: z.number().int().positive(),
  eventType: stackPartyEventTypeSchema,
  actorStaffId: z.string().uuid().nullable(),
  reason: z.string().nullable(),
  occurredAt: z.string().datetime(),
});

export type StackPartyEvent = z.infer<
  typeof stackPartyEventSchema
>;

export const stackPartySchema = z.object({
  id: z.string().uuid(),
  guestCount: z.number().int().positive(),
  status: partyStatusSchema,
  arrivedAt: z.string().datetime(),
  statusChangedAt: z.string().datetime(),
  tables: z.array(stackTableSchema),
  orders: z.array(stackOrderSchema),
  checks: z.array(stackCheckSchema),
  events: z.array(stackPartyEventSchema),
});

export type StackParty = z.infer<typeof stackPartySchema>;

export const stackSnapshotSchema = z.object({
  generatedAt: z.string().datetime(),
  parties: z.array(stackPartySchema),
});

export type StackSnapshot = z.infer<
  typeof stackSnapshotSchema
>;
