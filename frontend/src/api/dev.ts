import type { UserIdentity } from "@lazy-janes/shared";

export type DevUser = UserIdentity;
export type DemoPreset =
  | "slow-day"
  | "mildly-busy-day"
  | "very-busy-day"
  | "busy-week"
  | "busy-month";

export type DemoRun = {
  id: string;
  preset: DemoPreset;
  label: string;
  anchorDate: string;
  rangeStart: string;
  rangeEnd: string;
  createdAt: string;
  clearedAt: string | null;
  summary: {
    parties?: number;
    activeParties?: number;
    orders?: number;
    orderItems?: number;
    checks?: number;
    payments?: number;
    sales?: number;
  };
};

export type DemoStatus = { activeRun: DemoRun | null };

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

export async function getDemoStatus(): Promise<DemoStatus> {
  const response = await fetch("/api/dev/demo");
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<DemoStatus>;
}

export async function applyDemoPreset(
  preset: DemoPreset,
  anchorDate: string,
  replaceActive: boolean,
): Promise<DemoStatus> {
  const response = await fetch(`/api/dev/demo/${preset}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ anchorDate, replaceActive }),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<DemoStatus>;
}

export async function clearDemoRun(runId: string): Promise<DemoStatus> {
  const response = await fetch(`/api/dev/demo/${runId}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<DemoStatus>;
}
