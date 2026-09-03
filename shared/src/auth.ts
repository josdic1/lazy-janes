import { z } from "zod";

export function formatUserDisplayName(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .replace(
      /(^|[\s'’\-])([A-Za-z])/g,
      (_match, prefix: string, letter: string) =>
        `${prefix}${letter.toUpperCase()}`,
    );
}

export function normalizeUserLoginName(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase();
}

export const userDisplayNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .transform(formatUserDisplayName);

export const userLoginNameSchema = z
  .string()
  .trim()
  .min(1, "Username is required")
  .max(200)
  .transform(normalizeUserLoginName);


export const userPinSchema = z
  .string()
  .min(1, "Password is required")
  .max(72, "Password must contain at most 72 characters");

export const userLoginOptionSchema = z.object({
  id: z.string().uuid(),
  displayName: userDisplayNameSchema,
});

export type UserLoginOption = z.infer<
  typeof userLoginOptionSchema
>;

export const userLoginInputSchema = z.union([
  z.object({
    username: userLoginNameSchema,
    pin: userPinSchema,
  }),
  z.object({
    userId: z.string().uuid(),
    pin: userPinSchema,
  }),
]);

export type UserLoginInput = z.infer<
  typeof userLoginInputSchema
>;

export const userIdentitySchema = z.object({
  id: z.string().uuid(),
  displayName: userDisplayNameSchema,
  roles: z.array(z.string().trim().min(1)),
});

export type UserIdentity = z.infer<
  typeof userIdentitySchema
>;

export const setUserPinInputSchema = z.object({
  pin: userPinSchema,
});

export type SetUserPinInput = z.infer<
  typeof setUserPinInputSchema
>;

export const authSetupStatusSchema = z.object({
  requiresSetup: z.boolean(),
});

export type AuthSetupStatus = z.infer<
  typeof authSetupStatusSchema
>;

export const createInitialAdminInputSchema = z.object({
  displayName: userDisplayNameSchema,
  pin: userPinSchema,
});

export type CreateInitialAdminInput = z.infer<
  typeof createInitialAdminInputSchema
>;
