import type {
  MenuRule,
  MenuRuleCondition,
  UniversalMenu,
} from "./menuGrammar.js";

export type MenuRuleContext = {
  localTime?: string;
  guestCount?: number;
};

export type AppliedMenuRule = {
  rule: MenuRule;
  applies: boolean;
};

function minutes(value: string): number {
  const parts = value.split(":");
  return Number(parts[0]) * 60 + Number(parts[1]);
}

export function menuRuleConditionMatches(
  condition: MenuRuleCondition,
  context: MenuRuleContext,
): boolean {
  switch (condition.kind) {
    case "local_time": {
      if (context.localTime === undefined) {
        return false;
      }

      const current = minutes(context.localTime);

      if (
        condition.before !== undefined &&
        current >= minutes(condition.before)
      ) {
        return false;
      }

      if (
        condition.atOrAfter !== undefined &&
        current < minutes(condition.atOrAfter)
      ) {
        return false;
      }

      return true;
    }

    case "guest_count": {
      if (context.guestCount === undefined) {
        return false;
      }

      if (
        condition.minimum !== undefined &&
        context.guestCount < condition.minimum
      ) {
        return false;
      }

      if (
        condition.maximum !== undefined &&
        context.guestCount > condition.maximum
      ) {
        return false;
      }

      return true;
    }
  }
}

export function evaluateMenuRules(
  menu: UniversalMenu,
  context: MenuRuleContext,
): AppliedMenuRule[] {
  return menu.rules.map((rule) => ({
    rule,
    applies: menuRuleConditionMatches(rule.when, context),
  }));
}

export function activeMenuRules(
  menu: UniversalMenu,
  context: MenuRuleContext,
): MenuRule[] {
  return evaluateMenuRules(menu, context)
    .filter((result) => result.applies)
    .map((result) => result.rule);
}
