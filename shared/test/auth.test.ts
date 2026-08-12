import { describe, expect, it } from "vitest";
import {
  authSetupStatusSchema,
  createInitialAdminInputSchema,
  userIdentitySchema,
  userLoginInputSchema,
  userPinSchema,
} from "../src/index.js";

describe("user authentication contract", () => {
  it("accepts exactly four numeric PIN digits", () => {
    expect(userPinSchema.parse("0123")).toBe("0123");
    expect(userPinSchema.safeParse("123").success).toBe(false);
    expect(userPinSchema.safeParse("12345").success).toBe(false);
    expect(userPinSchema.safeParse("12ab").success).toBe(false);
  });

  it("accepts user login credentials", () => {
    const userId =
      "12dfde8a-7d80-4d68-90ce-bf12a9e754fd";

    expect(
      userLoginInputSchema.parse({
        userId,
        pin: "4826",
      }),
    ).toEqual({
      userId,
      pin: "4826",
    });
  });

  it("accepts the authenticated user identity", () => {
    const identity = {
      id: "12dfde8a-7d80-4d68-90ce-bf12a9e754fd",
      displayName: "Jane",
      roles: ["server", "manager"],
    };

    expect(userIdentitySchema.parse(identity)).toEqual(
      identity,
    );
  });
});

describe("initial authentication setup", () => {
  it("accepts the first administrator identity and PIN", () => {
    expect(
      createInitialAdminInputSchema.parse({
        displayName: "Josh",
        pin: "4826",
      }),
    ).toEqual({
      displayName: "Josh",
      pin: "4826",
    });
  });

  it("represents whether first-run setup is required", () => {
    expect(
      authSetupStatusSchema.parse({
        requiresSetup: true,
      }),
    ).toEqual({
      requiresSetup: true,
    });
  });
});
