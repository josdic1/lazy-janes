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

/**
 * Confirmed restaurant ingredient truth learned after the retained source
 * snapshot was created.
 *
 * Keep these separate from menuData.ts so later confirmations are not
 * misrepresented as original-source data.
 */
export const CONFIRMED_MENU_INGREDIENTS = [
  {
    id: "ING_BRUSSELS_SPROUTS",
    name: "Brussels Sprouts",
    allergenFlags: [],
    defaultAddPrice: null,
    priceConfigured: false,
    isAddable: false,
  },
] as const;

/**
 * Selectable foods that are explicit in the retained source choices but were
 * omitted from the retained flat ingredient list. These are source-derived
 * identities, not restaurant facts learned after the snapshot.
 *
 * They are choice-only by default: the source proves they can be selected in
 * these menu questions, not that they belong in the restaurant-wide Add list.
 */
export const SOURCE_DERIVED_CHOICE_INGREDIENTS = [
  { id: "ING_ONION_RINGS", name: "Onion Rings", isAddable: false },
  { id: "ING_ICE_CREAM", name: "Ice Cream", isAddable: false },
  { id: "ING_VEGGIE_BURGER", name: "Veggie Burger", isAddable: false },
  { id: "ING_WHITE_CLAM_SAUCE", name: "White Clam Sauce", isAddable: false },
  { id: "ING_RED_CLAM_SAUCE", name: "Red Clam Sauce", isAddable: false },
  { id: "ING_BLUEBERRY_MUFFIN", name: "Blueberry Muffin", isAddable: false },
  {
    id: "ING_APPLE_CINNAMON_MUFFIN",
    name: "Apple Cinnamon Muffin",
    isAddable: false,
  },
  { id: "ING_CORN_MUFFIN", name: "Corn Muffin", isAddable: false },
  { id: "ING_BRAN_MUFFIN", name: "Bran Muffin", isAddable: false },
  { id: "ING_PLAIN_CHALLAH", name: "Plain Challah", isAddable: false },
  { id: "ING_RAISIN_CHALLAH", name: "Raisin Challah", isAddable: false },
] as const;

/**
 * Source options whose text happens to match an ingredient name but whose
 * source context proves that the label is not selecting that ingredient.
 *
 * Example: Apple in "Apple, Cherry or Blueberry Crumb Pie" is a pie flavor,
 * not an Apple component. The Lazy Jane's adapter maps that source group to
 * a structural UMO Variant; this blocklist prevents false component inference.
 */
export const SOURCE_CHOICE_COMPONENT_BLOCKLIST: ReadonlySet<string> =
  new Set([
    "MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY|apple",
  ]);

/**
 * Source labels that unambiguously name an existing/source-derived component
 * but do not text-match that component's canonical ingredient name.
 *
 * Key format: sourceModifierGroupId|lowercase source option label.
 */
export const SOURCE_CHOICE_COMPONENT_ALIASES: ReadonlyMap<string, string> =
  new Map([
    [
      "MG_SIDE_SIDE_CHOOSE_SIDE_POTATO_SALAD_COLE_SLAW|choose side: potato salad",
      "ING_POTATO_SALAD",
    ],
    [
      "MG_CHOOSE_CHALLAH_CHOOSE_CHALLAH_PLAIN_RAISIN|plain",
      "ING_PLAIN_CHALLAH",
    ],
    [
      "MG_CHOOSE_CHALLAH_CHOOSE_CHALLAH_PLAIN_RAISIN|raisin",
      "ING_RAISIN_CHALLAH",
    ],
    [
      "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_REGULAR_DECAF|regular",
      "ING_REGULAR_COFFEE",
    ],
    [
      "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_REGULAR_DECAF|decaf",
      "ING_DECAF_COFFEE",
    ],
    [
      "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_ICED_COFFEE_ICED_DECAF|iced coffee",
      "ING_REGULAR_COFFEE",
    ],
    [
      "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_ICED_COFFEE_ICED_DECAF|iced decaf",
      "ING_DECAF_COFFEE",
    ],
  ]);

/**
 * Source-proven preparation choices. These labels change how the whole
 * offering is prepared; they are not ingredients and not structural variants.
 *
 * The adapter maps each source choice option to a UMO preparation target.
 */
