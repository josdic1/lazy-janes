# Universal Menu Ontology (UMO) Playbook

**Project:** Lazy Jane's / Universal Menu Ontology
**Status:** Canonical going-forward UMO contract
**Version:** UMO v7
**Date:** 2026-09-02

> **CANON AUTHORITY:** UMO v7 supersedes v2 through v6 as the current handoff document. Historical playbooks remain useful only for provenance. If this document conflicts with current code and passing UMO tests, the code and tests win; update this playbook rather than inventing behavior.

> **CURRENT MILESTONE:** The current Lazy Jane's source set is **430/430 representable by UMO with `Unsupported: 0`**. Choice targets are now six-way, including direct `preparation` targets. Order Entry consumes UMO choices and source-proven structural Variants, Ritz conditional vegetable choices and 4 PM availability remain proven end-to-end, and direct preparation choices are server-validated. The only remaining explicit unknown choice target is `Starter: Soup` on 34 items; other `with_unknowns` findings are source-data uncertainty unless specifically identified below as a runtime/grammar gap.

---

# 0. Purpose

UMO is a restaurant-neutral grammar for describing what a restaurant sells without forcing restaurant-specific behavior into the universal model.

This playbook defines:

- the current UMO grammar
- the meaning of each primitive
- the source-truth rules that govern normalization
- how uncertainty is preserved
- how Lazy Jane's source data maps into UMO
- how choices and rules are evaluated at runtime
- what Order Entry now consumes directly from UMO
- what the order server currently enforces
- what has been proven with Ritz and other menus
- what remains incomplete
- when UMO may expand
- how migrations, tests, and coverage must be handled

The code and tests are the final source of truth. This document must not claim an implementation that the current code does not prove.

---

# 1. UMO in one paragraph

UMO describes a sellable offering while preserving both structure and uncertainty:

```text
what it is
what comes in or with it
what can be changed
what can be selected
what a selection actually targets
whether a selection is only a configuration instruction
when a selection activates another choice
what remains semantically unknown
how preparation works
how replacement works
how variants and nested offerings work
how quantity and measure rules work
how pricing is attached
what resources are required
what broader menu rules affect saleability
what is explicit
what is verified
what is inferred
what is unknown
```

The current architecture is:

```text
Retained restaurant source snapshot
        +
Later verified restaurant truth
        ↓
Import-time translation / policies
        ↓
PostgreSQL runtime source truth
        ↓
Lazy Jane's catalog + MenuRule readers
        ↓
Lazy Jane's UMO adapters
        ↓
UniversalMenu
        ↓
Shared evaluators
        ↓
Order Entry / server validation / future consumers
```

The critical boundary remains:

```text
UMO Offering
= what the sellable thing is and how it can be configured

MenuRule
= when, for whom, or under what broader condition it is sellable
```

Do not force broader menu/order policy into food structure.

---

# 2. Current implementation snapshot

As of 2026-09-02, aligned to the proven `d424c82` workstream:

```text
Choice target union                         IMPLEMENTED
  component                                 YES
  offering                                  YES in grammar
  preparation                               YES in grammar + Lazy adapter + server validation
  none                                      YES
  configuration                             YES
  unknown                                   YES

Unknown-target evidence enforcement         YES
Configuration must drive a constraint       YES
Direct-preparation target cross-reference   YES
Choice-level preparation scheme             YES
Choice subset constraints                   YES in grammar
Conditional choice constraints              YES in grammar + shared runtime
ApplicationScope whole/fraction/section     YES in grammar
Measure increment                           YES in grammar
ResourceRequirement per-count               YES in grammar
MenuRule grammar                            YES
MenuRule persistence                        YES
MenuRule reader                             YES
Availability runtime                        YES
Guest-count condition matching              YES
Minimum-participants runtime effect          NOT YET ENFORCED
Whole-party-required runtime effect          NOT YET ENFORCED
Native UMO choices in Order Entry            YES
Legacy choice UI reconstruction              REMOVED
Server conditional-cardinality enforcement  YES
Server time-based choice availability        YES
Choice preparation-question validation       YES
Direct preparation-choice validation         YES
Structural Variant normalization             YES
Variant-option pricing                       YES
Variant selection in Order Entry             YES
Whole-offering choice runtime                NOT PROVEN
Subset-constraint runtime enforcement        NOT IMPLEMENTED
ApplicationScope runtime placement           NOT IMPLEMENTED
Count-based pricing                          NOT IMPLEMENTED
Structural Variant full downstream proof     NOT COMPLETE
Non-food package-content boundary            OPEN
```

Current targeted UMO proof set:

```text
Shared menu grammar/evaluator tests: 35 / 35 passed
  menuGrammar:                       25 / 25
  menuRuleEvaluator:                  6 / 6
  choiceConstraintEvaluator:          4 / 4

Backend targeted tests:              25 / 25 passed
  lazyJanesAdapter:                    4 / 4
  menuData:                           11 / 11
  orders:                             10 / 10

Shared build:                         passed
Backend typecheck:                    passed
Frontend typecheck:                   passed
Coverage total:                       430
Coverage clean:                        99
Coverage with unknowns:               331
Coverage unsupported:                   0
```

The v7 proof is deliberately targeted. It proves the UMO grammar/evaluators, Lazy Jane's adapter/source behavior, order runtime behavior touched by this workstream, builds/typechecks, and coverage; it does not claim that every unrelated repository test was rerun.

---

# 3. Core UMO rules

1. Preserve source truth.
2. Never invent restaurant policy.
3. A source snapshot and later verified truth must remain distinguishable by provenance.
4. Identity and contextual role are different.
5. Role and relationship are different.
6. Relationship and capability are different.
7. Capability permission and capability configuration are different.
8. Unknown is not denied.
9. Unknown is not unsupported.
10. Unknown is not free.
11. Unknown maximum is not unlimited.
12. Choice and replacement are different.
13. Preparation changes state; replacement changes identity.
14. A choice target is exactly one of `component`, `offering`, `preparation`, `none`, `configuration`, or `unknown`.
15. A direct `preparation` target must identify both a preparation scheme and an option on that scheme in the same offering.
16. Direct preparation targeting is different from `ChoiceOption.preparationSchemeId`: the former means the choice itself selects the preparation state; the latter means the chosen option still requires a separate preparation question.
17. A whole offering keeps its identity when selected inside another offering.
18. `configuration` means the option is an instruction that activates another choice; it is not food.
19. `unknown` means the source proves the selectable label but does not prove which reusable semantic target it represents.
20. Every `unknown` target must carry `evidence.state = "unknown"`.
21. Every `configuration` target must actually activate a conditional choice constraint.
22. A ChoiceSlot maximum in UMO is bounded and positive. Repeated ordering/AYCE behavior is not represented by pretending the slot has an unbounded maximum.
23. Choice-level preparation is allowed and must reference a preparation scheme on the same offering.
24. Selection-count pricing is different from ordinary option pricing.
25. Variant-option pricing is different from ordinary choice-option pricing even when both originate from source choice rows.
26. MenuRule conditions are different from offering structure.
27. Availability is not lifecycle state.
28. Local-time interpretation belongs to the caller/application context; the UMO rule stores `HH:MM`, not a restaurant timezone.
29. A service may be a UMO offering without making scheduling, dispatch, payroll, or general operations part of UMO.
30. Restaurant-specific translation belongs in adapters and source-policy layers.
31. Runtime restaurant truth comes from PostgreSQL, not from import heuristics after seeding.
32. Published runtime behavior must be server-enforced when it affects order validity.
33. Expand UMO only after proving that existing grammar plus MenuRule cannot preserve the source fact honestly.

---

# 4. Truth hierarchy and provenance

Lazy Jane's currently has three distinct truth layers.

## 4.1 Retained source snapshot

The retained source is primarily:

```text
backend/src/db/menuImport/menuData.ts
```

It represents what was captured in the original menu extraction/import source.

Do not silently rewrite this file to make later restaurant confirmations look like original-source facts.

## 4.2 Later verified restaurant truth

Confirmed facts learned after the snapshot belong in explicit policy/confirmation data, currently including:

```text
backend/src/db/menuImport/menuPolicies.ts
```

Example:

```text
CONFIRMED_MENU_INGREDIENTS
RITZ_VEGETABLE_CHOICE_POLICIES
RITZ_VEGETABLE_INGREDIENT_IDS
```

