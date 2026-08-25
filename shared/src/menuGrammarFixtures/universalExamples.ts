import type {
  CapabilityKind,
  GrammarNodeKind,
  OfferingKind,
  UniversalComponentRole,
  UniversalRelationship,
} from "../menuGrammar.js";

type ComponentFixture = {
  name: string;
  role: UniversalComponentRole;
  relationship: UniversalRelationship;
  capabilities?: CapabilityKind[];
};

type GrammarNodeFixture = {
  kind: GrammarNodeKind;
  label: string;
  options?: string[];
};

type OfferingFixture = {
  restaurant: string;
  name: string;
  offeringKind: OfferingKind;
  components: ComponentFixture[];
  nodes: GrammarNodeFixture[];
};

export const UNIVERSAL_MENU_EXAMPLES: OfferingFixture[] = [
  {
    restaurant: "Lazy Jane's",
    name: "The Pesto",
    offeringKind: "preset",
    components: [
      {
        name: "Sandwich Bread",
        role: "carrier",
        relationship: "contains",
        capabilities: ["remove", "replace"],
      },
      {
        name: "Chicken Cutlet",
        role: "primary",
        relationship: "contains",
        capabilities: ["remove", "extra"],
      },
      {
        name: "Pesto",
        role: "sauce",
        relationship: "contains",
        capabilities: ["remove", "side", "extra"],
      },
    ],
    nodes: [],
  },

  {
    restaurant: "The Cheesecake Factory",
    name: "Chicken Madeira",
    offeringKind: "preset",
    components: [
      {
        name: "Chicken Breast",
        role: "primary",
        relationship: "contains",
      },
      {
        name: "Asparagus",
        role: "topping",
        relationship: "contains",
      },
      {
        name: "Mozzarella",
        role: "topping",
        relationship: "contains",
      },
      {
        name: "Mushroom Madeira Sauce",
        role: "sauce",
        relationship: "contains",
      },
      {
        name: "Mashed Potatoes",
        role: "accompaniment",
        relationship: "comes_with",
      },
    ],
    nodes: [],
  },

  {
    restaurant: "Burrito Bench",
    name: "Build Your Own Burrito",
    offeringKind: "preset",
    components: [],
    nodes: [
      {
        kind: "choice",
        label: "Choose Base",
        options: ["Burrito", "Bowl", "Tacos", "Salad", "Quesadilla"],
      },
      {
        kind: "choice",
        label: "Choose Protein",
        options: ["Chicken", "Barbacoa", "Carnitas", "Sofritas", "Steak"],
      },
      {
        kind: "choice",
        label: "Rice & Beans",
        options: ["White Rice", "Brown Rice", "Black Beans", "Pinto Beans"],
      },
      {
        kind: "add_catalog",
        label: "Salsa & Toppings",
        options: ["Salsa", "Fajita Veggies", "Cheese", "Sour Cream", "Guacamole"],
      },
    ],
  },
];
