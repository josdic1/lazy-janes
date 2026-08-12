import { describe, expect, it } from "vitest";
import {
  createUserInputSchema,
  updateUserInputSchema,
  userRecordSchema,
  userRoleCodeSchema,
} from "../src/index.js";

describe("user management contract", () => {
  it("accepts only real restaurant roles", () => {
    expect(userRoleCodeSchema.parse("server")).toBe(
      "server",
    );

    expect(
      userRoleCodeSchema.safeParse("super_waiter").success,
    ).toBe(false);
  });

  it("creates a user with roles and a four-digit PIN", () => {
    expect(
      createUserInputSchema.parse({
        displayName: "Jane",
        roleCodes: ["server", "lead_server"],
        pin: "4826",
      }),
    ).toEqual({
      displayName: "Jane",
      roleCodes: ["server", "lead_server"],
      pin: "4826",
    });
  });

  it("requires at least one role", () => {
    expect(
      createUserInputSchema.safeParse({
        displayName: "Jane",
        roleCodes: [],
        pin: "4826",
      }).success,
    ).toBe(false);
  });

  it("keeps PIN changes out of ordinary profile edits", () => {
    expect(
      updateUserInputSchema.parse({
        displayName: "Jane D.",
        roleCodes: ["manager"],
      }),
    ).toEqual({
      displayName: "Jane D.",
      roleCodes: ["manager"],
    });
  });

  it("accepts the complete admin user shape", () => {
    const user = {
      id: "12dfde8a-7d80-4d68-90ce-bf12a9e754fd",
      displayName: "Josh",
      isActive: true,
      roles: ["admin", "manager"],
      hasPin: true,
      createdAt: "2026-08-12T19:30:00.000Z",
    };

    expect(userRecordSchema.parse(user)).toEqual(user);
  });
});
