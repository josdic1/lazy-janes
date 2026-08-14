import type {
  CreateOrderInput,
  DiningTableOption,
  FulfillmentType,
  Ingredient,
  MenuCategory,
  MenuChoiceGroup,
  MenuChoiceOption,
  MenuCustomizationCatalog,
  MenuGroup,
  MenuItem,
  MenuItemIngredient,
  Order,
  PartyListItem,
} from "@lazy-janes/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getMenuCustomizationCatalog,
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

type CartItem = {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  removedIngredients: MenuItemIngredient[];
  sideIngredients: MenuItemIngredient[];
  extraIngredients: MenuItemIngredient[];
  addedIngredients: Ingredient[];
  choiceSelections: ChoiceSelection[];
  kitchenNote: string;
};

const EMPTY_CUSTOMIZATION: MenuCustomizationCatalog = {
  ingredients: [],
  itemIngredients: [],
  choiceGroups: [],
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function money(value: number): string {
  return `$${Math.abs(value).toFixed(2)}`;
}

function priceDelta(value: number): string {
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
  choiceOptionIds: string[],
): string {
  return [
    item.id,
    `no=${sortedKey(removedIds)}`,
    `side=${sortedKey(sideIds)}`,
    `extra=${sortedKey(extraIds)}`,
    `add=${sortedKey(addedIds)}`,
    `choice=${sortedKey(choiceOptionIds)}`,
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
  const choices = entry.choiceSelections.reduce(
    (sum, selection) => sum + selection.option.priceAdjustment,
    0,
  );

  return extras + additions + choices;
}

function hasPendingPrice(entry: CartItem): boolean {
  return (
    entry.extraIngredients.some(
      (ingredient) => !ingredient.extraPriceConfigured,
    ) ||
    entry.addedIngredients.some(
      (ingredient) => !ingredient.addPriceConfigured,
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
  const [selectedChoiceOptionIds, setSelectedChoiceOptionIds] =
    useState<string[]>([]);
  const [addSearch, setAddSearch] = useState("");
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

  function ingredientsForItem(itemId: string): MenuItemIngredient[] {
    return customization.itemIngredients
      .filter((ingredient) => ingredient.menuItemId === itemId)
      .sort(
        (a, b) => a.sortOrder - b.sortOrder || a.ingredientName.localeCompare(b.ingredientName),
      );
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

  const selectedItemIngredients = selectedItem
    ? ingredientsForItem(selectedItem.id)
    : [];
  const selectedChoiceGroups = selectedItem
    ? choiceGroupsForItem(selectedItem.id)
    : [];

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

  const searchableAddIngredients = useMemo(() => {
    const query = addSearch.trim().toLowerCase();

    return customization.ingredients
      .filter(
        (ingredient) =>
          ingredient.isActive &&
          !includedIngredientIds.has(ingredient.id) &&
          !choiceIngredientIds.has(ingredient.id) &&
          (query === "" || ingredient.name.toLowerCase().includes(query)),
      )
      .sort((a, b) => {
        const aSelected = addedIngredientIds.includes(a.id);
        const bSelected = addedIngredientIds.includes(b.id);
        if (aSelected !== bSelected) return aSelected ? -1 : 1;
        if (a.isAddable !== b.isAddable) return a.isAddable ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [
    addSearch,
    addedIngredientIds,
    choiceIngredientIds,
    customization.ingredients,
    includedIngredientIds,
  ]);

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
      if (!removedIngredientIds.includes(ingredient.ingredientId)) {
        ingredient.allergenFlags.forEach((flag) => flags.add(flag));
      }
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
    setSelectedChoiceOptionIds([]);
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
    const key = cartKey(item, [], [], [], [], []);

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
          choiceSelections: [],
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

    if (itemIngredients.length === 0 && choiceGroups.length === 0) {
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
    setSelectedChoiceOptionIds(
      choiceGroups.flatMap((group) =>
        group.options.filter((option) => option.isDefault).map((option) => option.id),
      ),
    );
    setAddSearch("");
    setKitchenNote("");
    setError("");
  }

  function toggleRemove(ingredientId: string) {
    setRemovedIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
    setSideIngredientIds((current) => current.filter((id) => id !== ingredientId));
    setExtraIngredientIds((current) => current.filter((id) => id !== ingredientId));
  }

  function toggleSide(ingredientId: string) {
    setSideIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
    setRemovedIngredientIds((current) => current.filter((id) => id !== ingredientId));
    setExtraIngredientIds((current) => current.filter((id) => id !== ingredientId));
  }

  function toggleExtra(ingredientId: string) {
    setExtraIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
    setRemovedIngredientIds((current) => current.filter((id) => id !== ingredientId));
    setSideIngredientIds((current) => current.filter((id) => id !== ingredientId));
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
      if (current.includes(optionId)) {
        return current.filter((id) => id !== optionId);
      }

      if (group.maxSelections === 1) {
        return [...current.filter((id) => !optionIds.has(id)), optionId];
      }

      const selectedInGroup = current.filter((id) => optionIds.has(id));

      if (
        group.maxSelections !== null &&
        selectedInGroup.length >= group.maxSelections
      ) {
        return current;
      }

      return [...current, optionId];
    });
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
    const choiceSelections: ChoiceSelection[] = selectedChoiceGroups.flatMap((group) =>
      group.options
        .filter((option) => selectedChoiceOptionIds.includes(option.id))
        .map((option) => ({ group, option })),
    );

    const baseKey = cartKey(
      selectedItem,
      removedIngredientIds,
      sideIngredientIds,
      extraIngredientIds,
      addedIngredientIds,
      selectedChoiceOptionIds,
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
                choiceSelections,
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
          choiceSelections,
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
    setSelectedChoiceOptionIds(entry.choiceSelections.map((selection) => selection.option.id));
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
          choiceOptionIds: entry.choiceSelections.map((selection) => selection.option.id),
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
                  <h2>{selectedItem.name}</h2>
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
                      <span>Included</span>
                      <small>Tap only what changes</small>
                    </div>
                    <div className="service-ingredient-columns" aria-hidden="true">
                      <span>No</span>
                      <span>Side</span>
                      <span>Extra</span>
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
                              No
                            </button>
                            {ingredient.canSide ? (
                              <button
                                type="button"
                                data-selected={side}
                                onClick={() => toggleSide(ingredient.ingredientId)}
                              >
                                Side
                              </button>
                            ) : (
                              <span
                                className="service-ingredient-unavailable"
                                aria-label="On side not available"
                              >
                                —
                              </span>
                            )}
                            {ingredient.canExtra ? (
                              <button
                                type="button"
                                data-selected={extra}
                                onClick={() => toggleExtra(ingredient.ingredientId)}
                              >
                                Extra{
                                  ingredient.extraPriceConfigured
                                    ? ingredient.extraPrice > 0
                                      ? ` +${money(ingredient.extraPrice)}`
                                      : " · no charge"
                                    : " · price TBD"
                                }
                              </button>
                            ) : (
                              <span
                                className="service-ingredient-unavailable"
                                aria-label="Extra not configured"
                              >
                                —
                              </span>
                            )}
                          </div>
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
                          <button
                            type="button"
                            data-selected={selected}
                            key={option.id}
                            onClick={() => toggleChoice(group, option.id)}
                          >
                            <span>{option.label}</span>
                            <small>
                              {priceDelta(option.priceAdjustment)}
                            </small>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              <section className="service-customizer-section service-additions">
                <div className="service-customizer-section-heading">
                  <div>
                    <span>Add</span>
                    <small>Search all restaurant ingredients · multi-select</small>
                  </div>
                  {addedIngredientIds.length > 0 ? <strong>{addedIngredientIds.length} selected</strong> : null}
                </div>

                <input
                  ref={addSearchInputRef}
                  className="service-add-search"
                  type="search"
                  placeholder="Add bacon, avocado, cheese…"
                  value={addSearch}
                  onChange={(event) => setAddSearch(event.target.value)}
                />

                {searchableAddIngredients.length === 0 ? (
                  <div className="service-add-empty">No matching ingredients.</div>
                ) : (
                  <div className="service-add-grid">
                    {searchableAddIngredients.map((ingredient) => {
                      const selected = addedIngredientIds.includes(ingredient.id);
                      const available = ingredient.isAddable;
                      return (
                        <label
                          data-selected={selected}
                          data-configured={ingredient.addPriceConfigured}
                          key={ingredient.id}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={!available}
                            onChange={() => toggleAdd(ingredient.id)}
                          />
                          <span>{ingredient.name}</span>
                          <small>
                            {!available
                              ? "NOT AVAILABLE"
                              : ingredient.addPriceConfigured
                                ? ingredient.defaultAddPrice > 0
                                  ? `+${money(ingredient.defaultAddPrice)}`
                                  : "NO CHARGE"
                                : "PRICE TBD"}
                          </small>
                        </label>
                      );
                    })}
                  </div>
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
                  <strong>{item.name}</strong>
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
                      <strong>{entry.menuItem.name}</strong>
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
