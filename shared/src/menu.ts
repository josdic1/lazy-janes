import { z } from "zod";
import { universalComponentRoleSchema } from "./menuGrammar.js";

export const MENU_ITEM_STATUSES = [
  "available",
  "eighty_sixed",
  "inactive",
  "draft",
] as const;

export const menuItemStatusSchema = z.enum(MENU_ITEM_STATUSES);
export type MenuItemStatus = z.infer<typeof menuItemStatusSchema>;

export const ALLERGEN_FLAGS = [
  "milk",
  "egg",
  "wheat",
  "soy",
  "fish",
  "shellfish",
  "peanut",
  "tree_nut",
  "sesame",
] as const;

export const allergenFlagSchema = z.enum(ALLERGEN_FLAGS);
export type AllergenFlag = z.infer<typeof allergenFlagSchema>;

export const MENU_ITEM_SAFETY_KINDS = [
  "contains",
  "may_contain",
  "cross_contact",
  "shared_fryer",
  "shared_equipment",
  "other",
] as const;

export const menuItemSafetyKindSchema = z.enum(
  MENU_ITEM_SAFETY_KINDS,
);
export type MenuItemSafetyKind = z.infer<
  typeof menuItemSafetyKindSchema
>;

const idSchema = z.string().uuid();
const parentItemIdSchema = idSchema.nullable();
const nameSchema = z.string().trim().min(1).max(200);
const descriptionSchema = z.string().trim().nullable();
const priceSchema = z.number().finite().nonnegative();
const priceAdjustmentSchema = z.number().finite();
const dietaryFlagsSchema = z.array(z.string().trim().min(1));
const allergenFlagsSchema = z.array(allergenFlagSchema);
const sortOrderSchema = z.number().int();

export const menuCategorySchema = z.object({
  id: idSchema,
  groupId: idSchema,
  name: nameSchema,
  sortOrder: sortOrderSchema,
  isActive: z.boolean(),
});
export type MenuCategory = z.infer<typeof menuCategorySchema>;

export const menuGroupSchema = z.object({
  id: idSchema,
  name: nameSchema,
  sortOrder: sortOrderSchema,
  isActive: z.boolean(),
  categories: z.array(menuCategorySchema),
});
export type MenuGroup = z.infer<typeof menuGroupSchema>;
export const menuTaxonomySchema = z.array(menuGroupSchema);
export type MenuTaxonomy = z.infer<typeof menuTaxonomySchema>;

const safetyNoteSchema = z.string().trim().min(1).max(500);

const menuItemSafetyDeclarationBaseSchema = z.object({
  kind: menuItemSafetyKindSchema,
  allergenFlag: allergenFlagSchema.nullable().default(null),
  note: safetyNoteSchema.nullable().default(null),
  sortOrder: sortOrderSchema.default(0),
});

export const menuItemSafetyDeclarationInputSchema =
  menuItemSafetyDeclarationBaseSchema.superRefine(
    (declaration, context) => {
      if (
        ["contains", "may_contain", "cross_contact"].includes(
          declaration.kind,
        ) &&
        declaration.allergenFlag === null
      ) {
        context.addIssue({
          code: "custom",
          message: "Allergen safety declarations require an allergen",
          path: ["allergenFlag"],
        });
      }

      if (
        ["shared_fryer", "shared_equipment", "other"].includes(
          declaration.kind,
        ) &&
        declaration.allergenFlag !== null
      ) {
        context.addIssue({
          code: "custom",
          message: "Process safety declarations do not take an allergen flag",
          path: ["allergenFlag"],
        });
      }

      if (declaration.kind === "other" && declaration.note === null) {
        context.addIssue({
          code: "custom",
          message: "Other safety declarations require a note",
          path: ["note"],
        });
      }
    },
  );
export type MenuItemSafetyDeclarationInput = z.infer<
  typeof menuItemSafetyDeclarationInputSchema
