import {
  checkPriceRequirementSchema,
  checkSchema,
  paymentSchema,
  type Check,
  type CheckPriceRequirement,
  type CreateCheckInput,
  type Payment,
  type TakePaymentInput,
} from "@lazy-janes/shared";

export class CheckPricingRequiredError extends Error {
  readonly requirements: CheckPriceRequirement[];

  constructor(
    message: string,
    requirements: CheckPriceRequirement[],
  ) {
    super(message);
    this.name = "CheckPricingRequiredError";
    this.requirements = requirements;
  }
}

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
    const body: unknown = await response.json().catch(() => null);

    const message =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : `Request failed with status ${response.status}`;

    if (
      response.status === 409 &&
      typeof body === "object" &&
      body !== null &&
      "pricingRequired" in body
    ) {
      const requirements = checkPriceRequirementSchema
        .array()
        .safeParse(body.pricingRequired);

      if (requirements.success) {
        throw new CheckPricingRequiredError(
          message,
          requirements.data,
        );
      }
    }

    throw new Error(message);
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
