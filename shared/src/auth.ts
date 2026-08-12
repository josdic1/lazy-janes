import { z } from "zod";

export const userPinSchema = z
  .string()
  .regex(/^\d{4}$/, "PIN must contain exactly four digits");

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
