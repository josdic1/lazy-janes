import { describe, expect, it } from "vitest";
import {
  ingredients,
  itemIngredients,
  itemModifierGroups,
  items,
  modifierGroups,
  modifiers,
} from "../src/data/menuData.js";

describe("normalized menu source", () => {
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
