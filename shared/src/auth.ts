import { z } from "zod";

export const staffPinSchema = z
  .string()
  .regex(/^\d{4}$/, "PIN must contain exactly four digits");

export const staffLoginOptionSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().trim().min(1),
});

export type StaffLoginOption = z.infer<
  typeof staffLoginOptionSchema
>;

export const staffLoginInputSchema = z.object({
  staffId: z.string().uuid(),
  pin: staffPinSchema,
});

export type StaffLoginInput = z.infer<
  typeof staffLoginInputSchema
>;

export const staffIdentitySchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().trim().min(1),
  roles: z.array(z.string().trim().min(1)),
});

export type StaffIdentity = z.infer<
  typeof staffIdentitySchema
>;

export const setStaffPinInputSchema = z.object({
  pin: staffPinSchema,
});

export type SetStaffPinInput = z.infer<
  typeof setStaffPinInputSchema
>;
