import { AppError } from "@/errors/app.error";
import { verifyAccessToken } from "@/modules/auth/auth.jwt";
import type { NextFunction, Request, Response } from "express";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next(AppError.unauthorized("Access token is missing"));
  }

  const payload = verifyAccessToken(accessToken);

  req.user = payload;

  next();
};
