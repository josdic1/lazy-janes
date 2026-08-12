import {
  createInitialAdminInputSchema,
  userLoginInputSchema,
  type UserIdentity,
  type UserLoginOption,
} from "@lazy-janes/shared";
import {
  Router,
  type Request,
  type Response,
} from "express";
import {
  createSessionToken,
  hashSessionToken,
  hashUserPin,
  verifyUserPin,
} from "../auth/security.js";
import { pool } from "../db/pool.js";
import { environment } from "../env.js";

export const authRouter = Router();


const SESSION_COOKIE_NAME = "lazy_janes_session";
const SESSION_LIFETIME_MS = 12 * 60 * 60 * 1000;
const MAX_FAILED_PIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 5;

type LoginUserRow = {
  id: string;
  display_name: string;
  is_active: boolean;
  pin_hash: string;
  failed_attempt_count: number;
  locked_until: Date | null;
};

function setSessionCookie(
  response: Response,
  token: string,
) {
  response.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: environment.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_LIFETIME_MS,
  });
}


function clearSessionCookie(response: Response) {
  response.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "strict",
    secure: environment.NODE_ENV === "production",
    path: "/",
  });
}

function readSessionToken(
  request: Request,
): string | null {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const prefix = `${SESSION_COOKIE_NAME}=`;

  for (const part of cookieHeader.split(";")) {
    const cookie = part.trim();

    if (cookie.startsWith(prefix)) {
      const token = cookie.slice(prefix.length);
      return token || null;
    }
  }

  return null;
}

authRouter.get("/setup", async (_request, response) => {
  const result = await pool.query<{ requires_setup: boolean }>(`
    SELECT NOT EXISTS (
      SELECT 1
      FROM users
    ) AS requires_setup
  `);

  response.json({
    requiresSetup:
      result.rows[0]?.requires_setup ?? false,
  });
});

