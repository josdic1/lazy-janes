import type {
  ChoiceOption,
  CreateOrderInput,
  EffectiveChoiceSlot,
  FulfillmentType,
  Ingredient,
  IngredientPopularity,
  MenuCategory,
  MenuCustomizationCatalog,
  MenuGroup,
  MenuItem,
  MenuItemIngredient,
  MenuItemIngredientReplacement,
  PreparationOption,
  PreparationScheme,
  Order,
  PartyListItem,
  UniversalMenu,
  Variant,
  VariantOption,
} from "@lazy-janes/shared";
import { activeMenuRules, resolveChoiceSlots } from "@lazy-janes/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getMenuCustomizationCatalog,
  getMenuIngredientPopularity,
  getMenuItems,
  getMenuTaxonomy,
  getNormalizedMenu,
} from "../api/menu";
import { createOrder, fireOrder } from "../api/orders";
import { getParties } from "../api/parties";

type ChoiceSelection = {
  group: EffectiveChoiceSlot;
  option: ChoiceOption;
  priceAdjustment: number;
  priceAdjustmentConfigured: boolean;
};

type VariantSelection = {
  variant: Variant;
  option: VariantOption;
  priceAdjustment: number;
  priceAdjustmentConfigured: boolean;
};

type ReplacementSelection = {
  rule: MenuItemIngredientReplacement;
  replacementIngredient: Ingredient;
};

type PreparationSelection = {
  targetKind: "ingredient" | "choice";
  ingredientId: string | null;
  choiceOptionId: string | null;
  targetLabel: string;
  scheme: PreparationScheme;
  option: PreparationOption;
};

type CartItem = {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  removedIngredients: MenuItemIngredient[];
  sideIngredients: MenuItemIngredient[];
  extraIngredients: MenuItemIngredient[];
  addedIngredients: Ingredient[];
  replacements: ReplacementSelection[];
  variantSelections: VariantSelection[];
  choiceSelections: ChoiceSelection[];
  preparationSelections: PreparationSelection[];
  kitchenNote: string;
};

