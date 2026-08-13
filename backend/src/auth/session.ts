import type {
  UserIdentity,
  UserRoleCode,
} from "@lazy-janes/shared";
import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { pool } from "../db/pool.js";
import { environment } from "../env.js";
import { hashSessionToken } from "./security.js";

export const SESSION_COOKIE_NAME =
  "lazy_janes_session";

export const SESSION_LIFETIME_MS =
  12 * 60 * 60 * 1000;

export type AuthenticatedSession = {
  sessionId: string;
  user: UserIdentity;
};

export type AuthenticatedRequest = Request & {
  authenticatedSession?: AuthenticatedSession;
};

export function setSessionCookie(
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

export function clearSessionCookie(
  response: Response,
) {
  response.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "strict",
    secure: environment.NODE_ENV === "production",
    path: "/",
  });
}

export function readSessionToken(
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
      return cookie.slice(prefix.length) || null;
    }
  }

  return null;
}

export async function resolveAuthenticatedSession(
  request: Request,
): Promise<AuthenticatedSession | null> {
  const token = readSessionToken(request);

  if (!token) {
    return null;
  }

  const result = await pool.query<{
    session_id: string;
    user_id: string;
    display_name: string;
    roles: UserRoleCode[];
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
    [hashSessionToken(token)],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  await pool.query(
    `
      UPDATE user_sessions
      SET last_seen_at = now()
      WHERE id = $1
    `,
    [row.session_id],
  );

  return {
    sessionId: row.session_id,
    user: {
      id: row.user_id,
      displayName: row.display_name,
      roles: row.roles,
    },
  };
}

export async function requireAuthenticatedUser(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) {
  const session =
    await resolveAuthenticatedSession(request);

  if (!session) {
    clearSessionCookie(response);

    response.status(401).json({
      error: "Authentication required",
    });
    return;
  }

  request.authenticatedSession = session;
  next();
}

export function getAuthenticatedUser(
  request: Request,
): UserIdentity {
  const session = (
    request as AuthenticatedRequest
  ).authenticatedSession;

  if (!session) {
    throw new Error(
      "Authenticated session missing after authentication middleware.",
    );
  }

  return session.user;
}

export function requireAnyRole(
  ...roles: UserRoleCode[]
) {
  return (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) => {
    const session = request.authenticatedSession;

    if (!session) {
      response.status(401).json({
        error: "Authentication required",
      });
      return;
    }

    if (
      !roles.some((role) =>
        session.user.roles.includes(role),
      )
    ) {
      response.status(403).json({
        error: "Permission denied",
      });
      return;
    }

    next();
  };
}

export function requireRole(
  role: UserRoleCode,
) {
  return (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) => {
    const session = request.authenticatedSession;

    if (!session) {
      response.status(401).json({
        error: "Authentication required",
      });
      return;
    }

    if (!session.user.roles.includes(role)) {
      response.status(403).json({
        error: "Permission denied",
      });
      return;
    }

    next();
  };
}
