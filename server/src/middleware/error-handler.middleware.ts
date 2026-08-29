import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { appConfig } from "@/config/app.config";
import { HTTP_STATUS } from "@/config/http.config";
import { AppError } from "@/errors/app.error";
import { formatZodError } from "@/errors/zod.error";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(`Error occurred on path ${req.path}:`, err);

  const isDevelopment = appConfig.NODE_ENV === "development";

  // Invalid JSON body
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid JSON payload",
      ...(isDevelopment && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }

  // Zod validation error
  if (err instanceof ZodError) {
    return formatZodError(res, err);
  }

  // Known application error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
      ...(isDevelopment && {
        stack: err.stack,
      }),
    });
  }

  // Unknown/unexpected error
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: isDevelopment
      ? err?.message || "Internal Server Error"
      : "An unexpected error occurred. Please try again later.",

    ...(isDevelopment && {
      stack: err?.stack,
    }),
  });
};
