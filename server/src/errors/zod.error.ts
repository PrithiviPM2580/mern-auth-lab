import type { Response } from "express";
import type { ZodError } from "zod";
import { HTTP_STATUS } from "@/config/http.config";

export const formatZodError = (res: Response, error: ZodError): Response => {
  const errors = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));

  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    message: "Validation Error",
    errors,
  });
};
