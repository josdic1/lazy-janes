/* eslint-disable */
// Generated from the complete 427-item Lazy Jane's menu model.
// Normalized POS/API-ready data:
// Items -> ItemModifierGroups -> ModifierGroups -> Modifiers
// Items -> ItemIngredients -> Ingredients
//
// IMPORTANT:
// - priceAdjustment/extraPrice are null when the source does not establish a price.
// - requiresReview/reviewNeeded marks operational details that must be confirmed rather than invented.
// - isKids is explicit item data; it is NOT inferred at runtime from category names.

export type ModifierKind =
  | "bread"
  | "bread_prep"
  | "cheese"
  | "egg"
  | "egg_cook"
  | "protein"
  | "protein_cook"
  | "sauce"
  | "side"
  | "side_secondary"
  | string;

export interface MenuItemData {
  id: string;
  name: string;
  department: string;
  subcategory: string;
  description: string;
  basePrice: number;
  isKids: boolean;
  hasKidsVersion: boolean;
  isSpecial: boolean;
  sourceSortOrder: number;
  reviewNeeded: boolean;
  reviewNotes: string;
}

export interface IngredientData {
  id: string;
  name: string;
  allergenFlags: string[];
  defaultAddPrice: number | null;
  priceConfigured: boolean;
}

export interface ItemIngredientData {
  itemId: string;
  ingredientId: string;
  sortOrder: number;
  isStandard: boolean;
  canRemove: boolean;
  canExtra: boolean;
  canSide: boolean;
  extraPrice: number | null;
  priceConfigured: boolean;
}

export interface ModifierGroupData {
  id: string;
  kind: ModifierKind;
  displayName: string;
  minSelections: number;
  maxSelections: number;
  internalNotes: string;
  requiresReview: boolean;
}

export interface ModifierData {
  id: string;
  modifierGroupId: string;
  name: string;
  priceAdjustment: number | null;
  priceConfigured: boolean;
  ingredientId: string | null;
  isNoneOption: boolean;
  requiresReview: boolean;
  sortOrder: number;
}

export interface ItemModifierGroupData {
  itemId: string;
  modifierGroupId: string;
  sortOrder: number;
}

export interface MenuReviewIssue {
  itemId: string;
  itemName: string;
  notes: string;
  modelBasis: string[];
}

