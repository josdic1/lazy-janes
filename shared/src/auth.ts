import { z } from "zod";

export const userPinSchema = z
  .string()
  .min(1, "Password is required")
  .max(72, "Password must contain at most 72 characters");

export const userLoginOptionSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().trim().min(1),
});

export type UserLoginOption = z.infer<
  typeof userLoginOptionSchema
>;

export const userLoginInputSchema = z.object({
  userId: z.string().uuid(),
  pin: userPinSchema,
});

export type UserLoginInput = z.infer<
  typeof userLoginInputSchema
>;

export const userIdentitySchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().trim().min(1),
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
  displayName: z.string().trim().min(1).max(200),
  pin: userPinSchema,
});

export type CreateInitialAdminInput = z.infer<
  typeof createInitialAdminInputSchema
>;
