import { z } from "zod";

export const MENU_ITEM_STATUSES = [
  "available",
  "eighty_sixed",
  "inactive",
] as const;

export const menuItemStatusSchema = z.enum(MENU_ITEM_STATUSES);

export type MenuItemStatus = z.infer<typeof menuItemStatusSchema>;

const parentItemIdSchema = z.string().uuid().nullable();
const nameSchema = z.string().trim().min(1).max(200);
const descriptionSchema = z.string().trim().nullable();
const categorySchema = z.string().trim().min(1).max(200);
const priceSchema = z.number().finite().nonnegative();
const dietaryFlagsSchema = z.array(z.string().trim().min(1));
const sortOrderSchema = z.number().int();

const menuItemInputObjectSchema = z.object({
  parentItemId: parentItemIdSchema.default(null),
  name: nameSchema,
  description: descriptionSchema.default(null),
  category: categorySchema,
  price: priceSchema,
  status: menuItemStatusSchema.default("available"),
  isSpecial: z.boolean().default(false),
  isModifier: z.boolean().default(false),
  dietaryFlags: dietaryFlagsSchema.default([]),
  sortOrder: sortOrderSchema.default(0),
});

export const createMenuItemInputSchema =
  menuItemInputObjectSchema.superRefine((item, context) => {
    if (item.isModifier && item.parentItemId === null) {
      context.addIssue({
        code: "custom",
        message: "A modifier requires a parent item",
        path: ["parentItemId"],
      });
    }
  });

export type CreateMenuItemInput = z.infer<
  typeof createMenuItemInputSchema
>;

export const updateMenuItemInputSchema = z
  .object({
    parentItemId: parentItemIdSchema.optional(),
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    category: categorySchema.optional(),
    price: priceSchema.optional(),
    status: menuItemStatusSchema.optional(),
    isSpecial: z.boolean().optional(),
    isModifier: z.boolean().optional(),
    dietaryFlags: dietaryFlagsSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
  })
  .refine(
    (changes) => Object.keys(changes).length > 0,
    "At least one field must be provided",
  );

export type UpdateMenuItemInput = z.infer<
  typeof updateMenuItemInputSchema
>;

export const menuItemSchema = menuItemInputObjectSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type MenuItem = z.infer<typeof menuItemSchema>;
