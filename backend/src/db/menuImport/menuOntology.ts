// IMPORT-TIME TRANSLATION ONLY.
// This heuristic ontology exists only to translate the retained source snapshot
// while seeding an empty database. Runtime menu behavior must come from PostgreSQL.
// Do not use this module to re-synchronize or overwrite manager-edited menu data.

import type { ComponentRelationship, IngredientKind } from "@lazy-janes/shared";

import {
  ingredients,
  itemIngredients,
  itemModifierGroups,
  items,
  modifierGroups,
  modifiers,
} from "./menuData.js";

import {
  CARRIER_SOURCE_GROUP_IDS,
  COMPONENT_RELATIONSHIP_OVERRIDES,
  COMPONENT_ROLE_OVERRIDES,
  HOUSE_CARRIER_SUBSTITUTION_RULES,
  UNCONFIGURED_REPLACEMENT_SOURCE_GROUP_IDS,
} from "./menuPolicies.js";

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

export type ComponentRole = (typeof COMPONENT_ROLES)[number];
export type PreparationKind = "meat_cook" | "egg_cook" | "bread_prep" | "other";

export interface SourcePreparationScheme {
  sourceKey: string;
  label: string;
  kind: PreparationKind;
  options: Array<{
    label: string;
    sortOrder: number;
    isDefault: boolean;
  }>;
}

export interface SourceComponentRule {
  itemId: string;
  ingredientId: string;
  role: ComponentRole;
  relationship: ComponentRelationship | null;
  preparationSourceKey: string | null;
  canRemove: boolean;
  canSide: boolean;
  canExtra: boolean;
  canReplace: boolean;
  replacementOptionsConfigured: boolean;
  sortOrder: number;
}

export interface SourceReplacementRule {
  itemId: string;
  sourceIngredientId: string;
  replacementIngredientId: string;
  preparationSourceKey: string | null;
  priceAdjustment: number;
  priceConfigured: boolean;
  sortOrder: number;
}

export interface SourceChoiceSlotOption {
  label: string;
  ingredientId: string | null;
  priceAdjustment: number | null;
  priceConfigured: boolean;
  isNoneOption: boolean;
  isDefault: boolean;
  preparationSourceKey: string | null;
  sortOrder: number;
}

export interface SourceChoiceSlot {
  itemId: string;
  sourceGroupId: string;
  label: string;
  role: ComponentRole;
  relationship: ComponentRelationship | null;
  minSelections: number;
  maxSelections: number | null;
  sortOrder: number;
  options: SourceChoiceSlotOption[];
}

const CHEESES = new Set([
  "american cheese", "blue cheese", "cheddar", "cheese", "cottage cheese",
  "cream cheese", "feta", "fresh mozzarella", "goat cheese", "imported swiss cheese",
  "monterey jack", "mozzarella", "parmesan", "provolone", "swiss cheese",
]);

const PROTEINS = new Set([
  "bacon", "turkey bacon", "canadian bacon", "beef", "beef burger", "brisket",
  "burger patty", "ground sirloin", "hamburger", "lean beef", "lean beef patty",
  "skirt steak", "steak", "flanken", "roast beef", "chicken", "blackened chicken",
  "buffalo chicken", "fried chicken", "grilled chicken", "marinated chicken",
  "sesame chicken", "chicken burger", "chicken cutlet", "chicken liver",
  "chopped chicken liver", "chicken meatloaf", "turkey", "roast turkey", "turkey burger",
  "turkey meatloaf", "turkey patty", "turkey sausage", "turkey steak", "ham",
  "taylor ham", "pork sausage", "sausage", "salami", "pastrami", "corned beef",
  "meatball", "meatloaf", "pepperoni", "veal", "calves liver", "chopped liver",
  "gyro meat", "hot dog", "fish", "flounder", "scrod", "sole", "salmon",
  "blackened salmon", "salmon burger", "tuna", "swordfish", "sardine", "whitefish",
  "nova", "shrimp", "scallops", "clams", "crab", "crab cake", "veggie burger",
]);

const MEAT_COOK_INGREDIENTS = new Set([
  "beef burger", "burger patty", "ground sirloin", "hamburger", "lean beef",
  "lean beef patty", "skirt steak", "steak",
]);

