import type {
  EvidenceState,
  MenuRule,
} from "@lazy-janes/shared";
import { pool } from "./db/pool.js";

type MenuRuleRow = {
  id: string;
  source_key: string;

  target_kind: "menu" | "offering" | "choice_option";
  menu_item_id: string | null;
  choice_group_id: string | null;
  choice_option_id: string | null;

  resolved_menu_item_id: string | null;
  resolved_choice_group_id: string | null;

  condition_kind: "local_time" | "guest_count";
  local_time_before: string | null;
  local_time_at_or_after: string | null;
  guest_count_minimum: number | null;
  guest_count_maximum: number | null;

  effect_kind:
    | "availability"
    | "minimum_participants"
    | "whole_party_required";
  availability: boolean | null;
  minimum_participants: number | null;
  whole_party_required: boolean | null;

  evidence_kind: EvidenceState | null;
};

function localTime(value: string | null): string | undefined {
  return value === null ? undefined : value.slice(0, 5);
}

function toMenuRule(row: MenuRuleRow): MenuRule {
  let target: MenuRule["target"];

  if (row.target_kind === "menu") {
    target = { kind: "menu" };
  } else if (row.target_kind === "offering") {
    if (row.menu_item_id === null) {
      throw new Error(`Menu rule "${row.source_key}" has no offering target`);
    }

    target = {
      kind: "offering",
      offeringId: row.menu_item_id,
    };
  } else {
    if (
      row.choice_option_id === null ||
      row.resolved_choice_group_id === null ||
      row.resolved_menu_item_id === null
    ) {
      throw new Error(
        `Menu rule "${row.source_key}" has an unresolved choice-option target`,
      );
    }

    target = {
      kind: "choice_option",
      offeringId: row.resolved_menu_item_id,
      choiceSlotId: row.resolved_choice_group_id,
      optionId: row.choice_option_id,
    };
  }

  let when: MenuRule["when"];

  if (row.condition_kind === "local_time") {
    when = {
      kind: "local_time",
      before: localTime(row.local_time_before),
      atOrAfter: localTime(row.local_time_at_or_after),
    };
  } else {
    when = {
      kind: "guest_count",
      minimum: row.guest_count_minimum ?? undefined,
      maximum: row.guest_count_maximum ?? undefined,
    };
  }

  let effect: MenuRule["effect"];

  if (row.effect_kind === "availability") {
    if (row.availability === null) {
      throw new Error(
        `Menu rule "${row.source_key}" has no availability value`,
      );
    }

    effect = {
      kind: "availability",
      available: row.availability,
    };
  } else if (row.effect_kind === "minimum_participants") {
    if (row.minimum_participants === null) {
      throw new Error(
        `Menu rule "${row.source_key}" has no minimum-participants value`,
      );
    }

    effect = {
      kind: "minimum_participants",
      count: row.minimum_participants,
    };
  } else {
    if (row.whole_party_required === null) {
      throw new Error(
        `Menu rule "${row.source_key}" has no whole-party value`,
      );
    }

    effect = {
      kind: "whole_party_required",
      required: row.whole_party_required,
    };
  }

  return {
    id: row.id,
    target,
    when,
    effect,
    ...(row.evidence_kind === null
      ? {}
      : {
          evidence: {
            state: row.evidence_kind,
            sourceRef: row.source_key,
          },
        }),
  };
}

export async function getMenuRules(): Promise<MenuRule[]> {
  const result = await pool.query<MenuRuleRow>(`
    SELECT
      rule.id,
      rule.source_key,
      rule.target_kind,
      rule.menu_item_id,
      rule.choice_group_id,
      rule.choice_option_id,

      COALESCE(
        rule.menu_item_id,
        choice_group.menu_item_id
      ) AS resolved_menu_item_id,

      choice_group.id AS resolved_choice_group_id,

      rule.condition_kind,
      rule.local_time_before,
      rule.local_time_at_or_after,
      rule.guest_count_minimum,
      rule.guest_count_maximum,

      rule.effect_kind,
      rule.availability,
      rule.minimum_participants,
      rule.whole_party_required,

      rule.evidence_kind
    FROM menu_rules rule
    LEFT JOIN menu_choice_options choice_option
      ON choice_option.id = rule.choice_option_id
    LEFT JOIN menu_choice_groups choice_group
      ON choice_group.id = choice_option.choice_group_id
    WHERE rule.is_active = true
    ORDER BY rule.source_key, rule.id
  `);

  return result.rows.map(toMenuRule);
}
