# UMO PLAYBOOK v3

## What UMO Is

UMO is a restaurant-neutral menu grammar.

It takes the way a restaurant describes something it sells and translates it into consistent internal truth:

**What is this offering? → What comes with it? → What can be chosen? → What can be changed? → Where can a choice apply? → What rules affect those choices, quantities, resources, or price?**

Different restaurants can describe food and service differently. UMO gives those meanings a common structure without inventing restaurant-specific fields.

---

## Core Shape

```text
Menu / Section Rules
        ↓
UMO Offering
        ↓
Components + Choices + Prep + Replacements
```

An Offering may also carry measurable, sequencing, commercial, and service truth needed to describe what is being sold.

---

# 1. IMPLEMENTED

These semantics exist in the actual v3 grammar and have passing tests.

## Offering

`UniversalOffering` is the central object.

It currently supports:

- components
- preparations
- choices
- conditional choice constraints
- variants
- bundles
- nested offerings
- add catalogs
- measures
- sequences
- resource requirements
- commercial policies
- evidence

Source of truth:

- `shared/src/menuGrammar.ts`

---

## Choice Targets

A choice option may target:

```text
Component
Offering
None
```

This is intentionally explicit.

Do not return to loose fields such as `componentId` plus `isNoneOption`.

### Proven by

- Trós Greek Street Food lunch box
- BubbaQue's create-your-own combo
- Prix-fixe course choices

---

## Choice Cardinality

A `ChoiceSlot` defines:

```text
minSelections
maxSelections
options
```

The grammar rejects:

- minimum greater than maximum
- maximum greater than available options

---

## SubsetConstraint

A choice may contain rules applying only to a subset of its options.

Shape:

```text
subset
→ optionIds
→ optional minimum
→ optional maximum
```

This allows rules such as:

> Choose up to 3 total, but only a defined number may come from one subset.

The grammar verifies:

- the subset is non-empty
- option IDs are unique
- referenced options actually exist
- at least one minimum or maximum exists
- subset minimum does not exceed subset maximum
- subset bounds do not exceed the subset itself
- subset minimum cannot exceed the parent ChoiceSlot maximum

### Real-menu proof

Hart House plated wedding menus:

```text
maximum two proteins
plus optional vegetarian choice
```

Fixture:

```text
hart-house:plated-main-course-selection
```

---

## Conditional ChoiceConstraint

A selected option may change the allowed selection count of another ChoiceSlot.

Current trigger:

```text
when:
  choiceSlotId
  optionId
```

Current effect:

```text
then:
  choiceSlotId
  minSelections?
  maxSelections?
```

The grammar verifies:

- source ChoiceSlot exists
- source option exists
- target ChoiceSlot exists
- resulting counts are internally valid
- resulting counts do not exceed available target options

### Real-menu proof

hoPot:

```text
Single Pot
→ choose 1 soup

Yin-Yang Pot
→ choose 2 soups
```

Fixture:

```text
hopot:build-your-own-hot-pot
```

---

## ApplicationScope

A choice can declare where its selections may apply.

Implemented scopes:

```text
whole
fraction
section
```

### Whole

The selection applies to the entire parent offering.

This is the default.

### Fraction

Example:

```text
1 / 2 pizza
```

A fraction describes **coverage of the parent offering**.

It does not mean half the quantity of pepperoni.

The grammar requires:

```text
numerator > 0
denominator > 0
numerator < denominator
```

### Section

Example:

```text
Yin-Yang hot pot
→ 2 sections
```

The grammar requires at least two sections.

### Real-menu proof

Luigi's pizza:

```text
toppings may apply to half or whole pizza
```

hoPot:

```text
Yin-Yang pot contains two soup sections
```

Fixtures:

```text
luigis:pizza-toppings
hopot:build-your-own-hot-pot
```

### Important boundary

The current menu grammar describes which scopes are allowed.

It does **not yet represent an individual placed order saying which specific half or section received a selected option**.

That belongs in order/configuration state rather than menu truth.

---

## Measures and Quantity Increments

`Measure` already supports:

```text
minimum
maximum
increment
defaultValue
```

No separate `multipleOf` field was added because `increment` already carries that meaning.

Example:

```text
minimum: 10
increment: 10
```

means quantities progress in tens.

### Real-menu proof

Jug's catering china package:

```text
must order in quantities of 10
```

Fixture:

```text
jugs:china-package-a
```

---

## ResourceRequirement

UMO v3 can represent calculated resources required by an Offering.

Current resource kinds:

```text
personnel
equipment
```

Current calculation:

```text
per_count
```

with:

```text
countKind:
  guest
  participant

quantity
perCount
rounding: up
```

Example:

```text
2 chefs per 50 guests
```

becomes:

```text
quantity: 2
perCount: 50
countKind: guest
rounding: up
```

Optional rate truth supports:

```text
amount
basis:
  resource
  hour
minimumBillableUnits
```

### Real-menu proof

Eckerd College:

```text
1 buffet attendant per 25 guests
```

Grand Brunch Buffet:

```text
2 chefs per 50 guests
$100 per chef
```

Fixtures:

```text
eckerd:buffet-service
grand-brunch:chef-requirement
```

### Boundary

Staff and equipment requirements are service/commercial truth.

They are not food Components.

---

## Commercial Policies

Commercial behavior remains separate from food structure.

Current structured price policy supports a target plus configured pricing truth.

Current text policy kinds include:

```text
availability
condition
payment
notice
```

Do not encode commercial conditions as fake ingredients, components, or modifiers.

---

# 2. REAL-MENU PROOF RULE

A semantic should not be considered established merely because it sounds useful.

Preferred proof sequence:

