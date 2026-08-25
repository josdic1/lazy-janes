import type {
  CreateOrderInput,
  DiningTableOption,
  FulfillmentType,
  Ingredient,
  IngredientPopularity,
  MenuCategory,
  MenuChoiceGroup,
  MenuChoiceOption,
  MenuCustomizationCatalog,
  MenuGroup,
  MenuItem,
  MenuItemIngredient,
  MenuItemIngredientReplacement,
  PreparationOption,
  PreparationScheme,
  Order,
  PartyListItem,
} from "@lazy-janes/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getMenuCustomizationCatalog,
  getMenuIngredientPopularity,
  getMenuItems,
  getMenuTaxonomy,
} from "../api/menu";
import { createOrder, fireOrder } from "../api/orders";
import {
  createParty,
  getDiningTables,
  getParties,
  seatParty,
} from "../api/parties";

type ChoiceSelection = {
  group: MenuChoiceGroup;
  option: MenuChoiceOption;
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
  return party.tableLabels.join(" + ");
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
  const choices = entry.choiceSelections.reduce(
    (sum, selection) =>
      sum + (selection.option.priceAdjustmentConfigured ? selection.option.priceAdjustment : 0),
    0,
  );

  return extras + additions + replacements + choices;
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
    entry.choiceSelections.some(
      (selection) => !selection.option.priceAdjustmentConfigured,
    )
  );
}