This is why Brussels Sprouts was added as later confirmed truth rather than inserted into the historical snapshot.

## 4.3 Runtime database truth

After import/migration, runtime behavior comes from PostgreSQL.

The import ontology states this explicitly:

```text
IMPORT-TIME TRANSLATION ONLY.
Runtime menu behavior must come from PostgreSQL.
Do not use this module to re-synchronize or overwrite manager-edited menu data.
```

Therefore:

```text
menuOntology.ts
≠ runtime synchronization engine
```

Changing import-time policy does not retroactively change an already-seeded database. Existing databases must be updated with additive migrations.

---

# 5. Canonical UniversalMenu

The top-level model is:

```text
UniversalMenu
  id
  name
  offerings[]
  rules[]
  evidence?
```

Conceptually:

```ts
{
  id: string,
  name: string,
  offerings: UniversalOffering[],
  rules: MenuRule[],
  evidence?: Evidence
}
```

The complete `UniversalMenu` validator checks cross-object references, including:

- offering-target choices must point to an offering present in the menu
- offering-target rules must point to an offering present in the menu
- choice-option rules must point to an existing offering
- choice-option rules must point to an existing ChoiceSlot
- choice-option rules must point to an option inside that ChoiceSlot

Object-level parsing alone is not enough for cross-menu identity validation.

---

# 6. Canonical UniversalOffering

Current `UniversalOffering` shape:

```text
id
name
kind

components
preparations
choices
choiceConstraints
variants
bundles
nestedOfferings
addCatalogs
measures
sequences

resourceRequirements
commercialPolicies

evidence
```

Current `kind` values:

```text
preset
retail
service
```

`kind: null` means the source does not establish the classification.

Lazy Jane's currently normalizes ordinary items with:

```text
kind: null
```

because the current MenuItem contract does not prove a universal `preset`, `retail`, or `service` classification.

Do not guess the kind just because an item looks obvious to a human.

---

# 7. Components

A `UniversalComponent` is a reusable thing participating in an offering.

Current core fields:

```text
id
name
role
relationship
capabilities
replacementTargets
preparationSchemeId
evidence
```

## 7.1 Contextual roles

Current universal roles:

```text
base
primary
carrier
filling
topping
sauce
accompaniment
```

A role describes the job a component performs inside this offering.

It is not the same as ingredient taxonomy.

Bad:

```text
ingredient kind = protein
therefore universal role = primary
```

That may be true, but it is not automatically proven.

Lazy Jane's adapter only maps known contextual roles safely. Current explicit fallback mapping includes:

```text
carrier → carrier
sauce   → sauce
```

Other legacy role values may remain `null` until evidence establishes the contextual role.

## 7.2 Relationships

Current universal relationships:

```text
contains
comes_with
```

Examples:

```text
chicken inside sandwich → contains
fries served beside burger → comes_with
```

Role and relationship remain independent.

## 7.3 Unknown relationship/role

`null` is allowed for contextual role and relationship when the source does not establish them.

That is why coverage may report:

```text
relationship_unknown
contextual_role_unknown
```

without marking the offering unsupported.

These are source-quality findings, not ontology failures.

---

# 8. Capabilities

Current capability kinds:

```text
remove
side
extra
replace
prepare
select
```

A capability object exists only when the capability is established.

Each capability has:

```text
configurationState:
  configured
  unconfigured
```

Meaning:

```text
capability absent
→ capability is not established by this object

capability present + configured
→ capability exists and its operational details are configured

capability present + unconfigured
→ capability exists but the allowed details/options are incomplete
```

Do not confuse:

```text
replace allowed, targets unknown
```

with:

```text
replace denied
```

Replacement targets are explicit identity links, not inferred from broad ingredient class.

---

# 9. Preparation

Preparation changes the state/form of the selected thing without changing its identity.

Current preparation structure:

```text
UniversalPreparationScheme
  id
  label
  selectionRequired: boolean | null
  defaultOptionId: string | null
  options[]
  evidence?
```

Validation requires a non-null `defaultOptionId` to reference an option in that scheme.

Examples:

```text
rare / medium / well
scrambled / fried / poached
toasted / untoasted
broiled / fried
mild / spicy
```

## 9.1 Component-level preparation

A component may carry:

```text
preparationSchemeId
```

## 9.2 Replacement-level preparation

A replacement target may carry its own:

```text
preparationSchemeId
```

because the replacement may support a different preparation set than the source component.

## 9.3 Choice-level preparation question — IMPLEMENTED

A ChoiceOption may carry:

```text
ChoiceOption.preparationSchemeId
```

Meaning:

```text
The customer selected this choice option,
and that selected option still needs a separate preparation answer.
```

Validation requires the referenced scheme to exist in:

```text
offering.preparations
```

The Lazy Jane's adapter includes preparation schemes referenced by standard components, active choice options, replacements, and direct preparation targets.

Order Entry reads this field from UMO and creates a separate submitted preparation selection. The order server validates that submitted preparation against the source choice-option preparation scheme.

## 9.4 Direct preparation choice target — IMPLEMENTED AND SERVER-PROVEN

A ChoiceOption may instead target a preparation state directly:

```ts
{
  kind: "preparation",
  preparationSchemeId: "...",
  preparationOptionId: "..."
}
```

Meaning:

```text
Selecting this choice option is itself the preparation decision.
```

Canonical Lazy Jane's examples:

```text
Broiled / Fried
Mild / Spicy
```

This is deliberately different from `ChoiceOption.preparationSchemeId`. A direct preparation target does **not** require a second duplicate preparation answer.

The grammar validates that:

- the target preparation scheme exists on the offering
- the target preparation option belongs to that scheme

Migration 044 adds the source DB link `menu_choice_options.target_preparation_option_id`. The Lazy Jane's adapter maps that link into the UMO `preparation` target and includes the referenced scheme in `offering.preparations`.

Order Entry renders the target as the UMO choice itself and submits the selected source choice-option ID. The server independently checks that the referenced preparation option and scheme are active. The targeted order test proves an inactive target is rejected with 409 and an active `Broiled` target is accepted and persisted as the choice selection.

Do not create a duplicate `order_item_preparation_selection` merely because the UMO semantic target is preparation.

---

# 10. Choices

A `ChoiceSlot` is a question the customer/server must resolve.

Current shape:

```text
id
label
minSelections
maxSelections
applicationScopes[]
options[]
subsetConstraints?
evidence?
```

`maxSelections` is a positive integer in UMO.

Do not use `null` or infinity to represent repeated ordering.

Example:

```text
Choose Sauce
min = 1
max = 1
```

or:

```text
Choose up to 3 toppings
min = 0
max = 3
```

---

# 11. ChoiceOption target — canonical six-way union

UMO v7 defines exactly six target meanings.

```text
component
offering
preparation
none
configuration
unknown
```

Do not add competing nullable semantic IDs such as:

```text
componentId?
offeringId?
targetPreparationOptionId?   ← source persistence field, not universal target shape
isNoneOption?
isConfiguration?
```

The universal target must be one discriminated union. Source-specific persistence may have translation fields, but the UMO output must resolve them into exactly one target meaning.

---

# 12. Target: component

Use:

```ts
{
  kind: "component",
  id: "..."
}
```

Meaning:

```text
Selecting this option selects a reusable component identity.
```

Examples:

```text
Chicken
Avocado
Pepperoni
Broccoli
```

When a Lazy Jane's source choice option has a known `ingredientId`, the adapter maps it to `component`.

---

# 13. Target: offering

Use:

```ts
{
  kind: "offering",
  id: "..."
}
```

Meaning:

```text
Selecting this option selects another sellable offering as an offering.
```

Examples proven in universal fixtures include:

- Burrito Bench base forms
- Trós Greek Street Food souvlaki/spread/side selections
- BubbaQue's combo meats
- prix-fixe courses
- Hart House plated entrée selections
- hoPot pot/soup selections

A whole offering must not be flattened into a fake component merely because it appears inside another offering's choice.

## Current runtime status

The grammar supports offering targets and `UniversalMenu` validates their identity.

However, Lazy Jane's current source catalog does not yet have a complete source field/runtime persistence path for choice-option → offering identity. The current Lazy Jane's adapter therefore does not produce real offering-target choices from its live DB data.

Do not claim whole-offering choice runtime is complete until selection, pricing, persistence, edit/reopen, kitchen, and receipt/check paths are proven.

---

