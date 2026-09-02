import {
  universalMenuSchema,
  type MenuCustomizationCatalog,
  type MenuItem,
  type MenuRule,
  type UniversalMenu,
} from "@lazy-janes/shared";
import { normalizeLazyJanesOffering } from "./lazyJanesAdapter.js";

export type LazyJanesMenuAdapterInput = {
  items: MenuItem[];
  catalog: MenuCustomizationCatalog;
  rules: MenuRule[];
};

export function normalizeLazyJanesMenu({
  items,
  catalog,
  rules,
}: LazyJanesMenuAdapterInput): UniversalMenu {
  const offerings = items
    .filter((item) => item.status !== "draft")
    .map((item) =>
      normalizeLazyJanesOffering({
        item,
        catalog,
      }),
    );

  return universalMenuSchema.parse({
    id: "lazy-janes-menu",
    name: "Lazy Jane's Menu",
    offerings,
    rules,
  });
}
