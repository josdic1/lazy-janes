import { z } from "zod";

export const FULFILLMENT_TYPES = [
  "dine_in",
  "takeout",
  "delivery",
] as const;

export const fulfillmentTypeSchema = z.enum(FULFILLMENT_TYPES);

export type FulfillmentType = z.infer<
  typeof fulfillmentTypeSchema
>;

export const ORDER_ITEM_STATUSES = [
  "submitted",
  "fired",
  "ready",
  "fulfilled",
  "voided",
] as const;

export const orderItemStatusSchema = z.enum(
  ORDER_ITEM_STATUSES,
);

export type OrderItemStatus = z.infer<
  typeof orderItemStatusSchema
>;

export const createOrderItemInputSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
  seatNumber: z.number().int().positive().nullable().default(
    null,
  ),
  kitchenNote: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .nullable()
    .default(null),
  modifierItemIds: z
    .array(z.string().uuid())
    .default([])
    .refine(
      (modifierItemIds) =>
        new Set(modifierItemIds).size ===
        modifierItemIds.length,
      "A modifier cannot be selected twice",
    ),
});

export type CreateOrderItemInput = z.infer<
  typeof createOrderItemInputSchema
>;

export const createOrderInputSchema = z
  .object({
    partyId: z.string().uuid().nullable().default(null),
    fulfillmentType: fulfillmentTypeSchema,
    customerName: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .nullable()
      .default(null),
    customerPhone: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .nullable()
      .default(null),
    requestedFor: z
      .string()
      .datetime()
      .nullable()
      .default(null),
    deliveryAddress: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .nullable()
      .default(null),
    items: z.array(createOrderItemInputSchema).min(1),
  })
  .superRefine((order, context) => {
    if (
      order.fulfillmentType === "dine_in" &&
      order.partyId === null
    ) {
      context.addIssue({
        code: "custom",
        message: "A dine-in order requires a party",
        path: ["partyId"],
      });
    }

    if (
      order.fulfillmentType === "delivery" &&
      order.deliveryAddress === null
    ) {
      context.addIssue({
        code: "custom",
        message: "A delivery order requires an address",
        path: ["deliveryAddress"],
      });
    }
  });

export type CreateOrderInput = z.infer<
  typeof createOrderInputSchema
>;
