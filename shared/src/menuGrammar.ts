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

  // The option directly selects a preparation state for the containing
  // offering (for example Broiled/Fried or Mild/Spicy).
  z.object({
    kind: z.literal("preparation"),
    preparationSchemeId: z.string().min(1),
    preparationOptionId: z.string().min(1),
  }).strict(),

  z.object({
    kind: z.literal("none"),
  }).strict(),

  // The option represents a configuration decision rather than
  // selecting a component or whole offering. It must drive a
  // conditional choice constraint on the containing offering.
  z.object({
    kind: z.literal("configuration"),
  }).strict(),

  // The source proves that this is a real selectable option, but does not
  // establish whether its semantic target is a reusable component, another
  // offering, or a configuration decision. This preserves source truth
  // without inventing identity.
  z.object({
    kind: z.literal("unknown"),
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

  // Null means this option has no established preparation scheme.
  preparationSchemeId: z.string().min(1).nullable().default(null),

  isDefault: z.boolean().default(false),

  evidence: evidenceSchema.optional(),
}).strict().superRefine((option, ctx) => {
  if (
    option.target.kind === "unknown" &&
    option.evidence?.state !== "unknown"
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["evidence"],
      message: "unknown choice targets must carry unknown evidence",
    });
  }
});
export type ChoiceOption = z.infer<typeof choiceOptionSchema>;

export const applicationScopeSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("whole"),
  }).strict(),

  z.object({
    kind: z.literal("fraction"),
    numerator: z.number().int().positive(),
    denominator: z.number().int().positive(),
  }).strict(),

  z.object({
    kind: z.literal("section"),
    sectionCount: z.number().int().min(2),
  }).strict(),
]).superRefine((scope, ctx) => {
  if (
    scope.kind === "fraction" &&
    scope.numerator >= scope.denominator
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["numerator"],
      message: "fraction scope must be smaller than the whole",
    });
  }
});

export type ApplicationScope =
  z.infer<typeof applicationScopeSchema>;

export const choiceSubsetConstraintSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).optional(),

  // The subset is defined by ChoiceOption ids within this ChoiceSlot.
  optionIds: z.array(z.string().min(1)).min(1),

  // Either bound may be omitted, but at least one must be present.
  minSelections: z.number().int().nonnegative().optional(),
  maxSelections: z.number().int().nonnegative().optional(),

  evidence: evidenceSchema.optional(),
}).strict().superRefine((constraint, ctx) => {
  if (
    constraint.minSelections === undefined &&
    constraint.maxSelections === undefined
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minSelections"],
      message: "subset constraint must define a minimum or maximum",
    });
  }

  if (
    constraint.minSelections !== undefined &&
    constraint.maxSelections !== undefined &&
    constraint.minSelections > constraint.maxSelections
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minSelections"],
      message: "subset minSelections cannot exceed maxSelections",
    });
  }

  if (new Set(constraint.optionIds).size !== constraint.optionIds.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["optionIds"],
      message: "subset optionIds must be unique",
    });
  }

  if (
    constraint.minSelections !== undefined &&
    constraint.minSelections > constraint.optionIds.length
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minSelections"],
      message: "subset minSelections cannot exceed subset size",
    });
  }

  if (
    constraint.maxSelections !== undefined &&
    constraint.maxSelections > constraint.optionIds.length
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxSelections"],
      message: "subset maxSelections cannot exceed subset size",
    });
  }
});
export type ChoiceSubsetConstraint =
  z.infer<typeof choiceSubsetConstraintSchema>;

export const choiceSlotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),

  minSelections: z.number().int().nonnegative(),
  maxSelections: z.number().int().positive(),

  // Where selections from this choice may apply.
  // Ordinary choices default to the entire offering.
  applicationScopes: z.array(applicationScopeSchema)
    .min(1)
    .default([{ kind: "whole" }]),

  options: z.array(choiceOptionSchema).min(1),

  subsetConstraints: z.array(choiceSubsetConstraintSchema).optional(),

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

  const availableOptionIds = new Set(
    slot.options.map((option) => option.id),
  );

  for (
    const [constraintIndex, constraint]
    of (slot.subsetConstraints ?? []).entries()
  ) {
    for (
      const [optionIndex, optionId]
      of constraint.optionIds.entries()
    ) {
      if (!availableOptionIds.has(optionId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [
            "subsetConstraints",
            constraintIndex,
            "optionIds",
            optionIndex,
          ],
          message: "subset constraint references an unavailable option",
        });
      }
    }

    if (
      constraint.minSelections !== undefined &&
      constraint.minSelections > slot.maxSelections
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "subsetConstraints",
          constraintIndex,
          "minSelections",
        ],
        message: "subset minSelections cannot exceed ChoiceSlot maxSelections",
      });
    }
  }
});

export type ChoiceSlot = z.infer<typeof choiceSlotSchema>;

export const conditionalChoiceConstraintSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).optional(),

  // Selecting this option activates the constraint.
  when: z.object({
    choiceSlotId: z.string().min(1),
    optionId: z.string().min(1),
  }).strict(),

  // The activated rule changes the allowed selection count
  // of another ChoiceSlot.
  then: z.object({
    choiceSlotId: z.string().min(1),
    minSelections: z.number().int().nonnegative().optional(),
    maxSelections: z.number().int().nonnegative().optional(),
  }).strict().superRefine((effect, ctx) => {
    if (
      effect.minSelections === undefined &&
      effect.maxSelections === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minSelections"],
        message: "conditional choice constraint must define a minimum or maximum",
      });
    }

    if (
      effect.minSelections !== undefined &&
      effect.maxSelections !== undefined &&
      effect.minSelections > effect.maxSelections
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minSelections"],
        message: "conditional minSelections cannot exceed maxSelections",
      });
    }
  }),

  evidence: evidenceSchema.optional(),
}).strict();

export type ConditionalChoiceConstraint =
  z.infer<typeof conditionalChoiceConstraintSchema>;

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

    z.object({
      kind: z.literal("variant_option"),
      variantId: z.string().min(1),
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

export const resourceRequirementSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),

  resourceKind: z.enum([
    "personnel",
    "equipment",
  ]),

  // Example: 2 chefs per 50 guests means:
  // quantity = 2, perCount = 50, countKind = guest.
  calculation: z.object({
    kind: z.literal("per_count"),
    countKind: z.enum([
      "guest",
      "participant",
    ]),
    quantity: z.number().int().positive(),
    perCount: z.number().int().positive(),
    rounding: z.literal("up"),
  }).strict(),

  // Optional billing truth for the required resource.
  // Examples:
  // $100 per chef
  // $30 per server-hour, four-hour minimum.
  rate: z.object({
    amount: z.number().nonnegative(),
    basis: z.enum([
      "resource",
      "hour",
    ]),
    minimumBillableUnits: z.number().positive().nullable(),
  }).strict().nullable(),

  evidence: evidenceSchema.optional(),
}).strict();

export type ResourceRequirement =
  z.infer<typeof resourceRequirementSchema>;

export const universalOfferingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),

  // Null means the source does not establish whether this is a
  // preset, retail item, or service.
  kind: offeringKindSchema.nullable(),

  components: z.array(universalComponentSchema).default([]),
  preparations: z.array(universalPreparationSchemeSchema).default([]),
  choices: z.array(choiceSlotSchema).default([]),
  choiceConstraints: z.array(conditionalChoiceConstraintSchema).default([]),
  variants: z.array(variantSchema).default([]),
  bundles: z.array(bundleSchema).default([]),
  nestedOfferings: z.array(nestedOfferingSchema).default([]),
  addCatalogs: z.array(addCatalogSchema).default([]),
  measures: z.array(measureSchema).default([]),
  sequences: z.array(sequenceSchema).default([]),

  resourceRequirements: z.array(resourceRequirementSchema).default([]),
  commercialPolicies: z.array(commercialPolicySchema).default([]),

  evidence: evidenceSchema.optional(),
}).strict().superRefine((offering, ctx) => {
  const choicesById = new Map(
    offering.choices.map((choice) => [choice.id, choice]),
  );
  const preparationIds = new Set(
    offering.preparations.map((preparation) => preparation.id),
  );

  for (const [choiceIndex, choice] of offering.choices.entries()) {
    for (const [optionIndex, option] of choice.options.entries()) {
      if (
        option.preparationSchemeId !== null &&
        !preparationIds.has(option.preparationSchemeId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [
            "choices",
            choiceIndex,
            "options",
            optionIndex,
            "preparationSchemeId",
          ],
          message: "choice preparationSchemeId must reference an available preparation scheme",
        });
      }

      if (option.target.kind === "preparation") {
        const preparationTarget = option.target;

        const scheme = offering.preparations.find(
          (candidate) =>
            candidate.id === preparationTarget.preparationSchemeId,
        );

        if (!scheme) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["choices", choiceIndex, "options", optionIndex, "target"],
            message: "preparation choice target must reference an available preparation scheme",
          });
        } else if (
          !scheme.options.some(
            (candidate) =>
              candidate.id === preparationTarget.preparationOptionId,
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["choices", choiceIndex, "options", optionIndex, "target"],
            message: "preparation choice target must reference an option on its preparation scheme",
          });
        }
      }

      if (
        option.target.kind === "configuration" &&
        !offering.choiceConstraints.some(
          (constraint) =>
            constraint.when.choiceSlotId === choice.id &&
            constraint.when.optionId === option.id,
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["choices", choiceIndex, "options", optionIndex, "target"],
          message: "configuration choice option must activate a conditional choice constraint",
        });
      }
    }
  }

  for (
    const [constraintIndex, constraint]
    of offering.choiceConstraints.entries()
  ) {
    const sourceChoice = choicesById.get(
      constraint.when.choiceSlotId,
    );

    if (!sourceChoice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "choiceConstraints",
          constraintIndex,
          "when",
          "choiceSlotId",
        ],
        message: "conditional choice constraint references an unavailable source ChoiceSlot",
      });
    } else if (
      !sourceChoice.options.some(
        (option) => option.id === constraint.when.optionId,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "choiceConstraints",
          constraintIndex,
          "when",
          "optionId",
        ],
        message: "conditional choice constraint references an unavailable source option",
      });
    }

    const targetChoice = choicesById.get(
      constraint.then.choiceSlotId,
    );

    if (!targetChoice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "choiceConstraints",
          constraintIndex,
          "then",
          "choiceSlotId",
        ],
        message: "conditional choice constraint references an unavailable target ChoiceSlot",
      });
      continue;
    }

    if (
      constraint.then.minSelections !== undefined &&
      constraint.then.minSelections > targetChoice.options.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "choiceConstraints",
          constraintIndex,
          "then",
          "minSelections",
        ],
        message: "conditional minSelections cannot exceed available target options",
      });
    }

    if (
      constraint.then.maxSelections !== undefined &&
      constraint.then.maxSelections > targetChoice.options.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "choiceConstraints",
          constraintIndex,
          "then",
          "maxSelections",
        ],
        message: "conditional maxSelections cannot exceed available target options",
      });
    }
  }
});

