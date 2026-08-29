import type { TypeRequest } from "@/types";
import type { Request, Response } from "express";
import type { RegisterInput } from "./auth.validation";
import { authService } from "./auth.service";
import { HTTP_STATUS } from "@/config/http.config";

const register = async (req: TypeRequest<RegisterInput>, res: Response) => {
  const user = await authService.register(req.body);

  return res.status(HTTP_STATUS.CREATED).json({
    user,
  });
};

export const authController = {
  register,
};