export const items: MenuItemData[] = [
  {
    "id": "drunken_chicken",
    "name": "Drunken Chicken",
    "department": "Sandwiches & Deli",
    "subcategory": "Chicken Cutlet Sandwiches",
    "description": "Vodka sauce & fresh mozzarella cheese.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 1,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "buffalo_cheese",
    "name": "Buffalo Cheese",
    "department": "Sandwiches & Deli",
    "subcategory": "Chicken Cutlet Sandwiches",
    "description": "Buffalo sauce, cheddar cheese, and lettuce.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 2,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "blt_ranch",
    "name": "BLT Ranch",
    "department": "Sandwiches & Deli",
    "subcategory": "Chicken Cutlet Sandwiches",
    "description": "Bacon, lettuce, tomato, American cheese, and ranch dressing.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 3,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "the_pesto",
    "name": "The Pesto",
    "department": "Sandwiches & Deli",
    "subcategory": "Chicken Cutlet Sandwiches",
    "description": "Fresh mozzarella, sun-dried tomatoes, and pesto.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 4,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "the_caprese",
    "name": "The Caprese",
    "department": "Sandwiches & Deli",
    "subcategory": "Chicken Cutlet Sandwiches",
    "description": "Fresh mozzarella, roasted peppers, arugula, and balsamic glaze.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 5,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "the_david",
    "name": "The David",
    "department": "Sandwiches & Deli",
    "subcategory": "Chicken Cutlet Sandwiches",
    "description": "Fresh mozzarella, pepperoni, and olive oil.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 6,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "the_arizona",
    "name": "The Arizona",
    "department": "Sandwiches & Deli",
    "subcategory": "Chicken Cutlet Sandwiches",
    "description": "Jalapeño peppers, red onions, lettuce, and chipotle mayo.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 7,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "the_ritz",
    "name": "The Ritz",
    "department": "Sandwiches & Deli",
    "subcategory": "Fried Chicken Sandwiches",
    "description": "Pickles, avocado, red onions, lettuce & chipotle mayo.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 8,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "the_texan",
    "name": "The Texan",
    "department": "Sandwiches & Deli",
    "subcategory": "Fried Chicken Sandwiches",
    "description": "Bacon, cheddar cheese, fried string onions, and BBQ sauce.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 9,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "the_italian",
    "name": "The Italian",
    "department": "Sandwiches & Deli",
    "subcategory": "Fried Chicken Sandwiches",
    "description": "Marinara sauce and mozzarella cheese.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 10,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "the_monte",
    "name": "The Monte",
    "department": "Sandwiches & Deli",
    "subcategory": "Fried Chicken Sandwiches",
    "description": "Ham, Swiss cheese, and honey mustard.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 11,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "the_club",
    "name": "The Club",
    "department": "Sandwiches & Deli",
    "subcategory": "Fried Chicken Sandwiches",
    "description": "Bacon, lettuce, tomato, and mayo.",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 12,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "buffalo_chicken_wrap",
    "name": "Buffalo Chicken Wrap",
    "department": "Sandwiches & Deli",
    "subcategory": "Wraps",
    "description": "Grilled chicken in buffalo sauce with romaine lettuce, tomatoes, and blue cheese.",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 13,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "philly_cheesesteak_wrap",
    "name": "Philly Cheesesteak Wrap",
    "department": "Sandwiches & Deli",
    "subcategory": "Wraps",
    "description": "With sauteed onions.",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 14,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "blackened_chicken_wrap",
    "name": "Blackened Chicken Wrap",
    "department": "Sandwiches & Deli",
    "subcategory": "Wraps",
    "description": "With avocado, black beans, & tomatoes.",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 15,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "turkey_wrap_special",
    "name": "Turkey Wrap Special",
    "department": "Sandwiches & Deli",
    "subcategory": "Wraps",
    "description": "With lettuce, goat cheese, and avocado in a honey mustard dressing.",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 16,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "bbq_beef_wrap",
    "name": "BBQ Beef Wrap",
    "department": "Sandwiches & Deli",
    "subcategory": "Wraps",
    "description": "Roast beef, mozzarella cheese, & fried onions.",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 17,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "gyro_wrap",
    "name": "Gyro Wrap",
    "department": "Sandwiches & Deli",
    "subcategory": "Wraps",
    "description": "With avocado, lettuce, and tomatoes in a creamy Italian dressing.",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 18,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "tex_mex_wrap",
    "name": "Tex Mex Wrap",
    "department": "Sandwiches & Deli",
    "subcategory": "Wraps",
    "description": "Grilled chicken, tomatoes, Monterey Jack cheese, black beans, avocado, and sour cream.",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 19,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "grilled_chicken_pesto_wrap",
    "name": "Grilled Chicken Pesto Wrap",
    "department": "Sandwiches & Deli",
    "subcategory": "Wraps",
    "description": "Roasted peppers, tomatoes, red onions, and pesto sauce.",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 20,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chicken_caesar_wrap",
    "name": "Chicken Caesar Wrap",
    "department": "Sandwiches & Deli",
    "subcategory": "Wraps",
    "description": "",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 21,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "lemon_shrimp_salad",
    "name": "Lemon Shrimp Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Pieces of shrimp with roasted peppers, bacon, red onions, string beans, tomatoes, mesclun, and scallions in a lemon garlic dressing",
    "basePrice": 19.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 22,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "marions_chopped_salad",
    "name": "Marion’s Chopped Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "With sesame chicken, portabella mushrooms, iceberg lettuce, carrots, cucumbers, fresh mozzarella, and almonds with black olive dressing or a choice of dressing",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 23,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "south_beach_salad_with_grilled_chicken",
    "name": "South Beach Salad with Grilled Chicken",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Fresh spinach with goat cheese, sun-dried cranberries, avocado, red onions, and tomatoes in a white balsamic dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 24,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "insalata_italiano",
    "name": "Insalata Italiano",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Marinated grilled chicken, tossed with fresh mozzarella, roasted peppers, artichoke hearts, and tomatoes in an olive oil and lemon dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 25,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "paulos_salad_with_grilled_chicken",
    "name": "Paulo’s Salad with Grilled Chicken",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Poached pears, walnuts, and raisins over mixed greens in a raspberry vinaigrette dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 26,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "teriyaki_chicken_salad",
    "name": "Teriyaki Chicken Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Strips of marinated chicken, with walnuts, mandarin oranges, snow peas, and mixed greens, topped with fried noodles in a teriyaki dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 27,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "focaccia_sandwich",
    "name": "Focaccia Sandwich",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Grilled chicken, roasted peppers, and fresh mozzarella with pesto sauce",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 28,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "avocado_tuna_salad",
    "name": "Avocado Tuna Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "White chunk tuna with avocado, cucumbers, red onions, and cilantro in a lemon vinaigrette",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 29,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "strawberry_spinach_salad",
    "name": "Strawberry Spinach Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "With fresh spinach, strawberries, and sesame seeds with a choice of blackened salmon or chicken in a poppy white wine vinaigrette",
    "basePrice": 19.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 30,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "coconut_chicken_ala_ritz",
    "name": "Coconut Chicken Ala Ritz",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "With caramelized pears, sun-dried cranberries, green apples, and walnuts in a white balsamic dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 31,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "string_bean_salad_with_grilled_chicken",
    "name": "String Bean Salad with Grilled Chicken",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "With tomatoes, fresh mozzarella, and red onions in a honey balsamic dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 32,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "southwest_cobb_salad",
    "name": "Southwest Cobb Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "With blackened chicken, iceberg lettuce, cilantro, corn, black beans, and red peppers, topped with Monterey Jack and cheddar cheese",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 33,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact dressing list."
  },
  {
    "id": "mango_barley_chicken_salad",
    "name": "Mango Barley Chicken Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "With chopped red and green peppers, red onion, chopped mango, barley with a choice of sesame or marinated chicken tossed in lime juice, olive oil, cilantro, honey, and dijon mustard",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 34,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "pan_fried_crab_cake_sandwich",
    "name": "Pan Fried Crab Cake Sandwich",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "With roasted peppers, avocado, and lettuce with tartar sauce",
    "basePrice": 18.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 35,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "focaccia_special",
    "name": "Focaccia Special",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Grilled chicken, roasted peppers, and fresh mozzarella with a pesto sauce",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 36,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "teriyaki_chicken_sub",
    "name": "Teriyaki Chicken Sub",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Grilled chicken in a teriyaki sauce with lettuce, tomato, and avocado",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 37,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "montreal_chicken_quinoa_salad",
    "name": "Montreal Chicken Quinoa Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Grilled Montreal chicken, zucchini, tomatoes, cucumber, carrots, mixed greens, and chickpeas in a lemon vinaigrette dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 38,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "chopped_burger_salad",
    "name": "Chopped Burger Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "With tomatoes, red onions, cucumbers, lettuce, Monterey Jack cheese, and pickles",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 39,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact dressing list."
  },
  {
    "id": "crispy_buffalo_chicken_salad",
    "name": "Crispy Buffalo Chicken Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Mixed buffalo chicken with diced tomatoes and bleu cheese over romaine lettuce",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 40,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact dressing list."
  },
  {
    "id": "grilled_chicken_italian_sub",
    "name": "Grilled Chicken Italian Sub",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Marinated chicken, roasted peppers, fresh mozzarella, and sun-dried tomatoes pesto",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 41,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "three_bean_chicken_salad",
    "name": "Three Bean Chicken Salad",
    "department": "Specials",
    "subcategory": "Specials",
    "description": "Red, white, and black beans with grilled chicken, scallions, and cherry tomatoes over romaine lettuce in a cilantro lime vinaigrette",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": true,
    "sourceSortOrder": 42,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "gluten_free_dinner_pasta_eggplant_rollatini",
    "name": "Eggplant Rollatini",
    "department": "Gluten Free",
    "subcategory": "Dinner — Pasta",
    "description": "",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 43,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "gluten_free_dinner_pasta_meat_lasagna",
    "name": "Meat Lasagna",
    "department": "Gluten Free",
    "subcategory": "Dinner — Pasta",
    "description": "",
    "basePrice": 27.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 44,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "gluten_free_dinner_pasta_veggie_lasagna",
    "name": "Veggie Lasagna",
    "department": "Gluten Free",
    "subcategory": "Dinner — Pasta",
    "description": "",
    "basePrice": 27.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 45,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "gluten_free_dinner_pasta_penne_pasta_with_meatballs",
    "name": "Penne Pasta with Meatballs",
    "department": "Gluten Free",
    "subcategory": "Dinner — Pasta",
    "description": "",
    "basePrice": 22.35,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 46,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "fusilli_pasta_with_meatballs",
    "name": "Fusilli Pasta with Meatballs",
    "department": "Gluten Free",
    "subcategory": "Dinner — Pasta",
    "description": "",
    "basePrice": 22.35,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 47,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_dinner_pasta_mac_and_cheese",
    "name": "Mac and Cheese",
    "department": "Gluten Free",
    "subcategory": "Dinner — Pasta",
    "description": "Kids $13.95",
    "basePrice": 19.95,
    "isKids": false,
    "hasKidsVersion": true,
    "isSpecial": false,
    "sourceSortOrder": 48,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "gluten_free_dinner_pasta_cheese_ravioli",
    "name": "Cheese Ravioli",
    "department": "Gluten Free",
    "subcategory": "Dinner — Pasta",
    "description": "",
    "basePrice": 21.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 49,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_dinner_chicken_chicken_francaise",
    "name": "Chicken Française",
    "department": "Gluten Free",
    "subcategory": "Dinner — Chicken",
    "description": "Served with choice of pasta or vegetables",
    "basePrice": 30.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 50,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "chicken_parmesan",
    "name": "Chicken Parmesan",
    "department": "Gluten Free",
    "subcategory": "Dinner — Chicken",
    "description": "Served with choice of pasta or vegetables",
    "basePrice": 30.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 51,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "gluten_free_dinner_chicken_chicken_fingers",
    "name": "Chicken Fingers",
    "department": "Gluten Free",
    "subcategory": "Dinner — Chicken",
    "description": "Served with choice of pasta or vegetables",
    "basePrice": 19.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 52,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "fried_filet",
    "name": "Fried Filet",
    "department": "Gluten Free",
    "subcategory": "Dinner — Fish",
    "description": "Served with choice of pasta or vegetables",
    "basePrice": 26.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 53,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "fried_shrimp",
    "name": "Fried Shrimp",
    "department": "Gluten Free",
    "subcategory": "Dinner — Fish",
    "description": "Served with choice of pasta or vegetables",
    "basePrice": 30.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 54,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "shrimp_francaise",
    "name": "Shrimp Francaise",
    "department": "Gluten Free",
    "subcategory": "Dinner — Fish",
    "description": "Served with choice of pasta or vegetables",
    "basePrice": 30.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 55,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "gluten_free_dinner_fish_sole_francaise",
    "name": "Sole Francaise",
    "department": "Gluten Free",
    "subcategory": "Dinner — Fish",
    "description": "Served with choice of pasta or vegetables",
    "basePrice": 29.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 56,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "gluten_free_dinner_meat_veal_francaise",
    "name": "Veal Francaise",
    "department": "Gluten Free",
    "subcategory": "Dinner — Meat",
    "description": "Served with choice of pasta or vegetables",
    "basePrice": 32.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 57,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "veal_parmesan",
    "name": "Veal Parmesan",
    "department": "Gluten Free",
    "subcategory": "Dinner — Meat",
    "description": "Served with choice of pasta or vegetables",
    "basePrice": 32.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 58,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "gluten_free_lunch_pasta_eggplant_rollatini",
    "name": "Eggplant Rollatini",
    "department": "Gluten Free",
    "subcategory": "Lunch — Pasta",
    "description": "",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 59,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "gluten_free_lunch_pasta_meat_lasagna",
    "name": "Meat Lasagna",
    "department": "Gluten Free",
    "subcategory": "Lunch — Pasta",
    "description": "",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 60,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "gluten_free_lunch_pasta_veggie_lasagna",
    "name": "Veggie Lasagna",
    "department": "Gluten Free",
    "subcategory": "Lunch — Pasta",
    "description": "",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 61,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "gluten_free_lunch_pasta_penne_pasta_with_meatballs",
    "name": "Penne Pasta with Meatballs",
    "department": "Gluten Free",
    "subcategory": "Lunch — Pasta",
    "description": "",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 62,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "fussilli_pasta_with_meatballs",
    "name": "Fussilli Pasta with Meatballs",
    "department": "Gluten Free",
    "subcategory": "Lunch — Pasta",
    "description": "",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 63,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_pasta_mac_and_cheese",
    "name": "Mac and Cheese",
    "department": "Gluten Free",
    "subcategory": "Lunch — Pasta",
    "description": "Kids $13.95",
    "basePrice": 17.65,
    "isKids": false,
    "hasKidsVersion": true,
    "isSpecial": false,
    "sourceSortOrder": 64,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "gluten_free_lunch_pasta_cheese_ravioli",
    "name": "Cheese Ravioli",
    "department": "Gluten Free",
    "subcategory": "Lunch — Pasta",
    "description": "",
    "basePrice": 21.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 65,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_chicken_chicken_fingers",
    "name": "Chicken Fingers",
    "department": "Gluten Free",
    "subcategory": "Lunch — Chicken",
    "description": "",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 66,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_sandwiches_tuna_salad",
    "name": "Tuna Salad",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 67,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_sandwiches_chicken_salad",
    "name": "Chicken Salad",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 68,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_sandwiches_egg_salad",
    "name": "Egg Salad",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 69,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_sandwiches_chunky_shrimp_salad",
    "name": "Chunky Shrimp Salad",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 21.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 70,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_sandwiches_roast_beef",
    "name": "Roast Beef",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 71,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_sandwiches_turkey",
    "name": "Turkey",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 72,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "bacon_lettuce_and_tomato",
    "name": "Bacon, Lettuce and Tomato",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 73,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_sandwiches_individual_tuna",
    "name": "Individual Tuna",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 74,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_sandwiches_individual_salmon",
    "name": "Individual Salmon",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 75,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "ham_and_cheese",
    "name": "Ham and Cheese",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 76,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "gluten_free_lunch_sandwiches_salami",
    "name": "Salami",
    "department": "Gluten Free",
    "subcategory": "Lunch — Sandwiches",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 77,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "canton_chicken_wings",
    "name": "Canton Chicken Wings",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 14.1,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 78,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "baked_clams",
    "name": "Baked Clams",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 79,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "stuffed_mushrooms",
    "name": "Stuffed Mushrooms",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 12.45,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 80,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "basket_of_fried_zucchini",
    "name": "Basket of Fried Zucchini",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 9.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 81,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "fried_mozzarella_sticks",
    "name": "Fried Mozzarella Sticks",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 11.35,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 82,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "chopped_chicken_livers",
    "name": "Chopped Chicken Livers",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 9.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 83,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "cup_of_homemade_chili",
    "name": "Cup of Homemade Chili",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 8.45,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 84,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "shrimp_cocktail",
    "name": "Shrimp Cocktail",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 15.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 85,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "fried_calamari",
    "name": "Fried Calamari",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 86,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "feta_cheese_tomato_salad",
    "name": "Feta Cheese & Tomato Salad",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 10.55,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 87,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact dressing list. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "fresh_fruit_cup",
    "name": "Fresh Fruit Cup",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 88,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "fresh_melon_in_season",
    "name": "Fresh Melon (In Season)",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "",
    "basePrice": 6.3,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 89,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "nachos",
    "name": "Nachos",
    "department": "Lunch & Dinner",
    "subcategory": "Appetizers & Fruits",
    "description": "Tortilla chips topped with chili, melted cheddar, pico de gallo, salsa & house made guacamole",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 90,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "crock_of_french_onion_soup",
    "name": "Crock of French Onion Soup",
    "department": "Lunch & Dinner",
    "subcategory": "Soups",
    "description": "",
    "basePrice": 6.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 91,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chicken_soup_with_matzoh_ball_or_noodles_cup",
    "name": "Chicken Soup with Matzoh Ball or Noodles — Cup",
    "department": "Lunch & Dinner",
    "subcategory": "Soups",
    "description": "",
    "basePrice": 3.8,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 92,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "chicken_soup_with_matzoh_ball_or_noodles_bowl",
    "name": "Chicken Soup with Matzoh Ball or Noodles — Bowl",
    "department": "Lunch & Dinner",
    "subcategory": "Soups",
    "description": "",
    "basePrice": 5.35,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 93,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "soup_du_jour_cup",
    "name": "Soup Du Jour — Cup",
    "department": "Lunch & Dinner",
    "subcategory": "Soups",
    "description": "",
    "basePrice": 3.8,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 94,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "soup_du_jour_bowl",
    "name": "Soup Du Jour — Bowl",
    "department": "Lunch & Dinner",
    "subcategory": "Soups",
    "description": "",
    "basePrice": 5.35,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 95,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "quart_of_soup_to_go",
    "name": "Quart of Soup To Go",
    "department": "Lunch & Dinner",
    "subcategory": "Soups",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 96,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "crock_of_onion_soup",
    "name": "Crock of Onion Soup",
    "department": "Lunch & Dinner",
    "subcategory": "Soups",
    "description": "Topped with melted cheese, served with salad and garlic bread",
    "basePrice": 10.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 97,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "szechuan_chicken",
    "name": "Szechuan Chicken",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "A stir-fried specialty with vegetables and cashews",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 98,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "szechuan_shrimp",
    "name": "Szechuan Shrimp",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "",
    "basePrice": 29.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 99,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "chicken_familia",
    "name": "Chicken Familia",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "Potatoes, mushrooms, onions and garlic",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 100,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "spanish_chicken",
    "name": "Spanish Chicken",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "Onions, potatoes and tomato",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 101,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "char_grilled_half_chicken",
    "name": "Char-Grilled Half Chicken",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "Marinated and grilled to perfection",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 102,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "golden_roasted_half_chicken",
    "name": "Golden Roasted Half Chicken",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "With stuffing",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 103,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "sauteed_calves_liver",
    "name": "Sauteed Calves Liver",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "Smothered in onions",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 104,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "roast_turkey_with_all_the_fixins",
    "name": "Roast Turkey with All the Fixins",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "Stuffing and cranberry sauce",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 105,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "brisket_of_beef_platter",
    "name": "Brisket of Beef Platter",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "In the traditional style",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 106,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "low_fat_turkey_meat_loaf",
    "name": "Low Fat Turkey Meat Loaf",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "",
    "basePrice": 20.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 107,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "southern_fried_chicken",
    "name": "Southern Fried Chicken",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "A basket of tender fried chicken",
    "basePrice": 18.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 108,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chicken_lo_mein",
    "name": "Chicken Lo Mein",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "With stir-fry vegetables",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 109,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "chicken_giambotta",
    "name": "Chicken Giambotta",
    "department": "Lunch & Dinner",
    "subcategory": "Entrees",
    "description": "Sausage, mushrooms, onions and potatoes",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 110,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "broiled_salmon_or_tuna",
    "name": "Broiled Salmon or Tuna",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 111,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "shrimp_scampi",
    "name": "Shrimp Scampi",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 28.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 112,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "fried_scallops",
    "name": "Fried Scallops",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 28.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 113,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "fried_clams_in_the_basket",
    "name": "Fried Clams in The Basket",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 114,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "fried_flounder",
    "name": "Fried Flounder",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "Lemon wedge",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 115,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "fried_shrimp_basket",
    "name": "Fried Shrimp Basket",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 116,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "broiled_swordfish",
    "name": "Broiled Swordfish",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 30.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 117,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "broiled_sea_scallops",
    "name": "Broiled Sea Scallops",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 29.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 118,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "garlic_salmon_balsamic",
    "name": "Garlic Salmon Balsamic",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 119,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "stuffed_shrimp",
    "name": "Stuffed Shrimp",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 29.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 120,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "lunch_dinner_from_the_sea_sole_francaise",
    "name": "Sole Francaise",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 26.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 121,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "broiled_scrod",
    "name": "Broiled Scrod",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 122,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "broiled_flounder",
    "name": "Broiled Flounder",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "",
    "basePrice": 24.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 123,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "broiled_or_fried_combo_platter",
    "name": "Broiled or Fried Combo Platter",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "Scallops, clams, shrimp, flounder & swordfish",
    "basePrice": 28.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 124,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "grilled_shrimp",
    "name": "Grilled Shrimp",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "Served over garlic mashed & julienne vegetables",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 125,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "grilled_shrimp_pasta",
    "name": "Grilled Shrimp Pasta",
    "department": "Lunch & Dinner",
    "subcategory": "From the Sea",
    "description": "Over arugula, tomato, onions & cold pasta with balsamic",
    "basePrice": 28.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 126,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "new_york_strip_16_oz",
    "name": "New York Strip (16 oz.)",
    "department": "Lunch & Dinner",
    "subcategory": "Prime Steaks & Chops",
    "description": "",
    "basePrice": 34.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 127,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "ground_sirloin",
    "name": "Ground Sirloin",
    "department": "Lunch & Dinner",
    "subcategory": "Prime Steaks & Chops",
    "description": "With mushroom and onions",
    "basePrice": 20.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 128,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "grilled_center_cut_pork_chops",
    "name": "Grilled Center Cut Pork Chops",
    "department": "Lunch & Dinner",
    "subcategory": "Prime Steaks & Chops",
    "description": "With potato pancake & applesauce",
    "basePrice": 25.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 129,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "char_grilled_turkey_steak",
    "name": "Char-Grilled Turkey Steak",
    "department": "Lunch & Dinner",
    "subcategory": "Prime Steaks & Chops",
    "description": "Roasted garlic and onions mixed with fresh ground turkey",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 130,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "sliced_skirt_steak_platter",
    "name": "Sliced Skirt Steak Platter",
    "department": "Lunch & Dinner",
    "subcategory": "Prime Steaks & Chops",
    "description": "On toast, brown onions and mushrooms",
    "basePrice": 25.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 131,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chicken_parmigiana",
    "name": "Chicken Parmigiana",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "With spaghetti",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 132,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "veal_cutlet_parmigiana",
    "name": "Veal Cutlet Parmigiana",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "With spaghetti",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 133,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "lunch_dinner_italian_specialties_cheese_ravioli",
    "name": "Cheese Ravioli",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "",
    "basePrice": 18.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 134,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "spaghetti_with_meatballs",
    "name": "Spaghetti with Meatballs",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 135,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "eggplant_parmigiana",
    "name": "Eggplant Parmigiana",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "With spaghetti",
    "basePrice": 19.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 136,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "linguini",
    "name": "Linguini",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "White or red clam sauce",
    "basePrice": 21.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 137,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "lunch_dinner_italian_specialties_chicken_francaise",
    "name": "Chicken Francaise",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "",
    "basePrice": 26.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 138,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "lunch_dinner_italian_specialties_veal_francaise",
    "name": "Veal Francaise",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "",
    "basePrice": 28.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 139,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "breaded_veal_cutlet",
    "name": "Breaded Veal Cutlet",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "With spaghetti",
    "basePrice": 28.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 140,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "vegetable_lasagna",
    "name": "Vegetable Lasagna",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 141,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "lunch_dinner_italian_specialties_meat_lasagna",
    "name": "Meat Lasagna",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 142,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "rigatoni_chicken",
    "name": "Rigatoni & Chicken",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "With spinach & sundried tomato in garlic white wine sauce",
    "basePrice": 27.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 143,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "linguini_ala_ritz_spicy_or_mild",
    "name": "Linguini Ala Ritz (Spicy or Mild)",
    "department": "Lunch & Dinner",
    "subcategory": "Italian Specialties",
    "description": "Sautéed shrimp & clams in a divine diablo sauce over choice of pasta",
    "basePrice": 29.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 144,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "potato_pancakes",
    "name": "Potato Pancakes",
    "department": "Lunch & Dinner",
    "subcategory": "Jewish Specialties",
    "description": "With homemade applesauce and sour cream",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 145,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "kasha_varnishkas",
    "name": "Kasha Varnishkas",
    "department": "Lunch & Dinner",
    "subcategory": "Jewish Specialties",
    "description": "In its natural gravy",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 146,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "stuffed_cabbage_hungarian_style",
    "name": "Stuffed Cabbage (Hungarian Style)",
    "department": "Lunch & Dinner",
    "subcategory": "Jewish Specialties",
    "description": "",
    "basePrice": 21.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 147,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chicken_in_the_pot",
    "name": "Chicken in The Pot",
    "department": "Lunch & Dinner",
    "subcategory": "Jewish Specialties",
    "description": "Boiled chicken with matzoh balls, noodles and carrots",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 148,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "flanken_in_the_pot",
    "name": "Flanken in The Pot",
    "department": "Lunch & Dinner",
    "subcategory": "Jewish Specialties",
    "description": "Boiled flanken with matzoh balls, noodles and carrots",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 149,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "potato_pierogies",
    "name": "Potato Pierogies",
    "department": "Lunch & Dinner",
    "subcategory": "Jewish Specialties",
    "description": "Sauteed in a pan with brown onions",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 150,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "sauteed_chicken_liver",
    "name": "Sauteed Chicken Liver",
    "department": "Lunch & Dinner",
    "subcategory": "Jewish Specialties",
    "description": "With onions & mushrooms over rice with brown sauce",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 151,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "lunch_dinner_cold_platters_salads_chunky_shrimp_salad",
    "name": "Chunky Shrimp Salad",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With hard-boiled egg, lettuce and fresh vegetables",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 152,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "chicken_salad_platter",
    "name": "Chicken Salad Platter",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With hard-boiled egg, lettuce and fresh vegetables",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 153,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "tuna_fish_salad_platter",
    "name": "Tuna Fish Salad Platter",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With hard-boiled egg, lettuce and fresh vegetables",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 154,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "egg_salad_platter",
    "name": "Egg Salad Platter",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With hard-boiled egg, lettuce and fresh vegetables",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 155,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chopped_chicken_liver",
    "name": "Chopped Chicken Liver",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With hard-boiled egg, bermuda onion and vegetable",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 156,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "greek_salad_small",
    "name": "Greek Salad — Small",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With dressing | Add Grilled Chicken $5.95",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 157,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "greek_salad_large",
    "name": "Greek Salad — Large",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With dressing | Add Grilled Chicken $5.95",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 158,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "tossed_salad",
    "name": "Tossed Salad",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With Tuna or Chicken Salad $15.95. With Shrimp Salad $22.95.",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 159,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact dressing list."
  },
  {
    "id": "spinach_salad",
    "name": "Spinach Salad",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With fresh mushrooms, tomato, egg & bacon",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 160,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact dressing list."
  },
  {
    "id": "grilled_chicken_small",
    "name": "Grilled Chicken — Small",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "Over garden salad",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 161,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact dressing list."
  },
  {
    "id": "grilled_chicken_large",
    "name": "Grilled Chicken — Large",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "Over garden salad",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 162,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact dressing list."
  },
  {
    "id": "chef_s_salad",
    "name": "Chef's Salad",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With sliced turkey, roast beef, ham, Swiss cheese, hard-boiled egg, assorted greens and tomato wedges",
    "basePrice": 18.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 163,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact dressing list."
  },
  {
    "id": "sardine_platter",
    "name": "Sardine Platter",
    "department": "Lunch & Dinner",
    "subcategory": "Cold Platters & Salads",
    "description": "With fresh vegetables",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 164,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "caesar_salad",
    "name": "Caesar Salad",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 165,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "char_grilled_chicken_over_caesar_salad_lunch",
    "name": "Char Grilled Chicken Over Caesar Salad — Lunch",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 166,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "char_grilled_chicken_over_caesar_salad_dinner",
    "name": "Char Grilled Chicken Over Caesar Salad — Dinner",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "",
    "basePrice": 21.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 167,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "cheese_steak_deluxe",
    "name": "Cheese Steak Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "On torpedo roll with fried onions and french fries",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 168,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "grilled_chicken_pasta_lunch",
    "name": "Grilled Chicken Pasta — Lunch",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "Over arugula, tomato, onion and cold pasta with balsamic",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 169,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "grilled_chicken_pasta_dinner",
    "name": "Grilled Chicken Pasta — Dinner",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "Over arugula, tomato, onion and cold pasta with balsamic",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 170,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "char_grilled_chicken_breast_sandwich",
    "name": "Char-Grilled Chicken Breast Sandwich",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "With lettuce & tomato on a bun or focaccia bread, served with french fries",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 171,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "sesame_chicken_lunch",
    "name": "Sesame Chicken — Lunch",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "With fresh mushrooms & tomatoes over spinach salad",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 172,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "sesame_chicken_dinner",
    "name": "Sesame Chicken — Dinner",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "With fresh mushrooms & tomatoes over spinach salad",
    "basePrice": 23.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 173,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "chicken_finger_platter",
    "name": "Chicken Finger Platter",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "With french fries and honey mustard",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 174,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "stir_fried_fresh_vegetables",
    "name": "Stir-Fried Fresh Vegetables",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "With soy sauce or garlic & olive oil",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 175,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "french_dip",
    "name": "French Dip",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "On garlic bread, au jus served with french fries",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 176,
    "reviewNeeded": true,
    "reviewNotes": "Source menu does not identify the sandwich protein; verify recipe."
  },
  {
    "id": "golden_fried_filet_deluxe",
    "name": "Golden Fried Filet Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "On a bun with french fries and cole slaw",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 177,
    "reviewNeeded": true,
    "reviewNotes": "Source menu does not identify the sandwich protein; verify recipe."
  },
  {
    "id": "chicken_cheesesteak",
    "name": "Chicken Cheesesteak",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "On a torpedo roll with fried onions served with french fries",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 178,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "turkey_or_chicken_meatloaf_sandwich",
    "name": "Turkey or Chicken Meatloaf Sandwich",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "With gravy on a hard roll served with french fries",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 179,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "veal_patti_parmigiana",
    "name": "Veal Patti Parmigiana",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "On torpedo roll",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 180,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "tuna_melt",
    "name": "Tuna Melt",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "With cheese and tomatoes",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 181,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "chicken_pot_pie",
    "name": "Chicken Pot Pie",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "",
    "basePrice": 18.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 182,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "beef_meatball_sandwich",
    "name": "Beef Meatball Sandwich",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "Parmigiana $14.95",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 183,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "eggplant_parmigiana_hero",
    "name": "Eggplant Parmigiana Hero",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 184,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "chicken_parmigiana_hero",
    "name": "Chicken Parmigiana Hero",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "Smothered in cheese on torpedo roll",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 185,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "cuban_sandwich",
    "name": "Cuban Sandwich",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "Served with french fries",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 186,
    "reviewNeeded": true,
    "reviewNotes": "Source menu does not identify the sandwich protein; verify recipe."
  },
  {
    "id": "gyro",
    "name": "Gyro",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "Meat or Chicken on pita bread with lettuce, tomato, onion & tzatziki sauce, served with french fries",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 187,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chicken_wrap",
    "name": "Chicken Wrap",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "Grilled chicken with lettuce, tomato & balsamic dressing, served with french fries",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 188,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "chicken_quesadilla",
    "name": "Chicken Quesadilla",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "Served with sour cream & salsa",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 189,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "chili_fiesta",
    "name": "Chili Fiesta",
    "department": "Lunch & Dinner",
    "subcategory": "Distinctive Specialties",
    "description": "Bowl of homemade chili with chopped onion & sour cream",
    "basePrice": 10.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 190,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "hot_pasta_primavera",
    "name": "Hot Pasta Primavera",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Mixed with low-fat cottage cheese and sauteed vegetables in garlic",
    "basePrice": 21.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 191,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "turkey_bowl",
    "name": "Turkey Bowl",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Large tossed salad topped with white meat turkey & hard boiled egg, choice of dressing",
    "basePrice": 18.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 192,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "lean_beef_or_turkey_patti",
    "name": "Lean Beef or Turkey Patti",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "With cottage cheese and pineapple",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 193,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "diet_riot",
    "name": "Diet Riot",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Turkey or chicken burger with chopped tossed salad",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 194,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "diet_delight",
    "name": "Diet Delight",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Veggie burger with chopped tossed salad",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 195,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "pineapple_boat",
    "name": "Pineapple Boat",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Assorted fresh fruit and cottage cheese",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 196,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "fresh_fruit_bowl",
    "name": "Fresh Fruit Bowl",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "With lettuce, cottage cheese, and jello",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 197,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "cobb_salad_lunch",
    "name": "Cobb Salad — Lunch",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Grilled chicken, avocado, bacon, sliced egg, tomato & crumbled blue cheese in a crisp tortilla shell",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 198,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact dressing list."
  },
  {
    "id": "cobb_salad_dinner",
    "name": "Cobb Salad — Dinner",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Grilled chicken, avocado, bacon, sliced egg, tomato & crumbled blue cheese in a crisp tortilla shell",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 199,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact dressing list."
  },
  {
    "id": "caesar_italia",
    "name": "Caesar Italia",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Crisp romaine lettuce topped with grilled chicken, diced mozzarella, tomato, and onion",
    "basePrice": 18.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 200,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "marions_chopped_salad_lunch",
    "name": "Marion’s Chopped Salad — Lunch",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "With sesame chicken, portabella mushrooms, iceberg lettuce, carrots, cucumbers, fresh mozzarella, and almonds with black olive dressing or a choice of dressing",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 201,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "marions_chopped_salad_dinner",
    "name": "Marion’s Chopped Salad — Dinner",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "With sesame chicken, portabella mushrooms, iceberg lettuce, carrots, cucumbers, fresh mozzarella, and almonds with black olive dressing or a choice of dressing",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 202,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "ritz_salad_with_grilled_chicken_lunch",
    "name": "Ritz Salad with Grilled Chicken — Lunch",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Iceberg Lettuce, Cucumbers, Carrots, Red Onion. Chick Peas, Olives & Fresh Mozzarella with Balsamic Vinaigrette Dressing",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 203,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "ritz_salad_with_grilled_chicken_dinner",
    "name": "Ritz Salad with Grilled Chicken — Dinner",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Iceberg Lettuce, Cucumbers, Carrots, Red Onion. Chick Peas, Olives & Fresh Mozzarella with Balsamic Vinaigrette Dressing",
    "basePrice": 22.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 204,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "blackened_salmon_salad",
    "name": "Blackened Salmon Salad",
    "department": "Lunch & Dinner",
    "subcategory": "Trim Line Features",
    "description": "Blackened Salmon over Romaine Lettuce with Provolone Cheese, Tomatoes & Walnuts in a Lemon Vinaigrette Dressing",
    "basePrice": 33.3,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 205,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "steak_sandwich",
    "name": "Steak Sandwich",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "Tender char-broiled skirt steak served on garlic bread, topped with sauteed onions, accompanied with french fries",
    "basePrice": 21.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 206,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "jumbo_burger_regular",
    "name": "Jumbo Burger — Regular",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 8.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 207,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "jumbo_burger_deluxe",
    "name": "Jumbo Burger — Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 208,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "cheeseburger_regular",
    "name": "Cheeseburger — Regular",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 9.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 209,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "cheeseburger_deluxe",
    "name": "Cheeseburger — Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 210,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "bacon_burger_regular",
    "name": "Bacon Burger — Regular",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 10.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 211,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "bacon_burger_deluxe",
    "name": "Bacon Burger — Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 212,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "bacon_cheeseburger_regular",
    "name": "Bacon Cheeseburger — Regular",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 213,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "bacon_cheeseburger_deluxe",
    "name": "Bacon Cheeseburger — Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 214,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "mushroom_burger_regular",
    "name": "Mushroom Burger — Regular",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 215,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "mushroom_burger_deluxe",
    "name": "Mushroom Burger — Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 216,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "chili_burger_regular",
    "name": "Chili Burger — Regular",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 217,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "chili_burger_deluxe",
    "name": "Chili Burger — Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 218,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "pizza_burger_regular",
    "name": "Pizza Burger — Regular",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 219,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "pizza_burger_deluxe",
    "name": "Pizza Burger — Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 220,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "turkey_or_veggie_or_chicken_burger_regular",
    "name": "Turkey or Veggie or Chicken Burger — Regular",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 221,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "turkey_or_veggie_or_chicken_burger_deluxe",
    "name": "Turkey or Veggie or Chicken Burger — Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 222,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "salmon_burger_regular",
    "name": "Salmon Burger — Regular",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 223,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "salmon_burger_deluxe",
    "name": "Salmon Burger — Deluxe",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 224,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "hot_dog_1_4_lb",
    "name": "Hot Dog (1/4 lb.)",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 225,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "chili_dog_1_4_lb",
    "name": "Chili Dog (1/4 lb.)",
    "department": "Lunch & Dinner",
    "subcategory": "From the Char-Broiler",
    "description": "",
    "basePrice": 8.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 226,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "hot_pastrami",
    "name": "Hot Pastrami",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 227,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "hot_corned_beef",
    "name": "Hot Corned Beef",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 228,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "hot_brisket",
    "name": "Hot Brisket",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 229,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "corned_beef_reuben",
    "name": "Corned Beef Reuben",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "With Swiss cheese, sauerkraut & Russian dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 230,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "pastrami_reuben",
    "name": "Pastrami Reuben",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "With Swiss cheese, sauerkraut & Russian dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 231,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "turkey_reuben",
    "name": "Turkey Reuben",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "With Swiss cheese, cole slaw & Russian dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 232,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "corned_beef_pastrami",
    "name": "Corned Beef & Pastrami",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "With cole slaw & Russian dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 233,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "sandwiches_deli_deli_roast_beef",
    "name": "Roast Beef",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 234,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sandwiches_deli_deli_turkey",
    "name": "Turkey",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 235,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sandwiches_deli_deli_salami",
    "name": "Salami",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 236,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "ham",
    "name": "Ham",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 237,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "chopped_liver",
    "name": "Chopped Liver",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 238,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sandwiches_deli_deli_ham_cheese",
    "name": "Ham & Cheese",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 239,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "corned_beef_chopped_liver",
    "name": "Corned Beef & Chopped Liver",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "With cole slaw & Russian dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 240,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "turkey_chopped_liver_onion",
    "name": "Turkey, Chopped Liver & Onion",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "With cole slaw & Russian dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 241,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "turkey_swiss_cheese",
    "name": "Turkey & Swiss Cheese",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "With cole slaw & Russian dressing",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 242,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "hot_pastrami_or_corned_beef",
    "name": "Hot Pastrami or Corned Beef",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "Between our potato pancakes, side of horseradish",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 243,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "braised_brisket_of_beef",
    "name": "Braised Brisket of Beef",
    "department": "Sandwiches & Deli",
    "subcategory": "Deli",
    "description": "Between two potato pancakes, side of homemade applesauce",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 244,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "sandwiches_deli_sandwiches_tuna_salad",
    "name": "Tuna Salad",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 245,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sandwiches_deli_sandwiches_chicken_salad",
    "name": "Chicken Salad",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 246,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sandwiches_deli_sandwiches_egg_salad",
    "name": "Egg Salad",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 8.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 247,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sandwiches_deli_sandwiches_chunky_shrimp_salad",
    "name": "Chunky Shrimp Salad",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 19.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 248,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sandwiches_deli_sandwiches_individual_tuna",
    "name": "Individual Tuna",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 249,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sandwiches_deli_sandwiches_individual_salmon",
    "name": "Individual Salmon",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 250,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "bacon_lettuce_tomato",
    "name": "Bacon, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 9.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 251,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "sandwiches_deli_sandwiches_american_cheese",
    "name": "American Cheese",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 8.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 252,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sandwiches_deli_sandwiches_imported_swiss_cheese",
    "name": "Imported Swiss Cheese",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 8.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 253,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sardine_sandwich",
    "name": "Sardine Sandwich",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 10.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 254,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "lettuce_tomato_sandwich",
    "name": "Lettuce & Tomato Sandwich",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 255,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "grilled_american_or_swiss_cheese",
    "name": "Grilled American or Swiss Cheese",
    "department": "Sandwiches & Deli",
    "subcategory": "Sandwiches",
    "description": "With Tomato $9.95, With Bacon or Ham $10.95, With Taylor Ham $10.95, With Bacon & Tomato $11.95",
    "basePrice": 8.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 256,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "open_faced_hot_turkey_sandwich",
    "name": "Open-Faced Hot Turkey Sandwich",
    "department": "Sandwiches & Deli",
    "subcategory": "Hot Open Sandwiches",
    "description": "With gravy and french fries",
    "basePrice": 20.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 257,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "open_faced_hot_roast_beef_sandwich",
    "name": "Open-Faced Hot Roast Beef Sandwich",
    "department": "Sandwiches & Deli",
    "subcategory": "Hot Open Sandwiches",
    "description": "With gravy and french fries",
    "basePrice": 20.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 258,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "open_faced_brisket_of_beef",
    "name": "Open-Faced Brisket of Beef",
    "department": "Sandwiches & Deli",
    "subcategory": "Hot Open Sandwiches",
    "description": "With gravy and french fries",
    "basePrice": 20.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 259,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "club_sliced_turkey_bacon_lettuce_tomato",
    "name": "Club: Sliced Turkey, Bacon, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 260,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "name": "Tuna Fish Salad, Sliced Egg, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 261,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list."
  },
  {
    "id": "chicken_salad_bacon_lettuce_tomato",
    "name": "Chicken Salad, Bacon, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 262,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list."
  },
  {
    "id": "egg_salad_bacon_lettuce_tomato",
    "name": "Egg Salad, Bacon, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 263,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list."
  },
  {
    "id": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "name": "Roast Beef, Imported Swiss Cheese, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 264,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "ham_imported_swiss_cheese_lettuce_tomato",
    "name": "Ham, Imported Swiss Cheese, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 265,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "chopped_chicken_liver_bacon_lettuce_tomato",
    "name": "Chopped Chicken Liver, Bacon, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 266,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "name": "Chunky Shrimp Salad, Bacon, Lettuce, Tomato & Mayonnaise",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 21.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 267,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "name": "Grilled Chicken Club with Bacon, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 268,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "hamburger_club_with_bacon_lettuce_tomato",
    "name": "Hamburger Club with Bacon, Lettuce & Tomato",
    "department": "Sandwiches & Deli",
    "subcategory": "Triple Decker Sandwiches",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 269,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "homemade_potato_salad_or_homemade_cole_slaw",
    "name": "Homemade Potato Salad or Homemade Cole Slaw",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 270,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact dressing list. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "side_of_pasta",
    "name": "Side of Pasta",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 271,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "homemade_mashed_potatoes",
    "name": "Homemade Mashed Potatoes",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 272,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "french_fries",
    "name": "French Fries",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "With Gravy $6.50, with Cheese $7.00, with Cheese & Gravy $7.95",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 273,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "baked_potato",
    "name": "Baked Potato",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 274,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "home_fries",
    "name": "Home Fries",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 275,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "side_of_rice",
    "name": "Side of Rice",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 276,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "onion_rings",
    "name": "Onion Rings",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 7.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 277,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "ala_carte_vegetables",
    "name": "Ala Carte Vegetables",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 278,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "health_salad",
    "name": "Health Salad",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 279,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact dressing list. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "pita",
    "name": "Pita",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 1.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 280,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "cottage_cheese",
    "name": "Cottage Cheese",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 281,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "souffle_of_cottage_cheese",
    "name": "Souffle of Cottage Cheese",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 1.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 282,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "feta_cheese",
    "name": "Feta Cheese",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 283,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "homemade_applesauce",
    "name": "Homemade Applesauce",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 284,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "meatball_each",
    "name": "Meatball (each)",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 285,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sausage_pork_or_turkey",
    "name": "Sausage (Pork or Turkey)",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 286,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "bacon_ham_or_taylor_ham",
    "name": "Bacon, Ham, or Taylor Ham",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 287,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "canadian_bacon",
    "name": "Canadian Bacon",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 6.25,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 288,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "turkey_bacon",
    "name": "Turkey Bacon",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 289,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "corned_beef_hash",
    "name": "Corned Beef Hash",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 7.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 290,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "hard_roll_with_butter",
    "name": "Hard Roll with Butter",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 2.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 291,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "toast_with_butter_jelly",
    "name": "Toast with Butter & Jelly",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 2.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 292,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "english_muffin_with_butter_jelly",
    "name": "English Muffin with Butter & Jelly",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 2.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 293,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "blueberry_muffin_or_apple_cinnamon_muffin",
    "name": "Blueberry Muffin or Apple Cinnamon Muffin",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 294,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "chocolate_chip_muffin",
    "name": "Chocolate Chip Muffin",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 295,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "corn_or_bran_muffin",
    "name": "Corn or Bran Muffin",
    "department": "Sides & Sweets",
    "subcategory": "Side Orders",
    "description": "",
    "basePrice": 4.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 296,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "country_style_apple_pie",
    "name": "Country Style Apple Pie",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 297,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "sugar_free_apple_pie",
    "name": "Sugar Free Apple Pie",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 298,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "cheesecake",
    "name": "Cheesecake",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 299,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "sugar_free_cheesecake",
    "name": "Sugar Free Cheesecake",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 300,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "strawberry_cheesecake",
    "name": "Strawberry Cheesecake",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 6.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 301,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "apple_cherry_or_blueberry_crumb_pie",
    "name": "Apple, Cherry or Blueberry Crumb Pie",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 302,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "lemon_meringue_pie",
    "name": "Lemon Meringue Pie",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 303,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "blackout_cake",
    "name": "Blackout Cake",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 304,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chocolate_cake",
    "name": "Chocolate Cake",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 305,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "seven_layer_cake",
    "name": "Seven Layer Cake",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 306,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "carrot_cake",
    "name": "Carrot Cake",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 307,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "pound_cake",
    "name": "Pound Cake",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 3.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 308,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "apple_turnover",
    "name": "Apple Turnover",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 309,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "cannoli",
    "name": "Cannoli",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 310,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "linzer_tart",
    "name": "Linzer Tart",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 3.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 311,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "danish",
    "name": "Danish",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 3.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 312,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "almond_horn",
    "name": "Almond Horn",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 313,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "hamantaschen",
    "name": "Hamantaschen",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 4.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 314,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "assorted_strudels",
    "name": "Assorted Strudels",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 315,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "babka",
    "name": "Babka",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 316,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chocolate_babka",
    "name": "Chocolate Babka",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 5.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 317,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "brownie",
    "name": "Brownie",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 3.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 318,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "rice_pudding",
    "name": "Rice Pudding",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 4.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 319,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "bread_pudding",
    "name": "Bread Pudding",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 320,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "jello_with_whipped_topping",
    "name": "Jello with Whipped Topping",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 321,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "fresh_strawberries",
    "name": "Fresh Strawberries",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 322,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chocolate_chip_cookie",
    "name": "Chocolate Chip Cookie",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 3.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 323,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "black_white_cookie",
    "name": "Black & White Cookie",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 3.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 324,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "eclair",
    "name": "Eclair",
    "department": "Sides & Sweets",
    "subcategory": "Homemade Desserts",
    "description": "",
    "basePrice": 3.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 325,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "hamburger_or_grilled_chicken_sandwich",
    "name": "Hamburger or Grilled Chicken Sandwich",
    "department": "Kids",
    "subcategory": "Kids Korner",
    "description": "",
    "basePrice": 10.95,
    "isKids": true,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 326,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "kids_kids_korner_chicken_fingers",
    "name": "Chicken Fingers",
    "department": "Kids",
    "subcategory": "Kids Korner",
    "description": "",
    "basePrice": 10.65,
    "isKids": true,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 327,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify kids dipping sauce choices. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "fried_chicken_nuggets",
    "name": "Fried Chicken Nuggets",
    "department": "Kids",
    "subcategory": "Kids Korner",
    "description": "",
    "basePrice": 10.25,
    "isKids": true,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 328,
    "reviewNeeded": true,
    "reviewNotes": "Verify kids dipping sauce choices. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "grilled_hot_dog",
    "name": "Grilled Hot Dog",
    "department": "Kids",
    "subcategory": "Kids Korner",
    "description": "",
    "basePrice": 8.95,
    "isKids": true,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 329,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "cheeseburger",
    "name": "Cheeseburger",
    "department": "Kids",
    "subcategory": "Kids Korner",
    "description": "",
    "basePrice": 11.5,
    "isKids": true,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 330,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "fried_fish",
    "name": "Fried Fish",
    "department": "Kids",
    "subcategory": "Kids Korner",
    "description": "",
    "basePrice": 9.95,
    "isKids": true,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 331,
    "reviewNeeded": true,
    "reviewNotes": "Verify kids dipping sauce choices. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "spaghetti_meatball_complete",
    "name": "Spaghetti & Meatball (Complete)",
    "department": "Kids",
    "subcategory": "Kids Korner",
    "description": "",
    "basePrice": 9.95,
    "isKids": true,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 332,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "macaroni_cheese_complete",
    "name": "Macaroni & Cheese (Complete)",
    "department": "Kids",
    "subcategory": "Kids Korner",
    "description": "",
    "basePrice": 9.95,
    "isKids": true,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 333,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "grilled_cheese_or_peanut_butter_jelly",
    "name": "Grilled Cheese or Peanut Butter & Jelly",
    "department": "Kids",
    "subcategory": "Kids Korner",
    "description": "",
    "basePrice": 8.95,
    "isKids": true,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 334,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "two_eggs_any_style",
    "name": "Two Eggs (Any Style)",
    "department": "Breakfast",
    "subcategory": "Eggs",
    "description": "With Bacon, Ham, or Sausage (Pork or Turkey) $11.95, With Taylor Ham $11.95",
    "basePrice": 7.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 335,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "single_egg",
    "name": "Single Egg",
    "department": "Breakfast",
    "subcategory": "Eggs",
    "description": "With Bacon, Ham, or Sausage (Pork or Turkey) $9.95, With Taylor Ham $9.95",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 336,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "sliced_steak_eggs",
    "name": "Sliced Steak & Eggs",
    "department": "Breakfast",
    "subcategory": "Eggs",
    "description": "",
    "basePrice": 24.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 337,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "corned_beef_hash_with_two_eggs",
    "name": "Corned Beef Hash with Two Eggs",
    "department": "Breakfast",
    "subcategory": "Eggs",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 338,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "eggs_benedict",
    "name": "Eggs Benedict",
    "department": "Breakfast",
    "subcategory": "Eggs",
    "description": "Served with home fries",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 339,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "homemade_blintzes",
    "name": "Homemade Blintzes",
    "department": "Breakfast",
    "subcategory": "Eggs",
    "description": "Cheese blintzes with a souffle of blueberry and sour cream",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 340,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "oatmeal_cup",
    "name": "Oatmeal — Cup",
    "department": "Breakfast",
    "subcategory": "Eggs",
    "description": "",
    "basePrice": 3.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 341,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "oatmeal_bowl",
    "name": "Oatmeal — Bowl",
    "department": "Breakfast",
    "subcategory": "Eggs",
    "description": "",
    "basePrice": 4.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 342,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "egg_sandwich",
    "name": "Egg Sandwich",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 343,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "egg_cheese",
    "name": "Egg & Cheese",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 7.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 344,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "taylor_ham_sandwich",
    "name": "Taylor Ham Sandwich",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 8.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 345,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "ham_or_bacon_or_salami_or_sausage_egg",
    "name": "Ham or Bacon or Salami or Sausage & Egg",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 9.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 346,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "breakfast_egg_sandwiches_western",
    "name": "Western",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 9.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 347,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "taylor_ham_cheese",
    "name": "Taylor Ham & Cheese",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 9.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 348,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "taylor_ham_egg",
    "name": "Taylor Ham & Egg",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 9.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 349,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "taylor_ham_egg_cheese",
    "name": "Taylor Ham, Egg & Cheese",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 10.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 350,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "breakfast_egg_sandwiches_mixed_deli",
    "name": "Mixed Deli",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 351,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "avocado_toast_platter",
    "name": "Avocado Toast Platter",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "With two eggs any style, served with home fries or vegetables",
    "basePrice": 17.25,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 352,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "atzon_brei",
    "name": "Μatzon Brei",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "Pancake style, served with our homemade applesauce and sour cream",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 353,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "challah_french_toast_plain_or_raisin",
    "name": "Challah French Toast (Plain or Raisin)",
    "department": "Breakfast",
    "subcategory": "Egg Sandwiches",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 354,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "plain",
    "name": "Plain",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 8.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 355,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "breakfast_omelettes_american_cheese",
    "name": "American Cheese",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 10.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 356,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "breakfast_omelettes_imported_swiss_cheese",
    "name": "Imported Swiss Cheese",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 10.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 357,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "cheddar_cheese",
    "name": "Cheddar Cheese",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 10.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 358,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "breakfast_omelettes_ham_cheese",
    "name": "Ham & Cheese",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 359,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "breakfast_omelettes_turkey",
    "name": "Turkey",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 14.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 360,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "bacon_or_ham",
    "name": "Bacon or Ham",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 361,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "spanish",
    "name": "Spanish",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 362,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "feta_tomato",
    "name": "Feta & Tomato",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 363,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "salami_eggs_pancake_style",
    "name": "Salami & Eggs (Pancake Style)",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 364,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "sausage",
    "name": "Sausage",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 12.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 365,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "onion",
    "name": "Onion",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 9.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 366,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "fresh_mushrooms",
    "name": "Fresh Mushrooms",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 367,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "chicken_liver",
    "name": "Chicken Liver",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "With fresh mushrooms & onions",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 368,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "nova_onion",
    "name": "Nova & Onion",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 369,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "breakfast_omelettes_mixed_deli",
    "name": "Mixed Deli",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 370,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "breakfast_omelettes_western",
    "name": "Western",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 371,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "spinach",
    "name": "Spinach",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 372,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "broccoli",
    "name": "Broccoli",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 373,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "scallion_cream_cheese",
    "name": "Scallion & Cream Cheese",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 374,
    "reviewNeeded": true,
    "reviewNotes": "Verify exact house bread types."
  },
  {
    "id": "farmer_s_omelette",
    "name": "Farmer's Omelette",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "With broccoli, mushrooms, onions, tomatoes, and green peppers",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 375,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "italian_omelette",
    "name": "Italian Omelette",
    "department": "Breakfast",
    "subcategory": "Omelettes",
    "description": "With sausage, peppers, mozzarella, and mushrooms",
    "basePrice": 13.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 376,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact house bread types."
  },
  {
    "id": "german_apple_pancake",
    "name": "German Apple Pancake",
    "department": "Breakfast",
    "subcategory": "From the Griddle",
    "description": "Breathtaking open crepe with fresh apples & cinnamon sugar",
    "basePrice": 16.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 377,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "buttermilk_pancakes",
    "name": "Buttermilk Pancakes",
    "department": "Breakfast",
    "subcategory": "From the Griddle",
    "description": "With Ham, Bacon, Sausage, or Taylor Ham $12.50",
    "basePrice": 9.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 378,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "blueberry_pancakes",
    "name": "Blueberry Pancakes",
    "department": "Breakfast",
    "subcategory": "From the Griddle",
    "description": "With Ham, Bacon, Sausage, or Taylor Ham $14.50. Short Stack $9.95",
    "basePrice": 11.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 379,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chocolate_chip_pancakes",
    "name": "Chocolate Chip Pancakes",
    "department": "Breakfast",
    "subcategory": "From the Griddle",
    "description": "Short Stack $9.95",
    "basePrice": 12.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 380,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "short_stack_of_pancakes",
    "name": "Short Stack of Pancakes",
    "department": "Breakfast",
    "subcategory": "From the Griddle",
    "description": "",
    "basePrice": 7.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 381,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "silver_dollars",
    "name": "Silver Dollars",
    "department": "Breakfast",
    "subcategory": "From the Griddle",
    "description": "",
    "basePrice": 8.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 382,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "french_toast",
    "name": "French Toast",
    "department": "Breakfast",
    "subcategory": "From the Griddle",
    "description": "",
    "basePrice": 9.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 383,
    "reviewNeeded": true,
    "reviewNotes": "Menu source has no description; customization detail is operational inference."
  },
  {
    "id": "belgian_waffle",
    "name": "Belgian Waffle",
    "department": "Breakfast",
    "subcategory": "From the Griddle",
    "description": "With Strawberries $11.95",
    "basePrice": 9.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 384,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "toasted_bagel_with_butter_jelly",
    "name": "Toasted Bagel with Butter & Jelly",
    "department": "Breakfast",
    "subcategory": "Bagel Bin",
    "description": "",
    "basePrice": 3.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 385,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "toasted_bagel_with_cream_cheese",
    "name": "Toasted Bagel with Cream Cheese",
    "department": "Breakfast",
    "subcategory": "Bagel Bin",
    "description": "",
    "basePrice": 5.25,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 386,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "nova_platter",
    "name": "Nova Platter",
    "department": "Breakfast",
    "subcategory": "Bagel Bin",
    "description": "Served with Toasted Bagel, Cream Cheese, Lettuce, Tomato, Bermuda Onion & Cucumbers",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 387,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "smoked_whitefish_platter",
    "name": "Smoked Whitefish Platter",
    "department": "Breakfast",
    "subcategory": "Bagel Bin",
    "description": "Served with Toasted Bagel, Cream Cheese, Lettuce, Tomato, Bermuda Onion & Cucumbers",
    "basePrice": 17.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 388,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options."
  },
  {
    "id": "smoked_whitefish_salad_platter",
    "name": "Smoked Whitefish Salad Platter",
    "department": "Breakfast",
    "subcategory": "Bagel Bin",
    "description": "Served with Toasted Bagel, Cream Cheese, Lettuce, Tomato, Bermuda Onion & Cucumbers",
    "basePrice": 15.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 389,
    "reviewNeeded": true,
    "reviewNotes": "Verify protein cook/preparation options. Verify exact dressing list."
  },
  {
    "id": "fresh_ground_coffee_regular_or_decaf",
    "name": "Fresh Ground Coffee (Regular or Decaf)",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 390,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "coffee_to_go_small",
    "name": "Coffee To Go — Small",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 391,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "coffee_to_go_large",
    "name": "Coffee To Go — Large",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 392,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "tea",
    "name": "Tea",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 2.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 393,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "herbal_tea",
    "name": "Herbal Tea",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 394,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "hot_chocolate_with_whipped_topping",
    "name": "Hot Chocolate with Whipped Topping",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 395,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "fresh_squeezed_orange_juice_small",
    "name": "Fresh Squeezed Orange Juice — Small",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 396,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "fresh_squeezed_orange_juice_large",
    "name": "Fresh Squeezed Orange Juice — Large",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 5.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 397,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "grapefruit_juice_small",
    "name": "Grapefruit Juice — Small",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 398,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "grapefruit_juice_large",
    "name": "Grapefruit Juice — Large",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 5.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 399,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "apple_juice_small",
    "name": "Apple Juice — Small",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 400,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "apple_juice_large",
    "name": "Apple Juice — Large",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 5.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 401,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "cranberry_juice_small",
    "name": "Cranberry Juice — Small",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 402,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "cranberry_juice_large",
    "name": "Cranberry Juice — Large",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 5.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 403,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "pineapple_juice_small",
    "name": "Pineapple Juice — Small",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 404,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "pineapple_juice_large",
    "name": "Pineapple Juice — Large",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 5.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 405,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "tomato_juice_small",
    "name": "Tomato Juice — Small",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 406,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "tomato_juice_large",
    "name": "Tomato Juice — Large",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 5.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 407,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "milk_or_skim_milk_small",
    "name": "Milk or Skim Milk — Small",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.25,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 408,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "milk_or_skim_milk_large",
    "name": "Milk or Skim Milk — Large",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 4.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 409,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chocolate_milk_small",
    "name": "Chocolate Milk — Small",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 410,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "chocolate_milk_large",
    "name": "Chocolate Milk — Large",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 5.0,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 411,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "iced_tea",
    "name": "Iced Tea",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 412,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "iced_coffee_or_iced_decaffeinated",
    "name": "Iced Coffee or Iced Decaffeinated",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.75,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 413,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "pepsi",
    "name": "Pepsi",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 414,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "diet_pepsi",
    "name": "Diet Pepsi",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 415,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "sierra_mist",
    "name": "Sierra Mist",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 416,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "lemonade",
    "name": "Lemonade",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 417,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "tropicana_orange_twister",
    "name": "Tropicana Orange Twister",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 418,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "mug_root_beer",
    "name": "Mug Root Beer",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 3.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 419,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "no_salt_seltzer",
    "name": "No-Salt Seltzer",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 1.55,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 420,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "bottled_water",
    "name": "Bottled Water",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 2.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 421,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "orange_juice_to_go_10_oz",
    "name": "Orange Juice To-Go — 10 oz.",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 5.5,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 422,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "orange_juice_to_go_16_oz",
    "name": "Orange Juice To-Go — 16 oz.",
    "department": "Drinks & Ice Cream",
    "subcategory": "Beverages",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 423,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "old_fashioned_shake",
    "name": "Old Fashioned Shake",
    "department": "Drinks & Ice Cream",
    "subcategory": "Shakes, Sundaes & Ice Cream",
    "description": "Extra Thick $7.95",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 424,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "traditional_ice_cream_soda",
    "name": "Traditional Ice Cream Soda",
    "department": "Drinks & Ice Cream",
    "subcategory": "Shakes, Sundaes & Ice Cream",
    "description": "",
    "basePrice": 6.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 425,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "delicious_ice_cream_sundae",
    "name": "Delicious Ice Cream Sundae",
    "department": "Drinks & Ice Cream",
    "subcategory": "Shakes, Sundaes & Ice Cream",
    "description": "",
    "basePrice": 7.95,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 426,
    "reviewNeeded": false,
    "reviewNotes": ""
  },
  {
    "id": "dish_of_ice_cream_chocolate_vanilla_or_strawberry",
    "name": "Dish of Ice Cream (Chocolate, Vanilla or Strawberry)",
    "department": "Drinks & Ice Cream",
    "subcategory": "Shakes, Sundaes & Ice Cream",
    "description": "",
    "basePrice": 5.25,
    "isKids": false,
    "hasKidsVersion": false,
    "isSpecial": false,
    "sourceSortOrder": 427,
    "reviewNeeded": false,
    "reviewNotes": ""
  }
] as MenuItemData[];

