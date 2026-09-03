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
  INGREDIENT_KINDS,
  type AllergenFlag,
  type ComponentRelationship,
  type ComponentRole,
  type IngredientKind,
  type CreateMenuItemInput,
  type Ingredient,
  type MenuChoiceGroup,
  type MenuCustomizationCatalog,
  type MenuGroup,
  type MenuItem,
  type MenuItemIngredient,
  type MenuItemIngredientReplacement,
  type MenuItemSafetyDeclarationInput,
  type MenuItemSafetyKind,
  type MenuItemSafetyOverrideAuditEvent,
  type MenuItemStatus,
  type ReplaceMenuItemCustomizationInput,
  type UniversalComponentRole,
} from "@lazy-janes/shared";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  createIngredient,
  createMenuItem,
  deactivateMenuItem,
  getMenuCustomizationCatalog,
  getMenuItemSafetyOverrideHistory,
  getMenuItems,
  getMenuTaxonomy,
  replaceMenuItemCustomization,
  setMenuItemSafetyOverride,
  updateIngredient,
  updateMenuItem,
} from "../api/menu.js";
import { useAuth } from "../hooks/useAuth";
import { Drawer } from "../components/ui/Drawer";

const emptyForm: CreateMenuItemInput = {
  parentItemId: null,
  name: "",
  description: null,
  categoryId: "",
  price: 0,
  priceConfigured: false,
  status: "draft",
  isSpecial: false,
  isKids: false,
  hasKidsVersion: false,
  isModifier: false,
  dietaryFlags: [],
  safetyDeclarations: [],
  sortOrder: 0,
};

type IngredientLinkDraft = {
  ingredientId: string;
  role: ComponentRole;
  contextualRole: UniversalComponentRole | null;
  relationship: ComponentRelationship | null;
  preparationSchemeId: string | null;
  canRemove: boolean;
  canSide: boolean;
  canExtra: boolean;
  canReplace: boolean;
  replacementOptionsConfigured: boolean;
  extraPrice: number;
  extraPriceConfigured: boolean;
  sortOrder: number;
};

type ReplacementDraft = {
  sourceIngredientId: string;
  replacementIngredientId: string;
  preparationSchemeId: string | null;
  priceAdjustment: number;
  priceAdjustmentConfigured: boolean;
  sortOrder: number;
};

type ChoiceOptionDraft = {
  key: string;
  label: string;
  ingredientId: string | null;
  preparationSchemeId: string | null;
  isNoneOption: boolean;
  priceAdjustment: number;
  priceAdjustmentConfigured: boolean;
  sortOrder: number;
  isDefault: boolean;
};

type CompositionView = "easy" | "advanced";

type ChoiceGroupDraft = {
  key: string;
  label: string;
  role: ComponentRole;
  relationship: ComponentRelationship | null;
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

const UMO_ROLE_OPTIONS: Array<{
  value: UniversalComponentRole;
  label: string;
}> = [
  { value: "primary", label: "Main item" },
  { value: "base", label: "Base" },
  { value: "carrier", label: "Bread / wrap / bun" },
  { value: "filling", label: "Inside filling" },
  { value: "topping", label: "Topping" },
  { value: "sauce", label: "Sauce" },
  { value: "accompaniment", label: "Side" },
];

function isAllergenSafetyKind(
  kind: MenuItemSafetyKind,
): kind is (typeof ALLERGEN_SAFETY_KINDS)[number] {
  return ALLERGEN_SAFETY_KINDS.includes(
    kind as (typeof ALLERGEN_SAFETY_KINDS)[number],
  );
}

function safetyOverrideLabel(
  declaration: MenuItemSafetyDeclarationInput,
): string {
  const allergen = declaration.allergenFlag?.replace(/_/g, " ");
  if (declaration.kind === "contains" && allergen) return `contains ${allergen}`;
  if (declaration.kind === "may_contain" && allergen) return `may contain ${allergen}`;
  if (declaration.kind === "cross_contact" && allergen) return `possible contact: ${allergen}`;
  if (declaration.kind === "shared_fryer") return "shared fryer";
  if (declaration.kind === "shared_equipment") return "shared equipment";
  return declaration.note ?? "other safety note";
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
    role: group.role,
    relationship: group.relationship,
    minSelections: group.minSelections,
    maxSelections: group.maxSelections,
    sortOrder: group.sortOrder,
    options: group.options.map((option) => ({
      key: option.id,
      label: option.label,
      ingredientId: option.ingredientId,
      preparationSchemeId: option.preparationSchemeId,
      isNoneOption: option.isNoneOption,
      priceAdjustment: option.priceAdjustment,
      priceAdjustmentConfigured: option.priceAdjustmentConfigured,
      sortOrder: option.sortOrder,
      isDefault: option.isDefault,
    })),
  };
}

function linkDraft(link: MenuItemIngredient): IngredientLinkDraft {
  return {
    ingredientId: link.ingredientId,
    role: link.role,
    contextualRole: link.contextualRole,
    relationship: link.relationship,
    preparationSchemeId: link.preparationSchemeId,
    canRemove: link.canRemove,
    canSide: link.canSide,
    canExtra: link.canExtra,
    canReplace: link.canReplace,
    replacementOptionsConfigured: link.replacementOptionsConfigured,
    extraPrice: link.extraPrice,
    extraPriceConfigured: link.extraPriceConfigured,
    sortOrder: link.sortOrder,
  };
}

function replacementDraft(
  replacement: MenuItemIngredientReplacement,
): ReplacementDraft {
  return {
    sourceIngredientId: replacement.sourceIngredientId,
    replacementIngredientId: replacement.replacementIngredientId,
    preparationSchemeId: replacement.preparationSchemeId,
    priceAdjustment: replacement.priceAdjustment,
    priceAdjustmentConfigured: replacement.priceAdjustmentConfigured,
    sortOrder: replacement.sortOrder,
  };
}

