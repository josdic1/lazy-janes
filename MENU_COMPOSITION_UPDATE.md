# Lazy Jane's — Menu Composition Update

This update replaces legacy per-dish modifier rows for new ordering with explicit menu composition.

## Ordering model

- Menu item = sellable item.
- Ingredient = reusable service-visible component, defined once.
- Menu item ingredient = whether an included ingredient can be removed or made extra, plus any extra price.
- ADD = restaurant-wide active ingredient library, excluding ingredients already included or already selected by a choice.
- Choice group = a real decision such as protein, side, egg style, bread, or size.
- Kitchen note = optional escape hatch for unusual requests.
- Order storage records only deviations from the standard item.

## Safety model

Ingredient allergen facts and item-level safety declarations are deliberately separate:

- `ingredients.allergen_flags` = intrinsic allergen facts for reusable ingredients.
- `menu_item_safety_declarations` = authoritative restaurant declarations that may not be derivable from the visible composition.

Supported item-level safety declarations:

- `contains`
- `may_contain`
- `cross_contact`
- `shared_fryer`
- `shared_equipment`
- `other`

Migration `018_menu_item_safety_semantics.sql` preserves any old item-level allergen flags as explicit `contains` declarations, then removes the ambiguous `menu_items.allergen_flags` column.

## Enforced ordering rules

The API rejects:

- ADD of an ingredient already included in the item; EXTRA must be used instead.
- contradictory REMOVE / EXTRA / ADD states for the same ingredient.
- unavailable or invalid ingredients.
- unavailable choice options.
- missing required choices.
- choice counts above a group's maximum.
- duplicate choice ingredients.
- legacy modifier IDs on new orders.

These rules are enforced server-side; the frontend is not trusted as the only validator.

## Install into the current repo

From the Lazy Jane's project root, after extracting this archive over the current source:

```bash
npm run db:migrate --workspace @lazy-janes/backend
npm run build
npm test --workspace @lazy-janes/shared
npm test --workspace @lazy-janes/backend
```

Do **not** run `db:seed:menu` against an existing Lazy Jane's database that already contains the 427 menu items. Migrations 016–018 migrate and populate the composition data for the existing menu.