function allergenLabel(flag: string): string {
  return flag.replace(/_/g, " ").toUpperCase();
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
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [taxonomy, setTaxonomy] = useState<MenuGroup[]>([]);
  const [customization, setCustomization] =
    useState<MenuCustomizationCatalog>(EMPTY_CUSTOMIZATION);
  const [parties, setParties] = useState<PartyListItem[]>([]);
  const [tables, setTables] = useState<DiningTableOption[]>([]);

  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("dine_in");
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [newTableId, setNewTableId] = useState("");
  const [guestCount, setGuestCount] = useState(2);
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
    const [partyList, tableList] = await Promise.all([
      getParties(),
      getDiningTables(),
    ]);

    setParties(partyList);
    setTables(tableList);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [menuItems, groups, catalog, partyList, tableList] =
          await Promise.all([
            getMenuItems(),
            getMenuTaxonomy(),
            getMenuCustomizationCatalog(),
            getParties(),
            getDiningTables(),
          ]);

        if (cancelled) {
          return;
        }

        setMenu(menuItems);
        setTaxonomy(groups);
        setCustomization(catalog);
        setParties(partyList);
        setTables(tableList);

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
  }, []);

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
      (item) => !item.isModifier && item.status !== "inactive",
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

  const availableTables = useMemo(
    () => tables.filter((table) => !table.occupied),
    [tables],
  );

  const selectedParty =
    activeParties.find((party) => party.id === selectedPartyId) ?? null;
  const selectedTable =
    availableTables.find((table) => table.id === newTableId) ?? null;

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
    return schemeId ? preparationSchemesById.get(schemeId) ?? null : null;
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

  function choiceGroupsForItem(itemId: string): MenuChoiceGroup[] {
    return customization.choiceGroups
      .filter((group) => group.menuItemId === itemId && group.isActive)
      .map((group) => ({
        ...group,
        options: group.options
          .filter((option) => option.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label)),
      }))
      .filter((group) => group.options.length > 0)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
  }

  const selectedChoiceGroups = selectedItem
    ? choiceGroupsForItem(selectedItem.id)
    : [];
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
          option.ingredientId &&
          selectedChoiceOptionIds.includes(option.id)
        ) {
          ids.add(option.ingredientId);
        }
      }
    }
    return ids;
  }, [selectedChoiceGroups, selectedChoiceOptionIds]);

  const availableAddIngredients = useMemo(() => {
    const query = addSearch.trim().toLowerCase();

    return customization.ingredients
      .filter(
        (ingredient) =>
          ingredient.isActive &&
          ingredient.isAddable &&
          !includedIngredientIds.has(ingredient.id) &&
          !choiceIngredientIds.has(ingredient.id) &&
          !selectedReplacementIngredientIds.has(ingredient.id) &&
          (query === "" || ingredient.name.toLowerCase().includes(query)),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [
    addSearch,
    choiceIngredientIds,
    customization.ingredients,
    includedIngredientIds,
    selectedReplacementIngredientIds,
  ]);

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
          option.ingredientId
        ) {
          ingredientsById
            .get(option.ingredientId)
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
    const key = cartKey(item, [], [], [], [], [], []);

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
    const choiceGroups = choiceGroupsForItem(item.id);
    const replacements = replacementsForItem(item.id);

    if (itemIngredients.length === 0 && choiceGroups.length === 0 && replacements.length === 0) {
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

  function toggleChoice(group: MenuChoiceGroup, optionId: string) {
    const optionIds = new Set(group.options.map((option) => option.id));
    const option = group.options.find((candidate) => candidate.id === optionId);

    if (option?.ingredientId) {
      setAddedIngredientIds((current) =>
        current.filter((id) => id !== option.ingredientId),
      );
    }

    setSelectedChoiceOptionIds((current) => {
      const selecting = !current.includes(optionId);
      let next: string[];

      if (!selecting) {
        next = current.filter((id) => id !== optionId);
      } else if (group.maxSelections === 1) {
        next = [...current.filter((id) => !optionIds.has(id)), optionId];
      } else {
        const selectedInGroup = current.filter((id) => optionIds.has(id));
        if (
          group.maxSelections !== null &&
          selectedInGroup.length >= group.maxSelections
        ) {
          return current;
        }
        next = [...current, optionId];
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

      if (group.maxSelections !== null && selectedCount > group.maxSelections) {
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
    const choiceSelections: ChoiceSelection[] = selectedChoiceGroups.flatMap((group) =>
      group.options
        .filter((option) => selectedChoiceOptionIds.includes(option.id))
        .map((option) => ({ group, option })),
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

    if (!selectedTable) {
      throw new Error("Choose an existing table or start a new table.");
    }

    const created = await createParty({ guestCount });
    await seatParty(created.id, { tableIds: [selectedTable.id] });
    setSelectedPartyId(created.id);
    setNewTableId("");
    await refreshServiceContext();
    return created.id;
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
          choiceOptionIds: entry.choiceSelections.map((selection) => selection.option.id),
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
              : selectedTable?.label ?? "dine-in"
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
        <section className="service-context">
          <div className="service-context-block">
            <span className="service-context-label">Existing tables</span>
            <div className="service-context-options">
              {activeParties.length === 0 ? (
                <span className="service-context-empty">None seated</span>
              ) : (
                activeParties.map((party) => (
                  <button
                    type="button"
                    className="service-context-button"
                    data-selected={selectedPartyId === party.id}
                    key={party.id}
                    onClick={() => {
                      setSelectedPartyId(party.id);
                      setNewTableId("");
                      setError("");
                    }}
                  >
                    <strong>{partyLabel(party)}</strong>
                    <small>{party.guestCount} guests</small>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="service-context-block">
            <span className="service-context-label">Start new table</span>
            <div className="service-context-new">
              <div className="service-context-options">
                {availableTables.length === 0 ? (
                  <span className="service-context-empty">No open tables</span>
                ) : (
                  availableTables.map((table) => (
                    <button
                      type="button"
                      className="service-context-button"
                      data-selected={newTableId === table.id}
                      key={table.id}
                      onClick={() => {
                        setNewTableId(table.id);
                        setSelectedPartyId("");
                        setError("");
                      }}
                    >
                      <strong>{table.label}</strong>
                      <small>{table.sectionName} · seats {table.capacity}</small>
                    </button>
                  ))
                )}
              </div>

              <label className="service-guest-count">
                <span>Guests</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={guestCount}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isInteger(value) && value > 0) {
                      setGuestCount(value);
                    }
                  }}
                />
              </label>
            </div>
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
                  <h2>{selectedItem.isKids ? <span className="service-kids-badge">KIDS</span> : null}{selectedItem.name}</h2>
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

                      return (
                        <div className="service-ingredient-row" key={ingredient.ingredientId}>
                          <div>
                            <strong>{ingredient.ingredientName}</strong>
                            {ingredient.allergenFlags.length > 0 ? (
                              <small>{ingredient.allergenFlags.map(allergenLabel).join(" · ")}</small>
                            ) : null}
                          </div>
                          <div className="service-ingredient-actions">
                            <button
                              type="button"
                              data-selected={removed}
                              disabled={!ingredient.canRemove}
                              onClick={() => toggleRemove(ingredient.ingredientId)}
                            >
                              NO
                            </button>
                            {ingredient.canSide ? (
                              <button
                                type="button"
                                data-selected={side}
                                onClick={() => toggleSide(ingredient.ingredientId)}
                              >
                                SIDE
                              </button>
                            ) : null}
                            {ingredient.canExtra ? (
                              <button
                                type="button"
                                data-selected={extra}
                                onClick={() => toggleExtra(ingredient.ingredientId)}
                              >
                                EXTRA{
                                  ingredient.extraPriceConfigured
                                    ? ingredient.extraPrice > 0
                                      ? ` +${money(ingredient.extraPrice)}`
                                      : " · no charge"
                                    : " · price TBD"
                                }
                              </button>
                            ) : null}
                          </div>
                          {selectedItemReplacements.some((replacement) => replacement.sourceIngredientId === ingredient.ingredientId) ? (
                            <div className="service-replacement-control">
                              <span>SUB FOR</span>
                              <select
                                value={replacementIngredientIdBySource[ingredient.ingredientId] ?? ""}
                                onChange={(event) => chooseReplacement(ingredient.ingredientId, event.target.value)}
                              >
                                <option value="">Keep {ingredient.ingredientName}</option>
                                {selectedItemReplacements
                                  .filter((replacement) => replacement.sourceIngredientId === ingredient.ingredientId)
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
                        return (
                          <div className="service-choice-option-node" key={option.id}>
                            <button
                              type="button"
                              data-selected={selected}
                              onClick={() => toggleChoice(group, option.id)}
                            >
                              <span>{option.label}</span>
                              <small>{priceDelta(option.priceAdjustment, option.priceAdjustmentConfigured)}</small>
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

              <section className="service-customizer-section service-additions">
                <div className="service-customizer-section-heading">
                  <div>
                    <span>Available toppings</span>
                    <small>Popular first · everything else alphabetical</small>
                  </div>
                  {addedIngredientIds.length > 0 ? <strong>{addedIngredientIds.length} selected</strong> : null}
                </div>

                <input
                  ref={addSearchInputRef}
                  className="service-add-search"
                  type="search"
                  placeholder="Search bacon, avocado, cheese…"
                  value={addSearch}
                  onChange={(event) => setAddSearch(event.target.value)}
                />

                {availableAddIngredients.length === 0 ? (
                  <div className="service-add-empty">No matching available toppings.</div>
                ) : (
                  <>
                    {popularAddIngredients.length > 0 ? (
                      <div className="service-add-subsection">
                        <div className="service-add-subheading">Popular for this kind of order</div>
                        <div className="service-add-grid">
                          {popularAddIngredients.map((ingredient) => {
                            const selected = addedIngredientIds.includes(ingredient.id);
                            return (
                              <label
                                data-selected={selected}
                                data-configured={ingredient.addPriceConfigured}
                                key={ingredient.id}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => toggleAdd(ingredient.id)}
                                />
                                <span>{ingredient.name}</span>
                                <small>
                                  {ingredient.addPriceConfigured
                                    ? ingredient.defaultAddPrice > 0
                                      ? `+${money(ingredient.defaultAddPrice)}`
                                      : "NO CHARGE"
                                    : "PRICE TBD"}
                                </small>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {alphabeticalAddIngredients.length > 0 ? (
                      <div className="service-add-subsection">
                        {addSearch.trim() === "" ? (
                          <div className="service-add-subheading">All available · A–Z</div>
                        ) : null}
                        <div className="service-add-grid">
                          {alphabeticalAddIngredients.map((ingredient) => {
                            const selected = addedIngredientIds.includes(ingredient.id);
                            return (
                              <label
                                data-selected={selected}
                                data-configured={ingredient.addPriceConfigured}
                                key={ingredient.id}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => toggleAdd(ingredient.id)}
                                />
                                <span>{ingredient.name}</span>
                                <small>
                                  {ingredient.addPriceConfigured
                                    ? ingredient.defaultAddPrice > 0
                                      ? `+${money(ingredient.defaultAddPrice)}`
                                      : "NO CHARGE"
                                    : "PRICE TBD"}
                                </small>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </section>


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
                choiceGroupsForItem(item.id).length > 0;
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
                  <strong>{item.isKids ? <span className="service-kids-badge">KIDS</span> : null}{item.name}</strong>
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
                    : selectedTable
                      ? selectedTable.label
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
              disabled={cart.length === 0 || submitting || pendingOrder !== null}
              onClick={() => void submitOrder()}
            >
              {submitting ? "Sending…" : "Fire to Kitchen"}
            </button>
            {fulfillmentType === "dine_in" && !selectedParty && !selectedTable ? (
              <small className="service-send-hint">
                Choose a table before sending. You can build the order first.
              </small>
            ) : null}
          </footer>
        </aside>
      </div>
    </main>
  );
}