export const modifierGroups: ModifierGroupData[] = [
  {
    "id": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "bread type / no bread",
    "requiresReview": true
  },
  {
    "id": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "kind": "bread_prep",
    "displayName": "Bread Preparation",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "toasted / not toasted",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Fresh Mozzarella / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chicken Cutlet / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Vodka Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Vodka Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Cheddar / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Buffalo Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Buffalo Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "American Cheese / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_BACON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chicken Cutlet / Bacon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Ranch Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Ranch Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Pesto Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Pesto Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Balsamic Glaze",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Balsamic Glaze: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_PEPPERONI_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chicken Cutlet / Pepperoni / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "add cheese / cheese type / no cheese",
    "requiresReview": true
  },
  {
    "id": "MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Chipotle Mayo",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Chipotle Mayo: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Fried Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "French Fries / Cole Slaw / Pickle",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_BACON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Fried Chicken / Bacon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "BBQ Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "BBQ Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Mozzarella / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Marinara Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Marinara Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Swiss Cheese / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_HAM_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Fried Chicken / Ham / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Honey Mustard",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Honey Mustard: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Mayo",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Mayo: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "wrap / no wrap",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Blue Cheese / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Grilled Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Cheese / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_STEAK_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Steak / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_GOAT_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Goat Cheese / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Turkey / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Roast Beef / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_GYRO_MEAT_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Gyro Meat / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Creamy Italian Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Creamy Italian Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_MONTEREY_JACK_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Monterey Jack / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Sour Cream",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Sour Cream: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Caesar Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Caesar Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SHRIMP_BACON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Shrimp / Bacon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Lemon Garlic Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Lemon Garlic Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Sesame Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Black Olive Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Black Olive Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "White Balsamic Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "White Balsamic Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Olive Oil & Lemon Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Olive Oil & Lemon Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Raspberry Vinaigrette",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Raspberry Vinaigrette: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_MARINATED_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Marinated Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Teriyaki Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Teriyaki Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_FOCACCIA_NO_BREAD",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "focaccia / no bread",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Tuna / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Lemon Vinaigrette",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Lemon Vinaigrette: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BLACKENED_SALMON_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Blackened Salmon / Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Poppy White Wine Vinaigrette",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Poppy White Wine Vinaigrette: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Honey Balsamic Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Honey Balsamic Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Monterey Jack / Cheddar / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_EGG_EGG_EGG_NO_EGG",
    "kind": "egg",
    "displayName": "Egg",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "egg / no egg",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BLACKENED_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Blackened Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Choice of Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Choice of Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_MARINATED_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Sesame Chicken / Marinated Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Dijon Mustard",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Dijon Mustard: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "sandwich roll / no bread",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CRAB_CAKE_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Crab Cake / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Tartar Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Tartar Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_SUB_ROLL_NO_BREAD",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "sub roll / no bread",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Teriyaki Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Teriyaki Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BURGER_PATTY_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Burger Patty / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "kind": "protein_cook",
    "displayName": "Cook Temperature",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Rare / Medium Rare / Medium / Medium Well / Well Done",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BUFFALO_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Buffalo Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Cilantro Lime Vinaigrette",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Cilantro Lime Vinaigrette: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Meatball / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Cheese / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Pasta / Vegetables",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Shrimp / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Veal / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Bacon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SALMON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Salmon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Ham / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SALAMI_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Salami / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CHICKEN_LIVER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chicken Liver / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Feta / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Salsa",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Salsa: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Guacamole",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Guacamole: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SOUP_ADD_IN_SOUP_ADD_IN_MATZOH_BALL_NOODLES",
    "kind": "soup_add_in",
    "displayName": "Soup Add-In",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Soup Add-In",
    "requiresReview": false
  },
  {
    "id": "MG_SOUP_OF_THE_DAY_SOUP_OF_THE_DAY_DAILY_SOUP_MANAGER_DEFINED_VERIFY",
    "kind": "soup_of_the_day",
    "displayName": "Soup of the Day",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Soup of the Day",
    "requiresReview": true
  },
  {
    "id": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Two Vegetables / Side of Spaghetti",
    "requiresReview": false
  },
  {
    "id": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "kind": "starter",
    "displayName": "Starter",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "starter: Soup / Tossed Salad",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Cranberry Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Cranberry Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BRISKET_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Brisket / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SAUSAGE_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Sausage / Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SALMON_TUNA_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Salmon / Tuna / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SCALLOPS_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Scallops / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_FLOUNDER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Flounder / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SWORDFISH_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Swordfish / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Swordfish / Flounder / Scallops / Clams / Shrimp / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PREPARATION_PREPARATION_BROILED_FRIED",
    "kind": "preparation",
    "displayName": "Preparation",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Preparation",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_GROUND_SIRLOIN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Ground Sirloin / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Applesauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Applesauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_TURKEY_STEAK_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Turkey / Steak / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SKIRT_STEAK_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Skirt Steak / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Tossed Salad + dressing",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "kind": "side_secondary",
    "displayName": "Additional Side Choice",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "entrée-specific pasta/side where applicable",
    "requiresReview": true
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CLAMS_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Clams / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_CHOOSE_SAUCE_WHITE_CLAM_SAUCE_RED_CLAM_SAUCE",
    "kind": "sauce",
    "displayName": "Choose Sauce",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Choose Sauce: White Clam Sauce / Red Clam Sauce",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Garlic White Wine Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Garlic White Wine Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CLAMS_SHRIMP_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Clams / Shrimp / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_CHOOSE_HEAT_MILD_SPICY",
    "kind": "sauce",
    "displayName": "Choose Heat",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Choose Heat: Mild / Spicy",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_HEAT_CHOOSE_HEAT_MILD_SPICY",
    "kind": "choose_heat",
    "displayName": "Choose Heat",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Heat",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Gravy",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Gravy: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_TUNA_FISH_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Tuna / Fish / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Roast Turkey / Roast Beef / Ham / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SARDINE_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Sardine / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_BUN_FOCACCIA_BREAD_NO_BREAD",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Bun / Focaccia Bread / No Bread",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Soy Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Soy Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_CHOOSE_SAUCE_SOY_SAUCE_GARLIC_AND_OLIVE_OIL",
    "kind": "sauce",
    "displayName": "Choose Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Choose Sauce: Soy Sauce / Garlic & Olive Oil",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_PROTEIN_COMPONENT_VERIFY",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Protein component — verify",
    "requiresReview": true
  },
  {
    "id": "MG_PROTEIN_COOK_PROTEIN_PREPARATION_PREPARATION_VERIFY",
    "kind": "protein_cook",
    "displayName": "Protein Preparation",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "cook/preparation data required — verify",
    "requiresReview": true
  },
  {
    "id": "MG_PROTEIN_PROTEIN_STEAK_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Steak / Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_SANDWICH_BREAD_NO_BREAD",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "sandwich bread / no bread",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_TURKEY_MEATLOAF_CHICKEN_MEATLOAF_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Turkey Meatloaf / Chicken Meatloaf / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_PREP_BREAD_PREPARATION_GRILLED_TOASTED",
    "kind": "bread_prep",
    "displayName": "Bread Preparation",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "grilled/toasted",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_HERO_ROLL_NO_BREAD",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "hero roll / no bread",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_PREP_BREAD_PREPARATION_PRESSED_TOASTED",
    "kind": "bread_prep",
    "displayName": "Bread Preparation",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "pressed/toasted",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_FRENCH_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "French Fries / No Side / substitution",
    "requiresReview": true
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_PITA_NO_PITA",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Pita / No Pita",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_GYRO_MEAT_CHICKEN_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Gyro Meat / Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Tzatziki Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Tzatziki Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Balsamic Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Balsamic Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_TORTILLA_NO_TORTILLA",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "tortilla / no tortilla",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Cottage Cheese / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Roast Turkey / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Lean Beef / Lean Beef Patty / Turkey Patty / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Turkey Burger / Chicken Burger / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Grilled Chicken / Bacon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Balsamic Vinaigrette",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Balsamic Vinaigrette: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_PROVOLONE_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Provolone / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BLACKENED_SALMON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Blackened Salmon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "add fries / onion rings / side",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "bun / no bun",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Beef Burger / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "French Fries / substitution",
    "requiresReview": true
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Bacon / Beef Burger / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Turkey Burger / Veggie Burger / Chicken Burger / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SALMON_BURGER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Salmon Burger / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_HOT_DOG_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Hot Dog / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_PASTRAMI_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Pastrami / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CORNED_BEEF_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Corned Beef / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Russian Dressing",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Russian Dressing: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CORNED_BEEF_PASTRAMI_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Corned Beef / Pastrami / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chopped Liver / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CORNED_BEEF_CHOPPED_LIVER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Corned Beef / Chopped Liver / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_TURKEY_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chopped Liver / Turkey / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_PASTRAMI_CORNED_BEEF_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Pastrami / Corned Beef / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Horseradish",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Horseradish: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_SWISS_CHEESE_NO_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "American Cheese / Swiss Cheese / No Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BACON_TAYLOR_HAM_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Bacon / Taylor Ham / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_ADD_TOMATO_ADD_TOMATO_TOMATO",
    "kind": "add_tomato",
    "displayName": "Add Tomato",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Add Tomato",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_BACON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Roast Turkey / Bacon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CHICKEN_BACON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chicken / Bacon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chopped Liver / Bacon / Chicken Liver / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Burger Patty / Bacon / Ham / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_CHOOSE_SIDE_POTATO_SALAD_COLE_SLAW",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Choose Side: Potato Salad / Cole Slaw",
    "requiresReview": false
  },
  {
    "id": "MG_ADD_ON_ADD_ON_GRAVY_CHEESE_CHEESE_AND_GRAVY",
    "kind": "add_on",
    "displayName": "Add-On",
    "minSelections": 0,
    "maxSelections": 3,
    "internalNotes": "Explicit item customization: Add-On",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_PORK_SAUSAGE_TURKEY_SAUSAGE_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Pork Sausage / Turkey Sausage / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_TURKEY_BACON_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Turkey / Bacon / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_HARD_ROLL_WITH_BUTTER",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Hard Roll with Butter",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_TOAST_WITH_BUTTER_AND_JELLY",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Toast with Butter & Jelly",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_ENGLISH_MUFFIN_WITH_BUTTER_AND_JELLY",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "English Muffin with Butter & Jelly",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_BLUEBERRY_MUFFIN_OR_APPLE_CINNAMON_MUFFIN",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Blueberry Muffin or Apple Cinnamon Muffin",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_BLUEBERRY_MUFFIN_APPLE_CINNAMON_MUFFIN",
    "kind": "choose_muffin",
    "displayName": "Choose Muffin",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Muffin",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_CHOCOLATE_CHIP_MUFFIN",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Chocolate Chip Muffin",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_CORN_OR_BRAN_MUFFIN",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Corn or Bran Muffin",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_CORN_MUFFIN_BRAN_MUFFIN",
    "kind": "choose_muffin",
    "displayName": "Choose Muffin",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Muffin",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY",
    "kind": "choose_pie",
    "displayName": "Choose Pie",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Pie",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Hamburger / Grilled Chicken Sandwich / Burger Patty / Grilled Chicken / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "French Fries / One Vegetable",
    "requiresReview": false
  },
  {
    "id": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "kind": "dessert",
    "displayName": "Dessert",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "dessert: Jello / Ice Cream",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "kind": "choose_dessert",
    "displayName": "Choose Dessert",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Dessert",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Dipping Sauce",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Dipping Sauce: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_FISH_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Fish / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_APPLIES_TO_GRILLED_CHEESE_SELECTION_STANDARD_NO_CHEESE_EXTRA_CHEES",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Applies to Grilled Cheese selection: standard / no cheese / extra cheese",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_SANDWICH_CHOOSE_SANDWICH_GRILLED_CHEESE_PEANUT_BUTTER_AND_JELLY",
    "kind": "choose_sandwich",
    "displayName": "Choose Sandwich",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Sandwich",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "toast / no bread; bread type",
    "requiresReview": true
  },
  {
    "id": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "kind": "bread_prep",
    "displayName": "Bread Preparation",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "toast prep: toasted / dry / buttered",
    "requiresReview": false
  },
  {
    "id": "MG_EGG_EGG_EGGS_NO_EGGS",
    "kind": "egg",
    "displayName": "Egg",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "eggs / no eggs",
    "requiresReview": false
  },
  {
    "id": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "kind": "egg_cook",
    "displayName": "Egg Cook",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Scrambled / Sunny Side Up / Over Easy / Over Medium / Over Hard",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Bacon / Pork Sausage / Turkey Sausage / Taylor Ham",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Home Fries / No Side / substitution",
    "requiresReview": true
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_2",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Toast / No Bread; bread type",
    "requiresReview": true
  },
  {
    "id": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_DRY_BUTTERED_BREAD_TYPE_SHOULD_BE_EXPLICIT_",
    "kind": "bread_prep",
    "displayName": "Bread Preparation",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Toasted / Dry / Buttered; bread type should be explicit",
    "requiresReview": true
  },
  {
    "id": "MG_EGG_EGG_EGGS_NO_EGGS_2",
    "kind": "egg",
    "displayName": "Egg",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Eggs / No Eggs",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BENEDICT_PROTEIN_COMPONENT_VERIFY_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Benedict protein component — verify / No Protein",
    "requiresReview": true
  },
  {
    "id": "MG_EGG_EGG_EGG_NO_EGG_2",
    "kind": "egg",
    "displayName": "Egg",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "egg / no egg",
    "requiresReview": false
  },
  {
    "id": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "kind": "egg_cook",
    "displayName": "Egg Cook",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Scrambled / fried / over style — house options should be explicit",
    "requiresReview": true
  },
  {
    "id": "MG_PROTEIN_PROTEIN_TAYLOR_HAM_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Taylor Ham / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Ham / Bacon / Salami / Sausage / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_HOME_FRIES_VEGETABLES_NO_SIDE",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Home Fries / Vegetables / No Side",
    "requiresReview": false
  },
  {
    "id": "MG_EGG_EGG_EGG_BASED_MATZOH_BREI",
    "kind": "egg",
    "displayName": "Egg",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "egg-based matzoh brei",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_CHALLAH_CHOOSE_CHALLAH_PLAIN_RAISIN",
    "kind": "choose_challah",
    "displayName": "Choose Challah",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Challah",
    "requiresReview": false
  },
  {
    "id": "MG_EGG_EGG_OMELETTE_EGGS",
    "kind": "egg",
    "displayName": "Egg",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "omelette eggs",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BACON_HAM_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Bacon / Ham / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_SAUSAGE_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Sausage / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_PROTEIN_PROTEIN_NOVA_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Nova / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Cream Cheese / No Cheese / Extra Cheese",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_3",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "toast / no bread",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP",
    "kind": "bread_prep",
    "displayName": "Bread Preparation",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "toast prep",
    "requiresReview": false
  },
  {
    "id": "MG_CHEESE_CHEESE_ADD_SUB_CHEESE",
    "kind": "cheese",
    "displayName": "Cheese",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "add/sub cheese",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_HOME_FRIES_SUBSTITUTION_VERIFY",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "home fries / substitution",
    "requiresReview": true
  },
  {
    "id": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Bacon / Sausage / Taylor Ham",
    "requiresReview": false
  },
  {
    "id": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "kind": "sauce",
    "displayName": "Syrup / Butter",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Syrup / Butter: normal / no / on side / extra",
    "requiresReview": false
  },
  {
    "id": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "kind": "side",
    "displayName": "Side",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "add Bacon / Ham / Sausage / Taylor Ham",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_SIZE_CHOOSE_SIZE_FULL_STACK_SHORT_STACK",
    "kind": "choose_size",
    "displayName": "Choose Size",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Size",
    "requiresReview": false
  },
  {
    "id": "MG_ADD_STRAWBERRIES_ADD_STRAWBERRIES_STRAWBERRIES",
    "kind": "add_strawberries",
    "displayName": "Add Strawberries",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Add Strawberries",
    "requiresReview": false
  },
  {
    "id": "MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL",
    "kind": "bread",
    "displayName": "Choose Bread",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "bagel / no bagel; bagel type if offered",
    "requiresReview": true
  },
  {
    "id": "MG_PROTEIN_PROTEIN_WHITEFISH_NO_PROTEIN",
    "kind": "protein",
    "displayName": "Protein",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Whitefish / No Protein",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_REGULAR_DECAF",
    "kind": "choose_coffee",
    "displayName": "Choose Coffee",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Coffee",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_MILK_CHOOSE_MILK_MILK_SKIM_MILK",
    "kind": "choose_milk",
    "displayName": "Choose Milk",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Milk",
    "requiresReview": false
  },
  {
    "id": "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_ICED_COFFEE_ICED_DECAF",
    "kind": "choose_coffee",
    "displayName": "Choose Coffee",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Coffee",
    "requiresReview": false
  },
  {
    "id": "MG_THICKNESS_THICKNESS_REGULAR_EXTRA_THICK",
    "kind": "thickness",
    "displayName": "Thickness",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Thickness",
    "requiresReview": false
  },
  {
    "id": "MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY",
    "kind": "flavor",
    "displayName": "Flavor",
    "minSelections": 0,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Flavor",
    "requiresReview": true
  },
  {
    "id": "MG_CHOOSE_FLAVOR_CHOOSE_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY",
    "kind": "choose_flavor",
    "displayName": "Choose Flavor",
    "minSelections": 1,
    "maxSelections": 1,
    "internalNotes": "Explicit item customization: Choose Flavor",
    "requiresReview": false
  }
] as ModifierGroupData[];

