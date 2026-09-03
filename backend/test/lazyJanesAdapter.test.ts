import { describe, expect, it } from "vitest";

import type {
  MenuCustomizationCatalog,
  MenuItem,
} from "@lazy-janes/shared";
import { normalizeLazyJanesOffering } from "../src/menuNormalization/lazyJanesAdapter.js";

function catalogWithChoice(
  option: {
    id: string;
    label: string;
    ingredientId: string | null;
    isNoneOption?: boolean;
    preparationSchemeId?: string | null;
    targetPreparationOptionId?: string | null;
  },
): MenuCustomizationCatalog {
  return {
    ingredients: [],
    preparationSchemes: [],
    itemIngredients: [],
    replacements: [],
    choiceConstraints: [],
    choiceGroups: [
      {
        id: "starter",
        menuItemId: "item-1",
        label: "Starter",
        role: "other",
        relationship: null,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 10,
        isActive: true,
        options: [
          {
            id: option.id,
            choiceGroupId: "starter",
            label: option.label,
            ingredientId: option.ingredientId,
            preparationSchemeId: option.preparationSchemeId ?? null,
            targetPreparationOptionId:
              option.targetPreparationOptionId ?? null,
            isNoneOption: option.isNoneOption ?? false,
            priceAdjustment: 0,
            priceAdjustmentConfigured: false,
            sortOrder: 10,
            isDefault: false,
            isActive: true,
          },
        ],
      },
    ],
  };
}

const item = {
  id: "item-1",
  name: "Test Entrée",
  status: "available",
} as MenuItem;

describe("Lazy Jane's UMO adapter", () => {
  it("preserves an unresolved source choice as an explicit unknown target", () => {
    const offering = normalizeLazyJanesOffering({
      item,
      catalog: catalogWithChoice({
        id: "soup",
        label: "Soup",
        ingredientId: null,
      }),
    });

    expect(offering.choices[0]?.options[0]).toMatchObject({
      id: "soup",
      label: "Soup",
      target: { kind: "unknown" },
      evidence: { state: "unknown" },
    });
  });

  it("carries choice preparation through UMO without the legacy UI shape", () => {
    const catalog = catalogWithChoice({
      id: "burger-temperature",
      label: "Burger",
      ingredientId: null,
      preparationSchemeId: "temperature",
    });

    catalog.preparationSchemes = [
      {
        id: "temperature",
        label: "Temperature",
        isActive: true,
        sortOrder: 10,
        options: [
          {
            id: "medium",
            preparationSchemeId: "temperature",
            label: "Medium",
            sortOrder: 10,
            isDefault: true,
            isActive: true,
          },
        ],
      },
    ];

    const offering = normalizeLazyJanesOffering({ item, catalog });

    expect(offering.preparations.map((scheme) => scheme.id)).toContain(
      "temperature",
    );
    expect(offering.choices[0]?.options[0]?.preparationSchemeId).toBe(
      "temperature",
    );
  });

  it("maps source-proven size choices to a structural variant", () => {
    const catalog = catalogWithChoice({
      id: "full-stack",
      label: "Full Stack",
      ingredientId: null,
    });

    catalog.choiceGroups[0] = {
      ...catalog.choiceGroups[0]!,
      label: "Choose Size",
      options: [
        {
          ...catalog.choiceGroups[0]!.options[0]!,
          id: "full-stack",
          label: "Full Stack",
          priceAdjustment: 0,
          priceAdjustmentConfigured: true,
          sortOrder: 10,
        },
        {
          ...catalog.choiceGroups[0]!.options[0]!,
          id: "short-stack",
          label: "Short Stack",
          priceAdjustment: -2,
          priceAdjustmentConfigured: true,
          sortOrder: 20,
        },
      ],
    };

    const offering = normalizeLazyJanesOffering({
      item: {
        ...item,
        sourceKey: "blueberry_pancakes",
      },
      catalog,
    });

    expect(offering.choices).toEqual([]);
    expect(offering.variants).toEqual([
      expect.objectContaining({
        id: "starter",
        label: "Size",
        selectionRequired: true,
        options: [
          expect.objectContaining({ id: "full-stack", label: "Full Stack" }),
          expect.objectContaining({ id: "short-stack", label: "Short Stack" }),
        ],
      }),
    ]);
    expect(offering.commercialPolicies).toContainEqual(
      expect.objectContaining({
        kind: "price",
        appliesTo: {
          kind: "variant_option",
          variantId: "starter",
          optionId: "short-stack",
        },
        amount: -2,
        configured: true,
      }),
    );
  });

  it("maps source-proven preparation choices to preparation targets", () => {
    const catalog = catalogWithChoice({
      id: "broiled",
      label: "Broiled",
      ingredientId: null,
      targetPreparationOptionId: "broiled-option",
    });

    catalog.choiceGroups[0] = {
      ...catalog.choiceGroups[0]!,
      label: "Preparation",
    };
    catalog.preparationSchemes = [
      {
        id: "cook-method",
        sourceKey: "prep_other_broiled_fried",
        label: "Preparation",
        kind: "other",
        isActive: true,
        sortOrder: 10,
        options: [
          {
            id: "broiled-option",
            preparationSchemeId: "cook-method",
            label: "Broiled",
            sortOrder: 10,
            isDefault: false,
            isActive: true,
          },
          {
            id: "fried-option",
            preparationSchemeId: "cook-method",
            label: "Fried",
            sortOrder: 20,
            isDefault: false,
            isActive: true,
          },
        ],
      },
    ];

    const offering = normalizeLazyJanesOffering({ item, catalog });

    expect(offering.preparations).toEqual([
      expect.objectContaining({
        id: "cook-method",
        label: "Preparation",
      }),
    ]);
    expect(offering.choices[0]?.options[0]?.target).toEqual({
      kind: "preparation",
      preparationSchemeId: "cook-method",
      preparationOptionId: "broiled-option",
    });
  });

  it("maps explicit item additions to a UMO AddCatalog", () => {
    const catalog: MenuCustomizationCatalog = {
      ingredients: [
        {
          id: "bacon",
          name: "Bacon",
          kind: "protein",
          isActive: true,
          isAddable: true,
          defaultAddPrice: 0,
          addPriceConfigured: false,
          allergenFlags: [],
          sortOrder: 10,
        },
      ],
      preparationSchemes: [],
      itemIngredients: [],
      itemAdditions: [
        {
          menuItemId: "item-1",
          ingredientId: "bacon",
          sortOrder: 10,
          isActive: true,
        },
      ],
      replacements: [],
      choiceConstraints: [],
      choiceGroups: [],
    };

    const offering = normalizeLazyJanesOffering({ item, catalog });

    expect(offering.addCatalogs).toEqual([
      {
        id: "item-1:allowed-additions",
        label: "Allowed additions",
        options: [
          {
            id: "item-1:add:bacon",
            component: {
              componentId: "bacon",
              label: "Bacon",
            },
          },
        ],
      },
    ]);

    const withoutPermission = normalizeLazyJanesOffering({
      item,
      catalog: {
        ...catalog,
        itemAdditions: [],
      },
    });

    expect(withoutPermission.addCatalogs).toEqual([]);
  });

});
