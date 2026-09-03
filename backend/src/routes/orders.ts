import {
  cancelOrderInputSchema,
  createOrderInputSchema,
  deliverOrderItemsInputSchema,
  fireOrderInputSchema,
  markKitchenItemsReadyInputSchema,
  menuRuleConditionMatches,
  resolveChoiceCardinalities,
  voidOrderItemsInputSchema,
  type AllergenFlag,
  type ConditionalChoiceConstraint,
  type KitchenChit,
  type Order,
  type OrderItem,
  type OrderItemChoiceSelection,
  type OrderItemIngredientChange,
  type OrderItemIngredientReplacement,
  type OrderItemModifier,
  type OrderItemPreparationSelection,
  type PartyStatus,
} from "@lazy-janes/shared";
import { Router } from "express";
import { z } from "zod";
import {
  getAuthenticatedUser,
  requireAnyRole,
  requireAuthenticatedUser,
} from "../auth/session.js";
import { pool } from "../db/pool.js";
import { getMenuRules } from "../menuRules.js";

type MenuRow = {
  id: string;
  name: string;
  price: string;
  status: string;
  is_modifier: boolean;
};

type OrderRow = {
  id: string;
  party_id: string | null;
  fulfillment_type: Order["fulfillmentType"];
  created_by_user_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  requested_for: Date | null;
  delivery_address: string | null;
  submitted_at: Date;
  cancelled_at: Date | null;
  cancelled_by_user_id: string | null;
  cancellation_reason: string | null;
  created_at: Date;
};

type OrderItemRow = {
  id: string;
  menu_item_id: string;
  seat_number: number | null;
  item_name: string;
  unit_price: string;
  quantity: number;
  kitchen_note: string | null;
  status: OrderItem["status"];
  submitted_at: Date;
  fired_at: Date | null;
  ready_at: Date | null;
  fulfilled_at: Date | null;
  voided_at: Date | null;
  voided_by_user_id: string | null;
  void_reason: string | null;
};

type ModifierRow = {
  id: string;
  menu_item_id: string;
  modifier_name: string;
  price_adjustment: string;
};

type IngredientRuleRow = {
  ingredient_id: string;
  ingredient_name: string;
  allergen_flags: AllergenFlag[];
  is_active: boolean;
  can_remove: boolean;
  can_side: boolean;
  can_extra: boolean;
  extra_price: string;
  extra_price_configured: boolean;
  default_add_price: string;
  add_price_configured: boolean;
  preparation_scheme_id: string | null;
};

type ReplacementRuleRow = {
  source_ingredient_id: string;
  source_ingredient_name: string;
  replacement_ingredient_id: string;
  replacement_ingredient_name: string;
  replacement_allergen_flags: AllergenFlag[];
  replacement_is_active: boolean;
  preparation_scheme_id: string | null;
  price_adjustment: string;
  price_adjustment_configured: boolean;
};

type IngredientReplacementRow = {
  id: string;
  source_ingredient_id: string;
  replacement_ingredient_id: string;
  source_ingredient_name: string;
  replacement_ingredient_name: string;
  price_adjustment: string;
  price_configured: boolean;
  allergen_flags: AllergenFlag[];
};

type ChoiceRuleRow = {
  group_id: string;
  group_label: string;
  min_selections: number;
  max_selections: number | null;
  option_id: string;
  option_label: string;
  ingredient_id: string | null;
  preparation_scheme_id: string | null;
  target_preparation_option_id: string | null;
  price_adjustment: string;
};

type ChoiceConstraintRuleRow = {
  id: string;
  source_choice_group_id: string;
  source_choice_option_id: string;
  target_choice_group_id: string;
  min_selections: number | null;
  max_selections: number | null;
  label: string | null;
};

type PreparationRuleRow = {
  option_id: string;
  preparation_scheme_id: string;
  scheme_label: string;
  option_label: string;
};

type PreparationSelectionRow = {
  id: string;
  ingredient_id: string | null;
  choice_option_id: string | null;
  preparation_scheme_id: string | null;
  preparation_option_id: string | null;
  target_label: string;
  scheme_label: string;
  option_label: string;
};

type IngredientChangeRow = {
  id: string;
  ingredient_id: string;
  ingredient_name: string;
  change_kind: OrderItemIngredientChange["changeKind"];
  price_adjustment: string;
  price_configured: boolean;
  allergen_flags: AllergenFlag[];
};

type ChoiceSelectionRow = {
  id: string;
  choice_group_id: string | null;
  choice_option_id: string | null;
  group_label: string;
  option_label: string;
  ingredient_id: string | null;
  price_adjustment: string;
};

type ItemCustomizationRules = {
  includedById: Map<string, IngredientRuleRow>;
  addableById: Map<string, IngredientRuleRow>;
  replacementsBySource: Map<string, Map<string, ReplacementRuleRow>>;
  choiceRows: ChoiceRuleRow[];
  choiceConstraints: ConditionalChoiceConstraint[];
  preparationByOptionId: Map<string, PreparationRuleRow>;
};

const RESTAURANT_TIME_ZONE = "America/New_York";

function restaurantLocalTime(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: RESTAURANT_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;

  if (!hour || !minute) {
    throw new Error("Could not resolve restaurant local time");
  }

  return `${hour}:${minute}`;
}

function toModifier(row: ModifierRow): OrderItemModifier {
  return {
    id: row.id,
    menuItemId: row.menu_item_id,
    modifierName: row.modifier_name,
    priceAdjustment: Number(row.price_adjustment),
  };
}

function toIngredientChange(
  row: IngredientChangeRow,
): OrderItemIngredientChange {
  return {
    id: row.id,
    ingredientId: row.ingredient_id,
    ingredientName: row.ingredient_name,
    changeKind: row.change_kind,
    priceAdjustment: Number(row.price_adjustment),
    priceConfigured: row.price_configured,
    allergenFlags: row.allergen_flags,
  };
}