>;

export const menuItemSafetyDeclarationSchema =
  menuItemSafetyDeclarationBaseSchema
    .extend({
      id: idSchema,
      menuItemId: idSchema,
      isManualOverride: z.boolean().default(false),
    })
    .superRefine((declaration, context) => {
      if (
        ["contains", "may_contain", "cross_contact"].includes(
          declaration.kind,
        ) &&
        declaration.allergenFlag === null
      ) {
        context.addIssue({
          code: "custom",
          message: "Allergen safety declarations require an allergen",
          path: ["allergenFlag"],
        });
      }

      if (
        ["shared_fryer", "shared_equipment", "other"].includes(
          declaration.kind,
        ) &&
        declaration.allergenFlag !== null
      ) {
        context.addIssue({
          code: "custom",
          message: "Process safety declarations do not take an allergen flag",
          path: ["allergenFlag"],
        });
      }

      if (declaration.kind === "other" && declaration.note === null) {
        context.addIssue({
          code: "custom",
          message: "Other safety declarations require a note",
          path: ["note"],
        });
      }
    });
export type MenuItemSafetyDeclaration = z.infer<
  typeof menuItemSafetyDeclarationSchema
>;

const safetyDeclarationsSchema = z
  .array(menuItemSafetyDeclarationInputSchema)
  .refine(
    (declarations) => {
      const keys = declarations.map((declaration) => {
        if (declaration.allergenFlag !== null) {
          return [declaration.kind, declaration.allergenFlag].join("|");
        }
        if (declaration.kind === "other") {
          return [
            declaration.kind,
            declaration.note?.trim().toLowerCase() ?? "",
          ].join("|");
        }
        return declaration.kind;
      });
      return new Set(keys).size === keys.length;
    },
    "Safety declarations cannot be duplicated",
  );

export const menuItemSafetyOverrideInputSchema = z.object({
  declarations: safetyDeclarationsSchema,
  reason: z.string().trim().min(3).max(500),
});
export type MenuItemSafetyOverrideInput = z.infer<
  typeof menuItemSafetyOverrideInputSchema
>;

export const menuItemSafetyOverrideAuditEventSchema = z.object({
  id: idSchema,
  menuItemId: idSchema,
  changedByUserId: idSchema,
  changedByDisplayName: z.string().trim().min(1),
  action: z.enum(["set", "updated", "cleared"]),
  reason: z.string().trim().min(1),
  beforeDeclarations: z.array(menuItemSafetyDeclarationInputSchema),
  afterDeclarations: z.array(menuItemSafetyDeclarationInputSchema),
  changedAt: z.string().datetime(),
});
export type MenuItemSafetyOverrideAuditEvent = z.infer<
  typeof menuItemSafetyOverrideAuditEventSchema
>;

const menuItemInputObjectSchema = z.object({
  parentItemId: parentItemIdSchema.default(null),
  name: nameSchema,
  description: descriptionSchema.default(null),
  categoryId: idSchema,
  price: priceSchema,
  status: menuItemStatusSchema.default("draft"),
  isSpecial: z.boolean().default(false),
  isKids: z.boolean().default(false),
  hasKidsVersion: z.boolean().default(false),
  isModifier: z.boolean().default(false),
  dietaryFlags: dietaryFlagsSchema.default([]),
  safetyDeclarations: safetyDeclarationsSchema.default([]),
  sortOrder: sortOrderSchema.default(0),
});

export const createMenuItemInputSchema =
  menuItemInputObjectSchema.superRefine((item, context) => {
    if (item.isModifier || item.parentItemId !== null) {
      context.addIssue({
        code: "custom",
        message: "Legacy modifier menu items are no longer supported",
        path: ["isModifier"],
      });
    }
  });
export type CreateMenuItemInput = z.infer<typeof createMenuItemInputSchema>;

