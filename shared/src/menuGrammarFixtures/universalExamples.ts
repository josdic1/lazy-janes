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
            { id: "burrito", label: "Burrito" },
            { id: "bowl", label: "Bowl" },
            { id: "tacos", label: "Tacos" },
            { id: "salad", label: "Salad" },
            { id: "quesadilla", label: "Quesadilla" },
          ],
        },
        {
          id: "choose-protein",
          label: "Choose Protein",
          minSelections: 1,
          maxSelections: 1,
          options: [
            { id: "chicken", label: "Chicken" },
            { id: "barbacoa", label: "Barbacoa" },
            { id: "carnitas", label: "Carnitas" },
            { id: "sofritas", label: "Sofritas" },
            { id: "steak", label: "Steak" },
          ],
        },
        {
          id: "rice-and-beans",
          label: "Rice & Beans",
          minSelections: 0,
          maxSelections: 4,
          options: [
            { id: "white-rice", label: "White Rice" },
            { id: "brown-rice", label: "Brown Rice" },
            { id: "black-beans", label: "Black Beans" },
            { id: "pinto-beans", label: "Pinto Beans" },
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
];