export const modifiers: ModifierData[] = [
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD_BREAD_TYPE_VERIFY",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "name": "bread type — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "name": "no bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED_TOASTED",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "name": "toasted",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED_NOT_TOASTED",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "name": "not toasted",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE_FRESH_MOZZARELLA",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "name": "Fresh Mozzarella",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN_CHICKEN_CUTLET",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN",
    "name": "Chicken Cutlet",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE_CHEDDAR",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "name": "Cheddar",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE_AMERICAN_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "American Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_BACON_NO_PROTEIN_CHICKEN_CUTLET",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_BACON_NO_PROTEIN",
    "name": "Chicken Cutlet",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_BACON_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_BACON_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_BACON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_BACON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_PEPPERONI_NO_PROTEIN_CHICKEN_CUTLET",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_PEPPERONI_NO_PROTEIN",
    "name": "Chicken Cutlet",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_PEPPERONI_NO_PROTEIN_PEPPERONI",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_PEPPERONI_NO_PROTEIN",
    "name": "Pepperoni",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_PEPPERONI_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_PEPPERONI_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE_ADD_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "name": "add cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE_CHEESE_TYPE_VERIFY",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "name": "cheese type — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "name": "no cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FRIED_CHICKEN_NO_PROTEIN_FRIED_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_NO_PROTEIN",
    "name": "Fried Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FRIED_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE_FRENCH_FRIES",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "name": "French Fries",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE_COLE_SLAW",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "name": "Cole Slaw",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE_PICKLE",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "name": "Pickle",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FRIED_CHICKEN_BACON_NO_PROTEIN_FRIED_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_BACON_NO_PROTEIN",
    "name": "Fried Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FRIED_CHICKEN_BACON_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_BACON_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FRIED_CHICKEN_BACON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_BACON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE_MOZZARELLA",
    "modifierGroupId": "MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "name": "Mozzarella",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE_SWISS_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Swiss Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FRIED_CHICKEN_HAM_NO_PROTEIN_FRIED_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_HAM_NO_PROTEIN",
    "name": "Fried Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FRIED_CHICKEN_HAM_NO_PROTEIN_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_HAM_NO_PROTEIN",
    "name": "Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FRIED_CHICKEN_HAM_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_HAM_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP_WRAP",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "name": "wrap",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP_NO_WRAP",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "name": "no wrap",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE_BLUE_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Blue Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN_GRILLED_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "name": "Grilled Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_STEAK_NO_PROTEIN_STEAK",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_STEAK_NO_PROTEIN",
    "name": "Steak",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_STEAK_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_STEAK_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "name": "Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_GOAT_CHEESE_NO_CHEESE_EXTRA_CHEESE_GOAT_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_GOAT_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Goat Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_GOAT_CHEESE_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_GOAT_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_GOAT_CHEESE_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_GOAT_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN_TURKEY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "name": "Turkey",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN_ROAST_BEEF",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN",
    "name": "Roast Beef",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GYRO_MEAT_NO_PROTEIN_GYRO_MEAT",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GYRO_MEAT_NO_PROTEIN",
    "name": "Gyro Meat",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GYRO_MEAT_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GYRO_MEAT_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MONTEREY_JACK_NO_CHEESE_EXTRA_CHEESE_MONTEREY_JACK",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_NO_CHEESE_EXTRA_CHEESE",
    "name": "Monterey Jack",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MONTEREY_JACK_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MONTEREY_JACK_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SHRIMP_BACON_NO_PROTEIN_SHRIMP",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_BACON_NO_PROTEIN",
    "name": "Shrimp",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SHRIMP_BACON_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_BACON_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SHRIMP_BACON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_BACON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SESAME_CHICKEN_NO_PROTEIN_SESAME_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_NO_PROTEIN",
    "name": "Sesame Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SESAME_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_MARINATED_CHICKEN_NO_PROTEIN_MARINATED_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MARINATED_CHICKEN_NO_PROTEIN",
    "name": "Marinated Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_MARINATED_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MARINATED_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_FOCACCIA_NO_BREAD_FOCACCIA",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_FOCACCIA_NO_BREAD",
    "name": "focaccia",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_FOCACCIA_NO_BREAD_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_FOCACCIA_NO_BREAD",
    "name": "no bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN_TUNA",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN",
    "name": "Tuna",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BLACKENED_SALMON_CHICKEN_NO_PROTEIN_BLACKENED_SALMON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_SALMON_CHICKEN_NO_PROTEIN",
    "name": "Blackened Salmon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BLACKENED_SALMON_CHICKEN_NO_PROTEIN_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_SALMON_CHICKEN_NO_PROTEIN",
    "name": "Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BLACKENED_SALMON_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_SALMON_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE_MONTEREY_JACK",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "name": "Monterey Jack",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE_CHEDDAR",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "name": "Cheddar",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_EGG_EGG_EGG_NO_EGG_EGG",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "name": "egg",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_EGG_EGG_EGG_NO_EGG_NO_EGG",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "name": "no egg",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BLACKENED_CHICKEN_NO_PROTEIN_BLACKENED_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_CHICKEN_NO_PROTEIN",
    "name": "Blackened Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BLACKENED_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SESAME_CHICKEN_MARINATED_CHICKEN_NO_PROTEIN_SESAME_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_MARINATED_CHICKEN_NO_PROTEIN",
    "name": "Sesame Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SESAME_CHICKEN_MARINATED_CHICKEN_NO_PROTEIN_MARINATED_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_MARINATED_CHICKEN_NO_PROTEIN",
    "name": "Marinated Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SESAME_CHICKEN_MARINATED_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_MARINATED_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD_SANDWICH_ROLL",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "name": "sandwich roll",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "name": "no bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CRAB_CAKE_NO_PROTEIN_CRAB_CAKE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CRAB_CAKE_NO_PROTEIN",
    "name": "Crab Cake",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CRAB_CAKE_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CRAB_CAKE_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_SUB_ROLL_NO_BREAD_SUB_ROLL",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SUB_ROLL_NO_BREAD",
    "name": "sub roll",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_SUB_ROLL_NO_BREAD_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SUB_ROLL_NO_BREAD",
    "name": "no bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BURGER_PATTY_NO_PROTEIN_BURGER_PATTY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BURGER_PATTY_NO_PROTEIN",
    "name": "Burger Patty",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BURGER_PATTY_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BURGER_PATTY_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE_RARE",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "name": "Rare",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE_MEDIUM_RARE",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "name": "Medium Rare",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE_MEDIUM",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "name": "Medium",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE_MEDIUM_WELL",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "name": "Medium Well",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE_WELL_DONE",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "name": "Well Done",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 5
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BUFFALO_CHICKEN_NO_PROTEIN_BUFFALO_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BUFFALO_CHICKEN_NO_PROTEIN",
    "name": "Buffalo Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BUFFALO_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BUFFALO_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN_MEATBALL",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "name": "Meatball",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2",
    "name": "Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SIDE_SIDE_PASTA_VEGETABLES_PASTA",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "name": "Pasta",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_PASTA_VEGETABLES_VEGETABLES",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "name": "Vegetables",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN_SHRIMP",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "name": "Shrimp",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN_VEAL",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN",
    "name": "Veal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SALMON_NO_PROTEIN_SALMON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_NO_PROTEIN",
    "name": "Salmon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SALMON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN",
    "name": "Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SALAMI_NO_PROTEIN_SALAMI",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALAMI_NO_PROTEIN",
    "name": "Salami",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SALAMI_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALAMI_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_LIVER_NO_PROTEIN_CHICKEN_LIVER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_LIVER_NO_PROTEIN",
    "name": "Chicken Liver",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_LIVER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_LIVER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE_FETA",
    "modifierGroupId": "MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE",
    "name": "Feta",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SOUP_ADD_IN_SOUP_ADD_IN_MATZOH_BALL_NOODLES_MATZOH_BALL",
    "modifierGroupId": "MG_SOUP_ADD_IN_SOUP_ADD_IN_MATZOH_BALL_NOODLES",
    "name": "Matzoh Ball",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SOUP_ADD_IN_SOUP_ADD_IN_MATZOH_BALL_NOODLES_NOODLES",
    "modifierGroupId": "MG_SOUP_ADD_IN_SOUP_ADD_IN_MATZOH_BALL_NOODLES",
    "name": "Noodles",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SOUP_OF_THE_DAY_SOUP_OF_THE_DAY_DAILY_SOUP_MANAGER_DEFINED_VERIFY_DAILY_SOUP_MANAGER_DEFINED_VERI",
    "modifierGroupId": "MG_SOUP_OF_THE_DAY_SOUP_OF_THE_DAY_DAILY_SOUP_MANAGER_DEFINED_VERIFY",
    "name": "Daily soup — manager-defined — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI_TWO_VEGETABLES",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "name": "Two Vegetables",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI_SIDE_OF_SPAGHETTI",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "name": "Side of Spaghetti",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_STARTER_STARTER_SOUP_TOSSED_SALAD_SOUP",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "name": "Soup",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_STARTER_STARTER_SOUP_TOSSED_SALAD_TOSSED_SALAD",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "name": "Tossed Salad",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BRISKET_NO_PROTEIN_BRISKET",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BRISKET_NO_PROTEIN",
    "name": "Brisket",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BRISKET_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BRISKET_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SAUSAGE_CHICKEN_NO_PROTEIN_SAUSAGE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SAUSAGE_CHICKEN_NO_PROTEIN",
    "name": "Sausage",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SAUSAGE_CHICKEN_NO_PROTEIN_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SAUSAGE_CHICKEN_NO_PROTEIN",
    "name": "Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SAUSAGE_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SAUSAGE_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SALMON_TUNA_NO_PROTEIN_SALMON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_TUNA_NO_PROTEIN",
    "name": "Salmon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SALMON_TUNA_NO_PROTEIN_TUNA",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_TUNA_NO_PROTEIN",
    "name": "Tuna",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SALMON_TUNA_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_TUNA_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SCALLOPS_NO_PROTEIN_SCALLOPS",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SCALLOPS_NO_PROTEIN",
    "name": "Scallops",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SCALLOPS_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SCALLOPS_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FLOUNDER_NO_PROTEIN_FLOUNDER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FLOUNDER_NO_PROTEIN",
    "name": "Flounder",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FLOUNDER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FLOUNDER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SWORDFISH_NO_PROTEIN_SWORDFISH",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_NO_PROTEIN",
    "name": "Swordfish",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SWORDFISH_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN_SWORDFISH",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN",
    "name": "Swordfish",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN_FLOUNDER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN",
    "name": "Flounder",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN_SCALLOPS",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN",
    "name": "Scallops",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN_CLAMS",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN",
    "name": "Clams",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN_SHRIMP",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN",
    "name": "Shrimp",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 5
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 6
  },
  {
    "id": "MOD_MG_PREPARATION_PREPARATION_BROILED_FRIED_BROILED",
    "modifierGroupId": "MG_PREPARATION_PREPARATION_BROILED_FRIED",
    "name": "Broiled",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PREPARATION_PREPARATION_BROILED_FRIED_FRIED",
    "modifierGroupId": "MG_PREPARATION_PREPARATION_BROILED_FRIED",
    "name": "Fried",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GROUND_SIRLOIN_NO_PROTEIN_GROUND_SIRLOIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GROUND_SIRLOIN_NO_PROTEIN",
    "name": "Ground Sirloin",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GROUND_SIRLOIN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GROUND_SIRLOIN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_STEAK_NO_PROTEIN_TURKEY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_STEAK_NO_PROTEIN",
    "name": "Turkey",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_STEAK_NO_PROTEIN_STEAK",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_STEAK_NO_PROTEIN",
    "name": "Steak",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_STEAK_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_STEAK_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SKIRT_STEAK_NO_PROTEIN_SKIRT_STEAK",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SKIRT_STEAK_NO_PROTEIN",
    "name": "Skirt Steak",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SKIRT_STEAK_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SKIRT_STEAK_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_TOSSED_SALAD_DRESSING_TOSSED_SALAD_DRESSING",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "name": "Tossed Salad + dressing",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL_ENTREE_SPECIFIC_",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "name": "entrée-specific pasta",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL_SIDE_WHERE_APPLI",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "name": "side where applicable — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CLAMS_NO_PROTEIN_CLAMS",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CLAMS_NO_PROTEIN",
    "name": "Clams",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CLAMS_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CLAMS_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_CHOOSE_SAUCE_WHITE_CLAM_SAUCE_RED_CLAM_SAUCE_WHITE_CLAM_SAUCE",
    "modifierGroupId": "MG_SAUCE_CHOOSE_SAUCE_WHITE_CLAM_SAUCE_RED_CLAM_SAUCE",
    "name": "White Clam Sauce",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_CHOOSE_SAUCE_WHITE_CLAM_SAUCE_RED_CLAM_SAUCE_RED_CLAM_SAUCE",
    "modifierGroupId": "MG_SAUCE_CHOOSE_SAUCE_WHITE_CLAM_SAUCE_RED_CLAM_SAUCE",
    "name": "Red Clam Sauce",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CLAMS_SHRIMP_NO_PROTEIN_CLAMS",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CLAMS_SHRIMP_NO_PROTEIN",
    "name": "Clams",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CLAMS_SHRIMP_NO_PROTEIN_SHRIMP",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CLAMS_SHRIMP_NO_PROTEIN",
    "name": "Shrimp",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CLAMS_SHRIMP_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CLAMS_SHRIMP_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_CHOOSE_HEAT_MILD_SPICY_MILD",
    "modifierGroupId": "MG_SAUCE_CHOOSE_HEAT_MILD_SPICY",
    "name": "Mild",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_CHOOSE_HEAT_MILD_SPICY_SPICY",
    "modifierGroupId": "MG_SAUCE_CHOOSE_HEAT_MILD_SPICY",
    "name": "Spicy",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHOOSE_HEAT_CHOOSE_HEAT_MILD_SPICY_MILD",
    "modifierGroupId": "MG_CHOOSE_HEAT_CHOOSE_HEAT_MILD_SPICY",
    "name": "Mild",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_HEAT_CHOOSE_HEAT_MILD_SPICY_SPICY",
    "modifierGroupId": "MG_CHOOSE_HEAT_CHOOSE_HEAT_MILD_SPICY",
    "name": "Spicy",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TUNA_FISH_NO_PROTEIN_TUNA",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_FISH_NO_PROTEIN",
    "name": "Tuna",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TUNA_FISH_NO_PROTEIN_FISH",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_FISH_NO_PROTEIN",
    "name": "Fish",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TUNA_FISH_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_FISH_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN_ROAST_TURKEY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN",
    "name": "Roast Turkey",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN_ROAST_BEEF",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN",
    "name": "Roast Beef",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN",
    "name": "Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SARDINE_NO_PROTEIN_SARDINE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SARDINE_NO_PROTEIN",
    "name": "Sardine",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SARDINE_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SARDINE_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BUN_FOCACCIA_BREAD_NO_BREAD_BUN",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_FOCACCIA_BREAD_NO_BREAD",
    "name": "Bun",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BUN_FOCACCIA_BREAD_NO_BREAD_FOCACCIA_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_FOCACCIA_BREAD_NO_BREAD",
    "name": "Focaccia Bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BUN_FOCACCIA_BREAD_NO_BREAD_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_FOCACCIA_BREAD_NO_BREAD",
    "name": "No Bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_CHOOSE_SAUCE_SOY_SAUCE_GARLIC_AND_OLIVE_OIL_SOY_SAUCE",
    "modifierGroupId": "MG_SAUCE_CHOOSE_SAUCE_SOY_SAUCE_GARLIC_AND_OLIVE_OIL",
    "name": "Soy Sauce",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_CHOOSE_SAUCE_SOY_SAUCE_GARLIC_AND_OLIVE_OIL_GARLIC_AND_OLIVE_OIL",
    "modifierGroupId": "MG_SAUCE_CHOOSE_SAUCE_SOY_SAUCE_GARLIC_AND_OLIVE_OIL",
    "name": "Garlic & Olive Oil",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_PROTEIN_COMPONENT_VERIFY_PROTEIN_COMPONENT_VERIFY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PROTEIN_COMPONENT_VERIFY",
    "name": "Protein component — verify",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_COOK_PROTEIN_PREPARATION_PREPARATION_VERIFY_PREPARATION_VERIFY",
    "modifierGroupId": "MG_PROTEIN_COOK_PROTEIN_PREPARATION_PREPARATION_VERIFY",
    "name": "Preparation — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_STEAK_CHICKEN_NO_PROTEIN_STEAK",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_STEAK_CHICKEN_NO_PROTEIN",
    "name": "Steak",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_STEAK_CHICKEN_NO_PROTEIN_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_STEAK_CHICKEN_NO_PROTEIN",
    "name": "Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_STEAK_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_STEAK_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_SANDWICH_BREAD_NO_BREAD_SANDWICH_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_BREAD_NO_BREAD",
    "name": "sandwich bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_SANDWICH_BREAD_NO_BREAD_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_BREAD_NO_BREAD",
    "name": "no bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_MEATLOAF_CHICKEN_MEATLOAF_NO_PROTEIN_TURKEY_MEATLOAF",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_MEATLOAF_CHICKEN_MEATLOAF_NO_PROTEIN",
    "name": "Turkey Meatloaf",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_MEATLOAF_CHICKEN_MEATLOAF_NO_PROTEIN_CHICKEN_MEATLOAF",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_MEATLOAF_CHICKEN_MEATLOAF_NO_PROTEIN",
    "name": "Chicken Meatloaf",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_MEATLOAF_CHICKEN_MEATLOAF_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_MEATLOAF_CHICKEN_MEATLOAF_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_GRILLED_TOASTED_GRILLED",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_GRILLED_TOASTED",
    "name": "grilled",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_GRILLED_TOASTED_TOASTED",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_GRILLED_TOASTED",
    "name": "toasted",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_HERO_ROLL_NO_BREAD_HERO_ROLL",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_HERO_ROLL_NO_BREAD",
    "name": "hero roll",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_HERO_ROLL_NO_BREAD_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_HERO_ROLL_NO_BREAD",
    "name": "no bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_PRESSED_TOASTED_PRESSED",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_PRESSED_TOASTED",
    "name": "pressed",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_PRESSED_TOASTED_TOASTED",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_PRESSED_TOASTED",
    "name": "toasted",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_NO_SIDE_SUBSTITUTION_VERIFY_FRENCH_FRIES",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "name": "French Fries",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_NO_SIDE_SUBSTITUTION_VERIFY_NO_SIDE",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "name": "No Side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_NO_SIDE_SUBSTITUTION_VERIFY_SUBSTITUTION_VERIFY",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "name": "substitution — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_PITA_NO_PITA_PITA",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_PITA_NO_PITA",
    "name": "Pita",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_PITA_NO_PITA_NO_PITA",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_PITA_NO_PITA",
    "name": "No Pita",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GYRO_MEAT_CHICKEN_NO_PROTEIN_GYRO_MEAT",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GYRO_MEAT_CHICKEN_NO_PROTEIN",
    "name": "Gyro Meat",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GYRO_MEAT_CHICKEN_NO_PROTEIN_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GYRO_MEAT_CHICKEN_NO_PROTEIN",
    "name": "Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GYRO_MEAT_CHICKEN_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GYRO_MEAT_CHICKEN_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_TORTILLA_NO_TORTILLA_TORTILLA",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TORTILLA_NO_TORTILLA",
    "name": "tortilla",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_TORTILLA_NO_TORTILLA_NO_TORTILLA",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TORTILLA_NO_TORTILLA",
    "name": "no tortilla",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE_COTTAGE_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Cottage Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_TURKEY_NO_PROTEIN_ROAST_TURKEY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_NO_PROTEIN",
    "name": "Roast Turkey",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_TURKEY_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN_LEAN_BEEF",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN",
    "name": "Lean Beef",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN_LEAN_BEEF_PATTY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN",
    "name": "Lean Beef Patty",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN_TURKEY_PATTY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN",
    "name": "Turkey Patty",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BURGER_CHICKEN_BURGER_NO_PROTEIN_TURKEY_BURGER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "name": "Turkey Burger",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BURGER_CHICKEN_BURGER_NO_PROTEIN_CHICKEN_BURGER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "name": "Chicken Burger",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BURGER_CHICKEN_BURGER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN_GRILLED_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN",
    "name": "Grilled Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_PROVOLONE_NO_CHEESE_EXTRA_CHEESE_PROVOLONE",
    "modifierGroupId": "MG_CHEESE_CHEESE_PROVOLONE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Provolone",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_PROVOLONE_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_PROVOLONE_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_PROVOLONE_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_PROVOLONE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BLACKENED_SALMON_NO_PROTEIN_BLACKENED_SALMON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_SALMON_NO_PROTEIN",
    "name": "Blackened Salmon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BLACKENED_SALMON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_SALMON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE_ADD_FRIES",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "name": "add fries",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE_ONION_RINGS",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "name": "onion rings",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE_SIDE",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "name": "side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN_BUN",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "name": "bun",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN_NO_BUN",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "name": "no bun",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN_BEEF_BURGER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "name": "Beef Burger",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY_FRENCH_FRIES",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "name": "French Fries",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY_SUBSTITUTION_VERIFY",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "name": "substitution — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN_BEEF_BURGER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN",
    "name": "Beef Burger",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN_TURKEY_BURGER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "name": "Turkey Burger",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN_VEGGIE_BURGER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "name": "Veggie Burger",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN_CHICKEN_BURGER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "name": "Chicken Burger",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SALMON_BURGER_NO_PROTEIN_SALMON_BURGER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_BURGER_NO_PROTEIN",
    "name": "Salmon Burger",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SALMON_BURGER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_BURGER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HOT_DOG_NO_PROTEIN_HOT_DOG",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HOT_DOG_NO_PROTEIN",
    "name": "Hot Dog",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HOT_DOG_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HOT_DOG_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_PASTRAMI_NO_PROTEIN_PASTRAMI",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PASTRAMI_NO_PROTEIN",
    "name": "Pastrami",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_PASTRAMI_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PASTRAMI_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CORNED_BEEF_NO_PROTEIN_CORNED_BEEF",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_NO_PROTEIN",
    "name": "Corned Beef",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CORNED_BEEF_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CORNED_BEEF_PASTRAMI_NO_PROTEIN_CORNED_BEEF",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_PASTRAMI_NO_PROTEIN",
    "name": "Corned Beef",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CORNED_BEEF_PASTRAMI_NO_PROTEIN_PASTRAMI",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_PASTRAMI_NO_PROTEIN",
    "name": "Pastrami",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CORNED_BEEF_PASTRAMI_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_PASTRAMI_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHOPPED_LIVER_NO_PROTEIN_CHOPPED_LIVER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_NO_PROTEIN",
    "name": "Chopped Liver",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHOPPED_LIVER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CORNED_BEEF_CHOPPED_LIVER_NO_PROTEIN_CORNED_BEEF",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_CHOPPED_LIVER_NO_PROTEIN",
    "name": "Corned Beef",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CORNED_BEEF_CHOPPED_LIVER_NO_PROTEIN_CHOPPED_LIVER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_CHOPPED_LIVER_NO_PROTEIN",
    "name": "Chopped Liver",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CORNED_BEEF_CHOPPED_LIVER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_CHOPPED_LIVER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHOPPED_LIVER_TURKEY_NO_PROTEIN_CHOPPED_LIVER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_TURKEY_NO_PROTEIN",
    "name": "Chopped Liver",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHOPPED_LIVER_TURKEY_NO_PROTEIN_TURKEY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_TURKEY_NO_PROTEIN",
    "name": "Turkey",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHOPPED_LIVER_TURKEY_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_TURKEY_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_PASTRAMI_CORNED_BEEF_NO_PROTEIN_PASTRAMI",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PASTRAMI_CORNED_BEEF_NO_PROTEIN",
    "name": "Pastrami",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_PASTRAMI_CORNED_BEEF_NO_PROTEIN_CORNED_BEEF",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PASTRAMI_CORNED_BEEF_NO_PROTEIN",
    "name": "Corned Beef",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_PASTRAMI_CORNED_BEEF_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PASTRAMI_CORNED_BEEF_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_AMERICAN_CHEESE_SWISS_CHEESE_NO_CHEESE_AMERICAN_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_SWISS_CHEESE_NO_CHEESE",
    "name": "American Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_AMERICAN_CHEESE_SWISS_CHEESE_NO_CHEESE_SWISS_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_SWISS_CHEESE_NO_CHEESE",
    "name": "Swiss Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_AMERICAN_CHEESE_SWISS_CHEESE_NO_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_SWISS_CHEESE_NO_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_TAYLOR_HAM_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_TAYLOR_HAM_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_TAYLOR_HAM_NO_PROTEIN_TAYLOR_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_TAYLOR_HAM_NO_PROTEIN",
    "name": "Taylor Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_TAYLOR_HAM_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_TAYLOR_HAM_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_ADD_TOMATO_ADD_TOMATO_TOMATO_TOMATO",
    "modifierGroupId": "MG_ADD_TOMATO_ADD_TOMATO_TOMATO",
    "name": "Tomato",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_TURKEY_BACON_NO_PROTEIN_ROAST_TURKEY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_BACON_NO_PROTEIN",
    "name": "Roast Turkey",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_TURKEY_BACON_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_BACON_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_ROAST_TURKEY_BACON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_BACON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_BACON_NO_PROTEIN_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_BACON_NO_PROTEIN",
    "name": "Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_BACON_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_BACON_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHICKEN_BACON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_BACON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN_CHOPPED_LIVER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN",
    "name": "Chopped Liver",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN_CHICKEN_LIVER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN",
    "name": "Chicken Liver",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN_BURGER_PATTY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN",
    "name": "Burger Patty",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN",
    "name": "Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SIDE_SIDE_CHOOSE_SIDE_POTATO_SALAD_COLE_SLAW_CHOOSE_SIDE_POTATO_SALAD",
    "modifierGroupId": "MG_SIDE_SIDE_CHOOSE_SIDE_POTATO_SALAD_COLE_SLAW",
    "name": "Choose Side: Potato Salad",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_CHOOSE_SIDE_POTATO_SALAD_COLE_SLAW_COLE_SLAW",
    "modifierGroupId": "MG_SIDE_SIDE_CHOOSE_SIDE_POTATO_SALAD_COLE_SLAW",
    "name": "Cole Slaw",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_ADD_ON_ADD_ON_GRAVY_CHEESE_CHEESE_AND_GRAVY_GRAVY",
    "modifierGroupId": "MG_ADD_ON_ADD_ON_GRAVY_CHEESE_CHEESE_AND_GRAVY",
    "name": "Gravy",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_ADD_ON_ADD_ON_GRAVY_CHEESE_CHEESE_AND_GRAVY_CHEESE",
    "modifierGroupId": "MG_ADD_ON_ADD_ON_GRAVY_CHEESE_CHEESE_AND_GRAVY",
    "name": "Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_ADD_ON_ADD_ON_GRAVY_CHEESE_CHEESE_AND_GRAVY_CHEESE_AND_GRAVY",
    "modifierGroupId": "MG_ADD_ON_ADD_ON_GRAVY_CHEESE_CHEESE_AND_GRAVY",
    "name": "Cheese & Gravy",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_PORK_SAUSAGE_TURKEY_SAUSAGE_NO_PROTEIN_PORK_SAUSAGE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PORK_SAUSAGE_TURKEY_SAUSAGE_NO_PROTEIN",
    "name": "Pork Sausage",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_PORK_SAUSAGE_TURKEY_SAUSAGE_NO_PROTEIN_TURKEY_SAUSAGE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PORK_SAUSAGE_TURKEY_SAUSAGE_NO_PROTEIN",
    "name": "Turkey Sausage",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_PORK_SAUSAGE_TURKEY_SAUSAGE_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PORK_SAUSAGE_TURKEY_SAUSAGE_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BACON_NO_PROTEIN_TURKEY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BACON_NO_PROTEIN",
    "name": "Turkey",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BACON_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BACON_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TURKEY_BACON_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BACON_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_HARD_ROLL_WITH_BUTTER_HARD_ROLL_WITH_BUTTER",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_HARD_ROLL_WITH_BUTTER",
    "name": "Hard Roll with Butter",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_TOAST_WITH_BUTTER_AND_JELLY_TOAST_WITH_BUTTER_AND_JELLY",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_WITH_BUTTER_AND_JELLY",
    "name": "Toast with Butter & Jelly",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_ENGLISH_MUFFIN_WITH_BUTTER_AND_JELLY_ENGLISH_MUFFIN_WITH_BUTTER_AND_JELLY",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_ENGLISH_MUFFIN_WITH_BUTTER_AND_JELLY",
    "name": "English Muffin with Butter & Jelly",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BLUEBERRY_MUFFIN_OR_APPLE_CINNAMON_MUFFIN_BLUEBERRY_MUFFIN_OR_APPLE_CINNAMON_M",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BLUEBERRY_MUFFIN_OR_APPLE_CINNAMON_MUFFIN",
    "name": "Blueberry Muffin or Apple Cinnamon Muffin",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_BLUEBERRY_MUFFIN_APPLE_CINNAMON_MUFFIN_BLUEBERRY_MUFFIN",
    "modifierGroupId": "MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_BLUEBERRY_MUFFIN_APPLE_CINNAMON_MUFFIN",
    "name": "Blueberry Muffin",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_BLUEBERRY_MUFFIN_APPLE_CINNAMON_MUFFIN_APPLE_CINNAMON_MUFFIN",
    "modifierGroupId": "MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_BLUEBERRY_MUFFIN_APPLE_CINNAMON_MUFFIN",
    "name": "Apple Cinnamon Muffin",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_CHOCOLATE_CHIP_MUFFIN_CHOCOLATE_CHIP_MUFFIN",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_CHOCOLATE_CHIP_MUFFIN",
    "name": "Chocolate Chip Muffin",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_CORN_OR_BRAN_MUFFIN_CORN_OR_BRAN_MUFFIN",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_CORN_OR_BRAN_MUFFIN",
    "name": "Corn or Bran Muffin",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_CORN_MUFFIN_BRAN_MUFFIN_CORN_MUFFIN",
    "modifierGroupId": "MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_CORN_MUFFIN_BRAN_MUFFIN",
    "name": "Corn Muffin",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_CORN_MUFFIN_BRAN_MUFFIN_BRAN_MUFFIN",
    "modifierGroupId": "MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_CORN_MUFFIN_BRAN_MUFFIN",
    "name": "Bran Muffin",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY_APPLE",
    "modifierGroupId": "MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY",
    "name": "Apple",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY_CHERRY",
    "modifierGroupId": "MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY",
    "name": "Cherry",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY_BLUEBERRY",
    "modifierGroupId": "MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY",
    "name": "Blueberry",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_HAMBURGER",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_",
    "name": "Hamburger",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_GRILLED_CHICKEN_S",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_",
    "name": "Grilled Chicken Sandwich",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_BURGER_PATTY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_",
    "name": "Burger Patty",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_GRILLED_CHICKEN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_",
    "name": "Grilled Chicken",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 5
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE_FRENCH_FRIES",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "name": "French Fries",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE_ONE_VEGETABLE",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "name": "One Vegetable",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_DESSERT_DESSERT_JELLO_ICE_CREAM_JELLO",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "name": "Jello",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_DESSERT_DESSERT_JELLO_ICE_CREAM_ICE_CREAM",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "name": "Ice Cream",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM_JELLO",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "name": "Jello",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM_ICE_CREAM",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "name": "Ice Cream",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FISH_NO_PROTEIN_FISH",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FISH_NO_PROTEIN",
    "name": "Fish",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_FISH_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FISH_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_APPLIES_TO_GRILLED_CHEESE_SELECTION_STANDARD_NO_CHEESE_EXTRA_CHEES_APPLIES_TO_GRILL",
    "modifierGroupId": "MG_CHEESE_CHEESE_APPLIES_TO_GRILLED_CHEESE_SELECTION_STANDARD_NO_CHEESE_EXTRA_CHEES",
    "name": "Applies to Grilled Cheese selection: standard",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_APPLIES_TO_GRILLED_CHEESE_SELECTION_STANDARD_NO_CHEESE_EXTRA_CHEES_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_APPLIES_TO_GRILLED_CHEESE_SELECTION_STANDARD_NO_CHEESE_EXTRA_CHEES",
    "name": "no cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_APPLIES_TO_GRILLED_CHEESE_SELECTION_STANDARD_NO_CHEESE_EXTRA_CHEES_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_APPLIES_TO_GRILLED_CHEESE_SELECTION_STANDARD_NO_CHEESE_EXTRA_CHEES",
    "name": "extra cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_CHOOSE_SANDWICH_CHOOSE_SANDWICH_GRILLED_CHEESE_PEANUT_BUTTER_AND_JELLY_GRILLED_CHEESE",
    "modifierGroupId": "MG_CHOOSE_SANDWICH_CHOOSE_SANDWICH_GRILLED_CHEESE_PEANUT_BUTTER_AND_JELLY",
    "name": "Grilled Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_SANDWICH_CHOOSE_SANDWICH_GRILLED_CHEESE_PEANUT_BUTTER_AND_JELLY_PEANUT_BUTTER_AND_JELLY",
    "modifierGroupId": "MG_CHOOSE_SANDWICH_CHOOSE_SANDWICH_GRILLED_CHEESE_PEANUT_BUTTER_AND_JELLY",
    "name": "Peanut Butter & Jelly",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_TOAST",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "name": "toast",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "name": "no bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED_TOAST_PREP_TOASTED",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "name": "toast prep: toasted",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED_DRY",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "name": "dry",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED_BUTTERED",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "name": "buttered",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_EGG_EGG_EGGS_NO_EGGS_EGGS",
    "modifierGroupId": "MG_EGG_EGG_EGGS_NO_EGGS",
    "name": "eggs",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_EGG_EGG_EGGS_NO_EGGS_NO_EGGS",
    "modifierGroupId": "MG_EGG_EGG_EGGS_NO_EGGS",
    "name": "no eggs",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD_SCRAMBLED",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "name": "Scrambled",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD_SUNNY_SIDE_UP",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "name": "Sunny Side Up",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD_OVER_EASY",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "name": "Over Easy",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD_OVER_MEDIUM",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "name": "Over Medium",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD_OVER_HARD",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "name": "Over Hard",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 5
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM_PORK_SAUSAGE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM",
    "name": "Pork Sausage",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM_TURKEY_SAUSAGE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM",
    "name": "Turkey Sausage",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM_TAYLOR_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM",
    "name": "Taylor Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY_HOME_FRIES",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "name": "Home Fries",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY_NO_SIDE",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "name": "No Side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY_SUBSTITUTION_VERIFY",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "name": "substitution — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_2_TOAST",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_2",
    "name": "Toast",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_2_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_2",
    "name": "No Bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_DRY_BUTTERED_BREAD_TYPE_SHOULD_BE_EXPLICIT_TOASTED",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_DRY_BUTTERED_BREAD_TYPE_SHOULD_BE_EXPLICIT_",
    "name": "Toasted",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_DRY_BUTTERED_BREAD_TYPE_SHOULD_BE_EXPLICIT_DRY",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_DRY_BUTTERED_BREAD_TYPE_SHOULD_BE_EXPLICIT_",
    "name": "Dry",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_DRY_BUTTERED_BREAD_TYPE_SHOULD_BE_EXPLICIT_BUTTERED_BREAD_TY",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_DRY_BUTTERED_BREAD_TYPE_SHOULD_BE_EXPLICIT_",
    "name": "Buttered; bread type should be explicit — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_EGG_EGG_EGGS_NO_EGGS_2_EGGS",
    "modifierGroupId": "MG_EGG_EGG_EGGS_NO_EGGS_2",
    "name": "Eggs",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_EGG_EGG_EGGS_NO_EGGS_2_NO_EGGS",
    "modifierGroupId": "MG_EGG_EGG_EGGS_NO_EGGS_2",
    "name": "No Eggs",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BENEDICT_PROTEIN_COMPONENT_VERIFY_NO_PROTEIN_BENEDICT_PROTEIN_COMPONENT_VERIFY",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BENEDICT_PROTEIN_COMPONENT_VERIFY_NO_PROTEIN",
    "name": "Benedict protein component — verify",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BENEDICT_PROTEIN_COMPONENT_VERIFY_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BENEDICT_PROTEIN_COMPONENT_VERIFY_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_EGG_EGG_EGG_NO_EGG_2_EGG",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "name": "egg",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_EGG_EGG_EGG_NO_EGG_2_NO_EGG",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "name": "no egg",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE_SCRAMBLED",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "name": "Scrambled",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE_FRIED",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "name": "fried",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE_OVER_STYLE_HOUSE",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "name": "over style — house options should be explicit — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TAYLOR_HAM_NO_PROTEIN_TAYLOR_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TAYLOR_HAM_NO_PROTEIN",
    "name": "Taylor Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_TAYLOR_HAM_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TAYLOR_HAM_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN",
    "name": "Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN_SALAMI",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN",
    "name": "Salami",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN_SAUSAGE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN",
    "name": "Sausage",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 5
  },
  {
    "id": "MOD_MG_SIDE_SIDE_HOME_FRIES_VEGETABLES_NO_SIDE_HOME_FRIES",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_VEGETABLES_NO_SIDE",
    "name": "Home Fries",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_HOME_FRIES_VEGETABLES_NO_SIDE_VEGETABLES",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_VEGETABLES_NO_SIDE",
    "name": "Vegetables",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_HOME_FRIES_VEGETABLES_NO_SIDE_NO_SIDE",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_VEGETABLES_NO_SIDE",
    "name": "No Side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_EGG_EGG_EGG_BASED_MATZOH_BREI_EGG_BASED_MATZOH_BREI",
    "modifierGroupId": "MG_EGG_EGG_EGG_BASED_MATZOH_BREI",
    "name": "egg-based matzoh brei",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_CHALLAH_CHOOSE_CHALLAH_PLAIN_RAISIN_PLAIN",
    "modifierGroupId": "MG_CHOOSE_CHALLAH_CHOOSE_CHALLAH_PLAIN_RAISIN",
    "name": "Plain",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_CHALLAH_CHOOSE_CHALLAH_PLAIN_RAISIN_RAISIN",
    "modifierGroupId": "MG_CHOOSE_CHALLAH_CHOOSE_CHALLAH_PLAIN_RAISIN",
    "name": "Raisin",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_EGG_EGG_OMELETTE_EGGS_OMELETTE_EGGS",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "name": "omelette eggs",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_HAM_NO_PROTEIN_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_HAM_NO_PROTEIN",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_HAM_NO_PROTEIN_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_HAM_NO_PROTEIN",
    "name": "Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_HAM_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_HAM_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SAUSAGE_NO_PROTEIN_SAUSAGE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SAUSAGE_NO_PROTEIN",
    "name": "Sausage",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_SAUSAGE_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SAUSAGE_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_NOVA_NO_PROTEIN_NOVA",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_NOVA_NO_PROTEIN",
    "name": "Nova",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_NOVA_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_NOVA_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE_CREAM_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Cream Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE_NO_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "No Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE_EXTRA_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "name": "Extra Cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_3_TOAST",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_3",
    "name": "toast",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_3_NO_BREAD",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_3",
    "name": "no bread",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOAST_PREP",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP",
    "name": "toast prep",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_ADD_SUB_CHEESE_ADD",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_SUB_CHEESE",
    "name": "add",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHEESE_CHEESE_ADD_SUB_CHEESE_SUB_CHEESE",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_SUB_CHEESE",
    "name": "sub cheese",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_HOME_FRIES_SUBSTITUTION_VERIFY_HOME_FRIES",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_SUBSTITUTION_VERIFY",
    "name": "home fries",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_HOME_FRIES_SUBSTITUTION_VERIFY_SUBSTITUTION_VERIFY",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_SUBSTITUTION_VERIFY",
    "name": "substitution — VERIFY",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM_BACON",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "name": "Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM_SAUSAGE",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "name": "Sausage",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM_TAYLOR_HAM",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "name": "Taylor Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA_NORMAL",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "normal",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA_NO",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "no",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA_ON_SIDE",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "on side",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA_EXTRA",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "name": "extra",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM_ADD_BACON",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "name": "add Bacon",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM_HAM",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "name": "Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM_SAUSAGE",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "name": "Sausage",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM_TAYLOR_HAM",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "name": "Taylor Ham",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHOOSE_SIZE_CHOOSE_SIZE_FULL_STACK_SHORT_STACK_FULL_STACK",
    "modifierGroupId": "MG_CHOOSE_SIZE_CHOOSE_SIZE_FULL_STACK_SHORT_STACK",
    "name": "Full Stack",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_SIZE_CHOOSE_SIZE_FULL_STACK_SHORT_STACK_SHORT_STACK",
    "modifierGroupId": "MG_CHOOSE_SIZE_CHOOSE_SIZE_FULL_STACK_SHORT_STACK",
    "name": "Short Stack",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_ADD_STRAWBERRIES_ADD_STRAWBERRIES_STRAWBERRIES_STRAWBERRIES",
    "modifierGroupId": "MG_ADD_STRAWBERRIES_ADD_STRAWBERRIES_STRAWBERRIES",
    "name": "Strawberries",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL_BAGEL",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL",
    "name": "bagel",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL_NO_BAGEL",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL",
    "name": "no bagel",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_WHITEFISH_NO_PROTEIN_WHITEFISH",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_WHITEFISH_NO_PROTEIN",
    "name": "Whitefish",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_PROTEIN_PROTEIN_WHITEFISH_NO_PROTEIN_NO_PROTEIN",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_WHITEFISH_NO_PROTEIN",
    "name": "No Protein",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": true,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHOOSE_COFFEE_CHOOSE_COFFEE_REGULAR_DECAF_REGULAR",
    "modifierGroupId": "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_REGULAR_DECAF",
    "name": "Regular",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_COFFEE_CHOOSE_COFFEE_REGULAR_DECAF_DECAF",
    "modifierGroupId": "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_REGULAR_DECAF",
    "name": "Decaf",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHOOSE_MILK_CHOOSE_MILK_MILK_SKIM_MILK_MILK",
    "modifierGroupId": "MG_CHOOSE_MILK_CHOOSE_MILK_MILK_SKIM_MILK",
    "name": "Milk",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_MILK_CHOOSE_MILK_MILK_SKIM_MILK_SKIM_MILK",
    "modifierGroupId": "MG_CHOOSE_MILK_CHOOSE_MILK_MILK_SKIM_MILK",
    "name": "Skim Milk",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHOOSE_COFFEE_CHOOSE_COFFEE_ICED_COFFEE_ICED_DECAF_ICED_COFFEE",
    "modifierGroupId": "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_ICED_COFFEE_ICED_DECAF",
    "name": "Iced Coffee",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_COFFEE_CHOOSE_COFFEE_ICED_COFFEE_ICED_DECAF_ICED_DECAF",
    "modifierGroupId": "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_ICED_COFFEE_ICED_DECAF",
    "name": "Iced Decaf",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_THICKNESS_THICKNESS_REGULAR_EXTRA_THICK_REGULAR",
    "modifierGroupId": "MG_THICKNESS_THICKNESS_REGULAR_EXTRA_THICK",
    "name": "Regular",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_THICKNESS_THICKNESS_REGULAR_EXTRA_THICK_EXTRA_THICK",
    "modifierGroupId": "MG_THICKNESS_THICKNESS_REGULAR_EXTRA_THICK",
    "name": "Extra Thick",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY_CHOCOLATE",
    "modifierGroupId": "MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY",
    "name": "Chocolate",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY_VANILLA",
    "modifierGroupId": "MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY",
    "name": "Vanilla",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY_STRAWBERRY",
    "modifierGroupId": "MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY",
    "name": "Strawberry",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  },
  {
    "id": "MOD_MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY_OTHER_HOUSE_FLAVORS_VERIFY",
    "modifierGroupId": "MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY",
    "name": "Other house flavors — verify",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": true,
    "sortOrder": 4
  },
  {
    "id": "MOD_MG_CHOOSE_FLAVOR_CHOOSE_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_CHOCOLATE",
    "modifierGroupId": "MG_CHOOSE_FLAVOR_CHOOSE_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY",
    "name": "Chocolate",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 1
  },
  {
    "id": "MOD_MG_CHOOSE_FLAVOR_CHOOSE_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_VANILLA",
    "modifierGroupId": "MG_CHOOSE_FLAVOR_CHOOSE_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY",
    "name": "Vanilla",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 2
  },
  {
    "id": "MOD_MG_CHOOSE_FLAVOR_CHOOSE_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_STRAWBERRY",
    "modifierGroupId": "MG_CHOOSE_FLAVOR_CHOOSE_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY",
    "name": "Strawberry",
    "priceAdjustment": null,
    "priceConfigured": false,
    "ingredientId": null,
    "isNoneOption": false,
    "requiresReview": false,
    "sortOrder": 3
  }
] as ModifierData[];