export const updateMenuItemInputSchema = z
  .object({
    parentItemId: parentItemIdSchema.optional(),
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    categoryId: idSchema.optional(),
    price: priceSchema.optional(),
    status: menuItemStatusSchema.optional(),
    isSpecial: z.boolean().optional(),
    isKids: z.boolean().optional(),
    hasKidsVersion: z.boolean().optional(),
    isModifier: z.boolean().optional(),
    dietaryFlags: dietaryFlagsSchema.optional(),
    safetyDeclarations: safetyDeclarationsSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
  })
  .refine(
    (changes) => Object.keys(changes).length > 0,
    "At least one field must be provided",
  );
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemInputSchema>;

export const menuItemSchema = menuItemInputObjectSchema.extend({
  id: idSchema,
  sourceKey: z.string().trim().min(1).nullable().default(null),
  sourceReviewNeeded: z.boolean().default(false),
  sourceReviewNotes: z.string().default(""),
  safetyDeclarations: z.array(menuItemSafetyDeclarationSchema),
  hasManualSafetyOverride: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type MenuItem = z.infer<typeof menuItemSchema>;

/* --------------------------------------------------------------------------
   Reusable ingredient + item composition model
   -------------------------------------------------------------------------- */

export const INGREDIENT_KINDS = [
  "protein",
  "egg",
  "bread",
  "cheese",
  "sauce",
  "side",
  "veggie",
  "fruit",
  "other",
] as const;
export const ingredientKindSchema = z.enum(INGREDIENT_KINDS);
export type IngredientKind = z.infer<typeof ingredientKindSchema>;

export const COMPONENT_ROLES = [
  "protein",
  "egg",
  "bread",
  "carrier",
  "cheese",
  "sauce",
  "side",
  "veggie",
  "fruit",
  "other",
] as const;
export const componentRoleSchema = z.enum(COMPONENT_ROLES);
export type ComponentRole = z.infer<typeof componentRoleSchema>;

export const COMPONENT_RELATIONSHIPS = [
  "contains",
  "comes_with",
] as const;
export const componentRelationshipSchema = z.enum(COMPONENT_RELATIONSHIPS);
export type ComponentRelationship = z.infer<
  typeof componentRelationshipSchema
>;

export const PREPARATION_KINDS = [
  "meat_cook",
  "egg_cook",
  "bread_prep",
  "other",
] as const;
export const preparationKindSchema = z.enum(PREPARATION_KINDS);
export type PreparationKind = z.infer<typeof preparationKindSchema>;

export const preparationOptionSchema = z.object({
  id: idSchema,
  preparationSchemeId: idSchema,
  label: nameSchema,
  sortOrder: sortOrderSchema,
  isDefault: z.boolean(),
  isActive: z.boolean(),
});
export type PreparationOption = z.infer<typeof preparationOptionSchema>;

export const preparationSchemeSchema = z.object({
  id: idSchema,
  sourceKey: z.string().trim().min(1),
  label: nameSchema,
  kind: preparationKindSchema,
  sortOrder: sortOrderSchema,
  isActive: z.boolean(),
  options: z.array(preparationOptionSchema),
});
export type PreparationScheme = z.infer<typeof preparationSchemeSchema>;

export const ingredientSchema = z.object({
  id: idSchema,
  name: nameSchema,
  kind: ingredientKindSchema,
  isActive: z.boolean(),
  isAddable: z.boolean(),
  defaultAddPrice: priceSchema,
  addPriceConfigured: z.boolean(),
  allergenFlags: allergenFlagsSchema,
  sortOrder: sortOrderSchema,
});
export type Ingredient = z.infer<typeof ingredientSchema>;

export const createIngredientInputSchema = z.object({
  name: nameSchema,
  kind: ingredientKindSchema.default("other"),
  isAddable: z.boolean().default(false),
  defaultAddPrice: priceSchema.default(0),
  addPriceConfigured: z.boolean().default(false),
  allergenFlags: allergenFlagsSchema.default([]),
  sortOrder: sortOrderSchema.default(0),
});
export type CreateIngredientInput = z.infer<
  typeof createIngredientInputSchema
>;

export const updateIngredientInputSchema = z
  .object({
    name: nameSchema.optional(),
    kind: ingredientKindSchema.optional(),
    isActive: z.boolean().optional(),
    isAddable: z.boolean().optional(),
    defaultAddPrice: priceSchema.optional(),
    addPriceConfigured: z.boolean().optional(),
    allergenFlags: allergenFlagsSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
  })
  .refine(
    (changes) => Object.keys(changes).length > 0,
    "At least one field must be provided",
  );
export type UpdateIngredientInput = z.infer<
  typeof updateIngredientInputSchema
>;

export const menuItemIngredientSchema = z.object({
  menuItemId: idSchema,
  ingredientId: idSchema,
  ingredientName: nameSchema,
  ingredientKind: ingredientKindSchema,
  role: componentRoleSchema,
  contextualRole: universalComponentRoleSchema.nullable().default(null),
  relationship: componentRelationshipSchema.nullable(),
  preparationSchemeId: idSchema.nullable(),
  allergenFlags: allergenFlagsSchema,
  canRemove: z.boolean(),
  canSide: z.boolean(),
  canExtra: z.boolean(),
  canReplace: z.boolean(),
  replacementOptionsConfigured: z.boolean(),
  extraPrice: priceSchema,
  extraPriceConfigured: z.boolean(),
  sortOrder: sortOrderSchema,
});
export type MenuItemIngredient = z.infer<
  typeof menuItemIngredientSchema
>;

export const menuItemIngredientReplacementSchema = z.object({
  menuItemId: idSchema,
  sourceIngredientId: idSchema,
  replacementIngredientId: idSchema,
  replacementIngredientName: nameSchema,
  replacementIngredientKind: ingredientKindSchema,
  preparationSchemeId: idSchema.nullable(),
  priceAdjustment: priceAdjustmentSchema,
  priceAdjustmentConfigured: z.boolean(),
  sortOrder: sortOrderSchema,
});
export type MenuItemIngredientReplacement = z.infer<
  typeof menuItemIngredientReplacementSchema
>;

export const menuChoiceOptionSchema = z.object({
  id: idSchema,
  choiceGroupId: idSchema,
  label: nameSchema,
  ingredientId: idSchema.nullable(),
  preparationSchemeId: idSchema.nullable(),
  isNoneOption: z.boolean(),
  priceAdjustment: priceAdjustmentSchema,
  priceAdjustmentConfigured: z.boolean(),
  sortOrder: sortOrderSchema,
  isDefault: z.boolean(),
  isActive: z.boolean(),
});
export type MenuChoiceOption = z.infer<
  typeof menuChoiceOptionSchema
>;

export const menuChoiceGroupSchema = z.object({
  id: idSchema,
  menuItemId: idSchema,
  label: nameSchema,
  role: componentRoleSchema,
  relationship: componentRelationshipSchema.nullable(),
  minSelections: z.number().int().nonnegative(),
  maxSelections: z.number().int().positive().nullable(),
  sortOrder: sortOrderSchema,
  isActive: z.boolean(),
  options: z.array(menuChoiceOptionSchema),
});
export type MenuChoiceGroup = z.infer<
  typeof menuChoiceGroupSchema
>;

export const INGREDIENT_POPULARITY_SCOPES = [
  "item",
  "category",
] as const;
export const ingredientPopularityScopeSchema = z.enum(
  INGREDIENT_POPULARITY_SCOPES,
);
export type IngredientPopularityScope = z.infer<
  typeof ingredientPopularityScopeSchema
>;

export const ingredientPopularitySchema = z.object({
  ingredientId: idSchema,
  addCount: z.number().int().nonnegative(),
  scope: ingredientPopularityScopeSchema,
});
export type IngredientPopularity = z.infer<
  typeof ingredientPopularitySchema
>;

export const menuCustomizationCatalogSchema = z.object({
  ingredients: z.array(ingredientSchema),
  preparationSchemes: z.array(preparationSchemeSchema),
  itemIngredients: z.array(menuItemIngredientSchema),
  replacements: z.array(menuItemIngredientReplacementSchema),
  choiceGroups: z.array(menuChoiceGroupSchema),
});
export type MenuCustomizationCatalog = z.infer<
  typeof menuCustomizationCatalogSchema
>;

const itemIngredientInputSchema = z.object({
  ingredientId: idSchema,
  role: componentRoleSchema.default("other"),
  contextualRole: universalComponentRoleSchema.nullable().default(null),
  relationship: componentRelationshipSchema.nullable().default(null),
  preparationSchemeId: idSchema.nullable().default(null),
  canRemove: z.boolean().default(true),
  canSide: z.boolean().default(false),
  canExtra: z.boolean().default(true),
  canReplace: z.boolean().default(false),
  replacementOptionsConfigured: z.boolean().default(false),
  extraPrice: priceSchema.default(0),
  extraPriceConfigured: z.boolean().default(false),
  sortOrder: sortOrderSchema.default(0),
});

const itemIngredientReplacementInputSchema = z.object({
  sourceIngredientId: idSchema,
  replacementIngredientId: idSchema,
  preparationSchemeId: idSchema.nullable().default(null),
  priceAdjustment: priceAdjustmentSchema.default(0),
  priceAdjustmentConfigured: z.boolean().default(false),
  sortOrder: sortOrderSchema.default(0),
});

const choiceOptionInputSchema = z.object({
  label: nameSchema,
  ingredientId: idSchema.nullable().default(null),
  preparationSchemeId: idSchema.nullable().default(null),
  isNoneOption: z.boolean().default(false),
  priceAdjustment: priceAdjustmentSchema.default(0),
  priceAdjustmentConfigured: z.boolean().default(false),
  sortOrder: sortOrderSchema.default(0),
  isDefault: z.boolean().default(false),
});

const choiceGroupInputSchema = z
  .object({
    label: nameSchema,
    role: componentRoleSchema.default("other"),
    relationship: componentRelationshipSchema.nullable().default(null),
    minSelections: z.number().int().nonnegative().default(0),
    maxSelections: z.number().int().positive().nullable().default(null),
    sortOrder: sortOrderSchema.default(0),
    options: z.array(choiceOptionInputSchema).min(1),
  })
  .superRefine((group, context) => {
    if (
      group.maxSelections !== null &&
      group.maxSelections < group.minSelections
    ) {
      context.addIssue({
        code: "custom",
        message: "Maximum selections cannot be less than minimum selections",
        path: ["maxSelections"],
      });
    }

    if (group.minSelections > group.options.length) {
      context.addIssue({
        code: "custom",
        message: "Minimum selections cannot exceed the available options",
        path: ["minSelections"],
      });
    }

    if (
      group.maxSelections !== null &&
      group.maxSelections > group.options.length
    ) {
      context.addIssue({
        code: "custom",
        message: "Maximum selections cannot exceed the available options",
        path: ["maxSelections"],
      });
    }

    const normalizedLabels = group.options.map((option) =>
      option.label.trim().toLowerCase(),
    );
    if (new Set(normalizedLabels).size !== normalizedLabels.length) {
      context.addIssue({
        code: "custom",
        message: "Choice option labels must be unique within a group",
        path: ["options"],
      });
    }

    const ingredientIds = group.options
      .map((option) => option.ingredientId)
      .filter((id): id is string => id !== null);
    if (new Set(ingredientIds).size !== ingredientIds.length) {
      context.addIssue({
        code: "custom",
        message: "An ingredient can only appear once within a choice group",
        path: ["options"],
      });
    }

    const defaultCount = group.options.filter((option) => option.isDefault).length;
    if (
      group.maxSelections !== null &&
      defaultCount > group.maxSelections
    ) {
      context.addIssue({
        code: "custom",
        message: "Default selections cannot exceed the group maximum",
        path: ["options"],
      });
    }
  });

export const replaceMenuItemCustomizationInputSchema = z
  .object({
    ingredients: z
      .array(itemIngredientInputSchema)
      .refine(
        (ingredients) =>
          new Set(ingredients.map((item) => item.ingredientId)).size ===
          ingredients.length,
        "An ingredient can only appear once on an item",
      ),
    replacements: z.array(itemIngredientReplacementInputSchema).default([]),
    choiceGroups: z.array(choiceGroupInputSchema),
  })
  .superRefine((configuration, context) => {
    const ingredientIds = new Set(
      configuration.ingredients.map((ingredient) => ingredient.ingredientId),
    );
    const replacementKeys = new Set<string>();
    for (const replacement of configuration.replacements) {
      if (!ingredientIds.has(replacement.sourceIngredientId)) {
        context.addIssue({
          code: "custom",
          message: "Replacement source must be a standard ingredient on the item",
          path: ["replacements"],
        });
      }
      if (replacement.sourceIngredientId === replacement.replacementIngredientId) {
        context.addIssue({
          code: "custom",
          message: "An ingredient cannot replace itself",
          path: ["replacements"],
        });
      }
      if (ingredientIds.has(replacement.replacementIngredientId)) {
        context.addIssue({
          code: "custom",
          message: "A replacement target cannot already be a standard ingredient on the item",
          path: ["replacements"],
        });
      }
      const key = `${replacement.sourceIngredientId}:${replacement.replacementIngredientId}`;
      if (replacementKeys.has(key)) {
        context.addIssue({
          code: "custom",
          message: "A replacement can only be configured once",
          path: ["replacements"],
        });
      }
      replacementKeys.add(key);
    }

    const labels = configuration.choiceGroups.map((group) =>
      group.label.trim().toLowerCase(),
    );
    if (new Set(labels).size !== labels.length) {
      context.addIssue({
        code: "custom",
        message: "Choice group labels must be unique on an item",
        path: ["choiceGroups"],
      });
    }
  });
export type ReplaceMenuItemCustomizationInput = z.infer<
  typeof replaceMenuItemCustomizationInputSchema
>;

/* --------------------------------------------------------------------------
   Legacy modifier contracts retained only so historical data remains readable.
   New ordering code uses ingredients + choice groups above.
   -------------------------------------------------------------------------- */

export const MENU_MODIFIER_GROUP_KINDS = [
  "included",
  "choice",
  "addon",
] as const;
export const menuModifierGroupKindSchema = z.enum(
  MENU_MODIFIER_GROUP_KINDS,
);
export type MenuModifierGroupKind = z.infer<
  typeof menuModifierGroupKindSchema
>;

export const menuModifierOptionSchema = z.object({
  menuItemId: idSchema,
  parentItemId: idSchema,
  name: z.string(),
  price: priceSchema,
  status: menuItemStatusSchema,
  sortOrder: sortOrderSchema,
  isDefault: z.boolean(),
});
export type MenuModifierOption = z.infer<
  typeof menuModifierOptionSchema
>;

export const menuModifierGroupSchema = z.object({
  id: idSchema,
  categoryId: idSchema.nullable(),
  menuItemId: idSchema.nullable(),
  name: z.string(),
  kind: menuModifierGroupKindSchema,
  minSelections: z.number().int().nonnegative(),
  maxSelections: z.number().int().nonnegative().nullable(),
  sortOrder: sortOrderSchema,
  options: z.array(menuModifierOptionSchema),
});
export type MenuModifierGroup = z.infer<
  typeof menuModifierGroupSchema
>;
