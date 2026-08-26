import type {
  MenuCustomizationCatalog,
  MenuItem,
} from "@lazy-janes/shared";

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
  const reasons: string[] = [];

  const components = catalog.itemIngredients.filter(
    (component) => component.menuItemId === item.id,
  );

  const replacements = catalog.replacements.filter(
    (replacement) => replacement.menuItemId === item.id,
  );

  if (reasons.length > 0) {
    return {
      itemId: item.id,
      itemName: item.name,
      status: "unsupported",
      reasons,
    };
  }

  const hasUnknownContextualRoles = components.some(
    (component) =>
      !["carrier", "sauce"].includes(component.role),
  );

  const hasUnknownRelationships = components.some(
    (component) => component.relationship === null,
  );

  if (
    hasUnknownContextualRoles ||
    hasUnknownRelationships ||
    item.sourceReviewNeeded
  ) {
    const unknownReasons: string[] = [];

    if (hasUnknownContextualRoles) {
      unknownReasons.push("contextual_role_unknown");
    }

    if (hasUnknownRelationships) {
      unknownReasons.push("relationship_unknown");
    }

    if (item.sourceReviewNeeded) {
      unknownReasons.push("source_review_needed");
    }

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
