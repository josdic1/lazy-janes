import {
  universalOfferingSchema,
  type CommercialPolicy,
  type MenuCustomizationCatalog,
  type MenuItem,
  type UniversalComponentRole,
  type UniversalOffering,
} from "@lazy-janes/shared";

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

  const activeChoiceGroups = catalog.choiceGroups.filter(
    (group) =>
      group.menuItemId === item.id &&
      group.isActive,
  );

  const referencedPreparationIds = new Set(
    itemIngredients
      .map((component) => component.preparationSchemeId)
      .filter((id): id is string => id !== null),
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

  const choices = activeChoiceGroups
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
        options: activeOptions.map((option) => ({
          id: option.id,
          label: option.label,
          componentId: option.ingredientId,
          isNoneOption: option.isNoneOption,
          isDefault: option.isDefault,
        })),
      };
    });

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
      role: mapContextualRole(component.role),
      relationship: component.relationship,
      capabilities,
      replacementTargets,
      preparationSchemeId: component.preparationSchemeId,
    };
  });

  return universalOfferingSchema.parse({
    id: item.id,
    name: item.name,

    // Current Lazy Jane's MenuItem contract does not establish whether
    // an item is universally a preset, retail item, or service.
    kind: null,

    components,
    preparations,
    choices,
    commercialPolicies,
  });
}