```text
1. Find real-menu pressure.
2. Confirm the existing grammar cannot express it cleanly.
3. Look for a second meaningfully different example when practical.
4. Add the smallest restaurant-neutral semantic.
5. Add positive fixtures.
6. Add rejection tests.
7. Run shared tests, backend adapter tests, and full build.
```

Avoid adding restaurant-specific fields just to make one menu fit.

---

# 3. CURRENT v3 PROOF FIXTURES

The current cross-menu fixture set includes proof for:

```text
Choice → Offering
Subset constraints
Conditional choices
Whole/fraction/section application
Quantity increments
Calculated resource requirements
Resource pricing
```

Important v3 fixtures include:

```text
Trós Greek Street Food
BubbaQue's
Prix Fixe Proof
Hart House
hoPot
Jug's Catering
Bon Appétit Catering at Eckerd College
Luigi's
Grand Brunch Buffet
```

Source:

- `shared/src/menuGrammarFixtures/universalExamples.ts`

---

# 4. VALIDATION

State at the v3 code checkpoint:

```text
shared menuGrammar tests: 13 / 13 passing
backend menuData tests: 7 / 7 passing
full shared/backend/frontend build: passing
```

Failure coverage includes rejection of:

```text
invalid ChoiceSlot counts
legacy loose choice targets
subset references to missing options
impossible conditional counts
invalid fraction scopes
nonpositive measure increments
invalid resource calculations
```

Tests:

- `shared/test/menuGrammar.test.ts`
- `backend/test/menuData.test.ts`

Clean code checkpoint:

```text
commit: b9544a8
tag: umo-v3-clean
```

---

# 5. PROVEN CANDIDATES — NOT IMPLEMENTED

These have meaningful real-menu evidence but are **not implemented v3 semantics**.

## Usage / Allowance Rules

Korean BBQ and AYCE menus proved limits such as:

```text
1 order per AYCE
limit 1 per 2 guests
5 rolls at a time
3 special rolls at a time
```

Likely neutral concept:

```text
Usage / Allowance Rule

target
scope
limit
basis
limitWindow
```

Possible bases:

```text
per package
per guest
per party
per N guests
per time window
```

Possible windows:

```text
total
per_order
per_round
time_window
```

Do not implement an AYCE-specific object.

This should probably become a generic commercial-policy capability.

---

## Quantity-Dependent Choice Cardinality

Some catering menus change the number of allowed choices based on quantity or guest count.

Example:

```text
1–12 people → choose 2 flavors
13–24 people → choose 3 flavors
```

Current `ConditionalChoiceConstraint` only reacts to a **selected option**.

It does not react to quantity or guest-count ranges.

Likely future extension:

```text
when:
  selected_option
OR
  measure_range
```

Do not claim v3 currently supports this.

---

# 6. OPEN QUESTIONS

## Order-Level Application Placement

Menu truth can currently say:

```text
toppings may apply to half
soups may apply to one of two sections
```

An order/configuration model may later need to record:

```text
which half?
which section?
```

Do not put order-instance state into menu grammar merely to solve this.

---

## Broader Resource Calculations

Current `ResourceRequirement` supports:

```text
per-count
round up
guest / participant
personnel / equipment
```

Future menus may prove the need for:

```text
fixed + calculated resources
tiered resource counts
capacity-based equipment selection
different rounding behavior
multiple simultaneous calculation inputs
```

Add these only when real menus require them.

---

## Broader Conditional Effects

Current conditional choice rules change only:

```text
minSelections
maxSelections
```

Future evidence may require a selected option to change:

```text
available options
price
application scope
preparation availability
resource requirements
```

Do not generalize until real-menu evidence makes the required effect clear.

---

# 7. UMO BOUNDARY

UMO should contain truth the ordering system needs to understand what is being sold and configured.

Do not force unrelated event policy into food structure.

Examples that generally belong in Menu / Order / Service Rules rather than food Components:

```text
whole-table participation
event time limits
service duration
gratuity
cancellation rules
venue rules
delivery rules
takeout restrictions
leftover charges
setup and teardown requirements
```

The test is:

> Does this describe the Offering and how it may be configured, measured, priced, or supplied?

If yes, UMO may need it.

> Is this a broader rule about the transaction, event, venue, or customer behavior?

If yes, it likely belongs above UMO.

---

# 8. SOURCE OF TRUTH

Do not trust this playbook over the code.

The implemented grammar is defined by:

```text
shared/src/menuGrammar.ts
shared/src/menuGrammarFixtures/universalExamples.ts
shared/test/menuGrammar.test.ts
backend/src/menuNormalization/lazyJanesAdapter.ts
backend/test/menuData.test.ts
```

If this document and the code disagree:

```text
code + tests win
```

Then update this playbook.

---

# 9. STANDARD VALIDATION

After any meaningful UMO change:

```bash
npm run build --workspace @lazy-janes/shared
npm exec --workspace @lazy-janes/shared -- vitest run test/menuGrammar.test.ts
npm exec --workspace @lazy-janes/backend -- vitest run test/menuData.test.ts
npm run build
git diff --check
```

Before committing, confirm the diff contains only intended UMO files.

---

# 10. v3 RULE

The goal is not to make UMO able to represent every sentence ever printed on a restaurant menu.

The goal is:

```text
preserve real ordering truth
without restaurant-specific hacks
without inventing unsupported meaning
without mixing food structure with unrelated policy
```

When a new menu breaks UMO, first determine whether it is:

```text
a real missing semantic
an order-level state problem
a commercial/service rule
or simply wording that maps to something UMO already knows
```

Only the first case automatically justifies expanding the grammar.