# 14. Target: preparation — IMPLEMENTED AND SERVER-PROVEN

Use:

```ts
{
  kind: "preparation",
  preparationSchemeId: "...",
  preparationOptionId: "..."
}
```

Meaning:

```text
Selecting this option directly selects a preparation state
for the containing offering.
```

Examples:

```text
Broiled
Fried
Mild
Spicy
```

Validation requires the scheme to exist on the offering and the option to belong to that scheme.

Lazy Jane's source persistence uses:

```text
menu_choice_options.target_preparation_option_id
```

as a restaurant/source-specific link. The adapter converts that link into the universal two-ID target above.

This target is not the same as:

```text
ChoiceOption.preparationSchemeId
```

which means the selected choice option still needs a separate preparation question.

The order server validates direct targets against active preparation options/schemes. The choice selection itself carries the selected label such as `Broiled`; no duplicate preparation selection is required.

---

# 15. Target: none

Use:

```ts
{
  kind: "none"
}
```

Meaning:

```text
The source explicitly offers a no-selection/no-component alternative.
```

This is different from unknown.

Examples:

```text
No cheese
No protein
None
```

A source `isNoneOption` maps to this target.

---

# 16. Target: configuration — IMPLEMENTED AND RUNTIME-PROVEN

Use:

```ts
{
  kind: "configuration"
}
```

Meaning:

```text
The customer is selecting an instruction/configuration mode,
not a component or nested offering.
```

A `configuration` option is valid only when it is the source trigger of at least one `ConditionalChoiceConstraint` on the same offering.

The schema rejects configuration targets that do nothing.

## Canonical Ritz example

The menu says:

```text
Two Vegetables
```

That phrase is not itself a vegetable component.

It means:

```text
activate the Vegetables choice
and require exactly 2 selections
```

Likewise:

```text
One Vegetable
```

means:

```text
activate the Vegetables choice
and require exactly 1 selection
```

Therefore:

```text
Two Vegetables → configuration
One Vegetable  → configuration
```

and the actual vegetable options remain normal component-target choices.

This target exists to preserve semantic truth, not to become a generic dumping ground.

---

# 17. Target: unknown — IMPLEMENTED AND REQUIRED FOR HONEST COVERAGE

Use:

```ts
{
  kind: "unknown"
}
```

Meaning:

```text
The source proves that this is a real selectable option,
but does not establish whether it targets a reusable component,
another offering, a preparation state, or a configuration instruction.
```

Every unknown target must include:

```text
evidence.state = "unknown"
```

The schema rejects an unknown target that does not carry unknown evidence.

Lazy Jane's adapter currently uses a note equivalent to:

```text
Legacy source establishes this selectable label
but not its reusable semantic target.
```

## Why this matters

Before explicit unknown-target preservation was introduced, unresolved source choices could make full UMO normalization throw.

Example:

```text
Starter: Soup
```

The source proves the choice label, but does not prove whether `Soup` means:

- a generic reusable component
- Soup Du Jour as another offering
- a manager-defined configuration
- another concept

UMO must not guess.

So it becomes:

```text
target.kind = unknown
```

and normalization continues.

This is why the current source set can be:

```text
Unsupported: 0
```

while still honestly reporting unresolved source semantics.

Unknown is a successful preservation state, not a model failure.

---

# 18. Conditional choice constraints

A choice may change whether another choice is active and what its selection count must be.

Current model:

```text
when:
  choiceSlotId
  optionId

then:
  choiceSlotId
  minSelections?
  maxSelections?
```

Meaning:

```text
When source option X is selected,
activate target slot Y and apply these cardinality bounds.
```

At least one of `minSelections` or `maxSelections` must be provided.

Validation checks:

- source ChoiceSlot exists
- source option exists in the source ChoiceSlot
- target ChoiceSlot exists
- min ≤ max when both exist
- conditional min does not exceed target option count
- conditional max does not exceed target option count

## Runtime semantics

Shared implementation:

```text
shared/src/choiceConstraintEvaluator.ts
```

Core functions:

```text
resolveChoiceCardinalities(...)
resolveChoiceSlots(...)
```

A ChoiceSlot that is the target of any conditional constraint is **dormant by default**.

It becomes active only when at least one constraint targeting it is activated by a selected source option.

Inactive state resolves to:

```text
isActive = false
minSelections = 0
maxSelections = 0
```

Active constraints override the base min/max when they provide those values.

If simultaneously active constraints disagree on the same override field, the evaluator throws rather than guessing.

## Proven Ritz behavior

```text
Two Vegetables
→ Vegetables active, min=2, max=2

One Vegetable
→ Vegetables active, min=1, max=1
```

This is proven in both UI/shared runtime and order-server cardinality validation.

---

# 19. Choice subset constraints

A `ChoiceSlot` may constrain only a subset of its own options.

Example:

```text
Choose 2–3 mains total,
but exactly 2 must be proteins.
```

Current model:

```text
subsetConstraints:
  id
  label?
  optionIds[]
  minSelections?
  maxSelections?
  evidence?
```

Validation rejects:

- missing both min and max
- min > max
- duplicate option IDs
- references to unavailable options
- min/max greater than subset size
- subset minimum greater than slot maximum

Hart House is the current universal fixture proving this structure.

## Runtime status

Grammar support is implemented.

The current Lazy Jane's Order Entry/server path does **not** yet have generic subset-constraint enforcement.

Do not mark subset rules runtime-complete until the shared evaluator and server validation enforce them end-to-end.

---

# 20. ApplicationScope

A choice can specify where its selections may apply.

Current forms:

```text
whole
fraction
section
```

Schema:

```text
{ kind: "whole" }

{ kind: "fraction",
  numerator,
  denominator }

{ kind: "section",
  sectionCount }
```

Fractional scope must be smaller than the whole.

Proof examples:

```text
Luigi's pizza → half/whole toppings
hoPot → whole pot / two-section pot
```

## Runtime status

Grammar is implemented.

Current Lazy Jane's order placement/persistence does not yet model which selected option applies to which fraction/section.

Do not claim ApplicationScope runtime support from schema coverage alone.

---

# 21. Choice maximum is bounded

UMO ChoiceSlot currently requires:

```text
maxSelections: positive integer
```

This is intentional.

Do not change ChoiceSlot to:

```text
maxSelections: null
```

merely to represent:

```text
all-you-can-eat
unlimited rounds
repeated ordering
```

Those are usage/allowance/order-cycle concepts, not the cardinality of a single choice resolution.

If a future menu requires usage limits such as:

```text
per round
per guest
per package
per time window
```

prove that need separately instead of weakening ChoiceSlot semantics.

---

# 22. CommercialPolicy

Offering-level commercial policies currently include:

```text
price
availability text
condition text
payment text
notice text
```

Typed price policy:

```text
id
kind: price
appliesTo
amount
configured
evidence?
```

Current typed price targets:

```text
offering
component_capability
choice_option
variant_option
```

## Price truth

```text
configured = true
→ amount must be known

configured = false
→ amount must be null
```

This prevents:

```text
unknown price = 0
```

from becoming a false claim.

Lazy Jane's adapter currently creates price policies for:

- choice options
- structural Variant options
- component `extra` capability

Order Entry reads choice and Variant price adjustments from the normalized offering's `commercialPolicies` rather than rebuilding them from a legacy UI object.

Source-proven current Variant adjustments include:

```text
Apple/Cherry/Blueberry crumb pie → $0 adjustment
Blueberry Pancakes Full Stack     → $0
Blueberry Pancakes Short Stack    → -$2.00
Chocolate Chip Pancakes Full      → $0
Chocolate Chip Pancakes Short     → -$2.55
```

## Count-based pricing — STILL A REAL GAP

Current price policy expresses a price attached to a target.

It does not yet express rules such as:

```text
first 2 included
additional selections +$3 each

choose 2 = $A
choose 3 = $B
```

Do not fake count-based pricing by duplicating per-option prices.

---

# 23. MenuRule

MenuRule represents broader conditions that govern whether/how menu content can be sold.

Current target union:

```text
menu

offering:
  offeringId

choice_option:
  offeringId
  choiceSlotId
  optionId
```

Current conditions:

```text
local_time
  before?
  atOrAfter?

guest_count
  minimum?
  maximum?
```

Current effects:

```text
availability
minimum_participants
whole_party_required
```

A rule belongs here when the fact answers something like:

