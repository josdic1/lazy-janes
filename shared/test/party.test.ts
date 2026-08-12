import { describe, expect, it } from "vitest";
import {
  PARTY_STATUSES,
  createPartyInputSchema,
  partySchema,
  partyStatusSchema,
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
    };

    expect(partySchema.parse(party)).toEqual(party);
  });
});
