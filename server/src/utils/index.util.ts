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
 * Safely extract userId from req.user
 * Handles both AccessTokenPayload (with userId) and IUser (with _id)
 */
export const getUserIdFromRequest = (req: Request): Types.ObjectId => {
  const user = req.user as any;

  if (!user) {
    throw new Error("User not found in request");
  }

  // JWT payload has userId
  if ("userId" in user) {
    return user.userId;
  }

  // Mongoose document has _id
  if ("_id" in user) {
    return user._id;
  }

  throw new Error("Unable to extract userId from request");
};
