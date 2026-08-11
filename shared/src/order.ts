import { z } from "zod";

export const FULFILLMENT_TYPES = [
  "dine_in",
  "takeout",
  "delivery",
] as const;

export const fulfillmentTypeSchema = z.enum(FULFILLMENT_TYPES);

export type FulfillmentType = z.infer<typeof fulfillmentTypeSchema>;

export const ORDER_ITEM_STATUSES = [
  "submitted",
  "fired",
  "ready",
  "fulfilled",
  "voided",
] as const;

export const orderItemStatusSchema = z.enum(ORDER_ITEM_STATUSES);

export type OrderItemStatus = z.infer<typeof orderItemStatusSchema>;
