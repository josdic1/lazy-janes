import type {
  AllergenFlag,
  ComponentRelationship,
  ComponentRole,
  Ingredient,
  IngredientKind,
  MenuChoiceConstraint,
  MenuChoiceGroup,
  MenuCustomizationCatalog,
  MenuItemIngredient,
  MenuItemIngredientReplacement,
  PreparationKind,
  PreparationScheme,
  UniversalComponentRole,
} from "@lazy-janes/shared";
import { pool } from "./db/pool.js";

type IngredientRow = {
  id: string;
  name: string;
  kind: IngredientKind;
  is_active: boolean;
  is_addable: boolean;
  default_add_price: string;
  add_price_configured: boolean;
  allergen_flags: AllergenFlag[];
  sort_order: number;
};

type ItemIngredientRow = {
  menu_item_id: string;
  ingredient_id: string;
  ingredient_name: string;
  ingredient_kind: IngredientKind;
  role: ComponentRole;
  contextual_role: UniversalComponentRole | null;
  relationship: ComponentRelationship | null;
  preparation_scheme_id: string | null;
  allergen_flags: AllergenFlag[];
  can_remove: boolean;
  can_side: boolean;
  can_extra: boolean;
  can_replace: boolean;
  replacement_options_configured: boolean;
  extra_price: string;
  extra_price_configured: boolean;
  sort_order: number;
};

type ItemAdditionRow = {
  menu_item_id: string;
  ingredient_id: string;
  sort_order: number;
  is_active: boolean;
};

type ItemIngredientReplacementRow = {
  menu_item_id: string;
  source_ingredient_id: string;
  replacement_ingredient_id: string;
  replacement_ingredient_name: string;
  replacement_ingredient_kind: IngredientKind;
  preparation_scheme_id: string | null;
  price_adjustment: string;
  price_adjustment_configured: boolean;
  sort_order: number;
};

type ChoiceRow = {
  group_id: string;
  menu_item_id: string;
  group_label: string;
  group_role: ComponentRole;
  group_relationship: ComponentRelationship | null;
  min_selections: number;
  max_selections: number | null;
  group_sort_order: number;
  group_is_active: boolean;
  option_id: string | null;
  option_label: string | null;
  ingredient_id: string | null;
  preparation_scheme_id: string | null;
  target_preparation_option_id: string | null;
  is_none_option: boolean | null;
  price_adjustment: string | null;
  price_adjustment_configured: boolean | null;
  option_sort_order: number | null;
  is_default: boolean | null;
  option_is_active: boolean | null;
};

type MenuChoiceConstraintRow = {
  id: string;
  menu_item_id: string;
  source_choice_group_id: string;
  source_choice_option_id: string;
  target_choice_group_id: string;
  min_selections: number | null;
  max_selections: number | null;
  label: string | null;
  sort_order: number;
  is_active: boolean;
};

type PreparationSchemeRow = {
  id: string;
  source_key: string;
  label: string;
  kind: PreparationKind;
  sort_order: number;
  is_active: boolean;
};

type PreparationOptionRow = {
  id: string;
  preparation_scheme_id: string;
  label: string;
  sort_order: number;
  is_default: boolean;
  is_active: boolean;
};

