import {
  stackSnapshotSchema,
  type StackSnapshot,
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

export async function getStackSnapshot(): Promise<StackSnapshot> {
  const response = await fetch("/api/stack");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return stackSnapshotSchema.parse(await response.json());
}
