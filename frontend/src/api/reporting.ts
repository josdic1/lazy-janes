export type ReportMode = "data" | "reporting" | "audit";
export type ReportPeriod = "today" | "week" | "month" | "ytd";
export type ReportCheckStatus = "open" | "presented" | "closed";
export type ReportPaymentMethod = "cash" | "card";
export type ReportFulfillmentType = "dine_in" | "takeout" | "delivery";

export type ReportingCheckItem = {
  id: string;
  orderItemId: string;
  orderId: string;
  itemName: string;
  allocatedQuantity: number;
  allocatedAmount: number;
  seatNumber: number | null;
  fulfillmentType: ReportFulfillmentType;
};

export type ReportingPayment = {
  id: string;
  method: ReportPaymentMethod;
  allocatedAmount: number;
  tipAmount: number;
  succeededAt: string;
};

export type ReportingPartyEvent = {
  id: string;
  eventType: string;
  actorName: string | null;
  reason: string | null;
  occurredAt: string;
};

export type ReportingCheck = {
  id: string;
  partyId: string | null;
  partyName: string | null;
  guestCount: number | null;
  tableLabels: string[];
  fulfillmentTypes: ReportFulfillmentType[];
  label: string;
  status: ReportCheckStatus;
  openedByName: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  createdAt: string;
  presentedAt: string | null;
  closedAt: string | null;
  items: ReportingCheckItem[];
  payments: ReportingPayment[];
  partyEvents: ReportingPartyEvent[];
};

export type ReportingSnapshot = {
  generatedAt: string;
  rangeStart: string;
  rangeEnd: string;
  timezone: string;
  metrics: {
    sales: number;
    tax: number;
    tips: number;
    closedChecks: number;
    covers: number;
    averageCheck: number;
    averageCover: number;
    orders: number;
    voidedItems: number;
    cancelledOrders: number;
    manualPrices: number;
    averageWaitMinutes: number;
    averageTableMinutes: number;
    averageServiceMinutes: number;
    averageKitchenMinutes: number;
    averageCheckMinutes: number;
  };
  trend: Array<{
    bucket: string;
    sales: number;
    checks: number;
  }>;
  topItems: Array<{
    name: string;
    quantity: number;
    sales: number;
  }>;
  paymentMix: Array<{
    method: ReportPaymentMethod;
    amount: number;
    count: number;
  }>;
  serviceMix: Array<{
    fulfillmentType: ReportFulfillmentType;
    count: number;
  }>;
  checks: ReportingCheck[];
  reportingTotal: number;
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

export async function getReportingSnapshot(input: {
  start: string;
  end: string;
  timezone: string;
}): Promise<ReportingSnapshot> {
  const query = new URLSearchParams({
    start: input.start,
    end: input.end,
    timezone: input.timezone,
  });

  const response = await fetch(`/api/checks/reporting?${query.toString()}`);
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return (await response.json()) as ReportingSnapshot;
}


export type AuditEntityType =
  | "party"
  | "order"
  | "order_item"
  | "check"
  | "payment";

export type AuditEntry = {
  id: string;
  entityType: AuditEntityType;
  entityId: string;
  entityLabel: string;
  eventType: string;
  actorName: string | null;
  actorKind: string;
  reason: string | null;
  occurredAt: string;
};

export async function getAuditEntries(input: {
  start: string;
  end: string;
}): Promise<AuditEntry[]> {
  const query = new URLSearchParams({
    start: input.start,
    end: input.end,
  });

  const response = await fetch(`/api/checks/audit?${query.toString()}`);
  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as AuditEntry[];
}