function toMenuChoiceConstraint(
  row: MenuChoiceConstraintRow,
): MenuChoiceConstraint {
  return {
    id: row.id,
    menuItemId: row.menu_item_id,
    sourceChoiceGroupId: row.source_choice_group_id,
    sourceChoiceOptionId: row.source_choice_option_id,
    targetChoiceGroupId: row.target_choice_group_id,
    minSelections: row.min_selections,
    maxSelections: row.max_selections,
    label: row.label,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function toIngredient(row: IngredientRow): Ingredient {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    isActive: row.is_active,
    isAddable: row.is_addable,
    defaultAddPrice: Number(row.default_add_price),
    addPriceConfigured: row.add_price_configured,
    allergenFlags: row.allergen_flags,
    sortOrder: row.sort_order,
  };
}

function toItemIngredient(
  row: ItemIngredientRow,
): MenuItemIngredient {
  return {
    menuItemId: row.menu_item_id,
    ingredientId: row.ingredient_id,
    ingredientName: row.ingredient_name,
    ingredientKind: row.ingredient_kind,
    role: row.role,
    contextualRole: row.contextual_role,
    relationship: row.relationship,
    preparationSchemeId: row.preparation_scheme_id,
    allergenFlags: row.allergen_flags,
    canRemove: row.can_remove,
    canSide: row.can_side,
    canExtra: row.can_extra,
    canReplace: row.can_replace,
    replacementOptionsConfigured: row.replacement_options_configured,
    extraPrice: Number(row.extra_price),
    extraPriceConfigured: row.extra_price_configured,
    sortOrder: row.sort_order,
  };
}

function toItemIngredientReplacement(
  row: ItemIngredientReplacementRow,
): MenuItemIngredientReplacement {
  return {
    menuItemId: row.menu_item_id,
    sourceIngredientId: row.source_ingredient_id,
    replacementIngredientId: row.replacement_ingredient_id,
    replacementIngredientName: row.replacement_ingredient_name,
    replacementIngredientKind: row.replacement_ingredient_kind,
    preparationSchemeId: row.preparation_scheme_id,
    priceAdjustment: Number(row.price_adjustment),
    priceAdjustmentConfigured: row.price_adjustment_configured,
    sortOrder: row.sort_order,
  };
}

function toChoiceGroups(rows: ChoiceRow[]): MenuChoiceGroup[] {
  const groups = new Map<string, MenuChoiceGroup>();

  for (const row of rows) {
    let group = groups.get(row.group_id);

    if (!group) {
      group = {
        id: row.group_id,
        menuItemId: row.menu_item_id,
        label: row.group_label,
        role: row.group_role,
        relationship: row.group_relationship,
        minSelections: row.min_selections,
        maxSelections: row.max_selections,
        sortOrder: row.group_sort_order,
        isActive: row.group_is_active,
        options: [],
      };
      groups.set(row.group_id, group);
    }

    if (
      row.option_id &&
      row.option_label !== null &&
      row.price_adjustment !== null &&
      row.option_sort_order !== null &&
      row.is_default !== null &&
      row.option_is_active !== null
    ) {
      group.options.push({
        id: row.option_id,
        choiceGroupId: row.group_id,
        label: row.option_label,
        ingredientId: row.ingredient_id,
        preparationSchemeId: row.preparation_scheme_id,
        targetPreparationOptionId: row.target_preparation_option_id,
        isNoneOption: row.is_none_option ?? false,
        priceAdjustment: Number(row.price_adjustment),
        priceAdjustmentConfigured: row.price_adjustment_configured ?? false,
        sortOrder: row.option_sort_order,
        isDefault: row.is_default,
        isActive: row.option_is_active,
      });
    }
  }

  return Array.from(groups.values());
}

export async function getCustomizationCatalog(): Promise<MenuCustomizationCatalog> {
  const [
    ingredientResult,
    itemIngredientResult,
    itemAdditionResult,
    replacementResult,
    choiceResult,
    choiceConstraintResult,
    preparationSchemeResult,
    preparationOptionResult,
  ] = await Promise.all([
    pool.query<IngredientRow>(`
      SELECT
        id,
        name,
        kind,
        is_active,
        is_addable,
        default_add_price,
        add_price_configured,
        allergen_flags,
        sort_order
      FROM ingredients
      ORDER BY sort_order, lower(name), id
    `),
    pool.query<ItemIngredientRow>(`
      SELECT
        link.menu_item_id,
        ingredient.id AS ingredient_id,
        ingredient.name AS ingredient_name,
        ingredient.kind AS ingredient_kind,
        link.role,
        link.umo_role AS contextual_role,
        link.relationship,
        link.preparation_scheme_id,
        ingredient.allergen_flags,
        link.can_remove,
        link.can_side,
        link.can_extra,
        link.can_replace,
        link.replacement_options_configured,
        link.extra_price,
        link.extra_price_configured,
        link.sort_order
      FROM menu_item_ingredients link
      JOIN ingredients ingredient
        ON ingredient.id = link.ingredient_id
      ORDER BY
        link.menu_item_id,
        link.sort_order,
        lower(ingredient.name)
    `),
    pool.query<ItemAdditionRow>(`
      SELECT
        menu_item_id,
        ingredient_id,
        sort_order,
        is_active
      FROM menu_item_additions
      ORDER BY menu_item_id, sort_order, ingredient_id
    `),
    pool.query<ItemIngredientReplacementRow>(`
      SELECT
        replacement.menu_item_id,
        replacement.source_ingredient_id,
        ingredient.id AS replacement_ingredient_id,
        ingredient.name AS replacement_ingredient_name,
        ingredient.kind AS replacement_ingredient_kind,
        replacement.preparation_scheme_id,
        replacement.price_adjustment,
        replacement.price_adjustment_configured,
        replacement.sort_order
      FROM menu_item_ingredient_replacements replacement
      JOIN ingredients ingredient
        ON ingredient.id = replacement.replacement_ingredient_id
      ORDER BY
        replacement.menu_item_id,
        replacement.source_ingredient_id,
        replacement.sort_order,
        lower(ingredient.name)
    `),
    pool.query<ChoiceRow>(`
      SELECT
        group_record.id AS group_id,
        group_record.menu_item_id,
        group_record.label AS group_label,
        group_record.role AS group_role,
        group_record.relationship AS group_relationship,
        group_record.min_selections,
        group_record.max_selections,
        group_record.sort_order AS group_sort_order,
        group_record.is_active AS group_is_active,
        option_record.id AS option_id,
        option_record.label AS option_label,
        option_record.ingredient_id,
        option_record.preparation_scheme_id,
        option_record.target_preparation_option_id,
        option_record.is_none_option,
        option_record.price_adjustment,
        option_record.price_adjustment_configured,
        option_record.sort_order AS option_sort_order,
        option_record.is_default,
        option_record.is_active AS option_is_active
      FROM menu_choice_groups group_record
      LEFT JOIN menu_choice_options option_record
        ON option_record.choice_group_id = group_record.id
      ORDER BY
        group_record.menu_item_id,
        group_record.sort_order,
        group_record.label,
        option_record.sort_order,
        option_record.label
    `),
    pool.query<MenuChoiceConstraintRow>(`
      SELECT
        id,
        menu_item_id,
        source_choice_group_id,
        source_choice_option_id,
        target_choice_group_id,
        min_selections,
        max_selections,
        label,
        sort_order,
        is_active
      FROM menu_choice_constraints
      WHERE is_active = true
      ORDER BY menu_item_id, sort_order, id
    `),
    pool.query<PreparationSchemeRow>(`
      SELECT id, source_key, label, kind, sort_order, is_active
      FROM preparation_schemes
      ORDER BY sort_order, label, id
    `),
    pool.query<PreparationOptionRow>(`
      SELECT
        id,
        preparation_scheme_id,
        label,
        sort_order,
        is_default,
        is_active
      FROM preparation_options
      ORDER BY preparation_scheme_id, sort_order, label, id
    `),
  ]);

  const preparationOptionsByScheme = new Map<string, PreparationOptionRow[]>();
  for (const option of preparationOptionResult.rows) {
    const current = preparationOptionsByScheme.get(option.preparation_scheme_id) ?? [];
    current.push(option);
    preparationOptionsByScheme.set(option.preparation_scheme_id, current);
  }

  const preparationSchemes: PreparationScheme[] = preparationSchemeResult.rows.map((scheme) => ({
    id: scheme.id,
    sourceKey: scheme.source_key,
    label: scheme.label,
    kind: scheme.kind,
    sortOrder: scheme.sort_order,
    isActive: scheme.is_active,
    options: (preparationOptionsByScheme.get(scheme.id) ?? []).map((option) => ({
      id: option.id,
      preparationSchemeId: option.preparation_scheme_id,
      label: option.label,
      sortOrder: option.sort_order,
      isDefault: option.is_default,
      isActive: option.is_active,
    })),
  }));

  return {
    ingredients: ingredientResult.rows.map(toIngredient),
    preparationSchemes,
    itemIngredients: itemIngredientResult.rows.map(toItemIngredient),
    itemAdditions: itemAdditionResult.rows.map((row) => ({
      menuItemId: row.menu_item_id,
      ingredientId: row.ingredient_id,
      sortOrder: row.sort_order,
      isActive: row.is_active,
    })),
    replacements: replacementResult.rows.map(toItemIngredientReplacement),
    choiceGroups: toChoiceGroups(choiceResult.rows),
    choiceConstraints: choiceConstraintResult.rows.map(toMenuChoiceConstraint),
  };
}