authRouter.post("/setup", async (request, response) => {
  const input = createInitialAdminInputSchema.safeParse(
    request.body,
  );

  if (!input.success) {
    response.status(400).json({
      error: "Invalid initial administrator",
      issues: input.error.issues,
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /*
     * Two concurrent first-run requests must not both
     * observe an empty users table.
     */
    await client.query(
      "LOCK TABLE users IN EXCLUSIVE MODE",
    );

    const existingUsers = await client.query<{
      count: string;
    }>(`
      SELECT count(*) AS count
      FROM users
    `);

    if (Number(existingUsers.rows[0]?.count ?? "0") > 0) {
      await client.query("ROLLBACK");

      response.status(409).json({
        error: "Initial administrator already exists",
      });
      return;
    }

    const userResult = await client.query<{
      id: string;
      display_name: string;
    }>(
      `
        INSERT INTO users (
          display_name
        )
        VALUES ($1)
        RETURNING
          id,
          display_name
      `,
      [input.data.displayName],
    );

    const user = userResult.rows[0];

    if (!user) {
      throw new Error(
        "PostgreSQL did not return the initial administrator.",
      );
    }

    await client.query(
      `
        INSERT INTO user_roles (
          user_id,
          role_code
        )
        VALUES ($1, 'admin')
      `,
      [user.id],
    );

    const pinHash = await hashUserPin(input.data.pin);

    await client.query(
      `
        INSERT INTO user_credentials (
          user_id,
          pin_hash
        )
        VALUES ($1, $2)
      `,
      [user.id, pinHash],
    );

    await client.query("COMMIT");

    const identity: UserIdentity = {
      id: user.id,
      displayName: user.display_name,
      roles: ["admin"],
    };

    response.status(201).json(identity);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});


authRouter.get(
  "/login-options",
  async (_request, response) => {
    const result = await pool.query<{
      id: string;
      display_name: string;
    }>(`
      SELECT
        u.id,
        u.display_name
      FROM users u
      WHERE u.is_active = true
        AND EXISTS (
          SELECT 1
          FROM user_credentials c
          WHERE c.user_id = u.id
        )
      ORDER BY
        lower(u.display_name),
        u.id
    `);

    const options: UserLoginOption[] = result.rows.map(
      (row) => ({
        id: row.id,
        displayName: row.display_name,
      }),
    );

    response.json(options);
  },
);

authRouter.post("/login", async (request, response) => {
  const input = userLoginInputSchema.safeParse(
    request.body,
  );

  if (!input.success) {
    response.status(400).json({
      error: "Invalid login",
      issues: input.error.issues,
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query<LoginUserRow>(
      `
        SELECT
          u.id,
          u.display_name,
          u.is_active,
          c.pin_hash,
          c.failed_attempt_count,
          c.locked_until
        FROM users u
        JOIN user_credentials c
          ON c.user_id = u.id
        WHERE u.id = $1
        FOR UPDATE OF c
      `,
      [input.data.userId],
    );

    const user = userResult.rows[0];

    if (!user || !user.is_active) {
      await client.query("ROLLBACK");

      response.status(401).json({
        error: "Invalid user or PIN",
      });
      return;
    }

    if (
      user.locked_until &&
      user.locked_until.getTime() > Date.now()
    ) {
      await client.query("ROLLBACK");

      response.status(423).json({
        error: "PIN temporarily locked",
      });
      return;
    }

    const pinMatches = await verifyUserPin(
      input.data.pin,
      user.pin_hash,
    );

    if (!pinMatches) {
      const nextFailedAttempt =
        user.failed_attempt_count + 1;

      await client.query(
        `
          INSERT INTO user_auth_events (
            user_id,
            event_type
          )
          VALUES ($1, 'login_failed')
        `,
        [user.id],
      );

      if (
        nextFailedAttempt >= MAX_FAILED_PIN_ATTEMPTS
      ) {
        await client.query(
          `
            UPDATE user_credentials
            SET
              failed_attempt_count = 0,
              locked_until =
                now() + ($2 * interval '1 minute'),
              updated_at = now()
            WHERE user_id = $1
          `,
          [user.id, LOCKOUT_MINUTES],
        );

        await client.query(
          `
            INSERT INTO user_auth_events (
              user_id,
              event_type
            )
            VALUES ($1, 'locked')
          `,
          [user.id],
        );

        await client.query("COMMIT");

        response.status(423).json({
          error: "PIN temporarily locked",
        });
        return;
      }

      await client.query(
        `
          UPDATE user_credentials
          SET
            failed_attempt_count = $2,
            locked_until = NULL,
            updated_at = now()
          WHERE user_id = $1
        `,
        [user.id, nextFailedAttempt],
      );

      await client.query("COMMIT");

      response.status(401).json({
        error: "Invalid user or PIN",
      });
      return;
    }

    const roleResult = await client.query<{
      role_code: string;
    }>(
      `
        SELECT role_code
        FROM user_roles
        WHERE user_id = $1
        ORDER BY role_code
      `,
      [user.id],
    );

    const token = createSessionToken();
    const tokenHash = hashSessionToken(token);

    const sessionResult = await client.query<{
      id: string;
    }>(
      `
        INSERT INTO user_sessions (
          user_id,
          token_hash,
          expires_at
        )
        VALUES (
          $1,
          $2,
          now() + interval '12 hours'
        )
        RETURNING id
      `,
      [user.id, tokenHash],
    );

    const session = sessionResult.rows[0];

    if (!session) {
      throw new Error(
        "PostgreSQL did not return the login session.",
      );
    }

    await client.query(
      `
        UPDATE user_credentials
        SET
          failed_attempt_count = 0,
          locked_until = NULL,
          updated_at = now()
        WHERE user_id = $1
      `,
      [user.id],
    );

    await client.query(
      `
        INSERT INTO user_auth_events (
          user_id,
          session_id,
          event_type
        )
        VALUES ($1, $2, 'login_succeeded')
      `,
      [user.id, session.id],
    );

    await client.query("COMMIT");

    setSessionCookie(response, token);

    const identity: UserIdentity = {
      id: user.id,
      displayName: user.display_name,
      roles: roleResult.rows.map(
        (role) => role.role_code,
      ),
    };

    response.json(identity);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});


authRouter.get("/me", async (request, response) => {
  const token = readSessionToken(request);

  if (!token) {
    response.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  const tokenHash = hashSessionToken(token);

  const result = await pool.query<{
    session_id: string;
    user_id: string;
    display_name: string;
    roles: string[];
  }>(
    `
      SELECT
        s.id AS session_id,
        u.id AS user_id,
        u.display_name,
        COALESCE(
          array_agg(
            ur.role_code
            ORDER BY ur.role_code
          ) FILTER (
            WHERE ur.role_code IS NOT NULL
          ),
          ARRAY[]::text[]
        ) AS roles
      FROM user_sessions s
      JOIN users u
        ON u.id = s.user_id
      LEFT JOIN user_roles ur
        ON ur.user_id = u.id
      WHERE s.token_hash = $1
        AND s.revoked_at IS NULL
        AND s.expires_at > now()
        AND u.is_active = true
      GROUP BY
        s.id,
        u.id,
        u.display_name
    `,
    [tokenHash],
  );

  const authenticated = result.rows[0];

  if (!authenticated) {
    clearSessionCookie(response);

    response.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  await pool.query(
    `
      UPDATE user_sessions
      SET last_seen_at = now()
      WHERE id = $1
    `,
    [authenticated.session_id],
  );

  const identity: UserIdentity = {
    id: authenticated.user_id,
    displayName: authenticated.display_name,
    roles: authenticated.roles,
  };

  response.json(identity);
});

authRouter.post(
  "/logout",
  async (request, response) => {
    const token = readSessionToken(request);

    if (!token) {
      clearSessionCookie(response);
      response.status(204).end();
      return;
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const sessionResult = await client.query<{
        id: string;
        user_id: string;
      }>(
        `
          UPDATE user_sessions
          SET revoked_at = now()
          WHERE token_hash = $1
            AND revoked_at IS NULL
          RETURNING
            id,
            user_id
        `,
        [hashSessionToken(token)],
      );

      const session = sessionResult.rows[0];

      if (session) {
        await client.query(
          `
            INSERT INTO user_auth_events (
              user_id,
              session_id,
              event_type
            )
            VALUES ($1, $2, 'logout')
          `,
          [session.user_id, session.id],
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    clearSessionCookie(response);
    response.status(204).end();
  },
);
