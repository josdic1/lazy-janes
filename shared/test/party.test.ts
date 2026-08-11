import { describe, expect, it } from "vitest";
import {
  PARTY_STATUSES,
  createPartyInputSchema,
  partyStatusSchema,
} from "../src/index.js";

describe("party contract", () => {
  it("accepts every party status", () => {
    for (const status of PARTY_STATUSES) {
      expect(partyStatusSchema.parse(status)).toBe(status);
    }
  });

  it("does not treat arrival as a current status", () => {
    expect(partyStatusSchema.safeParse("arrived").success).toBe(false);
  });

  it("requires at least one guest", () => {
    expect(createPartyInputSchema.parse({ guestCount: 7 })).toEqual({
      guestCount: 7,
    });

    expect(createPartyInputSchema.safeParse({ guestCount: 0 }).success).toBe(
      false,
    );
  });
});