```text
When may this be sold?
At what guest count does this apply?
Must the whole party participate?
Is this option available right now?
```

Do not encode these as fake components or variants.

---

# 24. MenuRule runtime evaluator

Shared evaluator:

```text
shared/src/menuRuleEvaluator.ts
```

Core functions:

```text
menuRuleConditionMatches(...)
evaluateMenuRules(...)
activeMenuRules(...)
```

Current context:

```text
localTime?: string
guestCount?: number
```

If required context is missing, the condition does not match.

## Time boundaries

For:

```text
before: 16:00
```

matching stops at exactly 16:00.

For:

```text
atOrAfter: 16:00
```

matching begins at exactly 16:00.

Therefore:

```text
15:59 → before-16 rule can apply
16:00 → at-or-after-16 rule can apply
```

## Timezone responsibility

The UMO condition contains local clock time only.

The calling application resolves the restaurant timezone.

Lazy Jane's currently uses:

```text
America/New_York
```

in both Order Entry and the order server.

Do not bake a restaurant timezone into universal MenuRule grammar.

---

# 25. Runtime MenuRule effect status

## 24.1 Availability — IMPLEMENTED

Availability runtime is split by consumer:

```text
Order Entry UI:
  choice_option availability

Order server:
  menu availability
  offering availability
  choice_option availability
```

The frontend uses active rules to remove unavailable choice options. It does not yet generically hide an entire menu/offering based on MenuRule availability.

The order server independently re-checks active rules and rejects invalid submissions for all three persisted target levels.

The server is authoritative.

## 24.2 Minimum participants — GRAMMAR/PERSISTENCE ONLY

The effect exists in grammar and DB reader:

```text
minimum_participants
```

Current order runtime does not yet generically enforce it.

## 24.3 Whole party required — GRAMMAR/PERSISTENCE ONLY

The effect exists in grammar and DB reader:

```text
whole_party_required
```

Current order runtime does not yet generically enforce it.

Do not call the entire MenuRule effect layer runtime-complete merely because availability is complete.

---

# 26. Availability is not lifecycle

These remain different concepts:

```text
lifecycle/publication state
  draft
  available
  inactive
  eighty-sixed

conditional availability
  available before 4 PM
  unavailable after 4 PM
  only for 20+ guests
```

A rule such as:

```text
Broccoli unavailable at/after 4 PM
```

must not repeatedly mutate the ingredient/menu-item lifecycle state.

Conditional availability is evaluated against context.

---

# 27. Evidence and uncertainty

Current evidence states:

```text
explicit
verified
inferred
unknown
```

Evidence may include:

```text
sourceRef
note
```

Use evidence to preserve how strongly a fact is supported.

Examples:

```text
explicit
→ directly stated in retained source

verified
→ confirmed directly with restaurant after source capture

inferred
→ derived by a defensible translation rule, but not stated literally

unknown
→ source does not establish required semantic identity/detail
```

Do not convert:

```text
source did not say
```

into:

```text
source said no
```

Do not convert:

```text
unknown target
```

into:

```text
component with a made-up ingredient ID
```

Unknown information should normally remain unknown until evidence resolves it.

---

# 28. Variants

A `Variant` currently contains:

```text
id
label
selectionRequired: boolean | null
defaultOptionId: string | null
options[]
evidence?
```

A Variant is meant for a structurally meaningful form of the same offering, not merely any choice label.

Validation ensures a non-null default references a real option.

## Current Lazy Jane's implementation

Source-proven structural variants are declared in:

```text
SOURCE_VARIANT_POLICIES
```

Current live policies cover:

```text
Apple / Cherry / Blueberry Crumb Pie → Variant label: Pie Flavor
Blueberry Pancakes Full/Short Stack  → Variant label: Size
Chocolate Chip Pancakes Full/Short   → Variant label: Size
```

The adapter verifies that the active source option labels exactly match the source policy before converting the source choice group into `offering.variants`. A recognized Variant group is removed from `offering.choices`, preventing the same source question from being represented twice.

Variant prices are emitted as:

```text
CommercialPolicy
  kind: price
  appliesTo.kind: variant_option
```

Order Entry:

- reads Variants directly from UMO
- enforces required Variant selection in the customizer
- reads Variant price adjustments from UMO CommercialPolicy
- includes Variant adjustments in displayed totals/pending-price state
- preserves Variant selections while editing the cart
- submits the selected source option IDs with the order

## Runtime qualification

The current order transport still submits Variant source option IDs through `choiceOptionIds`, and the server validates/persists them through the existing source choice rows. There is not yet a dedicated server-side Variant input/persistence contract or a targeted end-to-end proof covering every downstream consumer.

Therefore:

```text
Variant grammar                     PROVEN
Lazy Jane's Variant normalization   PROVEN
Variant-option price policy         PROVEN
Order Entry Variant selection       IMPLEMENTED
Full downstream Variant semantics   NOT YET PROVEN
```

Do not use Variant as a generic escape hatch for conditional choice behavior.

---

# 29. Bundles and nested offerings

## Bundle

A bundle contains identified offering references with quantities.

```text
Bundle
  id
  label
  entries[]

BundleEntry
  offering
  quantity
```

## NestedOffering

A nested offering keeps another offering's identity while describing its structural relationship to the parent.

```text
NestedOffering
  id
  offering
  relationship: contains | comes_with | null
```

Do not flatten a real nested offering into anonymous components when its offering identity matters.

---

# 30. Add catalogs

`AddCatalog` represents a catalog of components that can be added.

```text
AddCatalog
  id
  label
  options[]
```

Each option references a component identity.

This is different from a required ChoiceSlot.

Use a ChoiceSlot when the order must resolve a bounded question.

Use an AddCatalog when it is a catalog of optional additions.

---

# 31. Measures

Current units include:

```text
each
ounce
pound
gram
kilogram
milliliter
liter
scoop
slice
piece
serving
```

Measure supports:

```text
minimum
maximum
increment
defaultValue
```

All may be nullable where source truth is absent.

Validation ensures:

- minimum ≤ maximum
- default is not below minimum
- default is not above maximum

Jug's Catering proves increment semantics such as:

```text
minimum 10
increment 10
```

---

# 32. Sequences

A Sequence orders steps that target either:

```text
offering
choice
```

Each step has a positive unique position and unique ID.

Use Sequence when the source meaning depends on an ordered progression.

Do not use it merely to store display sort order already handled elsewhere.

---

# 33. Resource requirements

Current resource requirement model supports:

```text
resourceKind:
  personnel
  equipment

calculation:
  per_count
  countKind: guest | participant
  quantity
  perCount
  rounding: up

rate:
  amount
  basis: resource | hour
  minimumBillableUnits
```

Examples:

```text
1 attendant per 25 guests
2 chefs per 50 guests
```

Current universal fixtures include Bon Appétit Catering at Eckerd College and the Grand Brunch Buffet proof.

This represents sellable package/resource requirements.

It does not turn general workforce scheduling into UMO.

---

# 34. Lazy Jane's normalization boundary

Primary offering adapter:

```text
backend/src/menuNormalization/lazyJanesAdapter.ts
```

Menu-level adapter:

```text
backend/src/menuNormalization/lazyJanesMenuAdapter.ts
```

The adapter's job is to translate Lazy Jane's database/source concepts into universal meaning.

It must not hide uncertainty merely to make parsing easier.

---

# 35. Current Lazy Jane's offering adapter behavior

The adapter currently normalizes:

```text
components
contextual role where established
relationship where established
capabilities
replacement targets
preparation schemes
choice slots
choice targets including direct preparation
choice preparation-question schemes
choice constraints
structural variants
choice-option pricing
variant-option pricing
extra-capability pricing
```

## Variant translation

Before ordinary ChoiceSlots are produced, the adapter checks active source choice groups against `SOURCE_VARIANT_POLICIES`.

A source group becomes a `Variant` only when:

```text
item source key matches the policy
source group label matches the policy
active option labels exactly match the policy option labels
```

Recognized Variant groups are removed from the ordinary `choices` output.

## Choice target translation

For remaining source choice groups, current translation precedence is:

```text
isNoneOption
→ none

ingredientId present
→ component

targetPreparationOptionId present and resolvable
→ preparation { preparationSchemeId, preparationOptionId }

active conditional constraint uses this option as source
→ configuration

otherwise
→ unknown + unknown evidence
```

