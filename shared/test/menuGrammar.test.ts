import { describe, expect, it } from "vitest";

import {
  choiceSlotSchema,
  measureSchema,
  resourceRequirementSchema,
  universalMenuSchema,
  universalOfferingSchema,
} from "../src/menuGrammar.js";

import {
  UNIVERSAL_MENU_EXAMPLES,
} from "../src/menuGrammarFixtures/universalExamples.js";

describe("universal menu grammar", () => {
  it("parses all cross-menu proof fixtures", () => {
    for (const example of UNIVERSAL_MENU_EXAMPLES) {
      expect(
        universalOfferingSchema.safeParse(example.offering).success,
      ).toBe(true);
    }
  });

  it("preserves unknown contextual truth", () => {
    const result = universalOfferingSchema.parse({
      id: "unknown-example",
      name: "Unknown Example",
      kind: "preset",
      components: [
        {
          id: "component-1",
          name: "Mystery Component",
          role: null,
          relationship: null,
        },
      ],
    });

    expect(result.components[0]?.role).toBeNull();
    expect(result.components[0]?.relationship).toBeNull();
  });

  it("rejects choice minimum greater than maximum", () => {
    const result = choiceSlotSchema.safeParse({
      id: "bad-choice",
      label: "Bad Choice",
      minSelections: 2,
      maxSelections: 1,
      options: [
        { id: "a", label: "A", target: { kind: "component", id: "a" } },
        { id: "b", label: "B", target: { kind: "component", id: "b" } },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects choice maximum greater than available options", () => {
    const result = choiceSlotSchema.safeParse({
      id: "bad-choice",
      label: "Bad Choice",
      minSelections: 0,
      maxSelections: 3,
      options: [
        { id: "a", label: "A", target: { kind: "component", id: "a" } },
        { id: "b", label: "B", target: { kind: "component", id: "b" } },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("supports component, offering, and none choice targets", () => {
    const result = choiceSlotSchema.parse({
      id: "target-types",
      label: "Choose",
      minSelections: 0,
      maxSelections: 1,
      options: [
        {
          id: "component-option",
          label: "Cheddar",
          target: { kind: "component", id: "cheddar" },
        },
        {
          id: "offering-option",
          label: "Caesar Salad",
          target: { kind: "offering", id: "caesar-salad" },
        },
        {
          id: "none-option",
          label: "None",
          target: { kind: "none" },
        },
      ],
    });

    expect(result.options[0]?.target).toEqual({
      kind: "component",
      id: "cheddar",
    });
    expect(result.options[1]?.target).toEqual({
      kind: "offering",
      id: "caesar-salad",
    });
    expect(result.options[2]?.target).toEqual({ kind: "none" });
  });

  it("supports a choice that directly selects a preparation state", () => {
    const offering = universalOfferingSchema.parse({
      id: "combo",
      name: "Combo",
      kind: null,
      preparations: [
        {
          id: "cook-method",
          label: "Preparation",
          selectionRequired: true,
          defaultOptionId: null,
          options: [
            { id: "broiled", label: "Broiled" },
            { id: "fried", label: "Fried" },
          ],
        },
      ],
      choices: [
        {
          id: "preparation-choice",
          label: "Preparation",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "choose-broiled",
              label: "Broiled",
              target: {
                kind: "preparation",
                preparationSchemeId: "cook-method",
                preparationOptionId: "broiled",
              },
            },
          ],
        },
      ],
    });

    expect(offering.choices[0]?.options[0]?.target).toEqual({
      kind: "preparation",
      preparationSchemeId: "cook-method",
      preparationOptionId: "broiled",
    });
  });

  it("rejects a preparation choice target outside its scheme", () => {
    const result = universalOfferingSchema.safeParse({
      id: "combo",
      name: "Combo",
      preparations: [
        {
          id: "cook-method",
          label: "Preparation",
          selectionRequired: true,
          defaultOptionId: null,
          options: [{ id: "broiled", label: "Broiled" }],
        },
      ],
      choices: [
        {
          id: "preparation-choice",
          label: "Preparation",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "choose-fried",
              label: "Fried",
              target: {
                kind: "preparation",
                preparationSchemeId: "cook-method",
                preparationOptionId: "fried",
              },
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("preserves a real choice whose semantic target is still unknown", () => {
    const result = choiceSlotSchema.parse({
      id: "starter",
      label: "Starter",
      minSelections: 1,
      maxSelections: 1,
      options: [
        {
          id: "soup",
          label: "Soup",
          target: { kind: "unknown" },
          evidence: {
            state: "unknown",
            note: "The source names Soup but does not identify a reusable target.",
          },
        },
      ],
    });

    expect(result.options[0]?.target).toEqual({ kind: "unknown" });
  });

  it("rejects unknown choice targets without explicit unknown evidence", () => {
    const result = choiceSlotSchema.safeParse({
      id: "starter",
      label: "Starter",
      minSelections: 1,
      maxSelections: 1,
      options: [
        {
          id: "soup",
          label: "Soup",
          target: { kind: "unknown" },
        },
      ],
    });

    expect(result.success).toBe(false);
  });


  it("allows a choice option to reference an offering preparation scheme", () => {
    const result = universalOfferingSchema.safeParse({
      id: "prepared-choice",
      name: "Prepared Choice",
      kind: "preset",
      preparations: [
        {
          id: "temperature",
          label: "Temperature",
          selectionRequired: true,
          defaultOptionId: "medium",
          options: [
            { id: "medium", label: "Medium" },
          ],
        },
      ],
      choices: [
        {
          id: "protein",
          label: "Protein",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "burger",
              label: "Burger",
              target: { kind: "unknown" },
              preparationSchemeId: "temperature",
              evidence: { state: "unknown" },
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a choice preparation scheme that is not on the offering", () => {
    const result = universalOfferingSchema.safeParse({
      id: "bad-prepared-choice",
      name: "Bad Prepared Choice",
      kind: "preset",
      choices: [
        {
          id: "protein",
          label: "Protein",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "burger",
              label: "Burger",
              target: { kind: "unknown" },
              preparationSchemeId: "missing-temperature",
              evidence: { state: "unknown" },
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects the old loose componentId/isNoneOption choice shape", () => {
    const result = choiceSlotSchema.safeParse({
      id: "legacy-target",
      label: "Legacy",
      minSelections: 0,
      maxSelections: 1,
      options: [
        {
          id: "legacy",
          label: "Legacy Option",
          componentId: "cheddar",
          isNoneOption: false,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("locks offering-target choices with Trós, BubbaQue's, and prix-fixe fixtures", () => {
    const proofRestaurants = new Set([
      "Trós Greek Street Food",
      "BubbaQue's",
      "Prix Fixe Proof",
    ]);

    const proofExamples = UNIVERSAL_MENU_EXAMPLES.filter((example) =>
      proofRestaurants.has(example.restaurant),
    );

    expect(proofExamples).toHaveLength(3);

    for (const example of proofExamples) {
      const result = universalOfferingSchema.parse(example.offering);
      const targets = result.choices.flatMap((choice) =>
        choice.options.map((option) => option.target),
      );

      expect(targets.length).toBeGreaterThan(0);
      expect(
        targets.every((target) => target.kind === "offering"),
      ).toBe(true);
    }
  });

  it("does not require restaurant-specific fields", () => {
    const result = universalOfferingSchema.safeParse({
      id: "generic-offering",
      name: "Generic Offering",
      kind: "preset",
    });

    expect(result.success).toBe(true);
  });

  it("rejects subset constraints that reference unavailable options", () => {
    const result = choiceSlotSchema.safeParse({
      id: "subset-reference",
      label: "Choose",
      minSelections: 1,
      maxSelections: 2,
      options: [
        {
          id: "protein-a",
          label: "Protein A",
          target: { kind: "offering", id: "protein-a" },
        },
        {
          id: "vegetarian-a",
          label: "Vegetarian A",
          target: { kind: "offering", id: "vegetarian-a" },
        },
      ],
      subsetConstraints: [
        {
          id: "protein-limit",
          optionIds: ["protein-a", "missing-protein"],
          maxSelections: 1,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects impossible conditional choice counts", () => {
    const result = universalOfferingSchema.safeParse({
      id: "conditional-count",
      name: "Conditional Count",
      kind: "preset",
      choices: [
        {
          id: "pot-type",
          label: "Pot Type",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "yin-yang",
              label: "Yin-Yang",
              target: { kind: "offering", id: "yin-yang" },
            },
          ],
        },
        {
          id: "soups",
          label: "Soups",
          minSelections: 1,
          maxSelections: 2,
          options: [
            {
              id: "soup-a",
              label: "Soup A",
              target: { kind: "offering", id: "soup-a" },
            },
            {
              id: "soup-b",
              label: "Soup B",
              target: { kind: "offering", id: "soup-b" },
            },
          ],
        },
      ],
      choiceConstraints: [
        {
          id: "bad-yin-yang-rule",
          when: {
            choiceSlotId: "pot-type",
            optionId: "yin-yang",
          },
          then: {
            choiceSlotId: "soups",
            minSelections: 3,
            maxSelections: 3,
          },
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("accepts a configuration choice that activates another choice", () => {
    const result = universalOfferingSchema.safeParse({
      id: "vegetable-trigger",
      name: "Vegetable Trigger",
      kind: "preset",
      choices: [
        {
          id: "side-choice",
          label: "Side Choice",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "one-vegetable",
              label: "One Vegetable",
              target: { kind: "configuration" },
            },
          ],
        },
        {
          id: "vegetables",
          label: "Vegetables",
          minSelections: 0,
          maxSelections: 2,
          options: [
            {
              id: "carrots",
              label: "Carrots",
              target: { kind: "component", id: "carrots" },
            },
            {
              id: "broccoli",
              label: "Broccoli",
              target: { kind: "component", id: "broccoli" },
            },
          ],
        },
      ],
      choiceConstraints: [
        {
          id: "one-vegetable-rule",
          when: {
            choiceSlotId: "side-choice",
            optionId: "one-vegetable",
          },
          then: {
            choiceSlotId: "vegetables",
            minSelections: 1,
            maxSelections: 1,
          },
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a configuration choice with no conditional rule", () => {
    const result = universalOfferingSchema.safeParse({
      id: "orphan-trigger",
      name: "Orphan Trigger",
      kind: "preset",
      choices: [
        {
          id: "side-choice",
          label: "Side Choice",
          minSelections: 1,
          maxSelections: 1,
          options: [
            {
              id: "one-vegetable",
              label: "One Vegetable",
              target: { kind: "configuration" },
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid fractional application scopes", () => {
    const result = choiceSlotSchema.safeParse({
      id: "bad-fraction",
      label: "Toppings",
      minSelections: 0,
      maxSelections: 1,
      applicationScopes: [
        {
          kind: "fraction",
          numerator: 1,
          denominator: 1,
        },
      ],
      options: [
        {
          id: "pepperoni",
          label: "Pepperoni",
          target: { kind: "component", id: "pepperoni" },
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects nonpositive measure increments", () => {
    const result = measureSchema.safeParse({
      id: "china-place-settings",
      label: "Place Settings",
      unit: "serving",
      minimum: 10,
      maximum: null,
      increment: 0,
      defaultValue: 10,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid resource requirement calculations", () => {
    const result = resourceRequirementSchema.safeParse({
      id: "servers",
      label: "Servers",
      resourceKind: "personnel",
      calculation: {
        kind: "per_count",
        countKind: "guest",
        quantity: 1,
        perCount: 0,
        rounding: "up",
      },
      rate: null,
    });

    expect(result.success).toBe(false);
  });


  it("rejects menu references to unavailable offerings", () => {
    expect(() =>
      universalMenuSchema.parse({
        id: "broken-menu",
        name: "Broken Menu",
        offerings: [
          {
            id: "parent",
            name: "Parent",
            kind: null,
            choices: [
              {
                id: "side",
                label: "Side",
                minSelections: 1,
                maxSelections: 1,
                options: [
                  {
                    id: "vegetables",
                    label: "Vegetables",
                    target: {
                      kind: "offering",
                      id: "missing-vegetable-offering",
                    },
                  },
                ],
              },
            ],
          },
        ],
      }),
    ).toThrow("choice option targets an unavailable offering");
  });

  it("supports price policies on structural variant options", () => {
    const offering = universalOfferingSchema.parse({
      id: "blueberry-pancakes",
      name: "Blueberry Pancakes",
      kind: "preset",
      variants: [
        {
          id: "size",
          label: "Size",
          selectionRequired: true,
          defaultOptionId: null,
          options: [
            { id: "full", label: "Full Stack" },
            { id: "short", label: "Short Stack" },
          ],
        },
      ],
      commercialPolicies: [
        {
          id: "short-price",
          kind: "price",
          appliesTo: {
            kind: "variant_option",
            variantId: "size",
            optionId: "short",
          },
          amount: -2,
          configured: true,
        },
      ],
    });

    expect(offering.commercialPolicies[0]).toMatchObject({
      appliesTo: {
        kind: "variant_option",
        variantId: "size",
        optionId: "short",
      },
      amount: -2,
      configured: true,
    });
  });

  it("supports menu-level local-time availability rules", () => {
    const result = universalMenuSchema.parse({
      id: "ritz-diner",
      name: "Ritz Diner",
      offerings: [
        {
          id: "dinner",
          name: "Dinner",
          kind: "preset",
          choices: [
            {
              id: "vegetables",
              label: "Vegetables",
              minSelections: 1,
              maxSelections: 2,
              options: [
                {
                  id: "broccoli",
                  label: "Broccoli",
                  target: { kind: "component", id: "broccoli" },
                },
                {
                  id: "carrots",
                  label: "Carrots",
                  target: { kind: "component", id: "carrots" },
                },
              ],
            },
          ],
        },
      ],
      rules: [
        {
          id: "broccoli-before-4",
          target: {
            kind: "choice_option",
            offeringId: "dinner",
            choiceSlotId: "vegetables",
            optionId: "broccoli",
          },
          when: {
            kind: "local_time",
            before: "16:00",
          },
          effect: {
            kind: "availability",
            available: true,
          },
        },
      ],
    });

    expect(result.rules[0]).toMatchObject({
      when: { kind: "local_time", before: "16:00" },
      effect: { kind: "availability", available: true },
    });
  });

  it("supports guest-count rules above an offering", () => {
    const result = universalMenuSchema.parse({
      id: "catering-menu",
      name: "Catering Menu",
      offerings: [
        {
          id: "package-a",
          name: "Package A",
          kind: "preset",
        },
      ],
      rules: [
        {
          id: "package-minimum",
          target: {
            kind: "offering",
            offeringId: "package-a",
          },
          when: {
            kind: "guest_count",
            minimum: 20,
          },
          effect: {
            kind: "minimum_participants",
            count: 20,
          },
        },
      ],
    });

    expect(result.rules[0]).toMatchObject({
      target: { kind: "offering", offeringId: "package-a" },
      when: { kind: "guest_count", minimum: 20 },
    });
  });


});
