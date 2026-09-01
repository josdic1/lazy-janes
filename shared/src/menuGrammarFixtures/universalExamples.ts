import {
  universalOfferingSchema,
  type UniversalOffering,
} from "../menuGrammar.js";

type UniversalMenuExample = {
  restaurant: string;
  offering: UniversalOffering;
};

export const UNIVERSAL_MENU_EXAMPLES: UniversalMenuExample[] = [
  {
    restaurant: "Lazy Jane's",
    offering: universalOfferingSchema.parse({
      id: "lazy-janes:the-pesto",
      name: "The Pesto",
      kind: "preset",

      components: [
        {
          id: "sandwich-bread",
          name: "Sandwich Bread",
          role: "carrier",
          relationship: "contains",
          capabilities: [
            {
              kind: "replace",
              configurationState: "unconfigured",
            },
          ],
        },
        {
          id: "chicken-cutlet",
          name: "Chicken Cutlet",
          role: "primary",
          relationship: "contains",
        },
        {
          id: "pesto",
          name: "Pesto",
          role: "sauce",
          relationship: "contains",
        },
      ],
    }),
  },

  {
    restaurant: "The Cheesecake Factory",
    offering: universalOfferingSchema.parse({
      id: "cheesecake-factory:chicken-madeira",
      name: "Chicken Madeira",
      kind: "preset",

      components: [
        {
          id: "chicken-breast",
          name: "Chicken Breast",
          role: "primary",
          relationship: "contains",
        },
        {
          id: "asparagus",
          name: "Asparagus",
          role: "topping",
          relationship: "contains",
        },
        {
          id: "mozzarella",
          name: "Mozzarella",
          role: "topping",
          relationship: "contains",
        },
        {
          id: "mushroom-madeira-sauce",
          name: "Mushroom Madeira Sauce",
          role: "sauce",
          relationship: "contains",
        },
        {
          id: "mashed-potatoes",
          name: "Mashed Potatoes",
          role: "accompaniment",
          relationship: "comes_with",
        },
      ],
    }),
  },

  {
    restaurant: "Burrito Bench",
    offering: universalOfferingSchema.parse({
      id: "burrito-bench:build-your-own-burrito",
      name: "Build Your Own Burrito",
      kind: "preset",

      choices: [
        {
          id: "choose-base",
          label: "Choose Base",
          minSelections: 1,
          maxSelections: 1,
          options: [
            { id: "burrito", label: "Burrito", target: { kind: "offering", id: "burrito-bench:burrito" } },
            { id: "bowl", label: "Bowl", target: { kind: "offering", id: "burrito-bench:bowl" } },
            { id: "tacos", label: "Tacos", target: { kind: "offering", id: "burrito-bench:tacos" } },
            { id: "salad", label: "Salad", target: { kind: "offering", id: "burrito-bench:salad" } },
            { id: "quesadilla", label: "Quesadilla", target: { kind: "offering", id: "burrito-bench:quesadilla" } },
          ],
        },
        {
          id: "choose-protein",
          label: "Choose Protein",
          minSelections: 1,
          maxSelections: 1,
          options: [
            { id: "chicken", label: "Chicken", target: { kind: "component", id: "chicken" } },
            { id: "barbacoa", label: "Barbacoa", target: { kind: "component", id: "barbacoa" } },
            { id: "carnitas", label: "Carnitas", target: { kind: "component", id: "carnitas" } },
            { id: "sofritas", label: "Sofritas", target: { kind: "component", id: "sofritas" } },
            { id: "steak", label: "Steak", target: { kind: "component", id: "steak" } },
          ],
        },
        {
          id: "rice-and-beans",
          label: "Rice & Beans",
          minSelections: 0,
          maxSelections: 4,
          options: [
            { id: "white-rice", label: "White Rice", target: { kind: "component", id: "white-rice" } },
            { id: "brown-rice", label: "Brown Rice", target: { kind: "component", id: "brown-rice" } },
            { id: "black-beans", label: "Black Beans", target: { kind: "component", id: "black-beans" } },
            { id: "pinto-beans", label: "Pinto Beans", target: { kind: "component", id: "pinto-beans" } },
          ],
        },
      ],

      addCatalogs: [
        {
          id: "salsa-and-toppings",
          label: "Salsa & Toppings",
          options: [
            {
              id: "salsa",
              component: {
                componentId: "salsa",
                label: "Salsa",
              },
            },
            {
              id: "fajita-veggies",
              component: {
                componentId: "fajita-veggies",
                label: "Fajita Veggies",
              },
            },
            {
              id: "cheese",
              component: {
                componentId: "cheese",
                label: "Cheese",
              },
            },
            {
              id: "sour-cream",
              component: {
                componentId: "sour-cream",
                label: "Sour Cream",
              },
            },
            {
              id: "guacamole",
              component: {
                componentId: "guacamole",
                label: "Guacamole",
              },
            },
          ],
        },
      ],
    }),
  },

  {
    restaurant: "Trós Greek Street Food",
    offering: universalOfferingSchema.parse({
      id: "tros:lunch-box-special",
      name: "Lunch Box Special",
      kind: "preset",
      choices: [
        {
          id: "pick-souvlaki",
          label: "Pick 1 Souvlaki",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "pork-souvlaki",
              label: "Pork Souvlaki",
              target: { kind: "offering", id: "tros:pork-souvlaki" },
            },
            {
              id: "chicken-souvlaki",
              label: "Chicken Souvlaki",
              target: { kind: "offering", id: "tros:chicken-souvlaki" },
            },
          ],
        },
        {
          id: "pick-spread",
          label: "Pick 1 Spread",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "tzatziki",
              label: "Tzatziki",
              target: { kind: "offering", id: "tros:tzatziki" },
            },
            {
              id: "hummus",
              label: "Hummus",
              target: { kind: "offering", id: "tros:hummus" },
            },
          ],
        },
        {
          id: "pick-side",
          label: "Pick 1 Side",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "rice",
              label: "Rice",
              target: { kind: "offering", id: "tros:rice" },
            },
            {
              id: "greek-fries",
              label: "Greek Fries",
              target: { kind: "offering", id: "tros:greek-fries" },
            },
            {
              id: "mixed-organic-greens",
              label: "Mixed Organic Greens",
              target: { kind: "offering", id: "tros:mixed-organic-greens" },
            },
          ],
        },
      ],
    }),
  },

  {
    restaurant: "BubbaQue's",
    offering: universalOfferingSchema.parse({
      id: "bubbaques:create-yer-own-combo-pick-two",
      name: "Create Yer Own Combo Dinner — Pick Two",
      kind: "preset",
      choices: [
        {
          id: "pick-two-meats",
          label: "Pick Two",
          minSelections: 2,
          maxSelections: 2,
          options: [
            {
              id: "pulled-pork",
              label: "Pulled Pork",
              target: { kind: "offering", id: "bubbaques:pulled-pork" },
            },
            {
              id: "texas-brisket",
              label: "Texas Brisket",
              target: { kind: "offering", id: "bubbaques:texas-brisket" },
            },
            {
              id: "chopped-bbq-chicken",
              label: "Chopped BBQ Chicken",
              target: { kind: "offering", id: "bubbaques:chopped-bbq-chicken" },
            },
            {
              id: "three-st-louis-ribs",
              label: "3 St. Louis Ribs",
              target: { kind: "offering", id: "bubbaques:three-st-louis-ribs" },
            },
          ],
        },
      ],
      commercialPolicies: [
        {
          id: "pick-two-price",
          kind: "price",
          appliesTo: { kind: "offering" },
          amount: 22.99,
          configured: true,
        },
      ],
    }),
  },

  {
    restaurant: "Prix Fixe Proof",
    offering: universalOfferingSchema.parse({
      id: "prix-fixe:three-course-dinner",
      name: "Three Course Dinner",
      kind: "preset",
      choices: [
        {
          id: "first-course",
          label: "Choose First Course",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "ceviche",
              label: "Ceviche",
              target: { kind: "offering", id: "prix-fixe:ceviche" },
            },
            {
              id: "crab-louis",
              label: "Crab Louis",
              target: { kind: "offering", id: "prix-fixe:crab-louis" },
            },
          ],
        },
        {
          id: "main-course",
          label: "Choose Main Course",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "salmon",
              label: "Salmon",
              target: { kind: "offering", id: "prix-fixe:salmon" },
            },
            {
              id: "short-rib",
              label: "Short Rib",
              target: { kind: "offering", id: "prix-fixe:short-rib" },
            },
          ],
        },
      ],
    }),
  },

  {
    restaurant: "Hart House",
    offering: universalOfferingSchema.parse({
      id: "hart-house:plated-main-course-selection",
      name: "Plated Main Course Selection",
      kind: "preset",
      choices: [
        {
          id: "main-course-options",
          label: "Main Course Options",
          minSelections: 2,
          maxSelections: 3,
          options: [
            {
              id: "beef-tenderloin",
              label: "AAA Beef Tenderloin",
              target: {
                kind: "offering",
                id: "hart-house:beef-tenderloin",
              },
            },
            {
              id: "beef-striploin",
              label: "AAA Beef Striploin",
              target: {
                kind: "offering",
                id: "hart-house:beef-striploin",
              },
            },
            {
              id: "steelhead",
              label: "Lois Lake Steelhead",
              target: {
                kind: "offering",
                id: "hart-house:steelhead",
              },
            },
            {
              id: "roast-chicken-supreme",
              label: "Roast Chicken Supreme",
              target: {
                kind: "offering",
                id: "hart-house:roast-chicken-supreme",
              },
            },
            {
              id: "roasted-cauliflower",
              label: "Roasted Cauliflower",
              target: {
                kind: "offering",
                id: "hart-house:roasted-cauliflower",
              },
            },
            {
              id: "seasonal-risotto",
              label: "Seasonal Risotto",
              target: {
                kind: "offering",
                id: "hart-house:seasonal-risotto",
              },
            },
          ],
          subsetConstraints: [
            {
              id: "exactly-two-proteins",
              label: "Maximum two proteins plus optional vegetarian dish",
              optionIds: [
                "beef-tenderloin",
                "beef-striploin",
                "steelhead",
                "roast-chicken-supreme",
              ],
              minSelections: 2,
              maxSelections: 2,
            },
          ],
        },
      ],
    }),
  },

  {
    restaurant: "hoPot",
    offering: universalOfferingSchema.parse({
      id: "hopot:build-your-own-hot-pot",
      name: "Build Your Own Hot Pot",
      kind: "preset",
      choices: [
        {
          id: "pot-type",
          label: "Choose Hot Pot",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "single-pot",
              label: "Single Pot",
              target: {
                kind: "offering",
                id: "hopot:single-pot",
              },
            },
            {
              id: "yin-yang-pot",
              label: "Yin-Yang Pot",
              target: {
                kind: "offering",
                id: "hopot:yin-yang-pot",
              },
            },
          ],
        },
        {
          id: "soups",
          label: "Choose Soup(s)",
          minSelections: 1,
          maxSelections: 2,
          applicationScopes: [
            { kind: "whole" },
            { kind: "section", sectionCount: 2 },
          ],
          options: [
            {
              id: "vegetarian-spicy",
              label: "Vegetarian Spicy Soup",
              target: {
                kind: "offering",
                id: "hopot:vegetarian-spicy-soup",
              },
            },
            {
              id: "beef-fat-spicy",
              label: "Spicy Soup with Beef Fat",
              target: {
                kind: "offering",
                id: "hopot:beef-fat-spicy-soup",
              },
            },
            {
              id: "kimchee",
              label: "Kimchee Soup",
              target: {
                kind: "offering",
                id: "hopot:kimchee-soup",
              },
            },
            {
              id: "mushroom",
              label: "Mushroom Soup",
              target: {
                kind: "offering",
                id: "hopot:mushroom-soup",
              },
            },
          ],
        },
      ],
      choiceConstraints: [
        {
          id: "single-pot-one-soup",
          when: {
            choiceSlotId: "pot-type",
            optionId: "single-pot",
          },
          then: {
            choiceSlotId: "soups",
            minSelections: 1,
            maxSelections: 1,
          },
        },
        {
          id: "yin-yang-two-soups",
          when: {
            choiceSlotId: "pot-type",
            optionId: "yin-yang-pot",
          },
          then: {
            choiceSlotId: "soups",
            minSelections: 2,
            maxSelections: 2,
          },
        },
      ],
    }),
  },

  {
    restaurant: "Jug's Catering",
    offering: universalOfferingSchema.parse({
      id: "jugs:china-package-a",
      name: "China Package A",
      kind: "service",
      measures: [
        {
          id: "place-settings",
          label: "Place Settings",
          unit: "serving",
          minimum: 10,
          maximum: null,
          increment: 10,
          defaultValue: 10,
        },
      ],
    }),
  },

  {
    restaurant: "Bon Appétit Catering at Eckerd College",
    offering: universalOfferingSchema.parse({
      id: "eckerd:buffet-service",
      name: "Buffet Service",
      kind: "service",
      resourceRequirements: [
        {
          id: "buffet-attendants",
          label: "Buffet Attendants",
          resourceKind: "personnel",
          calculation: {
            kind: "per_count",
            countKind: "guest",
            quantity: 1,
            perCount: 25,
            rounding: "up",
          },
          rate: null,
        },
      ],
    }),
  },

  {
    restaurant: "Luigi's",
    offering: universalOfferingSchema.parse({
      id: "luigis:pizza-toppings",
      name: "Pizza Toppings",
      kind: "preset",
      choices: [
        {
          id: "toppings",
          label: "Pizza Toppings",
          minSelections: 0,
          maxSelections: 3,
          applicationScopes: [
            { kind: "whole" },
            {
              kind: "fraction",
              numerator: 1,
              denominator: 2,
            },
          ],
          options: [
            {
              id: "pepperoni",
              label: "Pepperoni",
              target: {
                kind: "component",
                id: "luigis:pepperoni",
              },
            },
            {
              id: "sausage",
              label: "Sausage",
              target: {
                kind: "component",
                id: "luigis:sausage",
              },
            },
            {
              id: "mushrooms",
              label: "Mushrooms",
              target: {
                kind: "component",
                id: "luigis:mushrooms",
              },
            },
          ],
        },
      ],
    }),
  },

  {
    restaurant: "Grand Brunch Buffet",
    offering: universalOfferingSchema.parse({
      id: "grand-brunch:chef-requirement",
      name: "Grand Brunch Buffet",
      kind: "service",
      resourceRequirements: [
        {
          id: "required-chefs",
          label: "Required Chefs",
          resourceKind: "personnel",
          calculation: {
            kind: "per_count",
            countKind: "guest",
            quantity: 2,
            perCount: 50,
            rounding: "up",
          },
          rate: {
            amount: 100,
            basis: "resource",
            minimumBillableUnits: null,
          },
        },
      ],
    }),
  },

];