export const SOURCE_PREPARATION_CHOICE_POLICIES = [
  {
    itemSourceKey: "broiled_or_fried_combo_platter",
    sourceChoiceGroupId: "MG_PREPARATION_PREPARATION_BROILED_FRIED",
    sourceChoiceGroupLabel: "Preparation",
    preparationSourceKey: "prep_other_broiled_fried",
    preparationLabel: "Preparation",
    options: [
      { label: "Broiled", sortOrder: 1, priceAdjustment: 0, priceConfigured: true },
      { label: "Fried", sortOrder: 2, priceAdjustment: 0, priceConfigured: true },
    ],
  },
  {
    itemSourceKey: "linguini_ala_ritz_spicy_or_mild",
    sourceChoiceGroupId: "MG_SAUCE_CHOOSE_HEAT_MILD_SPICY",
    sourceChoiceGroupLabel: "Choose Heat",
    preparationSourceKey: "prep_other_mild_spicy",
    preparationLabel: "Heat",
    options: [
      { label: "Mild", sortOrder: 1, priceAdjustment: 0, priceConfigured: true },
      { label: "Spicy", sortOrder: 2, priceAdjustment: 0, priceConfigured: true },
    ],
  },
  {
    itemSourceKey: "linguini_ala_ritz_spicy_or_mild",
    sourceChoiceGroupId: "MG_CHOOSE_HEAT_CHOOSE_HEAT_MILD_SPICY",
    sourceChoiceGroupLabel: "Choose Heat",
    preparationSourceKey: "prep_other_mild_spicy",
    preparationLabel: "Heat",
    options: [
      { label: "Mild", sortOrder: 1, priceAdjustment: 0, priceConfigured: true },
      { label: "Spicy", sortOrder: 2, priceAdjustment: 0, priceConfigured: true },
    ],
  },
] as const;


/**
 * Source-proven structural variants. These are not component choices: they
 * select which form of the same offering is being ordered.
 *
 * Price adjustments are relative to the menu item's base price.
 */
export const SOURCE_VARIANT_POLICIES = [
  {
    itemSourceKey: "apple_cherry_or_blueberry_crumb_pie",
    sourceChoiceGroupId: "MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY",
    sourceChoiceGroupLabel: "Choose Pie",
    variantLabel: "Pie Flavor",
    options: [
      { label: "Apple", priceAdjustment: 0, priceConfigured: true },
      { label: "Cherry", priceAdjustment: 0, priceConfigured: true },
      { label: "Blueberry", priceAdjustment: 0, priceConfigured: true },
    ],
  },
  {
    itemSourceKey: "blueberry_pancakes",
    sourceChoiceGroupId: "MG_CHOOSE_SIZE_CHOOSE_SIZE_FULL_STACK_SHORT_STACK",
    sourceChoiceGroupLabel: "Choose Size",
    variantLabel: "Size",
    options: [
      { label: "Full Stack", priceAdjustment: 0, priceConfigured: true },
      { label: "Short Stack", priceAdjustment: -2, priceConfigured: true },
    ],
  },
  {
    itemSourceKey: "chocolate_chip_pancakes",
    sourceChoiceGroupId: "MG_CHOOSE_SIZE_CHOOSE_SIZE_FULL_STACK_SHORT_STACK",
    sourceChoiceGroupLabel: "Choose Size",
    variantLabel: "Size",
    options: [
      { label: "Full Stack", priceAdjustment: 0, priceConfigured: true },
      { label: "Short Stack", priceAdjustment: -2.55, priceConfigured: true },
    ],
  },
] as const;

/**
 * Confirmed Ritz vegetable-choice behavior.
 *
 * These source options are configuration decisions:
 * choosing one of them activates the actual Vegetables choice slot.
 */
export const RITZ_VEGETABLE_CHOICE_POLICIES = [
  {
    sourceChoiceGroupId:
      "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    sourceChoiceOptionLabel: "Two Vegetables",
    targetChoiceGroupId: "CONFIRMED_RITZ_VEGETABLES",
    minSelections: 2,
    maxSelections: 2,
    priceAdjustment: 0,
    priceConfigured: true,
  },
  {
    sourceChoiceGroupId:
      "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    sourceChoiceOptionLabel: "One Vegetable",
    targetChoiceGroupId: "CONFIRMED_RITZ_VEGETABLES",
    minSelections: 1,
    maxSelections: 1,
    priceAdjustment: 0,
    priceConfigured: true,
  },
] as const;

export const RITZ_VEGETABLE_INGREDIENT_IDS = [
  "ING_CARROTS",
  "ING_BROCCOLI",
  "ING_ZUCCHINI",
  "ING_BRUSSELS_SPROUTS",
] as const;