export function MenuManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes("admin") ?? false;

  const [items, setItems] = useState<MenuItem[]>([]);
  const [taxonomy, setTaxonomy] = useState<MenuGroup[]>([]);
  const [catalog, setCatalog] = useState<MenuCustomizationCatalog>({
    ingredients: [],
    preparationSchemes: [],
    itemIngredients: [],
    replacements: [],
    choiceGroups: [],
    choiceConstraints: [],
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
  const [safetyOverrideDeclarations, setSafetyOverrideDeclarations] =
    useState<MenuItemSafetyDeclarationInput[]>([]);
  const [safetyOverrideReason, setSafetyOverrideReason] = useState("");
  const [safetyOverrideHistory, setSafetyOverrideHistory] =
    useState<MenuItemSafetyOverrideAuditEvent[]>([]);
  const [safetyOverrideSaving, setSafetyOverrideSaving] = useState(false);
  const [safetyOverrideError, setSafetyOverrideError] = useState("");

  const [compositionItem, setCompositionItem] = useState<MenuItem | null>(null);
  const [ingredientLinks, setIngredientLinks] = useState<IngredientLinkDraft[]>([]);
  const [replacements, setReplacements] = useState<ReplacementDraft[]>([]);
  const [choiceGroups, setChoiceGroups] = useState<ChoiceGroupDraft[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [compositionSaving, setCompositionSaving] = useState(false);
  const [compositionError, setCompositionError] = useState("");
  const [compositionView, setCompositionView] = useState<CompositionView>("easy");
  const [compositionPrice, setCompositionPrice] = useState("");

  const [ingredientLibraryOpen, setIngredientLibraryOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientKind, setIngredientKind] = useState<IngredientKind>("other");
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

  const compositionReadinessIssues = useMemo(() => {
    const issues: string[] = [];

    if (compositionItem && compositionPrice.trim() === "") {
      issues.push("Add a selling price");
    }
    if (ingredientLinks.length + choiceGroups.length === 0) {
      issues.push("Add at least one component or customer choice");
    }
    if (ingredientLinks.some((link) => link.relationship === null)) {
      issues.push("Say whether every component is part of the item or comes alongside");
    }
    if (ingredientLinks.some((link) => link.contextualRole === null)) {
      issues.push("Define the job of every component in this item");
    }
    if (ingredientLinks.some((link) => link.canExtra && !link.extraPriceConfigured)) {
      issues.push("Confirm every EXTRA price, including $0");
    }
    if (ingredientLinks.some((link) => {
      if (!link.canReplace) return false;
      return !link.replacementOptionsConfigured || !replacements.some(
        (replacement) => replacement.sourceIngredientId === link.ingredientId,
      );
    })) {
      issues.push("Configure at least one target for every enabled substitution");
    }
    if (replacements.some((replacement) => !replacement.priceAdjustmentConfigured)) {
      issues.push("Confirm every substitution price, including $0");
    }
    if (choiceGroups.some((group) => group.label.trim() === "")) {
      issues.push("Name every customer choice");
    }
    if (choiceGroups.some((group) => group.relationship === null)) {
      issues.push("Say whether every component choice belongs in the item or comes alongside");
    }
    if (choiceGroups.some((group) => group.maxSelections === null)) {
      issues.push("Set a maximum for every customer choice");
    }
    if (choiceGroups.some((group) =>
      group.options.length === 0 || group.options.some((option) => option.label.trim() === "")
    )) {
      issues.push("Give every choice at least one named option");
    }
    if (choiceGroups.some((group) =>
      group.options.some((option) => !option.priceAdjustmentConfigured)
    )) {
      issues.push("Confirm every choice price, including $0");
    }

    return issues;
  }, [choiceGroups, compositionItem, compositionPrice, ingredientLinks, replacements]);

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
    setSafetyOverrideDeclarations([]);
    setSafetyOverrideReason("");
    setSafetyOverrideHistory([]);
    setSafetyOverrideError("");
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
      priceConfigured: item.priceConfigured,
      status: item.status,
      isSpecial: item.isSpecial,
      isKids: item.isKids,
      hasKidsVersion: item.hasKidsVersion,
      isModifier: false,
      dietaryFlags: [...item.dietaryFlags],
      safetyDeclarations: [],
      sortOrder: item.sortOrder,
    });
    setSafetyOverrideDeclarations(
      item.safetyDeclarations
        .filter((declaration) => declaration.isManualOverride)
        .map((declaration) => ({
          kind: declaration.kind,
          allergenFlag: declaration.allergenFlag,
          note: declaration.note,
          sortOrder: declaration.sortOrder,
        })),
    );
    setSafetyOverrideReason("");
    setSafetyOverrideError("");
    setSafetyOverrideHistory([]);
    if (isAdmin) {
      void getMenuItemSafetyOverrideHistory(item.id)
        .then(setSafetyOverrideHistory)
        .catch(() => setSafetyOverrideHistory([]));
    }
    setSaveError("");
    setDrawerOpen(true);
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError("");
    setSaving(true);
    let createdItem: MenuItem | null = null;

    try {
      if (editingItem) {
        const updated = await updateMenuItem(editingItem.id, {
          name: form.name,
          description: form.description,
          categoryId: form.categoryId,
          price: form.price,
          priceConfigured: form.priceConfigured,
          status: form.status,
          isSpecial: form.isSpecial,
          isKids: form.isKids,
          hasKidsVersion: form.hasKidsVersion,
          dietaryFlags: form.dietaryFlags,
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
          safetyDeclarations: [],
        });
        setItems((current) => [...current, created]);
        createdItem = created;
      }

      setDrawerOpen(false);
      setEditingItem(null);
      if (createdItem) {
        openComposition(createdItem);
      }
    } catch (error: unknown) {
      setSaveError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function saveSafetyOverride(clear = false) {
    if (!editingItem || !isAdmin) return;
    if (safetyOverrideReason.trim().length < 3) {
      setSafetyOverrideError("Add a short reason for this change.");
      return;
    }

    setSafetyOverrideSaving(true);
    setSafetyOverrideError("");

    try {
      const updated = await setMenuItemSafetyOverride(editingItem.id, {
        declarations: clear ? [] : safetyOverrideDeclarations,
        reason: safetyOverrideReason.trim(),
      });
      setEditingItem(updated);
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSafetyOverrideDeclarations(
        updated.safetyDeclarations
          .filter((declaration) => declaration.isManualOverride)
          .map((declaration) => ({
            kind: declaration.kind,
            allergenFlag: declaration.allergenFlag,
            note: declaration.note,
            sortOrder: declaration.sortOrder,
          })),
      );
      setSafetyOverrideReason("");
      setSafetyOverrideHistory(
        await getMenuItemSafetyOverrideHistory(updated.id),
      );
    } catch (error: unknown) {
      setSafetyOverrideError(errorMessage(error));
    } finally {
      setSafetyOverrideSaving(false);
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
    setReplacements(
      catalog.replacements
        .filter((replacement) => replacement.menuItemId === item.id)
        .map(replacementDraft),
    );
    setChoiceGroups(
      catalog.choiceGroups
        .filter((group) => group.menuItemId === item.id)
        .map(choiceDraft),
    );
    setIngredientSearch("");
    setCompositionError("");
    setCompositionView("easy");
    setCompositionPrice(item.priceConfigured ? String(item.price) : "");
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

  function addRecipeIngredient(
    ingredient: Ingredient,
    relationship: ComponentRelationship | null = null,
  ) {
    setIngredientLinks((current) => [
      ...current,
      {
        ingredientId: ingredient.id,
        role: "other",
        contextualRole: relationship === "comes_with" ? "accompaniment" : null,
        relationship,
        preparationSchemeId: null,
        canRemove: false,
        canSide: false,
        canExtra: false,
        canReplace: false,
        replacementOptionsConfigured: false,
        extraPrice: ingredient.defaultAddPrice,
        extraPriceConfigured: ingredient.addPriceConfigured,
        sortOrder: current.length,
      },
    ]);
    setIngredientSearch("");
  }

  function updateIngredientLink(
    ingredientId: string,
    changes: Partial<IngredientLinkDraft>,
  ) {
    setIngredientLinks((current) => current.map((link) =>
      link.ingredientId === ingredientId ? { ...link, ...changes } : link,
    ));
  }

  function placeIngredient(
    ingredientId: string,
    relationship: Exclude<ComponentRelationship, null>,
  ) {
    setIngredientLinks((current) =>
      current.map((link) => {
        if (link.ingredientId !== ingredientId) return link;
        return {
          ...link,
          relationship,
          contextualRole:
            relationship === "comes_with"
              ? "accompaniment"
              : link.contextualRole === "accompaniment"
                ? null
                : link.contextualRole,
          ...(relationship === "comes_with" ? { canSide: false } : {}),
        };
      }),
    );
  }

  function removeRecipeIngredient(ingredientId: string) {
    setIngredientLinks((current) => current.filter(
      (link) => link.ingredientId !== ingredientId,
    ));
    setReplacements((current) => current.filter(
      (replacement) => replacement.sourceIngredientId !== ingredientId,
    ));
  }

  function addReplacement(sourceIngredientId: string, replacementIngredientId: string) {
    if (!replacementIngredientId) return;
    setReplacements((current) => {
      if (current.some((replacement) =>
        replacement.sourceIngredientId === sourceIngredientId &&
        replacement.replacementIngredientId === replacementIngredientId
      )) return current;
      const sourceCount = current.filter((replacement) => replacement.sourceIngredientId === sourceIngredientId).length;
      return [
        ...current,
        {
          sourceIngredientId,
          replacementIngredientId,
          preparationSchemeId: null,
          priceAdjustment: 0,
          priceAdjustmentConfigured: false,
          sortOrder: sourceCount,
        },
      ];
    });
    setIngredientLinks((current) => current.map((link) =>
      link.ingredientId === sourceIngredientId
        ? { ...link, canReplace: true, replacementOptionsConfigured: true }
        : link,
    ));
  }

  function updateReplacement(
    sourceIngredientId: string,
    replacementIngredientId: string,
    changes: Partial<ReplacementDraft>,
  ) {
    setReplacements((current) => current.map((replacement) =>
      replacement.sourceIngredientId === sourceIngredientId &&
      replacement.replacementIngredientId === replacementIngredientId
        ? { ...replacement, ...changes }
        : replacement,
    ));
  }

  function removeReplacement(sourceIngredientId: string, replacementIngredientId: string) {
    setReplacements((current) => {
      const next = current.filter((replacement) =>
        replacement.sourceIngredientId !== sourceIngredientId ||
        replacement.replacementIngredientId !== replacementIngredientId
      );
      if (!next.some((replacement) => replacement.sourceIngredientId === sourceIngredientId)) {
        setIngredientLinks((links) => links.map((link) =>
          link.ingredientId === sourceIngredientId
            ? { ...link, canReplace: false, replacementOptionsConfigured: false }
            : link,
        ));
      }
      return next;
    });
  }

  function addChoiceGroup() {
    setChoiceGroups((current) => [
      ...current,
      {
        key: crypto.randomUUID(),
        label: "",
        role: "other",
        relationship: null,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: current.length,
        options: [
          {
            key: crypto.randomUUID(),
            label: "",
            ingredientId: null,
            preparationSchemeId: null,
            isNoneOption: false,
            priceAdjustment: 0,
            priceAdjustmentConfigured: false,
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
                  preparationSchemeId: null,
                  isNoneOption: false,
                  priceAdjustment: 0,
                  priceAdjustmentConfigured: false,
                  sortOrder: group.options.length,
                  isDefault: false,
                },
              ],
            }
          : group,
      ),
    );
  }

  async function saveComposition(publish = false) {
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

    if (publish && compositionReadinessIssues.length > 0) {
      setCompositionError(compositionReadinessIssues[0] ?? "Finish the item setup before publishing.");
      return;
    }

    const input: ReplaceMenuItemCustomizationInput = {
      ingredients: ingredientLinks.map((link, index) => ({
        ingredientId: link.ingredientId,
        role: link.role,
        contextualRole: link.contextualRole,
        relationship: link.relationship ?? null,
        preparationSchemeId: link.preparationSchemeId,
        canRemove: link.canRemove,
        canSide: link.canSide,
        canExtra: link.canExtra,
        canReplace: link.canReplace,
        replacementOptionsConfigured: link.replacementOptionsConfigured,
        extraPrice: link.extraPrice,
        extraPriceConfigured: link.extraPriceConfigured,
        sortOrder: index,
      })),
      replacements: replacements.map((replacement, index) => ({
        sourceIngredientId: replacement.sourceIngredientId,
        replacementIngredientId: replacement.replacementIngredientId,
        preparationSchemeId: replacement.preparationSchemeId,
        priceAdjustment: replacement.priceAdjustment,
        priceAdjustmentConfigured: replacement.priceAdjustmentConfigured,
        sortOrder: index,
      })),
      choiceGroups: choiceGroups.map((group, groupIndex) => ({
        label: group.label.trim(),
        role: group.role,
        relationship: group.relationship ?? null,
        minSelections: group.minSelections,
        maxSelections: group.maxSelections,
        sortOrder: groupIndex,
        options: group.options.map((option, optionIndex) => ({
          label: option.label.trim(),
          ingredientId: option.ingredientId,
          preparationSchemeId: option.preparationSchemeId,
          isNoneOption: option.isNoneOption,
          priceAdjustment: option.priceAdjustment,
          priceAdjustmentConfigured: option.priceAdjustmentConfigured,
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

      const priceConfigured = compositionPrice.trim() !== "";
      const savedItem = await updateMenuItem(compositionItem.id, {
        price: priceConfigured ? Number(compositionPrice) : 0,
        priceConfigured,
        ...(publish ? { status: "available" as const } : {}),
      });
      setItems((current) => current.map((item) =>
        item.id === savedItem.id ? savedItem : item,
      ));

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
    setIngredientKind(ingredient.kind);
    setIngredientAddable(ingredient.isAddable);
    setIngredientPrice(ingredient.defaultAddPrice);
    setIngredientPriceConfigured(ingredient.addPriceConfigured);
    setIngredientAllergens([...ingredient.allergenFlags]);
    setIngredientError("");
  }

  function newLibraryIngredient() {
    setSelectedIngredientId(null);
    setIngredientName("");
    setIngredientKind("other");
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
          kind: ingredientKind,
          isAddable: ingredientAddable,
          defaultAddPrice: ingredientPrice,
          addPriceConfigured: ingredientPriceConfigured,
          allergenFlags: ingredientAllergens,
        });
      } else {
        await createIngredient({
          name: ingredientName,
          kind: ingredientKind,
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
          <option value="draft">Draft</option>
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
                        <strong>
                          {item.name}
                          {item.hasManualSafetyOverride ? (
                            <span
                              className="manual-safety-cue"
                              title="Admin safety override"
                              aria-label="Admin safety override"
                            />
                          ) : null}
                        </strong>
                        {item.description ? <small>{item.description}</small> : null}
                      </td>
                      <td className="price">{item.priceConfigured ? money(item.price) : "—"}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td>
                        <button
                          type="button"
                          className="menu-composition-button"
                          onClick={() => openComposition(item)}
                        >
                          <strong>{item.status === "draft" ? "Finish item setup" : `${ingredientCount} ingredients`}</strong>
                          <span>{ingredientCount} ingredients · {choiceCount} choice {choiceCount === 1 ? "group" : "groups"}</span>
                        </button>
                      </td>
                      <td>
                        <div className="item-actions">
                          <button className="icon-button" type="button" title="Edit item" onClick={() => openEdit(item)}>
                            <PencilSimple aria-hidden="true" />
                          </button>
                          {item.status !== "draft" ? (
                            <button
                              className="icon-button"
                              type="button"
                              title={item.status === "available" ? "86 item" : "Make available"}
                              onClick={() => void toggleItemStatus(item)}
                            >
                              {item.status === "available" ? <Warning aria-hidden="true" /> : <CheckCircle aria-hidden="true" />}
                            </button>
                          ) : null}
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
        <Drawer
          ariaLabel={editingItem ? "Edit item" : "Add item"}
          eyebrow="Menu item"
          title={editingItem ? editingItem.name : "Add item"}
          onClose={() => setDrawerOpen(false)}
          headerAction={
            <button
              className="icon-button"
              type="button"
              aria-label="Close"
              onClick={() => setDrawerOpen(false)}
            >
              <X aria-hidden="true" />
            </button>
          }
        >

            <form className="drawer-form menu-item-basics-form" onSubmit={saveItem}>
              <div className="menu-item-start-note">
                <strong>Start a draft</strong>
                <span>Name it and choose where it belongs. Price and details can be added later.</span>
              </div>
              <label className="menu-item-basics-name">
                <span>Name <small>Required</small></span>
                <input required placeholder="Turkey Club" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
              <label>
                <span>Description <small>Optional</small></span>
                <textarea
                  placeholder="Short menu description"
                  value={form.description ?? ""}
                  onChange={(event) => setForm({ ...form, description: event.target.value || null })}
                />
              </label>
              <div className="form-grid">
                <label>
                  <span>Category <small>Required</small></span>
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
                  <span>Price <small>Optional for draft</small></span>
                  <div className="menu-item-price-input">
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Add later"
                      value={form.priceConfigured ? form.price : ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        setForm({
                          ...form,
                          price: value === "" ? 0 : Number(value),
                          priceConfigured: value !== "",
                        });
                      }}
                    />
                  </div>
                  <small className="field-help">A price is only required before you publish.</small>
                </label>
              </div>
              <div className="form-grid">
                {editingItem?.status === "draft" || !editingItem ? (
                  <div className="draft-state-note">
                    <span>Status</span>
                    <strong>Draft</strong>
                    <small>It cannot appear in Order Entry until item setup is complete.</small>
                  </div>
                ) : (
                  <label>
                    <span>Status</span>
                    <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as MenuItemStatus })}>
                      <option value="available">Available</option>
                      <option value="eighty_sixed">86’d</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                )}
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

              {editingItem && isAdmin ? (
                <details className="admin-safety-override">
                  <summary>
                    <span>
                      Admin safety override
                      {editingItem.hasManualSafetyOverride ? (
                        <span className="manual-safety-cue" aria-hidden="true" />
                      ) : null}
                    </span>
                    <small>Emergency use only</small>
                  </summary>

                  <div className="admin-safety-override-body">
                    <p className="field-help">
                      Use only if this item needs a safety warning that its ingredients do not show.
                      Every change records who changed it, when, what changed, and why.
                    </p>

                    {editingItem.safetyDeclarations.some(
                      (declaration) => !declaration.isManualOverride,
                    ) ? (
                      <div className="admin-safety-existing">
                        <strong>Already on this item</strong>
                        <span>
                          {editingItem.safetyDeclarations
                            .filter((declaration) => !declaration.isManualOverride)
                            .map(safetyOverrideLabel)
                            .join(" · ")}
                        </span>
                      </div>
                    ) : null}

                    <div className="allergen-declaration-grid">
                      {ALLERGEN_FLAGS.map((flag, index) => {
                        const declaration = safetyOverrideDeclarations.find(
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
                                const remaining = safetyOverrideDeclarations.filter(
                                  (candidate) =>
                                    !(
                                      candidate.allergenFlag === flag &&
                                      isAllergenSafetyKind(candidate.kind)
                                    ),
                                );
                                setSafetyOverrideDeclarations(
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
                                );
                              }}
                            >
                              <option value="">No override</option>
                              <option value="contains">Contains</option>
                              <option value="may_contain">May contain</option>
                              <option value="cross_contact">Possible contact</option>
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
                        const safetyKind = kind as "shared_fryer" | "shared_equipment";
                        const checked = safetyOverrideDeclarations.some(
                          (declaration) => declaration.kind === safetyKind,
                        );
                        return (
                          <label className="checkbox-field" key={kind}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                const remaining = safetyOverrideDeclarations.filter(
                                  (declaration) => declaration.kind !== safetyKind,
                                );
                                setSafetyOverrideDeclarations(
                                  event.target.checked
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
                                );
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
                          safetyOverrideDeclarations.find(
                            (declaration) => declaration.kind === "other",
                          )?.note ?? ""
                        }
                        placeholder="Only if the kitchen needs a special warning"
                        onChange={(event) => {
                          const note = event.target.value;
                          const remaining = safetyOverrideDeclarations.filter(
                            (declaration) => declaration.kind !== "other",
                          );
                          setSafetyOverrideDeclarations(
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
                          );
                        }}
                      />
                    </label>

                    <label>
                      <span>Reason for this override</span>
                      <textarea
                        value={safetyOverrideReason}
                        placeholder="Why is this item different?"
                        onChange={(event) => setSafetyOverrideReason(event.target.value)}
                      />
                    </label>

                    {safetyOverrideError ? (
                      <p className="error-message">{safetyOverrideError}</p>
                    ) : null}

                    <div className="admin-safety-actions">
                      <button
                        className="button"
                        type="button"
                        disabled={safetyOverrideSaving}
                        onClick={() => void saveSafetyOverride(false)}
                      >
                        {safetyOverrideSaving ? "Saving…" : "Save override"}
                      </button>
                      {editingItem.hasManualSafetyOverride ? (
                        <button
                          className="button"
                          data-variant="quiet"
                          type="button"
                          disabled={safetyOverrideSaving}
                          onClick={() => void saveSafetyOverride(true)}
                        >
                          Clear override
                        </button>
                      ) : null}
                    </div>

                    {safetyOverrideHistory.length > 0 ? (
                      <div className="admin-safety-history">
                        <strong>History</strong>
                        {safetyOverrideHistory.slice(0, 5).map((event) => (
                          <div key={event.id}>
                            <span>{event.changedByDisplayName} · {event.action}</span>
                            <small>{new Date(event.changedAt).toLocaleString()} · {event.reason}</small>
                            <small>
                              Before: {event.beforeDeclarations.length > 0
                                ? event.beforeDeclarations.map(safetyOverrideLabel).join(", ")
                                : "none"}
                              {" → "}
                              After: {event.afterDeclarations.length > 0
                                ? event.afterDeclarations.map(safetyOverrideLabel).join(", ")
                                : "none"}
                            </small>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </details>
              ) : null}

              <label className="checkbox-field">
                <input type="checkbox" checked={form.isSpecial} onChange={(event) => setForm({ ...form, isSpecial: event.target.checked })} />
                <span>Feature as a special</span>
              </label>

              <label className="checkbox-field">
                <input type="checkbox" checked={form.isKids} onChange={(event) => setForm({ ...form, isKids: event.target.checked })} />
                <span>Kids item</span>
              </label>

              {saveError ? <div className="notice notice--error">{saveError}</div> : null}
              <footer className="drawer-actions">
                <button className="button" data-variant="primary" disabled={saving} type="submit">
                  {saving ? <SpinnerGap aria-hidden="true" className="spin" /> : null}
                  {editingItem ? "Save changes" : "Save draft & build food"}
                </button>
                <button className="button" data-variant="quiet" disabled={saving} type="button" onClick={() => setDrawerOpen(false)}>Cancel</button>
              </footer>
            </form>
        </Drawer>
      ) : null}

      {compositionItem ? (
        <Drawer
          wide
          className="composition-drawer"
          headerClassName="composition-drawer-header"
          ariaLabel={`Configure ${compositionItem.name}`}
          eyebrow="Item setup"
          title={compositionItem.name}
          description="Tell us what comes with this item and what customers can change."
          onClose={() => setCompositionItem(null)}
          headerAction={
            <div className="composition-header-actions">
              <div className="composition-view-switch" aria-label="Item setup view">
                <button
                  type="button"
                  data-active={compositionView === "easy"}
                  onClick={() => setCompositionView("easy")}
                >
                  Easy View
                </button>
                <button
                  type="button"
                  data-active={compositionView === "advanced"}
                  onClick={() => setCompositionView("advanced")}
                >
                  Advanced View
                </button>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close"
                onClick={() => setCompositionItem(null)}
              >
                <X aria-hidden="true" />
              </button>
            </div>
          }
        >

            <div className="composition-editor composition-editor--guided">
              {compositionView === "easy" ? (
                <div className="easy-composition">
                  <section className="easy-build-section">
                    <header className="easy-section-heading">
                      <div>
                        <p className="composition-step-label">BUILD THE PLATE</p>
                        <h3>What does the customer get?</h3>
                        <p className="easy-section-copy">Search for food, then choose where it normally comes.</p>
                      </div>
                      <span>{ingredientLinks.length} ingredients</span>
                    </header>

                    <div className="composition-picker easy-ingredient-search">
                      <MagnifyingGlass aria-hidden="true" />
                      <input
                        type="search"
                        placeholder="Type 2+ letters — chicken, bread, fries…"
                        value={ingredientSearch}
                        onChange={(event) => setIngredientSearch(event.target.value)}
                      />
                    </div>

                    {ingredientSearch.trim().length === 1 ? (
                      <div className="easy-search-hint">Type one more letter to search.</div>
                    ) : null}

                    {ingredientSearch.trim().length >= 2 ? (
                      <div className="easy-picker-results">
                        {addableRecipeIngredients.length === 0 ? (
                          <p className="composition-empty-inline">Not found. Add it to Ingredients first.</p>
                        ) : addableRecipeIngredients.slice(0, 8).map((ingredient) => (
                          <div className="easy-picker-row" key={ingredient.id}>
                            <span>
                              <strong>{ingredient.name}</strong>
                              <small>{ingredient.kind.replace(/_/g, " ")}</small>
                            </span>
                            <div>
                              <button type="button" onClick={() => addRecipeIngredient(ingredient, "contains")}>On item</button>
                              <button type="button" onClick={() => addRecipeIngredient(ingredient, "comes_with")}>With item</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="easy-food-zones">
                      {(["contains", "comes_with"] as const).map((relationship) => {
                        const links = ingredientLinks.filter((link) => link.relationship === relationship);
                        const isInside = relationship === "contains";
                        return (
                          <section
                            className="easy-food-zone"
                            data-zone={relationship}
                            key={relationship}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                              event.preventDefault();
                              const ingredientId = event.dataTransfer.getData("text/plain");
                              if (ingredientId) placeIngredient(ingredientId, relationship);
                            }}
                          >
                            <header>
                              <div>
                                <strong>{isInside ? "ON / IN THE ITEM" : "WITH THE ITEM"}</strong>
                                <span>{isInside ? "Bread, filling, toppings, sauce" : "Fries, pickle, side salad"}</span>
                              </div>
                              <b>{links.length}</b>
                            </header>

                            <div className="easy-food-zone-list">
                              {links.length === 0 ? (
                                <div className="easy-zone-empty">Nothing here yet.</div>
                              ) : links.map((link) => {
                                const ingredient = ingredientById.get(link.ingredientId);
                                if (!ingredient) return null;
                                const hasAdvancedSetup = Boolean(
                                  link.preparationSchemeId ||
                                  link.canReplace ||
                                  replacements.some((replacement) => replacement.sourceIngredientId === link.ingredientId),
                                );
                                return (
                                  <article
                                    className="easy-food-card"
                                    draggable
                                    key={link.ingredientId}
                                    onDragStart={(event) => event.dataTransfer.setData("text/plain", link.ingredientId)}
                                  >
                                    <div className="easy-food-card-main">
                                      <div>
                                        <strong>{ingredient.name}</strong>
                                        <small>{ingredient.kind.replace(/_/g, " ")}</small>
                                      </div>
                                      <button type="button" className="composition-remove" onClick={() => removeRecipeIngredient(link.ingredientId)}>Remove</button>
                                    </div>

                                    <label className="easy-role-field">
                                      <span>What is it here?</span>
                                      <select
                                        value={link.contextualRole ?? ""}
                                        onChange={(event) => updateIngredientLink(link.ingredientId, {
                                          contextualRole: (event.target.value || null) as UniversalComponentRole | null,
                                        })}
                                      >
                                        <option value="">Choose…</option>
                                        {UMO_ROLE_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                      </select>
                                    </label>

                                    <div className="easy-customer-options">
                                      <span>Customer may ask for</span>
                                      <label>
                                        <input type="checkbox" checked={link.canRemove} onChange={(event) => updateIngredientLink(link.ingredientId, { canRemove: event.target.checked })} />
                                        Remove
                                      </label>
                                      {isInside ? (
                                        <label title="The item normally includes this here; the customer may ask to receive it separately.">
                                          <input type="checkbox" checked={link.canSide} onChange={(event) => updateIngredientLink(link.ingredientId, { canSide: event.target.checked })} />
                                          Move it to the side
                                        </label>
                                      ) : (
                                        <span className="easy-normal-side-note">Already comes separately</span>
                                      )}
                                      <label>
                                        <input type="checkbox" checked={link.canExtra} onChange={(event) => updateIngredientLink(link.ingredientId, { canExtra: event.target.checked })} />
                                        Extra
                                      </label>
                                    </div>

                                    {link.canExtra ? (
                                      <div className="easy-extra-price">
                                        <label>
                                          <span>Extra price</span>
                                          <input type="number" min="0" step="0.01" value={link.extraPrice} onChange={(event) => updateIngredientLink(link.ingredientId, { extraPrice: Number(event.target.value) })} />
                                        </label>
                                        <label>
                                          <input type="checkbox" checked={link.extraPriceConfigured} onChange={(event) => updateIngredientLink(link.ingredientId, { extraPriceConfigured: event.target.checked })} />
                                          Price is correct
                                        </label>
                                      </div>
                                    ) : null}

                                    <div className="easy-card-foot">
                                      <button type="button" onClick={() => placeIngredient(link.ingredientId, isInside ? "comes_with" : "contains")}>
                                        Move to {isInside ? "Served with it" : "In / on the item"}
                                      </button>
                                      {hasAdvancedSetup ? <span>More setup saved in Advanced</span> : null}
                                    </div>
                                  </article>
                                );
                              })}
                            </div>
                          </section>
                        );
                      })}
                    </div>

                    {ingredientLinks.some((link) => link.relationship === null) ? (
                      <div className="easy-unplaced">
                        <strong>Needs a place</strong>
                        {ingredientLinks.filter((link) => link.relationship === null).map((link) => {
                          const ingredient = ingredientById.get(link.ingredientId);
                          if (!ingredient) return null;
                          return (
                            <div key={link.ingredientId}>
                              <span>{ingredient.name}</span>
                              <button type="button" onClick={() => placeIngredient(link.ingredientId, "contains")}>In the item</button>
                              <button type="button" onClick={() => placeIngredient(link.ingredientId, "comes_with")}>With item</button>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </section>

                  <section className="easy-choice-section">
                    <header className="easy-section-heading">
                      <div>
                        <p className="composition-step-label">CUSTOMER CHOICES</p>
                        <h3>Does the customer make a choice?</h3>
                      </div>
                      <button className="button" data-variant="quiet" type="button" onClick={addChoiceGroup}><Plus aria-hidden="true" /> Add choice</button>
                    </header>

                    {choiceGroups.length === 0 ? (
                      <div className="easy-choice-empty">No customer choices for this item.</div>
                    ) : (
                      <div className="easy-choice-list">
                        {choiceGroups.map((group) => (
                          <article className="easy-choice-card" key={group.key}>
                            <div className="easy-choice-top">
                              <label>
                                <span>Choice name</span>
                                <input value={group.label} placeholder="Choose your bread" onChange={(event) => updateChoiceGroup(group.key, { label: event.target.value })} />
                              </label>
                              <button type="button" className="composition-remove" onClick={() => setChoiceGroups((current) => current.filter((candidate) => candidate.key !== group.key))}>Delete</button>
                            </div>

                            <div className="easy-choice-rules">
                              <button type="button" data-selected={group.minSelections === 1 && group.maxSelections === 1} onClick={() => updateChoiceGroup(group.key, { minSelections: 1, maxSelections: 1 })}>Choose one</button>
                              <button type="button" data-selected={group.minSelections === 0 && group.maxSelections === 1} onClick={() => updateChoiceGroup(group.key, { minSelections: 0, maxSelections: 1 })}>Optional</button>
                              <span>Served:</span>
                              <button type="button" data-selected={group.relationship === "contains"} onClick={() => updateChoiceGroup(group.key, { relationship: "contains" })}>In / on item</button>
                              <button type="button" data-selected={group.relationship === "comes_with"} onClick={() => updateChoiceGroup(group.key, { relationship: "comes_with" })}>With it</button>
                            </div>

                            <div className="easy-choice-options">
                              {group.options.map((option, optionIndex) => (
                                <div key={option.key}>
                                  <span>{optionIndex + 1}</span>
                                  <input value={option.label} placeholder="Option name" onChange={(event) => updateChoiceOption(group.key, option.key, { label: event.target.value })} />
                                  <select value={option.ingredientId ?? ""} onChange={(event) => updateChoiceOption(group.key, option.key, { ingredientId: event.target.value || null })}>
                                    <option value="">No ingredient</option>
                                    {catalog.ingredients.filter((ingredient) => ingredient.isActive).map((ingredient) => (
                                      <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                                    ))}
                                  </select>
                                  <label className="easy-choice-price">
                                    <span>+$</span>
                                    <input type="number" step="0.01" value={option.priceAdjustment} onChange={(event) => updateChoiceOption(group.key, option.key, { priceAdjustment: Number(event.target.value) })} />
                                  </label>
                                  <label className="easy-choice-confirm">
                                    <input type="checkbox" checked={option.priceAdjustmentConfigured} onChange={(event) => updateChoiceOption(group.key, option.key, { priceAdjustmentConfigured: event.target.checked })} />
                                    Price set
                                  </label>
                                  <label className="easy-choice-default">
                                    <input type="checkbox" checked={option.isDefault} onChange={(event) => updateChoiceOption(group.key, option.key, { isDefault: event.target.checked })} />
                                    Default
                                  </label>
                                  <button type="button" className="composition-remove" onClick={() => updateChoiceGroup(group.key, { options: group.options.filter((candidate) => candidate.key !== option.key) })}>Remove</button>
                                </div>
                              ))}
                            </div>
                            <button type="button" className="easy-add-option" onClick={() => addChoiceOption(group.key)}><Plus aria-hidden="true" /> Add option</button>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>

                </div>
              ) : (
                <>
                  <section className="composition-section composition-section--primary">
                <header className="composition-section-heading">
                  <div>
                    <p className="composition-step-label">A · BUILD THE PLATE</p>
                    <h3>What does the customer get?</h3>
                    <p>Add everything the customer normally gets.</p>
                  </div>
                  <strong className="composition-count">{ingredientLinks.length} added</strong>
                </header>

                <div className="composition-picker">
                  <MagnifyingGlass aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Search ingredients — turkey, rye, home fries…"
                    value={ingredientSearch}
                    onChange={(event) => setIngredientSearch(event.target.value)}
                  />
                </div>
                {ingredientSearch.trim() !== "" ? (
                  <div className="composition-picker-results">
                    {addableRecipeIngredients.length === 0 ? (
                      <p className="composition-empty-inline">Not found. Add it to Ingredients first.</p>
                    ) : addableRecipeIngredients.map((ingredient) => (
                      <button type="button" key={ingredient.id} onClick={() => addRecipeIngredient(ingredient)}>
                        <span><strong>{ingredient.name}</strong><small>{ingredient.kind.replace(/_/g, " ")}</small></span>
                        <Plus aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                ) : null}

                {ingredientLinks.length === 0 ? (
                  <div className="composition-empty-start">
                    <strong>Start here.</strong>
                    <span>Search above and add what the customer gets.</span>
                  </div>
                ) : (
                  <div className="composition-ingredient-list composition-ingredient-list--guided">
                    {ingredientLinks.map((link, index) => {
                      const ingredient = ingredientById.get(link.ingredientId);
                      if (!ingredient) return null;
                      const ingredientReplacements = replacements.filter(
                        (replacement) => replacement.sourceIngredientId === link.ingredientId,
                      );

                      return (
                        <article className="composition-ingredient-card" key={link.ingredientId}>
                          <header className="composition-ingredient-card-head">
                            <div>
                              <strong>{ingredient.name}</strong>
                              <span>{ingredient.kind.replace(/_/g, " ")}</span>
                            </div>
                            <button type="button" className="composition-remove" onClick={() => {
                              setIngredientLinks((current) => current.filter((_, position) => position !== index));
                              setReplacements((current) => current.filter((replacement) => replacement.sourceIngredientId !== link.ingredientId));
                            }}>Remove</button>
                          </header>

                          <div className="composition-required-grid">
                            <fieldset className="composition-question">
                              <legend>Where is it served?</legend>
                              <div className="composition-answer-row">
                                <button
                                  type="button"
                                  data-selected={link.relationship === "contains"}
                                  onClick={() => setIngredientLinks((current) => current.map((candidate) =>
                                    candidate.ingredientId === link.ingredientId
                                      ? { ...candidate, relationship: "contains" }
                                      : candidate,
                                  ))}
                                >In the item</button>
                                <button
                                  type="button"
                                  data-selected={link.relationship === "comes_with"}
                                  onClick={() => setIngredientLinks((current) => current.map((candidate) =>
                                    candidate.ingredientId === link.ingredientId
                                      ? { ...candidate, relationship: "comes_with" }
                                      : candidate,
                                  ))}
                                >Comes with it</button>
                              </div>
                            </fieldset>

                            <label className="composition-role-field">
                              <span>What is it used as?</span>
                              <select
                                value={link.contextualRole ?? ""}
                                onChange={(event) =>
                                  setIngredientLinks((current) => current.map((candidate) =>
                                    candidate.ingredientId === link.ingredientId
                                      ? { ...candidate, contextualRole: (event.target.value || null) as UniversalComponentRole | null }
                                      : candidate,
                                  ))
                                }
                              >
                                <option value="">Choose one…</option>
                                {UMO_ROLE_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <div className="composition-customer-controls">
                            <span className="composition-control-label">Customer can</span>
                            <label className="composition-toggle">
                              <input
                                type="checkbox"
                                checked={link.canRemove}
                                onChange={(event) => setIngredientLinks((current) => current.map((candidate) =>
                                  candidate.ingredientId === link.ingredientId ? { ...candidate, canRemove: event.target.checked } : candidate,
                                ))}
                              />
                              <span>Remove it</span>
                            </label>
                            <label className="composition-toggle">
                              <input
                                type="checkbox"
                                checked={link.canSide}
                                onChange={(event) => setIngredientLinks((current) => current.map((candidate) =>
                                  candidate.ingredientId === link.ingredientId ? { ...candidate, canSide: event.target.checked } : candidate,
                                ))}
                              />
                              <span>Get it on the side</span>
                            </label>
                            <label className="composition-toggle">
                              <input
                                type="checkbox"
                                checked={link.canExtra}
                                onChange={(event) => setIngredientLinks((current) => current.map((candidate) =>
                                  candidate.ingredientId === link.ingredientId ? { ...candidate, canExtra: event.target.checked } : candidate,
                                ))}
                              />
                              <span>Order extra</span>
                            </label>
                          </div>

                          {link.canExtra ? (
                            <div className="composition-inline-price">
                              <label>
                                <span>Price for extra</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={link.extraPrice}
                                  onChange={(event) => setIngredientLinks((current) => current.map((candidate) =>
                                    candidate.ingredientId === link.ingredientId ? { ...candidate, extraPrice: Number(event.target.value) } : candidate,
                                  ))}
                                />
                              </label>
                              <label className="composition-toggle composition-toggle--confirm">
                                <input
                                  type="checkbox"
                                  checked={link.extraPriceConfigured}
                                  onChange={(event) => setIngredientLinks((current) => current.map((candidate) =>
                                    candidate.ingredientId === link.ingredientId ? { ...candidate, extraPriceConfigured: event.target.checked } : candidate,
                                  ))}
                                />
                                <span>Price is correct, including $0</span>
                              </label>
                            </div>
                          ) : null}

                          <details className="composition-more">
                            <summary>Cooking & replacements <span>{link.preparationSchemeId || ingredientReplacements.length > 0 ? "Set" : "Optional"}</span></summary>
                            <div className="composition-more-body">
                              <label>
                                <span>How can it be prepared?</span>
                                <select
                                  value={link.preparationSchemeId ?? ""}
                                  onChange={(event) => setIngredientLinks((current) => current.map((candidate) =>
                                    candidate.ingredientId === link.ingredientId
                                      ? { ...candidate, preparationSchemeId: event.target.value || null }
                                      : candidate,
                                  ))}
                                >
                                  <option value="">No preparation options</option>
                                  {catalog.preparationSchemes.filter((scheme) => scheme.isActive).map((scheme) => (
                                    <option key={scheme.id} value={scheme.id}>{scheme.label}</option>
                                  ))}
                                </select>
                              </label>

                              <div className="composition-substitution-builder">
                                <label>
                                  <span>What can replace it?</span>
                                  <select
                                    value=""
                                    onChange={(event) => {
                                      addReplacement(link.ingredientId, event.target.value);
                                      event.currentTarget.value = "";
                                    }}
                                  >
                                    <option value="">Choose replacement…</option>
                                    {catalog.ingredients
                                      .filter((candidate) =>
                                        candidate.isActive &&
                                        !ingredientLinks.some((standard) => standard.ingredientId === candidate.id) &&
                                        !replacements.some((replacement) =>
                                          replacement.sourceIngredientId === link.ingredientId &&
                                          replacement.replacementIngredientId === candidate.id
                                        )
                                      )
                                      .sort((a, b) => a.name.localeCompare(b.name))
                                      .map((candidate) => (
                                        <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                                      ))}
                                  </select>
                                </label>

                                {ingredientReplacements.map((replacement) => {
                                  const target = ingredientById.get(replacement.replacementIngredientId);
                                  if (!target) return null;
                                  return (
                                    <div className="composition-substitution-row" key={replacement.replacementIngredientId}>
                                      <strong>{target.name}</strong>
                                      <label>
                                        <span>Preparation</span>
                                        <select
                                          value={replacement.preparationSchemeId ?? ""}
                                          onChange={(event) => updateReplacement(link.ingredientId, target.id, {
                                            preparationSchemeId: event.target.value || null,
                                          })}
                                        >
                                          <option value="">None</option>
                                          {catalog.preparationSchemes.filter((scheme) => scheme.isActive).map((scheme) => (
                                            <option key={scheme.id} value={scheme.id}>{scheme.label}</option>
                                          ))}
                                        </select>
                                      </label>
                                      <label>
                                        <span>Price difference</span>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={replacement.priceAdjustment}
                                          onChange={(event) => updateReplacement(link.ingredientId, target.id, {
                                            priceAdjustment: Number(event.target.value),
                                          })}
                                        />
                                      </label>
                                      <label className="composition-toggle composition-toggle--confirm">
                                        <input
                                          type="checkbox"
                                          checked={replacement.priceAdjustmentConfigured}
                                          onChange={(event) => updateReplacement(link.ingredientId, target.id, {
                                            priceAdjustmentConfigured: event.target.checked,
                                          })}
                                        />
                                        <span>Price is correct</span>
                                      </label>
                                      <button type="button" className="composition-remove" onClick={() => removeReplacement(link.ingredientId, target.id)}>Remove</button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </details>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="composition-section">
                <header className="composition-section-heading">
                  <div>
                    <p className="composition-step-label">B · CUSTOMER CHOICES</p>
                    <h3>What does the customer choose?</h3>
                    <p>Add a choice only when the customer must pick one or more options.</p>
                  </div>
                  <button className="button" data-variant="quiet" type="button" onClick={addChoiceGroup}>
                    <Plus aria-hidden="true" /> Add a choice
                  </button>
                </header>

                {choiceGroups.length === 0 ? (
                  <div className="composition-choice-empty">
                    <strong>No customer choices.</strong>
                    <span>That is fine if this item is sold exactly as defined above.</span>
                  </div>
                ) : (
                  <div className="choice-editor-list choice-editor-list--guided">
                    {choiceGroups.map((group, groupIndex) => (
                      <article className="choice-editor-group choice-editor-group--guided" key={group.key}>
                        <header className="choice-guided-head">
                          <strong>Choice {groupIndex + 1}</strong>
                          <button type="button" className="composition-remove" onClick={() => setChoiceGroups((current) => current.filter((candidate) => candidate.key !== group.key))}>Delete</button>
                        </header>

                        <div className="choice-guided-main">
                          <label className="choice-question-field">
                            <span>Question to ask</span>
                            <input value={group.label} placeholder="Example: Choose your bread" onChange={(event) => updateChoiceGroup(group.key, { label: event.target.value })} />
                          </label>

                          <fieldset className="composition-question">
                            <legend>Where does this choice go?</legend>
                            <div className="composition-answer-row">
                              <button type="button" data-selected={group.relationship === "contains"} onClick={() => updateChoiceGroup(group.key, { relationship: "contains" })}>In the item</button>
                              <button type="button" data-selected={group.relationship === "comes_with"} onClick={() => updateChoiceGroup(group.key, { relationship: "comes_with" })}>Comes with it</button>
                            </div>
                          </fieldset>

                          <div className="choice-rule-fields">
                            <label>
                              <span>At least</span>
                              <input type="number" min="0" step="1" value={group.minSelections} onChange={(event) => updateChoiceGroup(group.key, { minSelections: Number(event.target.value) })} />
                            </label>
                            <label>
                              <span>At most</span>
                              <input type="number" min="1" step="1" value={group.maxSelections ?? ""} placeholder="Required" onChange={(event) => updateChoiceGroup(group.key, { maxSelections: event.target.value === "" ? null : Number(event.target.value) })} />
                            </label>
                          </div>
                        </div>

                        <div className="choice-option-editor choice-option-editor--guided">
                          <div className="choice-options-label">OPTIONS</div>
                          {group.options.map((option, optionIndex) => (
                            <div className="choice-option-card" key={option.key}>
                              <span className="choice-option-number">{optionIndex + 1}</span>
                              <label>
                                <span>Option name</span>
                                <input value={option.label} placeholder="Example: Rye" onChange={(event) => updateChoiceOption(group.key, option.key, { label: event.target.value })} />
                              </label>
                              <label>
                                <span>Ingredient</span>
                                <select value={option.ingredientId ?? ""} onChange={(event) => updateChoiceOption(group.key, option.key, { ingredientId: event.target.value || null })}>
                                  <option value="">No ingredient</option>
                                  {catalog.ingredients.filter((ingredient) => ingredient.isActive).map((ingredient) => (
                                    <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                <span>Price difference</span>
                                <input type="number" step="0.01" value={option.priceAdjustment} onChange={(event) => updateChoiceOption(group.key, option.key, { priceAdjustment: Number(event.target.value) })} />
                              </label>
                              <label className="composition-toggle composition-toggle--confirm">
                                <input type="checkbox" checked={option.priceAdjustmentConfigured} onChange={(event) => updateChoiceOption(group.key, option.key, { priceAdjustmentConfigured: event.target.checked })} />
                                <span>Price is correct</span>
                              </label>
                              <label className="composition-toggle">
                                <input type="checkbox" checked={option.isDefault} onChange={(event) => updateChoiceOption(group.key, option.key, { isDefault: event.target.checked })} />
                                <span>Default</span>
                              </label>
                              <details className="choice-option-more">
                                <summary>More</summary>
                                <div>
                                  <label>
                                    <span>Preparation</span>
                                    <select value={option.preparationSchemeId ?? ""} onChange={(event) => updateChoiceOption(group.key, option.key, { preparationSchemeId: event.target.value || null })}>
                                      <option value="">No preparation</option>
                                      {catalog.preparationSchemes.filter((scheme) => scheme.isActive).map((scheme) => (
                                        <option key={scheme.id} value={scheme.id}>{scheme.label}</option>
                                      ))}
                                    </select>
                                  </label>
                                  <label className="composition-toggle">
                                    <input type="checkbox" checked={option.isNoneOption} onChange={(event) => updateChoiceOption(group.key, option.key, { isNoneOption: event.target.checked })} />
                                    <span>Customer can choose none</span>
                                  </label>
                                </div>
                              </details>
                              <button type="button" className="composition-remove" onClick={() => updateChoiceGroup(group.key, { options: group.options.filter((candidate) => candidate.key !== option.key) })}>Remove</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" className="choice-add-option choice-add-option--guided" onClick={() => addChoiceOption(group.key)}><Plus aria-hidden="true" /> Add another option</button>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="composition-section composition-section--review">
                <header className="composition-section-heading">
                  <div>
                    <p className="composition-step-label">C · READY TO PUBLISH</p>
                    <h3>{compositionReadinessIssues.length === 0 ? "This item is ready." : "Finish these first."}</h3>
                    <p>We check this item before it can appear in Order Entry or Kitchen.</p>
                  </div>
                  {compositionReadinessIssues.length === 0 ? <CheckCircle aria-hidden="true" className="composition-ready-icon" /> : <Warning aria-hidden="true" className="composition-warning-icon" />}
                </header>

                {compositionReadinessIssues.length > 0 ? (
                  <ol className="composition-checklist">
                    {compositionReadinessIssues.map((issue) => <li key={issue}>{issue}</li>)}
                  </ol>
                ) : (
                  <div className="composition-ready-message"><CheckCircle aria-hidden="true" /><span>Item setup is complete. Publish will make it available in Order Entry.</span></div>
                )}
              </section>

                </>
              )}

              <div className="composition-price-strip" data-configured={compositionPrice.trim() !== ""}>
                <div>
                  <strong>Selling price</strong>
                  <small>{compositionPrice.trim() === "" ? "You can save the draft without it." : "Price is set."}</small>
                </div>
                <label>
                  <span>$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Add before publish"
                    value={compositionPrice}
                    onChange={(event) => setCompositionPrice(event.target.value)}
                  />
                </label>
              </div>

              {compositionError ? <div className="notice notice--error">{compositionError}</div> : null}
            </div>

            <footer className="drawer-actions composition-actions composition-actions--guided">
              {compositionItem.status === "draft" ? (
                <>
                  <button className="button" data-variant="quiet" disabled={compositionSaving} type="button" onClick={() => void saveComposition(false)}>
                    {compositionSaving ? <SpinnerGap aria-hidden="true" className="spin" /> : null}
                    Save draft
                  </button>
                  <button
                    className="button"
                    data-variant="primary"
                    disabled={compositionSaving || compositionReadinessIssues.length > 0}
                    type="button"
                    onClick={() => void saveComposition(true)}
                  >
                    Publish item
                  </button>
                </>
              ) : (
                <button className="button" data-variant="primary" disabled={compositionSaving} type="button" onClick={() => void saveComposition(false)}>
                  {compositionSaving ? <SpinnerGap aria-hidden="true" className="spin" /> : null}
                  Save configuration
                </button>
              )}
              <button className="button" data-variant="quiet" disabled={compositionSaving} type="button" onClick={() => setCompositionItem(null)}>Close</button>
            </footer>
        </Drawer>
      ) : null}

      {ingredientLibraryOpen ? (
        <Drawer
          wide
          className="ingredient-library-drawer"
          ariaLabel="Ingredient library"
          eyebrow="Reusable data"
          title="Ingredient Library"
          description="Each ingredient exists once and can be linked to any menu item."
          onClose={() => setIngredientLibraryOpen(false)}
          headerAction={
            <button
              className="icon-button"
              type="button"
              aria-label="Close"
              onClick={() => setIngredientLibraryOpen(false)}
            >
              <X aria-hidden="true" />
            </button>
          }
        >

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
                <label>
                  <span>Type</span>
                  <select value={ingredientKind} onChange={(event) => setIngredientKind(event.target.value as IngredientKind)}>
                    {INGREDIENT_KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
                  </select>
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
                    Price is correct
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
        </Drawer>
      ) : null}
    </main>
  );
}
