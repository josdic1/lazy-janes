import {
  drawerSessionSchema,
  type CloseDrawerInput,
  type DrawerSession,
  type OpenDrawerInput,
} from "@lazy-janes/shared";

async function readError(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null);

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

export async function getCurrentDrawer(): Promise<DrawerSession | null> {
  const response = await fetch("/api/register/current");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const body: unknown = await response.json();
  return body === null ? null : drawerSessionSchema.parse(body);
}

export async function openDrawer(
  input: OpenDrawerInput,
): Promise<DrawerSession> {
  const response = await fetch("/api/register/open", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return drawerSessionSchema.parse(await response.json());
}

export async function closeDrawer(
  input: CloseDrawerInput,
): Promise<DrawerSession> {
  const response = await fetch("/api/register/close", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return drawerSessionSchema.parse(await response.json());
}
