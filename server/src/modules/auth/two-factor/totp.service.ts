import { generateSecret, generate, verify, generateURI } from "otplib";
import { appConfig } from "@/config/app.config";
import { AppError } from "@/errors/app.error";
import User from "@/models/user.model";
import type { Types } from "mongoose";

const createSecret = () => {
  return generateSecret();
};

const generateOtpAuthUri = (email: string, secret: string) => {
  return generateURI({
    issuer: appConfig.JWT_ISSUER,
    label: email,
    secret,
  });
};

const generateTotp = (secret: string) => {
  return generate({
    secret,
  });
};

const verifyTotp = (token: string, secret: string) => {
  return verify({
    token,
    secret,
  });
};

const disableTotp = async (userId: Types.ObjectId, code: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  if (!user.twoFactor?.enabled || !user.twoFactor?.secret) {
    throw AppError.badRequest(
      "Two factor authentication is not enabled for this user",
    );
  }

  const isValid = totpService.verifyTotp(code, user.twoFactor.secret);

  if (!isValid) {
    throw AppError.unauthorized("Invalid two factor authentication code");
  }

  user.twoFactor.enabled = false;
  user.twoFactor.secret = undefined;

  await user.save();

  return {
    enabled: false,
  };
};

export const totpService = {
  createSecret,
  generateOtpAuthUri,
  generateTotp,
  verifyTotp,
};
