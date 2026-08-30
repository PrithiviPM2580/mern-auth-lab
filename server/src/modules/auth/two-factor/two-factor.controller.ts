import type { NextFunction, Request, Response } from "express";
import { twoFactorService } from "./two-factor.service";

const setupTotp = async (req: Request, res: Response) => {
  const result = await twoFactorService.setupTotp(req.auth!.userId);

  return res.status(200).json({
    message: "Two factor authentication setup successful",
    result,
  });
};

export const twoFactorController = {
  setupTotp,
};
