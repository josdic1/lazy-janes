import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

type Fixture = Awaited<ReturnType<typeof createFixture>>;

async function createFixture() {
  const userId = randomUUID();
  const menuItemId = randomUUID();
  const includedIngredientId = randomUUID();
  const secondIncludedIngredientId = randomUUID();
  const replacementIngredientId = randomUUID();
  const sourceGroupId = randomUUID();
  const sourceOptionId = randomUUID();
  const targetGroupId = randomUUID();
  const targetOptionId = randomUUID();
  const disposableGroupId = randomUUID();
  const disposableOptionId = randomUUID();
  const constraintId = randomUUID();
  const ruleId = randomUUID();
  const ruleSourceKey = `menu-save-test-${randomUUID()}`;

  const agent = await createAuthenticatedTestUser({
    userId,
    displayName: `Menu Save Test Manager ${userId.slice(0, 8)}`,
    roles: ["manager"],
  });

  const category = await pool.query<{ id: string }>(`
    SELECT id
    FROM menu_categories
    WHERE is_active = true
    ORDER BY sort_order, name
    LIMIT 1
  `);
  const preparation = await pool.query<{ id: string }>(`
    SELECT preparation_options.id
    FROM preparation_options
    JOIN preparation_schemes
      ON preparation_schemes.id = preparation_options.preparation_scheme_id
    WHERE preparation_options.is_active = true
      AND preparation_schemes.is_active = true
    ORDER BY preparation_schemes.sort_order, preparation_options.sort_order
    LIMIT 1
  `);

  const categoryId = category.rows[0]?.id;
  const targetPreparationOptionId = preparation.rows[0]?.id;
  if (!categoryId || !targetPreparationOptionId) {
    throw new Error("Menu save checks require an active category and preparation option");
  }

  await pool.query(
    `
      INSERT INTO ingredients (id, name, is_active, is_addable)
      VALUES
        ($1, $4, true, true),
        ($2, $5, true, true),
        ($3, $6, true, true)
    `,
    [
      includedIngredientId,
      secondIncludedIngredientId,
      replacementIngredientId,
      `Menu Save Included ${includedIngredientId}`,
      `Menu Save Second ${secondIncludedIngredientId}`,
      `Menu Save Replacement ${replacementIngredientId}`,
    ],
  );

  await pool.query(
    `
      INSERT INTO menu_items (
        id, name, category_id, price, price_configured, status, is_modifier
      )
      VALUES ($1, $2, $3, 10, true, 'available', false)
    `,
    [menuItemId, `Menu Save Test Item ${menuItemId}`, categoryId],
  );

  await pool.query(
    `
      INSERT INTO menu_item_ingredients (
        menu_item_id, ingredient_id, role, umo_role, relationship,
        can_remove, can_side, can_extra, can_replace,
        replacement_options_configured, extra_price,
        extra_price_configured, sort_order
      )
      VALUES
        ($1, $2, 'other', 'primary', 'contains', false, false, false,
          true, true, 0, true, 0),
        ($1, $3, 'other', 'topping', 'contains', true, false, false,
          false, false, 0, true, 1)
    `,
    [menuItemId, includedIngredientId, secondIncludedIngredientId],
  );

  await pool.query(
    `
      INSERT INTO menu_item_ingredient_replacements (
        menu_item_id, source_ingredient_id, replacement_ingredient_id,
        price_adjustment, price_adjustment_configured, sort_order
      )
      VALUES ($1, $2, $3, 1.25, true, 0)
    `,
    [menuItemId, includedIngredientId, replacementIngredientId],
  );

  await pool.query(
    `
      INSERT INTO menu_choice_groups (
        id, menu_item_id, label, role, relationship,
        min_selections, max_selections, sort_order
      )
      VALUES
        ($1, $4, 'Source Choice', 'other', 'contains', 1, 1, 0),
        ($2, $4, 'Target Choice', 'other', 'contains', 0, 1, 1),
        ($3, $4, 'Disposable Choice', 'other', 'contains', 0, 1, 2)
    `,
    [sourceGroupId, targetGroupId, disposableGroupId, menuItemId],
  );

  await pool.query(
    `
      INSERT INTO menu_choice_options (
        id, choice_group_id, label, target_preparation_option_id,
        price_adjustment, price_adjustment_configured, sort_order, is_default
      )
      VALUES
        ($1, $4, 'Source Option', $7, 0, true, 0, true),
        ($2, $5, 'Target Option', NULL, 0, true, 0, false),
        ($3, $6, 'Disposable Option', NULL, 0, true, 0, false)
    `,
    [
      sourceOptionId,
      targetOptionId,
      disposableOptionId,
      sourceGroupId,
      targetGroupId,
      disposableGroupId,
      targetPreparationOptionId,
    ],
  );

  await pool.query(
    `
      INSERT INTO menu_choice_constraints (
        id, menu_item_id, source_choice_group_id, source_choice_option_id,
        target_choice_group_id, min_selections, max_selections, label
      )
      VALUES ($1, $2, $3, $4, $5, 1, 1, 'Dependent choice')
    `,
    [constraintId, menuItemId, sourceGroupId, sourceOptionId, targetGroupId],
  );

  await pool.query(
    `
      INSERT INTO menu_rules (
        id, source_key, target_kind, choice_option_id,
        condition_kind, local_time_before,
        effect_kind, availability, evidence_kind
      )
      VALUES (
        $1, $2, 'choice_option', $3,
        'local_time', '23:59', 'availability', true, 'explicit'
      )
    `,
    [ruleId, ruleSourceKey, sourceOptionId],
  );

  await pool.query(
    `
      INSERT INTO menu_item_additions (
        menu_item_id, ingredient_id, sort_order, is_active,
        price_adjustment, price_configured
      )
      VALUES ($1, $2, 0, true, 2.50, true)
    `,
    [menuItemId, replacementIngredientId],
  );

  const body = {
    ingredients: [
      {
        ingredientId: includedIngredientId,
        role: "other",
        contextualRole: "primary",
        relationship: "contains",
        preparationSchemeId: null,
        canRemove: false,
        canSide: false,
        canExtra: false,
        canReplace: true,
        replacementOptionsConfigured: true,
        extraPrice: 0,
        extraPriceConfigured: true,
        sortOrder: 0,
      },
      {
        ingredientId: secondIncludedIngredientId,
        role: "other",
        contextualRole: "topping",
        relationship: "contains",
        preparationSchemeId: null,
        canRemove: true,
        canSide: false,
        canExtra: false,
        canReplace: false,
        replacementOptionsConfigured: false,
        extraPrice: 0,
        extraPriceConfigured: true,
        sortOrder: 1,
      },
    ],
    replacements: [
      {
        sourceIngredientId: includedIngredientId,
        replacementIngredientId,
        preparationSchemeId: null,
        priceAdjustment: 1.25,
        priceAdjustmentConfigured: true,
        sortOrder: 0,
      },
    ],
    choiceGroups: [
      {
        id: sourceGroupId,
        label: "Source Choice",
        role: "other",
        relationship: "contains",
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 0,
        options: [
          {
            id: sourceOptionId,
            label: "Source Option",
            ingredientId: null,
            preparationSchemeId: null,
            targetPreparationOptionId,
            isNoneOption: false,
            priceAdjustment: 0,
            priceAdjustmentConfigured: true,
            sortOrder: 0,
            isDefault: true,
          },
        ],
      },
      {
        id: targetGroupId,
        label: "Target Choice",
        role: "other",
        relationship: "contains",
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 1,
        options: [
          {
            id: targetOptionId,
            label: "Target Option",
            ingredientId: null,
            preparationSchemeId: null,
            targetPreparationOptionId: null,
            isNoneOption: false,
            priceAdjustment: 0,
            priceAdjustmentConfigured: true,
            sortOrder: 0,
            isDefault: false,
          },
        ],
      },
      {
        id: disposableGroupId,
        label: "Disposable Choice",
        role: "other",
        relationship: "contains",
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 2,
        options: [
          {
            id: disposableOptionId,
            label: "Disposable Option",
            ingredientId: null,
            preparationSchemeId: null,
            targetPreparationOptionId: null,
            isNoneOption: false,
            priceAdjustment: 0,
            priceAdjustmentConfigured: true,
            sortOrder: 0,
            isDefault: false,
          },
        ],
      },
    ],
  };

  return {
    agent,
    body,
    userId,
    menuItemId,
    includedIngredientId,
    secondIncludedIngredientId,
    replacementIngredientId,
    sourceGroupId,
    sourceOptionId,
    targetGroupId,
    targetOptionId,
    disposableGroupId,
    disposableOptionId,
    constraintId,
    ruleId,
    targetPreparationOptionId,
  };
}

