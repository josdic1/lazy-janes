import { z } from "zod";

export const OFFERING_KINDS = [
  "preset",
  "retail",
  "service",
] as const;
export const offeringKindSchema = z.enum(OFFERING_KINDS);
export type OfferingKind = z.infer<typeof offeringKindSchema>;

export const UNIVERSAL_COMPONENT_ROLES = [
  "base",
  "primary",
  "carrier",
  "filling",
  "topping",
  "sauce",
  "accompaniment",
] as const;
export const universalComponentRoleSchema =
  z.enum(UNIVERSAL_COMPONENT_ROLES);
export type UniversalComponentRole =
  z.infer<typeof universalComponentRoleSchema>;

export const UNIVERSAL_RELATIONSHIPS = [
  "contains",
  "comes_with",
] as const;
export const universalRelationshipSchema =
  z.enum(UNIVERSAL_RELATIONSHIPS);
export type UniversalRelationship =
  z.infer<typeof universalRelationshipSchema>;

export const CAPABILITY_KINDS = [
  "remove",
  "side",
  "extra",
  "replace",
  "prepare",
  "select",
] as const;
export const capabilityKindSchema = z.enum(CAPABILITY_KINDS);
export type CapabilityKind = z.infer<typeof capabilityKindSchema>;

export const GRAMMAR_NODE_KINDS = [
  "component",
  "choice",
  "variant",
  "bundle",
  "nested_preset",
  "add_catalog",
  "measure",
  "sequence",
] as const;
export const grammarNodeKindSchema = z.enum(GRAMMAR_NODE_KINDS);
export type GrammarNodeKind = z.infer<typeof grammarNodeKindSchema>;

export const COMMERCIAL_POLICY_KINDS = [
  "price",
  "availability",
  "condition",
  "payment",
  "notice",
] as const;
export const commercialPolicyKindSchema =
  z.enum(COMMERCIAL_POLICY_KINDS);
export type CommercialPolicyKind =
  z.infer<typeof commercialPolicyKindSchema>;

export const EVIDENCE_STATES = [
  "explicit",
  "verified",
  "inferred",
  "unknown",
] as const;
export const evidenceStateSchema = z.enum(EVIDENCE_STATES);
export type EvidenceState = z.infer<typeof evidenceStateSchema>;

export const evidenceSchema = z.object({
  state: evidenceStateSchema,
  sourceRef: z.string().min(1).optional(),
  note: z.string().min(1).optional(),
}).strict();
export type Evidence = z.infer<typeof evidenceSchema>;

export const CAPABILITY_CONFIGURATION_STATES = [
  "configured",
  "unconfigured",
] as const;
export const capabilityConfigurationStateSchema =
  z.enum(CAPABILITY_CONFIGURATION_STATES);
export type CapabilityConfigurationState =
  z.infer<typeof capabilityConfigurationStateSchema>;

export const componentCapabilitySchema = z.object({
  kind: capabilityKindSchema,

  // Presence of this object means the capability is established.
  // "unconfigured" means the restaurant/source proves the capability
  // exists, but the operational details or allowed options are not known.
  configurationState: capabilityConfigurationStateSchema,

  evidence: evidenceSchema.optional(),
}).strict();
export type ComponentCapability =
  z.infer<typeof componentCapabilitySchema>;

export const replacementTargetSchema = z.object({
  componentId: z.string().min(1),
  label: z.string().min(1).optional(),
  preparationSchemeId: z.string().min(1).nullable().default(null),
  evidence: evidenceSchema.optional(),
}).strict();
export type ReplacementTarget =
  z.infer<typeof replacementTargetSchema>;

export const universalComponentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),

  // Contextual truths. Null means the source does not establish them.
  role: universalComponentRoleSchema.nullable(),
  relationship: universalRelationshipSchema.nullable(),

  capabilities: z.array(componentCapabilitySchema).default([]),

  replacementTargets: z.array(replacementTargetSchema).default([]),

  // Null means this component has no established preparation scheme.
  preparationSchemeId: z.string().min(1).nullable().default(null),

  evidence: evidenceSchema.optional(),
}).strict();

export type UniversalComponent =
  z.infer<typeof universalComponentSchema>;

export const universalPreparationOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  evidence: evidenceSchema.optional(),
}).strict();
export type UniversalPreparationOption =
  z.infer<typeof universalPreparationOptionSchema>;

export const universalPreparationSchemeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),

  // Null means the source does not establish whether an explicit
  // preparation selection is required.
  selectionRequired: z.boolean().nullable(),

  // Null means no default preparation is established.
  defaultOptionId: z.string().min(1).nullable(),

  options: z.array(universalPreparationOptionSchema).min(1),

  evidence: evidenceSchema.optional(),
}).strict().superRefine((scheme, ctx) => {
  if (
    scheme.defaultOptionId !== null &&
    !scheme.options.some(
      (option) => option.id === scheme.defaultOptionId,
    )
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["defaultOptionId"],
      message: "defaultOptionId must reference an available preparation option",
    });
  }
});