const BREADS = new Set([
  "bagel", "bun", "english muffin", "focaccia", "focaccia bread", "garlic bread",
  "hard roll", "hero roll", "pita", "roll", "sandwich bread", "sandwich roll",
  "sub roll", "toast", "torpedo roll", "tortilla", "tortilla shell", "wrap",
  "plain challah", "raisin challah", "apple cinnamon muffin", "blueberry muffin",
  "bran muffin", "chocolate chip muffin", "corn muffin",
]);

const SIDES = new Set([
  "french fries", "home fries", "onion rings", "potato salad", "cole slaw",
  "mashed potatoes", "garlic mashed potatoes", "baked potato", "potato pancake", "rice",
  "pasta", "spaghetti", "vegetables", "one vegetable", "two vegetables", "tossed salad",
  "health salad", "pickle", "pickles", "applesauce", "corned beef hash", "stuffing",
]);

const SAUCES = new Set([
  "applesauce", "bbq sauce", "balsamic", "balsamic dressing", "balsamic glaze",
  "balsamic vinaigrette", "black olive dressing", "brown sauce", "buffalo sauce",
  "chipotle mayo", "cilantro lime vinaigrette", "cranberry sauce", "creamy italian dressing",
  "diablo sauce", "dijon mustard", "dressing", "garlic & olive oil", "garlic white wine sauce",
  "gravy", "guacamole", "honey balsamic dressing", "honey mustard", "horseradish",
  "lemon garlic dressing", "lemon vinaigrette", "marinara sauce", "mayo", "mayonnaise",
  "olive oil", "olive oil & lemon dressing", "pesto", "pesto sauce",
  "poppy white wine vinaigrette", "ranch dressing", "raspberry vinaigrette", "red clam sauce",
  "russian dressing", "salsa", "sour cream", "soy sauce", "sun-dried tomato pesto",
  "tartar sauce", "teriyaki dressing", "teriyaki sauce", "tzatziki sauce", "vodka sauce",
  "white balsamic dressing", "white clam sauce", "choice of dressing", "pico de gallo",
]);

const VEGGIES = new Set([
  "artichoke hearts", "arugula", "avocado", "bermuda onion", "black beans", "broccoli",
  "brown onion", "brown onions", "cabbage", "carrots", "cherry tomatoes", "chickpeas",
  "cilantro", "corn", "cucumber", "eggplant", "fresh vegetables", "garlic", "green peppers",
  "iceberg lettuce", "jalapeño peppers", "lettuce", "lettuce wrap", "mesclun", "mixed greens", "mushrooms",
  "fresh mushrooms", "olives", "onion", "peas", "peppers", "pickles", "portabella mushrooms",
  "potatoes", "red beans", "red onion", "red peppers", "roasted peppers", "romaine lettuce",
  "sauerkraut", "sautéed onions", "scallions", "snow peas", "spinach", "string beans",
  "sun-dried tomatoes", "tomato", "white beans", "zucchini", "fried onions",
  "fried string onions", "fried string onions", "fried string onions",
]);

const FRUITS = new Set([
  "apple", "green apple", "blueberries", "blueberry", "cherry", "cranberry", "grapefruit",
  "lemon", "lemon wedge", "lime", "lime juice", "mandarin orange", "mandarin oranges",
  "mango", "melon", "orange", "pear", "pears", "poached pear", "poached pears",
  "pineapple", "raisin", "raisins", "strawberry", "strawberries", "sun-dried cranberries",
  "fresh fruit", "fruit cup",
]);

const PREP_KIND_BY_GROUP_KIND: Record<string, PreparationKind | undefined> = {
  protein_cook: "meat_cook",
  egg_cook: "egg_cook",
  bread_prep: "bread_prep",
};

const TARGET_KIND_BY_GROUP_KIND: Record<string, IngredientKind | undefined> = {
  protein: "protein",
  egg: "egg",
  bread: "bread",
  cheese: "cheese",
  sauce: "sauce",
  side: "side",
  side_secondary: "side",
};

