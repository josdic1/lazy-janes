import {
  CheckCircle,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Power,
  SpinnerGap,
  Warning,
  X,
} from "@phosphor-icons/react";
import {
  ALLERGEN_FLAGS,
  type AllergenFlag,
  type CreateMenuItemInput,
  type Ingredient,
  type MenuChoiceGroup,
  type MenuCustomizationCatalog,
  type MenuGroup,
  type MenuItem,
  type MenuItemIngredient,
  type MenuItemSafetyDeclarationInput,
  type MenuItemSafetyKind,
  type MenuItemStatus,
  type ReplaceMenuItemCustomizationInput,
} from "@lazy-janes/shared";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  createIngredient,
  createMenuItem,
  deactivateMenuItem,
  getMenuCustomizationCatalog,
  getMenuItems,
  getMenuTaxonomy,
  replaceMenuItemCustomization,
  updateIngredient,
  updateMenuItem,
} from "../api/menu.js";

const emptyForm: CreateMenuItemInput = {
  parentItemId: null,
  name: "",
  description: null,
  categoryId: "",
  price: 0,
  status: "available",
  isSpecial: false,
  isModifier: false,
  dietaryFlags: [],
  safetyDeclarations: [],
  sortOrder: 0,
};

type IngredientLinkDraft = {
  ingredientId: string;
  canRemove: boolean;
  canSide: boolean;
  canExtra: boolean;
  extraPrice: number;
  extraPriceConfigured: boolean;
  sortOrder: number;
};

type ChoiceOptionDraft = {
  key: string;
  label: string;
  ingredientId: string | null;
  priceAdjustment: number;
  sortOrder: number;
  isDefault: boolean;
};

