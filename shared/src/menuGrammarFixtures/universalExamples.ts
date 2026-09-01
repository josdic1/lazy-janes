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
];
