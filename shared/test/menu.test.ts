import { describe, expect, it } from "vitest";
import {
  ALLERGEN_FLAGS,
  MENU_ITEM_STATUSES,
  createIngredientInputSchema,
  createMenuItemInputSchema,
  menuItemStatusSchema,
  replaceMenuItemCustomizationInputSchema,
  updateMenuItemInputSchema,
} from "../src/index.js";

const categoryId =
  "0a5a7d9a-628b-4ca7-9a62-8b5f4c0d72fe";
const ingredientId =
  "7ab6fa2b-7ef6-4292-9639-390068e0f87e";

describe("menu contract", () => {
  it("accepts every menu-item status", () => {
    for (const status of MENU_ITEM_STATUSES) {
      expect(menuItemStatusSchema.parse(status)).toBe(status);
    }
  });

  it("applies defaults to a normal menu item", () => {
    expect(
      createMenuItemInputSchema.parse({
        name: "French Onion Soup",
        categoryId,
        price: 6.5,
      }),
    ).toEqual({
      parentItemId: null,
      name: "French Onion Soup",
      description: null,
      categoryId,
      price: 6.5,
      status: "available",
      isSpecial: false,
      isModifier: false,
      dietaryFlags: [],
      safetyDeclarations: [],
      sortOrder: 0,
    });
  });

  it("keeps intrinsic allergens on ingredients", () => {
    expect(ALLERGEN_FLAGS).toContain("shellfish");
    const shrimp = createIngredientInputSchema.parse({
      name: "Shrimp",
      allergenFlags: ["shellfish"],
    });

    expect(shrimp.allergenFlags).toEqual(["shellfish"]);
    expect(shrimp.isAddable).toBe(false);
    expect(shrimp.defaultAddPrice).toBe(0);
    expect(shrimp.addPriceConfigured).toBe(false);
  });

  it("keeps item-level safety declarations explicit", () => {
    const item = createMenuItemInputSchema.parse({
      name: "Fried Shrimp",
      categoryId,
      price: 12,
      safetyDeclarations: [
        {
          kind: "cross_contact",
          allergenFlag: "wheat",
        },
        {
          kind: "shared_fryer",
        },
      ],
    });

    expect(item.safetyDeclarations).toEqual([
      expect.objectContaining({
        kind: "cross_contact",
        allergenFlag: "wheat",
      }),
      expect.objectContaining({
        kind: "shared_fryer",
        allergenFlag: null,
      }),
    ]);
  });

  it("rejects legacy modifier menu items", () => {
    expect(
      createMenuItemInputSchema.safeParse({
        name: "Add Swiss",
        categoryId,
        price: 1,
        isModifier: true,
      }).success,
    ).toBe(false);
  });

  it("requires at least one update field", () => {
    expect(updateMenuItemInputSchema.safeParse({}).success).toBe(false);
  });

  it("does not allow one ingredient twice on the same recipe", () => {
    expect(
      replaceMenuItemCustomizationInputSchema.safeParse({
        ingredients: [
          { ingredientId },
          { ingredientId },
        ],
        choiceGroups: [],
      }).success,
    ).toBe(false);
  });

  it("does not allow duplicate choices in one group", () => {
    expect(
      replaceMenuItemCustomizationInputSchema.safeParse({
        ingredients: [],
        choiceGroups: [
          {
            label: "Choose protein",
            minSelections: 1,
            maxSelections: 1,
            options: [
              { label: "Chicken", ingredientId },
              { label: "Chicken", ingredientId: null },
            ],
          },
        ],
      }).success,
    ).toBe(false);
  });
});
