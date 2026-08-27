import type {
  CancelOrderInput,
  CreateOrderInput,
  DeliverOrderItemsInput,
  FireOrderInput,
  KitchenChit,
  MarkKitchenItemsReadyInput,
  Order,
  VoidOrderItemsInput,
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


export async function markOrderItemsReady(
  orderId: string,
  input: MarkKitchenItemsReadyInput,
): Promise<void> {
  const response = await fetch(`/api/orders/${orderId}/ready`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}

export async function deliverOrderItems(
  orderId: string,
  input: DeliverOrderItemsInput,
): Promise<void> {
  const response = await fetch(`/api/orders/${orderId}/deliver`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}

export async function cancelOrder(
  orderId: string,
  input: CancelOrderInput,
): Promise<void> {
  const response = await fetch(`/api/orders/${orderId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}

export async function voidOrderItems(
  orderId: string,
  input: VoidOrderItemsInput,
): Promise<void> {
  const response = await fetch(`/api/orders/${orderId}/void`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}