export const itemModifierGroups: ItemModifierGroupData[] = [
  {
    "itemId": "drunken_chicken",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "drunken_chicken",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "drunken_chicken",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "drunken_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "drunken_chicken",
    "modifierGroupId": "MG_SAUCE_VODKA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "buffalo_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "buffalo_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "buffalo_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "buffalo_cheese",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "buffalo_cheese",
    "modifierGroupId": "MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "blt_ranch",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "blt_ranch",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "blt_ranch",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "blt_ranch",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_BACON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "blt_ranch",
    "modifierGroupId": "MG_SAUCE_RANCH_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "the_pesto",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "the_pesto",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "the_pesto",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "the_pesto",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "the_pesto",
    "modifierGroupId": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "the_caprese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "the_caprese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "the_caprese",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "the_caprese",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "the_caprese",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_GLAZE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "the_david",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "the_david",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "the_david",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "the_david",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_PEPPERONI_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "the_arizona",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "the_arizona",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "the_arizona",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "the_arizona",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_CUTLET_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "the_arizona",
    "modifierGroupId": "MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "the_ritz",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "the_ritz",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "the_ritz",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "the_ritz",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "the_ritz",
    "modifierGroupId": "MG_SAUCE_CHIPOTLE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "the_ritz",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 60
  },
  {
    "itemId": "the_texan",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "the_texan",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "the_texan",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "the_texan",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_BACON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "the_texan",
    "modifierGroupId": "MG_SAUCE_BBQ_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "the_texan",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 60
  },
  {
    "itemId": "the_italian",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "the_italian",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "the_italian",
    "modifierGroupId": "MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "the_italian",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "the_italian",
    "modifierGroupId": "MG_SAUCE_MARINARA_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "the_italian",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 60
  },
  {
    "itemId": "the_monte",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "the_monte",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "the_monte",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "the_monte",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_HAM_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "the_monte",
    "modifierGroupId": "MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "the_monte",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 60
  },
  {
    "itemId": "the_club",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "the_club",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "the_club",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "the_club",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_BACON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "the_club",
    "modifierGroupId": "MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "the_club",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 60
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "modifierGroupId": "MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "modifierGroupId": "MG_SAUCE_BUFFALO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 50
  },
  {
    "itemId": "philly_cheesesteak_wrap",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "philly_cheesesteak_wrap",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "philly_cheesesteak_wrap",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_STEAK_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "philly_cheesesteak_wrap",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 40
  },
  {
    "itemId": "blackened_chicken_wrap",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "blackened_chicken_wrap",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "blackened_chicken_wrap",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "blackened_chicken_wrap",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 40
  },
  {
    "itemId": "turkey_wrap_special",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_wrap_special",
    "modifierGroupId": "MG_CHEESE_CHEESE_GOAT_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "turkey_wrap_special",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "turkey_wrap_special",
    "modifierGroupId": "MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "turkey_wrap_special",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 50
  },
  {
    "itemId": "bbq_beef_wrap",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "bbq_beef_wrap",
    "modifierGroupId": "MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "bbq_beef_wrap",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "bbq_beef_wrap",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 40
  },
  {
    "itemId": "gyro_wrap",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "gyro_wrap",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "gyro_wrap",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GYRO_MEAT_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "gyro_wrap",
    "modifierGroupId": "MG_SAUCE_CREAMY_ITALIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "gyro_wrap",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 50
  },
  {
    "itemId": "tex_mex_wrap",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "tex_mex_wrap",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "tex_mex_wrap",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "tex_mex_wrap",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "tex_mex_wrap",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 50
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "modifierGroupId": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 50
  },
  {
    "itemId": "chicken_caesar_wrap",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_caesar_wrap",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_caesar_wrap",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "chicken_caesar_wrap",
    "modifierGroupId": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "chicken_caesar_wrap",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_COLE_SLAW_PICKLE",
    "sortOrder": 50
  },
  {
    "itemId": "lemon_shrimp_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_BACON_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "lemon_shrimp_salad",
    "modifierGroupId": "MG_SAUCE_LEMON_GARLIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "marions_chopped_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "marions_chopped_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "marions_chopped_salad",
    "modifierGroupId": "MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "modifierGroupId": "MG_CHEESE_CHEESE_GOAT_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "modifierGroupId": "MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "insalata_italiano",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "insalata_italiano",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "insalata_italiano",
    "modifierGroupId": "MG_SAUCE_OLIVE_OIL_AND_LEMON_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "paulos_salad_with_grilled_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "paulos_salad_with_grilled_chicken",
    "modifierGroupId": "MG_SAUCE_RASPBERRY_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MARINATED_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "focaccia_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_FOCACCIA_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "focaccia_sandwich",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "focaccia_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "focaccia_sandwich",
    "modifierGroupId": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "avocado_tuna_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "avocado_tuna_salad",
    "modifierGroupId": "MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "strawberry_spinach_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_SALMON_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "strawberry_spinach_salad",
    "modifierGroupId": "MG_SAUCE_POPPY_WHITE_WINE_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "coconut_chicken_ala_ritz",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "coconut_chicken_ala_ritz",
    "modifierGroupId": "MG_SAUCE_WHITE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "string_bean_salad_with_grilled_chicken",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "string_bean_salad_with_grilled_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "string_bean_salad_with_grilled_chicken",
    "modifierGroupId": "MG_SAUCE_HONEY_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "southwest_cobb_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "southwest_cobb_salad",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "sortOrder": 20
  },
  {
    "itemId": "southwest_cobb_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "southwest_cobb_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_MARINATED_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "modifierGroupId": "MG_SAUCE_DIJON_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "pan_fried_crab_cake_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "pan_fried_crab_cake_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CRAB_CAKE_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "pan_fried_crab_cake_sandwich",
    "modifierGroupId": "MG_SAUCE_TARTAR_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "focaccia_special",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_FOCACCIA_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "focaccia_special",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "focaccia_special",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "focaccia_special",
    "modifierGroupId": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SUB_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "modifierGroupId": "MG_SAUCE_TERIYAKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "modifierGroupId": "MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "chopped_burger_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_MONTEREY_JACK_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "chopped_burger_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BURGER_PATTY_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "chopped_burger_salad",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 30
  },
  {
    "itemId": "chopped_burger_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "crispy_buffalo_chicken_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "crispy_buffalo_chicken_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BUFFALO_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "crispy_buffalo_chicken_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SUB_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "modifierGroupId": "MG_SAUCE_PESTO_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "three_bean_chicken_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "three_bean_chicken_salad",
    "modifierGroupId": "MG_SAUCE_CILANTRO_LIME_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_dinner_pasta_penne_pasta_with_meatballs",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "fusilli_pasta_with_meatballs",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_dinner_pasta_mac_and_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_dinner_pasta_cheese_ravioli",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_dinner_chicken_chicken_francaise",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_dinner_chicken_chicken_francaise",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_parmesan",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_parmesan",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_dinner_chicken_chicken_fingers",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_dinner_chicken_chicken_fingers",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "sortOrder": 20
  },
  {
    "itemId": "fried_filet",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "sortOrder": 10
  },
  {
    "itemId": "fried_shrimp",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "fried_shrimp",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "sortOrder": 20
  },
  {
    "itemId": "shrimp_francaise",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "shrimp_francaise",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_dinner_fish_sole_francaise",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_dinner_meat_veal_francaise",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_dinner_meat_veal_francaise",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "sortOrder": 20
  },
  {
    "itemId": "veal_parmesan",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "veal_parmesan",
    "modifierGroupId": "MG_SIDE_SIDE_PASTA_VEGETABLES",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_pasta_penne_pasta_with_meatballs",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "fussilli_pasta_with_meatballs",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_pasta_mac_and_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_pasta_cheese_ravioli",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_chicken_chicken_fingers",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_tuna_salad",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_tuna_salad",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_tuna_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_tuna_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_tuna_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chicken_salad",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chicken_salad",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chicken_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chicken_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chicken_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_egg_salad",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_egg_salad",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_egg_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_egg_salad",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "sortOrder": 40
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_egg_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chunky_shrimp_salad",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chunky_shrimp_salad",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chunky_shrimp_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chunky_shrimp_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_roast_beef",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_roast_beef",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_roast_beef",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_roast_beef",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_turkey",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_turkey",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_turkey",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_turkey",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "bacon_lettuce_and_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "bacon_lettuce_and_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "bacon_lettuce_and_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "bacon_lettuce_and_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_tuna",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_tuna",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_tuna",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_tuna",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_salmon",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_salmon",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_salmon",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_salmon",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "ham_and_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "ham_and_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "ham_and_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "ham_and_cheese",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_salami",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_salami",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_salami",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_salami",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALAMI_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "canton_chicken_wings",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "fried_mozzarella_sticks",
    "modifierGroupId": "MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "chopped_chicken_livers",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_LIVER_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "shrimp_cocktail",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "feta_cheese_tomato_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "feta_cheese_tomato_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "nachos",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "nachos",
    "modifierGroupId": "MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "nachos",
    "modifierGroupId": "MG_SAUCE_GUACAMOLE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "chicken_soup_with_matzoh_ball_or_noodles_cup",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_soup_with_matzoh_ball_or_noodles_cup",
    "modifierGroupId": "MG_SOUP_ADD_IN_SOUP_ADD_IN_MATZOH_BALL_NOODLES",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_soup_with_matzoh_ball_or_noodles_bowl",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_soup_with_matzoh_ball_or_noodles_bowl",
    "modifierGroupId": "MG_SOUP_ADD_IN_SOUP_ADD_IN_MATZOH_BALL_NOODLES",
    "sortOrder": 20
  },
  {
    "itemId": "soup_du_jour_cup",
    "modifierGroupId": "MG_SOUP_OF_THE_DAY_SOUP_OF_THE_DAY_DAILY_SOUP_MANAGER_DEFINED_VERIFY",
    "sortOrder": 10
  },
  {
    "itemId": "soup_du_jour_bowl",
    "modifierGroupId": "MG_SOUP_OF_THE_DAY_SOUP_OF_THE_DAY_DAILY_SOUP_MANAGER_DEFINED_VERIFY",
    "sortOrder": 10
  },
  {
    "itemId": "crock_of_onion_soup",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "szechuan_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "szechuan_chicken",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "szechuan_chicken",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "szechuan_shrimp",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "szechuan_shrimp",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "szechuan_shrimp",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "chicken_familia",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_familia",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_familia",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "spanish_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "spanish_chicken",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "spanish_chicken",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "char_grilled_half_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "char_grilled_half_chicken",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "char_grilled_half_chicken",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "golden_roasted_half_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "golden_roasted_half_chicken",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "golden_roasted_half_chicken",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "sauteed_calves_liver",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 10
  },
  {
    "itemId": "sauteed_calves_liver",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 20
  },
  {
    "itemId": "roast_turkey_with_all_the_fixins",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "roast_turkey_with_all_the_fixins",
    "modifierGroupId": "MG_SAUCE_CRANBERRY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "roast_turkey_with_all_the_fixins",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 30
  },
  {
    "itemId": "roast_turkey_with_all_the_fixins",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 40
  },
  {
    "itemId": "brisket_of_beef_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BRISKET_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "brisket_of_beef_platter",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "brisket_of_beef_platter",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "low_fat_turkey_meat_loaf",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "low_fat_turkey_meat_loaf",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "low_fat_turkey_meat_loaf",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "southern_fried_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FRIED_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "southern_fried_chicken",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "southern_fried_chicken",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "chicken_lo_mein",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_lo_mein",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_lo_mein",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "chicken_giambotta",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SAUSAGE_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_giambotta",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_giambotta",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "broiled_salmon_or_tuna",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_TUNA_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "broiled_salmon_or_tuna",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "broiled_salmon_or_tuna",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "shrimp_scampi",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "shrimp_scampi",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "shrimp_scampi",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "fried_scallops",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SCALLOPS_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "fried_scallops",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "fried_scallops",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "fried_clams_in_the_basket",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 10
  },
  {
    "itemId": "fried_clams_in_the_basket",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 20
  },
  {
    "itemId": "fried_flounder",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FLOUNDER_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "fried_flounder",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "fried_flounder",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "fried_shrimp_basket",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "fried_shrimp_basket",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "fried_shrimp_basket",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "broiled_swordfish",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "broiled_swordfish",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "broiled_swordfish",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "broiled_sea_scallops",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SCALLOPS_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "broiled_sea_scallops",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "broiled_sea_scallops",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "garlic_salmon_balsamic",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "garlic_salmon_balsamic",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "garlic_salmon_balsamic",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "stuffed_shrimp",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "stuffed_shrimp",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "stuffed_shrimp",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "lunch_dinner_from_the_sea_sole_francaise",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 10
  },
  {
    "itemId": "lunch_dinner_from_the_sea_sole_francaise",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 20
  },
  {
    "itemId": "broiled_scrod",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 10
  },
  {
    "itemId": "broiled_scrod",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 20
  },
  {
    "itemId": "broiled_flounder",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FLOUNDER_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "broiled_flounder",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "broiled_flounder",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "broiled_or_fried_combo_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SWORDFISH_FLOUNDER_SCALLOPS_CLAMS_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "broiled_or_fried_combo_platter",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "broiled_or_fried_combo_platter",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "broiled_or_fried_combo_platter",
    "modifierGroupId": "MG_PREPARATION_PREPARATION_BROILED_FRIED",
    "sortOrder": 40
  },
  {
    "itemId": "grilled_shrimp",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_shrimp",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_shrimp",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "grilled_shrimp_pasta",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_shrimp_pasta",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_shrimp_pasta",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "new_york_strip_16_oz",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 10
  },
  {
    "itemId": "new_york_strip_16_oz",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 20
  },
  {
    "itemId": "ground_sirloin",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GROUND_SIRLOIN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "ground_sirloin",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 20
  },
  {
    "itemId": "ground_sirloin",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 30
  },
  {
    "itemId": "ground_sirloin",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 40
  },
  {
    "itemId": "grilled_center_cut_pork_chops",
    "modifierGroupId": "MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_center_cut_pork_chops",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_center_cut_pork_chops",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 30
  },
  {
    "itemId": "char_grilled_turkey_steak",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_STEAK_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "char_grilled_turkey_steak",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 20
  },
  {
    "itemId": "char_grilled_turkey_steak",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 30
  },
  {
    "itemId": "char_grilled_turkey_steak",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 40
  },
  {
    "itemId": "sliced_skirt_steak_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SKIRT_STEAK_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "sliced_skirt_steak_platter",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 20
  },
  {
    "itemId": "sliced_skirt_steak_platter",
    "modifierGroupId": "MG_SIDE_SIDE_TWO_VEGETABLES_SIDE_OF_SPAGHETTI",
    "sortOrder": 30
  },
  {
    "itemId": "sliced_skirt_steak_platter",
    "modifierGroupId": "MG_STARTER_STARTER_SOUP_TOSSED_SALAD",
    "sortOrder": 40
  },
  {
    "itemId": "chicken_parmigiana",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_parmigiana",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_parmigiana",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 30
  },
  {
    "itemId": "veal_cutlet_parmigiana",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "veal_cutlet_parmigiana",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 20
  },
  {
    "itemId": "veal_cutlet_parmigiana",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 30
  },
  {
    "itemId": "lunch_dinner_italian_specialties_cheese_ravioli",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "lunch_dinner_italian_specialties_cheese_ravioli",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 20
  },
  {
    "itemId": "lunch_dinner_italian_specialties_cheese_ravioli",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 30
  },
  {
    "itemId": "spaghetti_with_meatballs",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "spaghetti_with_meatballs",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 20
  },
  {
    "itemId": "spaghetti_with_meatballs",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 30
  },
  {
    "itemId": "eggplant_parmigiana",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 10
  },
  {
    "itemId": "eggplant_parmigiana",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 20
  },
  {
    "itemId": "linguini",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CLAMS_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "linguini",
    "modifierGroupId": "MG_SAUCE_CHOOSE_SAUCE_WHITE_CLAM_SAUCE_RED_CLAM_SAUCE",
    "sortOrder": 20
  },
  {
    "itemId": "linguini",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 30
  },
  {
    "itemId": "linguini",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 40
  },
  {
    "itemId": "lunch_dinner_italian_specialties_chicken_francaise",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "lunch_dinner_italian_specialties_chicken_francaise",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 20
  },
  {
    "itemId": "lunch_dinner_italian_specialties_chicken_francaise",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 30
  },
  {
    "itemId": "lunch_dinner_italian_specialties_veal_francaise",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "lunch_dinner_italian_specialties_veal_francaise",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 20
  },
  {
    "itemId": "lunch_dinner_italian_specialties_veal_francaise",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 30
  },
  {
    "itemId": "breaded_veal_cutlet",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "breaded_veal_cutlet",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 20
  },
  {
    "itemId": "breaded_veal_cutlet",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 30
  },
  {
    "itemId": "vegetable_lasagna",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 10
  },
  {
    "itemId": "vegetable_lasagna",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 20
  },
  {
    "itemId": "lunch_dinner_italian_specialties_meat_lasagna",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 10
  },
  {
    "itemId": "lunch_dinner_italian_specialties_meat_lasagna",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 20
  },
  {
    "itemId": "rigatoni_chicken",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "rigatoni_chicken",
    "modifierGroupId": "MG_SAUCE_GARLIC_WHITE_WINE_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "rigatoni_chicken",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 30
  },
  {
    "itemId": "rigatoni_chicken",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 40
  },
  {
    "itemId": "linguini_ala_ritz_spicy_or_mild",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CLAMS_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "linguini_ala_ritz_spicy_or_mild",
    "modifierGroupId": "MG_SAUCE_CHOOSE_HEAT_MILD_SPICY",
    "sortOrder": 20
  },
  {
    "itemId": "linguini_ala_ritz_spicy_or_mild",
    "modifierGroupId": "MG_SIDE_SIDE_TOSSED_SALAD_DRESSING",
    "sortOrder": 30
  },
  {
    "itemId": "linguini_ala_ritz_spicy_or_mild",
    "modifierGroupId": "MG_SIDE_SECONDARY_ADDITIONAL_SIDE_CHOICE_ENTREE_SPECIFIC_PASTA_SIDE_WHERE_APPLICABL",
    "sortOrder": 40
  },
  {
    "itemId": "linguini_ala_ritz_spicy_or_mild",
    "modifierGroupId": "MG_CHOOSE_HEAT_CHOOSE_HEAT_MILD_SPICY",
    "sortOrder": 50
  },
  {
    "itemId": "potato_pancakes",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "potato_pancakes",
    "modifierGroupId": "MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "kasha_varnishkas",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_in_the_pot",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "sauteed_chicken_liver",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_LIVER_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "lunch_dinner_cold_platters_salads_chunky_shrimp_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_salad_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "tuna_fish_salad_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_FISH_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "egg_salad_platter",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "sortOrder": 10
  },
  {
    "itemId": "chopped_chicken_liver",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_LIVER_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "greek_salad_small",
    "modifierGroupId": "MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "greek_salad_large",
    "modifierGroupId": "MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "tossed_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "spinach_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "spinach_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_chicken_small",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_chicken_small",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_chicken_large",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_chicken_large",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "chef_s_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "chef_s_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_ROAST_BEEF_HAM_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "chef_s_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "sardine_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SARDINE_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "caesar_salad",
    "modifierGroupId": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "char_grilled_chicken_over_caesar_salad_lunch",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "char_grilled_chicken_over_caesar_salad_lunch",
    "modifierGroupId": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "char_grilled_chicken_over_caesar_salad_dinner",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "char_grilled_chicken_over_caesar_salad_dinner",
    "modifierGroupId": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "cheese_steak_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "cheese_steak_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_STEAK_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_chicken_pasta_lunch",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_chicken_pasta_dinner",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "char_grilled_chicken_breast_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_FOCACCIA_BREAD_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "char_grilled_chicken_breast_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "sesame_chicken_lunch",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "sesame_chicken_dinner",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_finger_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_finger_platter",
    "modifierGroupId": "MG_SAUCE_HONEY_MUSTARD_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "stir_fried_fresh_vegetables",
    "modifierGroupId": "MG_SAUCE_SOY_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "stir_fried_fresh_vegetables",
    "modifierGroupId": "MG_SAUCE_CHOOSE_SAUCE_SOY_SAUCE_GARLIC_AND_OLIVE_OIL",
    "sortOrder": 20
  },
  {
    "itemId": "french_dip",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "french_dip",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PROTEIN_COMPONENT_VERIFY",
    "sortOrder": 20
  },
  {
    "itemId": "french_dip",
    "modifierGroupId": "MG_PROTEIN_COOK_PROTEIN_PREPARATION_PREPARATION_VERIFY",
    "sortOrder": 30
  },
  {
    "itemId": "golden_fried_filet_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "golden_fried_filet_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PROTEIN_COMPONENT_VERIFY",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_cheesesteak",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_cheesesteak",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_cheesesteak",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_STEAK_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "turkey_or_chicken_meatloaf_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_BREAD_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_or_chicken_meatloaf_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_MEATLOAF_CHICKEN_MEATLOAF_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "turkey_or_chicken_meatloaf_sandwich",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "veal_patti_parmigiana",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "veal_patti_parmigiana",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_VEAL_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "tuna_melt",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "tuna_melt",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_GRILLED_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "tuna_melt",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "tuna_melt",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "chicken_pot_pie",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "beef_meatball_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "beef_meatball_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "eggplant_parmigiana_hero",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_HERO_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_parmigiana_hero",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_HERO_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_parmigiana_hero",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_parmigiana_hero",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "cuban_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_BREAD_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "cuban_sandwich",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_PRESSED_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "cuban_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PROTEIN_COMPONENT_VERIFY",
    "sortOrder": 30
  },
  {
    "itemId": "cuban_sandwich",
    "modifierGroupId": "MG_PROTEIN_COOK_PROTEIN_PREPARATION_PREPARATION_VERIFY",
    "sortOrder": 40
  },
  {
    "itemId": "cuban_sandwich",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "gyro",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_PITA_NO_PITA",
    "sortOrder": 10
  },
  {
    "itemId": "gyro",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GYRO_MEAT_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "gyro",
    "modifierGroupId": "MG_SAUCE_TZATZIKI_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "gyro",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 40
  },
  {
    "itemId": "chicken_wrap",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_WRAP_NO_WRAP",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_wrap",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_wrap",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "chicken_quesadilla",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TORTILLA_NO_TORTILLA",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_quesadilla",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_quesadilla",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "chicken_quesadilla",
    "modifierGroupId": "MG_SAUCE_SALSA_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "chili_fiesta",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "hot_pasta_primavera",
    "modifierGroupId": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_bowl",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_bowl",
    "modifierGroupId": "MG_SAUCE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "lean_beef_or_turkey_patti",
    "modifierGroupId": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "lean_beef_or_turkey_patti",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_LEAN_BEEF_LEAN_BEEF_PATTY_TURKEY_PATTY_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "diet_riot",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "pineapple_boat",
    "modifierGroupId": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "fresh_fruit_bowl",
    "modifierGroupId": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "cobb_salad_lunch",
    "modifierGroupId": "MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "cobb_salad_lunch",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "sortOrder": 20
  },
  {
    "itemId": "cobb_salad_lunch",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "cobb_salad_lunch",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "cobb_salad_dinner",
    "modifierGroupId": "MG_CHEESE_CHEESE_BLUE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "cobb_salad_dinner",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "sortOrder": 20
  },
  {
    "itemId": "cobb_salad_dinner",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "cobb_salad_dinner",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "caesar_italia",
    "modifierGroupId": "MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "caesar_italia",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "caesar_italia",
    "modifierGroupId": "MG_SAUCE_CAESAR_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "modifierGroupId": "MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SESAME_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "modifierGroupId": "MG_SAUCE_BLACK_OLIVE_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "modifierGroupId": "MG_CHEESE_CHEESE_FRESH_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "modifierGroupId": "MG_SAUCE_BALSAMIC_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "blackened_salmon_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_PROVOLONE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "blackened_salmon_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BLACKENED_SALMON_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "blackened_salmon_salad",
    "modifierGroupId": "MG_SAUCE_LEMON_VINAIGRETTE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "steak_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_SANDWICH_ROLL_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "steak_sandwich",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "steak_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SKIRT_STEAK_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "steak_sandwich",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "steak_sandwich",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 50
  },
  {
    "itemId": "jumbo_burger_regular",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "jumbo_burger_regular",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "jumbo_burger_regular",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "jumbo_burger_regular",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "jumbo_burger_regular",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 50
  },
  {
    "itemId": "jumbo_burger_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "jumbo_burger_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "jumbo_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "jumbo_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "jumbo_burger_deluxe",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "cheeseburger_regular",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "cheeseburger_regular",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "cheeseburger_regular",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "cheeseburger_regular",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "cheeseburger_regular",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 50
  },
  {
    "itemId": "cheeseburger_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "cheeseburger_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "cheeseburger_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "cheeseburger_deluxe",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "cheeseburger_deluxe",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "bacon_burger_regular",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "bacon_burger_regular",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "bacon_burger_regular",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "bacon_burger_regular",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "bacon_burger_regular",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 50
  },
  {
    "itemId": "bacon_burger_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "bacon_burger_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "bacon_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "bacon_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "bacon_burger_deluxe",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "bacon_cheeseburger_regular",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "bacon_cheeseburger_regular",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "bacon_cheeseburger_regular",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "bacon_cheeseburger_regular",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "bacon_cheeseburger_regular",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 50
  },
  {
    "itemId": "bacon_cheeseburger_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "bacon_cheeseburger_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "bacon_cheeseburger_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "bacon_cheeseburger_deluxe",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "bacon_cheeseburger_deluxe",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "mushroom_burger_regular",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "mushroom_burger_regular",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "mushroom_burger_regular",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "mushroom_burger_regular",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "mushroom_burger_regular",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 50
  },
  {
    "itemId": "mushroom_burger_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "mushroom_burger_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "mushroom_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "mushroom_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "mushroom_burger_deluxe",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "chili_burger_regular",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "chili_burger_regular",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "chili_burger_regular",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "chili_burger_regular",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "chili_burger_regular",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 50
  },
  {
    "itemId": "chili_burger_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "chili_burger_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "chili_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "chili_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "chili_burger_deluxe",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "pizza_burger_regular",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "pizza_burger_regular",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "pizza_burger_regular",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "pizza_burger_regular",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "pizza_burger_regular",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 50
  },
  {
    "itemId": "pizza_burger_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "pizza_burger_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "pizza_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "pizza_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "pizza_burger_deluxe",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_regular",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_regular",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_regular",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_regular",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 40
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BURGER_VEGGIE_BURGER_CHICKEN_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_deluxe",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 40
  },
  {
    "itemId": "salmon_burger_regular",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "salmon_burger_regular",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "salmon_burger_regular",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "salmon_burger_regular",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 40
  },
  {
    "itemId": "salmon_burger_deluxe",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "salmon_burger_deluxe",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "salmon_burger_deluxe",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "salmon_burger_deluxe",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 40
  },
  {
    "itemId": "hot_dog_1_4_lb",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "hot_dog_1_4_lb",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "hot_dog_1_4_lb",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HOT_DOG_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "hot_dog_1_4_lb",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 40
  },
  {
    "itemId": "chili_dog_1_4_lb",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "chili_dog_1_4_lb",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "chili_dog_1_4_lb",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HOT_DOG_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "chili_dog_1_4_lb",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_FRIES_ONION_RINGS_SIDE",
    "sortOrder": 40
  },
  {
    "itemId": "hot_pastrami",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "hot_pastrami",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "hot_pastrami",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "hot_pastrami",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PASTRAMI_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "hot_corned_beef",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "hot_corned_beef",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "hot_corned_beef",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "hot_corned_beef",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "hot_brisket",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "hot_brisket",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "hot_brisket",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "hot_brisket",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BRISKET_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "corned_beef_reuben",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "corned_beef_reuben",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "corned_beef_reuben",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "corned_beef_reuben",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "corned_beef_reuben",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "pastrami_reuben",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "pastrami_reuben",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "pastrami_reuben",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "pastrami_reuben",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PASTRAMI_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "pastrami_reuben",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "turkey_reuben",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_reuben",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "turkey_reuben",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "turkey_reuben",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "turkey_reuben",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "corned_beef_pastrami",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "corned_beef_pastrami",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "corned_beef_pastrami",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "corned_beef_pastrami",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_PASTRAMI_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "corned_beef_pastrami",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "sandwiches_deli_deli_roast_beef",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_deli_roast_beef",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_deli_roast_beef",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_deli_roast_beef",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "sandwiches_deli_deli_turkey",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_deli_turkey",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_deli_turkey",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_deli_turkey",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "sandwiches_deli_deli_salami",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_deli_salami",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_deli_salami",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_deli_salami",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALAMI_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "ham",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "ham",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "ham",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "ham",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "chopped_liver",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "chopped_liver",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "chopped_liver",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "chopped_liver",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "sandwiches_deli_deli_ham_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_deli_ham_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_deli_ham_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_deli_ham_cheese",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_CHOPPED_LIVER_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_TURKEY_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "turkey_swiss_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_swiss_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "turkey_swiss_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "turkey_swiss_cheese",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "turkey_swiss_cheese",
    "modifierGroupId": "MG_SAUCE_RUSSIAN_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PASTRAMI_CORNED_BEEF_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "modifierGroupId": "MG_SAUCE_HORSERADISH_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "braised_brisket_of_beef",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "braised_brisket_of_beef",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "braised_brisket_of_beef",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "braised_brisket_of_beef",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BRISKET_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "braised_brisket_of_beef",
    "modifierGroupId": "MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "sandwiches_deli_sandwiches_tuna_salad",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_sandwiches_tuna_salad",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_sandwiches_tuna_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_sandwiches_tuna_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "sandwiches_deli_sandwiches_tuna_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chicken_salad",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chicken_salad",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chicken_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chicken_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chicken_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "sandwiches_deli_sandwiches_egg_salad",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_sandwiches_egg_salad",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_sandwiches_egg_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_sandwiches_egg_salad",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "sortOrder": 40
  },
  {
    "itemId": "sandwiches_deli_sandwiches_egg_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chunky_shrimp_salad",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chunky_shrimp_salad",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chunky_shrimp_salad",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chunky_shrimp_salad",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_tuna",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_tuna",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_tuna",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_tuna",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_salmon",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_salmon",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_salmon",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_salmon",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALMON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "bacon_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "bacon_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "sandwiches_deli_sandwiches_american_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_sandwiches_american_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_sandwiches_american_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sandwiches_deli_sandwiches_imported_swiss_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sandwiches_deli_sandwiches_imported_swiss_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sandwiches_deli_sandwiches_imported_swiss_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sardine_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sardine_sandwich",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "sardine_sandwich",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sardine_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SARDINE_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "lettuce_tomato_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "lettuce_tomato_sandwich",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "lettuce_tomato_sandwich",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_SWISS_CHEESE_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_TAYLOR_HAM_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "modifierGroupId": "MG_ADD_TOMATO_ADD_TOMATO_TOMATO",
    "sortOrder": 50
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BRISKET_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 40
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_TURKEY_BACON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "sortOrder": 40
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TUNA_FISH_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 60
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_BACON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG",
    "sortOrder": 40
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 60
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_ROAST_BEEF_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHOPPED_LIVER_BACON_CHICKEN_LIVER_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SHRIMP_BACON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "modifierGroupId": "MG_SAUCE_MAYO_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_GRILLED_CHICKEN_BACON_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BURGER_PATTY_BACON_HAM_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 50
  },
  {
    "itemId": "homemade_potato_salad_or_homemade_cole_slaw",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "homemade_potato_salad_or_homemade_cole_slaw",
    "modifierGroupId": "MG_SIDE_SIDE_CHOOSE_SIDE_POTATO_SALAD_COLE_SLAW",
    "sortOrder": 20
  },
  {
    "itemId": "french_fries",
    "modifierGroupId": "MG_SAUCE_GRAVY_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "french_fries",
    "modifierGroupId": "MG_ADD_ON_ADD_ON_GRAVY_CHEESE_CHEESE_AND_GRAVY",
    "sortOrder": 20
  },
  {
    "itemId": "health_salad",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 10
  },
  {
    "itemId": "cottage_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "souffle_of_cottage_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_COTTAGE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "feta_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "meatball_each",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "sausage_pork_or_turkey",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_PORK_SAUSAGE_TURKEY_SAUSAGE_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "bacon_ham_or_taylor_ham",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_TAYLOR_HAM_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "canadian_bacon",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "turkey_bacon",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_BACON_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "corned_beef_hash",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "hard_roll_with_butter",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_HARD_ROLL_WITH_BUTTER",
    "sortOrder": 10
  },
  {
    "itemId": "toast_with_butter_jelly",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_WITH_BUTTER_AND_JELLY",
    "sortOrder": 10
  },
  {
    "itemId": "english_muffin_with_butter_jelly",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_ENGLISH_MUFFIN_WITH_BUTTER_AND_JELLY",
    "sortOrder": 10
  },
  {
    "itemId": "blueberry_muffin_or_apple_cinnamon_muffin",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BLUEBERRY_MUFFIN_OR_APPLE_CINNAMON_MUFFIN",
    "sortOrder": 10
  },
  {
    "itemId": "blueberry_muffin_or_apple_cinnamon_muffin",
    "modifierGroupId": "MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_BLUEBERRY_MUFFIN_APPLE_CINNAMON_MUFFIN",
    "sortOrder": 20
  },
  {
    "itemId": "chocolate_chip_muffin",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_CHOCOLATE_CHIP_MUFFIN",
    "sortOrder": 10
  },
  {
    "itemId": "corn_or_bran_muffin",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_CORN_OR_BRAN_MUFFIN",
    "sortOrder": 10
  },
  {
    "itemId": "corn_or_bran_muffin",
    "modifierGroupId": "MG_CHOOSE_MUFFIN_CHOOSE_MUFFIN_CORN_MUFFIN_BRAN_MUFFIN",
    "sortOrder": 20
  },
  {
    "itemId": "cheesecake",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "sugar_free_cheesecake",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "strawberry_cheesecake",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "apple_cherry_or_blueberry_crumb_pie",
    "modifierGroupId": "MG_CHOOSE_PIE_CHOOSE_PIE_APPLE_CHERRY_BLUEBERRY",
    "sortOrder": 10
  },
  {
    "itemId": "hamantaschen",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAMBURGER_GRILLED_CHICKEN_SANDWICH_BURGER_PATTY_GRILLED_CHICKEN_",
    "sortOrder": 20
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "sortOrder": 30
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 40
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 50
  },
  {
    "itemId": "kids_kids_korner_chicken_fingers",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "kids_kids_korner_chicken_fingers",
    "modifierGroupId": "MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "kids_kids_korner_chicken_fingers",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "sortOrder": 30
  },
  {
    "itemId": "kids_kids_korner_chicken_fingers",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 40
  },
  {
    "itemId": "kids_kids_korner_chicken_fingers",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 50
  },
  {
    "itemId": "fried_chicken_nuggets",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "fried_chicken_nuggets",
    "modifierGroupId": "MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "fried_chicken_nuggets",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "sortOrder": 30
  },
  {
    "itemId": "fried_chicken_nuggets",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 40
  },
  {
    "itemId": "fried_chicken_nuggets",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 50
  },
  {
    "itemId": "grilled_hot_dog",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_hot_dog",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HOT_DOG_NO_PROTEIN",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_hot_dog",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "sortOrder": 30
  },
  {
    "itemId": "grilled_hot_dog",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 40
  },
  {
    "itemId": "grilled_hot_dog",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 50
  },
  {
    "itemId": "cheeseburger",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BUN_NO_BUN",
    "sortOrder": 10
  },
  {
    "itemId": "cheeseburger",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 20
  },
  {
    "itemId": "cheeseburger",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BEEF_BURGER_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "cheeseburger",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 40
  },
  {
    "itemId": "cheeseburger",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "sortOrder": 50
  },
  {
    "itemId": "cheeseburger",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 60
  },
  {
    "itemId": "cheeseburger",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 70
  },
  {
    "itemId": "fried_fish",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_FISH_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "fried_fish",
    "modifierGroupId": "MG_SAUCE_DIPPING_SAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "fried_fish",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "sortOrder": 30
  },
  {
    "itemId": "fried_fish",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 40
  },
  {
    "itemId": "fried_fish",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 50
  },
  {
    "itemId": "spaghetti_meatball_complete",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_MEATBALL_NO_PROTEIN",
    "sortOrder": 10
  },
  {
    "itemId": "spaghetti_meatball_complete",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "sortOrder": 20
  },
  {
    "itemId": "spaghetti_meatball_complete",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 30
  },
  {
    "itemId": "spaghetti_meatball_complete",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 40
  },
  {
    "itemId": "macaroni_cheese_complete",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE_2",
    "sortOrder": 10
  },
  {
    "itemId": "macaroni_cheese_complete",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "sortOrder": 20
  },
  {
    "itemId": "macaroni_cheese_complete",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 30
  },
  {
    "itemId": "macaroni_cheese_complete",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 40
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "modifierGroupId": "MG_CHEESE_CHEESE_APPLIES_TO_GRILLED_CHEESE_SELECTION_STANDARD_NO_CHEESE_EXTRA_CHEES",
    "sortOrder": 20
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "modifierGroupId": "MG_SIDE_SIDE_FRENCH_FRIES_ONE_VEGETABLE",
    "sortOrder": 30
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "modifierGroupId": "MG_DESSERT_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 40
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "modifierGroupId": "MG_CHOOSE_DESSERT_CHOOSE_DESSERT_JELLO_ICE_CREAM",
    "sortOrder": 50
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "modifierGroupId": "MG_CHOOSE_SANDWICH_CHOOSE_SANDWICH_GRILLED_CHEESE_PEANUT_BUTTER_AND_JELLY",
    "sortOrder": 60
  },
  {
    "itemId": "two_eggs_any_style",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "two_eggs_any_style",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "two_eggs_any_style",
    "modifierGroupId": "MG_EGG_EGG_EGGS_NO_EGGS",
    "sortOrder": 30
  },
  {
    "itemId": "two_eggs_any_style",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "sortOrder": 40
  },
  {
    "itemId": "two_eggs_any_style",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 50
  },
  {
    "itemId": "two_eggs_any_style",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "single_egg",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "single_egg",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "single_egg",
    "modifierGroupId": "MG_EGG_EGG_EGGS_NO_EGGS",
    "sortOrder": 30
  },
  {
    "itemId": "single_egg",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "sortOrder": 40
  },
  {
    "itemId": "single_egg",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_PORK_SAUSAGE_TURKEY_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 50
  },
  {
    "itemId": "single_egg",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "sliced_steak_eggs",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_2",
    "sortOrder": 10
  },
  {
    "itemId": "sliced_steak_eggs",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_DRY_BUTTERED_BREAD_TYPE_SHOULD_BE_EXPLICIT_",
    "sortOrder": 20
  },
  {
    "itemId": "sliced_steak_eggs",
    "modifierGroupId": "MG_EGG_EGG_EGGS_NO_EGGS_2",
    "sortOrder": 30
  },
  {
    "itemId": "sliced_steak_eggs",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "sortOrder": 40
  },
  {
    "itemId": "sliced_steak_eggs",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_STEAK_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "sliced_steak_eggs",
    "modifierGroupId": "MG_PROTEIN_COOK_COOK_TEMPERATURE_RARE_MEDIUM_RARE_MEDIUM_MEDIUM_WELL_WELL_DONE",
    "sortOrder": 60
  },
  {
    "itemId": "sliced_steak_eggs",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 70
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "modifierGroupId": "MG_EGG_EGG_EGGS_NO_EGGS",
    "sortOrder": 30
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_SUNNY_SIDE_UP_OVER_EASY_OVER_MEDIUM_OVER_HARD",
    "sortOrder": 40
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CORNED_BEEF_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "eggs_benedict",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "eggs_benedict",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "eggs_benedict",
    "modifierGroupId": "MG_EGG_EGG_EGGS_NO_EGGS",
    "sortOrder": 30
  },
  {
    "itemId": "eggs_benedict",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BENEDICT_PROTEIN_COMPONENT_VERIFY_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "eggs_benedict",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "homemade_blintzes",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 10
  },
  {
    "itemId": "homemade_blintzes",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "egg_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "egg_sandwich",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "egg_sandwich",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "sortOrder": 30
  },
  {
    "itemId": "egg_sandwich",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "sortOrder": 40
  },
  {
    "itemId": "egg_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "egg_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "egg_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "egg_cheese",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "sortOrder": 40
  },
  {
    "itemId": "egg_cheese",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "sortOrder": 50
  },
  {
    "itemId": "taylor_ham_sandwich",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "taylor_ham_sandwich",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "taylor_ham_sandwich",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TAYLOR_HAM_NO_PROTEIN",
    "sortOrder": 30
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "sortOrder": 30
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "sortOrder": 40
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_BACON_SALAMI_SAUSAGE_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "breakfast_egg_sandwiches_western",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "breakfast_egg_sandwiches_western",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "breakfast_egg_sandwiches_western",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "sortOrder": 30
  },
  {
    "itemId": "breakfast_egg_sandwiches_western",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "sortOrder": 40
  },
  {
    "itemId": "taylor_ham_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "taylor_ham_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "taylor_ham_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "taylor_ham_cheese",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TAYLOR_HAM_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "taylor_ham_egg",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "taylor_ham_egg",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "taylor_ham_egg",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "sortOrder": 30
  },
  {
    "itemId": "taylor_ham_egg",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "sortOrder": 40
  },
  {
    "itemId": "taylor_ham_egg",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TAYLOR_HAM_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "sortOrder": 40
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "sortOrder": 50
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TAYLOR_HAM_NO_PROTEIN",
    "sortOrder": 60
  },
  {
    "itemId": "breakfast_egg_sandwiches_mixed_deli",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "breakfast_egg_sandwiches_mixed_deli",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "breakfast_egg_sandwiches_mixed_deli",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "sortOrder": 30
  },
  {
    "itemId": "breakfast_egg_sandwiches_mixed_deli",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "sortOrder": 40
  },
  {
    "itemId": "avocado_toast_platter",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "avocado_toast_platter",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "avocado_toast_platter",
    "modifierGroupId": "MG_EGG_EGG_EGG_NO_EGG_2",
    "sortOrder": 30
  },
  {
    "itemId": "avocado_toast_platter",
    "modifierGroupId": "MG_EGG_COOK_EGG_COOK_SCRAMBLED_FRIED_OVER_STYLE_HOUSE_OPTIONS_SHOULD_BE_EXPLICIT_VE",
    "sortOrder": 40
  },
  {
    "itemId": "avocado_toast_platter",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_VEGETABLES_NO_SIDE",
    "sortOrder": 50
  },
  {
    "itemId": "atzon_brei",
    "modifierGroupId": "MG_EGG_EGG_EGG_BASED_MATZOH_BREI",
    "sortOrder": 10
  },
  {
    "itemId": "atzon_brei",
    "modifierGroupId": "MG_SAUCE_SOUR_CREAM_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "atzon_brei",
    "modifierGroupId": "MG_SAUCE_APPLESAUCE_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 30
  },
  {
    "itemId": "challah_french_toast_plain_or_raisin",
    "modifierGroupId": "MG_CHOOSE_CHALLAH_CHOOSE_CHALLAH_PLAIN_RAISIN",
    "sortOrder": 10
  },
  {
    "itemId": "plain",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "plain",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "plain",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "plain",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "plain",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_AMERICAN_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_SWISS_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "cheddar_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "cheddar_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "cheddar_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEDDAR_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "cheddar_cheese",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "cheddar_cheese",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_HAM_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_TURKEY_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "bacon_or_ham",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "bacon_or_ham",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "bacon_or_ham",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "bacon_or_ham",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "bacon_or_ham",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_HAM_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "bacon_or_ham",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "spanish",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "spanish",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "spanish",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "spanish",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "spanish",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "feta_tomato",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "feta_tomato",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "feta_tomato",
    "modifierGroupId": "MG_CHEESE_CHEESE_FETA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "feta_tomato",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "feta_tomato",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SALAMI_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "sausage",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "sausage",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "sausage",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "sausage",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "sausage",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SAUSAGE_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "sausage",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "onion",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "onion",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "onion",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "onion",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "onion",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "fresh_mushrooms",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "fresh_mushrooms",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "fresh_mushrooms",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "fresh_mushrooms",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "fresh_mushrooms",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "chicken_liver",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "chicken_liver",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "chicken_liver",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "chicken_liver",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "chicken_liver",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_CHICKEN_LIVER_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "chicken_liver",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "nova_onion",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "nova_onion",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "nova_onion",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "nova_onion",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "nova_onion",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_NOVA_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "nova_onion",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "breakfast_omelettes_mixed_deli",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "breakfast_omelettes_mixed_deli",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "breakfast_omelettes_mixed_deli",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "breakfast_omelettes_mixed_deli",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "breakfast_omelettes_mixed_deli",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "breakfast_omelettes_western",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "breakfast_omelettes_western",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "breakfast_omelettes_western",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "breakfast_omelettes_western",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "breakfast_omelettes_western",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "spinach",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "spinach",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "spinach",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "spinach",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "spinach",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "broccoli",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "broccoli",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "broccoli",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_CHEESE_CHEESE_TYPE_VERIFY_NO_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "broccoli",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "broccoli",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "scallion_cream_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "scallion_cream_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "scallion_cream_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "scallion_cream_cheese",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "scallion_cream_cheese",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "farmer_s_omelette",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD_3",
    "sortOrder": 10
  },
  {
    "itemId": "farmer_s_omelette",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP",
    "sortOrder": 20
  },
  {
    "itemId": "farmer_s_omelette",
    "modifierGroupId": "MG_CHEESE_CHEESE_ADD_SUB_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "farmer_s_omelette",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "farmer_s_omelette",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_SUBSTITUTION_VERIFY",
    "sortOrder": 50
  },
  {
    "itemId": "italian_omelette",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_TOAST_NO_BREAD",
    "sortOrder": 10
  },
  {
    "itemId": "italian_omelette",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOAST_PREP_TOASTED_DRY_BUTTERED",
    "sortOrder": 20
  },
  {
    "itemId": "italian_omelette",
    "modifierGroupId": "MG_CHEESE_CHEESE_MOZZARELLA_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "italian_omelette",
    "modifierGroupId": "MG_EGG_EGG_OMELETTE_EGGS",
    "sortOrder": 40
  },
  {
    "itemId": "italian_omelette",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_SAUSAGE_NO_PROTEIN",
    "sortOrder": 50
  },
  {
    "itemId": "italian_omelette",
    "modifierGroupId": "MG_SIDE_SIDE_HOME_FRIES_NO_SIDE_SUBSTITUTION_VERIFY",
    "sortOrder": 60
  },
  {
    "itemId": "german_apple_pancake",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 10
  },
  {
    "itemId": "german_apple_pancake",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "german_apple_pancake",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 30
  },
  {
    "itemId": "buttermilk_pancakes",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 10
  },
  {
    "itemId": "buttermilk_pancakes",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "buttermilk_pancakes",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 30
  },
  {
    "itemId": "blueberry_pancakes",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 10
  },
  {
    "itemId": "blueberry_pancakes",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "blueberry_pancakes",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 30
  },
  {
    "itemId": "blueberry_pancakes",
    "modifierGroupId": "MG_CHOOSE_SIZE_CHOOSE_SIZE_FULL_STACK_SHORT_STACK",
    "sortOrder": 40
  },
  {
    "itemId": "chocolate_chip_pancakes",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 10
  },
  {
    "itemId": "chocolate_chip_pancakes",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "chocolate_chip_pancakes",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 30
  },
  {
    "itemId": "chocolate_chip_pancakes",
    "modifierGroupId": "MG_CHOOSE_SIZE_CHOOSE_SIZE_FULL_STACK_SHORT_STACK",
    "sortOrder": 40
  },
  {
    "itemId": "short_stack_of_pancakes",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 10
  },
  {
    "itemId": "short_stack_of_pancakes",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "short_stack_of_pancakes",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 30
  },
  {
    "itemId": "silver_dollars",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 10
  },
  {
    "itemId": "silver_dollars",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 20
  },
  {
    "itemId": "french_toast",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 10
  },
  {
    "itemId": "french_toast",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "french_toast",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 30
  },
  {
    "itemId": "belgian_waffle",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_BACON_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 10
  },
  {
    "itemId": "belgian_waffle",
    "modifierGroupId": "MG_SAUCE_SYRUP_BUTTER_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 20
  },
  {
    "itemId": "belgian_waffle",
    "modifierGroupId": "MG_SIDE_SIDE_ADD_BACON_HAM_SAUSAGE_TAYLOR_HAM",
    "sortOrder": 30
  },
  {
    "itemId": "belgian_waffle",
    "modifierGroupId": "MG_ADD_STRAWBERRIES_ADD_STRAWBERRIES_STRAWBERRIES",
    "sortOrder": 40
  },
  {
    "itemId": "toasted_bagel_with_butter_jelly",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL",
    "sortOrder": 10
  },
  {
    "itemId": "toasted_bagel_with_butter_jelly",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "toasted_bagel_with_cream_cheese",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL",
    "sortOrder": 10
  },
  {
    "itemId": "toasted_bagel_with_cream_cheese",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "toasted_bagel_with_cream_cheese",
    "modifierGroupId": "MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "nova_platter",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL",
    "sortOrder": 10
  },
  {
    "itemId": "nova_platter",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "nova_platter",
    "modifierGroupId": "MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "nova_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_NOVA_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "smoked_whitefish_platter",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL",
    "sortOrder": 10
  },
  {
    "itemId": "smoked_whitefish_platter",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "smoked_whitefish_platter",
    "modifierGroupId": "MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "smoked_whitefish_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_WHITEFISH_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "modifierGroupId": "MG_BREAD_CHOOSE_BREAD_BAGEL_NO_BAGEL",
    "sortOrder": 10
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "modifierGroupId": "MG_BREAD_PREP_BREAD_PREPARATION_TOASTED_NOT_TOASTED",
    "sortOrder": 20
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "modifierGroupId": "MG_CHEESE_CHEESE_CREAM_CHEESE_NO_CHEESE_EXTRA_CHEESE",
    "sortOrder": 30
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "modifierGroupId": "MG_PROTEIN_PROTEIN_WHITEFISH_NO_PROTEIN",
    "sortOrder": 40
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "modifierGroupId": "MG_SAUCE_CHOICE_OF_DRESSING_NORMAL_NO_ON_SIDE_EXTRA",
    "sortOrder": 50
  },
  {
    "itemId": "fresh_ground_coffee_regular_or_decaf",
    "modifierGroupId": "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_REGULAR_DECAF",
    "sortOrder": 10
  },
  {
    "itemId": "milk_or_skim_milk_small",
    "modifierGroupId": "MG_CHOOSE_MILK_CHOOSE_MILK_MILK_SKIM_MILK",
    "sortOrder": 10
  },
  {
    "itemId": "milk_or_skim_milk_large",
    "modifierGroupId": "MG_CHOOSE_MILK_CHOOSE_MILK_MILK_SKIM_MILK",
    "sortOrder": 10
  },
  {
    "itemId": "iced_coffee_or_iced_decaffeinated",
    "modifierGroupId": "MG_CHOOSE_COFFEE_CHOOSE_COFFEE_ICED_COFFEE_ICED_DECAF",
    "sortOrder": 10
  },
  {
    "itemId": "old_fashioned_shake",
    "modifierGroupId": "MG_THICKNESS_THICKNESS_REGULAR_EXTRA_THICK",
    "sortOrder": 10
  },
  {
    "itemId": "old_fashioned_shake",
    "modifierGroupId": "MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY",
    "sortOrder": 20
  },
  {
    "itemId": "traditional_ice_cream_soda",
    "modifierGroupId": "MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY",
    "sortOrder": 10
  },
  {
    "itemId": "delicious_ice_cream_sundae",
    "modifierGroupId": "MG_FLAVOR_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY_OTHER_HOUSE_FLAVORS_VERIFY",
    "sortOrder": 10
  },
  {
    "itemId": "dish_of_ice_cream_chocolate_vanilla_or_strawberry",
    "modifierGroupId": "MG_CHOOSE_FLAVOR_CHOOSE_FLAVOR_CHOCOLATE_VANILLA_STRAWBERRY",
    "sortOrder": 10
  }
] as ItemModifierGroupData[];

