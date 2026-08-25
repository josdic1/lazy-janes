import { describe, expect, it } from "vitest";
import {
  createSessionToken,
  hashSessionToken,
  hashUserPin,
  verifyUserPin,
} from "../src/auth/security.js";

describe("user authentication security", () => {
  it("hashes and verifies a user PIN", async () => {
    const hash = await hashUserPin("4826");

    expect(hash).not.toContain("4826");
    await expect(verifyUserPin("4826", hash)).resolves.toBe(
      true,
    );
    await expect(verifyUserPin("1111", hash)).resolves.toBe(
      false,
    );
  });

  it("creates random session tokens and fixed token hashes", () => {
    const firstToken = createSessionToken();
    const secondToken = createSessionToken();

    expect(firstToken).not.toBe(secondToken);
    expect(firstToken).toHaveLength(64);
    expect(hashSessionToken(firstToken)).toHaveLength(64);
    expect(hashSessionToken(firstToken)).not.toBe(firstToken);
  });
});
