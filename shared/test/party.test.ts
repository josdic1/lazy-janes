import { describe, expect, it } from "vitest";
import {
  PARTY_STATUSES,
  cancelPartyInputSchema,
  createPartyInputSchema,
  partySchema,
  partyStatusSchema,
  seatPartyInputSchema,
} from "../src/index.js";

describe("party contract", () => {
  it("accepts every party status", () => {
    for (const status of PARTY_STATUSES) {
      expect(partyStatusSchema.parse(status)).toBe(status);
    }
  });

  it("does not treat arrival as a current status", () => {
    expect(
      partyStatusSchema.safeParse("arrived").success,
    ).toBe(false);
  });

  it("requires at least one guest", () => {
    expect(
      createPartyInputSchema.parse({ guestCount: 7 }),
    ).toEqual({
      guestCount: 7,
    });

    expect(
      createPartyInputSchema.safeParse({ guestCount: 0 })
        .success,
    ).toBe(false);
  });

  it("accepts a complete party record", () => {
    const party = {
      id: "12b88f3f-7ce6-4e31-9a58-dfd849754f57",
      guestCount: 7,
      status: "waiting",
      createdByStaffId:
        "0b30767c-6642-4683-a394-c04cb140e3be",
      arrivedAt: "2026-08-12T14:00:00.000Z",
      statusChangedAt: "2026-08-12T14:00:00.000Z",
      completedAt: null,
      cancelledAt: null,
      cancelledByStaffId: null,
      cancellationReason: null,
    };

    expect(partySchema.parse(party)).toEqual(party);
  });

  it("requires at least one unique table", () => {
    const tableId =
      "546f466b-d05c-43c2-9dc8-b50967572269";

    expect(
      seatPartyInputSchema.parse({ tableIds: [tableId] }),
    ).toEqual({
      tableIds: [tableId],
    });

    expect(
      seatPartyInputSchema.safeParse({ tableIds: [] })
        .success,
    ).toBe(false);

    expect(
      seatPartyInputSchema.safeParse({
        tableIds: [tableId, tableId],
      }).success,
    ).toBe(false);
  });
});

describe("cancel party contract", () => {
  it("requires a meaningful reason", () => {
    expect(
      cancelPartyInputSchema.parse({
        reason: "Party left before ordering",
      }),
    ).toEqual({
      reason: "Party left before ordering",
    });

    expect(
      cancelPartyInputSchema.safeParse({
        reason: " ",
      }).success,
    ).toBe(false);
  });
});