async function cleanupFixture(fixture: Fixture) {
  await pool.query("DELETE FROM menu_items WHERE id = $1", [fixture.menuItemId]);
  await pool.query("DELETE FROM ingredients WHERE id = ANY($1::uuid[])", [[
    fixture.includedIngredientId,
    fixture.secondIncludedIngredientId,
    fixture.replacementIngredientId,
  ]]);
  await deleteAuthenticatedTestUser(fixture.userId);
}

afterAll(async () => {
  await pool.end();
});

describe("PUT /api/menu/:itemId/customization safe saves", () => {
  it("preserves stable IDs and adjacent canonical truth during an unrelated edit", async () => {
    const fixture = await createFixture();

    try {
      const response = await fixture.agent
        .put(`/api/menu/${fixture.menuItemId}/customization`)
        .send({
          ...fixture.body,
          ingredients: fixture.body.ingredients.map((ingredient, index) =>
            index === 0 ? { ...ingredient, canRemove: true } : ingredient,
          ),
        });

      expect(response.status).toBe(200);

      const groups = await pool.query<{ id: string }>(
        "SELECT id FROM menu_choice_groups WHERE menu_item_id = $1 ORDER BY id",
        [fixture.menuItemId],
      );
      expect(groups.rows.map((row) => row.id)).toEqual(
        [fixture.sourceGroupId, fixture.targetGroupId, fixture.disposableGroupId].sort(),
      );

      const options = await pool.query<{
        id: string;
        target_preparation_option_id: string | null;
      }>(
        `
          SELECT id, target_preparation_option_id
          FROM menu_choice_options
          WHERE choice_group_id = ANY($1::uuid[])
          ORDER BY id
        `,
        [[fixture.sourceGroupId, fixture.targetGroupId, fixture.disposableGroupId]],
      );
      expect(options.rows.map((row) => row.id)).toEqual(
        [fixture.sourceOptionId, fixture.targetOptionId, fixture.disposableOptionId].sort(),
      );
      expect(
        options.rows.find((row) => row.id === fixture.sourceOptionId)
          ?.target_preparation_option_id,
      ).toBe(fixture.targetPreparationOptionId);

      const adjacentTruth = await pool.query<{
        constraint_exists: boolean;
        rule_exists: boolean;
        addition_exists: boolean;
        replacement_exists: boolean;
      }>(
        `
          SELECT
            EXISTS (SELECT 1 FROM menu_choice_constraints WHERE id = $1) AS constraint_exists,
            EXISTS (SELECT 1 FROM menu_rules WHERE id = $2) AS rule_exists,
            EXISTS (
              SELECT 1 FROM menu_item_additions
              WHERE menu_item_id = $3 AND ingredient_id = $4
            ) AS addition_exists,
            EXISTS (
              SELECT 1 FROM menu_item_ingredient_replacements
              WHERE menu_item_id = $3
                AND source_ingredient_id = $5
                AND replacement_ingredient_id = $4
            ) AS replacement_exists
        `,
        [
          fixture.constraintId,
          fixture.ruleId,
          fixture.menuItemId,
          fixture.replacementIngredientId,
          fixture.includedIngredientId,
        ],
      );
      expect(adjacentTruth.rows[0]).toEqual({
        constraint_exists: true,
        rule_exists: true,
        addition_exists: true,
        replacement_exists: true,
      });
    } finally {
      await cleanupFixture(fixture);
    }
  });

  it("removes only a choice group and option intentionally omitted from the draft", async () => {
    const fixture = await createFixture();

    try {
      const response = await fixture.agent
        .put(`/api/menu/${fixture.menuItemId}/customization`)
        .send({
          ...fixture.body,
          choiceGroups: fixture.body.choiceGroups.filter(
            (group) => group.id !== fixture.disposableGroupId,
          ),
        });

      expect(response.status).toBe(200);

      const removed = await pool.query<{
        group_exists: boolean;
        option_exists: boolean;
        constraint_exists: boolean;
        rule_exists: boolean;
      }>(
        `
          SELECT
            EXISTS (SELECT 1 FROM menu_choice_groups WHERE id = $1) AS group_exists,
            EXISTS (SELECT 1 FROM menu_choice_options WHERE id = $2) AS option_exists,
            EXISTS (SELECT 1 FROM menu_choice_constraints WHERE id = $3) AS constraint_exists,
            EXISTS (SELECT 1 FROM menu_rules WHERE id = $4) AS rule_exists
        `,
        [
          fixture.disposableGroupId,
          fixture.disposableOptionId,
          fixture.constraintId,
          fixture.ruleId,
        ],
      );

      expect(removed.rows[0]).toEqual({
        group_exists: false,
        option_exists: false,
        constraint_exists: true,
        rule_exists: true,
      });
    } finally {
      await cleanupFixture(fixture);
    }
  });

  it("rolls back every earlier mutation when final publish validation fails", async () => {
    const fixture = await createFixture();

    try {
      const response = await fixture.agent
        .put(`/api/menu/${fixture.menuItemId}/customization`)
        .send({
          ...fixture.body,
          ingredients: fixture.body.ingredients.map((ingredient, index) =>
            index === 0
              ? { ...ingredient, contextualRole: null, canSide: true }
              : ingredient,
          ),
          choiceGroups: fixture.body.choiceGroups
            .filter((group) => group.id !== fixture.disposableGroupId)
            .map((group, index) =>
              index === 0 ? { ...group, label: "Changed Before Rollback" } : group,
            ),
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain("incomplete food structure");

      const component = await pool.query<{ can_side: boolean }>(
        `
          SELECT can_side
          FROM menu_item_ingredients
          WHERE menu_item_id = $1 AND ingredient_id = $2
        `,
        [fixture.menuItemId, fixture.includedIngredientId],
      );
      expect(component.rows[0]?.can_side).toBe(false);

      const groups = await pool.query<{ id: string; label: string }>(
        `
          SELECT id, label
          FROM menu_choice_groups
          WHERE menu_item_id = $1
          ORDER BY id
        `,
        [fixture.menuItemId],
      );
      expect(groups.rows).toEqual(
        [
          { id: fixture.sourceGroupId, label: "Source Choice" },
          { id: fixture.targetGroupId, label: "Target Choice" },
          { id: fixture.disposableGroupId, label: "Disposable Choice" },
        ].sort((a, b) => a.id.localeCompare(b.id)),
      );

      const dependentTruth = await pool.query<{
        constraint_exists: boolean;
        rule_exists: boolean;
        addition_exists: boolean;
      }>(
        `
          SELECT
            EXISTS (SELECT 1 FROM menu_choice_constraints WHERE id = $1) AS constraint_exists,
            EXISTS (SELECT 1 FROM menu_rules WHERE id = $2) AS rule_exists,
            EXISTS (
              SELECT 1 FROM menu_item_additions
              WHERE menu_item_id = $3 AND ingredient_id = $4
            ) AS addition_exists
        `,
        [
          fixture.constraintId,
          fixture.ruleId,
          fixture.menuItemId,
          fixture.replacementIngredientId,
        ],
      );
      expect(dependentTruth.rows[0]).toEqual({
        constraint_exists: true,
        rule_exists: true,
        addition_exists: true,
      });
    } finally {
      await cleanupFixture(fixture);
    }
  });
});
