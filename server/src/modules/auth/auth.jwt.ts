import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";
import { ZodType } from "zod";
import {
  type AccessTokenPayload,
  type RefreshTokenPayload,
  accessTokenSchema,
  refreshTokenSchema,
} from "./auth.validation";
import { appConfig } from "@/config/app.config";
import { AppError } from "@/errors/app.error";
import {
  twoFactorChallengeSchema,
  type TwoFactorChallengePayload,
} from "./two-factor/two-factor.validation";

const signToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
    audience: appConfig.JWT_AUDIENCE,
    issuer: appConfig.JWT_ISSUER,
  });
};

const verifyToken = <T>(
  token: string,
  secret: string,
  schema: ZodType<T>,
): T => {
  try {
    const decode = jwt.verify(token, secret, {
      audience: appConfig.JWT_AUDIENCE,
      issuer: appConfig.JWT_ISSUER,
    });

    return schema.parse(decode);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized("Token has expired");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized("Invalid token");
    }

    throw error;
  }
};

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return signToken(
    payload,
    appConfig.JWT_ACCESS_SECRET,
    appConfig.JWT_ACCESS_EXPIRES_IN as StringValue,
  );
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return signToken(
    payload,
    appConfig.JWT_REFRESH_SECRET,
    appConfig.JWT_REFRESH_EXPIRES_IN as StringValue,
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return verifyToken(token, appConfig.JWT_ACCESS_SECRET, accessTokenSchema);
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return verifyToken(token, appConfig.JWT_REFRESH_SECRET, refreshTokenSchema);
};

export const createAuthTokens = (user: AccessTokenPayload) => {
  const accessToken = signAccessToken({
    userId: user.userId,
    sessionId: user.sessionId,
  });

  const refreshToken = signRefreshToken({
    sessionId: user.sessionId,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const signTwoFactorChallenge = (
  payload: TwoFactorChallengePayload,
): string => {
  return signToken(
    payload,
    appConfig.JWT_2FA_SECRET,
    appConfig.JWT_2FA_EXPIRES_IN as StringValue,
  );
};

export const verifyTwoFactorChallenge = (
  token: string,
): TwoFactorChallengePayload => {
  return verifyToken(token, appConfig.JWT_2FA_SECRET, twoFactorChallengeSchema);
};
