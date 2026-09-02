import { describe, expect, it } from "vitest";

import {
  activeMenuRules,
  menuRuleConditionMatches,
} from "../src/menuRuleEvaluator.js";

import type { UniversalMenu } from "../src/menuGrammar.js";

describe("menu rule evaluator", () => {
  it("matches local-time before conditions", () => {
    expect(
      menuRuleConditionMatches(
        { kind: "local_time", before: "16:00" },
        { localTime: "15:59" },
      ),
    ).toBe(true);

    expect(
      menuRuleConditionMatches(
        { kind: "local_time", before: "16:00" },
        { localTime: "16:00" },
      ),
    ).toBe(false);
  });

  it("matches local-time atOrAfter conditions", () => {
    expect(
      menuRuleConditionMatches(
        { kind: "local_time", atOrAfter: "16:00" },
        { localTime: "15:59" },
      ),
    ).toBe(false);

    expect(
      menuRuleConditionMatches(
        { kind: "local_time", atOrAfter: "16:00" },
        { localTime: "16:00" },
      ),
    ).toBe(true);
  });

  it("matches bounded local-time windows", () => {
    const condition = {
      kind: "local_time" as const,
      atOrAfter: "11:00",
      before: "15:00",
    };

    expect(
      menuRuleConditionMatches(condition, { localTime: "10:59" }),
    ).toBe(false);

    expect(
      menuRuleConditionMatches(condition, { localTime: "11:00" }),
    ).toBe(true);

    expect(
      menuRuleConditionMatches(condition, { localTime: "14:59" }),
    ).toBe(true);

    expect(
      menuRuleConditionMatches(condition, { localTime: "15:00" }),
    ).toBe(false);
  });

  it("matches guest-count minimum and maximum", () => {
    const condition = {
      kind: "guest_count" as const,
      minimum: 10,
      maximum: 20,
    };

    expect(
      menuRuleConditionMatches(condition, { guestCount: 9 }),
    ).toBe(false);

    expect(
      menuRuleConditionMatches(condition, { guestCount: 10 }),
    ).toBe(true);

    expect(
      menuRuleConditionMatches(condition, { guestCount: 20 }),
    ).toBe(true);

    expect(
      menuRuleConditionMatches(condition, { guestCount: 21 }),
    ).toBe(false);
  });

  it("does not apply a condition when required context is missing", () => {
    expect(
      menuRuleConditionMatches(
        { kind: "local_time", before: "16:00" },
        {},
      ),
    ).toBe(false);

    expect(
      menuRuleConditionMatches(
        { kind: "guest_count", minimum: 10 },
        {},
      ),
    ).toBe(false);
  });

  it("returns only active menu rules", () => {
    const menu: UniversalMenu = {
      id: "test-menu",
      name: "Test Menu",
      offerings: [],
      rules: [
        {
          id: "before-four",
          target: { kind: "menu" },
          when: {
            kind: "local_time",
            before: "16:00",
          },
          effect: {
            kind: "availability",
            available: true,
          },
        },
        {
          id: "after-four",
          target: { kind: "menu" },
          when: {
            kind: "local_time",
            atOrAfter: "16:00",
          },
          effect: {
            kind: "availability",
            available: true,
          },
        },
      ],
    };

    expect(
      activeMenuRules(menu, { localTime: "15:59" }).map(
        (rule) => rule.id,
      ),
    ).toEqual(["before-four"]);

    expect(
      activeMenuRules(menu, { localTime: "16:00" }).map(
        (rule) => rule.id,
      ),
    ).toEqual(["after-four"]);
  });
});
