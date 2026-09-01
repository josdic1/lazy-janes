import { describe, expect, it } from "vitest";

import {
  choiceSlotSchema,
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
});
