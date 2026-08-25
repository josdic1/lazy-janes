import type {
  CreatePartyInput,
  DiningTableOption,
  Party,
  PartyListItem,
  SeatPartyInput,
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

export async function getParties(): Promise<PartyListItem[]> {
  const response = await fetch("/api/parties");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<PartyListItem[]>;
}

export async function getDiningTables():
  Promise<DiningTableOption[]> {
  const response = await fetch("/api/parties/tables");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<DiningTableOption[]>;
}

export async function createParty(
  input: CreatePartyInput,
): Promise<Party> {
  const response = await fetch("/api/parties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<Party>;
}

export async function seatParty(
  partyId: string,
  input: SeatPartyInput,
): Promise<Party> {
  const response = await fetch(
    `/api/parties/${partyId}/seat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<Party>;
}
