import type { TypeRequest } from "@/types";
import type { NextFunction, Request, Response } from "express";
import type { LoginInput, RegisterInput } from "./auth.validation";
import { authService } from "./auth.service";
import { HTTP_STATUS } from "@/config/http.config";
import {
  clearAuthenticationCookies,
  setAuthenticationCookies,
} from "./auth.cookie";
import { AppError } from "@/errors/app.error";

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
  const userId = req.user?.userId;

  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  const user = await authService.getMe(userId);

  return res.status(HTTP_STATUS.OK).json({
    message: "User fetched successfully",
    user,
  });
};

export const authController = {
  register,
  login,
  refresh,
  logout,
  getMe: me,
};