function toIngredientReplacement(
  row: IngredientReplacementRow,
): OrderItemIngredientReplacement {
  return {
    id: row.id,
    sourceIngredientId: row.source_ingredient_id,
    replacementIngredientId: row.replacement_ingredient_id,
    sourceIngredientName: row.source_ingredient_name,
    replacementIngredientName: row.replacement_ingredient_name,
    priceAdjustment: Number(row.price_adjustment),
    priceConfigured: row.price_configured,
    allergenFlags: row.allergen_flags,
  };
}

function toPreparationSelection(
  row: PreparationSelectionRow,
): OrderItemPreparationSelection {
  return {
    id: row.id,
    ingredientId: row.ingredient_id,
    choiceOptionId: row.choice_option_id,
    preparationSchemeId: row.preparation_scheme_id,
    preparationOptionId: row.preparation_option_id,
    targetLabel: row.target_label,
    schemeLabel: row.scheme_label,
    optionLabel: row.option_label,
  };
}

function toChoiceSelection(
  row: ChoiceSelectionRow,
): OrderItemChoiceSelection {
  return {
    id: row.id,
    choiceGroupId: row.choice_group_id,
    choiceOptionId: row.choice_option_id,
    groupLabel: row.group_label,
    optionLabel: row.option_label,
    ingredientId: row.ingredient_id,
    priceAdjustment: Number(row.price_adjustment),
  };
}

function toOrderItem(
  row: OrderItemRow,
  modifiers: OrderItemModifier[] = [],
  ingredientChanges: OrderItemIngredientChange[] = [],
  ingredientReplacements: OrderItemIngredientReplacement[] = [],
  choiceSelections: OrderItemChoiceSelection[] = [],
  preparationSelections: OrderItemPreparationSelection[] = [],
): OrderItem {
  return {
    id: row.id,
    menuItemId: row.menu_item_id,
    seatNumber: row.seat_number,
    itemName: row.item_name,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    kitchenNote: row.kitchen_note,
    status: row.status,
    submittedAt: row.submitted_at.toISOString(),
    firedAt: row.fired_at?.toISOString() ?? null,
    readyAt: row.ready_at?.toISOString() ?? null,
    fulfilledAt: row.fulfilled_at?.toISOString() ?? null,
    voidedAt: row.voided_at?.toISOString() ?? null,
    voidedByUserId: row.voided_by_user_id,
    voidReason: row.void_reason,
    ingredientChanges,
    ingredientReplacements,
    choiceSelections,
    preparationSelections,
    modifiers,
  };
}

function toOrder(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    partyId: row.party_id,
    fulfillmentType: row.fulfillment_type,
    createdByUserId: row.created_by_user_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    requestedFor: row.requested_for?.toISOString() ?? null,
    submittedAt: row.submitted_at.toISOString(),
    cancelledAt: row.cancelled_at?.toISOString() ?? null,
    cancelledByUserId: row.cancelled_by_user_id,
    cancellationReason: row.cancellation_reason,
    createdAt: row.created_at.toISOString(),
    items,
  };
}

export const ordersRouter = Router();
ordersRouter.use(requireAuthenticatedUser);

