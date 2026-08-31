import { appConfig } from "@/config/app.config";
import ms, { type StringValue } from "ms";
import type { Request } from "express";
import type { Types } from "mongoose";

export const expireIn = () => {
  return new Date(
    Date.now() + ms(appConfig.JWT_REFRESH_EXPIRES_IN as StringValue),
  );
};

/**
 * Safely extract userId from req.auth (JWT payload)
 */
export const getUserIdFromRequest = (req: Request): Types.ObjectId => {
  const auth = req.auth;

  if (!auth) {
    throw new Error("Auth token not found in request");
  }

  return auth.userId;
};

export const getCurrentSessionIdFromRequest = (
  req: Request,
): Types.ObjectId => {
  const auth = req.auth;

  if (!auth) {
    throw new Error("Auth token not found in request");
  }

  return auth.sessionId;
};
