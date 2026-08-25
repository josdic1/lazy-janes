import { randomUUID } from "node:crypto";
import { menuItemSchema } from "@lazy-janes/shared";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

afterAll(async () => {
  await pool.end();
});

describe("menu item safety declarations", () => {
  it("keeps authoritative item safety separate from ingredient allergen facts", async () => {
    const userId = randomUUID();
    let menuItemId: string | undefined;

    try {
      const agent = await createAuthenticatedTestUser({
        userId,
        displayName: "Menu Safety Test Manager",
        roles: ["manager"],
      });

      const category = await pool.query<{ id: string }>(`
        SELECT id
        FROM menu_categories
        WHERE is_active = true
        ORDER BY sort_order, name
        LIMIT 1
      `);
      const categoryId = category.rows[0]?.id;
      if (!categoryId) {
        throw new Error("Menu safety test requires an active category");
      }

      const createdResponse = await agent
        .post("/api/menu")
        .send({
          name: `Safety Test Item ${randomUUID()}`,
          categoryId,
          price: 12.5,
          safetyDeclarations: [
            {
              kind: "contains",
              allergenFlag: "shellfish",
              sortOrder: 10,
            },
            {
              kind: "may_contain",
              allergenFlag: "tree_nut",
              sortOrder: 20,
            },
            {
              kind: "shared_fryer",
              sortOrder: 30,
            },
          ],
        });

      expect(createdResponse.status).toBe(201);
      const created = menuItemSchema.parse(createdResponse.body);
      menuItemId = created.id;

      expect(created.safetyDeclarations).toEqual([
        expect.objectContaining({
          kind: "contains",
          allergenFlag: "shellfish",
        }),
        expect.objectContaining({
          kind: "may_contain",
          allergenFlag: "tree_nut",
        }),
        expect.objectContaining({
          kind: "shared_fryer",
          allergenFlag: null,
        }),
      ]);
      expect(createdResponse.body).not.toHaveProperty("allergenFlags");

      const stored = await pool.query<{
        kind: string;
        allergen_flag: string | null;
      }>(
        `
          SELECT kind, allergen_flag
          FROM menu_item_safety_declarations
          WHERE menu_item_id = $1
          ORDER BY sort_order, kind
        `,
        [menuItemId],
      );

      expect(stored.rows).toEqual([
        { kind: "contains", allergen_flag: "shellfish" },
        { kind: "may_contain", allergen_flag: "tree_nut" },
        { kind: "shared_fryer", allergen_flag: null },
      ]);

      const updatedResponse = await agent
        .patch(`/api/menu/${menuItemId}`)
        .send({
          safetyDeclarations: [
            {
              kind: "cross_contact",
              allergenFlag: "wheat",
              sortOrder: 10,
            },
          ],
        });

      expect(updatedResponse.status).toBe(200);
      const updated = menuItemSchema.parse(updatedResponse.body);
      expect(updated.safetyDeclarations).toEqual([
        expect.objectContaining({
          kind: "cross_contact",
          allergenFlag: "wheat",
        }),
      ]);

      const replaced = await pool.query<{
        kind: string;
        allergen_flag: string | null;
      }>(
        `
          SELECT kind, allergen_flag
          FROM menu_item_safety_declarations
          WHERE menu_item_id = $1
        `,
        [menuItemId],
      );
      expect(replaced.rows).toEqual([
        { kind: "cross_contact", allergen_flag: "wheat" },
      ]);
    } finally {
      if (menuItemId) {
        await pool.query("DELETE FROM menu_items WHERE id = $1", [menuItemId]);
      }
      await deleteAuthenticatedTestUser(userId);
    }
  });
});