export type UniversalPreparationScheme =
  z.infer<typeof universalPreparationSchemeSchema>;

export const choiceOptionTargetSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("component"),
    id: z.string().min(1),
  }).strict(),

  z.object({
    kind: z.literal("offering"),
    id: z.string().min(1),
  }).strict(),

  z.object({
    kind: z.literal("none"),
  }).strict(),
]);
export type ChoiceOptionTarget =
  z.infer<typeof choiceOptionTargetSchema>;

export const choiceOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),

  // A choice must select exactly one semantic target.
  // Whole offerings retain their identity rather than being flattened
  // into fake components merely because they appear inside a choice.
  target: choiceOptionTargetSchema,

  isDefault: z.boolean().default(false),

  evidence: evidenceSchema.optional(),
}).strict();
export type ChoiceOption = z.infer<typeof choiceOptionSchema>;

export const choiceSlotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),

  minSelections: z.number().int().nonnegative(),
  maxSelections: z.number().int().positive(),

  options: z.array(choiceOptionSchema).min(1),

  evidence: evidenceSchema.optional(),
}).strict().superRefine((slot, ctx) => {
  if (slot.minSelections > slot.maxSelections) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minSelections"],
      message: "minSelections cannot exceed maxSelections",
    });
  }

  if (slot.maxSelections > slot.options.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxSelections"],
      message: "maxSelections cannot exceed available options",
    });
  }
});

export type ChoiceSlot = z.infer<typeof choiceSlotSchema>;

export const variantOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  evidence: evidenceSchema.optional(),
}).strict();
export type VariantOption = z.infer<typeof variantOptionSchema>;

export const variantSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),

  // Null means the source does not establish whether the customer
  // must explicitly choose a variant.
  selectionRequired: z.boolean().nullable(),

  // Null means there is no proven default variant.
  defaultOptionId: z.string().min(1).nullable(),

  options: z.array(variantOptionSchema).min(1),

  evidence: evidenceSchema.optional(),
}).strict().superRefine((variant, ctx) => {
  if (
    variant.defaultOptionId !== null &&
    !variant.options.some(
      (option) => option.id === variant.defaultOptionId,
    )
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["defaultOptionId"],
      message: "defaultOptionId must reference an available variant option",
    });
  }
});

export type Variant = z.infer<typeof variantSchema>;

export const offeringReferenceSchema = z.object({
  offeringId: z.string().min(1),

  // Snapshot/display aid only. Identity is offeringId.
  label: z.string().min(1).optional(),

  evidence: evidenceSchema.optional(),
}).strict();
export type OfferingReference =
  z.infer<typeof offeringReferenceSchema>;

export const bundleEntrySchema = z.object({
  offering: offeringReferenceSchema,
  quantity: z.number().int().positive().default(1),
  evidence: evidenceSchema.optional(),
}).strict();
export type BundleEntry = z.infer<typeof bundleEntrySchema>;

export const bundleSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  entries: z.array(bundleEntrySchema).min(1),
  evidence: evidenceSchema.optional(),
}).strict();
export type Bundle = z.infer<typeof bundleSchema>;

export const nestedOfferingSchema = z.object({
  id: z.string().min(1),
  offering: offeringReferenceSchema,

  // Null means the source does not establish how the nested offering
  // relates structurally to its parent offering.
  relationship: universalRelationshipSchema.nullable(),

  evidence: evidenceSchema.optional(),
}).strict();
export type NestedOffering =
  z.infer<typeof nestedOfferingSchema>;

export const componentReferenceSchema = z.object({
  componentId: z.string().min(1),

  // Snapshot/display aid only. Identity is componentId.
  label: z.string().min(1).optional(),

  evidence: evidenceSchema.optional(),
}).strict();
export type ComponentReference =
  z.infer<typeof componentReferenceSchema>;

export const addCatalogOptionSchema = z.object({
  id: z.string().min(1),
  component: componentReferenceSchema,
  evidence: evidenceSchema.optional(),
}).strict();
export type AddCatalogOption =
  z.infer<typeof addCatalogOptionSchema>;

export const addCatalogSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  options: z.array(addCatalogOptionSchema).min(1),
  evidence: evidenceSchema.optional(),
}).strict();
export type AddCatalog =
  z.infer<typeof addCatalogSchema>;

export const MEASURE_UNITS = [
  "each",
  "ounce",
  "pound",
  "gram",
  "kilogram",
  "milliliter",
  "liter",
  "scoop",
  "slice",
  "piece",
  "serving",
] as const;
export const measureUnitSchema = z.enum(MEASURE_UNITS);
export type MeasureUnit = z.infer<typeof measureUnitSchema>;