The live Lazy Jane's adapter still does not produce real `offering` targets because the current source catalog lacks a complete persisted source choice-option → offering identity path.

The adapter no longer throws merely because a source choice target has not been semantically resolved.

## Preparation collection

The adapter gathers schemes referenced by:

```text
item components
choice preparation questions
direct preparation targets
replacements
```

so every referenced preparation scheme required by the produced offering is available to the UMO validator.

## Bounded max

If an ordinary live source choice group has no established maximum, the current adapter throws rather than silently claiming unlimited UMO cardinality.

That preserves the bounded ChoiceSlot contract.

---

# 36. Current Lazy Jane's UniversalMenu adapter

`normalizeLazyJanesMenu()`:

```text
filters out draft items
normalizes the remaining items
attaches the MenuRule[] read from PostgreSQL
parses the complete UniversalMenu
```

At the current proof point:

```text
source coverage items: 430
runtime normalized non-draft offerings: 427
```

The difference is publication/draft filtering, not an unsupported-ontology count.

The normalized endpoint is:

```text
GET /api/menu/normalized
```

and returns a full `UniversalMenu`.

---

# 37. Import-time ontology is not runtime truth

File:

```text
backend/src/db/menuImport/menuOntology.ts
```

Its purpose is:

```text
translate the retained snapshot while seeding an empty DB
```

It contains heuristics and explicit import policies.

It must not be used to overwrite manager-edited runtime data later.

When new confirmed restaurant truth must be applied to an existing database:

```text
add a migration
```

Do not rerun destructive seed/import logic merely to update one policy.

---

# 38. Confirmed-source policy pattern

When restaurant truth is learned after the retained snapshot:

1. Keep the retained snapshot unchanged.
2. Add an explicit confirmed-policy record.
3. Teach import-time ontology how to include it for fresh databases.
4. Add an additive migration for already-existing databases.
5. Carry evidence/provenance where the runtime model supports it.
6. Test normalization and runtime behavior.

Ritz vegetable work is the canonical example.

---

# 39. Persistent rule and constraint storage

Current persistence pieces:

```text
menu_rules
menu_choice_constraints
```

## menu_rules

Created by migration 036.

Persists:

```text
target kind
condition kind
condition values
effect kind
effect values
evidence kind
active state
source key
```

## menu_choice_constraints

Created by migration 037.

Persists:

```text
menu item
source choice group
source choice option
target choice group
min selections
max selections
label
sort order
active state
```

The unique identity is currently based on:

```text
source_choice_option_id + target_choice_group_id
```

---

# 40. Native UMO Order Entry — CURRENT STATE

Order Entry file:

```text
frontend/src/pages/OrderEntryPage.tsx
```

Current milestone:

```text
Order Entry no longer reconstructs UMO choices
into MenuChoiceGroup / MenuChoiceOption objects.
```

The old legacy choice bridge was removed.

Current choice selection types use:

```text
EffectiveChoiceSlot
ChoiceOption
```

from shared UMO.

The key helper is now:

```text
choiceSlotsForItem(...)
```

It:

1. finds the normalized UMO offering
2. calls `resolveChoiceSlots()`
3. removes inactive conditional slots
4. removes options made unavailable by active MenuRules
5. returns UMO effective choice slots directly

A final grep proof showed no use of:

```text
MenuChoiceGroup
MenuChoiceOption
customization.choiceGroups
choiceGroupsForItem
```

inside Order Entry's choice path.

## Important qualification

Order Entry still uses the customization catalog for other source-backed concerns such as:

```text
ingredient metadata
replacement data
preparation UI metadata
additions
```

The milestone is specifically that **choice rendering/selection is UMO-native**, not that every legacy/source DTO has disappeared from the application.

---

# 41. Order Entry conditional-choice behavior

When choices change, Order Entry recomputes effective UMO slots.

If a prior selection belongs to a slot that becomes inactive or unavailable, it is removed from selected state.

This prevents hidden stale selections from surviving a configuration change.

Example:

```text
select Two Vegetables
→ Vegetables active, exactly 2

switch to a different parent configuration
→ obsolete child selections are filtered out if no longer allowed
```

The UI displays required/optional state and effective max count from the resolved UMO slot.

---

# 42. Order Entry MenuRule availability behavior

Order Entry maintains restaurant-local time using:

```text
America/New_York
```

and refreshes the rule clock periodically.

It calls:

```text
activeMenuRules(normalizedMenu, { localTime })
```

and derives unavailable choice-option IDs from active rules whose effect is:

```text
availability: false
```

Those options are removed from the UMO choices shown to the user.

This makes the UI responsive to the 4 PM boundary even while the page remains open.

The UI is not the security/validity authority; the server rechecks independently.

---

# 43. Order server UMO enforcement

Order route:

```text
backend/src/routes/orders.ts
```

Current server runtime uses shared UMO evaluation semantics where applicable while reading authoritative source DB rows for order validation.

## 43.1 Restaurant-local rule context

The server resolves:

```text
America/New_York local HH:MM
```

and includes party guest count where available.

## 43.2 Availability

The server rejects orders when active rules make unavailable:

```text
the whole menu
an offering
a selected choice option
```

This prevents a stale UI or crafted request from bypassing availability rules.

## 43.3 Conditional cardinality

The server reads persisted choice constraints and calls:

```text
resolveChoiceCardinalities(...)
```

It rejects:

- selections in a dormant conditional slot
- fewer than effective minimum
- more than effective maximum

Therefore the Ritz One/Two Vegetable rule is enforced server-side, not merely displayed.

## 43.4 Choice preparation question

When a selected choice option carries `preparation_scheme_id`, a submitted separate preparation selection is validated against that expected scheme.

This corresponds to:

```text
ChoiceOption.preparationSchemeId
```

in UMO.

## 43.5 Direct preparation choice target

When a selected source choice option carries:

```text
target_preparation_option_id
```

the server verifies that the targeted preparation option belongs to an active preparation scheme and is itself active.

This corresponds to:

```text
ChoiceOption.target.kind = preparation
```

No duplicate preparation selection is required. The targeted order test proves an inactive direct preparation target is rejected and an active target is accepted/persisted as the choice selection.

## 43.6 Structural Variant qualification

Order Entry submits current Variant source option IDs through `choiceOptionIds`. The server therefore validates and persists them through existing source choice rows, including their source price adjustment. This is functional transport behavior, but it is not yet a dedicated or fully targeted Variant server contract.

## 43.7 Legacy modifier IDs

The current order route rejects legacy `modifierItemIds` rather than continuing an old competing modifier path.

---

# 44. Ritz vegetable case study — canonical configuration example

This is the strongest current real-runtime UMO example.

## Source/menu truth

Published entrée wording established:

```text
Two Vegetables or Side of Spaghetti
```

Kids wording established:

```text
One Vegetable
```

Direct restaurant confirmation established:

```text
before 4 PM:
  Broccoli
  Carrots

after / at 4 PM:
  Sautéed Zucchini
  Brussels Sprouts
  Carrots

everything else extra
```

Exact extra pricing for other vegetables was not established and must not be guessed.

## Structural meaning

```text
Two Vegetables
→ configuration target
→ activates Vegetables slot exactly 2

One Vegetable
→ configuration target
→ activates Vegetables slot exactly 1
```

The child `Vegetables` slot contains component-target options:

```text
Carrots
Broccoli
Zucchini
Brussels Sprouts
```

## Time rules

```text
before 16:00:
  Zucchini unavailable
  Brussels Sprouts unavailable

at/after 16:00:
  Broccoli unavailable

Carrots:
  no unavailability rule
  therefore available in both periods
```

## Price truth

The included One/Two Vegetable trigger and confirmed included vegetables are configured with:

```text
price adjustment = 0
configured = true
```

This prevents the UI from incorrectly showing `PRICE TBD` for included choices.

---

# 45. Ritz proof results

Current real-DB proof produced:

```text
Normalized offerings: 427
Ritz vegetable offerings: 43

Two Vegetables => active=true, min=2, max=2
One Vegetable  => active=true, min=1, max=1

4 PM failures: 0
One Vegetable rule found: true
Two Vegetables rule found: true

RITZ UMO RUNTIME PROOF: PASS
```

Time-boundary proof:

```text
15:59
→ Carrots, Broccoli

16:00
→ Carrots, Zucchini, Brussels Sprouts
```

The DB reader also returned 129 Ritz vegetable MenuRules, consistent with:

