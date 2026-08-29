import ms, { type StringValue } from "ms";
import type { CookieOptions, Response } from "express";
import type { AuthenticationCookiesPayload } from "@/types";
import { appConfig } from "@/config/app.config";

const REFRESH_PATH = `${appConfig.BASE_PATH}/auth/refresh`;

export const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: appConfig.NODE_ENV === "production",
  sameSite: appConfig.NODE_ENV === "production" ? "strict" : "lax",
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaultCookieOptions,
  maxAge: ms(appConfig.JWT_ACCESS_EXPIRES_IN as StringValue),
  path: "/",
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaultCookieOptions,
  maxAge: ms(appConfig.JWT_REFRESH_EXPIRES_IN as StringValue),
  path: REFRESH_PATH,
});

export const setAuthenticationCookies = ({
  res,
  accessToken,
  refreshToken,
}: AuthenticationCookiesPayload): Response => {
  res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
  res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

  return res;
};

export const clearAuthenticationCookies = (res: Response): Response => {
  res.clearCookie("accessToken", getAccessTokenCookieOptions());
  res.clearCookie("refreshToken", getRefreshTokenCookieOptions());

  return res;
};
