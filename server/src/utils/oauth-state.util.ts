import { appConfig } from "@/config/app.config";
import { AppError } from "@/errors/app.error";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

interface OAuthLinkStatePayload {
  userId: string;
  type: "oauth-link";
  provider: "google" | "github";
}

export const createOAuthLinkState = (
  userId: Types.ObjectId,
  provider: "google" | "github",
) => {
  return jwt.sign(
    {
      userId: userId.toString(),
      type: "oauth-link",
      provider,
    },
    appConfig.JWT_SECRET,
    {
      expiresIn: "10m",
    },
  );
};

export const verifyOAuthLinkState = (
  token: string,
  provider: "google" | "github",
) => {
  try {
    const payload = jwt.verify(
      token,
      appConfig.JWT_SECRET,
    ) as OAuthLinkStatePayload;

    if (payload.type !== "oauth-link" || payload.provider !== provider) {
      throw AppError.unauthorized("Invalid OAuth state");
    }

    if (!Types.ObjectId.isValid(payload.userId)) {
      throw AppError.unauthorized("Invalid OAuth state");
    }

    return {
      userId: new Types.ObjectId(payload.userId),
    };
  } catch {
    throw AppError.unauthorized("Invalid or expired OAuth state");
  }
};
