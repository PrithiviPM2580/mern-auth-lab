import { AppError } from "@/errors/app.error";
import { totpService } from "./totp.service";
import User from "@/models/user.model";
import { Types } from "mongoose";
import Qrcode from "qrcode";

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

  user.twoFactor.secret = secret;

  await user.save();

  return {
    secret,
    qrCode,
  };
};

const verifyAndEnableTotp = async (userId: Types.ObjectId, code: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  if (!user.twoFactor?.secret) {
    throw AppError.badRequest("Two factor authentication is not setup");
  }

  const isValid = totpService.verifyTotp(code, user.twoFactor.secret);

  if (!isValid) {
    throw AppError.unauthorized("Invalid two factor authentication code");
  }

  user.twoFactor.enabled = true;

  await user.save();

  return {
    enabled: true,
  };
};

export const twoFactorService = {
  setupTotp,
  verifyAndEnableTotp,
};
