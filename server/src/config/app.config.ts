import { z } from "zod";

export const appConfigSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  BASE_PATH: z.string().default("/api/v1"),
  APP_ORIGIN: z.url().default("http://localhost:3000"),
  JWT_AUDIENCE: z.string().default("user"),
  JWT_ISSUER: z.string().default("advance-mern-auth"),
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.coerce.number().int().positive().default(3600), // 1 hour in seconds
  JWT_REFRESH_EXPIRES_IN: z.coerce.number().int().positive().default(604800), // 7 days in seconds
  JWT_REFRESH_SECRET: z.string(),
  MONGODB_URI: z.url(),
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
