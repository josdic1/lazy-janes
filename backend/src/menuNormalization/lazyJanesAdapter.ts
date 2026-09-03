import {
  universalOfferingSchema,
  type CommercialPolicy,
  type MenuCustomizationCatalog,
  type MenuItem,
  type UniversalComponentRole,
  type UniversalOffering,
} from "@lazy-janes/shared";
import { SOURCE_VARIANT_POLICIES } from "../db/menuImport/menuPolicies.js";

export type LazyJanesAdapterInput = {
  item: MenuItem;
  catalog: MenuCustomizationCatalog;
};

function mapContextualRole(
  role: string,
): UniversalComponentRole | null {
  // These existing Lazy Jane's roles already express contextual jobs.
  // The remaining legacy values mix food classification with context
  // and therefore cannot be translated safely without more evidence.
  if (role === "carrier") return "carrier";
  if (role === "sauce") return "sauce";

  return null;
}

export function normalizeLazyJanesOffering({
  item,
  catalog,
}: LazyJanesAdapterInput): UniversalOffering {
  const itemIngredients = catalog.itemIngredients
    .filter((component) => component.menuItemId === item.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const ingredientsById = new Map(
    catalog.ingredients.map((ingredient) => [ingredient.id, ingredient]),
  );

  const itemAdditions = (catalog.itemAdditions ?? [])
    .filter(
      (addition) =>
        addition.menuItemId === item.id &&
        addition.isActive,
    )
    .filter((addition) => {
      const ingredient = ingredientsById.get(addition.ingredientId);
      return ingredient?.isActive === true && ingredient.isAddable;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const activeChoiceGroups = catalog.choiceGroups.filter(
    (group) =>
      group.menuItemId === item.id &&
      group.isActive,
  );

  const activeChoiceConstraints = catalog.choiceConstraints
    .filter((constraint) => constraint.menuItemId === item.id)
    .filter((constraint) => constraint.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const preparationTargetByOptionId = new Map<
    string,
    { preparationSchemeId: string; preparationOptionId: string }
  >();
  for (const scheme of catalog.preparationSchemes) {
    for (const option of scheme.options) {
      preparationTargetByOptionId.set(option.id, {
        preparationSchemeId: scheme.id,
        preparationOptionId: option.id,
      });
    }
  }

  const referencedPreparationIds = new Set(
    [
      ...itemIngredients.map(
        (component) => component.preparationSchemeId,
      ),
      ...activeChoiceGroups.flatMap((group) =>
        group.options
          .filter((option) => option.isActive)
          .map((option) => option.preparationSchemeId),
      ),
      ...activeChoiceGroups.flatMap((group) =>
        group.options
          .filter((option) => option.isActive)
          .map((option) =>
            option.targetPreparationOptionId === null
              ? null
              : preparationTargetByOptionId.get(
                  option.targetPreparationOptionId,
                )?.preparationSchemeId ?? null,
          ),
      ),
      ...catalog.replacements
        .filter((replacement) => replacement.menuItemId === item.id)
        .map((replacement) => replacement.preparationSchemeId),
    ].filter((id): id is string => id !== null),
  );

  const preparations = catalog.preparationSchemes
    .filter((scheme) => referencedPreparationIds.has(scheme.id))
    .map((scheme) => {
      const activeOptions = scheme.options
        .filter((option) => option.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const defaultOption =
        activeOptions.find((option) => option.isDefault) ?? null;

      return {
        id: scheme.id,
        label: scheme.label,
        selectionRequired: null,
        defaultOptionId: defaultOption?.id ?? null,
        options: activeOptions.map((option) => ({
          id: option.id,
          label: option.label,
        })),
      };
    });

  const commercialPolicies: CommercialPolicy[] = [];

  const variantPolicyByGroupId = new Map<
    string,
    (typeof SOURCE_VARIANT_POLICIES)[number]
  >();

  if (item.sourceKey !== null) {
    for (const group of activeChoiceGroups) {
      const policy = SOURCE_VARIANT_POLICIES.find(
        (candidate) =>
          candidate.itemSourceKey === item.sourceKey &&
          candidate.sourceChoiceGroupLabel === group.label,
      );

      if (!policy) continue;

      const activeLabels = group.options
        .filter((option) => option.isActive)
        .map((option) => option.label.toLowerCase())
        .sort();
      const policyLabels = policy.options
        .map((option) => option.label.toLowerCase())
        .sort();

      if (JSON.stringify(activeLabels) === JSON.stringify(policyLabels)) {
        variantPolicyByGroupId.set(group.id, policy);
      }
    }
  }

  const variants = activeChoiceGroups
    .filter((group) => variantPolicyByGroupId.has(group.id))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((group) => {
      const policy = variantPolicyByGroupId.get(group.id)!;
      const activeOptions = group.options
        .filter((option) => option.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      if (group.maxSelections !== 1 || group.minSelections > 1) {
        throw new Error(
          `Variant group "${group.label}" must select at most one option`,
        );
      }

      for (const option of activeOptions) {
        commercialPolicies.push({
          id: `${group.id}:${option.id}:variant-price-adjustment`,
          kind: "price" as const,
          appliesTo: {
            kind: "variant_option" as const,
            variantId: group.id,
            optionId: option.id,
          },
          amount: option.priceAdjustmentConfigured
            ? option.priceAdjustment
            : null,
          configured: option.priceAdjustmentConfigured,
        });
      }

      return {
        id: group.id,
        label: policy.variantLabel,
        selectionRequired: group.minSelections > 0,
        defaultOptionId:
          activeOptions.find((option) => option.isDefault)?.id ?? null,
        options: activeOptions.map((option) => ({
          id: option.id,
          label: option.label,
          evidence: { state: "explicit" as const },
        })),
        evidence: { state: "explicit" as const },
      };
    });

  const choices = activeChoiceGroups
    .filter((group) => !variantPolicyByGroupId.has(group.id))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((group) => {
      const activeOptions = group.options
        .filter((option) => option.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      if (group.maxSelections === null) {
        throw new Error(
          `Choice group "${group.label}" has no established maximum`,
        );
      }

      for (const option of activeOptions) {
        commercialPolicies.push({
          id: `${group.id}:${option.id}:price-adjustment`,
          kind: "price" as const,
          appliesTo: {
            kind: "choice_option" as const,
            choiceSlotId: group.id,
            optionId: option.id,
          },
          amount: option.priceAdjustmentConfigured
            ? option.priceAdjustment
            : null,
          configured: option.priceAdjustmentConfigured,
        });
      }

      return {
        id: group.id,
        label: group.label,
        minSelections: group.minSelections,
        maxSelections: group.maxSelections,
        options: activeOptions.map((option) => {
          const target = option.isNoneOption
            ? { kind: "none" as const }
            : option.ingredientId !== null
              ? {
                  kind: "component" as const,
                  id: option.ingredientId,
                }
              : option.targetPreparationOptionId !== null
                ? (() => {
                    const preparationTarget = preparationTargetByOptionId.get(
                      option.targetPreparationOptionId,
                    );
                    if (!preparationTarget) {
                      return { kind: "unknown" as const };
                    }
                    return {
                      kind: "preparation" as const,
                      ...preparationTarget,
                    };
                  })()
              : activeChoiceConstraints.some(
                    (constraint) =>
                      constraint.sourceChoiceGroupId === group.id &&
                      constraint.sourceChoiceOptionId === option.id,
                  )
                ? { kind: "configuration" as const }
                : { kind: "unknown" as const };

          return {
            id: option.id,
            label: option.label,
            target,
            preparationSchemeId: option.preparationSchemeId,
            isDefault: option.isDefault,
            ...(target.kind === "unknown"
              ? {
                  evidence: {
                    state: "unknown" as const,
                    note:
                      "Legacy source establishes this selectable label but not its reusable semantic target.",
                  },
                }
              : {}),
          };
        }),
      };
    });

  const choiceConstraints = activeChoiceConstraints
    .map((constraint) => ({
      id: constraint.id,
      when: {
        choiceSlotId: constraint.sourceChoiceGroupId,
        optionId: constraint.sourceChoiceOptionId,
      },
      then: {
        choiceSlotId: constraint.targetChoiceGroupId,
        ...(constraint.minSelections !== null
          ? { minSelections: constraint.minSelections }
          : {}),
        ...(constraint.maxSelections !== null
          ? { maxSelections: constraint.maxSelections }
          : {}),
      },
      ...(constraint.label !== null
        ? { label: constraint.label }
        : {}),
    }));

  const components = itemIngredients.map((component) => {
    const capabilities = [];

    const replacementTargets = catalog.replacements
      .filter(
        (replacement) =>
          replacement.menuItemId === item.id &&
          replacement.sourceIngredientId === component.ingredientId,
      )
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((replacement) => ({
        componentId: replacement.replacementIngredientId,
        label: replacement.replacementIngredientName,
        preparationSchemeId: replacement.preparationSchemeId,
      }));

    if (component.canRemove) {
      capabilities.push({
        kind: "remove" as const,
        configurationState: "configured" as const,
      });
    }

    if (component.canSide) {
      capabilities.push({
        kind: "side" as const,
        configurationState: "configured" as const,
      });
    }

    if (component.canExtra) {
      capabilities.push({
        kind: "extra" as const,
        configurationState: "configured" as const,
      });

      commercialPolicies.push({
        id: `${component.menuItemId}:${component.ingredientId}:extra-price`,
        kind: "price" as const,
        appliesTo: {
          kind: "component_capability" as const,
          componentId: component.ingredientId,
          capability: "extra" as const,
        },
        amount: component.extraPriceConfigured
          ? component.extraPrice
          : null,
        configured: component.extraPriceConfigured,
      });
    }

    if (component.canReplace) {
      capabilities.push({
        kind: "replace" as const,
        configurationState:
          component.replacementOptionsConfigured
            ? "configured" as const
            : "unconfigured" as const,
      });
    }

    if (component.preparationSchemeId !== null) {
      const schemeConfigured = preparations.some(
        (scheme) =>
          scheme.id === component.preparationSchemeId &&
          scheme.options.length > 0,
      );

      capabilities.push({
        kind: "prepare" as const,
        configurationState:
          schemeConfigured
            ? "configured" as const
            : "unconfigured" as const,
      });
    }

    return {
      id: component.ingredientId,
      name: component.ingredientName,
      role: component.contextualRole ?? mapContextualRole(component.role),
      relationship: component.relationship,
      capabilities,
      replacementTargets,
      preparationSchemeId: component.preparationSchemeId,
    };
  });

  const addCatalogs =
    itemAdditions.length === 0
      ? []
      : [
          {
            id: `${item.id}:allowed-additions`,
            label: "Allowed additions",
            options: itemAdditions.map((addition) => {
              const ingredient = ingredientsById.get(addition.ingredientId)!;

              return {
                id: `${item.id}:add:${addition.ingredientId}`,
                component: {
                  componentId: addition.ingredientId,
                  label: ingredient.name,
                },
              };
            }),
          },
        ];

  return universalOfferingSchema.parse({
    id: item.id,
    name: item.name,

    // Current Lazy Jane's MenuItem contract does not establish whether
    // an item is universally a preset, retail item, or service.
    kind: null,

    components,
    preparations,
    choices,
    choiceConstraints,
    variants,
    addCatalogs,
    commercialPolicies,
  });
}