export const ingredients: IngredientData[] = [
  {
    "id": "ING_FRESH_MOZZARELLA",
    "name": "Fresh Mozzarella",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_VODKA_SAUCE",
    "name": "Vodka Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SANDWICH_BREAD",
    "name": "Sandwich Bread",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHICKEN_CUTLET",
    "name": "Chicken Cutlet",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_LETTUCE",
    "name": "Lettuce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHEDDAR",
    "name": "Cheddar",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BUFFALO_SAUCE",
    "name": "Buffalo Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BACON",
    "name": "Bacon",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TOMATO",
    "name": "Tomato",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_AMERICAN_CHEESE",
    "name": "American Cheese",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_RANCH_DRESSING",
    "name": "Ranch Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PESTO_SAUCE",
    "name": "Pesto Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SUN_DRIED_TOMATOES",
    "name": "Sun-Dried Tomatoes",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ROASTED_PEPPERS",
    "name": "Roasted Peppers",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ARUGULA",
    "name": "Arugula",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BALSAMIC_GLAZE",
    "name": "Balsamic Glaze",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_OLIVE_OIL",
    "name": "Olive Oil",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PEPPERONI",
    "name": "Pepperoni",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_JALAPENO_PEPPERS",
    "name": "Jalapeño Peppers",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_RED_ONION",
    "name": "Red Onion",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHIPOTLE_MAYO",
    "name": "Chipotle Mayo",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_AVOCADO",
    "name": "Avocado",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PICKLES",
    "name": "Pickles",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FRIED_CHICKEN",
    "name": "Fried Chicken",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FRIED_STRING_ONIONS",
    "name": "Fried String Onions",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BBQ_SAUCE",
    "name": "BBQ Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MOZZARELLA",
    "name": "Mozzarella",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MARINARA_SAUCE",
    "name": "Marinara Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HAM",
    "name": "Ham",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SWISS_CHEESE",
    "name": "Swiss Cheese",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HONEY_MUSTARD",
    "name": "Honey Mustard",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MAYO",
    "name": "Mayo",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GRILLED_CHICKEN",
    "name": "Grilled Chicken",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ROMAINE_LETTUCE",
    "name": "Romaine Lettuce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BLUE_CHEESE",
    "name": "Blue Cheese",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_WRAP",
    "name": "Wrap",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SAUTEED_ONIONS",
    "name": "Sautéed Onions",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_STEAK",
    "name": "Steak",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BLACK_BEANS",
    "name": "Black Beans",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHICKEN",
    "name": "Chicken",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GOAT_CHEESE",
    "name": "Goat Cheese",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TURKEY",
    "name": "Turkey",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ROAST_BEEF",
    "name": "Roast Beef",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FRIED_ONIONS",
    "name": "Fried Onions",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CREAMY_ITALIAN_DRESSING",
    "name": "Creamy Italian Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GYRO_MEAT",
    "name": "Gyro Meat",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MONTEREY_JACK",
    "name": "Monterey Jack",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SOUR_CREAM",
    "name": "Sour Cream",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SHRIMP",
    "name": "Shrimp",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_STRING_BEANS",
    "name": "String Beans",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MESCLUN",
    "name": "Mesclun",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SCALLIONS",
    "name": "Scallions",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_LEMON_GARLIC_DRESSING",
    "name": "Lemon Garlic Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SESAME_CHICKEN",
    "name": "Sesame Chicken",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PORTABELLA_MUSHROOMS",
    "name": "Portabella Mushrooms",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ICEBERG_LETTUCE",
    "name": "Iceberg Lettuce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CARROTS",
    "name": "Carrots",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CUCUMBER",
    "name": "Cucumber",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ALMONDS",
    "name": "Almonds",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BLACK_OLIVE_DRESSING",
    "name": "Black Olive Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SPINACH",
    "name": "Spinach",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SUN_DRIED_CRANBERRIES",
    "name": "Sun-Dried Cranberries",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_WHITE_BALSAMIC_DRESSING",
    "name": "White Balsamic Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ARTICHOKE_HEARTS",
    "name": "Artichoke Hearts",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_OLIVE_OIL_AND_LEMON_DRESSING",
    "name": "Olive Oil & Lemon Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_POACHED_PEARS",
    "name": "Poached Pears",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_WALNUTS",
    "name": "Walnuts",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_RAISINS",
    "name": "Raisins",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MIXED_GREENS",
    "name": "Mixed Greens",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_RASPBERRY_VINAIGRETTE",
    "name": "Raspberry Vinaigrette",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MARINATED_CHICKEN",
    "name": "Marinated Chicken",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MANDARIN_ORANGES",
    "name": "Mandarin Oranges",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SNOW_PEAS",
    "name": "Snow Peas",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FRIED_NOODLES",
    "name": "Fried Noodles",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TERIYAKI_DRESSING",
    "name": "Teriyaki Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FOCACCIA",
    "name": "Focaccia",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TUNA",
    "name": "Tuna",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CILANTRO",
    "name": "Cilantro",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_LEMON_VINAIGRETTE",
    "name": "Lemon Vinaigrette",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_STRAWBERRIES",
    "name": "Strawberries",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SESAME_SEEDS",
    "name": "Sesame Seeds",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_POPPY_WHITE_WINE_VINAIGRETTE",
    "name": "Poppy White Wine Vinaigrette",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BLACKENED_SALMON",
    "name": "Blackened Salmon",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PEARS",
    "name": "Pears",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GREEN_APPLE",
    "name": "Green Apple",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HONEY_BALSAMIC_DRESSING",
    "name": "Honey Balsamic Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BLACKENED_CHICKEN",
    "name": "Blackened Chicken",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CORN",
    "name": "Corn",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_RED_PEPPERS",
    "name": "Red Peppers",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GREEN_PEPPERS",
    "name": "Green Peppers",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MANGO",
    "name": "Mango",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BARLEY",
    "name": "Barley",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_LIME_JUICE",
    "name": "Lime Juice",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HONEY",
    "name": "Honey",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_DIJON_MUSTARD",
    "name": "Dijon Mustard",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CRAB_CAKE",
    "name": "Crab Cake",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TARTAR_SAUCE",
    "name": "Tartar Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ROLL",
    "name": "Roll",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TERIYAKI_SAUCE",
    "name": "Teriyaki Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SUB_ROLL",
    "name": "Sub Roll",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_QUINOA",
    "name": "Quinoa",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ZUCCHINI",
    "name": "Zucchini",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHICKPEAS",
    "name": "Chickpeas",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BURGER_PATTY",
    "name": "Burger Patty",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BUFFALO_CHICKEN",
    "name": "Buffalo Chicken",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_RED_BEANS",
    "name": "Red Beans",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_WHITE_BEANS",
    "name": "White Beans",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CILANTRO_LIME_VINAIGRETTE",
    "name": "Cilantro Lime Vinaigrette",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHERRY_TOMATOES",
    "name": "Cherry Tomatoes",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MEATBALL",
    "name": "Meatball",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHEESE",
    "name": "Cheese",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_VEAL",
    "name": "Veal",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SALMON",
    "name": "Salmon",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SALAMI",
    "name": "Salami",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHICKEN_LIVER",
    "name": "Chicken Liver",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SALSA",
    "name": "Salsa",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GUACAMOLE",
    "name": "Guacamole",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TORTILLA_CHIPS",
    "name": "Tortilla Chips",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHILI",
    "name": "Chili",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PICO_DE_GALLO",
    "name": "Pico de Gallo",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GARLIC_BREAD",
    "name": "Garlic Bread",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_VEGETABLES",
    "name": "Vegetables",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CASHEWS",
    "name": "Cashews",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MUSHROOMS",
    "name": "Mushrooms",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ONION",
    "name": "Onion",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_POTATOES",
    "name": "Potatoes",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GARLIC",
    "name": "Garlic",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_STUFFING",
    "name": "Stuffing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CRANBERRY_SAUCE",
    "name": "Cranberry Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BRISKET",
    "name": "Brisket",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FRESH_VEGETABLES",
    "name": "Fresh Vegetables",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SAUSAGE",
    "name": "Sausage",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SCALLOPS",
    "name": "Scallops",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_LEMON_WEDGE",
    "name": "Lemon Wedge",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FLOUNDER",
    "name": "Flounder",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SWORDFISH",
    "name": "Swordfish",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CLAMS",
    "name": "Clams",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GARLIC_MASHED_POTATOES",
    "name": "Garlic Mashed Potatoes",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BALSAMIC",
    "name": "Balsamic",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PASTA",
    "name": "Pasta",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GROUND_SIRLOIN",
    "name": "Ground Sirloin",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_APPLESAUCE",
    "name": "Applesauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_POTATO_PANCAKE",
    "name": "Potato Pancake",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BROWN_ONIONS",
    "name": "Brown Onions",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TOAST",
    "name": "Toast",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SKIRT_STEAK",
    "name": "Skirt Steak",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SPAGHETTI",
    "name": "Spaghetti",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GARLIC_WHITE_WINE_SAUCE",
    "name": "Garlic White Wine Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GRAVY",
    "name": "Gravy",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_NOODLES",
    "name": "Noodles",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MATZOH_BALLS",
    "name": "Matzoh Balls",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_RICE",
    "name": "Rice",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_EGG",
    "name": "Egg",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BERMUDA_ONION",
    "name": "Bermuda Onion",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_DRESSING",
    "name": "Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FRESH_MUSHROOMS",
    "name": "Fresh Mushrooms",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_ROAST_TURKEY",
    "name": "Roast Turkey",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SARDINE",
    "name": "Sardine",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FRENCH_FRIES",
    "name": "French Fries",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TORPEDO_ROLL",
    "name": "Torpedo Roll",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BUN",
    "name": "Bun",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FOCACCIA_BREAD",
    "name": "Focaccia Bread",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SOY_SAUCE",
    "name": "Soy Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GARLIC_AND_OLIVE_OIL",
    "name": "Garlic & Olive Oil",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_COLE_SLAW",
    "name": "Cole Slaw",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HARD_ROLL",
    "name": "Hard Roll",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TURKEY_MEATLOAF",
    "name": "Turkey Meatloaf",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHICKEN_MEATLOAF",
    "name": "Chicken Meatloaf",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HERO_ROLL",
    "name": "Hero Roll",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TZATZIKI_SAUCE",
    "name": "Tzatziki Sauce",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PITA",
    "name": "Pita",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BALSAMIC_DRESSING",
    "name": "Balsamic Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TORTILLA",
    "name": "Tortilla",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_COTTAGE_CHEESE",
    "name": "Cottage Cheese",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PINEAPPLE",
    "name": "Pineapple",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_LEAN_BEEF_PATTY",
    "name": "Lean Beef Patty",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TURKEY_PATTY",
    "name": "Turkey Patty",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_LEAN_BEEF",
    "name": "Lean Beef",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TOSSED_SALAD",
    "name": "Tossed Salad",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TURKEY_BURGER",
    "name": "Turkey Burger",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHICKEN_BURGER",
    "name": "Chicken Burger",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_JELLO",
    "name": "Jello",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TORTILLA_SHELL",
    "name": "Tortilla Shell",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_OLIVES",
    "name": "Olives",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BALSAMIC_VINAIGRETTE",
    "name": "Balsamic Vinaigrette",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PROVOLONE",
    "name": "Provolone",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BEEF_BURGER",
    "name": "Beef Burger",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SALMON_BURGER",
    "name": "Salmon Burger",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HOT_DOG",
    "name": "Hot Dog",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PASTRAMI",
    "name": "Pastrami",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CORNED_BEEF",
    "name": "Corned Beef",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SAUERKRAUT",
    "name": "Sauerkraut",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_RUSSIAN_DRESSING",
    "name": "Russian Dressing",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHOPPED_LIVER",
    "name": "Chopped Liver",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HORSERADISH",
    "name": "Horseradish",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TAYLOR_HAM",
    "name": "Taylor Ham",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_POTATO_SALAD",
    "name": "Potato Salad",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PORK_SAUSAGE",
    "name": "Pork Sausage",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_TURKEY_SAUSAGE",
    "name": "Turkey Sausage",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BUTTER",
    "name": "Butter",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_JELLY",
    "name": "Jelly",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HAMBURGER",
    "name": "Hamburger",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FISH",
    "name": "Fish",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_GRILLED_CHEESE",
    "name": "Grilled Cheese",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PEANUT_BUTTER_AND_JELLY",
    "name": "Peanut Butter & Jelly",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_HOME_FRIES",
    "name": "Home Fries",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BLUEBERRIES",
    "name": "Blueberries",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_FETA",
    "name": "Feta",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_NOVA",
    "name": "Nova",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BROCCOLI",
    "name": "Broccoli",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CREAM_CHEESE",
    "name": "Cream Cheese",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_PEPPERS",
    "name": "Peppers",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_APPLE",
    "name": "Apple",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CINNAMON_SUGAR",
    "name": "Cinnamon Sugar",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_BAGEL",
    "name": "Bagel",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_WHITEFISH",
    "name": "Whitefish",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_REGULAR_COFFEE",
    "name": "Regular Coffee",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_DECAF_COFFEE",
    "name": "Decaf Coffee",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_MILK",
    "name": "Milk",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_SKIM_MILK",
    "name": "Skim Milk",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_CHOCOLATE",
    "name": "Chocolate",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_VANILLA",
    "name": "Vanilla",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  },
  {
    "id": "ING_STRAWBERRY",
    "name": "Strawberry",
    "allergenFlags": [],
    "defaultAddPrice": null,
    "priceConfigured": false
  }
] as IngredientData[];

