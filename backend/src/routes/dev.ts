import { Router, type NextFunction, type Request, type Response } from "express";
import { createSessionToken, hashSessionToken } from "../auth/security.js";
import {
  getAuthenticatedUser,
  requireAuthenticatedUser,
  requireRole,
  setSessionCookie,
} from "../auth/session.js";
import { pool } from "../db/pool.js";
import {
  clearDemoRun,
  createDemoRun,
  getActiveDemoRun,
  isDemoPreset,
  parseAnchorDate,
} from "../demo/scenarioService.js";
import { environment } from "../env.js";

export const devRouter = Router();

function errorStatus(error: unknown): number {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }
  return 500;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to manage demo data";
}

function requireDevelopment(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  if (environment.NODE_ENV !== "development") {
    response.status(404).json({ error: "Not found" });
    return;
  }
  next();
}

devRouter.get("/users", requireDevelopment, async (_request, response) => {
  const result = await pool.query<{
    id: string;
    display_name: string;
    roles: string[];
  }>(`
    SELECT
      u.id,
      u.display_name,
      COALESCE(
        array_agg(ur.role_code ORDER BY ur.role_code)
          FILTER (WHERE ur.role_code IS NOT NULL),
        ARRAY[]::text[]
      ) AS roles
    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    WHERE u.is_active = true
    GROUP BY u.id, u.display_name
    ORDER BY lower(u.display_name), u.id
  `);

  response.json(
    result.rows.map((row) => ({
      id: row.id,
      displayName: row.display_name,
      roles: row.roles,
    })),
  );
});

devRouter.post("/login", requireDevelopment, async (request, response) => {
  const userId = typeof request.body?.userId === "string" ? request.body.userId : "";
  if (!/^[0-9a-f-]{36}$/i.test(userId)) {
    response.status(400).json({ error: "Invalid development user" });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userResult = await client.query<{
      id: string;
      display_name: string;
      roles: string[];
    }>(
      `
        SELECT
          u.id,
          u.display_name,
          COALESCE(
            array_agg(ur.role_code ORDER BY ur.role_code)
              FILTER (WHERE ur.role_code IS NOT NULL),
            ARRAY[]::text[]
          ) AS roles
        FROM users u
        LEFT JOIN user_roles ur ON ur.user_id = u.id
        WHERE u.id = $1
          AND u.is_active = true
        GROUP BY u.id, u.display_name
      `,
      [userId],
    );
    const user = userResult.rows[0];
    if (!user) {
      await client.query("ROLLBACK");
      response.status(404).json({ error: "Development user not found" });
      return;
    }

    const token = createSessionToken();
    const tokenHash = hashSessionToken(token);
    const sessionResult = await client.query<{ id: string }>(
      `
        INSERT INTO user_sessions (user_id, token_hash, expires_at)
        VALUES ($1, $2, now() + interval '12 hours')
        RETURNING id
      `,
      [user.id, tokenHash],
    );
    const sessionId = sessionResult.rows[0]?.id;
    if (!sessionId) throw new Error("Unable to create development session");

    await client.query(
      `
        INSERT INTO user_auth_events (user_id, session_id, event_type)
        VALUES ($1, $2, 'login_succeeded')
      `,
      [user.id, sessionId],
    );
    await client.query("COMMIT");
    setSessionCookie(response, token);
    response.json({ id: user.id, displayName: user.display_name, roles: user.roles });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

devRouter.get(
  "/demo",
  requireAuthenticatedUser,
  requireRole("admin"),
  async (_request, response) => {
    const client = await pool.connect();
    try {
      response.json({ activeRun: await getActiveDemoRun(client) });
    } finally {
      client.release();
    }
  },
);

devRouter.post(
  "/demo/:preset",
  requireAuthenticatedUser,
  requireRole("admin"),
  async (request, response) => {
    const presetParam = request.params.preset;
    const preset = Array.isArray(presetParam) ? (presetParam[0] ?? "") : (presetParam ?? "");
    if (!isDemoPreset(preset)) {
      response.status(400).json({ error: "Unknown demo preset" });
      return;
    }

    let anchorDate: string;
    try {
      anchorDate = parseAnchorDate(request.body?.anchorDate);
    } catch (error) {
      response.status(errorStatus(error)).json({ error: errorMessage(error) });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const run = await createDemoRun(client, {
        preset,
        anchorDate,
        replaceActive: request.body?.replaceActive === true,
        createdByUserId: getAuthenticatedUser(request).id,
      });
      await client.query("COMMIT");
      response.status(201).json({ activeRun: run });
    } catch (error) {
      await client.query("ROLLBACK");
      response.status(errorStatus(error)).json({ error: errorMessage(error) });
    } finally {
      client.release();
    }
  },
);

devRouter.delete(
  "/demo/:runId",
  requireAuthenticatedUser,
  requireRole("admin"),
  async (request, response) => {
    const runIdParam = request.params.runId;
    const runId = Array.isArray(runIdParam) ? (runIdParam[0] ?? "") : (runIdParam ?? "");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(runId)) {
      response.status(400).json({ error: "Invalid demo run" });
      return;
    }
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const clearedRun = await clearDemoRun(client, runId);
      if (!clearedRun) {
        await client.query("ROLLBACK");
        response.status(404).json({ error: "Active demo run not found" });
        return;
      }
      await client.query("COMMIT");
      response.json({ clearedRun, activeRun: null });
    } catch (error) {
      await client.query("ROLLBACK");
      response.status(errorStatus(error)).json({ error: errorMessage(error) });
    } finally {
      client.release();
    }
  },
);
