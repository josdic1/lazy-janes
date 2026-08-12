import type {
  CreateMenuItemInput,
  MenuItem,
  UpdateMenuItemInput,
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

export async function getMenuItems(): Promise<MenuItem[]> {
  const response = await fetch("/api/menu");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<MenuItem[]>;
}

export async function createMenuItem(
  input: CreateMenuItemInput,
): Promise<MenuItem> {
  const response = await fetch("/api/menu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<MenuItem>;
}

export async function updateMenuItem(
  itemId: string,
  input: UpdateMenuItemInput,
): Promise<MenuItem> {
  const response = await fetch(`/api/menu/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<MenuItem>;
}

export async function deactivateMenuItem(
  itemId: string,
): Promise<void> {
  const response = await fetch(`/api/menu/${itemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}
