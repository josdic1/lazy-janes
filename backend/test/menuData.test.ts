import { describe, expect, it } from "vitest";
import {
  ingredients,
  itemIngredients,
  itemModifierGroups,
  items,
  modifierGroups,
  modifiers,
} from "../src/db/menuImport/menuData.js";
import { buildMenuOntology } from "../src/db/menuImport/menuOntology.js";

describe("legacy menu import snapshot", () => {
  it("contains one stable source record for every Lazy Jane's menu item", () => {
    expect(items).toHaveLength(427);
    expect(new Set(items.map((item) => item.id)).size).toBe(427);
    expect(items.filter((item) => item.isKids)).toHaveLength(9);
  });

  it("contains no dangling normalized relationships", () => {
    const itemIds = new Set(items.map((item) => item.id));
    const ingredientIds = new Set(ingredients.map((ingredient) => ingredient.id));
    const groupIds = new Set(modifierGroups.map((group) => group.id));

    expect(itemIngredients.every((link) => itemIds.has(link.itemId))).toBe(true);
    expect(itemIngredients.every((link) => ingredientIds.has(link.ingredientId))).toBe(true);
    expect(itemModifierGroups.every((link) => itemIds.has(link.itemId))).toBe(true);
    expect(itemModifierGroups.every((link) => groupIds.has(link.modifierGroupId))).toBe(true);
    expect(modifiers.every((modifier) => groupIds.has(modifier.modifierGroupId))).toBe(true);
  });
});

