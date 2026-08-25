import type { ComponentRelationship, ComponentRole } from "@lazy-janes/shared";

/**
 * EXPLICIT IMPORT-TIME MENU BUSINESS POLICY
 *
 * These are deliberate menu rules, not runtime inference.
 * PostgreSQL remains runtime truth after the initial import.
 */

/**
 * Legacy source groups that describe a bread component acting as the
 * carrier of a sandwich/burger/handheld.
 *
 * Breakfast toast/bagel/service-bread groups are intentionally absent.
 * Quesadilla tortilla is intentionally absent from the sandwich-carrier policy.
 */
/**
 * Retained source groups that prove a component had a replacement
 * capability while NOT proving the complete replacement catalog.
 *
 * These must never be expanded into guessed replacement rows.
 */
export const UNCONFIGURED_REPLACEMENT_SOURCE_GROUP_IDS:
  ReadonlySet<string> = new Set([
    "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
  ]);

export const CARRIER_SOURCE_GROUP_IDS: ReadonlySet<string> = new Set([
  "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
  "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
  "MG_BREAD_CHOOSE_BREAD_FOCACCIA_NO_BREAD",
  "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
  "MG_BREAD_CHOOSE_BREAD_SUB_ROLL_NO_BREAD",
  "MG_BREAD_CHOOSE_BREAD_BUN_FOCACCIA_BREAD_NO_BREAD",
  "MG_BREAD_CHOOSE_BREAD_SANDWICH_BREAD_NO_BREAD",
  "MG_BREAD_CHOOSE_BREAD_HERO_ROLL_NO_BREAD",
  "MG_BREAD_CHOOSE_BREAD_PITA_NO_PITA",
  "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
]);

/**
 * Explicit house sandwich-carrier replacement catalog.
 *
 * This is NOT generated from every ingredient whose kind is "bread".
 * Missing choices such as Gluten-Free Bread or Lettuce Wrap must be added
 * explicitly only when restaurant policy confirms them.
 */
export const HOUSE_SANDWICH_CARRIER_CATALOG = [
  "Sandwich Bread",
  "Bun",
  "Focaccia Bread",
  "Garlic Bread",
  "Hard Roll",
  "Hero Roll",
  "Roll",
  "Sub Roll",
  "Torpedo Roll",
  "Pita",
  "Wrap",
  "Lettuce Wrap",
] as const;


/**
 * Explicit carrier substitution permission.
 *
 * IMPORTANT:
 * - Being in HOUSE_SANDWICH_CARRIER_CATALOG does NOT grant substitution.
 * - Every allowed source -> replacement pair must be stated here.
 * - Unknown pricing remains explicitly unconfigured.
 * - An empty list means no restaurant-wide carrier substitutions have
 *   yet been confirmed.
 */
export type HouseSandwichCarrierName =
  (typeof HOUSE_SANDWICH_CARRIER_CATALOG)[number];

export type CarrierSubstitutionRule =
  (
    | {
        appliesTo: "all_items_with_source_carrier";
      }
    | {
        appliesTo: "specific_items";
        itemIds: readonly string[];
      }
  ) & {
    sourceName: HouseSandwichCarrierName;
    replacementName: HouseSandwichCarrierName;
    priceAdjustment: number;
    priceConfigured: boolean;
    sortOrder: number;
  };

export const HOUSE_CARRIER_SUBSTITUTION_RULES:
  readonly CarrierSubstitutionRule[] = [
    // Add only confirmed restaurant policy.
    //
    // Restaurant-wide example:
    // {
    //   appliesTo: "all_items_with_source_carrier",
    //   sourceName: "Bun",
    //   replacementName: "Lettuce Wrap",
    //   priceAdjustment: 0,
    //   priceConfigured: false,
    //   sortOrder: 10,
    // },
    //
    // Item-specific exceptions use:
    //   appliesTo: "specific_items"
    //   itemIds: [...]
  ];


/**
 * Explicit component-role truth for cases where the retained menu clearly
 * establishes a component's job but the legacy modifier structure does not.
 *
 * Key format: menuItemId|ingredientId
 *
 * This is canonical business data, not runtime inference.
 */
export const COMPONENT_ROLE_OVERRIDES: ReadonlyMap<string, ComponentRole> =
  new Map([
    ["cheese_steak_deluxe|ING_TORPEDO_ROLL", "carrier"],
  ]);


/**
 * Explicit menu-component relationship truth.
 *
 * Key format:
 *   menuItemId|ingredientId
 *
 * "contains"   = part of the ordered dish itself
 * "comes_with" = included accompaniment served with the dish
 *
 * Unknown relationships are intentionally omitted.
 */
export const COMPONENT_RELATIONSHIP_OVERRIDES:
  ReadonlyMap<string, ComponentRelationship> = new Map([
    // Farmer's Omelette
    ["farmer_s_omelette|ING_MUSHROOMS", "contains"],
    ["farmer_s_omelette|ING_GREEN_PEPPERS", "contains"],
    ["farmer_s_omelette|ING_ONION", "contains"],
    ["farmer_s_omelette|ING_TOMATO", "contains"],
    ["farmer_s_omelette|ING_BROCCOLI", "contains"],
    ["farmer_s_omelette|ING_EGG", "contains"],
    ["farmer_s_omelette|ING_HOME_FRIES", "comes_with"],
    ["farmer_s_omelette|ING_TOAST", "comes_with"],

    // Cheese Steak Deluxe
    ["cheese_steak_deluxe|ING_FRIED_ONIONS", "contains"],
    ["cheese_steak_deluxe|ING_TORPEDO_ROLL", "contains"],
    ["cheese_steak_deluxe|ING_STEAK", "contains"],
    ["cheese_steak_deluxe|ING_CHEESE", "contains"],
    ["cheese_steak_deluxe|ING_FRENCH_FRIES", "comes_with"],
  ]);
