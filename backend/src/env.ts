import { z } from "zod";

const nodeEnvironmentSchema = z
  .enum(["development", "test", "production"])
  .default("development");

const nodeEnvironment = nodeEnvironmentSchema.parse(
  process.env.NODE_ENV,
);

const environmentSchema = z.object({
  NODE_ENV: nodeEnvironmentSchema,
  PORT: z.coerce.number().int().positive().max(65535).default(3000),
  DATABASE_URL: z
    .string()
    .regex(
      /^postgres(ql)?:\/\//,
      "DATABASE_URL must be a PostgreSQL URL",
    ),
  PIN_PEPPER: z
    .string()
    .min(32, "PIN_PEPPER must contain at least 32 characters"),
});

export const environment = environmentSchema.parse({
  ...process.env,
  NODE_ENV: nodeEnvironment,
  DATABASE_URL:
    process.env.DATABASE_URL ??
    (nodeEnvironment === "test"
      ? "postgresql:///lazy_janes_test"
      : undefined),
  PIN_PEPPER:
    process.env.PIN_PEPPER ??
    (nodeEnvironment === "test"
      ? "lazy-janes-test-only-pin-pepper-00000000"
      : undefined),
});
