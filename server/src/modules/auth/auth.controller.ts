import type { TypeRequest } from "@/types";
import type { NextFunction, Request, Response } from "express";
import type {
  LoginInput,
  RegisterInput,
  VerifyEmailByLinkQuery,
  VerifyEmailByCodeBody,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "./auth.validation";
import { authService } from "./auth.service";
import { HTTP_STATUS } from "@/config/http.config";
import {
  clearAuthenticationCookies,
  setAuthenticationCookies,
} from "./auth.cookie";
import { AppError } from "@/errors/app.error";
import { getUserIdFromRequest } from "@/utils/index.util";

const register = async (req: TypeRequest<RegisterInput>, res: Response) => {
  const user = await authService.register(req.body);

  return res.status(HTTP_STATUS.CREATED).json({
    message: "User registered successfully",
    user,
  });
};

const login = async (req: TypeRequest<LoginInput>, res: Response) => {
  const userAgent = req.headers["user-agent"];

  const { user, accessToken, refreshToken } = await authService.login({
    ...req.body,
    userAgent,
  });

  return setAuthenticationCookies({
    res,
    accessToken,
    refreshToken,
  })
    .status(HTTP_STATUS.OK)
    .json({
      message: "User logged in successfully",
      user,
      accessToken,
      refreshToken,
    });
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(AppError.unauthorized("Refresh token is missing"));
  }

  const { accessToken, newRefreshToken } =
    await authService.refresh(refreshToken);

  return setAuthenticationCookies({
    res,
    accessToken,
    refreshToken: newRefreshToken,
  })
    .status(HTTP_STATUS.OK)
    .json({
      message: "Token refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  return clearAuthenticationCookies(res).status(HTTP_STATUS.OK).json({
    message: "User logged out successfully",
  });
};

const me = async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);

  const user = await authService.getMe(userId);

  return res.status(HTTP_STATUS.OK).json({
    message: "User fetched successfully",
    user,
  });
};

const verifyEmailByLink = async (
  req: TypeRequest<unknown, unknown, VerifyEmailByLinkQuery>,
  res: Response,
) => {
  await authService.verifyEmailByLink(req.query);

  return res.status(HTTP_STATUS.OK).json({
    message: "Email verified successfully",
  });
};

const verifyEmailByCode = async (
  req: TypeRequest<VerifyEmailByCodeBody>,
  res: Response,
) => {
  await authService.verifyEmailByCode(req.body);

  return res.status(HTTP_STATUS.OK).json({
    message: "Email verified successfully",
  });
};

const forgotPassword = async (
  req: TypeRequest<ForgotPasswordInput>,
  res: Response,
) => {
  await authService.forgotPassword(req.body);

  return res.status(HTTP_STATUS.OK).json({
    message: "Password reset email sent successfully",
  });
};

const resetPassword = async (
  req: TypeRequest<ResetPasswordInput>,
  res: Response,
) => {
  await authService.resetPassword(req.body);

  return res.status(HTTP_STATUS.OK).json({
    message: "Password reset successfully",
  });
};

const changePassword = async (
  req: TypeRequest<ChangePasswordInput>,
  res: Response,
) => {
  const userId = getUserIdFromRequest(req);

  await authService.changePassword(req.body, userId);

  return res.status(HTTP_STATUS.OK).json({
    message: "Password changed successfully",
  });
};

const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(AppError.unauthorized("User not authenticated"));
  }

  const { accessToken, refreshToken } = await authService.completeOAuthLogin(
    req.user,
  );

  return setAuthenticationCookies({
    res,
    accessToken,
    refreshToken,
  })
    .status(HTTP_STATUS.OK)
    .json({
      message: "User logged in successfully",
      user: req.user,
      accessToken,
      refreshToken,
    });
};

const githubCallback = async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized("User not authenticated");
  }

  const { accessToken, refreshToken } = await authService.completeOAuthLogin(
    req.user,
  );

  return setAuthenticationCookies({
    res,
    accessToken,
    refreshToken,
  })
    .status(HTTP_STATUS.OK)
    .json({
      message: "User logged in successfully",
      accessToken,
      refreshToken,
    });
};

export const authController = {
  register,
  login,
  refresh,
  logout,
  getMe: me,
  verifyEmailByLink,
  verifyEmailByCode,
  forgotPassword,
  resetPassword,
  changePassword,
  googleCallback,
  githubCallback,
};
