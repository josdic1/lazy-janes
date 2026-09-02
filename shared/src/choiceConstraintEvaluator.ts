import type {
  ChoiceSlot,
  ConditionalChoiceConstraint,
  UniversalOffering,
} from "./menuGrammar.js";

export type ChoiceCardinalityInput = {
  id: string;
  minSelections: number;
  maxSelections: number | null;
};

export type EffectiveChoiceCardinality = ChoiceCardinalityInput & {
  isActive: boolean;
};

export type EffectiveChoiceSlot = Omit<
  ChoiceSlot,
  "minSelections" | "maxSelections"
> & {
  isActive: boolean;
  minSelections: number;
  maxSelections: number;
};

function agreedOverride(
  constraints: ConditionalChoiceConstraint[],
  field: "minSelections" | "maxSelections",
): number | undefined {
  const values = constraints
    .map((constraint) => constraint.then[field])
    .filter((value): value is number => value !== undefined);

  const unique = [...new Set(values)];

  if (unique.length > 1) {
    throw new Error(
      `Conflicting conditional choice ${field}: ${unique.join(", ")}`,
    );
  }

  return unique[0];
}

/**
 * Resolve conditional cardinality without depending on any UI or database
 * shape. A target slot is dormant until one of the constraints targeting it
 * is activated by a selected source option.
 */
export function resolveChoiceCardinalities(
  choices: ChoiceCardinalityInput[],
  constraints: ConditionalChoiceConstraint[],
  selectedOptionIds: Iterable<string>,
): EffectiveChoiceCardinality[] {
  const selected = new Set(selectedOptionIds);
  const conditionalTargetIds = new Set(
    constraints.map((constraint) => constraint.then.choiceSlotId),
  );

  const activeConstraintsByTarget = new Map<
    string,
    ConditionalChoiceConstraint[]
  >();

  for (const constraint of constraints) {
    if (!selected.has(constraint.when.optionId)) {
      continue;
    }

    const current =
      activeConstraintsByTarget.get(constraint.then.choiceSlotId) ?? [];
    current.push(constraint);
    activeConstraintsByTarget.set(constraint.then.choiceSlotId, current);
  }

  return choices.map((choice) => {
    const isConditionalTarget = conditionalTargetIds.has(choice.id);
    const activeConstraints =
      activeConstraintsByTarget.get(choice.id) ?? [];
    const isActive = !isConditionalTarget || activeConstraints.length > 0;

    if (!isActive) {
      return {
        ...choice,
        isActive: false,
        minSelections: 0,
        maxSelections: 0,
      };
    }

    const minSelections =
      agreedOverride(activeConstraints, "minSelections") ??
      choice.minSelections;
    const maxSelections =
      agreedOverride(activeConstraints, "maxSelections") ??
      choice.maxSelections;

    if (
      maxSelections !== null &&
      minSelections > maxSelections
    ) {
      throw new Error(
        `Conditional choice bounds are invalid for "${choice.id}": ` +
        `${minSelections} > ${maxSelections}`,
      );
    }

    return {
      ...choice,
      isActive: true,
      minSelections,
      maxSelections,
    };
  });
}

/**
 * Resolve the choices that are currently active for an offering.
 *
 * This is the UMO-facing wrapper around resolveChoiceCardinalities().
 */
export function resolveChoiceSlots(
  offering: UniversalOffering,
  selectedOptionIds: Iterable<string>,
): EffectiveChoiceSlot[] {
  const cardinalities = new Map(
    resolveChoiceCardinalities(
      offering.choices.map((choice) => ({
        id: choice.id,
        minSelections: choice.minSelections,
        maxSelections: choice.maxSelections,
      })),
      offering.choiceConstraints,
      selectedOptionIds,
    ).map((choice) => [choice.id, choice]),
  );

  return offering.choices.map((choice) => {
    const effective = cardinalities.get(choice.id);

    if (!effective) {
      throw new Error(`Missing effective choice state for "${choice.id}"`);
    }

    if (effective.maxSelections === null) {
      throw new Error(
        `UMO ChoiceSlot "${choice.id}" cannot have an unbounded maximum`,
      );
    }

    return {
      ...choice,
      isActive: effective.isActive,
      minSelections: effective.minSelections,
      maxSelections: effective.maxSelections,
    };
  });
}
