import { describe, expect, it } from "vitest";
import {
  MENU_ITEM_STATUSES,
  createMenuItemInputSchema,
  menuItemStatusSchema,
  updateMenuItemInputSchema,
} from "../src/index.js";

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
        category: "Soups",
        price: 6.5,
      }),
    ).toEqual({
      parentItemId: null,
      name: "French Onion Soup",
      description: null,
      category: "Soups",
      price: 6.5,
      status: "available",
      isSpecial: false,
      isModifier: false,
      dietaryFlags: [],
      sortOrder: 0,
    });
  });

  it("requires a modifier to have a parent item", () => {
    expect(
      createMenuItemInputSchema.safeParse({
        name: "Add Swiss",
        category: "Cheese",
        price: 1,
        isModifier: true,
      }).success,
    ).toBe(false);
  });

  it("requires at least one update field", () => {
    expect(updateMenuItemInputSchema.safeParse({}).success).toBe(false);
  });
});