export const itemIngredients: ItemIngredientData[] = [
  {
    "itemId": "drunken_chicken",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "drunken_chicken",
    "ingredientId": "ING_VODKA_SAUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "drunken_chicken",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "drunken_chicken",
    "ingredientId": "ING_CHICKEN_CUTLET",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_cheese",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_cheese",
    "ingredientId": "ING_CHEDDAR",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_cheese",
    "ingredientId": "ING_BUFFALO_SAUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_cheese",
    "ingredientId": "ING_CHICKEN_CUTLET",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blt_ranch",
    "ingredientId": "ING_BACON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blt_ranch",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blt_ranch",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blt_ranch",
    "ingredientId": "ING_AMERICAN_CHEESE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blt_ranch",
    "ingredientId": "ING_RANCH_DRESSING",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blt_ranch",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blt_ranch",
    "ingredientId": "ING_CHICKEN_CUTLET",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_pesto",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_pesto",
    "ingredientId": "ING_PESTO_SAUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_pesto",
    "ingredientId": "ING_SUN_DRIED_TOMATOES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_pesto",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_pesto",
    "ingredientId": "ING_CHICKEN_CUTLET",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_caprese",
    "ingredientId": "ING_ROASTED_PEPPERS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_caprese",
    "ingredientId": "ING_ARUGULA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_caprese",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_caprese",
    "ingredientId": "ING_BALSAMIC_GLAZE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_caprese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_caprese",
    "ingredientId": "ING_CHICKEN_CUTLET",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_david",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_david",
    "ingredientId": "ING_OLIVE_OIL",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_david",
    "ingredientId": "ING_PEPPERONI",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_david",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_david",
    "ingredientId": "ING_CHICKEN_CUTLET",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_arizona",
    "ingredientId": "ING_JALAPENO_PEPPERS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_arizona",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_arizona",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_arizona",
    "ingredientId": "ING_CHIPOTLE_MAYO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_arizona",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_arizona",
    "ingredientId": "ING_CHICKEN_CUTLET",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_ritz",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_ritz",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_ritz",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_ritz",
    "ingredientId": "ING_PICKLES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_ritz",
    "ingredientId": "ING_CHIPOTLE_MAYO",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_ritz",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_ritz",
    "ingredientId": "ING_FRIED_CHICKEN",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_texan",
    "ingredientId": "ING_BACON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_texan",
    "ingredientId": "ING_FRIED_STRING_ONIONS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_texan",
    "ingredientId": "ING_CHEDDAR",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_texan",
    "ingredientId": "ING_BBQ_SAUCE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_texan",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_texan",
    "ingredientId": "ING_FRIED_CHICKEN",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_italian",
    "ingredientId": "ING_MOZZARELLA",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_italian",
    "ingredientId": "ING_MARINARA_SAUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_italian",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_italian",
    "ingredientId": "ING_FRIED_CHICKEN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_monte",
    "ingredientId": "ING_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_monte",
    "ingredientId": "ING_SWISS_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_monte",
    "ingredientId": "ING_HONEY_MUSTARD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_monte",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_monte",
    "ingredientId": "ING_FRIED_CHICKEN",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_club",
    "ingredientId": "ING_BACON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_club",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_club",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_club",
    "ingredientId": "ING_MAYO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_club",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "the_club",
    "ingredientId": "ING_FRIED_CHICKEN",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "ingredientId": "ING_ROMAINE_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "ingredientId": "ING_BLUE_CHEESE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "ingredientId": "ING_BUFFALO_SAUCE",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "ingredientId": "ING_WRAP",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "philly_cheesesteak_wrap",
    "ingredientId": "ING_SAUTEED_ONIONS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "philly_cheesesteak_wrap",
    "ingredientId": "ING_WRAP",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "philly_cheesesteak_wrap",
    "ingredientId": "ING_STEAK",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_chicken_wrap",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_chicken_wrap",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_chicken_wrap",
    "ingredientId": "ING_BLACK_BEANS",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_chicken_wrap",
    "ingredientId": "ING_WRAP",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_chicken_wrap",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_wrap_special",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_wrap_special",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_wrap_special",
    "ingredientId": "ING_GOAT_CHEESE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_wrap_special",
    "ingredientId": "ING_HONEY_MUSTARD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_wrap_special",
    "ingredientId": "ING_WRAP",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_wrap_special",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bbq_beef_wrap",
    "ingredientId": "ING_ROAST_BEEF",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bbq_beef_wrap",
    "ingredientId": "ING_FRIED_ONIONS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bbq_beef_wrap",
    "ingredientId": "ING_MOZZARELLA",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bbq_beef_wrap",
    "ingredientId": "ING_WRAP",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro_wrap",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro_wrap",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro_wrap",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro_wrap",
    "ingredientId": "ING_CREAMY_ITALIAN_DRESSING",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro_wrap",
    "ingredientId": "ING_WRAP",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro_wrap",
    "ingredientId": "ING_GYRO_MEAT",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tex_mex_wrap",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tex_mex_wrap",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tex_mex_wrap",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tex_mex_wrap",
    "ingredientId": "ING_BLACK_BEANS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tex_mex_wrap",
    "ingredientId": "ING_MONTEREY_JACK",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tex_mex_wrap",
    "ingredientId": "ING_SOUR_CREAM",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tex_mex_wrap",
    "ingredientId": "ING_WRAP",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "ingredientId": "ING_ROASTED_PEPPERS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "ingredientId": "ING_PESTO_SAUCE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "ingredientId": "ING_WRAP",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pesto_wrap",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_caesar_wrap",
    "ingredientId": "ING_WRAP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_caesar_wrap",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lemon_shrimp_salad",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lemon_shrimp_salad",
    "ingredientId": "ING_ROASTED_PEPPERS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lemon_shrimp_salad",
    "ingredientId": "ING_BACON",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lemon_shrimp_salad",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lemon_shrimp_salad",
    "ingredientId": "ING_STRING_BEANS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lemon_shrimp_salad",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lemon_shrimp_salad",
    "ingredientId": "ING_MESCLUN",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lemon_shrimp_salad",
    "ingredientId": "ING_SCALLIONS",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lemon_shrimp_salad",
    "ingredientId": "ING_LEMON_GARLIC_DRESSING",
    "sortOrder": 9,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad",
    "ingredientId": "ING_SESAME_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad",
    "ingredientId": "ING_PORTABELLA_MUSHROOMS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad",
    "ingredientId": "ING_ICEBERG_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad",
    "ingredientId": "ING_CARROTS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad",
    "ingredientId": "ING_ALMONDS",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad",
    "ingredientId": "ING_BLACK_OLIVE_DRESSING",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "ingredientId": "ING_SPINACH",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "ingredientId": "ING_GOAT_CHEESE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "ingredientId": "ING_SUN_DRIED_CRANBERRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "south_beach_salad_with_grilled_chicken",
    "ingredientId": "ING_WHITE_BALSAMIC_DRESSING",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "insalata_italiano",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "insalata_italiano",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "insalata_italiano",
    "ingredientId": "ING_ROASTED_PEPPERS",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "insalata_italiano",
    "ingredientId": "ING_ARTICHOKE_HEARTS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "insalata_italiano",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "insalata_italiano",
    "ingredientId": "ING_OLIVE_OIL_AND_LEMON_DRESSING",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "paulos_salad_with_grilled_chicken",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "paulos_salad_with_grilled_chicken",
    "ingredientId": "ING_POACHED_PEARS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "paulos_salad_with_grilled_chicken",
    "ingredientId": "ING_WALNUTS",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "paulos_salad_with_grilled_chicken",
    "ingredientId": "ING_RAISINS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "paulos_salad_with_grilled_chicken",
    "ingredientId": "ING_MIXED_GREENS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "paulos_salad_with_grilled_chicken",
    "ingredientId": "ING_RASPBERRY_VINAIGRETTE",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "ingredientId": "ING_MARINATED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "ingredientId": "ING_WALNUTS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "ingredientId": "ING_MANDARIN_ORANGES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "ingredientId": "ING_SNOW_PEAS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "ingredientId": "ING_MIXED_GREENS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "ingredientId": "ING_FRIED_NOODLES",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "ingredientId": "ING_TERIYAKI_DRESSING",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_sandwich",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_sandwich",
    "ingredientId": "ING_ROASTED_PEPPERS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_sandwich",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_sandwich",
    "ingredientId": "ING_PESTO_SAUCE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_sandwich",
    "ingredientId": "ING_FOCACCIA",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "avocado_tuna_salad",
    "ingredientId": "ING_TUNA",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "avocado_tuna_salad",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "avocado_tuna_salad",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "avocado_tuna_salad",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "avocado_tuna_salad",
    "ingredientId": "ING_CILANTRO",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "avocado_tuna_salad",
    "ingredientId": "ING_LEMON_VINAIGRETTE",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "strawberry_spinach_salad",
    "ingredientId": "ING_SPINACH",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "strawberry_spinach_salad",
    "ingredientId": "ING_STRAWBERRIES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "strawberry_spinach_salad",
    "ingredientId": "ING_SESAME_SEEDS",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "strawberry_spinach_salad",
    "ingredientId": "ING_POPPY_WHITE_WINE_VINAIGRETTE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "strawberry_spinach_salad",
    "ingredientId": "ING_BLACKENED_SALMON",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "strawberry_spinach_salad",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "coconut_chicken_ala_ritz",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "coconut_chicken_ala_ritz",
    "ingredientId": "ING_PEARS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "coconut_chicken_ala_ritz",
    "ingredientId": "ING_SUN_DRIED_CRANBERRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "coconut_chicken_ala_ritz",
    "ingredientId": "ING_GREEN_APPLE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "coconut_chicken_ala_ritz",
    "ingredientId": "ING_WALNUTS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "coconut_chicken_ala_ritz",
    "ingredientId": "ING_WHITE_BALSAMIC_DRESSING",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "string_bean_salad_with_grilled_chicken",
    "ingredientId": "ING_STRING_BEANS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "string_bean_salad_with_grilled_chicken",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "string_bean_salad_with_grilled_chicken",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "string_bean_salad_with_grilled_chicken",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "string_bean_salad_with_grilled_chicken",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "string_bean_salad_with_grilled_chicken",
    "ingredientId": "ING_HONEY_BALSAMIC_DRESSING",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "southwest_cobb_salad",
    "ingredientId": "ING_BLACKENED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "southwest_cobb_salad",
    "ingredientId": "ING_ICEBERG_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "southwest_cobb_salad",
    "ingredientId": "ING_CILANTRO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "southwest_cobb_salad",
    "ingredientId": "ING_CORN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "southwest_cobb_salad",
    "ingredientId": "ING_BLACK_BEANS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "southwest_cobb_salad",
    "ingredientId": "ING_RED_PEPPERS",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "southwest_cobb_salad",
    "ingredientId": "ING_MONTEREY_JACK",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "southwest_cobb_salad",
    "ingredientId": "ING_CHEDDAR",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_RED_PEPPERS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_GREEN_PEPPERS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_MANGO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_BARLEY",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_LIME_JUICE",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_OLIVE_OIL",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_CILANTRO",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_HONEY",
    "sortOrder": 9,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_DIJON_MUSTARD",
    "sortOrder": 10,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_SESAME_CHICKEN",
    "sortOrder": 11,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "ingredientId": "ING_MARINATED_CHICKEN",
    "sortOrder": 12,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pan_fried_crab_cake_sandwich",
    "ingredientId": "ING_CRAB_CAKE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pan_fried_crab_cake_sandwich",
    "ingredientId": "ING_ROASTED_PEPPERS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pan_fried_crab_cake_sandwich",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pan_fried_crab_cake_sandwich",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pan_fried_crab_cake_sandwich",
    "ingredientId": "ING_TARTAR_SAUCE",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pan_fried_crab_cake_sandwich",
    "ingredientId": "ING_ROLL",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_special",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_special",
    "ingredientId": "ING_ROASTED_PEPPERS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_special",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_special",
    "ingredientId": "ING_PESTO_SAUCE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "focaccia_special",
    "ingredientId": "ING_FOCACCIA",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "ingredientId": "ING_TERIYAKI_SAUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "ingredientId": "ING_SUB_ROLL",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "ingredientId": "ING_QUINOA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "ingredientId": "ING_ZUCCHINI",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "ingredientId": "ING_CARROTS",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "ingredientId": "ING_MIXED_GREENS",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "ingredientId": "ING_CHICKPEAS",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "ingredientId": "ING_LEMON_VINAIGRETTE",
    "sortOrder": 9,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_burger_salad",
    "ingredientId": "ING_BURGER_PATTY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_burger_salad",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_burger_salad",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_burger_salad",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_burger_salad",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_burger_salad",
    "ingredientId": "ING_MONTEREY_JACK",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_burger_salad",
    "ingredientId": "ING_PICKLES",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "crispy_buffalo_chicken_salad",
    "ingredientId": "ING_BUFFALO_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "crispy_buffalo_chicken_salad",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "crispy_buffalo_chicken_salad",
    "ingredientId": "ING_BLUE_CHEESE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "crispy_buffalo_chicken_salad",
    "ingredientId": "ING_ROMAINE_LETTUCE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "ingredientId": "ING_ROASTED_PEPPERS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "ingredientId": "ING_SUN_DRIED_TOMATOES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "ingredientId": "ING_PESTO_SAUCE",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_italian_sub",
    "ingredientId": "ING_SUB_ROLL",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "three_bean_chicken_salad",
    "ingredientId": "ING_RED_BEANS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "three_bean_chicken_salad",
    "ingredientId": "ING_WHITE_BEANS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "three_bean_chicken_salad",
    "ingredientId": "ING_BLACK_BEANS",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "three_bean_chicken_salad",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "three_bean_chicken_salad",
    "ingredientId": "ING_SCALLIONS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "three_bean_chicken_salad",
    "ingredientId": "ING_ROMAINE_LETTUCE",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "three_bean_chicken_salad",
    "ingredientId": "ING_CILANTRO_LIME_VINAIGRETTE",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "three_bean_chicken_salad",
    "ingredientId": "ING_CHERRY_TOMATOES",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_dinner_pasta_penne_pasta_with_meatballs",
    "ingredientId": "ING_MEATBALL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fusilli_pasta_with_meatballs",
    "ingredientId": "ING_MEATBALL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_dinner_pasta_mac_and_cheese",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_dinner_chicken_chicken_francaise",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_parmesan",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_dinner_chicken_chicken_fingers",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fried_shrimp",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "shrimp_francaise",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_dinner_meat_veal_francaise",
    "ingredientId": "ING_VEAL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "veal_parmesan",
    "ingredientId": "ING_VEAL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_pasta_penne_pasta_with_meatballs",
    "ingredientId": "ING_MEATBALL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fussilli_pasta_with_meatballs",
    "ingredientId": "ING_MEATBALL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_pasta_mac_and_cheese",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_chicken_chicken_fingers",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_tuna_salad",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_tuna_salad",
    "ingredientId": "ING_TUNA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chicken_salad",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chicken_salad",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_egg_salad",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chunky_shrimp_salad",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chunky_shrimp_salad",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_roast_beef",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_roast_beef",
    "ingredientId": "ING_ROAST_BEEF",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_turkey",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_turkey",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_lettuce_and_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_lettuce_and_tomato",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_tuna",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_tuna",
    "ingredientId": "ING_TUNA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_salmon",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_salmon",
    "ingredientId": "ING_SALMON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_and_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_and_cheese",
    "ingredientId": "ING_HAM",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_salami",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_salami",
    "ingredientId": "ING_SALAMI",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "canton_chicken_wings",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_chicken_livers",
    "ingredientId": "ING_CHICKEN_LIVER",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "shrimp_cocktail",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nachos",
    "ingredientId": "ING_CHEDDAR",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nachos",
    "ingredientId": "ING_SALSA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nachos",
    "ingredientId": "ING_GUACAMOLE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nachos",
    "ingredientId": "ING_TORTILLA_CHIPS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nachos",
    "ingredientId": "ING_CHILI",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nachos",
    "ingredientId": "ING_PICO_DE_GALLO",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_soup_with_matzoh_ball_or_noodles_cup",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_soup_with_matzoh_ball_or_noodles_bowl",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "crock_of_onion_soup",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "crock_of_onion_soup",
    "ingredientId": "ING_GARLIC_BREAD",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "szechuan_chicken",
    "ingredientId": "ING_VEGETABLES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "szechuan_chicken",
    "ingredientId": "ING_CASHEWS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "szechuan_chicken",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "szechuan_shrimp",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_familia",
    "ingredientId": "ING_MUSHROOMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_familia",
    "ingredientId": "ING_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_familia",
    "ingredientId": "ING_POTATOES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_familia",
    "ingredientId": "ING_GARLIC",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_familia",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spanish_chicken",
    "ingredientId": "ING_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spanish_chicken",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spanish_chicken",
    "ingredientId": "ING_POTATOES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spanish_chicken",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_half_chicken",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "golden_roasted_half_chicken",
    "ingredientId": "ING_STUFFING",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "golden_roasted_half_chicken",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sauteed_calves_liver",
    "ingredientId": "ING_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "roast_turkey_with_all_the_fixins",
    "ingredientId": "ING_CRANBERRY_SAUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "roast_turkey_with_all_the_fixins",
    "ingredientId": "ING_STUFFING",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "roast_turkey_with_all_the_fixins",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "brisket_of_beef_platter",
    "ingredientId": "ING_BRISKET",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "low_fat_turkey_meat_loaf",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "southern_fried_chicken",
    "ingredientId": "ING_FRIED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_lo_mein",
    "ingredientId": "ING_FRESH_VEGETABLES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_lo_mein",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_giambotta",
    "ingredientId": "ING_SAUSAGE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_giambotta",
    "ingredientId": "ING_MUSHROOMS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_giambotta",
    "ingredientId": "ING_ONION",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_giambotta",
    "ingredientId": "ING_POTATOES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_salmon_or_tuna",
    "ingredientId": "ING_SALMON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_salmon_or_tuna",
    "ingredientId": "ING_TUNA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "shrimp_scampi",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fried_scallops",
    "ingredientId": "ING_SCALLOPS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fried_flounder",
    "ingredientId": "ING_LEMON_WEDGE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fried_flounder",
    "ingredientId": "ING_FLOUNDER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fried_shrimp_basket",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_swordfish",
    "ingredientId": "ING_SWORDFISH",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_sea_scallops",
    "ingredientId": "ING_SCALLOPS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "garlic_salmon_balsamic",
    "ingredientId": "ING_SALMON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "stuffed_shrimp",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_flounder",
    "ingredientId": "ING_FLOUNDER",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_or_fried_combo_platter",
    "ingredientId": "ING_SWORDFISH",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_or_fried_combo_platter",
    "ingredientId": "ING_FLOUNDER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_or_fried_combo_platter",
    "ingredientId": "ING_SCALLOPS",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_or_fried_combo_platter",
    "ingredientId": "ING_CLAMS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broiled_or_fried_combo_platter",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_shrimp",
    "ingredientId": "ING_FRESH_VEGETABLES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_shrimp",
    "ingredientId": "ING_GARLIC_MASHED_POTATOES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_shrimp",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_shrimp_pasta",
    "ingredientId": "ING_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_shrimp_pasta",
    "ingredientId": "ING_ARUGULA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_shrimp_pasta",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_shrimp_pasta",
    "ingredientId": "ING_BALSAMIC",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_shrimp_pasta",
    "ingredientId": "ING_PASTA",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_shrimp_pasta",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ground_sirloin",
    "ingredientId": "ING_MUSHROOMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ground_sirloin",
    "ingredientId": "ING_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ground_sirloin",
    "ingredientId": "ING_GROUND_SIRLOIN",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_center_cut_pork_chops",
    "ingredientId": "ING_APPLESAUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_center_cut_pork_chops",
    "ingredientId": "ING_POTATO_PANCAKE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_turkey_steak",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_turkey_steak",
    "ingredientId": "ING_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sliced_skirt_steak_platter",
    "ingredientId": "ING_MUSHROOMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sliced_skirt_steak_platter",
    "ingredientId": "ING_BROWN_ONIONS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sliced_skirt_steak_platter",
    "ingredientId": "ING_TOAST",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sliced_skirt_steak_platter",
    "ingredientId": "ING_SKIRT_STEAK",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_parmigiana",
    "ingredientId": "ING_SPAGHETTI",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_parmigiana",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "veal_cutlet_parmigiana",
    "ingredientId": "ING_SPAGHETTI",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "veal_cutlet_parmigiana",
    "ingredientId": "ING_VEAL",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spaghetti_with_meatballs",
    "ingredientId": "ING_MEATBALL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "eggplant_parmigiana",
    "ingredientId": "ING_SPAGHETTI",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "linguini",
    "ingredientId": "ING_CLAMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lunch_dinner_italian_specialties_chicken_francaise",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lunch_dinner_italian_specialties_veal_francaise",
    "ingredientId": "ING_VEAL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breaded_veal_cutlet",
    "ingredientId": "ING_SPAGHETTI",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breaded_veal_cutlet",
    "ingredientId": "ING_VEAL",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "rigatoni_chicken",
    "ingredientId": "ING_SPINACH",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "rigatoni_chicken",
    "ingredientId": "ING_SUN_DRIED_TOMATOES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "rigatoni_chicken",
    "ingredientId": "ING_GARLIC_WHITE_WINE_SAUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "rigatoni_chicken",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "linguini_ala_ritz_spicy_or_mild",
    "ingredientId": "ING_CLAMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "linguini_ala_ritz_spicy_or_mild",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "linguini_ala_ritz_spicy_or_mild",
    "ingredientId": "ING_PASTA",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "potato_pancakes",
    "ingredientId": "ING_SOUR_CREAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "potato_pancakes",
    "ingredientId": "ING_APPLESAUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "kasha_varnishkas",
    "ingredientId": "ING_GRAVY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_in_the_pot",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_in_the_pot",
    "ingredientId": "ING_CARROTS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_in_the_pot",
    "ingredientId": "ING_NOODLES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_in_the_pot",
    "ingredientId": "ING_MATZOH_BALLS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "flanken_in_the_pot",
    "ingredientId": "ING_CARROTS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "flanken_in_the_pot",
    "ingredientId": "ING_NOODLES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "flanken_in_the_pot",
    "ingredientId": "ING_MATZOH_BALLS",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "potato_pierogies",
    "ingredientId": "ING_BROWN_ONIONS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sauteed_chicken_liver",
    "ingredientId": "ING_MUSHROOMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sauteed_chicken_liver",
    "ingredientId": "ING_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sauteed_chicken_liver",
    "ingredientId": "ING_RICE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sauteed_chicken_liver",
    "ingredientId": "ING_CHICKEN_LIVER",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lunch_dinner_cold_platters_salads_chunky_shrimp_salad",
    "ingredientId": "ING_EGG",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lunch_dinner_cold_platters_salads_chunky_shrimp_salad",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lunch_dinner_cold_platters_salads_chunky_shrimp_salad",
    "ingredientId": "ING_FRESH_VEGETABLES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lunch_dinner_cold_platters_salads_chunky_shrimp_salad",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_salad_platter",
    "ingredientId": "ING_EGG",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_salad_platter",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_salad_platter",
    "ingredientId": "ING_FRESH_VEGETABLES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_salad_platter",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_fish_salad_platter",
    "ingredientId": "ING_EGG",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_fish_salad_platter",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_fish_salad_platter",
    "ingredientId": "ING_FRESH_VEGETABLES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_fish_salad_platter",
    "ingredientId": "ING_TUNA",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_salad_platter",
    "ingredientId": "ING_EGG",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_salad_platter",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_salad_platter",
    "ingredientId": "ING_FRESH_VEGETABLES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_chicken_liver",
    "ingredientId": "ING_EGG",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_chicken_liver",
    "ingredientId": "ING_BERMUDA_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_chicken_liver",
    "ingredientId": "ING_CHICKEN_LIVER",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "greek_salad_small",
    "ingredientId": "ING_DRESSING",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "greek_salad_large",
    "ingredientId": "ING_DRESSING",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spinach_salad",
    "ingredientId": "ING_BACON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spinach_salad",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spinach_salad",
    "ingredientId": "ING_FRESH_MUSHROOMS",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spinach_salad",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_small",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_large",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chef_s_salad",
    "ingredientId": "ING_ROAST_TURKEY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chef_s_salad",
    "ingredientId": "ING_ROAST_BEEF",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chef_s_salad",
    "ingredientId": "ING_HAM",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chef_s_salad",
    "ingredientId": "ING_EGG",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chef_s_salad",
    "ingredientId": "ING_MIXED_GREENS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chef_s_salad",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chef_s_salad",
    "ingredientId": "ING_SWISS_CHEESE",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sardine_platter",
    "ingredientId": "ING_FRESH_VEGETABLES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sardine_platter",
    "ingredientId": "ING_SARDINE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_chicken_over_caesar_salad_lunch",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_chicken_over_caesar_salad_dinner",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheese_steak_deluxe",
    "ingredientId": "ING_FRIED_ONIONS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheese_steak_deluxe",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheese_steak_deluxe",
    "ingredientId": "ING_TORPEDO_ROLL",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheese_steak_deluxe",
    "ingredientId": "ING_STEAK",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_lunch",
    "ingredientId": "ING_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_lunch",
    "ingredientId": "ING_ARUGULA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_lunch",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_lunch",
    "ingredientId": "ING_BALSAMIC",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_lunch",
    "ingredientId": "ING_PASTA",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_lunch",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_dinner",
    "ingredientId": "ING_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_dinner",
    "ingredientId": "ING_ARUGULA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_dinner",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_dinner",
    "ingredientId": "ING_BALSAMIC",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_dinner",
    "ingredientId": "ING_PASTA",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_pasta_dinner",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_chicken_breast_sandwich",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_chicken_breast_sandwich",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_chicken_breast_sandwich",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_chicken_breast_sandwich",
    "ingredientId": "ING_BUN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_chicken_breast_sandwich",
    "ingredientId": "ING_FOCACCIA_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "char_grilled_chicken_breast_sandwich",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sesame_chicken_lunch",
    "ingredientId": "ING_FRESH_MUSHROOMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sesame_chicken_lunch",
    "ingredientId": "ING_SPINACH",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sesame_chicken_lunch",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sesame_chicken_lunch",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sesame_chicken_dinner",
    "ingredientId": "ING_FRESH_MUSHROOMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sesame_chicken_dinner",
    "ingredientId": "ING_SPINACH",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sesame_chicken_dinner",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sesame_chicken_dinner",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_finger_platter",
    "ingredientId": "ING_HONEY_MUSTARD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_finger_platter",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_finger_platter",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "stir_fried_fresh_vegetables",
    "ingredientId": "ING_SOY_SAUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "stir_fried_fresh_vegetables",
    "ingredientId": "ING_GARLIC_AND_OLIVE_OIL",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "french_dip",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "french_dip",
    "ingredientId": "ING_GARLIC_BREAD",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "golden_fried_filet_deluxe",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "golden_fried_filet_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "golden_fried_filet_deluxe",
    "ingredientId": "ING_COLE_SLAW",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_cheesesteak",
    "ingredientId": "ING_FRIED_ONIONS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_cheesesteak",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_cheesesteak",
    "ingredientId": "ING_TORPEDO_ROLL",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_cheesesteak",
    "ingredientId": "ING_STEAK",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_or_chicken_meatloaf_sandwich",
    "ingredientId": "ING_GRAVY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_or_chicken_meatloaf_sandwich",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_or_chicken_meatloaf_sandwich",
    "ingredientId": "ING_HARD_ROLL",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_or_chicken_meatloaf_sandwich",
    "ingredientId": "ING_TURKEY_MEATLOAF",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_or_chicken_meatloaf_sandwich",
    "ingredientId": "ING_CHICKEN_MEATLOAF",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "veal_patti_parmigiana",
    "ingredientId": "ING_TORPEDO_ROLL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "veal_patti_parmigiana",
    "ingredientId": "ING_VEAL",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_melt",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_melt",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_melt",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_melt",
    "ingredientId": "ING_TUNA",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_pot_pie",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "beef_meatball_sandwich",
    "ingredientId": "ING_ROLL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "beef_meatball_sandwich",
    "ingredientId": "ING_MEATBALL",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "eggplant_parmigiana_hero",
    "ingredientId": "ING_HERO_ROLL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_parmigiana_hero",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_parmigiana_hero",
    "ingredientId": "ING_TORPEDO_ROLL",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_parmigiana_hero",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cuban_sandwich",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cuban_sandwich",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro",
    "ingredientId": "ING_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro",
    "ingredientId": "ING_TZATZIKI_SAUCE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro",
    "ingredientId": "ING_PITA",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "gyro",
    "ingredientId": "ING_GYRO_MEAT",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_wrap",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_wrap",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_wrap",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_wrap",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_wrap",
    "ingredientId": "ING_BALSAMIC_DRESSING",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_wrap",
    "ingredientId": "ING_WRAP",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_quesadilla",
    "ingredientId": "ING_SOUR_CREAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_quesadilla",
    "ingredientId": "ING_SALSA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_quesadilla",
    "ingredientId": "ING_TORTILLA",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_quesadilla",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chili_fiesta",
    "ingredientId": "ING_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chili_fiesta",
    "ingredientId": "ING_SOUR_CREAM",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pasta_primavera",
    "ingredientId": "ING_FRESH_VEGETABLES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pasta_primavera",
    "ingredientId": "ING_COTTAGE_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pasta_primavera",
    "ingredientId": "ING_GARLIC",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_bowl",
    "ingredientId": "ING_ROAST_TURKEY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_bowl",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_bowl",
    "ingredientId": "ING_DRESSING",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lean_beef_or_turkey_patti",
    "ingredientId": "ING_COTTAGE_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lean_beef_or_turkey_patti",
    "ingredientId": "ING_PINEAPPLE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lean_beef_or_turkey_patti",
    "ingredientId": "ING_LEAN_BEEF_PATTY",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lean_beef_or_turkey_patti",
    "ingredientId": "ING_TURKEY_PATTY",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lean_beef_or_turkey_patti",
    "ingredientId": "ING_LEAN_BEEF",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "diet_riot",
    "ingredientId": "ING_TOSSED_SALAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "diet_riot",
    "ingredientId": "ING_TURKEY_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "diet_riot",
    "ingredientId": "ING_CHICKEN_BURGER",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "diet_delight",
    "ingredientId": "ING_TOSSED_SALAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pineapple_boat",
    "ingredientId": "ING_COTTAGE_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fresh_fruit_bowl",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fresh_fruit_bowl",
    "ingredientId": "ING_COTTAGE_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fresh_fruit_bowl",
    "ingredientId": "ING_JELLO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_lunch",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_lunch",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_lunch",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_lunch",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_lunch",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_lunch",
    "ingredientId": "ING_BLUE_CHEESE",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_lunch",
    "ingredientId": "ING_TORTILLA_SHELL",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_dinner",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_dinner",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_dinner",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_dinner",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_dinner",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_dinner",
    "ingredientId": "ING_BLUE_CHEESE",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cobb_salad_dinner",
    "ingredientId": "ING_TORTILLA_SHELL",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "caesar_italia",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "caesar_italia",
    "ingredientId": "ING_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "caesar_italia",
    "ingredientId": "ING_ROMAINE_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "caesar_italia",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "caesar_italia",
    "ingredientId": "ING_MOZZARELLA",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "ingredientId": "ING_SESAME_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "ingredientId": "ING_PORTABELLA_MUSHROOMS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "ingredientId": "ING_ICEBERG_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "ingredientId": "ING_CARROTS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "ingredientId": "ING_BLACK_OLIVE_DRESSING",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "ingredientId": "ING_ALMONDS",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "ingredientId": "ING_SESAME_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "ingredientId": "ING_PORTABELLA_MUSHROOMS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "ingredientId": "ING_ICEBERG_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "ingredientId": "ING_CARROTS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "ingredientId": "ING_BLACK_OLIVE_DRESSING",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "ingredientId": "ING_ALMONDS",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "ingredientId": "ING_ICEBERG_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "ingredientId": "ING_CARROTS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "ingredientId": "ING_CHICKPEAS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "ingredientId": "ING_OLIVES",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "ingredientId": "ING_BALSAMIC_VINAIGRETTE",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_lunch",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 9,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "ingredientId": "ING_RED_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "ingredientId": "ING_ICEBERG_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "ingredientId": "ING_CARROTS",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "ingredientId": "ING_CHICKPEAS",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "ingredientId": "ING_OLIVES",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "ingredientId": "ING_FRESH_MOZZARELLA",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "ingredientId": "ING_BALSAMIC_VINAIGRETTE",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ritz_salad_with_grilled_chicken_dinner",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 9,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_salmon_salad",
    "ingredientId": "ING_BLACKENED_SALMON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_salmon_salad",
    "ingredientId": "ING_ROMAINE_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_salmon_salad",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_salmon_salad",
    "ingredientId": "ING_PROVOLONE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_salmon_salad",
    "ingredientId": "ING_LEMON_VINAIGRETTE",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blackened_salmon_salad",
    "ingredientId": "ING_WALNUTS",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "steak_sandwich",
    "ingredientId": "ING_SKIRT_STEAK",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "steak_sandwich",
    "ingredientId": "ING_SAUTEED_ONIONS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "steak_sandwich",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "steak_sandwich",
    "ingredientId": "ING_GARLIC_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "jumbo_burger_regular",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "jumbo_burger_regular",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "jumbo_burger_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "jumbo_burger_deluxe",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheeseburger_regular",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheeseburger_regular",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheeseburger_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheeseburger_deluxe",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_burger_regular",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_burger_regular",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_burger_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_burger_deluxe",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_cheeseburger_regular",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_cheeseburger_regular",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_cheeseburger_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_cheeseburger_deluxe",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mushroom_burger_regular",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mushroom_burger_regular",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mushroom_burger_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "mushroom_burger_deluxe",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chili_burger_regular",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chili_burger_regular",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chili_burger_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chili_burger_deluxe",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pizza_burger_regular",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pizza_burger_regular",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pizza_burger_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pizza_burger_deluxe",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_regular",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_regular",
    "ingredientId": "ING_TURKEY_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_deluxe",
    "ingredientId": "ING_TURKEY_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "salmon_burger_regular",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "salmon_burger_regular",
    "ingredientId": "ING_SALMON_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "salmon_burger_deluxe",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "salmon_burger_deluxe",
    "ingredientId": "ING_SALMON_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_dog_1_4_lb",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_dog_1_4_lb",
    "ingredientId": "ING_HOT_DOG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chili_dog_1_4_lb",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chili_dog_1_4_lb",
    "ingredientId": "ING_HOT_DOG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pastrami",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pastrami",
    "ingredientId": "ING_PASTRAMI",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_corned_beef",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_corned_beef",
    "ingredientId": "ING_CORNED_BEEF",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_brisket",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_brisket",
    "ingredientId": "ING_BRISKET",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_reuben",
    "ingredientId": "ING_SAUERKRAUT",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_reuben",
    "ingredientId": "ING_SWISS_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_reuben",
    "ingredientId": "ING_RUSSIAN_DRESSING",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_reuben",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_reuben",
    "ingredientId": "ING_CORNED_BEEF",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pastrami_reuben",
    "ingredientId": "ING_SAUERKRAUT",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pastrami_reuben",
    "ingredientId": "ING_SWISS_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pastrami_reuben",
    "ingredientId": "ING_RUSSIAN_DRESSING",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pastrami_reuben",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "pastrami_reuben",
    "ingredientId": "ING_PASTRAMI",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_reuben",
    "ingredientId": "ING_SWISS_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_reuben",
    "ingredientId": "ING_RUSSIAN_DRESSING",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_reuben",
    "ingredientId": "ING_COLE_SLAW",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_reuben",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_reuben",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_pastrami",
    "ingredientId": "ING_RUSSIAN_DRESSING",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_pastrami",
    "ingredientId": "ING_COLE_SLAW",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_pastrami",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_pastrami",
    "ingredientId": "ING_CORNED_BEEF",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_deli_roast_beef",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_deli_roast_beef",
    "ingredientId": "ING_ROAST_BEEF",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_deli_turkey",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_deli_turkey",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_deli_salami",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_deli_salami",
    "ingredientId": "ING_SALAMI",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham",
    "ingredientId": "ING_HAM",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_liver",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_liver",
    "ingredientId": "ING_CHOPPED_LIVER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_deli_ham_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_deli_ham_cheese",
    "ingredientId": "ING_HAM",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "ingredientId": "ING_RUSSIAN_DRESSING",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "ingredientId": "ING_COLE_SLAW",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "ingredientId": "ING_CORNED_BEEF",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "ingredientId": "ING_RUSSIAN_DRESSING",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "ingredientId": "ING_COLE_SLAW",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "ingredientId": "ING_CHOPPED_LIVER",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_swiss_cheese",
    "ingredientId": "ING_RUSSIAN_DRESSING",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_swiss_cheese",
    "ingredientId": "ING_COLE_SLAW",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_swiss_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_swiss_cheese",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "ingredientId": "ING_POTATO_PANCAKE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "ingredientId": "ING_HORSERADISH",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "ingredientId": "ING_PASTRAMI",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "ingredientId": "ING_CORNED_BEEF",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "braised_brisket_of_beef",
    "ingredientId": "ING_APPLESAUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "braised_brisket_of_beef",
    "ingredientId": "ING_POTATO_PANCAKE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "braised_brisket_of_beef",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "braised_brisket_of_beef",
    "ingredientId": "ING_BRISKET",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_tuna_salad",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_tuna_salad",
    "ingredientId": "ING_TUNA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chicken_salad",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chicken_salad",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_egg_salad",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chunky_shrimp_salad",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chunky_shrimp_salad",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_tuna",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_tuna",
    "ingredientId": "ING_TUNA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_salmon",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_salmon",
    "ingredientId": "ING_SALMON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_lettuce_tomato",
    "ingredientId": "ING_BACON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_american_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sandwiches_deli_sandwiches_imported_swiss_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sardine_sandwich",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sardine_sandwich",
    "ingredientId": "ING_SARDINE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lettuce_tomato_sandwich",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lettuce_tomato_sandwich",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "lettuce_tomato_sandwich",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "ingredientId": "ING_AMERICAN_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "ingredientId": "ING_SWISS_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "ingredientId": "ING_BACON",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "ingredientId": "ING_HAM",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "ingredientId": "ING_TAYLOR_HAM",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "ingredientId": "ING_GRAVY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "ingredientId": "ING_GRAVY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "ingredientId": "ING_ROAST_BEEF",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "ingredientId": "ING_GRAVY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "ingredientId": "ING_FRENCH_FRIES",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "ingredientId": "ING_BRISKET",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "ingredientId": "ING_ROAST_TURKEY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "ingredientId": "ING_TUNA",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_EGG",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_ROAST_BEEF",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_SWISS_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_SWISS_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "ingredientId": "ING_CHOPPED_LIVER",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "ingredientId": "ING_SHRIMP",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "ingredientId": "ING_MAYO",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_BURGER_PATTY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "homemade_potato_salad_or_homemade_cole_slaw",
    "ingredientId": "ING_POTATO_SALAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "homemade_potato_salad_or_homemade_cole_slaw",
    "ingredientId": "ING_COLE_SLAW",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "meatball_each",
    "ingredientId": "ING_MEATBALL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sausage_pork_or_turkey",
    "ingredientId": "ING_PORK_SAUSAGE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sausage_pork_or_turkey",
    "ingredientId": "ING_TURKEY_SAUSAGE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_ham_or_taylor_ham",
    "ingredientId": "ING_BACON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_ham_or_taylor_ham",
    "ingredientId": "ING_HAM",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_ham_or_taylor_ham",
    "ingredientId": "ING_TAYLOR_HAM",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "canadian_bacon",
    "ingredientId": "ING_BACON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "turkey_bacon",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_hash",
    "ingredientId": "ING_CORNED_BEEF",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hard_roll_with_butter",
    "ingredientId": "ING_BUTTER",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hard_roll_with_butter",
    "ingredientId": "ING_ROLL",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "toast_with_butter_jelly",
    "ingredientId": "ING_BUTTER",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "toast_with_butter_jelly",
    "ingredientId": "ING_JELLY",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "toast_with_butter_jelly",
    "ingredientId": "ING_TOAST",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "english_muffin_with_butter_jelly",
    "ingredientId": "ING_BUTTER",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "english_muffin_with_butter_jelly",
    "ingredientId": "ING_JELLY",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamantaschen",
    "ingredientId": "ING_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "ingredientId": "ING_BURGER_PATTY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "ingredientId": "ING_GRILLED_CHICKEN",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "ingredientId": "ING_BUN",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "ingredientId": "ING_HAMBURGER",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "kids_kids_korner_chicken_fingers",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fried_chicken_nuggets",
    "ingredientId": "ING_CHICKEN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_hot_dog",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_hot_dog",
    "ingredientId": "ING_HOT_DOG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheeseburger",
    "ingredientId": "ING_BUN",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheeseburger",
    "ingredientId": "ING_BEEF_BURGER",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fried_fish",
    "ingredientId": "ING_FISH",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spaghetti_meatball_complete",
    "ingredientId": "ING_MEATBALL",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "macaroni_cheese_complete",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "ingredientId": "ING_GRILLED_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "ingredientId": "ING_PEANUT_BUTTER_AND_JELLY",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "two_eggs_any_style",
    "ingredientId": "ING_TOAST",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "two_eggs_any_style",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "two_eggs_any_style",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "single_egg",
    "ingredientId": "ING_TOAST",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "single_egg",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "single_egg",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sliced_steak_eggs",
    "ingredientId": "ING_STEAK",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sliced_steak_eggs",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sliced_steak_eggs",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sliced_steak_eggs",
    "ingredientId": "ING_TOAST",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "ingredientId": "ING_TOAST",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "ingredientId": "ING_CORNED_BEEF",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "eggs_benedict",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "eggs_benedict",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "eggs_benedict",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "homemade_blintzes",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "homemade_blintzes",
    "ingredientId": "ING_SOUR_CREAM",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "homemade_blintzes",
    "ingredientId": "ING_BLUEBERRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_sandwich",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_sandwich",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_cheese",
    "ingredientId": "ING_EGG",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_cheese",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "egg_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_sandwich",
    "ingredientId": "ING_TAYLOR_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_sandwich",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "ingredientId": "ING_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "ingredientId": "ING_SALAMI",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "ingredientId": "ING_SAUSAGE",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "ingredientId": "ING_EGG",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_egg_sandwiches_western",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_egg_sandwiches_western",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_cheese",
    "ingredientId": "ING_TAYLOR_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_cheese",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_egg",
    "ingredientId": "ING_TAYLOR_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_egg",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_egg",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "ingredientId": "ING_TAYLOR_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_egg_sandwiches_mixed_deli",
    "ingredientId": "ING_SANDWICH_BREAD",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_egg_sandwiches_mixed_deli",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "avocado_toast_platter",
    "ingredientId": "ING_EGG",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "avocado_toast_platter",
    "ingredientId": "ING_AVOCADO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "avocado_toast_platter",
    "ingredientId": "ING_TOAST",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "atzon_brei",
    "ingredientId": "ING_SOUR_CREAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "atzon_brei",
    "ingredientId": "ING_APPLESAUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": true,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "atzon_brei",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "plain",
    "ingredientId": "ING_TOAST",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "plain",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "plain",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "ingredientId": "ING_AMERICAN_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "ingredientId": "ING_SWISS_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheddar_cheese",
    "ingredientId": "ING_CHEDDAR",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheddar_cheese",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheddar_cheese",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "cheddar_cheese",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "ingredientId": "ING_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "ingredientId": "ING_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "ingredientId": "ING_TOAST",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "ingredientId": "ING_EGG",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "ingredientId": "ING_TURKEY",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_or_ham",
    "ingredientId": "ING_BACON",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_or_ham",
    "ingredientId": "ING_HAM",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_or_ham",
    "ingredientId": "ING_TOAST",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_or_ham",
    "ingredientId": "ING_EGG",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "bacon_or_ham",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spanish",
    "ingredientId": "ING_TOAST",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spanish",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spanish",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "feta_tomato",
    "ingredientId": "ING_FETA",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "feta_tomato",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "feta_tomato",
    "ingredientId": "ING_TOAST",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "feta_tomato",
    "ingredientId": "ING_EGG",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "feta_tomato",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "ingredientId": "ING_SALAMI",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "ingredientId": "ING_TOAST",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sausage",
    "ingredientId": "ING_SAUSAGE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sausage",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sausage",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "sausage",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "onion",
    "ingredientId": "ING_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "onion",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "onion",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "onion",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fresh_mushrooms",
    "ingredientId": "ING_FRESH_MUSHROOMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fresh_mushrooms",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fresh_mushrooms",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fresh_mushrooms",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_liver",
    "ingredientId": "ING_FRESH_MUSHROOMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_liver",
    "ingredientId": "ING_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_liver",
    "ingredientId": "ING_CHICKEN_LIVER",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_liver",
    "ingredientId": "ING_TOAST",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_liver",
    "ingredientId": "ING_EGG",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "chicken_liver",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_onion",
    "ingredientId": "ING_NOVA",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_onion",
    "ingredientId": "ING_ONION",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_onion",
    "ingredientId": "ING_TOAST",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_onion",
    "ingredientId": "ING_EGG",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_onion",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_mixed_deli",
    "ingredientId": "ING_TOAST",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_mixed_deli",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_mixed_deli",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_western",
    "ingredientId": "ING_TOAST",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_western",
    "ingredientId": "ING_EGG",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "breakfast_omelettes_western",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spinach",
    "ingredientId": "ING_SPINACH",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spinach",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spinach",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "spinach",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broccoli",
    "ingredientId": "ING_BROCCOLI",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broccoli",
    "ingredientId": "ING_TOAST",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broccoli",
    "ingredientId": "ING_EGG",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "broccoli",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "scallion_cream_cheese",
    "ingredientId": "ING_SCALLIONS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "scallion_cream_cheese",
    "ingredientId": "ING_CREAM_CHEESE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "scallion_cream_cheese",
    "ingredientId": "ING_TOAST",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "scallion_cream_cheese",
    "ingredientId": "ING_EGG",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "scallion_cream_cheese",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "farmer_s_omelette",
    "ingredientId": "ING_MUSHROOMS",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "farmer_s_omelette",
    "ingredientId": "ING_GREEN_PEPPERS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "farmer_s_omelette",
    "ingredientId": "ING_ONION",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "farmer_s_omelette",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "farmer_s_omelette",
    "ingredientId": "ING_BROCCOLI",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "farmer_s_omelette",
    "ingredientId": "ING_EGG",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "farmer_s_omelette",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "farmer_s_omelette",
    "ingredientId": "ING_TOAST",
    "sortOrder": 8,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "italian_omelette",
    "ingredientId": "ING_SAUSAGE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "italian_omelette",
    "ingredientId": "ING_MUSHROOMS",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "italian_omelette",
    "ingredientId": "ING_PEPPERS",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "italian_omelette",
    "ingredientId": "ING_MOZZARELLA",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "italian_omelette",
    "ingredientId": "ING_TOAST",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "italian_omelette",
    "ingredientId": "ING_EGG",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "italian_omelette",
    "ingredientId": "ING_HOME_FRIES",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "german_apple_pancake",
    "ingredientId": "ING_APPLE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "german_apple_pancake",
    "ingredientId": "ING_CINNAMON_SUGAR",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buttermilk_pancakes",
    "ingredientId": "ING_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buttermilk_pancakes",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buttermilk_pancakes",
    "ingredientId": "ING_SAUSAGE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "buttermilk_pancakes",
    "ingredientId": "ING_TAYLOR_HAM",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blueberry_pancakes",
    "ingredientId": "ING_HAM",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blueberry_pancakes",
    "ingredientId": "ING_BACON",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blueberry_pancakes",
    "ingredientId": "ING_SAUSAGE",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "blueberry_pancakes",
    "ingredientId": "ING_TAYLOR_HAM",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "belgian_waffle",
    "ingredientId": "ING_STRAWBERRIES",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "toasted_bagel_with_butter_jelly",
    "ingredientId": "ING_BUTTER",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "toasted_bagel_with_butter_jelly",
    "ingredientId": "ING_JELLY",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "toasted_bagel_with_butter_jelly",
    "ingredientId": "ING_BAGEL",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "toasted_bagel_with_cream_cheese",
    "ingredientId": "ING_CREAM_CHEESE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "toasted_bagel_with_cream_cheese",
    "ingredientId": "ING_BAGEL",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_platter",
    "ingredientId": "ING_BERMUDA_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_platter",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_platter",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_platter",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_platter",
    "ingredientId": "ING_CREAM_CHEESE",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_platter",
    "ingredientId": "ING_BAGEL",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "nova_platter",
    "ingredientId": "ING_NOVA",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_platter",
    "ingredientId": "ING_BERMUDA_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_platter",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_platter",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_platter",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_platter",
    "ingredientId": "ING_CREAM_CHEESE",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_platter",
    "ingredientId": "ING_BAGEL",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_platter",
    "ingredientId": "ING_WHITEFISH",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "ingredientId": "ING_BERMUDA_ONION",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "ingredientId": "ING_LETTUCE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "ingredientId": "ING_TOMATO",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "ingredientId": "ING_CUCUMBER",
    "sortOrder": 4,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "ingredientId": "ING_CREAM_CHEESE",
    "sortOrder": 5,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "ingredientId": "ING_BAGEL",
    "sortOrder": 6,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "ingredientId": "ING_WHITEFISH",
    "sortOrder": 7,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fresh_ground_coffee_regular_or_decaf",
    "ingredientId": "ING_REGULAR_COFFEE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "fresh_ground_coffee_regular_or_decaf",
    "ingredientId": "ING_DECAF_COFFEE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "milk_or_skim_milk_small",
    "ingredientId": "ING_MILK",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "milk_or_skim_milk_small",
    "ingredientId": "ING_SKIM_MILK",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "milk_or_skim_milk_large",
    "ingredientId": "ING_MILK",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "milk_or_skim_milk_large",
    "ingredientId": "ING_SKIM_MILK",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "iced_coffee_or_iced_decaffeinated",
    "ingredientId": "ING_REGULAR_COFFEE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "iced_coffee_or_iced_decaffeinated",
    "ingredientId": "ING_DECAF_COFFEE",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "dish_of_ice_cream_chocolate_vanilla_or_strawberry",
    "ingredientId": "ING_CHOCOLATE",
    "sortOrder": 1,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "dish_of_ice_cream_chocolate_vanilla_or_strawberry",
    "ingredientId": "ING_VANILLA",
    "sortOrder": 2,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  },
  {
    "itemId": "dish_of_ice_cream_chocolate_vanilla_or_strawberry",
    "ingredientId": "ING_STRAWBERRY",
    "sortOrder": 3,
    "isStandard": true,
    "canRemove": true,
    "canExtra": true,
    "canSide": false,
    "extraPrice": null,
    "priceConfigured": false
  }
] as ItemIngredientData[];

