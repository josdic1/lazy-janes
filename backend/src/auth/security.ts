import {
  createHash,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { environment } from "../env.js";

const scrypt = promisify(nodeScrypt);

const PIN_HASH_PREFIX = "scrypt";
const SALT_BYTES = 16;
const HASH_BYTES = 64;
const SESSION_TOKEN_BYTES = 32;

async function derivePinHash(
  pin: string,
  salt: Buffer,
): Promise<Buffer> {
  return (await scrypt(
    `${pin}:${environment.PIN_PEPPER}`,
    salt,
    HASH_BYTES,
  )) as Buffer;
}

export async function hashUserPin(
  pin: string,
): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const hash = await derivePinHash(pin, salt);

  return [
    PIN_HASH_PREFIX,
    salt.toString("hex"),
    hash.toString("hex"),
  ].join("$");
}

export async function verifyUserPin(
  pin: string,
  storedHash: string,
): Promise<boolean> {
  const [prefix, saltHex, expectedHashHex] =
    storedHash.split("$");

  if (
    prefix !== PIN_HASH_PREFIX ||
    !saltHex ||
    !expectedHashHex
  ) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expectedHash = Buffer.from(expectedHashHex, "hex");

  if (
    salt.length !== SALT_BYTES ||
    expectedHash.length !== HASH_BYTES
  ) {
    return false;
  }

  const actualHash = await derivePinHash(pin, salt);

  return timingSafeEqual(actualHash, expectedHash);
}

export function createSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString("hex");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