```text
43 affected offerings × 3 unavailability rules
```

This case proves together:

- configuration target
- conditional child slot activation
- dynamic effective min/max
- real MenuRule persistence
- local-time evaluation
- choice-option availability
- frontend filtering
- server validation
- included-choice price truth

---

# 46. Current UMO/runtime migrations 036–044

These migrations are part of the current UMO/runtime foundation.

## 036 — menu rules

```text
036_menu_rules.sql
```

Adds persistent MenuRule storage.

## 037 — choice constraints

```text
037_menu_choice_constraints.sql
```

Adds persistent conditional choice constraints.

## 038 — Ritz vegetable choices

```text
038_ritz_vegetable_choices.sql
```

Adds/links:

- Brussels Sprouts ingredient
- child Vegetables slots
- Carrots/Broccoli/Zucchini/Brussels options
- One Vegetable → exactly 1 constraint
- Two Vegetables → exactly 2 constraint

## 039 — Ritz time rules

```text
039_ritz_vegetable_time_rules.sql
```

Adds:

- Zucchini unavailable before 16:00
- Brussels Sprouts unavailable before 16:00
- Broccoli unavailable at/after 16:00

## 040 — Side of Spaghetti

```text
040_link_side_of_spaghetti.sql
```

Links existing `Side of Spaghetti` source options to the already-existing Spaghetti component identity.

This removed 34 former unknown choice targets without inventing new identity.

## 041 — included vegetable prices

```text
041_ritz_included_vegetable_prices.sql
```

Marks confirmed included One/Two Vegetable and activated vegetable choices as configured zero-price adjustments.

## 042 — source-proven component choice targets

```text
042_source_choice_component_targets.sql
```

Resolves only choice labels whose reusable food identity is established by the retained menu/source evidence.

It:

- adds missing source-proven food identities such as Onion Rings, Ice Cream, Veggie Burger, clam sauces, muffins, and challah without making them restaurant-wide add-ons
- corrects the false legacy `Apple` ingredient match inside the crumb-pie choice
- links unambiguous source choices to component identities
- deliberately leaves Soup and other non-component semantics for the appropriate UMO model rather than guessing

## 043 — source-proven Variant prices

```text
043_source_variant_prices.sql
```

Stores configured price adjustments for the source choice rows that are normalized as structural Variants:

```text
Apple / Cherry / Blueberry Crumb Pie
Blueberry Pancakes Full / Short Stack
Chocolate Chip Pancakes Full / Short Stack
```

The semantic Variant classification itself is defined by `SOURCE_VARIANT_POLICIES` and the Lazy Jane's adapter; migration 043 supplies the proven runtime price truth.

## 044 — direct preparation choice targets

```text
044_choice_preparation_targets.sql
```

Adds:

```text
menu_choice_options.target_preparation_option_id
```

and creates/links the source-proven preparation states:

```text
Broiled / Fried
Mild / Spicy
```

The migration explicitly distinguishes direct preparation targeting from `preparation_scheme_id`, which means a choice still needs a separate preparation question.

Fresh-database import uses `SOURCE_PREPARATION_CHOICE_POLICIES` to carry the same source truth into the seeded choice/preparation records.

The test DB was migrated through 044 before the final targeted order proof.

---

# 47. Coverage protocol

Coverage states remain:

```text
clean
with_unknowns
unsupported
```

Current tooling:

```text
backend/src/menuNormalization/lazyJanesCoverage.ts
backend/src/menuNormalization/runLazyJanesCoverage.ts
```

Interpretation:

## clean

The current source data maps without the tracked unknown-quality findings.

## with_unknowns

UMO can represent the item, but source data contains unresolved facts such as:

```text
relationship unknown
contextual role unknown
source review needed
choice target unknown
```

## unsupported

The source contains meaning that current UMO/adapter cannot represent honestly.

This is the category that should trigger ontology-gap analysis.

---

# 48. Current Lazy Jane's coverage result

Current verified result:

```text
LAZY JANE'S UMO COVERAGE
========================
Total:         430
Clean:          99
With unknowns: 331
Unsupported:     0
```

This is the key conclusion:

```text
430/430 current Lazy Jane's source items are representable by UMO.
```

It does **not** mean:

```text
all source truth is known
```

and it does **not** mean:

```text
UMO is proven complete for every restaurant/menu in existence
```

Compared with the v6 proof point (`96 clean / 334 with unknowns`), three additional offerings became clean after source-proven component links, structural Variant recognition/pricing, and direct preparation-target modeling were applied without guessing unresolved identity.

---

# 49. Current unknown findings

The current coverage reason counts are:

```text
312 relationship_unknown
308 contextual_role_unknown
269 source_review_needed
 34 choice_target_unknown:Starter:Soup
```

Current explicit unknown choice targets are now exactly:

```text
34 Starter: Soup
```

The former v6 unknown choice categories were reduced only where source truth supported an existing semantic model:

```text
source-proven foods
→ component targets via migration 042

Full/Short Stack + crumb-pie forms
→ structural Variants + variant_option pricing

Broiled/Fried + Mild/Spicy
→ direct preparation targets via migration 044

Starter: Soup
→ remains unknown
```

These remaining 34 Soup choices are not unsupported. They are explicit source-data/research targets.

---

# 50. Soup is the canonical “do not guess” example

The retained source contains:

```text
Starter
  Soup
  Tossed Salad
```

The menu also separately contains:

```text
Soup Du Jour
Soup of the Day
Daily soup — manager-defined — VERIFY
```

That does **not** prove that the starter label `Soup` semantically targets the Soup Du Jour offering.

Therefore:

```text
Starter: Soup
→ unknown target
```

until restaurant/source evidence establishes the correct identity.

Do not create a fake generic Soup component merely to make coverage look cleaner.

`Unsupported: 0` means there is no need to do so.

---

# 51. Source cleanup vs UMO expansion

When coverage shows an unknown, ask first:

```text
Is the model missing a concept?
```

or:

```text
Do we simply not know which existing concept this source label means?
```

Examples:

```text
Side of Spaghetti
→ source identity was resolvable to existing Spaghetti component
→ data fix, not grammar change

Soup
→ identity not established
→ preserve unknown

Two Vegetables
→ neither component nor offering nor preparation nor none
→ genuinely needed configuration semantics
→ grammar change was justified

Full Stack / Short Stack
→ source proves alternate forms of the same offering
→ existing Variant primitive fits
→ adapter/runtime work, not a new grammar primitive

Broiled / Fried and Mild / Spicy
→ source proves direct preparation states for the containing offering
→ neither component nor Variant nor separate preparation question is truthful
→ direct preparation choice target was the smallest neutral grammar fix
```

This distinction is central to v7.

---

# 52. Current real UMO/runtime gaps

`Unsupported: 0` does not mean runtime work is finished.

The current meaningful gaps are below.

## GAP 1 — Whole-offering choice runtime

Grammar support exists.

Still needs end-to-end proof for Lazy Jane's runtime/storage:

```text
source identity
selection
price
persistence
edit/reopen
kitchen representation
receipt/check representation
```

Priority: HIGH when a real Lazy Jane's offering-target choice is introduced.

## GAP 2 — Count-based pricing

Current policy cannot model selection-count tiers/included allowance cleanly.

Priority: HIGH when required by active product scope.

## GAP 3 — Subset-constraint runtime enforcement

Grammar exists; generic runtime enforcement does not.

Priority: HIGH before using a subset constraint in live ordering.

## GAP 4 — ApplicationScope runtime placement

Grammar exists for whole/fraction/section; order persistence does not yet capture selected scope placement.

Priority: HIGH before split/section choices are live.

## GAP 5 — Remaining MenuRule effects

`minimum_participants` and `whole_party_required` exist in grammar/DB but are not generically enforced by current order runtime.

Priority: HIGH when live rules use them.

## GAP 6 — Structural Variant full downstream proof

Lazy Jane's now normalizes source-proven Variants, emits `variant_option` pricing, and Order Entry renders/submits Variant selections. The remaining gap is a dedicated/targeted downstream proof across server semantics, edit/reopen, kitchen representation, and receipt/check representation.

Priority: MEDIUM.

## GAP 7 — Non-food package contents

Examples include:

```text
cups
spoons
napkins
ration heaters
sleeves
accessory packets
```

Open question:

```text
UMO offering components
vs neighboring package/fulfillment model
```

Do not solve by calling every physical item an Ingredient.

