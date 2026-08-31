import type { Request } from "express";
import { rateLimit, ipKeyGenerator, type Options } from "express-rate-limit";
import { appConfig } from "@/config/app.config";

const commonOptions = {
  standardHeaders: "draft-7" as const,
  legacyHeaders: false,

  skip: () => appConfig.NODE_ENV === "development",

  keyGenerator: (req: Request) => {
    if (req.auth?.userId) {
      return req.auth.userId.toString();
    }

    return ipKeyGenerator(req.ip!);
  },

  message: {
    statusCode: 429,
    status: "fail",
    message: "Too many requests, please try again later.",
  },
} satisfies Partial<Options>;

export const authRateLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
});

export const strictAuthRateLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000,
  limit: 5,
});

export const twoFactorRateLimiter = rateLimit({
  ...commonOptions,
  windowMs: 10 * 60 * 1000,
  limit: 5,
});
