# Lazy Jane's — Menu Composition Update

This update replaces legacy per-dish modifier rows for new ordering with explicit menu composition.

## Ordering model

- Menu item = sellable item.
- Ingredient = reusable service-visible component, defined once.
- Menu item ingredient = whether an included ingredient can be removed or made extra, plus any extra price.
- ADD = explicitly approved restaurant-wide ingredients (`is_addable`), excluding ingredients already included or already selected by a choice.
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

## ADD / EXTRA pricing truth

Migration `019_add_extra_pricing_truth.sql` separates permission from price:

- `ingredients.is_addable` explicitly controls whether an ingredient appears in global ADD search.
- `default_add_price = 0` is allowed only as an intentional no-charge ADD after `is_addable` is enabled.
- `menu_item_ingredients.can_extra` explicitly controls EXTRA for a standard component.
- Existing positive prices are preserved; a known positive ingredient ADD price may fill a zero EXTRA placeholder.
- Unpriced zero-dollar EXTRA placeholders from the composition seed are disabled rather than silently treated as free.
- Managers can explicitly enable an EXTRA and set its real item-specific price, including `$0.00` when it is genuinely free.

In Order Entry, selecting an ADD ingredient clears the search text, keeps the selected ingredient checked, restores the available list, and returns keyboard focus to the search field.

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

Do **not** run `db:seed:menu` against an existing Lazy Jane's database that already contains the 427 menu items. Migrations 016–019 migrate and populate the composition data for the existing menu.
