export type AdminPreloadKind = "menu" | "staff" | "tables";
export type AdminSamplePreset =
  | "slow-day"
  | "very-busy-day"
  | "slow-week"
  | "busy-week";

export type AdminDataSummary = {
  users: number;
  menuItems: number;
  sections: number;
  tables: number;
  activeParties: number;
  orders: number;
};

export type AdminDataActionResult = {
  action: string;
  message: string;
  summary: AdminDataSummary;
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

async function post(path: string, body?: unknown): Promise<AdminDataActionResult> {
  const init: RequestInit = { method: "POST" };
  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }

  const response = await fetch(path, init);
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<AdminDataActionResult>;
}

export async function clearAllExceptAdmin(): Promise<AdminDataActionResult> {
  return post("/api/admin-data/reset");
}

export async function preloadAdminData(
  kind: AdminPreloadKind,
): Promise<AdminDataActionResult> {
  return post(`/api/admin-data/preload/${kind}`);
}

export async function loadSampleActivity(
  preset: AdminSamplePreset,
  anchorDate: string,
): Promise<AdminDataActionResult> {
  return post(`/api/admin-data/sample/${preset}`, { anchorDate });
}