describe("legacy import ontology", () => {
  it("keeps Sliced Steak & Eggs defaults as components without duplicate choice slots", () => {
    const ontology = buildMenuOntology();
    const ingredientNames = new Map(
      ingredients.map((ingredient) => [ingredient.id, ingredient.name]),
    );
    const prepKind = (sourceKey: string | null) =>
      ontology.preparationSchemes.find((scheme) => scheme.sourceKey === sourceKey)?.kind ?? null;

    const components = ontology.componentRules
      .filter((component) => component.itemId === "sliced_steak_eggs")
      .map((component) => ({
        name: ingredientNames.get(component.ingredientId),
        role: component.role,
        prep: prepKind(component.preparationSourceKey),
      }));
    expect(components).toEqual([
      { name: "Steak", role: "protein", prep: "meat_cook" },
      { name: "Egg", role: "egg", prep: "egg_cook" },
      { name: "Home Fries", role: "side", prep: null },
      { name: "Toast", role: "bread", prep: "bread_prep" },
    ]);

    const slots = ontology.choiceSlots
      .filter((slot) => slot.itemId === "sliced_steak_eggs")
      .map((slot) => ({
        role: slot.role,
        options: slot.options.map((option) => ({
          name: option.ingredientId ? ingredientNames.get(option.ingredientId) : "None",
          prep: prepKind(option.preparationSourceKey),
          default: option.isDefault,
        })),
      }));

    expect(slots).toEqual([]);
  });

  it("keeps Cobb Salad ingredients as components instead of inventing a protein choice", () => {
    const ontology = buildMenuOntology();
    const ingredientNames = new Map(
      ingredients.map((ingredient) => [ingredient.id, ingredient.name]),
    );

    const components = ontology.componentRules
      .filter((component) => component.itemId === "cobb_salad_dinner")
      .map((component) => [
        ingredientNames.get(component.ingredientId),
        component.role,
      ]);

    expect(components).toEqual([
      ["Grilled Chicken", "protein"],
      ["Bacon", "protein"],
      ["Egg", "egg"],
      ["Tomato", "veggie"],
      ["Avocado", "veggie"],
      ["Blue Cheese", "cheese"],
      ["Tortilla Shell", "bread"],
    ]);

    expect(
      ontology.choiceSlots.filter((slot) => slot.itemId === "cobb_salad_dinner"),
    ).toEqual([]);
  });

  it("keeps explicit alternatives as real choice slots", () => {
    const ontology = buildMenuOntology();
    const proteinSlot = ontology.choiceSlots.find(
      (slot) =>
        slot.itemId === "turkey_or_chicken_meatloaf_sandwich" &&
        slot.role === "protein",
    );

    expect(proteinSlot?.options.map((option) => option.label)).toEqual([
      "Turkey Meatloaf",
      "Chicken Meatloaf",
      "None",
    ]);
    expect(proteinSlot?.options.some((option) => option.isDefault)).toBe(false);

    const fixedIngredients = new Set(
      ontology.componentRules
        .filter((component) => component.itemId === "turkey_or_chicken_meatloaf_sandwich")
        .map((component) => component.ingredientId),
    );
    expect(
      proteinSlot?.options
        .filter((option) => option.ingredientId !== null)
        .some((option) => fixedIngredients.has(option.ingredientId!)),
    ).toBe(false);
  });

  it("does not attach steak temperature behavior to proteins that do not support it", () => {
    const ontology = buildMenuOntology();
    const ingredientNames = new Map(
      ingredients.map((ingredient) => [ingredient.id, ingredient.name]),
    );
    const turkey = ontology.componentRules.find(
      (component) =>
        component.itemId === "char_grilled_turkey_steak" &&
        ingredientNames.get(component.ingredientId) === "Turkey",
    );
    const bacon = ontology.componentRules.find(
      (component) =>
        component.itemId === "bacon_burger_regular" &&
        ingredientNames.get(component.ingredientId) === "Bacon",
    );

    expect(turkey?.preparationSourceKey).toBeNull();
    expect(bacon?.preparationSourceKey).toBeNull();
  });

  it("never attaches an ambiguous role-level prep scheme to multiple standard components", () => {
    const ontology = buildMenuOntology();
    const componentsByItemRole = new Map<string, typeof ontology.componentRules>();

    for (const component of ontology.componentRules) {
      const key = `${component.itemId}|${component.role}`;
      const current = componentsByItemRole.get(key) ?? [];
      current.push(component);
      componentsByItemRole.set(key, current);
    }

    for (const components of componentsByItemRole.values()) {
      if (components.length > 1) {
        expect(components.filter((component) => component.preparationSourceKey !== null)).toHaveLength(0);
      }
    }
  });

  it("resolves source-proven choice foods to real component identities", () => {
    const ontology = buildMenuOntology();

    const optionIngredientId = (
      itemId: string,
      slotLabel: string,
      optionLabel: string,
    ) =>
      ontology.choiceSlots
        .find((slot) => slot.itemId === itemId && slot.label === slotLabel)
        ?.options.find((option) => option.label === optionLabel)
        ?.ingredientId;

    expect(optionIngredientId("steak_sandwich", "Side", "onion rings"))
      .toBe("ING_ONION_RINGS");
    expect(
      optionIngredientId(
        "kids_kids_korner_chicken_fingers",
        "Dessert",
        "Ice Cream",
      ),
    ).toBe("ING_ICE_CREAM");
    expect(
      optionIngredientId(
        "turkey_or_veggie_or_chicken_burger_regular",
        "Protein",
        "Veggie Burger",
      ),
    ).toBe("ING_VEGGIE_BURGER");
    expect(optionIngredientId("linguini", "Choose Sauce", "White Clam Sauce"))
      .toBe("ING_WHITE_CLAM_SAUCE");
    expect(optionIngredientId("linguini", "Choose Sauce", "Red Clam Sauce"))
      .toBe("ING_RED_CLAM_SAUCE");
    expect(
      optionIngredientId(
        "homemade_potato_salad_or_homemade_cole_slaw",
        "Side",
        "Choose Side: Potato Salad",
      ),
    ).toBe("ING_POTATO_SALAD");
    expect(
      optionIngredientId(
        "blueberry_muffin_or_apple_cinnamon_muffin",
        "Choose Muffin",
        "Blueberry Muffin",
      ),
    ).toBe("ING_BLUEBERRY_MUFFIN");
    expect(
      optionIngredientId(
        "challah_french_toast_plain_or_raisin",
        "Choose Challah",
        "Plain",
      ),
    ).toBe("ING_PLAIN_CHALLAH");
    expect(
      optionIngredientId(
        "fresh_ground_coffee_regular_or_decaf",
        "Choose Coffee",
        "Regular",
      ),
    ).toBe("ING_REGULAR_COFFEE");
    expect(
      optionIngredientId(
        "iced_coffee_or_iced_decaffeinated",
        "Choose Coffee",
        "Iced Decaf",
      ),
    ).toBe("ING_DECAF_COFFEE");
  });

  it("preserves source-proven variant price adjustments", () => {
    const ontology = buildMenuOntology();

    const option = (itemId: string, slotLabel: string, optionLabel: string) =>
      ontology.choiceSlots
        .find((slot) => slot.itemId === itemId && slot.label === slotLabel)
        ?.options.find((candidate) => candidate.label === optionLabel);

    expect(option("blueberry_pancakes", "Choose Size", "Full Stack"))
      .toMatchObject({ priceAdjustment: 0, priceConfigured: true });
    expect(option("blueberry_pancakes", "Choose Size", "Short Stack"))
      .toMatchObject({ priceAdjustment: -2, priceConfigured: true });
    expect(option("chocolate_chip_pancakes", "Choose Size", "Short Stack"))
      .toMatchObject({ priceAdjustment: -2.55, priceConfigured: true });
    expect(option("apple_cherry_or_blueberry_crumb_pie", "Choose Pie", "Apple"))
      .toMatchObject({ priceAdjustment: 0, priceConfigured: true });
  });

  it("keeps variant/preparation labels from becoming fake components", () => {
    const ontology = buildMenuOntology();

    const optionIds = (itemId: string, slotLabel: string) =>
      ontology.choiceSlots
        .find((slot) => slot.itemId === itemId && slot.label === slotLabel)
        ?.options.map((option) => [option.label, option.ingredientId]);

    expect(optionIds("blueberry_pancakes", "Choose Size")).toEqual([
      ["Full Stack", null],
      ["Short Stack", null],
    ]);
    expect(optionIds("broiled_or_fried_combo_platter", "Preparation")).toEqual([
      ["Broiled", null],
      ["Fried", null],
    ]);
    expect(
      optionIds("linguini_ala_ritz_spicy_or_mild", "Choose Heat"),
    ).toEqual([
      ["Mild", null],
      ["Spicy", null],
    ]);
    expect(
      optionIds("apple_cherry_or_blueberry_crumb_pie", "Choose Pie"),
    ).toEqual([
      ["Apple", null],
      ["Cherry", null],
      ["Blueberry", null],
    ]);
  });
  it("maps source-proven whole-offering preparation choices", () => {
    const ontology = buildMenuOntology();

    const preparationTarget = (
      itemId: string,
      slotLabel: string,
      optionLabel: string,
    ) =>
      ontology.choiceSlots
        .find((slot) => slot.itemId === itemId && slot.label === slotLabel)
        ?.options.find((option) => option.label === optionLabel);

    expect(
      preparationTarget(
        "broiled_or_fried_combo_platter",
        "Preparation",
        "Broiled",
      ),
    ).toMatchObject({
      ingredientId: null,
      targetPreparationSourceKey: "prep_other_broiled_fried",
      targetPreparationOptionLabel: "Broiled",
      priceAdjustment: 0,
      priceConfigured: true,
    });

    expect(
      preparationTarget(
        "linguini_ala_ritz_spicy_or_mild",
        "Choose Heat",
        "Spicy",
      ),
    ).toMatchObject({
      ingredientId: null,
      targetPreparationSourceKey: "prep_other_mild_spicy",
      targetPreparationOptionLabel: "Spicy",
      priceAdjustment: 0,
      priceConfigured: true,
    });
  });

});