Priority: OPEN.

## GAP 8 — Usage/allowance rules

Future menus may require concepts such as:

```text
per guest
per package
per round
per order
per time window
included quantity then paid repeats
```

Do not weaken ChoiceSlot max to solve this.

Only add a dedicated neutral model after real independent proof.

---

# 53. Things now settled

These are no longer open ontology debates:

```text
Can a choice select a component?
YES.

Can a choice select a whole offering?
YES in UMO grammar.

Can a choice directly select a preparation state?
YES.

Is a direct preparation target different from a choice that still needs a preparation question?
YES.

Can a choice explicitly mean none?
YES.

Can a choice be a configuration instruction rather than food?
YES.

Must a configuration option actually drive another choice?
YES.

Can unresolved source semantics remain selectable without crashing normalization?
YES, target = unknown with unknown evidence.

Is unknown the same as unsupported?
NO.

Can a choice carry a preparation scheme requiring a separate preparation answer?
YES.

Can one choice activate/change another choice's cardinality?
YES.

Can a conditional target slot be dormant until triggered?
YES.

Can a choice constrain a subset of its options?
YES in grammar.

Can application be whole, fractional, or sectional?
YES in grammar.

Can menu-level rules target a choice option?
YES.

Can local-time availability be a MenuRule?
YES.

Can guest count be a MenuRule condition?
YES.

Is availability the same thing as lifecycle state?
NO.

Can a service be a UMO offering?
YES.

Should later verified restaurant truth be rewritten into the old source snapshot?
NO.

Should import heuristics overwrite runtime DB truth?
NO.

Should unresolved source labels be turned into made-up ingredients just to reach clean coverage?
NO.

Is Order Entry still translating UMO choices back into MenuChoiceGroup/MenuChoiceOption?
NO.

Does the order server enforce Ritz conditional cardinality and time availability?
YES.

Does the order server validate direct preparation choice targets?
YES.

Can source-proven Full/Short Stack and crumb-pie forms normalize as structural Variants with Variant-option pricing?
YES.
```

---

# 54. Universal proof matrix

Current cross-menu fixtures establish different structural capabilities.

```text
Lazy Jane's
→ component roles/capabilities with uncertainty

The Cheesecake Factory
→ contains vs comes_with relationships

Burrito Bench
→ offering-target base choices + component choices + add catalog

Trós Greek Street Food
→ choices among whole offerings

BubbaQue's
→ fixed-count whole-offering combo selection

Prix Fixe Proof
→ course choices targeting whole offerings

Hart House
→ subset constraints

hoPot
→ dependent cardinality + section scope

Jug's Catering
→ measure minimum/increment

Bon Appétit Catering at Eckerd College
→ personnel per guest

Luigi's
→ fractional application scope

Grand Brunch Buffet
→ calculated resource requirement + rate

Ritz Diner / Lazy Jane's live source
→ configuration target + unknown preservation + live conditional cardinality + live local-time availability
→ direct preparation targets (Broiled/Fried, Mild/Spicy)
→ source-proven structural Variants with Variant-option pricing
```

A universal fixture proves grammar representation.

A Lazy Jane's/Ritz runtime proof proves application behavior.

Do not treat those as the same level of proof.

---

# 55. Cross-menu proof standard for new primitives

A new universal primitive should normally have at least two meaningfully different real-menu examples.

Duplicate PDFs/versions from the same restaurant do not count as independent proof.

For every proposed change record:

```text
SOURCE FACT
What does the menu actually say?

REQUIRED MEANING
What truth must survive?

CURRENT MODEL
How would current UMO represent it?

LOSS
Exactly what meaning is lost?

UNKNOWN TEST
Could this be preserved honestly as unknown instead of expanding grammar?

EXISTING GRAMMAR TEST
Could component/choice/offering/variant/etc. already represent it?

RULE-LAYER TEST
Does it actually belong in MenuRule?

RUNTIME TEST
Is the problem only that runtime does not yet implement existing grammar?

PROPOSED CHANGE
What is the smallest restaurant-neutral fix?

SECOND EXAMPLE
Where does the same semantic structure occur independently?
```

Only after those questions are answered should schema expansion begin.

---

# 56. UMO expansion decision

Before adding a primitive, ask:

1. Is the source fact real and sufficiently evidenced?
2. Is the fact essential to preserve?
3. Does current UMO fail to represent it honestly?
4. Would `unknown` preserve the source without lying while evidence is incomplete?
5. Have component, choice target, conditional constraint, subset constraint, variant, preparation, replacement, bundle, nested offering, add catalog, measure, sequence, commercial policy, resource requirement, and MenuRule been tested first?
6. Is the missing behavior actually runtime support for an existing primitive rather than a grammar gap?
7. Is the concept restaurant-neutral?
8. Is there independent cross-menu evidence?
9. Can invalid states be rejected by the schema?
10. Can existing valid data migrate cleanly?
11. Does the change remove a hack rather than create one?

If not clearly justified:

```text
DO NOT EXPAND UMO.
```

---

# 57. Migration rule

Do not preserve weak or contradictory shapes merely to avoid migration.

Bad:

```text
componentId?
offeringId?
isNoneOption?
isConfiguration?
isUnknown?
```

Good:

```text
target:
  component | offering | preparation | none | configuration | unknown
```

A migration should:

```text
convert valid existing data
preserve uncertainty
reject impossible states
update DB persistence
update adapters
update shared grammar
update fixtures
update runtime evaluators if needed
update frontend/server consumers
remove obsolete competing fields/paths
rerun coverage
```

When a migration has already been applied locally/shared, do not edit its historical meaning merely because a later fix is convenient. Add a follow-up migration.

This is why Ritz live updates used 038–041 rather than rewriting earlier applied migrations.

---

# 58. Anti-patterns

Never put restaurant names into universal grammar/runtime logic:

```text
if restaurant === "Ritz" ...
```

Restaurant-specific truth belongs in data/policies/migrations/adapters.

Never put item-name-specific behavior into universal logic:

```text
if item.name === "Szechuan Chicken" ...
```

Never create restaurant-specific UMO fields.

Never use null to mean several unrelated things.

Never treat unknown as denied.

Never treat unknown as unsupported.

Never treat unknown price as zero/free.

Never treat unknown maximum as unlimited.

Never flatten a whole offering into a component.

Never turn a configuration instruction into a fake ingredient.

Never turn replacement into preparation.

Never represent a direct preparation choice as a second duplicate preparation question.

Never turn time availability into lifecycle state.

Never duplicate option prices to fake count-based pricing.

Never make ChoiceSlot unbounded merely to represent repeated rounds.

Never rerun import/seeding to overwrite manager-edited DB data when an additive migration is appropriate.

Never add a universal primitive solely to make a coverage unknown disappear.

Never declare runtime support from grammar tests alone.

---

# 59. Testing standard

Every substantial grammar addition should have:

```text
positive parse
invalid-state rejection
cross-reference validation
unknown preservation where relevant
configuration invariant where relevant
cross-menu fixture
```

Every evaluator addition should have:

```text
inactive case
active case
boundary case
conflict/invalid case
```

Every adapter addition should have:

```text
source → exact UMO semantic target
unknown behavior when source is incomplete
preparation/pricing preservation where relevant
direct-preparation target preservation where relevant
Variant conversion/pricing preservation where relevant
```

Every runtime rule should have:

```text
UI behavior
server rejection/acceptance behavior
boundary-time/count case
stale-client protection
active/inactive target case where preparation availability matters
```

Every DB migration should have:

```text
additive correctness
idempotent/conflict-safe behavior where appropriate
no destructive reseed requirement
post-migration reader proof
```

A passing schema test does not prove runtime behavior.

A passing adapter test does not prove server enforcement.

A clean/unsupported-zero Lazy Jane's coverage run does not prove universal completeness.

---

# 60. Current UMO proof commands/status

The final targeted v7 proof set included:

```text
shared/test/menuGrammar.test.ts
shared/test/menuRuleEvaluator.test.ts
shared/test/choiceConstraintEvaluator.test.ts
backend/test/lazyJanesAdapter.test.ts
backend/test/menuData.test.ts
backend/test/orders.test.ts
```

Latest verified counts:

