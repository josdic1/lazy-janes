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
        { id: "a", label: "A" },
        { id: "b", label: "B" },
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
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
    });

    expect(result.success).toBe(false);
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
