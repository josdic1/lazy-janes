import { describe, expect, it } from "vitest";
import { stackSnapshotSchema } from "../src/index.js";

describe("Stack read contract", () => {
  it("represents observable diner state without a Stack status", () => {
    const snapshot = {
      generatedAt: "2026-08-12T19:00:00.000Z",
      parties: [
        {
          id: "4ad02662-f67a-4c60-b7af-00d726bb87ea",
          name: "Table 12",
          guestCount: 2,
          status: "in_service" as const,
          arrivedAt: "2026-08-12T18:00:00.000Z",
          statusChangedAt: "2026-08-12T18:10:00.000Z",
          tables: [
            {
              id: "9a6b6a14-b833-44e0-8b76-24f55ae67bad",
              label: "12",
            },
          ],
          orders: [
            {
              id: "ba2939a9-76d8-426c-b28c-93e968145898",
              fulfillmentType: "dine_in" as const,
              customerName: null,
              customerPhone: null,
              deliveryAddress: null,
              requestedFor: null,
              submittedAt: "2026-08-12T18:15:00.000Z",
              cancelledAt: null,
              items: [
                {
                  id: "98867d84-ae9a-4374-bf74-18f6a18f1bd4",
                  itemName: "Drunken Chicken",
                  seatNumber: 1,
                  quantity: 1,
                  status: "ready" as const,
                  kitchenDetails: [],
                  kitchenNote: null,
                  allocatedQuantity: 0,
                  remainingQuantity: 1,
                },
              ],
            },
          ],
          checks: [
            {
              id: "f3a5124d-e31a-4646-aeca-b5d54fc66f90",
              label: "Table 12",
              status: "open" as const,
              totalAmount: 18.07,
              paidAmount: 0,
              balanceAmount: 18.07,
              orderIds: [
                "ba2939a9-76d8-426c-b28c-93e968145898",
              ],
            },
          ],
          events: [
            {
              id: "1",
              eventType: "arrived" as const,
              actorUserId:
                "52779ea7-bfc8-4180-9606-07c68b7c7455",
              reason: null,
              occurredAt: "2026-08-12T18:00:00.000Z",
            },
          ],
        },
      ],
      standaloneOrders: [],
      standaloneChecks: [],
    };

    expect(stackSnapshotSchema.parse(snapshot)).toEqual(
      snapshot,
    );
  });
});
