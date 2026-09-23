import type { Request, Response } from "express";
import { Router } from "express";
import type { PoolClient } from "pg";
import {
  getAuthenticatedUser,
  requireAuthenticatedUser,
  requireRole,
} from "../auth/session.js";
import {
  clearAllExceptAdmin,
  isAdminPreloadKind,
  isAdminSamplePreset,
  loadSampleActivity,
  preloadAdminData,
} from "../adminData/adminDataService.js";
import { pool } from "../db/pool.js";

export const adminDataRouter = Router();

adminDataRouter.use(
  requireAuthenticatedUser,
  requireRole("admin"),
);

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
  return error instanceof Error ? error.message : "Unable to manage seed data";
}

async function runTransaction(
  response: Response,
  work: (client: PoolClient) => Promise<unknown>,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext('lazy_janes_admin_seed_data'))",
    );
    const result = await work(client);
    await client.query("COMMIT");
    response.json(result);
  } catch (error) {
    await client.query("ROLLBACK");
    response.status(errorStatus(error)).json({ error: errorMessage(error) });
  } finally {
    client.release();
  }
}

adminDataRouter.post("/reset", async (request: Request, response: Response) => {
  await runTransaction(response, (client) =>
    clearAllExceptAdmin(client, getAuthenticatedUser(request).id),
  );
});

adminDataRouter.post("/preload/:kind", async (request: Request, response: Response) => {
  const kindParam = request.params.kind;
  const kind = Array.isArray(kindParam) ? (kindParam[0] ?? "") : (kindParam ?? "");
  if (!isAdminPreloadKind(kind)) {
    response.status(400).json({ error: "Unknown preload" });
    return;
  }

  await runTransaction(response, (client) => preloadAdminData(client, kind));
});

adminDataRouter.post("/sample/:preset", async (request: Request, response: Response) => {
  const presetParam = request.params.preset;
  const preset = Array.isArray(presetParam) ? (presetParam[0] ?? "") : (presetParam ?? "");
  if (!isAdminSamplePreset(preset)) {
    response.status(400).json({ error: "Unknown sample activity" });
    return;
  }

  const anchorDate = typeof request.body?.anchorDate === "string"
    ? request.body.anchorDate
    : "";

  await runTransaction(response, (client) =>
    loadSampleActivity(client, {
      preset,
      anchorDate,
      adminUserId: getAuthenticatedUser(request).id,
    }),
  );
});