export type UniversalOffering =
  z.infer<typeof universalOfferingSchema>;

export const menuRuleTargetSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("menu"),
  }).strict(),

  z.object({
    kind: z.literal("offering"),
    offeringId: z.string().min(1),
  }).strict(),

  z.object({
    kind: z.literal("choice_option"),
    offeringId: z.string().min(1),
    choiceSlotId: z.string().min(1),
    optionId: z.string().min(1),
  }).strict(),
]);

export type MenuRuleTarget =
  z.infer<typeof menuRuleTargetSchema>;

const localTimeConditionSchema = z.object({
  kind: z.literal("local_time"),
  before: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  atOrAfter: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
}).strict().superRefine((condition, ctx) => {
  if (
    condition.before === undefined &&
    condition.atOrAfter === undefined
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["before"],
      message: "local-time condition must define before or atOrAfter",
    });
  }
});

const guestCountConditionSchema = z.object({
  kind: z.literal("guest_count"),
  minimum: z.number().int().positive().optional(),
  maximum: z.number().int().positive().optional(),
}).strict().superRefine((condition, ctx) => {
  if (
    condition.minimum === undefined &&
    condition.maximum === undefined
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minimum"],
      message: "guest-count condition must define minimum or maximum",
    });
  }

  if (
    condition.minimum !== undefined &&
    condition.maximum !== undefined &&
    condition.minimum > condition.maximum
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minimum"],
      message: "guest-count minimum cannot exceed maximum",
    });
  }
});

export const menuRuleConditionSchema = z.discriminatedUnion("kind", [
  localTimeConditionSchema,
  guestCountConditionSchema,
]);

export type MenuRuleCondition =
  z.infer<typeof menuRuleConditionSchema>;

export const menuRuleSchema = z.object({
  id: z.string().min(1),
  target: menuRuleTargetSchema,
  when: menuRuleConditionSchema,
  effect: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("availability"),
      available: z.boolean(),
    }).strict(),

    z.object({
      kind: z.literal("minimum_participants"),
      count: z.number().int().positive(),
    }).strict(),

    z.object({
      kind: z.literal("whole_party_required"),
      required: z.boolean(),
    }).strict(),
  ]),
  evidence: evidenceSchema.optional(),
}).strict();

export type MenuRule =
  z.infer<typeof menuRuleSchema>;

export const universalMenuSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  offerings: z.array(universalOfferingSchema).default([]),
  rules: z.array(menuRuleSchema).default([]),
  evidence: evidenceSchema.optional(),
}).strict().superRefine((menu, ctx) => {
  const offeringsById = new Map(
    menu.offerings.map((offering) => [offering.id, offering]),
  );

  for (const [offeringIndex, offering] of menu.offerings.entries()) {
    for (const [choiceIndex, choice] of offering.choices.entries()) {
      for (const [optionIndex, option] of choice.options.entries()) {
        if (
          option.target.kind === "offering" &&
          !offeringsById.has(option.target.id)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [
              "offerings",
              offeringIndex,
              "choices",
              choiceIndex,
              "options",
              optionIndex,
              "target",
              "id",
            ],
            message: "choice option targets an unavailable offering",
          });
        }
      }
    }
  }

  for (const [ruleIndex, rule] of menu.rules.entries()) {
    const target = rule.target;

    if (target.kind === "menu") {
      continue;
    }

    const offering = offeringsById.get(target.offeringId);

    if (!offering) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rules", ruleIndex, "target", "offeringId"],
        message: "menu rule targets an unavailable offering",
      });
      continue;
    }

    if (target.kind !== "choice_option") {
      continue;
    }

    const choice = offering.choices.find(
      (candidate) => candidate.id === target.choiceSlotId,
    );

    if (!choice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rules", ruleIndex, "target", "choiceSlotId"],
        message: "menu rule targets an unavailable choice slot",
      });
      continue;
    }

    if (
      !choice.options.some(
        (option) => option.id === target.optionId,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rules", ruleIndex, "target", "optionId"],
        message: "menu rule targets an unavailable choice option",
      });
    }
  }
});

export type UniversalMenu =
  z.infer<typeof universalMenuSchema>;