type ChoiceGroupDraft = {
  key: string;
  label: string;
  minSelections: number;
  maxSelections: number | null;
  sortOrder: number;
  options: ChoiceOptionDraft[];
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

function statusLabel(status: MenuItemStatus): string {
  return status === "eighty_sixed"
    ? "86’d"
    : status[0]?.toUpperCase() + status.slice(1);
}

const ALLERGEN_SAFETY_KINDS = [
  "contains",
  "may_contain",
  "cross_contact",
] as const;

function isAllergenSafetyKind(
  kind: MenuItemSafetyKind,
): kind is (typeof ALLERGEN_SAFETY_KINDS)[number] {
  return ALLERGEN_SAFETY_KINDS.includes(
    kind as (typeof ALLERGEN_SAFETY_KINDS)[number],
  );
}

function safetyDeclarationLabel(
  declaration: MenuItemSafetyDeclarationInput,
): string {
  if (declaration.kind === "contains" && declaration.allergenFlag) {
    return `contains ${declaration.allergenFlag.replace(/_/g, " ")}`;
  }
  if (declaration.kind === "may_contain" && declaration.allergenFlag) {
    return `may contain ${declaration.allergenFlag.replace(/_/g, " ")}`;
  }
  if (declaration.kind === "cross_contact" && declaration.allergenFlag) {
    return `cross-contact ${declaration.allergenFlag.replace(/_/g, " ")}`;
  }
  if (declaration.kind === "shared_fryer") return "shared fryer";
  if (declaration.kind === "shared_equipment") return "shared equipment";
  return declaration.note ?? declaration.kind.replace(/_/g, " ");
}

function StatusBadge({ status }: { status: MenuItemStatus }) {
  return (
    <span className="status-badge" data-status={status}>
      {statusLabel(status)}
    </span>
  );
}

function choiceDraft(group: MenuChoiceGroup): ChoiceGroupDraft {
  return {
    key: group.id,
    label: group.label,
    minSelections: group.minSelections,
    maxSelections: group.maxSelections,
    sortOrder: group.sortOrder,
    options: group.options.map((option) => ({
      key: option.id,
      label: option.label,
      ingredientId: option.ingredientId,
      priceAdjustment: option.priceAdjustment,
      sortOrder: option.sortOrder,
      isDefault: option.isDefault,
    })),
  };
}

function linkDraft(link: MenuItemIngredient): IngredientLinkDraft {
  return {
    ingredientId: link.ingredientId,
    canRemove: link.canRemove,
    canSide: link.canSide,
    canExtra: link.canExtra,
    extraPrice: link.extraPrice,
    extraPriceConfigured: link.extraPriceConfigured,
    sortOrder: link.sortOrder,
  };
}

export function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [taxonomy, setTaxonomy] = useState<MenuGroup[]>([]);
  const [catalog, setCatalog] = useState<MenuCustomizationCatalog>({
    ingredients: [],
    itemIngredients: [],
    choiceGroups: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<MenuItemStatus | "all">("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<CreateMenuItemInput>(emptyForm);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const [compositionItem, setCompositionItem] = useState<MenuItem | null>(null);
  const [ingredientLinks, setIngredientLinks] = useState<IngredientLinkDraft[]>([]);
  const [choiceGroups, setChoiceGroups] = useState<ChoiceGroupDraft[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [compositionSaving, setCompositionSaving] = useState(false);
  const [compositionError, setCompositionError] = useState("");

  const [ingredientLibraryOpen, setIngredientLibraryOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientAddable, setIngredientAddable] = useState(false);
  const [ingredientPrice, setIngredientPrice] = useState(0);
  const [ingredientPriceConfigured, setIngredientPriceConfigured] = useState(false);
  const [ingredientAllergens, setIngredientAllergens] = useState<AllergenFlag[]>([]);
  const [ingredientSaving, setIngredientSaving] = useState(false);
  const [ingredientError, setIngredientError] = useState("");

  async function reloadCatalog() {
    setCatalog(await getMenuCustomizationCatalog());
  }

  useEffect(() => {
    let active = true;

    Promise.all([
      getMenuItems(),
      getMenuTaxonomy(),
      getMenuCustomizationCatalog(),
    ])
      .then(([menuItems, menuTaxonomy, customizationCatalog]) => {
        if (!active) return;

        setItems(menuItems);
        setTaxonomy(menuTaxonomy);
        setCatalog(customizationCatalog);

        const firstCategory = menuTaxonomy
          .filter((group) => group.isActive)
          .flatMap((group) => group.categories.filter((category) => category.isActive))[0];
        setCategoryFilter(firstCategory?.id ?? "");
      })
      .catch((error: unknown) => {
        if (active) setLoadError(errorMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const activeTaxonomy = useMemo(
    () =>
      taxonomy
        .filter((group) => group.isActive)
        .map((group) => ({
          ...group,
          categories: group.categories.filter((category) => category.isActive),
        }))
        .filter((group) => group.categories.length > 0),
    [taxonomy],
  );

  const categoryById = useMemo(() => {
    const map = new Map<string, { groupName: string; categoryName: string }>();
    for (const group of taxonomy) {
      for (const category of group.categories) {
        map.set(category.id, {
          groupName: group.name,
          categoryName: category.name,
        });
      }
    }
    return map;
  }, [taxonomy]);

  const ingredientById = useMemo(
    () => new Map(catalog.ingredients.map((ingredient) => [ingredient.id, ingredient])),
    [catalog.ingredients],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((item) => !item.isModifier)
      .filter((item) => categoryFilter === "" || item.categoryId === categoryFilter)
      .filter((item) => statusFilter === "all" || item.status === statusFilter)
      .filter((item) => {
        if (query === "") return true;
        const category = categoryById.get(item.categoryId);
        return [item.name, item.description ?? "", category?.categoryName ?? "", category?.groupName ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  }, [categoryById, categoryFilter, items, search, statusFilter]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items.filter((candidate) => !candidate.isModifier)) {
      map.set(item.categoryId, (map.get(item.categoryId) ?? 0) + 1);
    }
    return map;
  }, [items]);

  function openCreate() {
    setEditingItem(null);
    setForm({
      ...emptyForm,
      categoryId:
        categoryFilter || activeTaxonomy[0]?.categories[0]?.id || "",
    });
    setSaveError("");
    setDrawerOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item);
    setForm({
      parentItemId: null,
      name: item.name,
      description: item.description,
      categoryId: item.categoryId,
      price: item.price,
      status: item.status,
      isSpecial: item.isSpecial,
      isModifier: false,
      dietaryFlags: [...item.dietaryFlags],
      safetyDeclarations: item.safetyDeclarations.map((declaration) => ({
        kind: declaration.kind,
        allergenFlag: declaration.allergenFlag,
        note: declaration.note,
        sortOrder: declaration.sortOrder,
      })),
      sortOrder: item.sortOrder,
    });
    setSaveError("");
    setDrawerOpen(true);
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError("");
    setSaving(true);

    try {
      if (editingItem) {
        const updated = await updateMenuItem(editingItem.id, {
          name: form.name,
          description: form.description,
          categoryId: form.categoryId,
          price: form.price,
          status: form.status,
          isSpecial: form.isSpecial,
          dietaryFlags: form.dietaryFlags,
          safetyDeclarations: form.safetyDeclarations,
          sortOrder: form.sortOrder,
        });
        setItems((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
      } else {
        const created = await createMenuItem({
          ...form,
          parentItemId: null,
          isModifier: false,
        });
        setItems((current) => [...current, created]);
      }

      setDrawerOpen(false);
      setEditingItem(null);
    } catch (error: unknown) {
      setSaveError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function toggleItemStatus(item: MenuItem) {
    try {
      const updated = await updateMenuItem(item.id, {
        status: item.status === "available" ? "eighty_sixed" : "available",
      });
      setItems((current) =>
        current.map((candidate) => (candidate.id === updated.id ? updated : candidate)),
      );
    } catch (error: unknown) {
      setLoadError(errorMessage(error));
    }
  }

  async function deactivateItem(item: MenuItem) {
    try {
      await deactivateMenuItem(item.id);
      setItems((current) =>
        current.map((candidate) =>
          candidate.id === item.id ? { ...candidate, status: "inactive" } : candidate,
        ),
      );
    } catch (error: unknown) {
      setLoadError(errorMessage(error));
    }
  }

  function openComposition(item: MenuItem) {
    setCompositionItem(item);
    setIngredientLinks(
      catalog.itemIngredients
        .filter((link) => link.menuItemId === item.id)
        .map(linkDraft),
    );
    setChoiceGroups(
      catalog.choiceGroups
        .filter((group) => group.menuItemId === item.id)
        .map(choiceDraft),
    );
    setIngredientSearch("");
    setCompositionError("");
  }

  const addableRecipeIngredients = useMemo(() => {
    const existing = new Set(ingredientLinks.map((link) => link.ingredientId));
    const query = ingredientSearch.trim().toLowerCase();

    return catalog.ingredients
      .filter((ingredient) => ingredient.isActive && !existing.has(ingredient.id))
      .filter((ingredient) => query === "" || ingredient.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, query === "" ? 12 : 40);
  }, [catalog.ingredients, ingredientLinks, ingredientSearch]);

  function addRecipeIngredient(ingredient: Ingredient) {
    setIngredientLinks((current) => [
      ...current,
      {
        ingredientId: ingredient.id,
        canRemove: true,
        canSide: false,
        canExtra: true,
        extraPrice: ingredient.defaultAddPrice,
        extraPriceConfigured: ingredient.addPriceConfigured,
        sortOrder: current.length,
      },
    ]);
    setIngredientSearch("");
  }

  function addChoiceGroup() {
    setChoiceGroups((current) => [
      ...current,
      {
        key: crypto.randomUUID(),
        label: "",
        minSelections: 1,
        maxSelections: 1,
        sortOrder: current.length,
        options: [
          {
            key: crypto.randomUUID(),
            label: "",
            ingredientId: null,
            priceAdjustment: 0,
            sortOrder: 0,
            isDefault: false,
          },
        ],
      },
    ]);
  }

  function updateChoiceGroup(key: string, changes: Partial<ChoiceGroupDraft>) {
    setChoiceGroups((current) =>
      current.map((group) => (group.key === key ? { ...group, ...changes } : group)),
    );
  }

  function updateChoiceOption(
    groupKey: string,
    optionKey: string,
    changes: Partial<ChoiceOptionDraft>,
  ) {
    setChoiceGroups((current) =>
      current.map((group) =>
        group.key === groupKey
          ? {
              ...group,
              options: group.options.map((option) =>
                option.key === optionKey ? { ...option, ...changes } : option,
              ),
            }
          : group,
      ),
    );
  }

  function addChoiceOption(groupKey: string) {
    setChoiceGroups((current) =>
      current.map((group) =>
        group.key === groupKey
          ? {
              ...group,
              options: [
                ...group.options,
                {
                  key: crypto.randomUUID(),
                  label: "",
                  ingredientId: null,
                  priceAdjustment: 0,
                  sortOrder: group.options.length,
                  isDefault: false,
                },
              ],
            }
          : group,
      ),
    );
  }

  async function saveComposition() {
    if (!compositionItem) return;

    for (const group of choiceGroups) {
      if (group.label.trim() === "") {
        setCompositionError("Every choice group needs a label.");
        return;
      }
      if (group.options.length === 0 || group.options.some((option) => option.label.trim() === "")) {
        setCompositionError(`Every option in ${group.label || "the choice group"} needs a label.`);
        return;
      }
    }

    const input: ReplaceMenuItemCustomizationInput = {
      ingredients: ingredientLinks.map((link, index) => ({
        ingredientId: link.ingredientId,
        canRemove: link.canRemove,
        canSide: link.canSide,
        canExtra: link.canExtra,
        extraPrice: link.extraPrice,
        extraPriceConfigured: link.extraPriceConfigured,
        sortOrder: index,
      })),
      choiceGroups: choiceGroups.map((group, groupIndex) => ({
        label: group.label.trim(),
        minSelections: group.minSelections,
        maxSelections: group.maxSelections,
        sortOrder: groupIndex,
        options: group.options.map((option, optionIndex) => ({
          label: option.label.trim(),
          ingredientId: option.ingredientId,
          priceAdjustment: option.priceAdjustment,
          sortOrder: optionIndex,
          isDefault: option.isDefault,
        })),
      })),
    };

    setCompositionSaving(true);
    setCompositionError("");

    try {
      const updated = await replaceMenuItemCustomization(compositionItem.id, input);
      setCatalog(updated);
      setCompositionItem(null);
    } catch (error: unknown) {
      setCompositionError(errorMessage(error));
    } finally {
      setCompositionSaving(false);
    }
  }

  const filteredLibrary = useMemo(() => {
    const query = librarySearch.trim().toLowerCase();
    return catalog.ingredients
      .filter((ingredient) => query === "" || ingredient.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [catalog.ingredients, librarySearch]);

  function selectLibraryIngredient(ingredient: Ingredient) {
    setSelectedIngredientId(ingredient.id);
    setIngredientName(ingredient.name);
    setIngredientAddable(ingredient.isAddable);
    setIngredientPrice(ingredient.defaultAddPrice);
    setIngredientPriceConfigured(ingredient.addPriceConfigured);
    setIngredientAllergens([...ingredient.allergenFlags]);
    setIngredientError("");
  }

  function newLibraryIngredient() {
    setSelectedIngredientId(null);
    setIngredientName("");
    setIngredientAddable(false);
    setIngredientPrice(0);
    setIngredientPriceConfigured(false);
    setIngredientAllergens([]);
    setIngredientError("");
  }

  async function saveIngredient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIngredientSaving(true);
    setIngredientError("");

    try {
      if (selectedIngredientId) {
        await updateIngredient(selectedIngredientId, {
          name: ingredientName,
          isAddable: ingredientAddable,
          defaultAddPrice: ingredientPrice,
          addPriceConfigured: ingredientPriceConfigured,
          allergenFlags: ingredientAllergens,
        });
      } else {
        await createIngredient({
          name: ingredientName,
          isAddable: ingredientAddable,
          defaultAddPrice: ingredientPrice,
          addPriceConfigured: ingredientPriceConfigured,
          allergenFlags: ingredientAllergens,
          sortOrder: catalog.ingredients.length,
        });
      }
      await reloadCatalog();
      newLibraryIngredient();
    } catch (error: unknown) {
      setIngredientError(errorMessage(error));
    } finally {
      setIngredientSaving(false);
    }
  }

  async function toggleIngredientActive(ingredient: Ingredient) {
    try {
      await updateIngredient(ingredient.id, { isActive: !ingredient.isActive });
      await reloadCatalog();
    } catch (error: unknown) {
      setIngredientError(errorMessage(error));
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p className="loading-state">Loading menu…</p>
      </main>
    );
  }

  const selectedCategory = categoryById.get(categoryFilter);

  return (
    <main className="page">
      <header className="page-heading menu-management-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Menu Management</h1>
          <p>Items, service-visible composition, choices, ingredients, and availability.</p>
        </div>
        <div className="menu-heading-actions">
          <button
            className="button"
            data-variant="quiet"
            type="button"
            onClick={() => {
              newLibraryIngredient();
              setIngredientLibraryOpen(true);
            }}
          >
            Ingredients
          </button>
          <button className="button" data-variant="primary" type="button" onClick={openCreate}>
            <Plus aria-hidden="true" weight="bold" /> Add item
          </button>
        </div>
      </header>

      {loadError ? <div className="notice notice--error">{loadError}</div> : null}

      <section className="filter-bar menu-filter-bar" aria-label="Menu filters">
        <label className="search-field">
          <MagnifyingGlass aria-hidden="true" />
          <input
            type="search"
            placeholder="Search menu"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as MenuItemStatus | "all")}
        >
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="eighty_sixed">86’d</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className="result-count">{filteredItems.length} items</span>
      </section>

      <div className="menu-management-layout">
        <aside className="menu-taxonomy">
          {activeTaxonomy.map((group) => (
            <section className="menu-taxonomy-group" key={group.id}>
              <h2>{group.name}</h2>
              <div className="menu-taxonomy-categories">
                {group.categories.map((category) => (
                  <button
                    type="button"
                    data-selected={categoryFilter === category.id}
                    key={category.id}
                    onClick={() => setCategoryFilter(category.id)}
                  >
                    <span>{category.name}</span>
                    <small>{categoryCounts.get(category.id) ?? 0}</small>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </aside>

        <section className="menu-category-workspace">
          <header className="menu-category-workspace-heading">
            <div>
              <p>{selectedCategory?.groupName ?? "Menu"}</p>
              <h2>{selectedCategory?.categoryName ?? "Items"}</h2>
            </div>
          </header>

          <div className="table-scroll">
            <table className="menu-composition-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Configuration</th>
                  <th><span className="visually-hidden">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const ingredientCount = catalog.itemIngredients.filter(
                    (link) => link.menuItemId === item.id,
                  ).length;
                  const choiceCount = catalog.choiceGroups.filter(
                    (group) => group.menuItemId === item.id,
                  ).length;

                  return (
                    <tr className={item.status === "inactive" ? "is-muted" : ""} key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        {item.description ? <small>{item.description}</small> : null}
                        {item.safetyDeclarations.length > 0 ? (
                          <div className="tag-list menu-allergen-tags">
                            {item.safetyDeclarations.map((declaration) => (
                              <span className="tag" key={declaration.id}>
                                {safetyDeclarationLabel(declaration)}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </td>
                      <td className="price">{money(item.price)}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td>
                        <button
                          type="button"
                          className="menu-composition-button"
                          onClick={() => openComposition(item)}
                        >
                          <strong>{ingredientCount} ingredients</strong>
                          <span>{choiceCount} choice {choiceCount === 1 ? "group" : "groups"}</span>
                        </button>
                      </td>
                      <td>
                        <div className="item-actions">
                          <button className="icon-button" type="button" title="Edit item" onClick={() => openEdit(item)}>
                            <PencilSimple aria-hidden="true" />
                          </button>
                          <button
                            className="icon-button"
                            type="button"
                            title={item.status === "available" ? "86 item" : "Make available"}
                            onClick={() => void toggleItemStatus(item)}
                          >
                            {item.status === "available" ? <Warning aria-hidden="true" /> : <CheckCircle aria-hidden="true" />}
                          </button>
                          {item.status !== "inactive" ? (
                            <button
                              className="icon-button"
                              data-variant="danger"
                              type="button"
                              title="Deactivate"
                              onClick={() => void deactivateItem(item)}
                            >
                              <Power aria-hidden="true" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 ? <div className="empty-state">No matching items.</div> : null}
        </section>
      </div>

      {drawerOpen ? (
        <div className="drawer-backdrop" role="presentation">
          <section className="drawer" role="dialog" aria-modal="true" aria-label={editingItem ? "Edit item" : "Add item"}>
            <header className="drawer-header">
              <div>
                <p className="eyebrow">Menu item</p>
                <h2>{editingItem ? editingItem.name : "Add item"}</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setDrawerOpen(false)}>
                <X aria-hidden="true" />
              </button>
            </header>

            <form className="drawer-form" onSubmit={saveItem}>
              <label>
                <span>Name</span>
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
              <label>
                <span>Description</span>
                <textarea
                  value={form.description ?? ""}
                  onChange={(event) => setForm({ ...form, description: event.target.value || null })}
                />
              </label>
              <div className="form-grid">
                <label>
                  <span>Category</span>
                  <select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
                    <option value="">Choose category</option>
                    {activeTaxonomy.map((group) => (
                      <optgroup key={group.id} label={group.name}>
                        {group.categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Price</span>
                  <input type="number" min="0" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} />
                </label>
              </div>
              <div className="form-grid">
                <label>
                  <span>Status</span>
                  <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as MenuItemStatus })}>
                    <option value="available">Available</option>
                    <option value="eighty_sixed">86’d</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <label>
                  <span>Display order</span>
                  <input type="number" step="1" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
                </label>
              </div>
              <label>
                <span>Dietary labels</span>
                <input
                  value={form.dietaryFlags.join(", ")}
                  placeholder="vegetarian, gluten-free"
                  onChange={(event) => setForm({
                    ...form,
                    dietaryFlags: event.target.value.split(",").map((flag) => flag.trim()).filter(Boolean),
                  })}
                />
              </label>

              <fieldset className="allergen-fieldset">
                <legend>Authoritative safety declarations</legend>
                <p className="field-help">
                  Ingredient allergens are derived automatically. Use these only
                  for item-level facts that cannot be trusted to the visible
                  ingredient list.
                </p>
                <div className="allergen-declaration-grid">
                  {ALLERGEN_FLAGS.map((flag, index) => {
                    const declaration = form.safetyDeclarations.find(
                      (candidate) =>
                        candidate.allergenFlag === flag &&
                        isAllergenSafetyKind(candidate.kind),
                    );

                    return (
                      <label key={flag}>
                        <span>{flag.replace(/_/g, " ")}</span>
                        <select
                          value={declaration?.kind ?? ""}
                          onChange={(event) => {
                            const kind = event.target.value as
                              | ""
                              | (typeof ALLERGEN_SAFETY_KINDS)[number];
                            const remaining = form.safetyDeclarations.filter(
                              (candidate) =>
                                !(
                                  candidate.allergenFlag === flag &&
                                  isAllergenSafetyKind(candidate.kind)
                                ),
                            );

                            setForm({
                              ...form,
                              safetyDeclarations:
                                kind === ""
                                  ? remaining
                                  : [
                                      ...remaining,
                                      {
                                        kind,
                                        allergenFlag: flag,
                                        note: null,
                                        sortOrder: (index + 1) * 10,
                                      },
                                    ],
                            });
                          }}
                        >
                          <option value="">No item-level declaration</option>
                          <option value="contains">Contains</option>
                          <option value="may_contain">May contain</option>
                          <option value="cross_contact">Cross-contact risk</option>
                        </select>
                      </label>
                    );
                  })}
                </div>

                <div className="safety-process-options">
                  {[
                    ["shared_fryer", "Shared fryer"],
                    ["shared_equipment", "Shared equipment"],
                  ].map(([kind, label], index) => {
                    const safetyKind = kind as
                      | "shared_fryer"
                      | "shared_equipment";
                    const checked = form.safetyDeclarations.some(
                      (declaration) => declaration.kind === safetyKind,
                    );

                    return (
                      <label className="checkbox-field" key={kind}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const remaining = form.safetyDeclarations.filter(
                              (declaration) => declaration.kind !== safetyKind,
                            );
                            setForm({
                              ...form,
                              safetyDeclarations: event.target.checked
                                ? [
                                    ...remaining,
                                    {
                                      kind: safetyKind,
                                      allergenFlag: null,
                                      note: null,
                                      sortOrder: 200 + index * 10,
                                    },
                                  ]
                                : remaining,
                            });
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>

                <label>
                  <span>Other safety note</span>
                  <input
                    value={
                      form.safetyDeclarations.find(
                        (declaration) => declaration.kind === "other",
                      )?.note ?? ""
                    }
                    placeholder="Only when a specific process warning is needed"
                    onChange={(event) => {
                      const note = event.target.value;
                      const remaining = form.safetyDeclarations.filter(
                        (declaration) => declaration.kind !== "other",
                      );
                      setForm({
                        ...form,
                        safetyDeclarations:
                          note.trim() === ""
                            ? remaining
                            : [
                                ...remaining,
                                {
                                  kind: "other",
                                  allergenFlag: null,
                                  note,
                                  sortOrder: 300,
                                },
                              ],
                      });
                    }}
                  />
                </label>
              </fieldset>

              <label className="checkbox-field">
                <input type="checkbox" checked={form.isSpecial} onChange={(event) => setForm({ ...form, isSpecial: event.target.checked })} />
                <span>Feature as a special</span>
              </label>

              {saveError ? <div className="notice notice--error">{saveError}</div> : null}
              <footer className="drawer-actions">
                <button className="button" data-variant="primary" disabled={saving} type="submit">
                  {saving ? <SpinnerGap aria-hidden="true" className="spin" /> : null}
                  {editingItem ? "Save changes" : "Add item"}
                </button>
                <button className="button" data-variant="quiet" disabled={saving} type="button" onClick={() => setDrawerOpen(false)}>Cancel</button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}

      {compositionItem ? (
        <div className="drawer-backdrop" role="presentation">
          <section className="drawer drawer--wide composition-drawer" role="dialog" aria-modal="true" aria-label={`Configure ${compositionItem.name}`}>
            <header className="drawer-header">
              <div>
                <p className="eyebrow">Service configuration</p>
                <h2>{compositionItem.name}</h2>
                <p>These ingredients populate Remove / Extra. Choice groups appear only when the server must choose.</p>
              </div>
              <button className="icon-button" type="button" onClick={() => setCompositionItem(null)}>
                <X aria-hidden="true" />
              </button>
            </header>

            <div className="composition-editor">
              <section className="composition-section">
                <header>
                  <div>
                    <h3>Standard ingredients</h3>
                    <p>Defined once in the ingredient library; linked here.</p>
                  </div>
                  <strong>{ingredientLinks.length}</strong>
                </header>

                <div className="composition-ingredient-list">
                  {ingredientLinks.map((link, index) => {
                    const ingredient = ingredientById.get(link.ingredientId);
                    if (!ingredient) return null;
                    return (
                      <div className="composition-ingredient-row" key={link.ingredientId}>
                        <strong>{ingredient.name}</strong>
                        <label>
                          <input
                            type="checkbox"
                            checked={link.canRemove}
                            onChange={(event) =>
                              setIngredientLinks((current) => current.map((candidate) => candidate.ingredientId === link.ingredientId ? { ...candidate, canRemove: event.target.checked } : candidate))
                            }
                          />
                          Remove
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={link.canSide}
                            onChange={(event) =>
                              setIngredientLinks((current) => current.map((candidate) => candidate.ingredientId === link.ingredientId ? { ...candidate, canSide: event.target.checked } : candidate))
                            }
                          />
                          On side
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={link.canExtra}
                            onChange={(event) =>
                              setIngredientLinks((current) => current.map((candidate) => candidate.ingredientId === link.ingredientId ? { ...candidate, canExtra: event.target.checked } : candidate))
                            }
                          />
                          Extra
                        </label>
                        <label className="composition-price-field">
                          <span>Extra $</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={link.extraPrice}
                            disabled={!link.canExtra}
                            onChange={(event) =>
                              setIngredientLinks((current) => current.map((candidate) => candidate.ingredientId === link.ingredientId ? { ...candidate, extraPrice: Number(event.target.value) } : candidate))
                            }
                          />
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={link.extraPriceConfigured}
                            disabled={!link.canExtra}
                            onChange={(event) =>
                              setIngredientLinks((current) => current.map((candidate) => candidate.ingredientId === link.ingredientId ? { ...candidate, extraPriceConfigured: event.target.checked } : candidate))
                            }
                          />
                          Price confirmed
                        </label>
                        <button type="button" className="composition-remove" onClick={() => setIngredientLinks((current) => current.filter((_, position) => position !== index))}>Remove link</button>
                      </div>
                    );
                  })}
                </div>

                <div className="composition-add-ingredient">
                  <MagnifyingGlass aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Add standard ingredient…"
                    value={ingredientSearch}
                    onChange={(event) => setIngredientSearch(event.target.value)}
                  />
                </div>
                <div className="composition-ingredient-results">
                  {addableRecipeIngredients.map((ingredient) => (
                    <button type="button" key={ingredient.id} onClick={() => addRecipeIngredient(ingredient)}>
                      <span>{ingredient.name}</span>
                      <small>
                        {!ingredient.isAddable
                          ? "ADD not available"
                          : ingredient.addPriceConfigured
                            ? `ADD ${money(ingredient.defaultAddPrice)}`
                            : "ADD · price TBD"}
                      </small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="composition-section">
                <header>
                  <div>
                    <h3>Explicit choices</h3>
                    <p>Protein, side, egg style, bread, temperature—only when a real decision exists.</p>
                  </div>
                  <button className="button" data-variant="quiet" type="button" onClick={addChoiceGroup}>
                    <Plus aria-hidden="true" /> Choice group
                  </button>
                </header>

                <div className="choice-editor-list">
                  {choiceGroups.map((group) => (
                    <article className="choice-editor-group" key={group.key}>
                      <div className="choice-editor-group-head">
                        <label>
                          <span>Prompt</span>
                          <input value={group.label} placeholder="Choose protein" onChange={(event) => updateChoiceGroup(group.key, { label: event.target.value })} />
                        </label>
                        <label>
                          <span>Min</span>
                          <input type="number" min="0" step="1" value={group.minSelections} onChange={(event) => updateChoiceGroup(group.key, { minSelections: Number(event.target.value) })} />
                        </label>
                        <label>
                          <span>Max</span>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={group.maxSelections ?? ""}
                            placeholder="Any"
                            onChange={(event) => updateChoiceGroup(group.key, { maxSelections: event.target.value === "" ? null : Number(event.target.value) })}
                          />
                        </label>
                        <button type="button" className="composition-remove" onClick={() => setChoiceGroups((current) => current.filter((candidate) => candidate.key !== group.key))}>Delete group</button>
                      </div>

                      <div className="choice-option-editor">
                        {group.options.map((option) => (
                          <div className="choice-option-row" key={option.key}>
                            <input
                              value={option.label}
                              placeholder="Option label"
                              onChange={(event) => updateChoiceOption(group.key, option.key, { label: event.target.value })}
                            />
                            <select
                              value={option.ingredientId ?? ""}
                              onChange={(event) => updateChoiceOption(group.key, option.key, { ingredientId: event.target.value || null })}
                            >
                              <option value="">No ingredient link</option>
                              {catalog.ingredients.filter((ingredient) => ingredient.isActive).map((ingredient) => (
                                <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                              ))}
                            </select>
                            <label>
                              <span>+$</span>
                              <input type="number" step="0.01" value={option.priceAdjustment} onChange={(event) => updateChoiceOption(group.key, option.key, { priceAdjustment: Number(event.target.value) })} />
                            </label>
                            <label className="choice-default-check">
                              <input type="checkbox" checked={option.isDefault} onChange={(event) => updateChoiceOption(group.key, option.key, { isDefault: event.target.checked })} /> Default
                            </label>
                            <button type="button" className="composition-remove" onClick={() => updateChoiceGroup(group.key, { options: group.options.filter((candidate) => candidate.key !== option.key) })}>×</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="choice-add-option" onClick={() => addChoiceOption(group.key)}>+ Add option</button>
                    </article>
                  ))}
                </div>
              </section>

              {compositionError ? <div className="notice notice--error">{compositionError}</div> : null}
            </div>

            <footer className="drawer-actions composition-actions">
              <button className="button" data-variant="primary" disabled={compositionSaving} type="button" onClick={() => void saveComposition()}>
                {compositionSaving ? <SpinnerGap aria-hidden="true" className="spin" /> : null}
                Save configuration
              </button>
              <button className="button" data-variant="quiet" disabled={compositionSaving} type="button" onClick={() => setCompositionItem(null)}>Cancel</button>
            </footer>
          </section>
        </div>
      ) : null}

      {ingredientLibraryOpen ? (
        <div className="drawer-backdrop" role="presentation">
          <section className="drawer drawer--wide ingredient-library-drawer" role="dialog" aria-modal="true" aria-label="Ingredient library">
            <header className="drawer-header">
              <div>
                <p className="eyebrow">Reusable data</p>
                <h2>Ingredient Library</h2>
                <p>Each ingredient exists once and can be linked to any menu item.</p>
              </div>
              <button className="icon-button" type="button" onClick={() => setIngredientLibraryOpen(false)}><X aria-hidden="true" /></button>
            </header>

            <div className="ingredient-library-layout">
              <section className="ingredient-library-list">
                <label className="search-field">
                  <MagnifyingGlass aria-hidden="true" />
                  <input type="search" placeholder="Search ingredients" value={librarySearch} onChange={(event) => setLibrarySearch(event.target.value)} />
                </label>
                <button className="button ingredient-new-button" data-variant="primary" type="button" onClick={newLibraryIngredient}><Plus aria-hidden="true" /> New ingredient</button>
                <div>
                  {filteredLibrary.map((ingredient) => (
                    <button
                      type="button"
                      className="ingredient-library-row"
                      data-selected={selectedIngredientId === ingredient.id}
                      data-active={ingredient.isActive}
                      key={ingredient.id}
                      onClick={() => selectLibraryIngredient(ingredient)}
                    >
                      <span>
                        <strong>{ingredient.name}</strong>
                        <small>{ingredient.allergenFlags.join(" · ") || "No declared allergens"}</small>
                      </span>
                      <span>
                        {!ingredient.isActive
                          ? "Inactive"
                          : !ingredient.isAddable
                            ? "Not addable"
                            : ingredient.addPriceConfigured
                              ? `ADD ${money(ingredient.defaultAddPrice)}`
                              : "ADD · price TBD"}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <form className="ingredient-library-form" onSubmit={saveIngredient}>
                <p className="eyebrow">{selectedIngredientId ? "Edit ingredient" : "New ingredient"}</p>
                <h3>{ingredientName || "Ingredient"}</h3>
                <label>
                  <span>Name</span>
                  <input required value={ingredientName} onChange={(event) => setIngredientName(event.target.value)} />
                </label>
                <label className="ingredient-addable-toggle">
                  <span>Global ADD</span>
                  <span className="ingredient-addable-control">
                    <input
                      type="checkbox"
                      checked={ingredientAddable}
                      onChange={(event) => setIngredientAddable(event.target.checked)}
                    />
                    Available to servers in ADD search
                  </span>
                </label>
                <label>
                  <span>Default ADD price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={ingredientPrice}
                    disabled={!ingredientAddable}
                    onChange={(event) => setIngredientPrice(Number(event.target.value))}
                  />
                  <small>
                    {!ingredientAddable
                      ? "Enable Global ADD first."
                      : ingredientPriceConfigured
                        ? "Confirmed price. $0.00 means intentionally free."
                        : "Price is still unknown; servers can order it, but checkout will require a confirmed price."}
                  </small>
                </label>
                <label className="ingredient-addable-toggle">
                  <span>ADD pricing</span>
                  <span className="ingredient-addable-control">
                    <input
                      type="checkbox"
                      checked={ingredientPriceConfigured}
                      disabled={!ingredientAddable}
                      onChange={(event) => setIngredientPriceConfigured(event.target.checked)}
                    />
                    Price confirmed
                  </span>
                </label>
                <fieldset className="allergen-fieldset">
                  <legend>Allergens</legend>
                  <div className="allergen-checkbox-grid">
                    {ALLERGEN_FLAGS.map((flag) => (
                      <label key={flag}>
                        <input
                          type="checkbox"
                          checked={ingredientAllergens.includes(flag)}
                          onChange={() => setIngredientAllergens((current) => current.includes(flag) ? current.filter((value) => value !== flag) : [...current, flag])}
                        />
                        <span>{flag.replace(/_/g, " ")}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {ingredientError ? <div className="notice notice--error">{ingredientError}</div> : null}
                <div className="ingredient-library-form-actions">
                  <button className="button" data-variant="primary" disabled={ingredientSaving} type="submit">{ingredientSaving ? "Saving…" : "Save ingredient"}</button>
                  {selectedIngredientId ? (
                    <button
                      className="button"
                      data-variant="quiet"
                      type="button"
                      onClick={() => {
                        const ingredient = ingredientById.get(selectedIngredientId);
                        if (ingredient) void toggleIngredientActive(ingredient);
                      }}
                    >
                      {ingredientById.get(selectedIngredientId)?.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  ) : null}
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