ordersRouter.post(
  "/",
  requireAnyRole("server", "lead_server", "manager", "admin"),
  async (request, response) => {
    const input = createOrderInputSchema.safeParse(request.body);

    if (!input.success) {
      response.status(400).json({
        error: "Invalid order",
        issues: input.error.issues,
      });
      return;
    }

    const userId = getAuthenticatedUser(request).id;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `SELECT id FROM users WHERE id = $1 AND is_active = true`,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({ error: "Active user not found" });
        return;
      }

      let partyStatus: PartyStatus | null = null;
      let partyGuestCount: number | undefined;

      if (input.data.partyId !== null) {
        const party = await client.query<{
          status: PartyStatus;
          guest_count: number;
        }>(
          `SELECT status, guest_count FROM parties WHERE id = $1 FOR UPDATE`,
          [input.data.partyId],
        );
        partyStatus = party.rows[0]?.status ?? null;
        partyGuestCount = party.rows[0]?.guest_count;

        if (partyStatus === null) {
          await client.query("ROLLBACK");
          response.status(404).json({ error: "Party not found" });
          return;
        }
        if (partyStatus === "completed" || partyStatus === "cancelled") {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "Orders cannot be added to a finished party",
          });
          return;
        }
        if (
          input.data.fulfillmentType === "dine_in" &&
          partyStatus !== "seated" &&
          partyStatus !== "in_service"
        ) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "A dine-in party must be seated first",
          });
          return;
        }
      }

      const requestedMenuIds = Array.from(
        new Set(input.data.items.map((item) => item.menuItemId)),
      );
      const menuRules = await getMenuRules();
      const runtimeRuleContext = {
        localTime: restaurantLocalTime(),
        ...(partyGuestCount === undefined
          ? {}
          : { guestCount: partyGuestCount }),
      };
      const activeRuntimeRules = menuRules.filter((rule) =>
        menuRuleConditionMatches(rule.when, runtimeRuleContext),
      );

      if (
        activeRuntimeRules.some(
          (rule) =>
            rule.target.kind === "menu" &&
            rule.effect.kind === "availability" &&
            rule.effect.available === false,
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({ error: "The menu is currently unavailable" });
        return;
      }

      const menuResult = await client.query<MenuRow>(
        `
          SELECT id, name, price, status, is_modifier
          FROM menu_items
          WHERE id = ANY($1::uuid[])
          FOR SHARE
        `,
        [requestedMenuIds],
      );
      const menuById = new Map(menuResult.rows.map((item) => [item.id, item]));
      const rulesByMenuItem = new Map<string, ItemCustomizationRules>();

      for (const requestedItem of input.data.items) {
        const menuItem = menuById.get(requestedItem.menuItemId);

        if (!menuItem || menuItem.is_modifier || menuItem.status !== "available") {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "One or more menu items are unavailable",
          });
          return;
        }

        if (
          activeRuntimeRules.some(
            (rule) =>
              rule.target.kind === "offering" &&
              rule.target.offeringId === menuItem.id &&
              rule.effect.kind === "availability" &&
              rule.effect.available === false,
          )
        ) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: `${menuItem.name} is currently unavailable`,
          });
          return;
        }

        if (requestedItem.modifierItemIds.length > 0) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: "Legacy menu modifiers are no longer accepted",
          });
          return;
        }

        let rules = rulesByMenuItem.get(menuItem.id);
        if (!rules) {
          const includedResult =
            await client.query<IngredientRuleRow>(
              `
                SELECT
                  ingredient.id AS ingredient_id,
                  ingredient.name AS ingredient_name,
                  ingredient.allergen_flags,
                  ingredient.is_active,
                  link.can_remove,
                  link.can_side,
                  link.can_extra,
                  link.extra_price,
                  link.extra_price_configured,
                  ingredient.default_add_price,
                  ingredient.add_price_configured,
                  link.preparation_scheme_id
                FROM menu_item_ingredients link
                JOIN ingredients ingredient
                  ON ingredient.id = link.ingredient_id
                WHERE link.menu_item_id = $1
              `,
              [menuItem.id],
            );

          const ingredientResult =
            await client.query<IngredientRuleRow>(
              `
                SELECT
                  ingredient.id AS ingredient_id,
                  ingredient.name AS ingredient_name,
                  ingredient.allergen_flags,
                  ingredient.is_active,
                  false AS can_remove,
                  false AS can_side,
                  false AS can_extra,
                  0::numeric AS extra_price,
                  false AS extra_price_configured,
                  ingredient.default_add_price,
                  ingredient.add_price_configured,
                  NULL::uuid AS preparation_scheme_id
                FROM menu_item_additions addition
                JOIN ingredients ingredient
                  ON ingredient.id = addition.ingredient_id
                WHERE addition.menu_item_id = $1
                  AND addition.is_active = true
                  AND ingredient.is_active = true
                  AND ingredient.is_addable = true
                ORDER BY
                  addition.sort_order,
                  lower(ingredient.name),
                  ingredient.id
              `,
              [menuItem.id],
            );

          const replacementResult =
            await client.query<ReplacementRuleRow>(
              `
                SELECT
                  replacement.source_ingredient_id,
                  source.name AS source_ingredient_name,
                  target.id AS replacement_ingredient_id,
                  target.name AS replacement_ingredient_name,
                  target.allergen_flags AS replacement_allergen_flags,
                  target.is_active AS replacement_is_active,
                  replacement.preparation_scheme_id,
                  replacement.price_adjustment,
                  replacement.price_adjustment_configured
                FROM menu_item_ingredient_replacements replacement
                JOIN ingredients source
                  ON source.id = replacement.source_ingredient_id
                JOIN ingredients target
                  ON target.id = replacement.replacement_ingredient_id
                WHERE replacement.menu_item_id = $1
                ORDER BY
                  replacement.source_ingredient_id,
                  replacement.sort_order,
                  lower(target.name)
              `,
              [menuItem.id],
            );

          const choiceResult =
            await client.query<ChoiceRuleRow>(
              `
                SELECT
                  group_record.id AS group_id,
                  group_record.label AS group_label,
                  group_record.min_selections,
                  group_record.max_selections,
                  option_record.id AS option_id,
                  option_record.label AS option_label,
                  option_record.ingredient_id,
                  option_record.preparation_scheme_id,
                  option_record.target_preparation_option_id,
                  option_record.price_adjustment
                FROM menu_choice_groups group_record
                JOIN menu_choice_options option_record
                  ON option_record.choice_group_id = group_record.id
                WHERE group_record.menu_item_id = $1
                  AND group_record.is_active = true
                  AND option_record.is_active = true
                ORDER BY
                  group_record.sort_order,
                  option_record.sort_order,
                  option_record.label
              `,
              [menuItem.id],
            );

          const choiceConstraintResult =
            await client.query<ChoiceConstraintRuleRow>(
              `
                SELECT
                  constraint_record.id,
                  constraint_record.source_choice_group_id,
                  constraint_record.source_choice_option_id,
                  constraint_record.target_choice_group_id,
                  constraint_record.min_selections,
                  constraint_record.max_selections,
                  constraint_record.label
                FROM menu_choice_constraints constraint_record
                WHERE constraint_record.menu_item_id = $1
                  AND constraint_record.is_active = true
                ORDER BY
                  constraint_record.sort_order,
                  constraint_record.id
              `,
              [menuItem.id],
            );

          const preparationResult =
            await client.query<PreparationRuleRow>(`
              SELECT
                option_record.id AS option_id,
                option_record.preparation_scheme_id,
                scheme.label AS scheme_label,
                option_record.label AS option_label
              FROM preparation_options option_record
              JOIN preparation_schemes scheme
                ON scheme.id = option_record.preparation_scheme_id
              WHERE option_record.is_active = true
                AND scheme.is_active = true
            `);

          const replacementsBySource = new Map<string, Map<string, ReplacementRuleRow>>();
          for (const replacement of replacementResult.rows) {
            const targets = replacementsBySource.get(replacement.source_ingredient_id) ?? new Map<string, ReplacementRuleRow>();
            targets.set(replacement.replacement_ingredient_id, replacement);
            replacementsBySource.set(replacement.source_ingredient_id, targets);
          }

          rules = {
            includedById: new Map(
              includedResult.rows.map((row) => [row.ingredient_id, row]),
            ),
            addableById: new Map(
              ingredientResult.rows.map((row) => [row.ingredient_id, row]),
            ),
            replacementsBySource,
            choiceRows: choiceResult.rows,
            choiceConstraints: choiceConstraintResult.rows.map(
              (constraint) => ({
                id: constraint.id,
                when: {
                  choiceSlotId: constraint.source_choice_group_id,
                  optionId: constraint.source_choice_option_id,
                },
                then: {
                  choiceSlotId: constraint.target_choice_group_id,
                  ...(constraint.min_selections === null
                    ? {}
                    : { minSelections: constraint.min_selections }),
                  ...(constraint.max_selections === null
                    ? {}
                    : { maxSelections: constraint.max_selections }),
                },
                ...(constraint.label === null
                  ? {}
                  : { label: constraint.label }),
              }),
            ),
            preparationByOptionId: new Map(
              preparationResult.rows.map((row) => [row.option_id, row]),
            ),
          };
          rulesByMenuItem.set(menuItem.id, rules);
        }

        for (const ingredientId of requestedItem.removedIngredientIds) {
          const rule = rules.includedById.get(ingredientId);
          if (!rule || !rule.is_active || !rule.can_remove) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `That ingredient cannot be removed from ${menuItem.name}`,
            });
            return;
          }
        }

        for (const ingredientId of requestedItem.sideIngredientIds) {
          const rule = rules.includedById.get(ingredientId);
          if (!rule || !rule.is_active || !rule.can_side) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `That ingredient cannot be put on the side for ${menuItem.name}`,
            });
            return;
          }
        }

        for (const ingredientId of requestedItem.extraIngredientIds) {
          const rule = rules.includedById.get(ingredientId);
          if (!rule || !rule.is_active || !rule.can_extra) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `That ingredient cannot be made extra on ${menuItem.name}`,
            });
            return;
          }
        }

        const selectedReplacementBySource = new Map<string, ReplacementRuleRow>();
        const selectedReplacementTargetIds = new Set<string>();
        for (const requestedReplacement of requestedItem.ingredientReplacements) {
          const source = rules.includedById.get(requestedReplacement.sourceIngredientId);
          const replacement = rules.replacementsBySource
            .get(requestedReplacement.sourceIngredientId)
            ?.get(requestedReplacement.replacementIngredientId);
          if (!source || !replacement || !replacement.replacement_is_active) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `That replacement is unavailable for ${menuItem.name}`,
            });
            return;
          }
          if (
            requestedItem.removedIngredientIds.includes(requestedReplacement.sourceIngredientId) ||
            requestedItem.sideIngredientIds.includes(requestedReplacement.sourceIngredientId) ||
            requestedItem.extraIngredientIds.includes(requestedReplacement.sourceIngredientId)
          ) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `${source.ingredient_name} cannot be changed twice on ${menuItem.name}`,
            });
            return;
          }
          if (selectedReplacementTargetIds.has(requestedReplacement.replacementIngredientId)) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `The same replacement cannot be used twice on ${menuItem.name}`,
            });
            return;
          }
          selectedReplacementBySource.set(requestedReplacement.sourceIngredientId, replacement);
          selectedReplacementTargetIds.add(requestedReplacement.replacementIngredientId);
        }

        for (const ingredientId of requestedItem.addedIngredientIds) {
          const includedIngredient = rules.includedById.get(ingredientId);
          if (includedIngredient) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `${includedIngredient.ingredient_name} is already in ${menuItem.name}; use Extra instead`,
            });
            return;
          }

          if (selectedReplacementTargetIds.has(ingredientId)) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: "A replacement cannot also be added separately",
            });
            return;
          }

          const ingredient = rules.addableById.get(ingredientId);
          if (!ingredient || !ingredient.is_active) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: "One or more added ingredients are not configured for ADD",
            });
            return;
          }
        }

        const selectedOptions = new Set(requestedItem.choiceOptionIds);
        const choiceByOptionId = new Map(
          rules.choiceRows.map((row) => [row.option_id, row]),
        );

        for (const optionId of selectedOptions) {
          const choice = choiceByOptionId.get(optionId);
          if (!choice) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `One or more choices are unavailable for ${menuItem.name}`,
            });
            return;
          }

          if (
            choice.target_preparation_option_id !== null &&
            !rules.preparationByOptionId.has(choice.target_preparation_option_id)
          ) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `That preparation choice is unavailable for ${menuItem.name}`,
            });
            return;
          }
        }

        const unavailableChoiceOptionIds = new Set(
          activeRuntimeRules.flatMap((rule) =>
            rule.target.kind === "choice_option" &&
            rule.target.offeringId === menuItem.id &&
            rule.effect.kind === "availability" &&
            rule.effect.available === false
              ? [rule.target.optionId]
              : [],
          ),
        );

        if (
          Array.from(selectedOptions).some((optionId) =>
            unavailableChoiceOptionIds.has(optionId),
          )
        ) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: `One or more choices are currently unavailable for ${menuItem.name}`,
          });
          return;
        }

        const selectedChoiceIngredientIds = Array.from(selectedOptions)
          .map((optionId) => choiceByOptionId.get(optionId)?.ingredient_id ?? null)
          .filter((ingredientId): ingredientId is string => ingredientId !== null);

        if (
          new Set(selectedChoiceIngredientIds).size !==
          selectedChoiceIngredientIds.length
        ) {
          await client.query("ROLLBACK");
          response.status(409).json({
            error: `The same ingredient cannot be selected twice for ${menuItem.name}`,
          });
          return;
        }

        for (const ingredientId of requestedItem.addedIngredientIds) {
          if (selectedChoiceIngredientIds.includes(ingredientId)) {
            const ingredient = rules.addableById.get(ingredientId);
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `${ingredient?.ingredient_name ?? "That ingredient"} is already selected for ${menuItem.name}`,
            });
            return;
          }
        }

        const groups = new Map<
          string,
          { label: string; min: number; max: number | null; optionIds: string[] }
        >();

        for (const row of rules.choiceRows) {
          const current = groups.get(row.group_id);
          if (current) {
            current.optionIds.push(row.option_id);
          } else {
            groups.set(row.group_id, {
              label: row.group_label,
              min: row.min_selections,
              max: row.max_selections,
              optionIds: [row.option_id],
            });
          }
        }

        const effectiveGroups = new Map(
          resolveChoiceCardinalities(
            Array.from(groups.entries()).map(([id, group]) => ({
              id,
              minSelections: group.min,
              maxSelections: group.max,
            })),
            rules.choiceConstraints,
            selectedOptions,
          ).map((group) => [group.id, group]),
        );

        for (const [groupId, group] of groups) {
          const effective = effectiveGroups.get(groupId);

          if (!effective) {
            throw new Error(`Missing effective choice state for ${groupId}`);
          }

          const selectedCount = group.optionIds.filter((id) =>
            selectedOptions.has(id),
          ).length;

          if (!effective.isActive && selectedCount > 0) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `${group.label} is not active for ${menuItem.name}`,
            });
            return;
          }

          if (selectedCount < effective.minSelections) {
            const prompt = /^choose\b/i.test(group.label)
              ? group.label
              : `Choose ${group.label}`;
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `${prompt} for ${menuItem.name}`,
            });
            return;
          }
          if (
            effective.maxSelections !== null &&
            selectedCount > effective.maxSelections
          ) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `Too many selections in ${group.label} for ${menuItem.name}`,
            });
            return;
          }
        }

        const selectedPreparationTargets = new Set<string>();

        for (const selection of requestedItem.preparationSelections) {
          const preparation = rules.preparationByOptionId.get(selection.preparationOptionId);
          if (!preparation) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `That preparation option is unavailable for ${menuItem.name}`,
            });
            return;
          }

          if (selection.ingredientId) {
            const ingredient = rules.includedById.get(selection.ingredientId);
            const selectedReplacement = Array.from(selectedReplacementBySource.values()).find(
              (replacement) => replacement.replacement_ingredient_id === selection.ingredientId,
            );
            const expectedSchemeId = selectedReplacement?.preparation_scheme_id
              ?? (ingredient && !selectedReplacementBySource.has(selection.ingredientId)
                ? ingredient.preparation_scheme_id
                : null);
            if (
              expectedSchemeId === null ||
              expectedSchemeId !== preparation.preparation_scheme_id ||
              requestedItem.removedIngredientIds.includes(selection.ingredientId)
            ) {
              await client.query("ROLLBACK");
              response.status(409).json({
                error: `That preparation does not apply to ${menuItem.name}`,
              });
              return;
            }
            selectedPreparationTargets.add(`ingredient:${selection.ingredientId}`);
          } else if (selection.choiceOptionId) {
            const choice = choiceByOptionId.get(selection.choiceOptionId);
            if (
              !choice ||
              !selectedOptions.has(selection.choiceOptionId) ||
              choice.preparation_scheme_id === null ||
              choice.preparation_scheme_id !== preparation.preparation_scheme_id
            ) {
              await client.query("ROLLBACK");
              response.status(409).json({
                error: `That preparation does not apply to the selected choice for ${menuItem.name}`,
              });
              return;
            }
            selectedPreparationTargets.add(`choice:${selection.choiceOptionId}`);
          }
        }

        for (const ingredient of rules.includedById.values()) {
          if (
            ingredient.preparation_scheme_id !== null &&
            !requestedItem.removedIngredientIds.includes(ingredient.ingredient_id) &&
            !selectedReplacementBySource.has(ingredient.ingredient_id) &&
            !selectedPreparationTargets.has(`ingredient:${ingredient.ingredient_id}`)
          ) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `Choose preparation for ${ingredient.ingredient_name} on ${menuItem.name}`,
            });
            return;
          }
        }

        for (const replacement of selectedReplacementBySource.values()) {
          if (
            replacement.preparation_scheme_id !== null &&
            !selectedPreparationTargets.has(`ingredient:${replacement.replacement_ingredient_id}`)
          ) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `Choose preparation for ${replacement.replacement_ingredient_name} on ${menuItem.name}`,
            });
            return;
          }
        }

        for (const optionId of selectedOptions) {
          const choice = choiceByOptionId.get(optionId);
          if (
            choice?.preparation_scheme_id &&
            !selectedPreparationTargets.has(`choice:${optionId}`)
          ) {
            await client.query("ROLLBACK");
            response.status(409).json({
              error: `Choose preparation for ${choice.option_label} on ${menuItem.name}`,
            });
            return;
          }
        }
      }

      const orderResult = await client.query<OrderRow>(
        `
          INSERT INTO orders (
            party_id,
            fulfillment_type,
            created_by_user_id,
            customer_name,
            customer_phone,
            requested_for,
            delivery_address
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING
            id,
            party_id,
            fulfillment_type,
            created_by_user_id,
            customer_name,
            customer_phone,
            requested_for,
            delivery_address,
            submitted_at,
            cancelled_at,
            cancelled_by_user_id,
            cancellation_reason,
            created_at
        `,
        [
          input.data.partyId,
          input.data.fulfillmentType,
          userId,
          input.data.customerName,
          input.data.customerPhone,
          input.data.requestedFor,
          input.data.deliveryAddress,
        ],
      );

      const orderRow = orderResult.rows[0];
      if (!orderRow) throw new Error("Order insert returned no record");

      await client.query(
        `
          INSERT INTO order_events (
            order_id,
            event_type,
            actor_kind,
            actor_user_id
          )
          VALUES ($1, 'submitted', 'user', $2)
        `,
        [orderRow.id, userId],
      );

      const orderItems: OrderItem[] = [];

      for (const requestedItem of input.data.items) {
        const menuItem = menuById.get(requestedItem.menuItemId);
        const rules = rulesByMenuItem.get(requestedItem.menuItemId);
        if (!menuItem || !rules) {
          throw new Error("Validated menu item disappeared");
        }

        const itemResult = await client.query<OrderItemRow>(
          `
            INSERT INTO order_items (
              order_id,
              menu_item_id,
              created_by_user_id,
              seat_number,
              item_name,
              unit_price,
              quantity,
              kitchen_note
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING
              id,
              menu_item_id,
              seat_number,
              item_name,
              unit_price,
              quantity,
              kitchen_note,
              status,
              submitted_at,
              fired_at,
              ready_at,
              fulfilled_at,
              voided_at,
              voided_by_user_id,
              void_reason
          `,
          [
            orderRow.id,
            menuItem.id,
            userId,
            requestedItem.seatNumber,
            menuItem.name,
            menuItem.price,
            requestedItem.quantity,
            requestedItem.kitchenNote,
          ],
        );

        const itemRow = itemResult.rows[0];
        if (!itemRow) throw new Error("Order item insert returned no record");

        await client.query(
          `
            INSERT INTO order_item_events (
              order_item_id,
              event_type,
              actor_kind,
              actor_user_id
            )
            VALUES ($1, 'submitted', 'user', $2)
          `,
          [itemRow.id, userId],
        );

        const ingredientChanges: OrderItemIngredientChange[] = [];
        const changeSets = [
          ["remove", requestedItem.removedIngredientIds],
          ["side", requestedItem.sideIngredientIds],
          ["extra", requestedItem.extraIngredientIds],
          ["add", requestedItem.addedIngredientIds],
        ] as const;

        for (const [changeKind, ingredientIds] of changeSets) {
          for (const ingredientId of ingredientIds) {
            const ingredient =
              changeKind === "add"
                ? rules.addableById.get(ingredientId)
                : rules.includedById.get(ingredientId);
            if (!ingredient) {
              throw new Error("Validated ingredient disappeared");
            }

            const priceAdjustment =
              changeKind === "extra"
                ? Number(ingredient.extra_price)
                : changeKind === "add"
                  ? Number(ingredient.default_add_price)
                  : 0;

            const changeResult = await client.query<IngredientChangeRow>(
              `
                INSERT INTO order_item_ingredient_changes (
                  order_item_id,
                  ingredient_id,
                  change_kind,
                  ingredient_name,
                  price_adjustment,
                  price_configured,
                  allergen_flags
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING
                  id,
                  ingredient_id,
                  ingredient_name,
                  change_kind,
                  price_adjustment,
                  price_configured,
                  allergen_flags
              `,
              [
                itemRow.id,
                ingredient.ingredient_id,
                changeKind,
                ingredient.ingredient_name,
                priceAdjustment,
                changeKind === "remove" || changeKind === "side"
                  ? true
                  : changeKind === "extra"
                    ? ingredient.extra_price_configured
                    : ingredient.add_price_configured,
                ingredient.allergen_flags,
              ],
            );
            const row = changeResult.rows[0];
            if (!row) throw new Error("Ingredient change insert returned no record");
            ingredientChanges.push(toIngredientChange(row));
          }
        }

        const ingredientReplacements: OrderItemIngredientReplacement[] = [];
        for (const requestedReplacement of requestedItem.ingredientReplacements) {
          const replacement = rules.replacementsBySource
            .get(requestedReplacement.sourceIngredientId)
            ?.get(requestedReplacement.replacementIngredientId);
          if (!replacement) throw new Error("Validated replacement disappeared");

          const replacementResult = await client.query<IngredientReplacementRow>(
            `
              INSERT INTO order_item_ingredient_replacements (
                order_item_id,
                source_ingredient_id,
                replacement_ingredient_id,
                source_ingredient_name,
                replacement_ingredient_name,
                price_adjustment,
                price_configured,
                allergen_flags
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              RETURNING
                id,
                source_ingredient_id,
                replacement_ingredient_id,
                source_ingredient_name,
                replacement_ingredient_name,
                price_adjustment,
                price_configured,
                allergen_flags
            `,
            [
              itemRow.id,
              replacement.source_ingredient_id,
              replacement.replacement_ingredient_id,
              replacement.source_ingredient_name,
              replacement.replacement_ingredient_name,
              replacement.price_adjustment,
              replacement.price_adjustment_configured,
              replacement.replacement_allergen_flags,
            ],
          );
          const row = replacementResult.rows[0];
          if (!row) throw new Error("Ingredient replacement insert returned no record");
          ingredientReplacements.push(toIngredientReplacement(row));
        }

        const choiceSelections: OrderItemChoiceSelection[] = [];
        const choiceByOptionId = new Map(
          rules.choiceRows.map((row) => [row.option_id, row]),
        );

        for (const optionId of requestedItem.choiceOptionIds) {
          const choice = choiceByOptionId.get(optionId);
          if (!choice) throw new Error("Validated choice disappeared");

          const selectionResult = await client.query<ChoiceSelectionRow>(
            `
              INSERT INTO order_item_choice_selections (
                order_item_id,
                choice_group_id,
                choice_option_id,
                group_label,
                option_label,
                ingredient_id,
                price_adjustment
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING
                id,
                choice_group_id,
                choice_option_id,
                group_label,
                option_label,
                ingredient_id,
                price_adjustment
            `,
            [
              itemRow.id,
              choice.group_id,
              choice.option_id,
              choice.group_label,
              choice.option_label,
              choice.ingredient_id,
              choice.price_adjustment,
            ],
          );
          const row = selectionResult.rows[0];
          if (!row) throw new Error("Choice selection insert returned no record");
          choiceSelections.push(toChoiceSelection(row));
        }

        const preparationSelections: OrderItemPreparationSelection[] = [];
        const selectedReplacementBySourceForWrite = new Map<string, ReplacementRuleRow>();
        for (const requestedReplacement of requestedItem.ingredientReplacements) {
          const replacement = rules.replacementsBySource
            .get(requestedReplacement.sourceIngredientId)
            ?.get(requestedReplacement.replacementIngredientId);
          if (replacement) {
            selectedReplacementBySourceForWrite.set(
              requestedReplacement.sourceIngredientId,
              replacement,
            );
          }
        }

        const choiceByOptionIdForPreparation = new Map(
          rules.choiceRows.map((row) => [row.option_id, row]),
        );

        for (const selection of requestedItem.preparationSelections) {
          const preparation = rules.preparationByOptionId.get(selection.preparationOptionId);
          if (!preparation) throw new Error("Validated preparation disappeared");

          const ingredient = selection.ingredientId
            ? rules.includedById.get(selection.ingredientId)
            : null;
          const replacement = selection.ingredientId
            ? Array.from(selectedReplacementBySourceForWrite.values()).find(
                (candidate) => candidate.replacement_ingredient_id === selection.ingredientId,
              ) ?? null
            : null;
          const choice = selection.choiceOptionId
            ? choiceByOptionIdForPreparation.get(selection.choiceOptionId)
            : null;
          const targetLabel = replacement?.replacement_ingredient_name ?? ingredient?.ingredient_name ?? choice?.option_label;
          if (!targetLabel) throw new Error("Validated preparation target disappeared");

          const preparationResult = await client.query<PreparationSelectionRow>(
            `
              INSERT INTO order_item_preparation_selections (
                order_item_id,
                ingredient_id,
                choice_option_id,
                preparation_scheme_id,
                preparation_option_id,
                target_label,
                scheme_label,
                option_label
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              RETURNING
                id,
                ingredient_id,
                choice_option_id,
                preparation_scheme_id,
                preparation_option_id,
                target_label,
                scheme_label,
                option_label
            `,
            [
              itemRow.id,
              selection.ingredientId,
              selection.choiceOptionId,
              preparation.preparation_scheme_id,
              selection.preparationOptionId,
              targetLabel,
              preparation.scheme_label,
              preparation.option_label,
            ],
          );
          const row = preparationResult.rows[0];
          if (!row) throw new Error("Preparation selection insert returned no record");
          preparationSelections.push(toPreparationSelection(row));
        }

        orderItems.push(
          toOrderItem(
            itemRow,
            [],
            ingredientChanges,
            ingredientReplacements,
            choiceSelections,
            preparationSelections,
          ),
        );
      }

      if (
        input.data.fulfillmentType === "dine_in" &&
        input.data.partyId !== null &&
        partyStatus === "seated"
      ) {
        await client.query(
          `
            UPDATE parties
            SET status = 'in_service', status_changed_at = now()
            WHERE id = $1
          `,
          [input.data.partyId],
        );
        await client.query(
          `
            INSERT INTO party_events (
              party_id,
              event_type,
              actor_user_id
            )
            VALUES ($1, 'service_started', $2)
          `,
          [input.data.partyId, userId],
        );
      }

      await client.query("COMMIT");
      response.status(201).json(toOrder(orderRow, orderItems));
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/fire",
  requireAnyRole(
    "server",
    "lead_server",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);

    const input = fireOrderInputSchema.safeParse(request.body);

    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({
        error: "Invalid order ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid kitchen fire",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        id: string;
        cancelled_at: Date | null;
      }>(
        `
          SELECT id, cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      const orderRow = order.rows[0];

      if (!orderRow) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (orderRow.cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A cancelled order cannot be fired",
        });
        return;
      }

      const selectedItems = await client.query<{
        id: string;
        status: OrderItem["status"];
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        selectedItems.rowCount !==
        input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error:
            "One or more order items do not belong to this order",
        });
        return;
      }

      if (
        selectedItems.rows.some(
          (item) => item.status !== "submitted",
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only submitted items can be fired",
        });
        return;
      }

      const chitResult = await client.query<{
        id: string;
        chit_number: string;
        order_id: string;
        print_kind: "initial";
        printed_by_user_id: string;
        note: string | null;
        printed_at: Date;
        cancelled_at: Date | null;
      }>(
        `
          INSERT INTO kitchen_chits (
            order_id,
            print_kind,
            printed_by_user_id,
            note
          )
          VALUES ($1, 'initial', $2, $3)
          RETURNING
            id,
            chit_number,
            order_id,
            print_kind,
            printed_by_user_id,
            note,
            printed_at,
            cancelled_at
        `,
        [orderId.data, userId, input.data.note],
      );

      const chitRow = chitResult.rows[0];

      if (!chitRow) {
        throw new Error("Kitchen chit insert returned no record");
      }

      await client.query(
        `
          INSERT INTO kitchen_chit_items (
            kitchen_chit_id,
            order_id,
            order_item_id,
            display_order
          )
          SELECT
            $1,
            $2,
            selected.order_item_id,
            (selected.position - 1)::integer
          FROM unnest($3::uuid[]) WITH ORDINALITY
            AS selected(order_item_id, position)
        `,
        [
          chitRow.id,
          orderId.data,
          input.data.orderItemIds,
        ],
      );

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'fired',
            fired_at = now()
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
        `,
        [orderId.data, input.data.orderItemIds],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_user_id
          )
          SELECT
            selected.order_item_id,
            'fired',
            'user',
            $2
          FROM unnest($1::uuid[])
            AS selected(order_item_id)
        `,
        [input.data.orderItemIds, userId],
      );

      await client.query(
        `
          INSERT INTO kitchen_chit_events (
            kitchen_chit_id,
            event_type,
            actor_user_id
          )
          VALUES ($1, 'printed', $2)
        `,
        [chitRow.id, userId],
      );

      await client.query("COMMIT");

      const chit: KitchenChit = {
        id: chitRow.id,
        chitNumber: Number(chitRow.chit_number),
        orderId: chitRow.order_id,
        printKind: chitRow.print_kind,
        printedByUserId: chitRow.printed_by_user_id,
        note: chitRow.note,
        printedAt: chitRow.printed_at.toISOString(),
        cancelledAt:
          chitRow.cancelled_at?.toISOString() ?? null,
        items: input.data.orderItemIds.map(
          (orderItemId, displayOrder) => ({
            orderItemId,
            displayOrder,
          }),
        ),
      };

      response.status(201).json(chit);
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/ready",
  requireAnyRole(
    "chef",
    "head_chef",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);

    const input =
      markKitchenItemsReadyInputSchema.safeParse(request.body);

    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({
        error: "Invalid order ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid ready action",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      const currentOrder = order.rows[0];

      if (!currentOrder) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (currentOrder.cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A cancelled order cannot be marked ready",
        });
        return;
      }

      const selectedItems = await client.query<{
        id: string;
        status: OrderItem["status"];
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        selectedItems.rowCount !==
        input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error:
            "One or more order items do not belong to this order",
        });
        return;
      }

      if (
        selectedItems.rows.some(
          (item) => item.status !== "fired",
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only fired items can be marked ready",
        });
        return;
      }

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'ready',
            ready_at = now()
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
        `,
        [orderId.data, input.data.orderItemIds],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_user_id
          )
          SELECT
            selected.order_item_id,
            'ready',
            'user',
            $2
          FROM unnest($1::uuid[])
            AS selected(order_item_id)
        `,
        [input.data.orderItemIds, userId],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/deliver",
  requireAnyRole(
    "server",
    "lead_server",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);

    const input =
      deliverOrderItemsInputSchema.safeParse(request.body);

    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({
        error: "Invalid order ID",
      });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid delivery action",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      const currentOrder = order.rows[0];

      if (!currentOrder) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (currentOrder.cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "A cancelled order cannot be delivered",
        });
        return;
      }

      const selectedItems = await client.query<{
        id: string;
        status: OrderItem["status"];
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        selectedItems.rowCount !==
        input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(400).json({
          error:
            "One or more order items do not belong to this order",
        });
        return;
      }

      if (
        selectedItems.rows.some(
          (item) => item.status !== "ready",
        )
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Only ready items can be delivered",
        });
        return;
      }

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'fulfilled',
            fulfilled_at = now()
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
        `,
        [orderId.data, input.data.orderItemIds],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_user_id
          )
          SELECT
            selected.order_item_id,
            'fulfilled',
            'user',
            $2
          FROM unnest($1::uuid[])
            AS selected(order_item_id)
        `,
        [input.data.orderItemIds, userId],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/cancel",
  requireAnyRole(
    "lead_server",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);
    const input = cancelOrderInputSchema.safeParse(
      request.body,
    );
    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({ error: "Invalid order ID" });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid cancellation",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      if (!order.rows[0]) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (order.rows[0].cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Order is already cancelled",
        });
        return;
      }

      const checkedItems = await client.query<{ id: string }>(
        `
          SELECT check_items.id
          FROM check_items
          JOIN order_items
            ON order_items.id = check_items.order_item_id
          WHERE order_items.order_id = $1
          LIMIT 1
        `,
        [orderId.data],
      );

      if (checkedItems.rows[0]) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error:
            "An order cannot be cancelled after items are checked",
        });
        return;
      }

      const voidedItems = await client.query<{ id: string }>(
        `
          UPDATE order_items
          SET
            status = 'voided',
            voided_at = now(),
            voided_by_user_id = $2,
            void_reason = $3
          WHERE order_id = $1
            AND status <> 'voided'
          RETURNING id
        `,
        [orderId.data, userId, input.data.reason],
      );

      if (voidedItems.rows.length > 0) {
        await client.query(
          `
            INSERT INTO order_item_events (
              order_item_id,
              event_type,
              actor_kind,
              actor_user_id,
              reason
            )
            SELECT
              unnest($1::uuid[]),
              'voided',
              'user',
              $2,
              $3
          `,
          [
            voidedItems.rows.map((item) => item.id),
            userId,
            input.data.reason,
          ],
        );
      }

      await client.query(
        `
          UPDATE orders
          SET
            cancelled_at = now(),
            cancelled_by_user_id = $2,
            cancellation_reason = $3
          WHERE id = $1
        `,
        [orderId.data, userId, input.data.reason],
      );

      await client.query(
        `
          INSERT INTO order_events (
            order_id,
            event_type,
            actor_kind,
            actor_user_id,
            reason
          )
          VALUES ($1, 'cancelled', 'user', $2, $3)
        `,
        [orderId.data, userId, input.data.reason],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);

ordersRouter.post(
  "/:orderId/void",
  requireAnyRole(
    "lead_server",
    "manager",
    "admin",
  ),
  async (request, response) => {
    const orderId = z
      .string()
      .uuid()
      .safeParse(request.params.orderId);
    const input = voidOrderItemsInputSchema.safeParse(
      request.body,
    );
    const userId = getAuthenticatedUser(request).id;

    if (!orderId.success) {
      response.status(400).json({ error: "Invalid order ID" });
      return;
    }

    if (!input.success) {
      response.status(400).json({
        error: "Invalid item void",
        issues: input.error.issues,
      });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const user = await client.query<{ id: string }>(
        `
          SELECT id
          FROM users
          WHERE id = $1
            AND is_active = true
        `,
        [userId],
      );

      if (!user.rows[0]) {
        await client.query("ROLLBACK");
        response.status(403).json({
          error: "Active user not found",
        });
        return;
      }

      const order = await client.query<{
        cancelled_at: Date | null;
      }>(
        `
          SELECT cancelled_at
          FROM orders
          WHERE id = $1
          FOR UPDATE
        `,
        [orderId.data],
      );

      if (!order.rows[0]) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error: "Order not found",
        });
        return;
      }

      if (order.rows[0].cancelled_at !== null) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "Items cannot be voided on a cancelled order",
        });
        return;
      }

      const items = await client.query<{
        id: string;
        status: string;
      }>(
        `
          SELECT id, status
          FROM order_items
          WHERE order_id = $1
            AND id = ANY($2::uuid[])
          FOR UPDATE
        `,
        [orderId.data, input.data.orderItemIds],
      );

      if (
        items.rows.length !== input.data.orderItemIds.length
      ) {
        await client.query("ROLLBACK");
        response.status(404).json({
          error:
            "One or more order items were not found on this order",
        });
        return;
      }

      if (
        items.rows.some((item) => item.status === "voided")
      ) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error: "An order item is already voided",
        });
        return;
      }

      const checkedItems = await client.query<{ id: string }>(
        `
          SELECT id
          FROM check_items
          WHERE order_item_id = ANY($1::uuid[])
          LIMIT 1
        `,
        [input.data.orderItemIds],
      );

      if (checkedItems.rows[0]) {
        await client.query("ROLLBACK");
        response.status(409).json({
          error:
            "An item cannot be voided after it is placed on a check",
        });
        return;
      }

      await client.query(
        `
          UPDATE order_items
          SET
            status = 'voided',
            voided_at = now(),
            voided_by_user_id = $2,
            void_reason = $3
          WHERE id = ANY($1::uuid[])
        `,
        [
          input.data.orderItemIds,
          userId,
          input.data.reason,
        ],
      );

      await client.query(
        `
          INSERT INTO order_item_events (
            order_item_id,
            event_type,
            actor_kind,
            actor_user_id,
            reason
          )
          SELECT
            unnest($1::uuid[]),
            'voided',
            'user',
            $2,
            $3
        `,
        [
          input.data.orderItemIds,
          userId,
          input.data.reason,
        ],
      );

      await client.query("COMMIT");
      response.status(204).send();
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
);
