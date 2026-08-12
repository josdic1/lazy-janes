import { describe, expect, it } from "vitest";
import {
  staffIdentitySchema,
  staffLoginInputSchema,
  staffPinSchema,
} from "../src/index.js";

describe("staff authentication contract", () => {
  it("accepts exactly four numeric PIN digits", () => {
    expect(staffPinSchema.parse("0123")).toBe("0123");
    expect(staffPinSchema.safeParse("123").success).toBe(false);
    expect(staffPinSchema.safeParse("12345").success).toBe(false);
    expect(staffPinSchema.safeParse("12ab").success).toBe(false);
  });

  it("accepts staff login credentials", () => {
    const staffId =
      "12dfde8a-7d80-4d68-90ce-bf12a9e754fd";

    expect(
      staffLoginInputSchema.parse({
        staffId,
        pin: "4826",
      }),
    ).toEqual({
      staffId,
      pin: "4826",
    });
  });

  it("accepts the authenticated staff identity", () => {
    const identity = {
      id: "12dfde8a-7d80-4d68-90ce-bf12a9e754fd",
      displayName: "Jane",
      roles: ["server", "manager"],
    };

    expect(staffIdentitySchema.parse(identity)).toEqual(
      identity,
    );
  });
});
