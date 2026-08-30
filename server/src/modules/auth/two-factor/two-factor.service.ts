import { AppError } from "@/errors/app.error";
import { totpService } from "./totp.service";
import User from "@/models/user.model";
import { Types } from "mongoose";
import Qrcode from "qrcode";
import type { Type } from "typescript";

const setupTotp = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  if (user.twoFactor?.enabled) {
    throw AppError.badRequest("Two factor authentication is already enabled");
  }

  const secret = totpService.createSecret();

  const otpAuthUri = totpService.generateOtpAuthUri(user.email, secret);

  const qrCode = await Qrcode.toDataURL(otpAuthUri);

  return {
    secret,
    qrCode,
  };
};

export const twoFactorService = {
  setupTotp,
};