export const reviewIssues: MenuReviewIssue[] = [
  {
    "itemId": "drunken_chicken",
    "itemName": "Drunken Chicken",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "buffalo_cheese",
    "itemName": "Buffalo Cheese",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "blt_ranch",
    "itemName": "BLT Ranch",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "the_pesto",
    "itemName": "The Pesto",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "the_caprese",
    "itemName": "The Caprese",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "the_david",
    "itemName": "The David",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "the_arizona",
    "itemName": "The Arizona",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "the_ritz",
    "itemName": "The Ritz",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "the_texan",
    "itemName": "The Texan",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "the_italian",
    "itemName": "The Italian",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "the_monte",
    "itemName": "The Monte",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "the_club",
    "itemName": "The Club",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "buffalo_chicken_wrap",
    "itemName": "Buffalo Chicken Wrap",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "philly_cheesesteak_wrap",
    "itemName": "Philly Cheesesteak Wrap",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "turkey_wrap_special",
    "itemName": "Turkey Wrap Special",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "bbq_beef_wrap",
    "itemName": "BBQ Beef Wrap",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "gyro_wrap",
    "itemName": "Gyro Wrap",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "tex_mex_wrap",
    "itemName": "Tex Mex Wrap",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chicken_caesar_wrap",
    "itemName": "Chicken Caesar Wrap",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "lemon_shrimp_salad",
    "itemName": "Lemon Shrimp Salad",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "marions_chopped_salad",
    "itemName": "Marion’s Chopped Salad",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "insalata_italiano",
    "itemName": "Insalata Italiano",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "teriyaki_chicken_salad",
    "itemName": "Teriyaki Chicken Salad",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "focaccia_sandwich",
    "itemName": "Focaccia Sandwich",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "avocado_tuna_salad",
    "itemName": "Avocado Tuna Salad",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "strawberry_spinach_salad",
    "itemName": "Strawberry Spinach Salad",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "coconut_chicken_ala_ritz",
    "itemName": "Coconut Chicken Ala Ritz",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "southwest_cobb_salad",
    "itemName": "Southwest Cobb Salad",
    "notes": "Verify protein cook/preparation options. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "mango_barley_chicken_salad",
    "itemName": "Mango Barley Chicken Salad",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "focaccia_special",
    "itemName": "Focaccia Special",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "teriyaki_chicken_sub",
    "itemName": "Teriyaki Chicken Sub",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "montreal_chicken_quinoa_salad",
    "itemName": "Montreal Chicken Quinoa Salad",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chopped_burger_salad",
    "itemName": "Chopped Burger Salad",
    "notes": "Verify exact dressing list.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "crispy_buffalo_chicken_salad",
    "itemName": "Crispy Buffalo Chicken Salad",
    "notes": "Verify protein cook/preparation options. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "three_bean_chicken_salad",
    "itemName": "Three Bean Chicken Salad",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "gluten_free_dinner_pasta_penne_pasta_with_meatballs",
    "itemName": "Penne Pasta with Meatballs",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "fusilli_pasta_with_meatballs",
    "itemName": "Fusilli Pasta with Meatballs",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_dinner_pasta_cheese_ravioli",
    "itemName": "Cheese Ravioli",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_dinner_chicken_chicken_francaise",
    "itemName": "Chicken Française",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "chicken_parmesan",
    "itemName": "Chicken Parmesan",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "gluten_free_dinner_chicken_chicken_fingers",
    "itemName": "Chicken Fingers",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "shrimp_francaise",
    "itemName": "Shrimp Francaise",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "gluten_free_dinner_meat_veal_francaise",
    "itemName": "Veal Francaise",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "veal_parmesan",
    "itemName": "Veal Parmesan",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "gluten_free_lunch_pasta_penne_pasta_with_meatballs",
    "itemName": "Penne Pasta with Meatballs",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "fussilli_pasta_with_meatballs",
    "itemName": "Fussilli Pasta with Meatballs",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_pasta_cheese_ravioli",
    "itemName": "Cheese Ravioli",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_chicken_chicken_fingers",
    "itemName": "Chicken Fingers",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_tuna_salad",
    "itemName": "Tuna Salad",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chicken_salad",
    "itemName": "Chicken Salad",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_egg_salad",
    "itemName": "Egg Salad",
    "notes": "Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_chunky_shrimp_salad",
    "itemName": "Chunky Shrimp Salad",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_roast_beef",
    "itemName": "Roast Beef",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_turkey",
    "itemName": "Turkey",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "bacon_lettuce_and_tomato",
    "itemName": "Bacon, Lettuce and Tomato",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_tuna",
    "itemName": "Individual Tuna",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_individual_salmon",
    "itemName": "Individual Salmon",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "ham_and_cheese",
    "itemName": "Ham and Cheese",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "gluten_free_lunch_sandwiches_salami",
    "itemName": "Salami",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "canton_chicken_wings",
    "itemName": "Canton Chicken Wings",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "fried_mozzarella_sticks",
    "itemName": "Fried Mozzarella Sticks",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chopped_chicken_livers",
    "itemName": "Chopped Chicken Livers",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "shrimp_cocktail",
    "itemName": "Shrimp Cocktail",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "feta_cheese_tomato_salad",
    "itemName": "Feta Cheese & Tomato Salad",
    "notes": "Verify exact dressing list. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chicken_soup_with_matzoh_ball_or_noodles_cup",
    "itemName": "Chicken Soup with Matzoh Ball or Noodles — Cup",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chicken_soup_with_matzoh_ball_or_noodles_bowl",
    "itemName": "Chicken Soup with Matzoh Ball or Noodles — Bowl",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "szechuan_chicken",
    "itemName": "Szechuan Chicken",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "szechuan_shrimp",
    "itemName": "Szechuan Shrimp",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chicken_familia",
    "itemName": "Chicken Familia",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "spanish_chicken",
    "itemName": "Spanish Chicken",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "brisket_of_beef_platter",
    "itemName": "Brisket of Beef Platter",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "low_fat_turkey_meat_loaf",
    "itemName": "Low Fat Turkey Meat Loaf",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chicken_lo_mein",
    "itemName": "Chicken Lo Mein",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chicken_giambotta",
    "itemName": "Chicken Giambotta",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "broiled_salmon_or_tuna",
    "itemName": "Broiled Salmon or Tuna",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "shrimp_scampi",
    "itemName": "Shrimp Scampi",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "fried_scallops",
    "itemName": "Fried Scallops",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "fried_clams_in_the_basket",
    "itemName": "Fried Clams in The Basket",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "fried_shrimp_basket",
    "itemName": "Fried Shrimp Basket",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "broiled_swordfish",
    "itemName": "Broiled Swordfish",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "broiled_sea_scallops",
    "itemName": "Broiled Sea Scallops",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "garlic_salmon_balsamic",
    "itemName": "Garlic Salmon Balsamic",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "stuffed_shrimp",
    "itemName": "Stuffed Shrimp",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "lunch_dinner_from_the_sea_sole_francaise",
    "itemName": "Sole Francaise",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "broiled_scrod",
    "itemName": "Broiled Scrod",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "broiled_flounder",
    "itemName": "Broiled Flounder",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "new_york_strip_16_oz",
    "itemName": "New York Strip (16 oz.)",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chicken_parmigiana",
    "itemName": "Chicken Parmigiana",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "veal_cutlet_parmigiana",
    "itemName": "Veal Cutlet Parmigiana",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "lunch_dinner_italian_specialties_cheese_ravioli",
    "itemName": "Cheese Ravioli",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "spaghetti_with_meatballs",
    "itemName": "Spaghetti with Meatballs",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "linguini",
    "itemName": "Linguini",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "lunch_dinner_italian_specialties_chicken_francaise",
    "itemName": "Chicken Francaise",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "lunch_dinner_italian_specialties_veal_francaise",
    "itemName": "Veal Francaise",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "vegetable_lasagna",
    "itemName": "Vegetable Lasagna",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "lunch_dinner_italian_specialties_meat_lasagna",
    "itemName": "Meat Lasagna",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "rigatoni_chicken",
    "itemName": "Rigatoni & Chicken",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "linguini_ala_ritz_spicy_or_mild",
    "itemName": "Linguini Ala Ritz (Spicy or Mild)",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "chicken_in_the_pot",
    "itemName": "Chicken in The Pot",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "lunch_dinner_cold_platters_salads_chunky_shrimp_salad",
    "itemName": "Chunky Shrimp Salad",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chicken_salad_platter",
    "itemName": "Chicken Salad Platter",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "tuna_fish_salad_platter",
    "itemName": "Tuna Fish Salad Platter",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chopped_chicken_liver",
    "itemName": "Chopped Chicken Liver",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "tossed_salad",
    "itemName": "Tossed Salad",
    "notes": "Verify exact dressing list.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "spinach_salad",
    "itemName": "Spinach Salad",
    "notes": "Verify protein cook/preparation options. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "grilled_chicken_small",
    "itemName": "Grilled Chicken — Small",
    "notes": "Verify exact dressing list.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "grilled_chicken_large",
    "itemName": "Grilled Chicken — Large",
    "notes": "Verify exact dressing list.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "chef_s_salad",
    "itemName": "Chef's Salad",
    "notes": "Verify protein cook/preparation options. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "sardine_platter",
    "itemName": "Sardine Platter",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "caesar_salad",
    "itemName": "Caesar Salad",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "char_grilled_chicken_over_caesar_salad_lunch",
    "itemName": "Char Grilled Chicken Over Caesar Salad — Lunch",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "char_grilled_chicken_over_caesar_salad_dinner",
    "itemName": "Char Grilled Chicken Over Caesar Salad — Dinner",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "cheese_steak_deluxe",
    "itemName": "Cheese Steak Deluxe",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "sesame_chicken_lunch",
    "itemName": "Sesame Chicken — Lunch",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "sesame_chicken_dinner",
    "itemName": "Sesame Chicken — Dinner",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chicken_finger_platter",
    "itemName": "Chicken Finger Platter",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "french_dip",
    "itemName": "French Dip",
    "notes": "Source menu does not identify the sandwich protein; verify recipe.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "golden_fried_filet_deluxe",
    "itemName": "Golden Fried Filet Deluxe",
    "notes": "Source menu does not identify the sandwich protein; verify recipe.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chicken_cheesesteak",
    "itemName": "Chicken Cheesesteak",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "turkey_or_chicken_meatloaf_sandwich",
    "itemName": "Turkey or Chicken Meatloaf Sandwich",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "veal_patti_parmigiana",
    "itemName": "Veal Patti Parmigiana",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "tuna_melt",
    "itemName": "Tuna Melt",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chicken_pot_pie",
    "itemName": "Chicken Pot Pie",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "beef_meatball_sandwich",
    "itemName": "Beef Meatball Sandwich",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "menu text"
    ]
  },
  {
    "itemId": "eggplant_parmigiana_hero",
    "itemName": "Eggplant Parmigiana Hero",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chicken_parmigiana_hero",
    "itemName": "Chicken Parmigiana Hero",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "cuban_sandwich",
    "itemName": "Cuban Sandwich",
    "notes": "Source menu does not identify the sandwich protein; verify recipe.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chicken_wrap",
    "itemName": "Chicken Wrap",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "chicken_quesadilla",
    "itemName": "Chicken Quesadilla",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "turkey_bowl",
    "itemName": "Turkey Bowl",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "lean_beef_or_turkey_patti",
    "itemName": "Lean Beef or Turkey Patti",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "diet_riot",
    "itemName": "Diet Riot",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "cobb_salad_lunch",
    "itemName": "Cobb Salad — Lunch",
    "notes": "Verify protein cook/preparation options. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "cobb_salad_dinner",
    "itemName": "Cobb Salad — Dinner",
    "notes": "Verify protein cook/preparation options. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "caesar_italia",
    "itemName": "Caesar Italia",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "marions_chopped_salad_lunch",
    "itemName": "Marion’s Chopped Salad — Lunch",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "marions_chopped_salad_dinner",
    "itemName": "Marion’s Chopped Salad — Dinner",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "jumbo_burger_regular",
    "itemName": "Jumbo Burger — Regular",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "jumbo_burger_deluxe",
    "itemName": "Jumbo Burger — Deluxe",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "cheeseburger_regular",
    "itemName": "Cheeseburger — Regular",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "cheeseburger_deluxe",
    "itemName": "Cheeseburger — Deluxe",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "bacon_burger_regular",
    "itemName": "Bacon Burger — Regular",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "bacon_burger_deluxe",
    "itemName": "Bacon Burger — Deluxe",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "bacon_cheeseburger_regular",
    "itemName": "Bacon Cheeseburger — Regular",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "bacon_cheeseburger_deluxe",
    "itemName": "Bacon Cheeseburger — Deluxe",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "mushroom_burger_regular",
    "itemName": "Mushroom Burger — Regular",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "mushroom_burger_deluxe",
    "itemName": "Mushroom Burger — Deluxe",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chili_burger_regular",
    "itemName": "Chili Burger — Regular",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chili_burger_deluxe",
    "itemName": "Chili Burger — Deluxe",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "pizza_burger_regular",
    "itemName": "Pizza Burger — Regular",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "pizza_burger_deluxe",
    "itemName": "Pizza Burger — Deluxe",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_regular",
    "itemName": "Turkey or Veggie or Chicken Burger — Regular",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "turkey_or_veggie_or_chicken_burger_deluxe",
    "itemName": "Turkey or Veggie or Chicken Burger — Deluxe",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "salmon_burger_regular",
    "itemName": "Salmon Burger — Regular",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "salmon_burger_deluxe",
    "itemName": "Salmon Burger — Deluxe",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "hot_dog_1_4_lb",
    "itemName": "Hot Dog (1/4 lb.)",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chili_dog_1_4_lb",
    "itemName": "Chili Dog (1/4 lb.)",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "hot_pastrami",
    "itemName": "Hot Pastrami",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "hot_corned_beef",
    "itemName": "Hot Corned Beef",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "hot_brisket",
    "itemName": "Hot Brisket",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "corned_beef_reuben",
    "itemName": "Corned Beef Reuben",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "pastrami_reuben",
    "itemName": "Pastrami Reuben",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "turkey_reuben",
    "itemName": "Turkey Reuben",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "corned_beef_pastrami",
    "itemName": "Corned Beef & Pastrami",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "sandwiches_deli_deli_roast_beef",
    "itemName": "Roast Beef",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sandwiches_deli_deli_turkey",
    "itemName": "Turkey",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sandwiches_deli_deli_salami",
    "itemName": "Salami",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "ham",
    "itemName": "Ham",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "chopped_liver",
    "itemName": "Chopped Liver",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sandwiches_deli_deli_ham_cheese",
    "itemName": "Ham & Cheese",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "corned_beef_chopped_liver",
    "itemName": "Corned Beef & Chopped Liver",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "turkey_chopped_liver_onion",
    "itemName": "Turkey, Chopped Liver & Onion",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "turkey_swiss_cheese",
    "itemName": "Turkey & Swiss Cheese",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "hot_pastrami_or_corned_beef",
    "itemName": "Hot Pastrami or Corned Beef",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "braised_brisket_of_beef",
    "itemName": "Braised Brisket of Beef",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "sandwiches_deli_sandwiches_tuna_salad",
    "itemName": "Tuna Salad",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chicken_salad",
    "itemName": "Chicken Salad",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sandwiches_deli_sandwiches_egg_salad",
    "itemName": "Egg Salad",
    "notes": "Verify exact house bread types. Verify exact dressing list. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sandwiches_deli_sandwiches_chunky_shrimp_salad",
    "itemName": "Chunky Shrimp Salad",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_tuna",
    "itemName": "Individual Tuna",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sandwiches_deli_sandwiches_individual_salmon",
    "itemName": "Individual Salmon",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "bacon_lettuce_tomato",
    "itemName": "Bacon, Lettuce & Tomato",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "sandwiches_deli_sandwiches_american_cheese",
    "itemName": "American Cheese",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sandwiches_deli_sandwiches_imported_swiss_cheese",
    "itemName": "Imported Swiss Cheese",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sardine_sandwich",
    "itemName": "Sardine Sandwich",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "lettuce_tomato_sandwich",
    "itemName": "Lettuce & Tomato Sandwich",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "grilled_american_or_swiss_cheese",
    "itemName": "Grilled American or Swiss Cheese",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "open_faced_hot_turkey_sandwich",
    "itemName": "Open-Faced Hot Turkey Sandwich",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "open_faced_hot_roast_beef_sandwich",
    "itemName": "Open-Faced Hot Roast Beef Sandwich",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "open_faced_brisket_of_beef",
    "itemName": "Open-Faced Brisket of Beef",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "club_sliced_turkey_bacon_lettuce_tomato",
    "itemName": "Club: Sliced Turkey, Bacon, Lettuce & Tomato",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "tuna_fish_salad_sliced_egg_lettuce_tomato",
    "itemName": "Tuna Fish Salad, Sliced Egg, Lettuce & Tomato",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "chicken_salad_bacon_lettuce_tomato",
    "itemName": "Chicken Salad, Bacon, Lettuce & Tomato",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "egg_salad_bacon_lettuce_tomato",
    "itemName": "Egg Salad, Bacon, Lettuce & Tomato",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "roast_beef_imported_swiss_cheese_lettuce_tomato",
    "itemName": "Roast Beef, Imported Swiss Cheese, Lettuce & Tomato",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "ham_imported_swiss_cheese_lettuce_tomato",
    "itemName": "Ham, Imported Swiss Cheese, Lettuce & Tomato",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "chopped_chicken_liver_bacon_lettuce_tomato",
    "itemName": "Chopped Chicken Liver, Bacon, Lettuce & Tomato",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "chunky_shrimp_salad_bacon_lettuce_tomato_mayonnaise",
    "itemName": "Chunky Shrimp Salad, Bacon, Lettuce, Tomato & Mayonnaise",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "grilled_chicken_club_with_bacon_lettuce_tomato",
    "itemName": "Grilled Chicken Club with Bacon, Lettuce & Tomato",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "hamburger_club_with_bacon_lettuce_tomato",
    "itemName": "Hamburger Club with Bacon, Lettuce & Tomato",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "homemade_potato_salad_or_homemade_cole_slaw",
    "itemName": "Homemade Potato Salad or Homemade Cole Slaw",
    "notes": "Verify exact dressing list. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "health_salad",
    "itemName": "Health Salad",
    "notes": "Verify exact dressing list. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "cottage_cheese",
    "itemName": "Cottage Cheese",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "souffle_of_cottage_cheese",
    "itemName": "Souffle of Cottage Cheese",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "feta_cheese",
    "itemName": "Feta Cheese",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "meatball_each",
    "itemName": "Meatball (each)",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sausage_pork_or_turkey",
    "itemName": "Sausage (Pork or Turkey)",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "bacon_ham_or_taylor_ham",
    "itemName": "Bacon, Ham, or Taylor Ham",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "canadian_bacon",
    "itemName": "Canadian Bacon",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "turkey_bacon",
    "itemName": "Turkey Bacon",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "corned_beef_hash",
    "itemName": "Corned Beef Hash",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "blueberry_muffin_or_apple_cinnamon_muffin",
    "itemName": "Blueberry Muffin or Apple Cinnamon Muffin",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "chocolate_chip_muffin",
    "itemName": "Chocolate Chip Muffin",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "corn_or_bran_muffin",
    "itemName": "Corn or Bran Muffin",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "cheesecake",
    "itemName": "Cheesecake",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "sugar_free_cheesecake",
    "itemName": "Sugar Free Cheesecake",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "strawberry_cheesecake",
    "itemName": "Strawberry Cheesecake",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "hamantaschen",
    "itemName": "Hamantaschen",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "hamburger_or_grilled_chicken_sandwich",
    "itemName": "Hamburger or Grilled Chicken Sandwich",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "kids_kids_korner_chicken_fingers",
    "itemName": "Chicken Fingers",
    "notes": "Verify protein cook/preparation options. Verify kids dipping sauce choices. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "fried_chicken_nuggets",
    "itemName": "Fried Chicken Nuggets",
    "notes": "Verify kids dipping sauce choices. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "grilled_hot_dog",
    "itemName": "Grilled Hot Dog",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "cheeseburger",
    "itemName": "Cheeseburger",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "fried_fish",
    "itemName": "Fried Fish",
    "notes": "Verify kids dipping sauce choices. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "spaghetti_meatball_complete",
    "itemName": "Spaghetti & Meatball (Complete)",
    "notes": "Verify protein cook/preparation options. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "macaroni_cheese_complete",
    "itemName": "Macaroni & Cheese (Complete)",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "grilled_cheese_or_peanut_butter_jelly",
    "itemName": "Grilled Cheese or Peanut Butter & Jelly",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "two_eggs_any_style",
    "itemName": "Two Eggs (Any Style)",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "single_egg",
    "itemName": "Single Egg",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "sliced_steak_eggs",
    "itemName": "Sliced Steak & Eggs",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "corned_beef_hash_with_two_eggs",
    "itemName": "Corned Beef Hash with Two Eggs",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "eggs_benedict",
    "itemName": "Eggs Benedict",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "egg_sandwich",
    "itemName": "Egg Sandwich",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "egg_cheese",
    "itemName": "Egg & Cheese",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "taylor_ham_sandwich",
    "itemName": "Taylor Ham Sandwich",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "ham_or_bacon_or_salami_or_sausage_egg",
    "itemName": "Ham or Bacon or Salami or Sausage & Egg",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "breakfast_egg_sandwiches_western",
    "itemName": "Western",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "taylor_ham_cheese",
    "itemName": "Taylor Ham & Cheese",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "taylor_ham_egg",
    "itemName": "Taylor Ham & Egg",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "taylor_ham_egg_cheese",
    "itemName": "Taylor Ham, Egg & Cheese",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "breakfast_egg_sandwiches_mixed_deli",
    "itemName": "Mixed Deli",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "avocado_toast_platter",
    "itemName": "Avocado Toast Platter",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "explicit choice map",
      "menu text"
    ]
  },
  {
    "itemId": "plain",
    "itemName": "Plain",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "breakfast_omelettes_american_cheese",
    "itemName": "American Cheese",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "breakfast_omelettes_imported_swiss_cheese",
    "itemName": "Imported Swiss Cheese",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "cheddar_cheese",
    "itemName": "Cheddar Cheese",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "breakfast_omelettes_ham_cheese",
    "itemName": "Ham & Cheese",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "breakfast_omelettes_turkey",
    "itemName": "Turkey",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "bacon_or_ham",
    "itemName": "Bacon or Ham",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "explicit choice map",
      "category/name inference"
    ]
  },
  {
    "itemId": "spanish",
    "itemName": "Spanish",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "feta_tomato",
    "itemName": "Feta & Tomato",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "salami_eggs_pancake_style",
    "itemName": "Salami & Eggs (Pancake Style)",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "sausage",
    "itemName": "Sausage",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "onion",
    "itemName": "Onion",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "fresh_mushrooms",
    "itemName": "Fresh Mushrooms",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "chicken_liver",
    "itemName": "Chicken Liver",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "nova_onion",
    "itemName": "Nova & Onion",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "breakfast_omelettes_mixed_deli",
    "itemName": "Mixed Deli",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "breakfast_omelettes_western",
    "itemName": "Western",
    "notes": "Verify exact house bread types. Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "spinach",
    "itemName": "Spinach",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "broccoli",
    "itemName": "Broccoli",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "scallion_cream_cheese",
    "itemName": "Scallion & Cream Cheese",
    "notes": "Verify exact house bread types.",
    "modelBasis": [
      "explicit component map"
    ]
  },
  {
    "itemId": "italian_omelette",
    "itemName": "Italian Omelette",
    "notes": "Verify protein cook/preparation options. Verify exact house bread types.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "short_stack_of_pancakes",
    "itemName": "Short Stack of Pancakes",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "silver_dollars",
    "itemName": "Silver Dollars",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "french_toast",
    "itemName": "French Toast",
    "notes": "Menu source has no description; customization detail is operational inference.",
    "modelBasis": [
      "category/name inference"
    ]
  },
  {
    "itemId": "nova_platter",
    "itemName": "Nova Platter",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "smoked_whitefish_platter",
    "itemName": "Smoked Whitefish Platter",
    "notes": "Verify protein cook/preparation options.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  },
  {
    "itemId": "smoked_whitefish_salad_platter",
    "itemName": "Smoked Whitefish Salad Platter",
    "notes": "Verify protein cook/preparation options. Verify exact dressing list.",
    "modelBasis": [
      "explicit component map",
      "menu text"
    ]
  }
] as MenuReviewIssue[];


export const menuData = {
  items,
  modifierGroups,
  modifiers,
  itemModifierGroups,
  ingredients,
  itemIngredients,
  reviewIssues,
};

export default menuData;
