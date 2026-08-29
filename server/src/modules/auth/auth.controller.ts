import type { TypeRequest } from "@/types";
import type { Request, Response } from "express";
import type { LoginInput, RegisterInput } from "./auth.validation";
import { authService } from "./auth.service";
import { HTTP_STATUS } from "@/config/http.config";
import { setAuthenticationCookies } from "./auth.cookie";

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

export const authController = {
  register,
  login,
};
