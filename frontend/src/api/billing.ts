import {
  checkSchema,
  paymentSchema,
  type Check,
  type CreateCheckInput,
  type Payment,
  type TakePaymentInput,
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

export async function createCheck(
  input: CreateCheckInput,
): Promise<Check> {
  const response = await fetch("/api/checks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return checkSchema.parse(await response.json());
}

export async function presentCheck(checkId: string): Promise<Check> {
  const response = await fetch(`/api/checks/${checkId}/present`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return checkSchema.parse(await response.json());
}

export async function takePayment(
  input: TakePaymentInput,
): Promise<Payment> {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return paymentSchema.parse(await response.json());
}