```text
shared/menuGrammar:             25 passed
shared/menuRuleEvaluator:        6 passed
shared/choiceConstraintEvaluator:4 passed
------------------------------------------
shared targeted total:          35 passed

backend/lazyJanesAdapter:         4 passed
backend/menuData:                11 passed
backend/orders:                  10 passed
------------------------------------------
backend targeted total:          25 passed
```

Latest verified build/type checks:

```text
shared build:       PASS
backend typecheck:  PASS
frontend typecheck: PASS
```

Latest verified coverage:

```text
430 total
99 clean
331 with unknowns
0 unsupported
```

Latest verified coverage reasons:

```text
312 relationship_unknown
308 contextual_role_unknown
269 source_review_needed
34  choice_target_unknown:Starter:Soup
```

The direct-preparation order proof was run after applying test-database migrations 036 through 044 and passed as part of `backend/test/orders.test.ts` 10/10.

The combined final proof also ended with:

```text
git diff --check → PASS
```

Do not replace these targeted proofs with a vague statement such as “tests pass.” Record exactly what was run.

---

# 61. Current build order

The ontology itself should now be treated as stable unless real evidence proves a missing concept.

Recommended next work order:

```text
1. Resolve source-data unknowns only where evidence exists.
   Do not guess Soup or similar ambiguous labels.

2. Prove/implement whole-offering choice runtime
   when Lazy Jane's has a live case requiring it.

3. Implement generic subset-constraint runtime enforcement
   before live use of subset rules.

4. Implement ApplicationScope persistence/runtime
   before split/section choices are live.

5. Implement remaining MenuRule effects
   minimum_participants and whole_party_required
   before live use.

6. Implement count-based pricing
   only against proven active requirements.

7. Complete targeted downstream Variant proof when product scope needs it.

8. Continue cross-menu attacks for genuinely different structures.

9. Investigate non-food package contents separately.

10. Add a new primitive only when current grammar + unknown preservation + rule layer + runtime-gap analysis all fail.
```

Do not chase `Clean: 430` by making up semantic identity.

---

# 62. Code map

Canonical shared grammar:

```text
shared/src/menuGrammar.ts
```

Conditional choice evaluator:

```text
shared/src/choiceConstraintEvaluator.ts
```

MenuRule evaluator:

```text
shared/src/menuRuleEvaluator.ts
```

Shared exports:

```text
shared/src/index.ts
```

Cross-menu fixtures:

```text
shared/src/menuGrammarFixtures/universalExamples.ts
```

Lazy Jane's offering adapter:

```text
backend/src/menuNormalization/lazyJanesAdapter.ts
```

Lazy Jane's menu adapter:

```text
backend/src/menuNormalization/lazyJanesMenuAdapter.ts
```

Coverage:

```text
backend/src/menuNormalization/lazyJanesCoverage.ts
backend/src/menuNormalization/runLazyJanesCoverage.ts
```

Customization catalog DB reader:

```text
backend/src/menuCustomizationCatalog.ts
```

MenuRule DB reader:

```text
backend/src/menuRules.ts
```

Normalized menu endpoint:

```text
backend/src/routes/menu.ts
```

Order server runtime validation:

```text
backend/src/routes/orders.ts
```

Native UMO Order Entry choice consumer:

```text
frontend/src/pages/OrderEntryPage.tsx
```

Import-time retained source:

```text
backend/src/db/menuImport/menuData.ts
```

Import-time confirmed policies:

```text
backend/src/db/menuImport/menuPolicies.ts
```

Import-time ontology translation:

```text
backend/src/db/menuImport/menuOntology.ts
```

Import persistence:

```text
backend/src/db/importLegacyMenuData.ts
```

---

# 63. Schema quick reference

## Evidence

```text
state: explicit | verified | inferred | unknown
sourceRef?
note?
```

## OfferingKind

```text
preset | retail | service
```

## Component role

```text
base | primary | carrier | filling | topping | sauce | accompaniment
```

## Relationship

```text
contains | comes_with
```

## Capability

```text
remove | side | extra | replace | prepare | select
```

## Capability configuration

```text
configured | unconfigured
```

## Choice target

```text
component | offering | preparation | none | configuration | unknown
```

Direct preparation target:

```text
preparationSchemeId
preparationOptionId
```

## Application scope

```text
whole | fraction | section
```

## MenuRule target

```text
menu | offering | choice_option
```

## MenuRule condition

```text
local_time | guest_count
```

## MenuRule effect

```text
availability | minimum_participants | whole_party_required
```

## Resource kind

```text
personnel | equipment
```

---

# 64. The canonical UMO reasoning test

The ultimate question is not:

```text
Can we force this menu into the schema?
```

It is:

```text
Can we preserve what the menu actually means
without lying,
flattening identity,
inventing policy,
turning uncertainty into false certainty,
or adding restaurant-specific exceptions?
```

The v7 decision loop is:

```text
SOURCE FACT
    ↓
Can current UMO represent it exactly?
    ↓ yes
Use existing grammar.
    ↓ no
Is the missing detail simply unknown source identity/semantics?
    ↓ yes
Preserve target = unknown + evidence.
    ↓ no
Is it broader saleability/order policy?
    ↓ yes
Use/test MenuRule.
    ↓ no
Is the grammar already capable but runtime incomplete?
    ↓ yes
Implement runtime; do not expand ontology.
    ↓ no
Prove the semantic gap with independent real menus.
    ↓
Add the smallest neutral primitive.
    ↓
Validate impossible states.
    ↓
Migrate source/database.
    ↓
Update adapters/evaluators/UI/server.
    ↓
Run targeted tests + real DB proof + coverage.
```

That is the UMO expansion loop.

---

# 65. Going-forward rule

The current Lazy Jane's milestone is:

```text
UMO CAN REPRESENT EVERY CURRENT LAZY JANE'S SOURCE ITEM.
```

Therefore, from this point forward:

```text
Unknown source truth
→ investigate or preserve unknown.

Existing primitive without runtime support
→ implement runtime.

New menu condition
→ test MenuRule first.

New structural meaning genuinely absent from UMO
→ prove it before expanding grammar.
```

Do not change UMO structure simply because a label is unresolved.

The ontology should now move more slowly than the source-data cleanup and runtime implementation around it.

---

# 66. Canonical handoff summary

A new developer or LLM taking over UMO should remember these points first:

```text
1. v7 is canonical; code/tests win on conflict.

2. Choice targets are six-way:
   component / offering / preparation / none / configuration / unknown.

3. preparation directly selects a preparation state and carries both
   preparationSchemeId + preparationOptionId.

4. Direct preparation targeting is different from ChoiceOption.preparationSchemeId,
   which means the selected choice still needs a separate preparation question.

5. configuration must activate another ChoiceSlot through a constraint.

6. unknown is an intentional preservation state and must carry unknown evidence.

7. Lazy Jane's current source coverage is 430/430 representable, Unsupported: 0.
   Current coverage is 99 clean / 331 with unknowns.

8. The only remaining explicit unknown choice target is 34× Starter: Soup.
   Do not guess its identity.

9. Order Entry consumes UMO ChoiceOption/EffectiveChoiceSlot directly and also
   consumes source-proven UMO Variants with variant_option pricing.

10. Conditional choice cardinality is shared runtime behavior and is server-enforced.

11. MenuRule availability is persisted, evaluated, shown in UI, and rechecked by the server.

12. Direct preparation choices Broiled/Fried and Mild/Spicy are persisted by
    target_preparation_option_id, normalized to UMO preparation targets, and
    server-validated without creating a duplicate preparation selection.

13. Source-proven Full/Short Stack and crumb-pie forms now normalize as Variants;
    full downstream Variant semantics still need dedicated targeted proof.

14. Ritz remains the canonical configuration/time-rule proof:
    One Vegetable = exactly 1;
    Two Vegetables = exactly 2;
    before 4 PM = Broccoli + Carrots;
    at/after 4 PM = Zucchini + Brussels Sprouts + Carrots.

15. Runtime DB truth is PostgreSQL; import ontology is seed-time translation only.

16. Later verified restaurant facts belong in explicit policy + additive migration,
    not rewritten historical source.

17. Whole-offering runtime, subset runtime, ApplicationScope runtime, count-based pricing,
    remaining MenuRule effects, full Variant downstream proof, and non-food package
    contents remain real gaps/open boundaries.

18. Unsupported: 0 does not mean universal completeness.

19. Expand UMO only after unknown preservation, existing grammar, MenuRule,
    and runtime-gap analysis all fail.
```

That is the current UMO v7 contract.
