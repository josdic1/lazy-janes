import { z } from "zod";
import { userPinSchema } from "./auth.js";

export const USER_ROLE_CODES = [
  "host",
  "server",
  "lead_server",
  "chef",
  "head_chef",
  "manager",
  "admin",
] as const;

export const userRoleCodeSchema = z.enum(USER_ROLE_CODES);

export type UserRoleCode = z.infer<
  typeof userRoleCodeSchema
>;

export const userRoleSchema = z.object({
  code: userRoleCodeSchema,
  name: z.string().trim().min(1),
});

export type UserRole = z.infer<
  typeof userRoleSchema
>;

export const userRecordSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().trim().min(1).max(200),
  isActive: z.boolean(),
  roles: z.array(userRoleCodeSchema),
  hasPin: z.boolean(),
  createdAt: z.string().datetime(),
});

export type UserRecord = z.infer<
  typeof userRecordSchema
>;

export const createUserInputSchema = z.object({
  displayName: z.string().trim().min(1).max(200),
  roleCodes: z
    .array(userRoleCodeSchema)
    .min(1, "At least one role is required"),
  pin: userPinSchema,
});

export type CreateUserInput = z.infer<
  typeof createUserInputSchema
>;

export const updateUserInputSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .optional(),
    isActive: z.boolean().optional(),
    roleCodes: z
      .array(userRoleCodeSchema)
      .min(1, "At least one role is required")
      .optional(),
  })
  .refine(
    (changes) => Object.keys(changes).length > 0,
    "At least one field must be provided",
  );

export type UpdateUserInput = z.infer<
  typeof updateUserInputSchema
>;

export const usersResponseSchema = z.object({
  users: z.array(userRecordSchema),
});

export type UsersResponse = z.infer<
  typeof usersResponseSchema
>;

export const resetUserPinInputSchema = z.object({
  pin: userPinSchema,
});

export type ResetUserPinInput = z.infer<
  typeof resetUserPinInputSchema
>;
