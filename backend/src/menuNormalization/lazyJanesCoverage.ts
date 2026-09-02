import type {
  MenuCustomizationCatalog,
  MenuItem,
} from "@lazy-janes/shared";
import { SOURCE_VARIANT_POLICIES } from "../db/menuImport/menuPolicies.js";

export type LazyJanesCoverageStatus =
  | "clean"
  | "with_unknowns"
  | "unsupported";

export type LazyJanesCoverageResult = {
  itemId: string;
  itemName: string;
  status: LazyJanesCoverageStatus;
  reasons: string[];
};

export function assessLazyJanesCoverage(
  item: MenuItem,
  catalog: MenuCustomizationCatalog,
): LazyJanesCoverageResult {
  const unsupportedReasons: string[] = [];
  const unknownReasons: string[] = [];

  const components = catalog.itemIngredients.filter(
    (component) => component.menuItemId === item.id,
  );

  const choiceGroups = catalog.choiceGroups.filter(
    (group) => group.menuItemId === item.id && group.isActive,
  );

  const choiceConstraints = catalog.choiceConstraints.filter(
    (constraint) =>
      constraint.menuItemId === item.id &&
      constraint.isActive,
  );

  for (const group of choiceGroups) {
    const variantPolicy = item.sourceKey === null
      ? undefined
      : SOURCE_VARIANT_POLICIES.find(
          (policy) =>
            policy.itemSourceKey === item.sourceKey &&
            policy.sourceChoiceGroupLabel === group.label,
        );
    const isVariantGroup =
      variantPolicy !== undefined &&
      JSON.stringify(
        group.options
          .filter((option) => option.isActive)
          .map((option) => option.label.toLowerCase())
          .sort(),
      ) ===
        JSON.stringify(
          variantPolicy.options
            .map((option) => option.label.toLowerCase())
            .sort(),
        );

    if (group.maxSelections === null) {
      unsupportedReasons.push(`choice_max_unknown:${group.label}`);
    }

    for (const option of group.options.filter((option) => option.isActive)) {
      const isConfigurationTrigger = choiceConstraints.some(
        (constraint) =>
          constraint.sourceChoiceGroupId === group.id &&
          constraint.sourceChoiceOptionId === option.id,
      );

      if (
        !option.isNoneOption &&
        option.ingredientId === null &&
        option.targetPreparationOptionId === null &&
        !isConfigurationTrigger &&
        !isVariantGroup
      ) {
        // UMO can preserve this option as target.kind="unknown". It remains a
        // source-data gap that should be remediated, but it no longer prevents
        // the offering from being normalized or ordered.
        unknownReasons.push(
          `choice_target_unknown:${group.label}:${option.label}`,
        );
      }
    }
  }

  if (unsupportedReasons.length > 0) {
    return {
      itemId: item.id,
      itemName: item.name,
      status: "unsupported",
      reasons: unsupportedReasons,
    };
  }

  const hasUnknownContextualRoles = components.some(
    (component) =>
      !["carrier", "sauce"].includes(component.role),
  );

  const hasUnknownRelationships = components.some(
    (component) => component.relationship === null,
  );

  if (hasUnknownContextualRoles) {
    unknownReasons.push("contextual_role_unknown");
  }

  if (hasUnknownRelationships) {
    unknownReasons.push("relationship_unknown");
  }

  if (item.sourceReviewNeeded) {
    unknownReasons.push("source_review_needed");
  }

  if (unknownReasons.length > 0) {
    return {
      itemId: item.id,
      itemName: item.name,
      status: "with_unknowns",
      reasons: unknownReasons,
    };
  }

  return {
    itemId: item.id,
    itemName: item.name,
    status: "clean",
    reasons: [],
  };
}