const TARGET_KIND_BY_PREP_KIND: Record<PreparationKind, IngredientKind | undefined> = {
  meat_cook: "protein",
  egg_cook: "egg",
  bread_prep: "bread",
  other: undefined,
};

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function lower(value: string): string {
  return value.trim().toLowerCase();
}

function isNoneLabel(value: string): boolean {
  const name = lower(value);
  return name === "none" || name === "no" || name.startsWith("no ");
}

function isServiceActionLabel(value: string): boolean {
  const name = lower(value);
  return (
    name === "normal" ||
    name === "on side" ||
    name === "side" ||
    name === "extra" ||
    name.startsWith("extra ") ||
    name.startsWith("preparation —") ||
    name.includes("verify") ||
    name === "substitution" ||
    name === "bread type" ||
    name === "toast prep"
  );
}

function normalizedTokens(value: string): string[] {
  return lower(value)
    .replace(/\bpatti\b/g, "patty")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function alternativeOptionIndexes(
  text: string,
  optionNames: string[],
): Set<number> {
  const result = new Set<number>();
  if (optionNames.length < 2 || !/\bor\b/i.test(text)) return result;

  const tokenSets = optionNames.map((name) => new Set(normalizedTokens(name)));
  const commonTokens = new Set(
    [...(tokenSets[0] ?? [])].filter((token) =>
      tokenSets.every((tokens) => tokens.has(token)),
    ),
  );
  const distinctive = tokenSets.map((tokens) => {
    const values = [...tokens].filter((token) => !commonTokens.has(token));
    return values.length > 0 ? values : [...tokens];
  });

  const source = lower(text);
  const orPattern = /\bor\b/g;
  for (const match of source.matchAll(orPattern)) {
    const at = match.index ?? -1;
    if (at < 0) continue;
    const before = source.slice(0, at);
    const after = source.slice(at + match[0].length);
    const leftBoundary = Math.max(
      before.lastIndexOf(","),
      before.lastIndexOf(";"),
      before.lastIndexOf("."),
    );
    const rightCandidates = [after.indexOf(","), after.indexOf(";"), after.indexOf(".")]
      .filter((value) => value >= 0);
    const rightBoundary = rightCandidates.length > 0 ? Math.min(...rightCandidates) : after.length;
    const leftTokens = new Set(normalizedTokens(before.slice(leftBoundary + 1)));
    const rightTokens = new Set(normalizedTokens(after.slice(0, rightBoundary)));

    const leftMatches: number[] = [];
    const rightMatches: number[] = [];
    distinctive.forEach((tokens, index) => {
      if (tokens.every((token) => leftTokens.has(token))) leftMatches.push(index);
      if (tokens.every((token) => rightTokens.has(token))) rightMatches.push(index);
    });

    for (const leftIndex of leftMatches) {
      for (const rightIndex of rightMatches) {
        if (leftIndex === rightIndex) continue;
        result.add(leftIndex);
        result.add(rightIndex);
      }
    }
  }

  return result;
}

export function ingredientKind(name: string): IngredientKind {
  const value = lower(name);
  if (value === "egg" || value === "eggs" || value === "sliced egg") return "egg";
  if (CHEESES.has(value)) return "cheese";
  if (PROTEINS.has(value)) return "protein";
  if (BREADS.has(value)) return "bread";
  if (SAUCES.has(value)) return "sauce";
  if (VEGGIES.has(value)) return "veggie";
  if (FRUITS.has(value)) return "fruit";
  if (SIDES.has(value)) return "side";
  return "other";
}

function supportsPreparation(
  ingredientName: string,
  kind: PreparationKind,
): boolean {
  const value = lower(ingredientName);
  if (kind === "meat_cook") return MEAT_COOK_INGREDIENTS.has(value);
  if (kind === "egg_cook") return ingredientKind(ingredientName) === "egg";
  if (kind === "bread_prep") return ingredientKind(ingredientName) === "bread";
  return true;
}

export function buildMenuOntology(): {
  preparationSchemes: SourcePreparationScheme[];
  componentRules: SourceComponentRule[];
  replacementRules: SourceReplacementRule[];
  choiceSlots: SourceChoiceSlot[];
} {
  const ingredientById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
  const ingredientByName = new Map(ingredients.map((ingredient) => [lower(ingredient.name), ingredient]));
  const itemById = new Map(items.map((item) => [item.id, item]));
  const groupById = new Map(modifierGroups.map((group) => [group.id, group]));
  const optionsByGroup = new Map<string, typeof modifiers>();
  for (const modifier of modifiers) {
    const current = optionsByGroup.get(modifier.modifierGroupId) ?? [];
    current.push(modifier);
    optionsByGroup.set(modifier.modifierGroupId, current);
  }

  const linksByItem = new Map<string, typeof itemModifierGroups>();
  for (const link of itemModifierGroups) {
    const current = linksByItem.get(link.itemId) ?? [];
    current.push(link);
    linksByItem.set(link.itemId, current);
  }

  const carrierItemIds = new Set(
    itemModifierGroups
      .filter((link) => CARRIER_SOURCE_GROUP_IDS.has(link.modifierGroupId))
      .map((link) => link.itemId),
  );

  const standardByItem = new Map<string, Set<string>>();
  for (const link of itemIngredients) {
    if (!link.isStandard) continue;
    const current = standardByItem.get(link.itemId) ?? new Set<string>();
    current.add(link.ingredientId);
    standardByItem.set(link.itemId, current);
  }

  const resolveOptionIngredientId = (option: (typeof modifiers)[number]): string | null => {
    if (option.ingredientId) return option.ingredientId;
    if (isNoneLabel(option.name) || isServiceActionLabel(option.name)) return null;
    return ingredientByName.get(lower(option.name))?.id ?? null;
  };

  const preparationSchemesBySignature = new Map<string, SourcePreparationScheme>();
  const sourceGroupToPreparationKey = new Map<string, string>();

  for (const group of modifierGroups) {
    const kind = PREP_KIND_BY_GROUP_KIND[group.kind];
    if (!kind) continue;

    const options = (optionsByGroup.get(group.id) ?? [])
      .filter((option) => !option.requiresReview && !isNoneLabel(option.name) && !isServiceActionLabel(option.name))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

    if (options.length < 2) continue;

    const signature = `${kind}|${options.map((option) => lower(option.name)).join("|")}`;
    let scheme = preparationSchemesBySignature.get(signature);
    if (!scheme) {
      const sourceKey = `prep_${kind}_${slug(options.map((option) => option.name).join("_"))}`;
      scheme = {
        sourceKey,
        label: group.displayName,
        kind,
        options: options.map((option) => ({
          label: option.name,
          sortOrder: option.sortOrder,
          isDefault: false,
        })),
      };
      preparationSchemesBySignature.set(signature, scheme);
    }
    sourceGroupToPreparationKey.set(group.id, scheme.sourceKey);
  }

  const explicitRoleByItemIngredient = new Map<string, ComponentRole>();
  for (const [itemId, links] of linksByItem) {
    const standards = standardByItem.get(itemId) ?? new Set<string>();
    for (const link of links) {
      const group = groupById.get(link.modifierGroupId);
      const role =
        CARRIER_SOURCE_GROUP_IDS.has(link.modifierGroupId)
          ? "carrier"
          : group
            ? TARGET_KIND_BY_GROUP_KIND[group.kind]
            : undefined;
      if (!group || !role) continue;
      for (const option of optionsByGroup.get(group.id) ?? []) {
        const ingredientId = resolveOptionIngredientId(option);
        if (ingredientId && standards.has(ingredientId)) {
          explicitRoleByItemIngredient.set(`${itemId}|${ingredientId}`, role);
        }
      }
    }
  }

  const preparationByItemRole = new Map<string, string>();
  for (const [itemId, links] of linksByItem) {
    const candidatesByRole = new Map<ComponentRole, Set<string>>();
    for (const link of links) {
      const group = groupById.get(link.modifierGroupId);
      if (!group) continue;
      const prepKind = PREP_KIND_BY_GROUP_KIND[group.kind];
      const role =
        prepKind === "bread_prep" && carrierItemIds.has(itemId)
          ? "carrier"
          : prepKind
            ? TARGET_KIND_BY_PREP_KIND[prepKind]
            : undefined;
      const sourceKey = sourceGroupToPreparationKey.get(group.id);
      if (!role || !sourceKey) continue;
      const current = candidatesByRole.get(role) ?? new Set<string>();
      current.add(sourceKey);
      candidatesByRole.set(role, current);
    }
    for (const [role, sourceKeys] of candidatesByRole) {
      if (sourceKeys.size === 1) {
        preparationByItemRole.set(`${itemId}|${role}`, [...sourceKeys][0]!);
      }
    }
  }

  // A preparation scheme can be attached directly to a standard component only
  // when that item has exactly one standard component in the scheme's role.
  // Example: Steak & Eggs has one protein (Steak), so MEAT COOK belongs to Steak.
  // A Cobb has Chicken + Bacon; a generic protein-cook group is ambiguous there,
  // so we do not guess which protein it belongs to.
  const roleByItemIngredient = new Map<string, ComponentRole>();
  const standardIngredientsByItemRole = new Map<string, string[]>();
  for (const link of itemIngredients) {
    if (!link.isStandard) continue;
    const ingredient = ingredientById.get(link.ingredientId);
    const inferredRole = ingredientKind(ingredient?.name ?? "");
    const componentKey = `${link.itemId}|${link.ingredientId}`;
    const role =
      COMPONENT_ROLE_OVERRIDES.get(componentKey) ??
      explicitRoleByItemIngredient.get(componentKey) ??
      (inferredRole === "bread" && carrierItemIds.has(link.itemId)
        ? "carrier"
        : inferredRole);
    roleByItemIngredient.set(`${link.itemId}|${link.ingredientId}`, role);
    const roleKey = `${link.itemId}|${role}`;
    const current = standardIngredientsByItemRole.get(roleKey) ?? [];
    current.push(link.ingredientId);
    standardIngredientsByItemRole.set(roleKey, current);
  }

  const preparationByItemIngredient = new Map<string, string>();
  for (const [itemRoleKey, sourceKey] of preparationByItemRole) {
    const ingredientIds = standardIngredientsByItemRole.get(itemRoleKey) ?? [];
    if (ingredientIds.length === 1) {
      const ingredientId = ingredientIds[0]!;
      const ingredient = ingredientById.get(ingredientId);
      const scheme = [...preparationSchemesBySignature.values()].find(
        (candidate) => candidate.sourceKey === sourceKey,
      );
      if (
        ingredient &&
        scheme &&
        supportsPreparation(ingredient.name, scheme.kind)
      ) {
        const itemId = itemRoleKey.slice(0, itemRoleKey.lastIndexOf("|"));
        preparationByItemIngredient.set(`${itemId}|${ingredientId}`, sourceKey);
      }
    }
  }

  const componentRules: SourceComponentRule[] = itemIngredients
    .filter((link) => link.isStandard)
    .map((link) => ({
      itemId: link.itemId,
      ingredientId: link.ingredientId,
      role: roleByItemIngredient.get(`${link.itemId}|${link.ingredientId}`) ?? "other",
      relationship:
        COMPONENT_RELATIONSHIP_OVERRIDES.get(
          `${link.itemId}|${link.ingredientId}`,
        ) ?? null,
      preparationSourceKey:
        preparationByItemIngredient.get(`${link.itemId}|${link.ingredientId}`) ?? null,
      canRemove: link.canRemove,
      canSide: link.canSide,
      canExtra: link.canExtra,
      canReplace: false,
      replacementOptionsConfigured: false,
      sortOrder: link.sortOrder,
    }));
  const componentRuleByKey = new Map(
    componentRules.map((rule) => [`${rule.itemId}|${rule.ingredientId}`, rule]),
  );

  const choiceSlots: SourceChoiceSlot[] = [];
  const choiceSlotIndexByKey = new Map<string, number>();

  for (const [itemId, links] of linksByItem) {
    const standards = standardByItem.get(itemId) ?? new Set<string>();

    for (const link of [...links].sort((a, b) => a.sortOrder - b.sortOrder)) {
      const group = groupById.get(link.modifierGroupId);
      if (!group || PREP_KIND_BY_GROUP_KIND[group.kind]) continue;

      const role =
        CARRIER_SOURCE_GROUP_IDS.has(link.modifierGroupId)
          ? "carrier"
          : TARGET_KIND_BY_GROUP_KIND[group.kind] ?? "other";

      // Some retained groups prove that the existing component could be
      // replaced without identifying the complete allowed replacement set.
      // Preserve that capability before filtering unresolved/review options.
      if (
        UNCONFIGURED_REPLACEMENT_SOURCE_GROUP_IDS.has(
          link.modifierGroupId,
        )
      ) {
        const sourceIngredientIds =
          standardIngredientsByItemRole.get(`${itemId}|${role}`) ?? [];

        if (sourceIngredientIds.length !== 1) {
          throw new Error(
            `Unconfigured replacement group ${link.modifierGroupId} on ${itemId} ` +
            `must resolve to exactly one standard ${role} component`,
          );
        }

        const sourceIngredientId = sourceIngredientIds[0]!;
        const sourceComponent =
          componentRuleByKey.get(`${itemId}|${sourceIngredientId}`);

        if (!sourceComponent) {
          throw new Error(
            `Replacement-capable source component missing for ${itemId}|${sourceIngredientId}`,
          );
        }

        sourceComponent.canReplace = true;
        sourceComponent.replacementOptionsConfigured = false;
      }

      const rawOptions = (optionsByGroup.get(group.id) ?? [])
        .filter((option) => !option.requiresReview)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

      let options = rawOptions.filter(
        (option) => isNoneLabel(option.name) || !isServiceActionLabel(option.name),
      );

      if (options.length === 0) continue;

      let meaningful = options.filter((option) => !isNoneLabel(option.name));
      if (meaningful.length === 0) continue;

      // Generated source rows occasionally mix a dish-level label (for example
      // "Grilled Chicken Sandwich") with the actual ingredient component
      // ("Grilled Chicken"). If the descriptive label does not resolve to an
      // ingredient and contains a resolved option name, keep the ingredient.
      const resolvedNames = meaningful
        .map((option) => ({ option, ingredientId: resolveOptionIngredientId(option) }))
        .filter((entry) => entry.ingredientId !== null);
      meaningful = meaningful.filter((option) => {
        if (resolveOptionIngredientId(option) !== null) return true;
        const optionName = lower(option.name);
        return !resolvedNames.some(({ option: resolvedOption }) =>
          optionName.includes(lower(resolvedOption.name)),
        );
      });
      const meaningfulIds = new Set(meaningful.map((option) => option.id));
      options = options.filter((option) => isNoneLabel(option.name) || meaningfulIds.has(option.id));
      if (meaningful.length === 0) continue;

      let resolvedMeaningful = meaningful.map((option) => ({
        option,
        ingredientId: resolveOptionIngredientId(option),
      }));
      const standardRoleIngredients = standardIngredientsByItemRole.get(`${itemId}|${role}`) ?? [];
      const hasNone = options.some((option) => isNoneLabel(option.name));

      if (meaningful.length === 1) {
        // One real ingredient plus NONE/service actions describes a PART, not
        // a separate question. This also repairs source snapshots where a
        // default component (for example Cheese) existed only in the legacy
        // modifier group and was omitted from the flat standard-ingredient list.
        const onlyIngredientId = resolvedMeaningful[0]?.ingredientId ?? null;
        if (onlyIngredientId !== null && hasNone) {
          const componentKey = `${itemId}|${onlyIngredientId}`;
          const existing = componentRuleByKey.get(componentKey);
          const ingredient = ingredientById.get(onlyIngredientId);
          const prepSourceKey = preparationByItemRole.get(`${itemId}|${role}`) ?? null;
          const applicablePrep = prepSourceKey
            ? [...preparationSchemesBySignature.values()].find(
                (candidate) => candidate.sourceKey === prepSourceKey,
              )
            : null;
          const canSide = rawOptions.some((option) => {
            const label = lower(option.name);
            return label === "side" || label === "on side";
          });
          const canExtra = rawOptions.some((option) => lower(option.name).startsWith("extra"));

          if (existing) {
            existing.canRemove = true;
            existing.canSide = existing.canSide || canSide;
            existing.canExtra = existing.canExtra || canExtra;
          } else if (ingredient) {
            const rule: SourceComponentRule = {
              itemId,
              ingredientId: onlyIngredientId,
              role,
              relationship:
                COMPONENT_RELATIONSHIP_OVERRIDES.get(
                  `${itemId}|${onlyIngredientId}`,
                ) ?? null,
              preparationSourceKey:
                applicablePrep && supportsPreparation(ingredient.name, applicablePrep.kind)
                  ? prepSourceKey
                  : null,
              canRemove: true,
              canSide,
              canExtra,
              canReplace: false,
              replacementOptionsConfigured: false,
              sortOrder: link.sortOrder,
            };
            componentRules.push(rule);
            componentRuleByKey.set(componentKey, rule);
            standards.add(onlyIngredientId);
          }
        }
        continue;
      } else if (role === "protein" || role === "cheese" || role === "egg") {
        const item = itemById.get(itemId);
        const itemText = `${item?.name ?? ""} ${item?.description ?? ""}`;
        const evidencedIndexes = alternativeOptionIndexes(
          itemText,
          meaningful.map((option) => option.name),
        );
        if (evidencedIndexes.size < 2) continue;

        meaningful = meaningful.filter((_, index) => evidencedIndexes.has(index));
        const evidencedIds = new Set(meaningful.map((option) => option.id));
        options = options.filter((option) => isNoneLabel(option.name) || evidencedIds.has(option.id));
      }

      const standardOptionIds = new Set(
        meaningful
          .map((option) => resolveOptionIngredientId(option))
          .filter(
            (ingredientId): ingredientId is string =>
              ingredientId !== null && standards.has(ingredientId),
          ),
      );

      const slotOptions: SourceChoiceSlotOption[] = options.map((option) => {
        const ingredientId = resolveOptionIngredientId(option);
        return {
          label: isNoneLabel(option.name) ? "None" : option.name,
          ingredientId,
          priceAdjustment: option.priceAdjustment,
          priceConfigured:
            option.priceConfigured ||
            isNoneLabel(option.name) ||
            (ingredientId !== null && standards.has(ingredientId)),
          isNoneOption: option.isNoneOption || isNoneLabel(option.name),
          // A single standard recipe component is the default for a typed slot.
          // If multiple alternatives were historically marked standard, the
          // source does not tell us which one wins, so the server must choose.
          isDefault:
            ingredientId !== null &&
            standardOptionIds.size === 1 &&
            standardOptionIds.has(ingredientId),
          preparationSourceKey: (() => {
            if (ingredientId === null) return null;
            const sourceKey = preparationByItemRole.get(`${itemId}|${role}`) ?? null;
            if (!sourceKey) return null;
            const scheme = [...preparationSchemesBySignature.values()].find(
              (candidate) => candidate.sourceKey === sourceKey,
            );
            const ingredient = ingredientById.get(ingredientId);
            return ingredient && scheme && supportsPreparation(ingredient.name, scheme.kind)
              ? sourceKey
              : null;
          })(),
          sortOrder: option.sortOrder,
        };
      });

      if (slotOptions.length < Math.max(group.minSelections, 1)) continue;

      // De-duplicate equivalent source groups (for example Dessert and
      // Choose Dessert carrying the same options). Identity comes from the
      // actual question shape, not the display label.
      const semanticOptionKey = slotOptions
        .map((option) => `${option.ingredientId ?? lower(option.label)}:${option.isNoneOption}`)
        .sort()
        .join("|");
      const choiceSlotKey = `${itemId}|${slotOptions.length}|${semanticOptionKey}|${group.minSelections}|${group.maxSelections ?? "n"}`;
      const existingIndex = choiceSlotIndexByKey.get(choiceSlotKey);

      if (existingIndex !== undefined) {
        const existing = choiceSlots[existingIndex]!;
        if (existing.role === "other" && role !== "other") {
          choiceSlots[existingIndex] = {
            ...existing,
            sourceGroupId: group.id,
            label: group.displayName,
            role,
            sortOrder: Math.min(existing.sortOrder, link.sortOrder),
          };
        }
        continue;
      }

      choiceSlotIndexByKey.set(choiceSlotKey, choiceSlots.length);

      choiceSlots.push({
        itemId,
        sourceGroupId: group.id,
        label: group.displayName,
        role,
        relationship: null,
        minSelections: group.minSelections,
        maxSelections:
          group.maxSelections === null
            ? null
            : Math.min(group.maxSelections, slotOptions.length),
        sortOrder: link.sortOrder,
        options: slotOptions,
      });
    }
  }

  const slotIngredientKeys = new Set(
    choiceSlots.flatMap((slot) =>
      slot.options.flatMap((option) =>
        option.ingredientId ? [`${slot.itemId}|${option.ingredientId}`] : [],
      ),
    ),
  );
  const defaultSlotIngredientKeys = new Set(
    choiceSlots.flatMap((slot) =>
      slot.options.flatMap((option) =>
        option.ingredientId && option.isDefault
          ? [`${slot.itemId}|${option.ingredientId}`]
          : [],
      ),
    ),
  );

  // A true no-default choice is not part of the base recipe. A slot with one
  // explicit default keeps that default as a component so migration 027 can
  // convert alternatives into REPLACE capabilities instead of creating a fake
  // second question.
  const fixedComponentRules = componentRules.filter((component) => {
    const key = `${component.itemId}|${component.ingredientId}`;
    return !slotIngredientKeys.has(key) || defaultSlotIngredientKeys.has(key);
  });

  // Replacement rules must come from explicit restaurant policy or
  // explicit retained menu truth. Component role alone never grants SUB FOR.
  //
  // The old generic-bread implementation lived here and inferred a shared
  // replacement catalog from one legacy modifier group. It was intentionally
  // removed.
  const replacementRules: SourceReplacementRule[] = [];
  const replacementRuleKeys = new Set<string>();

  for (const policy of HOUSE_CARRIER_SUBSTITUTION_RULES) {
    const sourceIngredient = ingredientByName.get(lower(policy.sourceName));
    const replacementIngredient =
      ingredientByName.get(lower(policy.replacementName));

    if (!sourceIngredient) {
      throw new Error(
        `Carrier substitution source ingredient not found: ${policy.sourceName}`,
      );
    }

    if (!replacementIngredient) {
      throw new Error(
        `Carrier substitution replacement ingredient not found: ${policy.replacementName}`,
      );
    }

    if (sourceIngredient.id === replacementIngredient.id) {
      throw new Error(
        `Carrier substitution cannot replace ${policy.sourceName} with itself`,
      );
    }

    const specificItemIds =
      policy.appliesTo === "specific_items"
        ? new Set(policy.itemIds)
        : null;

    for (const component of fixedComponentRules) {
      if (
        component.role !== "carrier" ||
        component.ingredientId !== sourceIngredient.id ||
        (specificItemIds && !specificItemIds.has(component.itemId))
      ) {
        continue;
      }

      const key =
        `${component.itemId}|${sourceIngredient.id}|${replacementIngredient.id}`;

      if (replacementRuleKeys.has(key)) {
        throw new Error(`Duplicate carrier substitution policy: ${key}`);
      }

      replacementRuleKeys.add(key);

      // A concrete explicit policy row proves both permission and a configured
      // replacement catalog for this source component.
      component.canReplace = true;
      component.replacementOptionsConfigured = true;

      const sourceScheme = component.preparationSourceKey
        ? [...preparationSchemesBySignature.values()].find(
            (scheme) => scheme.sourceKey === component.preparationSourceKey,
          )
        : null;

      replacementRules.push({
        itemId: component.itemId,
        sourceIngredientId: sourceIngredient.id,
        replacementIngredientId: replacementIngredient.id,
        preparationSourceKey:
          component.preparationSourceKey &&
          sourceScheme &&
          supportsPreparation(replacementIngredient.name, sourceScheme.kind)
            ? component.preparationSourceKey
            : null,
        priceAdjustment: policy.priceAdjustment,
        priceConfigured: policy.priceConfigured,
        sortOrder: policy.sortOrder,
      });
    }
  }

  return {
    preparationSchemes: [...preparationSchemesBySignature.values()].sort((a, b) =>
      a.sourceKey.localeCompare(b.sourceKey),
    ),
    componentRules: fixedComponentRules,
    replacementRules,
    choiceSlots,
  };
}
