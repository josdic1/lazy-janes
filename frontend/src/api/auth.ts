import {
  authSetupStatusSchema,
  userIdentitySchema,
  userLoginOptionSchema,
  type AuthSetupStatus,
  type CreateInitialAdminInput,
  type UserIdentity,
  type UserLoginInput,
  type UserLoginOption,
} from "@lazy-janes/shared";
import { z } from "zod";

async function readError(
  response: Response,
): Promise<string> {
  const body: unknown = await response
    .json()
    .catch(() => null);

  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }

  return `Request failed with status ${response.status}`;
}

export async function getSetupStatus():
  Promise<AuthSetupStatus> {
  const response = await fetch("/api/auth/setup");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return authSetupStatusSchema.parse(
    await response.json(),
  );
}

export async function createInitialAdmin(
  input: CreateInitialAdminInput,
): Promise<UserIdentity> {
  const response = await fetch("/api/auth/setup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return userIdentitySchema.parse(
    await response.json(),
  );
}

export async function getLoginOptions():
  Promise<UserLoginOption[]> {
  const response = await fetch(
    "/api/auth/login-options",
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return z
    .array(userLoginOptionSchema)
    .parse(await response.json());
}

export async function login(
  input: UserLoginInput,
): Promise<UserIdentity> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return userIdentitySchema.parse(
    await response.json(),
  );
}

export async function getCurrentUser():
  Promise<UserIdentity | null> {
  const response = await fetch("/api/auth/me");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return userIdentitySchema.parse(
    await response.json(),
  );
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}
