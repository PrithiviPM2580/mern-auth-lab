import { AppError } from "@/errors/app.error";
import { totpService } from "./totp.service";
import User, { type IUser } from "@/models/user.model";
import { Types } from "mongoose";
import Qrcode from "qrcode";
import {
  generateRecoveryCodes,
  hashRecoveryCode,
  verifyRecoveryCodes,
} from "../auth.crypto";

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

  const recoveryCodes = generateRecoveryCodes();

  const hashedRecoveryCodes = await Promise.all(
    recoveryCodes.map(async (code) => ({
      codeHash: await hashRecoveryCode(code),
      used: false,
    })),
  );

  user.twoFactor.enabled = true;
  user.twoFactor.recoveryCodes = hashedRecoveryCodes;

  await user.save();

  return {
    enabled: true,
    recoveryCodes,
  };
};

const disableTotp = async (userId: Types.ObjectId, code: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  if (!user.twoFactor?.enabled) {
    throw AppError.badRequest("Two factor authentication is not enabled");
  }

  if (!user.twoFactor.secret) {
    throw AppError.badRequest("Two factor authentication secret not found");
  }

  const isValid = totpService.verifyTotp(code, user.twoFactor.secret);

  if (!isValid) {
    throw AppError.unauthorized("Invalid two factor authentication code");
  }

  user.twoFactor.enabled = false;
  user.twoFactor.secret = undefined;
  user.twoFactor.recoveryCodes = [];

  await user.save();

  return {
    enabled: false,
  };
};

const verifyRecoveryCode = async (user: IUser, code: string) => {
  const recoveryCodes = user.twoFactor?.recoveryCodes || [];

  for (const recoveryCode of recoveryCodes) {
    if (recoveryCode.used) {
      continue;
    }

    const isValid = await verifyRecoveryCodes(code, recoveryCode.codeHash);

    if (isValid) {
      recoveryCode.used = true;
      await user.save();
      return true;
    }
  }

  return false;
};

const regenerateRecoveryCodes = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  if (!user.twoFactor?.enabled) {
    throw AppError.badRequest("Two factor authentication is not enabled");
  }

  const recoveryCodes = generateRecoveryCodes();

  const hashedRecoveryCodes = await Promise.all(
    recoveryCodes.map(async (code) => ({
      codeHash: await hashRecoveryCode(code),
      used: false,
    })),
  );

  user.twoFactor.recoveryCodes = hashedRecoveryCodes;

  await user.save();

  return {
    recoveryCodes,
  };
};

export const twoFactorService = {
  setupTotp,
  verifyAndEnableTotp,
  disableTotp,
  verifyRecoveryCode,
  regenerateRecoveryCodes,
};
