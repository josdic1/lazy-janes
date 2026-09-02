import { describe, expect, it } from "vitest";

import { resolveChoiceSlots } from "../src/choiceConstraintEvaluator.js";
import type { UniversalOffering } from "../src/menuGrammar.js";

const offering: UniversalOffering = {
  id: "ritz-entree",
  name: "Ritz Entrée",
  kind: "preset",
  components: [],
  preparations: [],
  choices: [
    {
      id: "side",
      label: "Side",
      minSelections: 1,
      maxSelections: 1,
      applicationScopes: [{ kind: "whole" }],
      options: [
        {
          id: "one-vegetable",
          label: "One Vegetable",
          target: { kind: "configuration" },
          isDefault: false,
        },
        {
          id: "two-vegetables",
          label: "Two Vegetables",
          target: { kind: "configuration" },
          isDefault: false,
        },
        {
          id: "spaghetti",
          label: "Side of Spaghetti",
          target: { kind: "component", id: "spaghetti" },
          isDefault: false,
        },
      ],
    },
    {
      id: "vegetables",
      label: "Vegetables",
      minSelections: 0,
      maxSelections: 2,
      applicationScopes: [{ kind: "whole" }],
      options: [
        {
          id: "carrots",
          label: "Carrots",
          target: { kind: "component", id: "carrots" },
          isDefault: false,
        },
        {
          id: "broccoli",
          label: "Broccoli",
          target: { kind: "component", id: "broccoli" },
          isDefault: false,
        },
      ],
    },
  ],
  choiceConstraints: [
    {
      id: "one-rule",
      when: { choiceSlotId: "side", optionId: "one-vegetable" },
      then: {
        choiceSlotId: "vegetables",
        minSelections: 1,
        maxSelections: 1,
      },
    },
    {
      id: "two-rule",
      when: { choiceSlotId: "side", optionId: "two-vegetables" },
      then: {
        choiceSlotId: "vegetables",
        minSelections: 2,
        maxSelections: 2,
      },
    },
  ],
  variants: [],
  bundles: [],
  nestedOfferings: [],
  addCatalogs: [],
  measures: [],
  sequences: [],
  resourceRequirements: [],
  commercialPolicies: [],
};

describe("choice constraint evaluator", () => {
  it("keeps a dependent choice dormant before its trigger is selected", () => {
    const vegetables = resolveChoiceSlots(offering, []).find(
      (choice) => choice.id === "vegetables",
    );

    expect(vegetables).toMatchObject({
      isActive: false,
      minSelections: 0,
      maxSelections: 0,
    });
  });

  it("activates exactly one vegetable from the one-vegetable trigger", () => {
    const vegetables = resolveChoiceSlots(offering, ["one-vegetable"]).find(
      (choice) => choice.id === "vegetables",
    );

    expect(vegetables).toMatchObject({
      isActive: true,
      minSelections: 1,
      maxSelections: 1,
    });
  });

  it("activates exactly two vegetables from the two-vegetables trigger", () => {
    const vegetables = resolveChoiceSlots(offering, ["two-vegetables"]).find(
      (choice) => choice.id === "vegetables",
    );

    expect(vegetables).toMatchObject({
      isActive: true,
      minSelections: 2,
      maxSelections: 2,
    });
  });

  it("rejects simultaneously active constraints that disagree", () => {
    expect(() =>
      resolveChoiceSlots(offering, ["one-vegetable", "two-vegetables"]),
    ).toThrow("Conflicting conditional choice minSelections");
  });
});
