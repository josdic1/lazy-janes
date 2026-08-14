import type {
  CreateOrderInput,
  FireOrderInput,
  KitchenChit,
  Order,
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

export async function createOrder(
  input: CreateOrderInput,
): Promise<Order> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<Order>;
}

export async function fireOrder(
  orderId: string,
  input: FireOrderInput,
): Promise<KitchenChit> {
  const response = await fetch(`/api/orders/${orderId}/fire`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<KitchenChit>;
}
