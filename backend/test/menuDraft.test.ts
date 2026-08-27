import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { pool } from "../src/db/pool.js";
import {
  createAuthenticatedTestUser,
  deleteAuthenticatedTestUser,
} from "./helpers/auth.js";

afterAll(async () => {
  await pool.end();
});

describe("manual menu item draft publishing", () => {
  it("keeps a new item out of service until its UMO food structure is complete", async () => {
    const userId = randomUUID();
    let menuItemId: string | undefined;

    try {
      const agent = await createAuthenticatedTestUser({
        userId,
        displayName: "Menu Draft Test Manager",
        roles: ["manager"],
      });

      const categoryResult = await pool.query<{ id: string }>(`
        SELECT id
        FROM menu_categories
        WHERE is_active = true
        ORDER BY sort_order, name
        LIMIT 1
      `);
      const ingredientResult = await pool.query<{ id: string }>(`
        SELECT id
        FROM ingredients
        WHERE is_active = true
        ORDER BY sort_order, name
        LIMIT 1
      `);

      const categoryId = categoryResult.rows[0]?.id;
      const ingredientId = ingredientResult.rows[0]?.id;
      if (!categoryId || !ingredientId) {
        throw new Error("Draft menu test requires an active category and ingredient");
      }

      const createdResponse = await agent.post("/api/menu").send({
        name: `Draft UMO Item ${randomUUID()}`,
        categoryId,
        price: 10,
        status: "available",
      });

      expect(createdResponse.status).toBe(201);
      expect(createdResponse.body.status).toBe("draft");
      menuItemId = createdResponse.body.id as string;

      const blockedPublish = await agent
        .patch(`/api/menu/${menuItemId}`)
        .send({ status: "available" });

      expect(blockedPublish.status).toBe(409);
      expect(blockedPublish.body.error).toContain("food structure");

      const structureResponse = await agent
        .put(`/api/menu/${menuItemId}/customization`)
        .send({
          ingredients: [
            {
              ingredientId,
              role: "other",
              contextualRole: "primary",
              relationship: "contains",
              canRemove: false,
              canSide: false,
              canExtra: false,
              canReplace: false,
              replacementOptionsConfigured: false,
              extraPrice: 0,
              extraPriceConfigured: false,
              sortOrder: 0,
            },
          ],
          replacements: [],
          choiceGroups: [],
        });

      expect(structureResponse.status).toBe(200);

      const publishedResponse = await agent
        .patch(`/api/menu/${menuItemId}`)
        .send({ status: "available" });

      expect(publishedResponse.status).toBe(200);
      expect(publishedResponse.body.status).toBe("available");

      const invalidActiveEdit = await agent
        .put(`/api/menu/${menuItemId}/customization`)
        .send({
          ingredients: [
            {
              ingredientId,
              role: "other",
              contextualRole: null,
              relationship: "contains",
              canRemove: false,
              canSide: false,
              canExtra: false,
              canReplace: false,
              replacementOptionsConfigured: false,
              extraPrice: 0,
              extraPriceConfigured: false,
              sortOrder: 0,
            },
          ],
          replacements: [],
          choiceGroups: [],
        });

      expect(invalidActiveEdit.status).toBe(409);

      const normalizedResponse = await agent.get("/api/menu/normalized");
      expect(normalizedResponse.status).toBe(200);
      const offering = (normalizedResponse.body as Array<{
        id: string;
        components: Array<{ role: string | null; relationship: string | null }>;
      }>).find((candidate) => candidate.id === menuItemId);

      expect(offering).toBeDefined();
      expect(offering?.components[0]).toEqual(
        expect.objectContaining({
          role: "primary",
          relationship: "contains",
        }),
      );
    } finally {
      if (menuItemId) {
        await pool.query("DELETE FROM menu_items WHERE id = $1", [menuItemId]);
      }
      await deleteAuthenticatedTestUser(userId);
    }
  });
});
