import { z } from "zod";

export const appConfigSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  BASE_PATH: z.string().default("/api/v1"),
  FRONTEND_URL: z.url().default("http://localhost:5173"),
  APP_ORIGIN: z.url().default("http://localhost:3000"),
  JWT_AUDIENCE: z.string().default("user"),
  JWT_ISSUER: z.string().default("advance-mern-auth"),
  JWT_ACCESS_SECRET: z.string("JWT access secret must be provided"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"), // 15 minutes
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"), // 7 days
  JWT_REFRESH_SECRET: z.string("JWT refresh secret must be provided"),
  EMAIL_VERIFICATION_EXPIRES_MINUTES: z.coerce
    .number()
    .int()
    .positive()
    .default(15),
  PASSWORD_RESET_EXPIRES_MINUTES: z.coerce
    .number()
    .int()
    .positive()
    .default(15),
  SMTP_HOST: z.string("SMTP host must be provided"),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_USER: z.string("SMTP user must be provided"),
  SMTP_PASSWORD: z.string("SMTP password must be provided"),
  MONGODB_URI: z.url("MongoDB connection string must be a valid URL"),
});

const parsedConfig = appConfigSchema.safeParse(process.env);

if (!parsedConfig.success) {
  console.error(
    "Invalid environment variables:",
    parsedConfig.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    })),
  );

  process.exit(1);
}

export const appConfig = parsedConfig.data;
