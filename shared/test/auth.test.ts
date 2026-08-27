import { describe, expect, it } from "vitest";
import {
  authSetupStatusSchema,
  createInitialAdminInputSchema,
  userIdentitySchema,
  userLoginInputSchema,
  userPinSchema,
} from "../src/index.js";

describe("user authentication contract", () => {
  it("accepts non-empty passwords", () => {
    expect(userPinSchema.parse("admin")).toBe("admin");
    expect(userPinSchema.parse("4826")).toBe("4826");
    expect(userPinSchema.safeParse("").success).toBe(false);
    expect(userPinSchema.safeParse("x".repeat(73)).success).toBe(false);
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