const EMPTY_CUSTOMIZATION: MenuCustomizationCatalog = {
  ingredients: [],
  preparationSchemes: [],
  itemIngredients: [],
  replacements: [],
  choiceGroups: [],
  choiceConstraints: [],
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function money(value: number): string {
  return `$${Math.abs(value).toFixed(2)}`;
}

function priceDelta(value: number, configured = true): string {
  if (!configured) return "PRICE TBD";
  if (value === 0) return "Included";
  return `${value > 0 ? "+" : "−"}${money(value)}`;
}

function partyLabel(party: PartyListItem): string {
  const tables = party.tableLabels.map((label) => `Table ${label}`).join(" + ");
  if (party.name && tables) return `${party.name} · ${tables}`;
  if (party.name) return party.name;
  return tables || `Party of ${party.guestCount}`;
}

function sortedKey(values: string[]): string {
  return [...values].sort().join(",");
}

function cartKey(
  item: MenuItem,
  removedIds: string[],
  sideIds: string[],
  extraIds: string[],
  addedIds: string[],
  replacementKeys: string[],
  variantOptionIds: string[],
  choiceOptionIds: string[],
  preparationKeys: string[] = [],
): string {
  return [
    item.id,
    `no=${sortedKey(removedIds)}`,
    `side=${sortedKey(sideIds)}`,
    `extra=${sortedKey(extraIds)}`,
    `add=${sortedKey(addedIds)}`,
    `replace=${sortedKey(replacementKeys)}`,
    `variant=${sortedKey(variantOptionIds)}`,
    `choice=${sortedKey(choiceOptionIds)}`,
    `prep=${sortedKey(preparationKeys)}`,
  ].join(":");
}

function lineAdjustment(entry: CartItem): number {
  const extras = entry.extraIngredients.reduce(
    (sum, ingredient) =>
      sum + (ingredient.extraPriceConfigured ? ingredient.extraPrice : 0),
    0,
  );
  const additions = entry.addedIngredients.reduce(
    (sum, ingredient) =>
      sum + (ingredient.addPriceConfigured ? ingredient.defaultAddPrice : 0),
    0,
  );
  const replacements = entry.replacements.reduce(
    (sum, selection) =>
      sum + (selection.rule.priceAdjustmentConfigured ? selection.rule.priceAdjustment : 0),
    0,
  );
  const variants = entry.variantSelections.reduce(
    (sum, selection) =>
      sum + (selection.priceAdjustmentConfigured ? selection.priceAdjustment : 0),
    0,
  );
  const choices = entry.choiceSelections.reduce(
    (sum, selection) =>
      sum + (selection.priceAdjustmentConfigured ? selection.priceAdjustment : 0),
    0,
  );

  return extras + additions + replacements + variants + choices;
}

function hasPendingPrice(entry: CartItem): boolean {
  return (
    entry.extraIngredients.some(
      (ingredient) => !ingredient.extraPriceConfigured,
    ) ||
    entry.addedIngredients.some(
      (ingredient) => !ingredient.addPriceConfigured,
    ) ||
    entry.replacements.some(
      (selection) => !selection.rule.priceAdjustmentConfigured,
    ) ||
    entry.variantSelections.some(
      (selection) => !selection.priceAdjustmentConfigured,
    ) ||
    entry.choiceSelections.some(
      (selection) => !selection.priceAdjustmentConfigured,
    )
  );
}

function allergenLabel(flag: string): string {
  return flag.replace(/_/g, " ").toUpperCase();
}

const RESTAURANT_TIME_ZONE = "America/New_York";

function restaurantLocalTime(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: RESTAURANT_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;

  if (!hour || !minute) {
    throw new Error("Could not resolve restaurant local time");
  }

  return `${hour}:${minute}`;
}

function safetyWarningLabel(
  declaration: MenuItem["safetyDeclarations"][number],
): string {
  if (declaration.kind === "may_contain" && declaration.allergenFlag) {
    return `MAY CONTAIN ${allergenLabel(declaration.allergenFlag)}`;
  }
  if (declaration.kind === "cross_contact" && declaration.allergenFlag) {
    return `CROSS-CONTACT: ${allergenLabel(declaration.allergenFlag)}`;
  }
  if (declaration.kind === "shared_fryer") {
    return declaration.note
      ? `SHARED FRYER: ${declaration.note}`
      : "SHARED FRYER";
  }
  if (declaration.kind === "shared_equipment") {
    return declaration.note
      ? `SHARED EQUIPMENT: ${declaration.note}`
      : "SHARED EQUIPMENT";
  }
  return declaration.note?.toUpperCase() ?? declaration.kind.toUpperCase();
}

export function OrderEntryPage() {
  const [searchParams] = useSearchParams();
  const requestedPartyId = searchParams.get("partyId");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [taxonomy, setTaxonomy] = useState<MenuGroup[]>([]);
  const [normalizedMenu, setNormalizedMenu] =
    useState<UniversalMenu>({
      id: "",
      name: "",
      offerings: [],
      rules: [],
    });
  const [customization, setCustomization] =
    useState<MenuCustomizationCatalog>(EMPTY_CUSTOMIZATION);
  const [parties, setParties] = useState<PartyListItem[]>([]);
  const [ruleClock, setRuleClock] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(
      () => setRuleClock(new Date()),
      30_000,
    );

    return () => window.clearInterval(timer);
  }, []);

  const ruleLocalTime = restaurantLocalTime(ruleClock);

  const activeRules = useMemo(
    () => activeMenuRules(normalizedMenu, { localTime: ruleLocalTime }),
    [normalizedMenu, ruleLocalTime],
  );

  const unavailableChoiceOptionIds = useMemo(
    () =>
      new Set(
        activeRules.flatMap((rule) =>
          rule.target.kind === "choice_option" &&
          rule.effect.kind === "availability" &&
          rule.effect.available === false
            ? [rule.target.optionId]
            : [],
        ),
      ),
    [activeRules],
  );

  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("dine_in");
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [removedIngredientIds, setRemovedIngredientIds] = useState<string[]>([]);
  const [sideIngredientIds, setSideIngredientIds] = useState<string[]>([]);
  const [extraIngredientIds, setExtraIngredientIds] = useState<string[]>([]);
  const [addedIngredientIds, setAddedIngredientIds] = useState<string[]>([]);
  const [replacementIngredientIdBySource, setReplacementIngredientIdBySource] =
    useState<Record<string, string>>({});
  const [selectedVariantOptionIdByVariant, setSelectedVariantOptionIdByVariant] =
    useState<Record<string, string>>({});
  const [selectedChoiceOptionIds, setSelectedChoiceOptionIds] =
    useState<string[]>([]);
  const [selectedPreparationOptionByTarget, setSelectedPreparationOptionByTarget] =
    useState<Record<string, string>>({});
  const [addSearch, setAddSearch] = useState("");
  const [ingredientPopularityByItem, setIngredientPopularityByItem] = useState<
    Record<string, IngredientPopularity[]>
  >({});
  const addSearchInputRef = useRef<HTMLInputElement>(null);
  const [kitchenNote, setKitchenNote] = useState("");
  const [editingCartId, setEditingCartId] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

  async function refreshServiceContext() {
    const partyList = await getParties();
    setParties(partyList);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [
          menuItems,
          groups,
          normalizedOfferings,
          catalog,
          partyList,
        ] = await Promise.all([
          getMenuItems(),
          getMenuTaxonomy(),
          getNormalizedMenu(),
          getMenuCustomizationCatalog(),
          getParties(),
        ]);

        if (cancelled) {
          return;
        }

        setMenu(menuItems);
        setTaxonomy(groups);
        setNormalizedMenu(normalizedOfferings);
        setCustomization(catalog);
        setParties(partyList);

        if (
          requestedPartyId &&
          partyList.some(
            (party) =>
              party.id === requestedPartyId &&
              (party.status === "seated" || party.status === "in_service") &&
              party.tableLabels.length > 0,
          )
        ) {
          setSelectedPartyId(requestedPartyId);
        }

        const firstGroup = groups.find(
          (group) =>
            group.isActive && group.categories.some((category) => category.isActive),
        );
        const firstCategory = firstGroup?.categories.find(
          (category) => category.isActive,
        );

        setSelectedGroupId(firstGroup?.id ?? "");
        setSelectedCategoryId(firstCategory?.id ?? "");
      } catch (loadError: unknown) {
        if (!cancelled) {
          setError(errorMessage(loadError));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [requestedPartyId]);

  useEffect(() => {
    if (!selectedItem || ingredientPopularityByItem[selectedItem.id]) {
      return;
    }

    let cancelled = false;

    void getMenuIngredientPopularity(selectedItem.id)
      .then((popularity) => {
        if (cancelled) return;
        setIngredientPopularityByItem((current) => ({
          ...current,
          [selectedItem.id]: popularity,
        }));
      })
      .catch(() => {
        if (cancelled) return;
        // Ranking is an enhancement. Ordering still works alphabetically if
        // history is unavailable.
        setIngredientPopularityByItem((current) => ({
          ...current,
          [selectedItem.id]: [],
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [ingredientPopularityByItem, selectedItem]);

  const activeGroups = useMemo(
    () =>
      taxonomy.filter(
        (group) =>
          group.isActive && group.categories.some((category) => category.isActive),
      ),
    [taxonomy],
  );

  const selectedGroup =
    activeGroups.find((group) => group.id === selectedGroupId) ?? null;

  const categories = useMemo(
    () => selectedGroup?.categories.filter((category) => category.isActive) ?? [],
    [selectedGroup],
  );

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const availableItems = menu.filter(
      (item) => !item.isModifier && (item.status === "available" || item.status === "eighty_sixed"),
    );

    if (query !== "") {
      return availableItems
        .filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query),
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    return availableItems
      .filter((item) => item.categoryId === selectedCategoryId)
      .sort(
        (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
      );
  }, [menu, search, selectedCategoryId]);

  const activeParties = useMemo(
    () =>
      parties
        .filter(
          (party) =>
            (party.status === "seated" || party.status === "in_service") &&
            party.tableLabels.length > 0,
        )
        .sort((a, b) =>
          partyLabel(a).localeCompare(partyLabel(b), undefined, { numeric: true }),
        ),
    [parties],
  );

  const normalizedMenuById = useMemo(
    () => new Map(normalizedMenu.offerings.map((offering) => [offering.id, offering])),
    [normalizedMenu],
  );

  function normalizedComponent(itemId: string, ingredientId: string) {
    return normalizedMenuById
      .get(itemId)
      ?.components.find((component) => component.id === ingredientId) ?? null;
  }

  function hasNormalizedCapability(
    itemId: string,
    ingredientId: string,
    capability: "remove" | "side" | "extra",
  ): boolean {
    return (
      normalizedComponent(itemId, ingredientId)?.capabilities.some(
        (entry) =>
          entry.kind === capability &&
          entry.configurationState === "configured",
      ) ?? false
    );
  }

  function normalizedReplacementTargets(
    itemId: string,
    ingredientId: string,
  ) {
    return normalizedComponent(itemId, ingredientId)?.replacementTargets ?? [];
  }

  function normalizedExtraPrice(
    itemId: string,
    ingredientId: string,
  ): { amount: number | null; configured: boolean } | null {
    const offering = normalizedMenuById.get(itemId);

    const policy = offering?.commercialPolicies.find(
      (candidate) =>
        candidate.kind === "price" &&
        candidate.appliesTo.kind === "component_capability" &&
        candidate.appliesTo.componentId === ingredientId &&
        candidate.appliesTo.capability === "extra",
    );

    if (!policy || policy.kind !== "price") {
      return null;
    }

    return {
      amount: policy.amount,
      configured: policy.configured,
    };
  }

  function normalizedVariantPrice(
    itemId: string,
    variantId: string,
    optionId: string,
  ): { amount: number | null; configured: boolean } | null {
    const offering = normalizedMenuById.get(itemId);

    const policy = offering?.commercialPolicies.find(
      (candidate) =>
        candidate.kind === "price" &&
        candidate.appliesTo.kind === "variant_option" &&
        candidate.appliesTo.variantId === variantId &&
        candidate.appliesTo.optionId === optionId,
    );

    if (!policy || policy.kind !== "price") {
      return null;
    }

    return {
      amount: policy.amount,
      configured: policy.configured,
    };
  }

  function normalizedChoicePrice(
    itemId: string,
    choiceSlotId: string,
    optionId: string,
  ): { amount: number | null; configured: boolean } | null {
    const offering = normalizedMenuById.get(itemId);

    const policy = offering?.commercialPolicies.find(
      (candidate) =>
        candidate.kind === "price" &&
        candidate.appliesTo.kind === "choice_option" &&
        candidate.appliesTo.choiceSlotId === choiceSlotId &&
        candidate.appliesTo.optionId === optionId,
    );

    if (!policy || policy.kind !== "price") {
      return null;
    }

    return {
      amount: policy.amount,
      configured: policy.configured,
    };
  }

  const selectedParty =
    activeParties.find((party) => party.id === selectedPartyId) ?? null;

  const ingredientsById = useMemo(
    () => new Map(customization.ingredients.map((ingredient) => [ingredient.id, ingredient])),
    [customization.ingredients],
  );

  const preparationSchemesById = useMemo(
    () =>
      new Map(
        customization.preparationSchemes
          .filter((scheme) => scheme.isActive)
          .map((scheme) => [scheme.id, scheme]),
      ),
    [customization.preparationSchemes],
  );

  function ingredientPreparationTarget(ingredientId: string): string {
    return `ingredient:${ingredientId}`;
  }

  function choicePreparationTarget(optionId: string): string {
    return `choice:${optionId}`;
  }

  function preparationScheme(schemeId: string | null): PreparationScheme | null {
    if (!schemeId || !selectedItem) {
      return null;
    }

    const normalizedScheme = normalizedMenuById
      .get(selectedItem.id)
      ?.preparations.find((scheme) => scheme.id === schemeId);

    if (!normalizedScheme) {
      return null;
    }

    const sourceScheme = preparationSchemesById.get(schemeId);

    if (!sourceScheme) {
      return null;
    }

    const normalizedOptionIds = new Set(
      normalizedScheme.options.map((option) => option.id),
    );

    return {
      ...sourceScheme,
      options: sourceScheme.options
        .filter((option) => normalizedOptionIds.has(option.id))
        .map((option) => ({
          ...option,
          isDefault: option.id === normalizedScheme.defaultOptionId,
        })),
    };
  }


  function ingredientsForItem(itemId: string): MenuItemIngredient[] {
    return customization.itemIngredients
      .filter((ingredient) => ingredient.menuItemId === itemId)
      .sort(
        (a, b) => a.sortOrder - b.sortOrder || a.ingredientName.localeCompare(b.ingredientName),
      );
  }

  function replacementsForItem(itemId: string): MenuItemIngredientReplacement[] {
    return customization.replacements
      .filter((replacement) => replacement.menuItemId === itemId)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.replacementIngredientName.localeCompare(b.replacementIngredientName));
  }

  function variantsForItem(itemId: string): Variant[] {
    return normalizedMenuById.get(itemId)?.variants ?? [];
  }

  function choiceSlotsForItem(
    itemId: string,
    selectedOptionIds: string[] = selectedChoiceOptionIds,
  ): EffectiveChoiceSlot[] {
    const offering = normalizedMenuById.get(itemId);

    if (!offering) {
      return [];
    }

    return resolveChoiceSlots(offering, selectedOptionIds)
      .filter((choice) => choice.isActive)
      .map((choice) => ({
        ...choice,
        options: choice.options.filter(
          (option) => !unavailableChoiceOptionIds.has(option.id),
        ),
      }))
      .filter((choice) => choice.options.length > 0);
  }

  const selectedVariants = selectedItem
    ? variantsForItem(selectedItem.id)
    : [];

  const selectedChoiceGroups = selectedItem
    ? choiceSlotsForItem(selectedItem.id, selectedChoiceOptionIds)
    : [];

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    setSelectedChoiceOptionIds((current) => {
      const allowedOptionIds = new Set(
        choiceSlotsForItem(selectedItem.id, current).flatMap((group) =>
          group.options.map((option) => option.id),
        ),
      );
      const next = current.filter((id) => allowedOptionIds.has(id));

      return next.length === current.length ? current : next;
    });
  }, [
    selectedItem?.id,
    normalizedMenu,
    customization,
    unavailableChoiceOptionIds,
  ]);
  // The INCLUDED section is the item's standard recipe.
  // Never hide a standard ingredient merely because a choice group also references it.
  // Choice groups describe decisions; they do not redefine what the base dish contains.
  const selectedItemIngredients = selectedItem
    ? ingredientsForItem(selectedItem.id)
    : [];

  const selectedItemReplacements = selectedItem
    ? replacementsForItem(selectedItem.id)
    : [];
  const selectedReplacementIngredientIds = useMemo(
    () => new Set(Object.values(replacementIngredientIdBySource)),
    [replacementIngredientIdBySource],
  );

  const includedIngredientIds = useMemo(
    () => new Set(selectedItemIngredients.map((ingredient) => ingredient.ingredientId)),
    [selectedItemIngredients],
  );

  const choiceIngredientIds = useMemo(() => {
    const ids = new Set<string>();
    for (const group of selectedChoiceGroups) {
      for (const option of group.options) {
        if (
          option.target.kind === "component" &&
          selectedChoiceOptionIds.includes(option.id)
        ) {
          ids.add(option.target.id);
        }
      }
    }
    return ids;
  }, [selectedChoiceGroups, selectedChoiceOptionIds]);

  const selectedItemAdditions = useMemo(
    () =>
      (customization.itemAdditions ?? [])
        .filter(
          (addition) =>
            addition.menuItemId === selectedItem?.id &&
            addition.isActive,
        )
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [customization.itemAdditions, selectedItem?.id],
  );

  const itemAdditionByIngredientId = useMemo(
    () =>
      new Map(
        selectedItemAdditions.map((addition) => [
          addition.ingredientId,
          addition,
        ]),
      ),
    [selectedItemAdditions],
  );

  const configuredAddIngredients = useMemo(() => {
    const allowedAddIngredientIds = new Set(
      selectedItemAdditions.map((addition) => addition.ingredientId),
    );

    return customization.ingredients
      .filter(
        (ingredient) =>
          ingredient.isActive &&
          allowedAddIngredientIds.has(ingredient.id) &&
          !includedIngredientIds.has(ingredient.id) &&
          !choiceIngredientIds.has(ingredient.id) &&
          !selectedReplacementIngredientIds.has(ingredient.id),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [
    choiceIngredientIds,
    customization.ingredients,
    includedIngredientIds,
    selectedItemAdditions,
    selectedReplacementIngredientIds,
  ]);

  const availableAddIngredients = useMemo(() => {
    const query = addSearch.trim().toLowerCase();

    return configuredAddIngredients.filter(
      (ingredient) =>
        query === "" || ingredient.name.toLowerCase().includes(query),
    );
  }, [addSearch, configuredAddIngredients]);

  const currentIngredientPopularity = selectedItem
    ? ingredientPopularityByItem[selectedItem.id] ?? []
    : [];

  const popularAddIngredients = useMemo(() => {
    if (addSearch.trim() !== "") return [];

    const availableById = new Map(
      availableAddIngredients.map((ingredient) => [ingredient.id, ingredient]),
    );

    return currentIngredientPopularity
      .map((entry) => availableById.get(entry.ingredientId))
      .filter((ingredient): ingredient is Ingredient => ingredient !== undefined);
  }, [addSearch, availableAddIngredients, currentIngredientPopularity]);

  const popularAddIngredientIds = useMemo(
    () => new Set(popularAddIngredients.map((ingredient) => ingredient.id)),
    [popularAddIngredients],
  );

  const alphabeticalAddIngredients = useMemo(() => {
    if (addSearch.trim() !== "") return availableAddIngredients;

    return availableAddIngredients.filter(
      (ingredient) => !popularAddIngredientIds.has(ingredient.id),
    );
  }, [addSearch, availableAddIngredients, popularAddIngredientIds]);


  const currentAllergens = useMemo(() => {
    if (!selectedItem) {
      return [];
    }

    const flags = new Set(
      selectedItem.safetyDeclarations
        .filter(
          (declaration) =>
            declaration.kind === "contains" &&
            declaration.allergenFlag !== null,
        )
        .map((declaration) => declaration.allergenFlag!),
    );

    for (const ingredient of selectedItemIngredients) {
      if (
        !removedIngredientIds.includes(ingredient.ingredientId) &&
        !replacementIngredientIdBySource[ingredient.ingredientId]
      ) {
        ingredient.allergenFlags.forEach((flag) => flags.add(flag));
      }
    }

    for (const replacementIngredientId of Object.values(replacementIngredientIdBySource)) {
      ingredientsById
        .get(replacementIngredientId)
        ?.allergenFlags.forEach((flag) => flags.add(flag));
    }

    for (const ingredientId of [...extraIngredientIds, ...addedIngredientIds]) {
      ingredientsById
        .get(ingredientId)
        ?.allergenFlags.forEach((flag) => flags.add(flag));
    }

    for (const group of selectedChoiceGroups) {
      for (const option of group.options) {
        if (
          selectedChoiceOptionIds.includes(option.id) &&
          option.target.kind === "component"
        ) {
          ingredientsById
            .get(option.target.id)
            ?.allergenFlags.forEach((flag) => flags.add(flag));
        }
      }
    }

    return [...flags].sort();
  }, [
    addedIngredientIds,
    extraIngredientIds,
    ingredientsById,
    removedIngredientIds,
    replacementIngredientIdBySource,
    selectedChoiceGroups,
    selectedChoiceOptionIds,
    selectedItem,
    selectedItemIngredients,
  ]);

  const currentSafetyWarnings = useMemo(() => {
    if (!selectedItem) return [];

    return selectedItem.safetyDeclarations
      .filter((declaration) => declaration.kind !== "contains")
      .map(safetyWarningLabel);
  }, [selectedItem]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) =>
      sum + (item.menuItem.price + lineAdjustment(item)) * item.quantity,
    0,
  );
  const cartHasPendingPrice = cart.some(hasPendingPrice);

  function quantityForItem(itemId: string): number {
    return cart
      .filter((entry) => entry.menuItem.id === itemId)
      .reduce((sum, entry) => sum + entry.quantity, 0);
  }

  function resetCustomizer() {
    setSelectedItem(null);
    setRemovedIngredientIds([]);
    setSideIngredientIds([]);
    setExtraIngredientIds([]);
    setAddedIngredientIds([]);
    setReplacementIngredientIdBySource({});
    setSelectedVariantOptionIdByVariant({});
    setSelectedChoiceOptionIds([]);
    setSelectedPreparationOptionByTarget({});
    setAddSearch("");
    setKitchenNote("");
    setEditingCartId(null);
  }

  function chooseGroup(group: MenuGroup) {
    const firstCategory = group.categories.find((category) => category.isActive);
    setSelectedGroupId(group.id);
    setSelectedCategoryId(firstCategory?.id ?? "");
    setSearch("");
    resetCustomizer();
  }

  function chooseCategory(category: MenuCategory) {
    setSelectedCategoryId(category.id);
    setSearch("");
    resetCustomizer();
  }

  function addDirect(item: MenuItem) {
    const key = cartKey(item, [], [], [], [], [], [], []);

    setCart((current) => {
      const existing = current.find((entry) => entry.id === key);

      if (existing) {
        return current.map((entry) =>
          entry.id === key
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }

      return [
        ...current,
        {
          id: key,
          menuItem: item,
          quantity: 1,
          removedIngredients: [],
          sideIngredients: [],
          extraIngredients: [],
          addedIngredients: [],
          replacements: [],
          variantSelections: [],
          choiceSelections: [],
          preparationSelections: [],
          kitchenNote: "",
        },
      ];
    });

    setSuccess("");
    setError("");
  }

  function chooseItem(item: MenuItem) {
    if (item.status !== "available") {
      return;
    }

    const itemIngredients = ingredientsForItem(item.id);
    const variants = variantsForItem(item.id);
    const choiceGroups = choiceSlotsForItem(item.id);
    const replacements = replacementsForItem(item.id);

    if (
      itemIngredients.length === 0 &&
      variants.length === 0 &&
      choiceGroups.length === 0 &&
      replacements.length === 0
    ) {
      addDirect(item);
      return;
    }

    if (selectedItem?.id === item.id) {
      resetCustomizer();
      return;
    }

    setSelectedItem(item);
    setEditingCartId(null);
    setRemovedIngredientIds([]);
    setSideIngredientIds([]);
    setExtraIngredientIds([]);
    setAddedIngredientIds([]);
    setReplacementIngredientIdBySource({});
    setSelectedVariantOptionIdByVariant(
      Object.fromEntries(
        variants.flatMap((variant) =>
          variant.defaultOptionId === null
            ? []
            : [[variant.id, variant.defaultOptionId]],
        ),
      ),
    );
    const defaultChoiceIds = choiceGroups.flatMap((group) =>
      group.options.filter((option) => option.isDefault).map((option) => option.id),
    );
    setSelectedChoiceOptionIds(defaultChoiceIds);

    const preparationDefaults: Record<string, string> = {};
    for (const ingredient of itemIngredients) {
      const scheme = preparationScheme(ingredient.preparationSchemeId);
      const defaultOption = scheme?.options.find((option) => option.isActive && option.isDefault);
      if (defaultOption) {
        preparationDefaults[ingredientPreparationTarget(ingredient.ingredientId)] = defaultOption.id;
      }
    }
    for (const group of choiceGroups) {
      for (const option of group.options) {
        if (!defaultChoiceIds.includes(option.id)) continue;
        const scheme = preparationScheme(option.preparationSchemeId);
        const defaultOption = scheme?.options.find((candidate) => candidate.isActive && candidate.isDefault);
        if (defaultOption) {
          preparationDefaults[choicePreparationTarget(option.id)] = defaultOption.id;
        }
      }
    }
    setSelectedPreparationOptionByTarget(preparationDefaults);
    setAddSearch("");
    setKitchenNote("");
    setError("");
  }

  function toggleRemove(ingredientId: string) {
    if (
      !selectedItem ||
      !hasNormalizedCapability(selectedItem.id, ingredientId, "remove")
    ) {
      return;
    }

    const removing = !removedIngredientIds.includes(ingredientId);
    if (removing) {
      const target = ingredientPreparationTarget(ingredientId);
      const replacementId = replacementIngredientIdBySource[ingredientId];
      setSelectedPreparationOptionByTarget((current) => {
        const next = { ...current };
        delete next[target];
        if (replacementId) delete next[ingredientPreparationTarget(replacementId)];
        return next;
      });
      setReplacementIngredientIdBySource((current) => {
        const next = { ...current };
        delete next[ingredientId];
        return next;
      });
    }
    setRemovedIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
    setSideIngredientIds((current) => current.filter((id) => id !== ingredientId));
    setExtraIngredientIds((current) => current.filter((id) => id !== ingredientId));
  }

  function clearReplacementForSource(sourceIngredientId: string) {
    const previousId = replacementIngredientIdBySource[sourceIngredientId];
    if (!previousId) return;

    setReplacementIngredientIdBySource((current) => {
      const next = { ...current };
      delete next[sourceIngredientId];
      return next;
    });
    setSelectedPreparationOptionByTarget((current) => {
      const next = { ...current };
      delete next[ingredientPreparationTarget(previousId)];
      const source = selectedItemIngredients.find(
        (ingredient) => ingredient.ingredientId === sourceIngredientId,
      );
      const sourceScheme = preparationScheme(source?.preparationSchemeId ?? null);
      const sourceDefault = sourceScheme?.options.find(
        (option) => option.isActive && option.isDefault,
      );
      if (sourceDefault) {
        next[ingredientPreparationTarget(sourceIngredientId)] = sourceDefault.id;
      }
      return next;
    });
  }

  function toggleSide(ingredientId: string) {
    if (
      !selectedItem ||
      !hasNormalizedCapability(selectedItem.id, ingredientId, "side")
    ) {
      return;
    }

    const selecting = !sideIngredientIds.includes(ingredientId);
    setSideIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
    setRemovedIngredientIds((current) => current.filter((id) => id !== ingredientId));
    setExtraIngredientIds((current) => current.filter((id) => id !== ingredientId));
    if (selecting && replacementIngredientIdBySource[ingredientId]) {
      clearReplacementForSource(ingredientId);
    }
  }

  function toggleExtra(ingredientId: string) {
    if (
      !selectedItem ||
      !hasNormalizedCapability(selectedItem.id, ingredientId, "extra")
    ) {
      return;
    }

    const selecting = !extraIngredientIds.includes(ingredientId);
    setExtraIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
    setRemovedIngredientIds((current) => current.filter((id) => id !== ingredientId));
    setSideIngredientIds((current) => current.filter((id) => id !== ingredientId));
    if (selecting && replacementIngredientIdBySource[ingredientId]) {
      clearReplacementForSource(ingredientId);
    }
  }

  function chooseReplacement(sourceIngredientId: string, replacementIngredientId: string) {
    if (!selectedItem) {
      return;
    }

    if (
      replacementIngredientId &&
      !normalizedReplacementTargets(selectedItem.id, sourceIngredientId)
        .some((target) => target.componentId === replacementIngredientId)
    ) {
      return;
    }

    const previousId = replacementIngredientIdBySource[sourceIngredientId];
    setSelectedPreparationOptionByTarget((current) => {
      const next = { ...current };
      delete next[ingredientPreparationTarget(sourceIngredientId)];
      if (previousId) delete next[ingredientPreparationTarget(previousId)];

      const rule = selectedItemReplacements.find((replacement) =>
        replacement.sourceIngredientId === sourceIngredientId &&
        replacement.replacementIngredientId === replacementIngredientId
      );
      const scheme = preparationScheme(rule?.preparationSchemeId ?? null);
      const defaultOption = scheme?.options.find((option) => option.isActive && option.isDefault);
      if (defaultOption && replacementIngredientId) {
        next[ingredientPreparationTarget(replacementIngredientId)] = defaultOption.id;
      } else if (!replacementIngredientId) {
        const source = selectedItemIngredients.find(
          (ingredient) => ingredient.ingredientId === sourceIngredientId,
        );
        const sourceScheme = preparationScheme(source?.preparationSchemeId ?? null);
        const sourceDefault = sourceScheme?.options.find(
          (option) => option.isActive && option.isDefault,
        );
        if (sourceDefault) {
          next[ingredientPreparationTarget(sourceIngredientId)] = sourceDefault.id;
        }
      }
      return next;
    });

    setReplacementIngredientIdBySource((current) => {
      const next = { ...current };
      if (replacementIngredientId) next[sourceIngredientId] = replacementIngredientId;
      else delete next[sourceIngredientId];
      return next;
    });
    setRemovedIngredientIds((current) => current.filter((id) => id !== sourceIngredientId));
    setSideIngredientIds((current) => current.filter((id) => id !== sourceIngredientId));
    setExtraIngredientIds((current) => current.filter((id) => id !== sourceIngredientId));
    if (replacementIngredientId) {
      setAddedIngredientIds((current) => current.filter((id) => id !== replacementIngredientId));
    }
  }

  function toggleAdd(ingredientId: string) {
    const ingredient = customization.ingredients.find(
      (candidate) => candidate.id === ingredientId,
    );
    if (!ingredient?.isAddable) return;

    const selecting = !addedIngredientIds.includes(ingredientId);

    setAddedIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );

    if (selecting) {
      setAddSearch("");
    }

    requestAnimationFrame(() => {
      addSearchInputRef.current?.focus();
    });
  }

  function chooseVariant(variant: Variant, optionId: string) {
    if (!variant.options.some((option) => option.id === optionId)) {
      return;
    }

    setSelectedVariantOptionIdByVariant((current) => ({
      ...current,
      [variant.id]: optionId,
    }));
  }

  function toggleChoice(group: EffectiveChoiceSlot, optionId: string) {
    const optionIds = new Set(group.options.map((option) => option.id));
    const option = group.options.find((candidate) => candidate.id === optionId);

    if (option?.target.kind === "component") {
      const componentId = option.target.id;

      setAddedIngredientIds((current) =>
        current.filter((id) => id !== componentId),
      );
    }

    setSelectedChoiceOptionIds((current) => {
      const selecting = !current.includes(optionId);
      let next: string[];

      if (!selecting) {
        const selectedInGroup = current.filter((id) => optionIds.has(id));

        if (
          group.minSelections > 0 &&
          selectedInGroup.length <= group.minSelections
        ) {
          return current;
        }

        next = current.filter((id) => id !== optionId);
      } else if (group.maxSelections === 1) {
        next = [...current.filter((id) => !optionIds.has(id)), optionId];
      } else {
        const selectedInGroup = current.filter((id) => optionIds.has(id));
        if (
          selectedInGroup.length >= group.maxSelections
        ) {
          return current;
        }
        next = [...current, optionId];
      }

      if (selectedItem) {
        const allowedOptionIds = new Set(
          choiceSlotsForItem(selectedItem.id, next).flatMap((choiceGroup) =>
            choiceGroup.options.map((choiceOption) => choiceOption.id),
          ),
        );
        next = next.filter((id) => allowedOptionIds.has(id));
      }

      setSelectedPreparationOptionByTarget((currentPrep) => {
        const nextPrep = { ...currentPrep };
        for (const candidateId of optionIds) {
          if (!next.includes(candidateId)) {
            delete nextPrep[choicePreparationTarget(candidateId)];
          }
        }
        return nextPrep;
      });

      return next;
    });
  }

  function choosePreparation(target: string, optionId: string) {
    setSelectedPreparationOptionByTarget((current) => ({
      ...current,
      [target]: optionId,
    }));
  }

  function addCustomizedItem() {
    if (!selectedItem) {
      return;
    }

    for (const variant of selectedVariants) {
      const selectedOptionId = selectedVariantOptionIdByVariant[variant.id];

      if (
        variant.selectionRequired === true &&
        !variant.options.some((option) => option.id === selectedOptionId)
      ) {
        setError(`Choose ${variant.label} for ${selectedItem.name}.`);
        return;
      }
    }

    for (const group of selectedChoiceGroups) {
      const optionIds = new Set(group.options.map((option) => option.id));
      const selectedCount = selectedChoiceOptionIds.filter((id) => optionIds.has(id)).length;

      if (selectedCount < group.minSelections) {
        const prompt = /^choose\b/i.test(group.label)
          ? group.label
          : `Choose ${group.label}`;
        setError(`${prompt} for ${selectedItem.name}.`);
        return;
      }

      if (selectedCount > group.maxSelections) {
        setError(`Too many selections in ${group.label}.`);
        return;
      }
    }

    const removedIngredients = selectedItemIngredients.filter((ingredient) =>
      removedIngredientIds.includes(ingredient.ingredientId),
    );
    const sideIngredients = selectedItemIngredients.filter((ingredient) =>
      sideIngredientIds.includes(ingredient.ingredientId),
    );
    const extraIngredients = selectedItemIngredients.filter((ingredient) =>
      extraIngredientIds.includes(ingredient.ingredientId),
    );
    const addedIngredients = addedIngredientIds
      .map((id) => ingredientsById.get(id))
      .filter((ingredient): ingredient is Ingredient => ingredient !== undefined);
    const replacements: ReplacementSelection[] = Object.entries(replacementIngredientIdBySource)
      .map(([sourceIngredientId, replacementIngredientId]) => {
        const rule = selectedItemReplacements.find((candidate) =>
          candidate.sourceIngredientId === sourceIngredientId &&
          candidate.replacementIngredientId === replacementIngredientId
        );
        const replacementIngredient = ingredientsById.get(replacementIngredientId);
        return rule && replacementIngredient ? { rule, replacementIngredient } : null;
      })
      .filter((selection): selection is ReplacementSelection => selection !== null);
    const variantSelections: VariantSelection[] = selectedVariants.flatMap((variant) => {
      const optionId = selectedVariantOptionIdByVariant[variant.id];
      const option = variant.options.find((candidate) => candidate.id === optionId);

      if (!option) {
        return [];
      }

      const price = normalizedVariantPrice(
        selectedItem.id,
        variant.id,
        option.id,
      );

      return [{
        variant,
        option,
        priceAdjustment: price?.amount ?? 0,
        priceAdjustmentConfigured: price?.configured ?? false,
      }];
    });

    const choiceSelections: ChoiceSelection[] = selectedChoiceGroups.flatMap((group) =>
      group.options
        .filter((option) => selectedChoiceOptionIds.includes(option.id))
        .map((option) => {
          const price = normalizedChoicePrice(
            selectedItem.id,
            group.id,
            option.id,
          );

          return {
            group,
            option,
            priceAdjustment: price?.amount ?? 0,
            priceAdjustmentConfigured: price?.configured ?? false,
          };
        }),
    );

    const preparationSelections: PreparationSelection[] = [];

    for (const ingredient of selectedItemIngredients) {
      if (
        removedIngredientIds.includes(ingredient.ingredientId) ||
        replacementIngredientIdBySource[ingredient.ingredientId]
      ) continue;
      const scheme = preparationScheme(ingredient.preparationSchemeId);
      if (!scheme) continue;

      const target = ingredientPreparationTarget(ingredient.ingredientId);
      const optionId = selectedPreparationOptionByTarget[target];
      const option = scheme.options.find(
        (candidate) => candidate.id === optionId && candidate.isActive,
      );
      if (!option) {
        setError(`Choose ${scheme.label} for ${ingredient.ingredientName}.`);
        return;
      }
      preparationSelections.push({
        targetKind: "ingredient",
        ingredientId: ingredient.ingredientId,
        choiceOptionId: null,
        targetLabel: ingredient.ingredientName,
        scheme,
        option,
      });
    }

    for (const selection of replacements) {
      const scheme = preparationScheme(selection.rule.preparationSchemeId);
      if (!scheme) continue;
      const target = ingredientPreparationTarget(selection.replacementIngredient.id);
      const optionId = selectedPreparationOptionByTarget[target];
      const preparationOption = scheme.options.find(
        (candidate) => candidate.id === optionId && candidate.isActive,
      );
      if (!preparationOption) {
        setError(`Choose ${scheme.label} for ${selection.replacementIngredient.name}.`);
        return;
      }
      preparationSelections.push({
        targetKind: "ingredient",
        ingredientId: selection.replacementIngredient.id,
        choiceOptionId: null,
        targetLabel: selection.replacementIngredient.name,
        scheme,
        option: preparationOption,
      });
    }

    for (const selection of choiceSelections) {
      const scheme = preparationScheme(selection.option.preparationSchemeId);
      if (!scheme) continue;

      const target = choicePreparationTarget(selection.option.id);
      const optionId = selectedPreparationOptionByTarget[target];
      const preparationOption = scheme.options.find(
        (candidate) => candidate.id === optionId && candidate.isActive,
      );
      if (!preparationOption) {
        setError(`Choose ${scheme.label} for ${selection.option.label}.`);
        return;
      }
      preparationSelections.push({
        targetKind: "choice",
        ingredientId: null,
        choiceOptionId: selection.option.id,
        targetLabel: selection.option.label,
        scheme,
        option: preparationOption,
      });
    }

    const baseKey = cartKey(
      selectedItem,
      removedIngredientIds,
      sideIngredientIds,
      extraIngredientIds,
      addedIngredientIds,
      replacements.map((selection) => `${selection.rule.sourceIngredientId}>${selection.rule.replacementIngredientId}`),
      variantSelections.map((selection) => selection.option.id),
      selectedChoiceOptionIds,
      preparationSelections.map(
        (selection) =>
          `${selection.targetKind}:${selection.ingredientId ?? selection.choiceOptionId}:${selection.option.id}`,
      ),
    );
    const note = kitchenNote.trim();

    setCart((current) => {
      if (editingCartId) {
        return current.map((entry) =>
          entry.id === editingCartId
            ? {
                ...entry,
                menuItem: selectedItem,
                removedIngredients,
                sideIngredients,
                extraIngredients,
                addedIngredients,
                replacements,
                variantSelections,
                choiceSelections,
                preparationSelections,
                kitchenNote: note,
              }
            : entry,
        );
      }

      const existing = note === "" ? current.find((entry) => entry.id === baseKey) : undefined;

      if (existing) {
        return current.map((entry) =>
          entry.id === baseKey
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }

      return [
        ...current,
        {
          id: note === "" ? baseKey : `${baseKey}:${crypto.randomUUID()}`,
          menuItem: selectedItem,
          quantity: 1,
          removedIngredients,
          sideIngredients,
          extraIngredients,
          addedIngredients,
          replacements,
          variantSelections,
          choiceSelections,
          preparationSelections,
          kitchenNote: note,
        },
      ];
    });

    resetCustomizer();
    setSuccess("");
    setError("");
  }

  function editCartItem(entry: CartItem) {
    setSelectedItem(entry.menuItem);
    setEditingCartId(entry.id);
    setRemovedIngredientIds(entry.removedIngredients.map((ingredient) => ingredient.ingredientId));
    setSideIngredientIds(entry.sideIngredients.map((ingredient) => ingredient.ingredientId));
    setExtraIngredientIds(entry.extraIngredients.map((ingredient) => ingredient.ingredientId));
    setAddedIngredientIds(entry.addedIngredients.map((ingredient) => ingredient.id));
    setReplacementIngredientIdBySource(Object.fromEntries(
      entry.replacements.map((selection) => [
        selection.rule.sourceIngredientId,
        selection.rule.replacementIngredientId,
      ]),
    ));
    setSelectedVariantOptionIdByVariant(
      Object.fromEntries(
        entry.variantSelections.map((selection) => [
          selection.variant.id,
          selection.option.id,
        ]),
      ),
    );
    setSelectedChoiceOptionIds(entry.choiceSelections.map((selection) => selection.option.id));
    setSelectedPreparationOptionByTarget(
      Object.fromEntries(
        entry.preparationSelections.map((selection) => [
          selection.targetKind === "ingredient"
            ? ingredientPreparationTarget(selection.ingredientId!)
            : choicePreparationTarget(selection.choiceOptionId!),
          selection.option.id,
        ]),
      ),
    );
    setAddSearch("");
    setKitchenNote(entry.kitchenNote);
    setError("");
    setSuccess("");
  }

  function updateQuantity(cartId: string, delta: number) {
    setCart((current) =>
      current
        .map((entry) =>
          entry.id === cartId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }

  function chooseOrderType(type: FulfillmentType) {
    setFulfillmentType(type);
    setError("");
    setSuccess("");
  }

  async function resolveDineInParty(): Promise<string> {
    if (selectedParty) {
      return selectedParty.id;
    }

    throw new Error("Seat the party in POS before starting a dine-in order.");
  }

  async function submitOrder() {
    if (cart.length === 0 || pendingOrder) {
      return;
    }

    if (fulfillmentType === "delivery" && deliveryAddress.trim() === "") {
      setError("Delivery address is required.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const partyId =
        fulfillmentType === "dine_in" ? await resolveDineInParty() : null;

      const input: CreateOrderInput = {
        partyId,
        fulfillmentType,
        customerName: customerName.trim() || null,
        customerPhone: customerPhone.trim() || null,
        requestedFor: null,
        deliveryAddress:
          fulfillmentType === "delivery" ? deliveryAddress.trim() : null,
        items: cart.map((entry) => ({
          menuItemId: entry.menuItem.id,
          quantity: entry.quantity,
          seatNumber: null,
          kitchenNote: entry.kitchenNote || null,
          removedIngredientIds: entry.removedIngredients.map((ingredient) => ingredient.ingredientId),
          sideIngredientIds: entry.sideIngredients.map((ingredient) => ingredient.ingredientId),
          extraIngredientIds: entry.extraIngredients.map((ingredient) => ingredient.ingredientId),
          addedIngredientIds: entry.addedIngredients.map((ingredient) => ingredient.id),
          ingredientReplacements: entry.replacements.map((selection) => ({
            sourceIngredientId: selection.rule.sourceIngredientId,
            replacementIngredientId: selection.rule.replacementIngredientId,
          })),
          choiceOptionIds: [
            ...entry.variantSelections.map((selection) => selection.option.id),
            ...entry.choiceSelections.map((selection) => selection.option.id),
          ],
          preparationSelections: entry.preparationSelections.map((selection) => ({
            ingredientId: selection.ingredientId,
            choiceOptionId: selection.choiceOptionId,
            preparationOptionId: selection.option.id,
          })),
          modifierItemIds: [],
        })),
      };

      const order = await createOrder(input);
      setPendingOrder(order);

      try {
        await fireOrder(order.id, {
          orderItemIds: order.items.map((item) => item.id),
          note: null,
        });

        setPendingOrder(null);
        setCart([]);
        resetCustomizer();

        const label =
          fulfillmentType === "dine_in"
            ? selectedParty
              ? partyLabel(selectedParty)
              : "dine-in"
            : fulfillmentType === "takeout"
              ? "takeout"
              : "delivery";

        setSuccess(
          `Sent ${order.items.length} ${order.items.length === 1 ? "item" : "items"} to the kitchen — ${label}.`,
        );

        if (fulfillmentType !== "dine_in") {
          setCustomerName("");
          setCustomerPhone("");
          setDeliveryAddress("");
        }

        await refreshServiceContext();
      } catch (fireError: unknown) {
        setError(`Order saved, but kitchen send failed: ${errorMessage(fireError)}`);
      }
    } catch (submitError: unknown) {
      setError(errorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  async function retryKitchenSend() {
    if (!pendingOrder) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await fireOrder(pendingOrder.id, {
        orderItemIds: pendingOrder.items.map((item) => item.id),
        note: null,
      });
      setSuccess("Order sent to the kitchen.");
      setPendingOrder(null);
      setCart([]);
    } catch (retryError: unknown) {
      setError(errorMessage(retryError));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p className="loading-state">Loading order entry…</p>
      </main>
    );
  }

  function preparationControls(
    schemeId: string | null,
    target: string,
    visible = true,
  ) {
    if (!visible) return null;
    const scheme = preparationScheme(schemeId);
    if (!scheme) return null;

    const options = scheme.options
      .filter((option) => option.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));

    if (options.length === 0) return null;

    return (
      <div className="service-preparation-node">
        <small>{scheme.label}</small>
        <div className="service-preparation-options">
          {options.map((option) => (
            <button
              type="button"
              data-selected={selectedPreparationOptionByTarget[target] === option.id}
              key={option.id}
              onClick={() => choosePreparation(target, option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="page service-order-page">
      <header className="page-heading service-order-heading">
        <div>
          <p className="eyebrow">Service</p>
          <h1>Order Entry</h1>
        </div>

        <div className="service-order-type">
          {(
            [
              ["dine_in", "Dine In"],
              ["takeout", "Takeout"],
              ["delivery", "Delivery"],
            ] as const
          ).map(([type, label]) => (
            <button
              type="button"
              data-selected={fulfillmentType === type}
              key={type}
              onClick={() => chooseOrderType(type)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {fulfillmentType === "dine_in" ? (
        <section className="service-context service-context--seated-only">
          <div className="service-context-block">
            <span className="service-context-label">Seated tables</span>

            {activeParties.length === 0 ? (
              <div className="service-context-no-seated">
                <div>
                  <strong>No seated tables</strong>
                  <span>Seat a party from POS before starting a dine-in order.</span>
                </div>
                <Link className="button" data-variant="primary" to="/pos">
                  Open POS
                </Link>
              </div>
            ) : (
              <div className="service-context-options">
                {activeParties.map((party) => (
                  <button
                    type="button"
                    className="service-context-button"
                    data-selected={selectedPartyId === party.id}
                    key={party.id}
                    onClick={() => {
                      setSelectedPartyId(party.id);
                      setError("");
                    }}
                  >
                    <strong>{partyLabel(party)}</strong>
                    <small>{party.guestCount} guests</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="service-customer-details">
          <label>
            <span>Name</span>
            <input
              type="text"
              placeholder="Optional"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />
          </label>
          <label>
            <span>Phone</span>
            <input
              type="tel"
              placeholder="Optional"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
            />
          </label>
          {fulfillmentType === "delivery" ? (
            <label className="service-delivery-address">
              <span>Delivery address</span>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
              />
            </label>
          ) : null}
        </section>
      )}

      {error ? (
        <div className="notice notice--error" role="alert">{error}</div>
      ) : null}
      {success ? <div className="notice notice--success">{success}</div> : null}
      {pendingOrder ? (
        <div className="notice notice--error">
          <span>Order is saved but has not reached the kitchen.</span>
          <button
            type="button"
            className="button"
            data-variant="primary"
            disabled={submitting}
            onClick={() => void retryKitchenSend()}
          >
            Retry Kitchen Send
          </button>
        </div>
      ) : null}

      <div className="service-order-layout">
        <section className="service-menu-browser">
          <div className="service-group-tabs" aria-label="Menu groups">
            {activeGroups.map((group) => (
              <button
                type="button"
                data-selected={selectedGroupId === group.id}
                key={group.id}
                onClick={() => chooseGroup(group)}
              >
                {group.name}
              </button>
            ))}
          </div>

          <div className="service-category-tabs" aria-label="Menu categories">
            {categories.map((category) => (
              <button
                type="button"
                data-selected={selectedCategoryId === category.id}
                key={category.id}
                onClick={() => chooseCategory(category)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="service-menu-search">
            <input
              type="search"
              placeholder="Search entire menu"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {selectedItem ? (
            <section className="service-customizer service-composition-customizer">
              <header className="service-customizer-header">
                <div>
                  <p className="eyebrow">{editingCartId ? "Edit item" : "Customize"}</p>
                  <h2>
                    {selectedItem.isKids ? <span className="service-kids-badge">KIDS</span> : null}
                    {selectedItem.name}
                    {selectedItem.hasManualSafetyOverride ? (
                      <span
                        className="manual-safety-cue"
                        title="Admin safety override"
                        aria-label="Admin safety override"
                      />
                    ) : null}
                  </h2>
                  {selectedItem.description ? <p>{selectedItem.description}</p> : null}
                </div>
                <button type="button" className="button" data-variant="quiet" onClick={resetCustomizer}>
                  Close
                </button>
              </header>

              {selectedItem.dietaryFlags.length > 0 ? (
                <div className="service-allergen-strip" data-kind="dietary">
                  <strong>Dietary</strong>
                  <div>
                    {selectedItem.dietaryFlags.map((flag) => (
                      <span key={flag}>{flag.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
              ) : null}

              {currentAllergens.length > 0 ? (
                <div className="service-allergen-strip">
                  <strong>Contains</strong>
                  <div>
                    {currentAllergens.map((flag) => (
                      <span key={flag}>{allergenLabel(flag)}</span>
                    ))}
                  </div>
                </div>
              ) : null}

              {currentSafetyWarnings.length > 0 ? (
                <div className="service-allergen-strip" data-kind="warning">
                  <strong>Safety</strong>
                  <div>
                    {currentSafetyWarnings.map((warning) => (
                      <span key={warning}>{warning}</span>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedItemIngredients.length > 0 ? (
                <section className="service-customizer-section">
                  <div className="service-customizer-section-heading">
                    <div>
                      <span>On it</span>
                      <small>Defaults · tap only what changes</small>
                    </div>
                  </div>

                  <div className="service-ingredient-list">
                    {selectedItemIngredients.map((ingredient) => {
                      const removed = removedIngredientIds.includes(ingredient.ingredientId);
                      const side = sideIngredientIds.includes(ingredient.ingredientId);
                      const extra = extraIngredientIds.includes(ingredient.ingredientId);

                      const canRemove = hasNormalizedCapability(
                        selectedItem.id,
                        ingredient.ingredientId,
                        "remove",
                      );
                      const canSide = hasNormalizedCapability(
                        selectedItem.id,
                        ingredient.ingredientId,
                        "side",
                      );
                      const canExtra = hasNormalizedCapability(
                        selectedItem.id,
                        ingredient.ingredientId,
                        "extra",
                      );

                      const extraPricePolicy = normalizedExtraPrice(
                        selectedItem.id,
                        ingredient.ingredientId,
                      );

                      const replacementTargets = normalizedReplacementTargets(
                        selectedItem.id,
                        ingredient.ingredientId,
                      );

                      const replacementTargetIds = new Set(
                        replacementTargets.map((target) => target.componentId),
                      );

                      return (
                        <div className="service-ingredient-row" key={ingredient.ingredientId}>
                          <div>
                            <strong>{ingredient.ingredientName}</strong>
                          </div>
                          <div className="service-ingredient-actions">
                            <button
                              type="button"
                              data-selected={removed}
                              disabled={!canRemove}
                              onClick={() => toggleRemove(ingredient.ingredientId)}
                            >
                              NO
                            </button>
                            {canSide ? (
                              <button
                                type="button"
                                data-selected={side}
                                onClick={() => toggleSide(ingredient.ingredientId)}
                              >
                                SIDE
                              </button>
                            ) : null}
                            {canExtra ? (
                              <button
                                type="button"
                                data-selected={extra}
                                onClick={() => toggleExtra(ingredient.ingredientId)}
                              >
                                EXTRA{
                                  extraPricePolicy?.configured
                                    ? (extraPricePolicy.amount ?? 0) > 0
                                      ? ` +${money(extraPricePolicy.amount ?? 0)}`
                                      : " · no charge"
                                    : " · price TBD"
                                }
                              </button>
                            ) : null}
                          </div>
                          {replacementTargets.length > 0 ? (
                            <div className="service-replacement-control">
                              <span>SUB FOR</span>
                              <select
                                value={replacementIngredientIdBySource[ingredient.ingredientId] ?? ""}
                                onChange={(event) => chooseReplacement(ingredient.ingredientId, event.target.value)}
                              >
                                <option value="">Keep {ingredient.ingredientName}</option>
                                {selectedItemReplacements
                                  .filter(
                                    (replacement) =>
                                      replacement.sourceIngredientId === ingredient.ingredientId &&
                                      replacementTargetIds.has(replacement.replacementIngredientId),
                                  )
                                  .map((replacement) => (
                                    <option key={replacement.replacementIngredientId} value={replacement.replacementIngredientId}>
                                      {replacement.replacementIngredientName}{replacement.priceAdjustmentConfigured ? replacement.priceAdjustment !== 0 ? ` (${priceDelta(replacement.priceAdjustment)})` : "" : " (PRICE TBD)"}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          ) : null}
                          {replacementIngredientIdBySource[ingredient.ingredientId] ? (() => {
                            const replacement = selectedItemReplacements.find((candidate) =>
                              candidate.sourceIngredientId === ingredient.ingredientId &&
                              candidate.replacementIngredientId === replacementIngredientIdBySource[ingredient.ingredientId]
                            );
                            return preparationControls(
                              replacement?.preparationSchemeId ?? null,
                              ingredientPreparationTarget(replacementIngredientIdBySource[ingredient.ingredientId]!),
                              !removed,
                            );
                          })() : preparationControls(
                            ingredient.preparationSchemeId,
                            ingredientPreparationTarget(ingredient.ingredientId),
                            !removed,
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {selectedVariants.map((variant) => {
                const selectedOptionId =
                  selectedVariantOptionIdByVariant[variant.id] ?? "";

                return (
                  <section
                    className="service-customizer-section service-choice-group"
                    key={variant.id}
                  >
                    <div className="service-customizer-section-heading">
                      <div>
                        <span>{variant.label}</span>
                        <small>
                          {variant.selectionRequired === true
                            ? "Required"
                            : "Optional"}
                        </small>
                      </div>
                      {variant.selectionRequired === true ? (
                        <strong>{selectedOptionId ? "1/1" : "0/1"}</strong>
                      ) : null}
                    </div>
                    <div className="service-choice-options">
                      {variant.options.map((option) => {
                        const selected = selectedOptionId === option.id;
                        const price = selectedItem
                          ? normalizedVariantPrice(
                              selectedItem.id,
                              variant.id,
                              option.id,
                            )
                          : null;

                        return (
                          <div
                            className="service-choice-option-node"
                            key={option.id}
                          >
                            <button
                              type="button"
                              data-selected={selected}
                              onClick={() => chooseVariant(variant, option.id)}
                            >
                              <span>{option.label}</span>
                              <small>{priceDelta(
                                price?.amount ?? 0,
                                price?.configured ?? false,
                              )}</small>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              {selectedChoiceGroups.map((group) => {
                const required = group.minSelections > 0;
                const selectedCount = group.options.filter((option) =>
                  selectedChoiceOptionIds.includes(option.id),
                ).length;

                return (
                  <section className="service-customizer-section service-choice-group" key={group.id}>
                    <div className="service-customizer-section-heading">
                      <div>
                        <span>{group.label}</span>
                        <small>
                          {required ? "Required" : "Optional"}
                          {group.maxSelections && group.maxSelections > 1
                            ? ` · up to ${group.maxSelections}`
                            : ""}
                        </small>
                      </div>
                      {required ? <strong>{selectedCount}/{group.minSelections}</strong> : null}
                    </div>
                    <div className="service-choice-options">
                      {group.options.map((option) => {
                        const selected = selectedChoiceOptionIds.includes(option.id);
                        const price = selectedItem
                          ? normalizedChoicePrice(
                              selectedItem.id,
                              group.id,
                              option.id,
                            )
                          : null;
                        return (
                          <div className="service-choice-option-node" key={option.id}>
                            <button
                              type="button"
                              data-selected={selected}
                              onClick={() => toggleChoice(group, option.id)}
                            >
                              <span>{option.label}</span>
                              <small>{priceDelta(
                                price?.amount ?? 0,
                                price?.configured ?? false,
                              )}</small>
                            </button>
                            {preparationControls(
                              option.preparationSchemeId,
                              choicePreparationTarget(option.id),
                              selected,
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              {configuredAddIngredients.length > 0 ||
              addedIngredientIds.length > 0 ? (
              <details
                className="service-customizer-section service-additions"
                onToggle={(event) => {
                  if (event.currentTarget.open) {
                    window.setTimeout(() => addSearchInputRef.current?.focus(), 0);
                  }
                }}
              >
                <summary className="service-additions-summary">
                  <strong>
                    Toppings{addedIngredientIds.length > 0
                      ? ` · ${addedIngredientIds.length}`
                      : ""}
                  </strong>
                </summary>

                <div className="service-additions-body">
                  {addedIngredientIds.length > 0 ? (
                    <div className="service-add-selected">
                      {addedIngredientIds.map((ingredientId) => {
                        const ingredient = ingredientsById.get(ingredientId);
                        if (!ingredient) return null;

                        return (
                          <button
                            type="button"
                            key={ingredientId}
                            onClick={() => toggleAdd(ingredientId)}
                            title={`Remove ${ingredient.name}`}
                          >
                            <span>{ingredient.name}</span>
                            <b aria-hidden="true">×</b>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  <input
                    ref={addSearchInputRef}
                    className="service-add-search"
                    type="search"
                    placeholder="Search toppings…"
                    value={addSearch}
                    onChange={(event) => setAddSearch(event.target.value)}
                  />

                  {addSearch.trim().length === 1 ? (
                    <div className="service-add-hint">Type one more letter.</div>
                  ) : null}

                  {addSearch.trim().length >= 2 ? (
                    availableAddIngredients.length === 0 ? (
                      <div className="service-add-empty">No matching toppings.</div>
                    ) : (
                      <div className="service-add-subsection">
                        <div className="service-add-grid">
                          {alphabeticalAddIngredients.slice(0, 10).map((ingredient) => {
                            const selected = addedIngredientIds.includes(ingredient.id);

                            return (
                              <label
                                data-selected={selected}
                                data-configured={itemAdditionByIngredientId.get(ingredient.id)?.priceConfigured ?? false}
                                key={ingredient.id}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => toggleAdd(ingredient.id)}
                                />
                                <span>{ingredient.name}</span>
                                <small>
                                  {itemAdditionByIngredientId.get(ingredient.id)
                                    ?.priceConfigured
                                    ? (itemAdditionByIngredientId.get(ingredient.id)
                                        ?.priceAdjustment ?? 0) > 0
                                      ? `+${money(
                                          itemAdditionByIngredientId.get(ingredient.id)
                                            ?.priceAdjustment ?? 0,
                                        )}`
                                      : "NO CHARGE"
                                    : "PRICE TBD"}
                                </small>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )
                  ) : null}
                </div>
              </details>
              ) : null}


              <div className="service-customizer-footer">
                <input
                  type="text"
                  maxLength={500}
                  placeholder="Note only if the buttons cannot express it"
                  value={kitchenNote}
                  onChange={(event) => setKitchenNote(event.target.value)}
                />
                <button
                  type="button"
                  className="button"
                  data-variant="primary"
                  onClick={addCustomizedItem}
                >
                  {editingCartId ? "Save Changes" : "Add to Order"}
                </button>
              </div>
            </section>
          ) : null}

          <div className="service-item-grid">
            {visibleItems.map((item) => {
              const hasCustomization =
                ingredientsForItem(item.id).length > 0 ||
                variantsForItem(item.id).length > 0 ||
                choiceSlotsForItem(item.id).length > 0 ||
                replacementsForItem(item.id).length > 0;
              const quantity = quantityForItem(item.id);
              const selected = selectedItem?.id === item.id;

              return (
                <button
                  type="button"
                  className="service-item-card"
                  data-selected={selected}
                  data-in-cart={quantity > 0}
                  data-status={item.status}
                  disabled={item.status !== "available"}
                  key={item.id}
                  onClick={() => chooseItem(item)}
                >
                  {quantity > 0 ? <span className="service-item-qty">{quantity}</span> : null}
                  <strong>
                    {item.isKids ? <span className="service-kids-badge">KIDS</span> : null}
                    {item.name}
                    {item.hasManualSafetyOverride ? (
                      <span
                        className="manual-safety-cue"
                        title="Admin safety override"
                        aria-label="Admin safety override"
                      />
                    ) : null}
                  </strong>
                  {item.description ? <p>{item.description}</p> : null}
                  <footer>
                    <span>{money(item.price)}</span>
                    <small>{hasCustomization ? "Customize →" : "Tap to add"}</small>
                  </footer>
                </button>
              );
            })}
          </div>

          {visibleItems.length === 0 ? (
            <div className="service-no-items">No items in this category.</div>
          ) : null}
        </section>

        <aside className="service-cart">
          <header className="service-cart-header">
            <div>
              <p className="eyebrow">Current order</p>
              <h2>
                {fulfillmentType === "dine_in"
                  ? selectedParty
                    ? partyLabel(selectedParty)
                    : "Dine In"
                  : fulfillmentType === "takeout"
                    ? customerName.trim() || "Takeout"
                    : customerName.trim() || "Delivery"}
              </h2>
            </div>
            <span>{cartCount} items</span>
          </header>

          <div className="service-cart-lines">
            {cart.length === 0 ? (
              <div className="service-cart-empty">Tap menu items to add them.</div>
            ) : (
              cart.map((entry) => {
                const lineTotal =
                  (entry.menuItem.price + lineAdjustment(entry)) * entry.quantity;

                return (
                  <article className="service-cart-line" key={entry.id}>
                    <div className="service-cart-line-top">
                      <strong>{entry.menuItem.isKids ? <span className="service-kids-badge">KIDS</span> : null}{entry.menuItem.name}</strong>
                      <span>
                        {money(lineTotal)}{hasPendingPrice(entry) ? " + TBD" : ""}
                      </span>
                    </div>

                    {entry.removedIngredients.map((ingredient) => (
                      <small className="service-cart-change" data-kind="remove" key={`no-${ingredient.ingredientId}`}>
                        NO {ingredient.ingredientName}
                      </small>
                    ))}
                    {entry.sideIngredients.map((ingredient) => (
                      <small className="service-cart-change" data-kind="side" key={`side-${ingredient.ingredientId}`}>
                        ON SIDE {ingredient.ingredientName}
                      </small>
                    ))}
                    {entry.extraIngredients.map((ingredient) => (
                      <small className="service-cart-change" data-kind="extra" key={`extra-${ingredient.ingredientId}`}>
                        EXTRA {ingredient.ingredientName}
                        {!ingredient.extraPriceConfigured ? " · PRICE TBD" : ""}
                      </small>
                    ))}
                    {entry.replacements.map((selection) => (
                      <small className="service-cart-change" data-kind="replace" key={`replace-${selection.rule.sourceIngredientId}`}>
                        {selection.rule.sourceIngredientId ? `SUB ${ingredientsById.get(selection.rule.sourceIngredientId)?.name ?? "ITEM"} → ${selection.replacementIngredient.name}` : `SUB ${selection.replacementIngredient.name}`}
                        {!selection.rule.priceAdjustmentConfigured ? " · PRICE TBD" : ""}
                      </small>
                    ))}
                    {entry.addedIngredients.map((ingredient) => (
                      <small className="service-cart-change" data-kind="add" key={`add-${ingredient.id}`}>
                        ADD {ingredient.name}
                        {!ingredient.addPriceConfigured ? " · PRICE TBD" : ""}
                      </small>
                    ))}
                    {entry.variantSelections.map((selection) => (
                      <small
                        className="service-cart-change"
                        data-kind="variant"
                        key={`variant-${selection.variant.id}`}
                      >
                        {selection.variant.label}: {selection.option.label}
                        {!selection.priceAdjustmentConfigured ? " · PRICE TBD" : ""}
                      </small>
                    ))}
                    {entry.choiceSelections.map((selection) => (
                      <small className="service-cart-change" data-kind="choice" key={selection.option.id}>
                        {selection.group.label}: {selection.option.label}
                      </small>
                    ))}
                    {entry.preparationSelections.map((selection) => (
                      <small
                        className="service-cart-change"
                        data-kind="prep"
                        key={`${selection.targetKind}-${selection.ingredientId ?? selection.choiceOptionId}`}
                      >
                        {selection.targetLabel}: {selection.option.label}
                      </small>
                    ))}
                    {entry.kitchenNote ? (
                      <small className="service-cart-note">“{entry.kitchenNote}”</small>
                    ) : null}

                    <div className="service-cart-controls">
                      <button type="button" onClick={() => updateQuantity(entry.id, -1)}>−</button>
                      <strong>{entry.quantity}</strong>
                      <button type="button" onClick={() => updateQuantity(entry.id, 1)}>+</button>
                      <button
                        type="button"
                        className="service-cart-edit"
                        onClick={() => editCartItem(entry)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="service-cart-remove"
                        onClick={() => updateQuantity(entry.id, -entry.quantity)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <footer className="service-cart-footer">
            <div className="service-cart-total">
              <span>{cartHasPendingPrice ? "Known total" : "Total"}</span>
              <strong>
                {money(total)}{cartHasPendingPrice ? " + TBD" : ""}
              </strong>
            </div>
            <button
              type="button"
              className="button service-fire-button"
              data-variant="primary"
              disabled={
                cart.length === 0 ||
                submitting ||
                pendingOrder !== null ||
                (fulfillmentType === "dine_in" && !selectedParty)
              }
              onClick={() => void submitOrder()}
            >
              {submitting ? "Sending…" : "Fire to Kitchen"}
            </button>
            {fulfillmentType === "dine_in" && !selectedParty ? (
              <small className="service-send-hint">
                Seat and select the party in POS before sending.
              </small>
            ) : null}
          </footer>
        </aside>
      </div>
    </main>
  );
}
