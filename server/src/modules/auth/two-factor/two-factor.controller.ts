import type { NextFunction, Request, Response } from "express";
import type { TwoFactorSchema } from "./two-factor.validation";
import { twoFactorService } from "./two-factor.service";
import type { TypeRequest } from "@/types";

const setupTotp = async (req: Request, res: Response) => {
  const result = await twoFactorService.setupTotp(req.auth!.userId);

  return res.status(200).json({
    message: "Two factor authentication setup successful",
    result,
  });
};

const verifyAndEnableTotp = async (
  req: TypeRequest<TwoFactorSchema>,
  res: Response,
) => {
  const { code } = req.body;

  const result = await twoFactorService.verifyAndEnableTotp(
    req.auth!.userId,
    code,
  );

  return res.status(200).json({
    message: "Two factor authentication verified and enabled",
    result,
  });
};

export const twoFactorController = {
  setupTotp,
  verifyAndEnableTotp,
};