export const measureSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),

  unit: measureUnitSchema,

  minimum: z.number().positive().nullable(),
  maximum: z.number().positive().nullable(),
  increment: z.number().positive().nullable(),
  defaultValue: z.number().positive().nullable(),

  evidence: evidenceSchema.optional(),
}).strict().superRefine((measure, ctx) => {
  if (
    measure.minimum !== null &&
    measure.maximum !== null &&
    measure.minimum > measure.maximum
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minimum"],
      message: "minimum cannot exceed maximum",
    });
  }

  if (
    measure.defaultValue !== null &&
    measure.minimum !== null &&
    measure.defaultValue < measure.minimum
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["defaultValue"],
      message: "defaultValue cannot be below minimum",
    });
  }

  if (
    measure.defaultValue !== null &&
    measure.maximum !== null &&
    measure.defaultValue > measure.maximum
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["defaultValue"],
      message: "defaultValue cannot exceed maximum",
    });
  }
});

export type Measure = z.infer<typeof measureSchema>;

export const choiceSlotReferenceSchema = z.object({
  choiceSlotId: z.string().min(1),
  label: z.string().min(1).optional(),
}).strict();
export type ChoiceSlotReference =
  z.infer<typeof choiceSlotReferenceSchema>;

export const sequenceStepTargetSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("offering"),
    offering: offeringReferenceSchema,
  }).strict(),

  z.object({
    kind: z.literal("choice"),
    choice: choiceSlotReferenceSchema,
  }).strict(),
]);
export type SequenceStepTarget =
  z.infer<typeof sequenceStepTargetSchema>;

export const sequenceStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  position: z.number().int().positive(),
  target: sequenceStepTargetSchema,
  evidence: evidenceSchema.optional(),
}).strict();
export type SequenceStep =
  z.infer<typeof sequenceStepSchema>;

export const sequenceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  steps: z.array(sequenceStepSchema).min(1),
  evidence: evidenceSchema.optional(),
}).strict().superRefine((sequence, ctx) => {
  const positions = sequence.steps.map((step) => step.position);

  if (new Set(positions).size !== positions.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["steps"],
      message: "sequence step positions must be unique",
    });
  }

  const ids = sequence.steps.map((step) => step.id);

  if (new Set(ids).size !== ids.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["steps"],
      message: "sequence step IDs must be unique",
    });
  }
});

export type Sequence = z.infer<typeof sequenceSchema>;

export const commercialPolicyTargetSchema =
  z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("offering"),
    }).strict(),

    z.object({
      kind: z.literal("component_capability"),
      componentId: z.string().min(1),
      capability: capabilityKindSchema,
    }).strict(),

    z.object({
      kind: z.literal("choice_option"),
      choiceSlotId: z.string().min(1),
      optionId: z.string().min(1),
    }).strict(),
  ]);

export type CommercialPolicyTarget =
  z.infer<typeof commercialPolicyTargetSchema>;

export const pricePolicySchema = z.object({
  id: z.string().min(1),
  kind: z.literal("price"),
  appliesTo: commercialPolicyTargetSchema,

  // Null means the source establishes that pricing exists here,
  // but the amount has not been configured.
  amount: z.number().nullable(),
  configured: z.boolean(),

  evidence: evidenceSchema.optional(),
}).strict().superRefine((policy, ctx) => {
  if (policy.configured && policy.amount === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["amount"],
      message: "configured price must have an amount",
    });
  }

  if (!policy.configured && policy.amount !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["amount"],
      message: "unconfigured price must not claim a known amount",
    });
  }
});

export const textCommercialPolicySchema = z.object({
  id: z.string().min(1),
  kind: z.enum([
    "availability",
    "condition",
    "payment",
    "notice",
  ]),
  value: z.string().min(1),
  evidence: evidenceSchema.optional(),
}).strict();

export const commercialPolicySchema = z.union([
  pricePolicySchema,
  textCommercialPolicySchema,
]);

export type CommercialPolicy =
  z.infer<typeof commercialPolicySchema>;

export const universalOfferingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),

  // Null means the source does not establish whether this is a
  // preset, retail item, or service.
  kind: offeringKindSchema.nullable(),

  components: z.array(universalComponentSchema).default([]),
  preparations: z.array(universalPreparationSchemeSchema).default([]),
  choices: z.array(choiceSlotSchema).default([]),
  variants: z.array(variantSchema).default([]),
  bundles: z.array(bundleSchema).default([]),
  nestedOfferings: z.array(nestedOfferingSchema).default([]),
  addCatalogs: z.array(addCatalogSchema).default([]),
  measures: z.array(measureSchema).default([]),
  sequences: z.array(sequenceSchema).default([]),

  commercialPolicies: z.array(commercialPolicySchema).default([]),

  evidence: evidenceSchema.optional(),
}).strict();

export type UniversalOffering =
  z.infer<typeof universalOfferingSchema>;
