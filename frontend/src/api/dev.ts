import type { UserIdentity } from "@lazy-janes/shared";

export type DevUser = UserIdentity;
export type DemoPreset =
  | "admin-menu-only"
  | "keep-floor-staff"
  | "wednesday-light"
  | "sunday-busy";

export type DemoResult = {
  preset: DemoPreset;
  users: number;
  sections: number;
  tables: number;
  activeParties: number;
  activeOrders: number;
};

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

export async function getDevUsers(): Promise<DevUser[]> {
  const response = await fetch("/api/dev/users");
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<DevUser[]>;
}

export async function devLogin(userId: string): Promise<UserIdentity> {
  const response = await fetch("/api/dev/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<UserIdentity>;
}

export async function applyDemoPreset(preset: DemoPreset): Promise<DemoResult> {
  const response = await fetch(`/api/dev/demo/${preset}`, { method: "POST" });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<DemoResult>;
}
