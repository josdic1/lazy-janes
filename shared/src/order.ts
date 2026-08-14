import { z } from "zod";
import { allergenFlagSchema } from "./menu.js";

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

const uniqueIds = (message: string) =>
  z.array(z.string().uuid()).default([]).refine(
    (ids) => new Set(ids).size === ids.length,
    message,
  );

export const createOrderItemInputSchema = z
  .object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().positive().default(1),
    seatNumber: z.number().int().positive().nullable().default(null),
    kitchenNote: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .nullable()
      .default(null),
    removedIngredientIds: uniqueIds(
      "An ingredient cannot be removed twice",
    ),
    extraIngredientIds: uniqueIds(
      "An ingredient cannot be marked extra twice",
    ),
    addedIngredientIds: uniqueIds(
      "An ingredient cannot be added twice",
    ),
    choiceOptionIds: uniqueIds(
      "A choice option cannot be selected twice",
    ),
    // Historical clients can still parse this field, but new clients send [].
    modifierItemIds: uniqueIds(
      "A modifier cannot be selected twice",
    ),
  })
  .superRefine((item, context) => {
    const seen = new Map<string, string>();
    const groups = [
      ["removedIngredientIds", item.removedIngredientIds],
      ["extraIngredientIds", item.extraIngredientIds],
      ["addedIngredientIds", item.addedIngredientIds],
    ] as const;

    for (const [field, ids] of groups) {
      for (const id of ids) {
        const previous = seen.get(id);
        if (previous) {
          context.addIssue({
            code: "custom",
            message: "An ingredient cannot have two contradictory changes",
            path: [field],
          });
          return;
        }
        seen.set(id, field);
      }
    }
  });
export type CreateOrderItemInput = z.infer<
  typeof createOrderItemInputSchema
>;

export const createOrderInputSchema = z
  .object({
    partyId: z.string().uuid().nullable().default(null),
    fulfillmentType: fulfillmentTypeSchema,
    customerName: z.string().trim().min(1).max(200).nullable().default(null),
    customerPhone: z.string().trim().min(1).max(50).nullable().default(null),
    requestedFor: z.string().datetime().nullable().default(null),
    deliveryAddress: z.string().trim().min(1).max(500).nullable().default(null),
    items: z.array(createOrderItemInputSchema).min(1),
  })
  .superRefine((order, context) => {
    if (order.fulfillmentType === "dine_in" && order.partyId === null) {
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
export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const ORDER_ITEM_INGREDIENT_CHANGE_KINDS = [
  "remove",
  "extra",
  "add",
] as const;
export const orderItemIngredientChangeKindSchema = z.enum(
  ORDER_ITEM_INGREDIENT_CHANGE_KINDS,
);
export type OrderItemIngredientChangeKind = z.infer<
  typeof orderItemIngredientChangeKindSchema
>;

export const orderItemIngredientChangeSchema = z.object({
  id: z.string().uuid(),
  ingredientId: z.string().uuid(),
  ingredientName: z.string(),
  changeKind: orderItemIngredientChangeKindSchema,
  priceAdjustment: z.number().finite(),
  priceConfigured: z.boolean(),
  allergenFlags: z.array(allergenFlagSchema),
});
export type OrderItemIngredientChange = z.infer<
  typeof orderItemIngredientChangeSchema
>;

export const orderItemChoiceSelectionSchema = z.object({
  id: z.string().uuid(),
  choiceGroupId: z.string().uuid().nullable(),
  choiceOptionId: z.string().uuid().nullable(),
  groupLabel: z.string(),
  optionLabel: z.string(),
  ingredientId: z.string().uuid().nullable(),
  priceAdjustment: z.number().finite(),
});
export type OrderItemChoiceSelection = z.infer<
  typeof orderItemChoiceSelectionSchema
>;

// Legacy order modifier shape retained for already-written orders.
export const orderItemModifierSchema = z.object({
  id: z.string().uuid(),
  menuItemId: z.string().uuid(),
  modifierName: z.string(),
  priceAdjustment: z.number().finite(),
});
export type OrderItemModifier = z.infer<typeof orderItemModifierSchema>;

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  menuItemId: z.string().uuid(),
  seatNumber: z.number().int().positive().nullable(),
  itemName: z.string(),
  unitPrice: z.number().finite().nonnegative(),
  quantity: z.number().int().positive(),
  kitchenNote: z.string().nullable(),
  status: orderItemStatusSchema,
  submittedAt: z.string().datetime(),
  firedAt: z.string().datetime().nullable(),
  readyAt: z.string().datetime().nullable(),
  fulfilledAt: z.string().datetime().nullable(),
  voidedAt: z.string().datetime().nullable(),
  voidedByUserId: z.string().uuid().nullable(),
  voidReason: z.string().nullable(),
  ingredientChanges: z.array(orderItemIngredientChangeSchema).default([]),
  choiceSelections: z.array(orderItemChoiceSelectionSchema).default([]),
  modifiers: z.array(orderItemModifierSchema).default([]),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.string().uuid(),
  partyId: z.string().uuid().nullable(),
  fulfillmentType: fulfillmentTypeSchema,
  createdByUserId: z.string().uuid(),
  customerName: z.string().nullable(),
  customerPhone: z.string().nullable(),
  deliveryAddress: z.string().nullable(),
  requestedFor: z.string().datetime().nullable(),
  submittedAt: z.string().datetime(),
  cancelledAt: z.string().datetime().nullable(),
  cancelledByUserId: z.string().uuid().nullable(),
  cancellationReason: z.string().nullable(),
  createdAt: z.string().datetime(),
  items: z.array(orderItemSchema),
});
export type Order = z.infer<typeof orderSchema>;

export const fireOrderInputSchema = z.object({
  orderItemIds: z
    .array(z.string().uuid())
    .min(1, "Choose at least one order item")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "An order item cannot be fired twice",
    ),
  note: z.string().trim().min(1).max(500).nullable().default(null),
});
export type FireOrderInput = z.infer<typeof fireOrderInputSchema>;

export const deliverOrderItemsInputSchema = z.object({
  orderItemIds: z
    .array(z.string().uuid())
    .min(1, "Choose at least one order item")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "An order item cannot be selected twice",
    ),
});
export type DeliverOrderItemsInput = z.infer<
  typeof deliverOrderItemsInputSchema
>;

const correctionReasonSchema = z
  .string()
  .trim()
  .min(1, "A reason is required")
  .max(500);

export const cancelOrderInputSchema = z.object({
  reason: correctionReasonSchema,
});
export type CancelOrderInput = z.infer<typeof cancelOrderInputSchema>;

export const voidOrderItemsInputSchema = z.object({
  orderItemIds: z
    .array(z.string().uuid())
    .min(1, "Choose at least one order item")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "An order item cannot be selected twice",
    ),
  reason: correctionReasonSchema,
});
export type VoidOrderItemsInput = z.infer<
  typeof voidOrderItemsInputSchema
>;
