# Lazy Jane's — Menu Customization Handoff

## Read This First

The current codebase is **not finished**. The main remaining problem is bread substitution (`SUB FOR`).

Do **not** keep patching individual menu items. Do **not** special-case The Pesto. Do **not** special-case one modifier group. The implementation needs to work from the menu model across the whole applicable menu.

The current repository is:

```text
~/Documents/Organized_Files/01_Projects/lazy-janes-client-ready
```

The disposable development database is:

```text
lazy_janes_clean
```

The original database is:

```text
lazy_janes
```

**Do not wipe or replace `lazy_janes`.** It contains existing users/orders/demo/operational data. Use `lazy_janes_clean` while fixing the menu model.

---

# What I Want the Product to Do

When a customer opens an item, the customizer should show the food that is already **ON IT** as real components.

For each component, only show actions that make sense for that component:

- `NO`
- `SIDE`
- `EXTRA`
- preparation choices when applicable (toast level, meat temperature, etc.)
- `SUB FOR` when that component has valid replacements

The UI should be driven by normalized menu/component data, not by hard-coded item names.

## Bread / Carrier Behavior

For an eligible sandwich/burger/handheld item, the existing bread/carrier should appear as an `ON IT` component.

Example:

```text
Bun
[NO] [EXTRA] [SUB FOR ▾]
```

`SUB FOR` should offer the restaurant's actual house substitution choices.

The intent is a reusable house bread/carrier substitution catalog, not a unique hand-written implementation for every sandwich.

Examples of carriers already found in the actual retained menu data include:

```text
Sandwich Bread
Bun
Focaccia Bread
Garlic Bread
Hard Roll
Hero Roll
Roll
Sub Roll
Torpedo Roll
Pita
Wrap
```

I also expect choices such as **gluten-free bread** and **lettuce wrap** if Lazy Jane's actually offers them. Those two were not found as explicit canonical ingredients in the current retained source, so they must be added as explicit business data if confirmed. Do not silently invent them from inference.

The important product requirement is:

> Bread substitution is a reusable component capability across eligible menu items. It is not a Pesto feature and it is not tied to one legacy modifier-group ID.

---

# What Must NOT Happen

Do not do any of the following:

1. **Do not special-case The Pesto.**
   - The Pesto can be used as one smoke test, but never as the implementation target.

2. **Do not special-case only this legacy group:**

   ```text
   MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD
   ```

   That is the current mistake. It causes generic sandwich-bread items to receive `SUB FOR`, while items such as `Cheeseburger — Deluxe` with a real `Bun` component do not.

3. **Do not infer a giant all-to-all replacement matrix just because carriers exist elsewhere in the menu.**
   - An earlier implementation generated 1,291 replacement rows by effectively allowing every discovered sandwich carrier to replace every other discovered carrier.
   - That was removed because it was inferred data, not explicit restaurant policy.

4. **Do not use department boundaries as substitution truth.**
   - Department/category may help determine eligibility, but it must not create replacement policy by accident.

5. **Do not treat breakfast bread as normal sandwich substitution data.**
   - `Toast`, `Bagel`, muffins, English muffins, and standalone bread side items should not automatically join the lunch/dinner sandwich replacement catalog.

6. **Do not destroy the original `lazy_janes` DB.**

7. **Do not move runtime menu truth back into hard-coded frontend logic.**
   - Runtime truth belongs in Postgres/API data.

---

# Current State

## Build

The monorepo currently builds successfully:

```bash
cd ~/Documents/Organized_Files/01_Projects/lazy-janes-client-ready
npm run build
```

Last successful build included:

```text
@lazy-janes/shared   tsc passed
@lazy-janes/backend  tsc passed
@lazy-janes/frontend tsc + vite passed
```

## Clean Database

`lazy_janes_clean` has been rebuilt from migrations `000` through `027` and seeded successfully from the canonical importer:

```text
Menu seeded: 427 items across 36 categories
```

## Current Dev Servers

The last known running setup was:

```text
Frontend: http://localhost:5176
Backend:  port 3000
DB:       lazy_janes_clean
```

Backend command:

```bash
cd ~/Documents/Organized_Files/01_Projects/lazy-janes-client-ready
DATABASE_URL=postgresql:///lazy_janes_clean \
npm run dev --workspace @lazy-janes/backend
```

Frontend command:

```bash
cd ~/Documents/Organized_Files/01_Projects/lazy-janes-client-ready
npm run dev --workspace @lazy-janes/frontend -- --port 5176
```

## Frontend Work Already Present

`frontend/src/pages/OrderEntryPage.tsx` already has the desired normalized customizer structure:

- `ON IT`
- per-ingredient `NO`
- per-ingredient `SIDE`
- per-ingredient `EXTRA`
- preparation controls
- replacement control when replacement rows exist
- `AVAILABLE TOPPINGS`

The replacement label has already been changed from:

```text
REPLACE
```

to:

```text
SUB FOR
```

So the major problem is now **data/model population**, not the basic presence of the frontend control.

---

# Canonical Menu Architecture Already in Place

The canonical import source is under:

```text
backend/src/db/menuImport/
```

Important files:

```text
menuData.ts
menuOntology.ts
importLegacyMenuData.ts
```

Seed entry point:

```text
backend/src/db/seedMenu.ts
```

The intended architecture is:

```text
legacy/source menu data
        ↓
import-time ontology translation
        ↓
normalized Postgres menu/component graph
        ↓
API
        ↓
frontend customizer
```

Do not reverse this and make the frontend reinterpret legacy modifier strings.

---

# Normalized Component Model Already Added

Migration `026_menu_component_graph.sql` added the normalized component/preparation model, including concepts such as:

```text
ingredients.kind
menu_item_ingredients.role
menu_item_ingredients.preparation_scheme_id
preparation_schemes
preparation_options
menu_choice_groups.role
order_item_preparation_selections
```

Migration `027_component_replacements.sql` added replacement modeling:

```text
menu_item_ingredient_replacements
order_item_ingredient_replacements
```

Replacement rows contain:

```text
menu_item_id
source_ingredient_id
replacement_ingredient_id
preparation_scheme_id
price_adjustment
price_adjustment_configured
sort_order
```

This is the right general shape. The issue is how the canonical importer populates those rows.

---

# Menu Import / Ontology Work Already Done

`menuOntology.ts` already does import-time normalization for things such as:

- component roles (`protein`, `bread`, `cheese`, `sauce`, etc.)
- ingredient-name resolution
- preparation schemes
- `NO` / none-option semantics
- conversion of old modifier groups into normalized component rules or real choice slots

A duplicate choice-group bug was already fixed. The source had duplicate semantic `Choose Heat` groups for one item with different role labels. Deduplication now uses semantic option content rather than including role in the dedupe key.

That fix built and seeded successfully.

---

# Actual Bread Groups Found in the Retained Menu

A full audit of source bread modifier groups found these patterns.

## Generic unresolved sandwich bread

```text
MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD
LABEL: Choose Bread
OPTIONS: bread type — VERIFY | no bread
```

Used by roughly 77 sandwich/deli items.

This group proves the source knew customers could choose a bread type, but the retained source did not contain the exact house list there.

## Specific carriers

Examples:

```text
Wrap / No Wrap
Focaccia / No Bread
Sandwich Roll / No Bread
Sub Roll / No Bread
Bun / Focaccia Bread / No Bread
Sandwich Bread / No Bread
Hero Roll / No Bread
Pita / No Pita
Tortilla / No Tortilla
Bun / No Bun
```

These specific groups are why the implementation cannot be tied only to the generic `bread type — VERIFY` group.

## Breakfast/service bread groups

Examples:

```text
Toast / No Bread
Bagel / No Bagel
Hard Roll with Butter
English Muffin with Butter & Jelly
Muffins
```

These should not automatically become part of the sandwich `SUB FOR` system.

---

# Current Broken Replacement Implementation

The current source code in `menuOntology.ts` was most recently changed so that replacement rules are created **only** for items linked to:

```text
MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD
```

The result in `lazy_janes_clean` is currently:

```text
Sandwich Bread -> 10 replacement choices across 77 items
Gyro Meat -> Chicken (existing legitimate non-bread replacement)
```

Database totals:

```text
total_sub_for_rules: 771
items_with_sub_for:   78
```

Breakdown:

```text
770 bread replacement rows
+ 1 Gyro Meat -> Chicken row
= 771 total
```

This is why the screenshot of `Cheeseburger — Deluxe` currently shows:

```text
Bun
[NO] [EXTRA]
```

with **no `SUB FOR` control**.

That screenshot is the clearest proof of the remaining bug.

---

# The Correct Target Architecture

There should be three separate concepts.

## 1. Explicit House Carrier Catalog

Create an explicit canonical catalog of substitutions the restaurant actually offers.

This must be **business truth**, not generated from “all bread-like ingredients found in the menu.”

Conceptually:

```ts
HOUSE_SANDWICH_CARRIERS = [
  "Sandwich Bread",
  "Bun",
  "Focaccia Bread",
  "Garlic Bread",
  "Hard Roll",
  "Hero Roll",
  "Roll",
  "Sub Roll",
  "Torpedo Roll",
  "Pita",
  "Wrap",
  // "Gluten-Free Bread" if confirmed,
  // "Lettuce Wrap" if confirmed,
]
```

The final list must be reviewed as business data.

Do not create it by selecting every ingredient where `kind = bread`.

## 2. Explicit Eligibility for the Capability

Determine whether an item's existing carrier participates in the sandwich substitution system.

Eligibility should be import-time normalized data, not runtime string guessing.

Examples that should be eligible if restaurant policy allows them:

```text
Sandwich Bread
Bun
Focaccia Bread
Garlic Bread
Hard Roll
Hero Roll
Roll
Sub Roll
Torpedo Roll
Pita
Wrap
```

Examples that should normally be excluded unless explicitly configured:

```text
Toast
Bagel
English Muffin
standalone muffin items
bread side orders
Tortilla Chips
```

Do not make eligibility equivalent to one source modifier-group ID.

## 3. Replacement Rows Per Eligible Component

At import time, for each eligible sandwich carrier component:

```text
menu item + source carrier
        ↓
explicit allowed house carrier replacements
        ↓
menu_item_ingredient_replacements
```

The frontend then simply renders `SUB FOR` from those rows.

This keeps the frontend dumb and keeps substitution policy in normalized menu data.

---

# Important Pricing Rule

Unknown substitution prices must remain unknown.

Current replacement rows use:

```text
price_adjustment = 0
price_adjustment_configured = false
```

That is intentional when a price has not been confirmed.

Do not convert `PRICE TBD` into `$0.00` just because the numeric field is zero.

If gluten-free bread or another carrier has an upcharge, that needs explicit configured pricing data.

---

# What Is Left To Do

## A. Replace the Current Generic-Group Special Case

Remove the logic that says only items in:

```text
MG_BREAD_CHOOSE_BREAD_BREAD_TYPE_VERIFY_NO_BREAD
```

get replacement rows.

Replace it with the explicit model described above:

```text
explicit house carrier catalog
+
explicit eligible sandwich-carrier capability
=
replacement rows
```

Do this in the import/ontology layer, not in React.

## B. Confirm / Add Missing Business Carriers

The user expects options like:

```text
Gluten-Free Bread
Lettuce Wrap
```

They are not currently explicit canonical ingredients in the retained source.

Therefore:

- confirm whether Lazy Jane's offers them
- if yes, add them explicitly to canonical ingredient/business data
- add their pricing/upcharge truth if known
- include them in the house substitution catalog

Do not fabricate them indirectly.

## C. Rebuild Only the Clean DB

After source changes:

```bash
cd ~/Documents/Organized_Files/01_Projects/lazy-janes-client-ready
npm run build
```

Then:

```bash
dropdb --if-exists lazy_janes_clean && \
createdb lazy_janes_clean && \
DATABASE_URL=postgresql:///lazy_janes_clean \
npm run db:migrate --workspace @lazy-janes/backend && \
DATABASE_URL=postgresql:///lazy_janes_clean \
npm run db:seed:menu --workspace @lazy-janes/backend
```

Expected seed result:

```text
Menu seeded: 427 items across 36 categories
```

Again: **never run the destructive rebuild against `lazy_janes`.**

## D. Validate Menu-Wide Behavior

Do not validate only one item.

At minimum, visually test one item from each relevant carrier family:

```text
Bun
Sandwich Bread
Wrap
Hero Roll
Pita
Sub/Torpedo/Roll family
```

And test exclusions:

```text
Breakfast Toast
Bagel
standalone bread side
```

Expected behavior:

```text
eligible sandwich carrier -> SUB FOR appears
excluded breakfast/service bread -> no sandwich SUB FOR catalog
```

## E. Add Menu-Wide Invariant Tests

Add automated tests around the ontology/importer so this does not regress.

Important invariants:

```text
No duplicate replacement row for same item/source/replacement
No source -> itself replacement
Only explicitly eligible carrier components receive house SUB FOR rules
Breakfast/service breads do not accidentally receive sandwich substitution rules
Every replacement ingredient exists
Unknown prices remain price_adjustment_configured = false
Frontend/API can distinguish unconfigured price from actual $0
No duplicate semantic choice groups
```

Do not write tests centered only on The Pesto.

## F. Do Not Touch Production/Original Data Yet

Once the normalized clean DB behavior is proven, a separate migration/reconciliation plan is still needed for the existing `lazy_janes` DB because it contains operational data.

Do not solve that by deleting/reseeding the original DB.

A safe forward migration/reconciliation needs to preserve at least:

```text
users
credentials/roles
auth/session history
orders
order items
kitchen chits
existing operational records
```

while updating menu composition truth safely.

That is a later step after the clean model is correct.

---

# Final Success Criteria

This work is done only when all of the following are true:

- [ ] Full monorepo build passes.
- [ ] `lazy_janes_clean` seeds all 427 menu items successfully.
- [ ] `ON IT` is component-driven.
- [ ] `NO`, `SIDE`, `EXTRA`, preparation, and `SUB FOR` are capabilities of components.
- [ ] `SUB FOR` is not special-cased to The Pesto.
- [ ] `SUB FOR` is not special-cased to one legacy modifier group.
- [ ] Cheeseburger/Bun-style items receive the correct substitution UI when eligible.
- [ ] Sandwich Bread items receive the same coherent house substitution capability when eligible.
- [ ] Wrap/Pita/Hero/etc. behavior follows explicit business rules, not accidental inference.
- [ ] Breakfast toast/bagel/service bread does not inherit sandwich substitutions unless explicitly configured.
- [ ] Gluten-free bread / lettuce wrap are explicit data if the restaurant offers them.
- [ ] Unknown replacement pricing stays visibly unconfigured/TBD.
- [ ] Menu-wide invariants are tested.
- [ ] Original `lazy_janes` operational data remains untouched until a safe reconciliation migration exists.

---

# One-Sentence Handoff

**Finish the normalized menu system by replacing the current one-group bread-substitution hack with an explicit house sandwich-carrier catalog + explicit per-component eligibility at import time, then prove it menu-wide in `lazy_janes_clean` before touching the original operational database.**
