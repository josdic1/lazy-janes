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

describe("admin safety override", () => {
  it("keeps normal menu editing clean and records every admin override", async () => {
    const managerId = randomUUID();
    const adminId = randomUUID();
    let menuItemId: string | undefined;

    try {
      const manager = await createAuthenticatedTestUser({
        userId: managerId,
        displayName: "Safety Test Manager",
        roles: ["manager"],
      });
      const admin = await createAuthenticatedTestUser({
        userId: adminId,
        displayName: "Safety Test Admin",
        roles: ["admin"],
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

      const createdResponse = await manager
        .post("/api/menu")
        .send({
          name: `Safety Test Item ${randomUUID()}`,
          categoryId,
          price: 12.5,
        });

      expect(createdResponse.status).toBe(201);
      const created = menuItemSchema.parse(createdResponse.body);
      menuItemId = created.id;
      expect(created.hasManualSafetyOverride).toBe(false);

      const normalPatch = await manager
        .patch(`/api/menu/${menuItemId}`)
        .send({
          safetyDeclarations: [
            {
              kind: "contains",
              allergenFlag: "milk",
              sortOrder: 10,
            },
          ],
        });
      expect(normalPatch.status).toBe(400);

      const managerOverride = await manager
        .put(`/api/menu/${menuItemId}/safety-override`)
        .send({
          declarations: [
            {
              kind: "contains",
              allergenFlag: "milk",
              sortOrder: 10,
            },
          ],
          reason: "Emergency test",
        });
      expect(managerOverride.status).toBe(403);

      await pool.query(
        `
          INSERT INTO menu_item_safety_declarations (
            menu_item_id,
            kind,
            allergen_flag,
            sort_order
          )
          VALUES ($1, 'contains', 'shellfish', 5)
        `,
        [menuItemId],
      );

      const adminOverride = await admin
        .put(`/api/menu/${menuItemId}/safety-override`)
        .send({
          declarations: [
            {
              kind: "cross_contact",
              allergenFlag: "wheat",
              sortOrder: 10,
            },
          ],
          reason: "Supplier warning",
        });

      expect(adminOverride.status).toBe(200);
      const overridden = menuItemSchema.parse(adminOverride.body);
      expect(overridden.hasManualSafetyOverride).toBe(true);
      expect(overridden.safetyDeclarations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            kind: "contains",
            allergenFlag: "shellfish",
            isManualOverride: false,
          }),
          expect.objectContaining({
            kind: "cross_contact",
            allergenFlag: "wheat",
            isManualOverride: true,
          }),
        ]),
      );

      const historyResponse = await admin.get(
        `/api/menu/${menuItemId}/safety-override-history`,
      );
      expect(historyResponse.status).toBe(200);
      expect(historyResponse.body).toEqual([
        expect.objectContaining({
          changedByUserId: adminId,
          changedByDisplayName: "Safety Test Admin",
          action: "set",
          reason: "Supplier warning",
          beforeDeclarations: [],
          afterDeclarations: [
            expect.objectContaining({
              kind: "cross_contact",
              allergenFlag: "wheat",
            }),
          ],
        }),
      ]);

      const clearedResponse = await admin
        .put(`/api/menu/${menuItemId}/safety-override`)
        .send({
          declarations: [],
          reason: "Supplier warning removed",
        });
      expect(clearedResponse.status).toBe(200);
      const cleared = menuItemSchema.parse(clearedResponse.body);
      expect(cleared.hasManualSafetyOverride).toBe(false);
      expect(cleared.safetyDeclarations).toEqual([
        expect.objectContaining({
          kind: "contains",
          allergenFlag: "shellfish",
          isManualOverride: false,
        }),
      ]);

      const auditRows = await pool.query<{
        action: string;
        reason: string;
        changed_by_user_id: string;
      }>(
        `
          SELECT action, reason, changed_by_user_id
          FROM menu_item_safety_override_audit
          WHERE menu_item_id = $1
          ORDER BY changed_at, id
        `,
        [menuItemId],
      );
      expect(auditRows.rows).toEqual([
        {
          action: "set",
          reason: "Supplier warning",
          changed_by_user_id: adminId,
        },
        {
          action: "cleared",
          reason: "Supplier warning removed",
          changed_by_user_id: adminId,
        },
      ]);
    } finally {
      if (menuItemId) {
        await pool.query("DELETE FROM menu_items WHERE id = $1", [menuItemId]);
      }
      await deleteAuthenticatedTestUser(managerId);
      await deleteAuthenticatedTestUser(adminId);
    }
  });
});
