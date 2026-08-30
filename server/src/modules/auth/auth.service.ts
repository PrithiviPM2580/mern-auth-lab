import { AppError } from "@/errors/app.error";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailByCodeBody,
  VerifyEmailByLinkQuery,
} from "./auth.validation";
import User from "@/models/user.model";
import { ERROR_CODE } from "@/constants/error-code.constant";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./auth.jwt";
import Session from "@/models/session.model";
import { expireIn } from "@/utils/index.util";
import type { Types } from "mongoose";
import type { EmailVerificationMethod } from "@/models/email-verification.model";
import {
  generateVerificationCode,
  generateVerificationToken,
} from "./auth.crypto";
import { appConfig } from "@/config/app.config";
import EmailVerification from "@/models/email-verification.model";
import { hashValue } from "@/utils/bcrypt.util";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "./auth.nodemailer";
import PasswordReset from "@/models/password-reset.model";

const register = async (input: RegisterInput) => {
  const { name, email, password } = input;

  const existingUser = await User.exists({ email });

  if (existingUser) {
    throw AppError.conflict(
      "User with this email already exists",
      ERROR_CODE.AUTH_EMAIL_ALREADY_EXISTS,
    );
  }

  const newUser = await User.create({
    name,
    email,
    passwordHash: password,
  });

  const verificationToken = await createVerification(newUser._id, "link");

  await sendVerificationEmail({
    email: newUser.email,
    token: verificationToken,
    method: "link",
  });

  return newUser;
};

const login = async (input: LoginInput) => {
  const { email, password, userAgent } = input;

  const user = await User.findOne({ email });

  if (!user) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const session = await Session.create({
    userId: user._id,
    userAgent,
    expiresAt: expireIn(),
  });

  const accessToken = signAccessToken({
    userId: user._id,
    sessionId: session._id,
  });

  const refreshToken = signRefreshToken({
    sessionId: session._id,
  });

  session.refreshTokenHash = refreshToken;

  await session.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refresh = async (refreshToken: string) => {
  const { sessionId } = verifyRefreshToken(refreshToken);

  const session = await Session.findById(sessionId);

  if (!session) {
    throw AppError.unauthorized("Invalid refresh token");
  }

  if (session.expiresAt < new Date()) {
    throw AppError.unauthorized("Refresh token has expired");
  }

  const isVlaidRefreshToken = await session.compareRefreshToken(refreshToken);

  if (!isVlaidRefreshToken) {
    throw AppError.unauthorized("Invalid refresh token");
  }

  const accessToken = signAccessToken({
    userId: session.userId,
    sessionId: session._id,
  });

  const newRefreshToken = signRefreshToken({
    sessionId: session._id,
  });

  session.refreshTokenHash = newRefreshToken;

  await session.save();

  return {
    accessToken,
    newRefreshToken,
  };
};

const logout = async (refreshToken: string) => {
  const { sessionId } = verifyRefreshToken(refreshToken);

  const session = await Session.findById(sessionId);

  if (!session) {
    throw AppError.unauthorized("Invalid refresh token");
  }

  await session.deleteOne();
};

const getMe = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  return user;
};

const createVerification = async (
  userId: Types.ObjectId,
  method: EmailVerificationMethod,
) => {
  const rawToken =
    method === "code"
      ? generateVerificationCode()
      : generateVerificationToken();

  const tokenHash = await hashValue(rawToken);

  const expiresAt = new Date(
    Date.now() + appConfig.EMAIL_VERIFICATION_EXPIRES_MINUTES * 60 * 1000,
  );

  await EmailVerification.findOneAndUpdate(
    { userId },
    {
      userId,
      tokenHash,
      method,
      expiresAt,
    },
    { upsert: true, returnDocument: "after" },
  );

  return rawToken;
};

const verifyEmailByLink = async (token: VerifyEmailByLinkQuery) => {
  const verifications = await EmailVerification.find({
    method: "link",
  });

  for (const verification of verifications) {
    if (verification.expiresAt < new Date()) {
      continue;
    }

    const isValid = await verification.compareToken(token.token);

    if (!isValid) {
      continue;
    }

    const user = await User.findById(verification.userId);

    if (!user) {
      throw AppError.notFound("User not found");
    }

    if (user.isEmailVerified) {
      throw AppError.badRequest("Email is already verified");
    }

    user.isEmailVerified = true;

    await user.save();

    await verification.deleteOne();

    return;
  }

  throw AppError.badRequest("Invalid or expired verification token");
};

const verifyEmailByCode = async (body: VerifyEmailByCodeBody) => {
  const { code, email } = body;

  const user = await User.findOne({ email });

  if (!user) {
    throw AppError.notFound("User not found");
  }

  if (user.isEmailVerified) {
    throw AppError.badRequest("Email is already verified");
  }

  const emailVerification = await EmailVerification.findOne({
    userId: user._id,
    method: "code",
  });

  if (!emailVerification) {
    throw AppError.notFound("Email verification not found");
  }

  if (emailVerification.expiresAt < new Date()) {
    throw AppError.badRequest("Verification code has expired");
  }

  const isCodeValid = await emailVerification.compareToken(code);

  if (!isCodeValid) {
    throw AppError.badRequest("Invalid verification code");
  }

  user.isEmailVerified = true;

  await user.save();

  await emailVerification.deleteOne();
};

const forgotPassword = async (body: ForgotPasswordInput) => {
  const { email } = body;

  const user = await User.findOne({ email });

  if (!user) {
    throw AppError.notFound("User not found");
  }

  const rawToken = generateVerificationToken();

  const tokenHash = await hashValue(rawToken);

  const expiresAt = new Date(
    Date.now() + appConfig.PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1000,
  );

  await PasswordReset.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      tokenHash,
      expiresAt,
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  await sendPasswordResetEmail({
    email: user.email,
    token: rawToken,
  });
};

const resetPassword = async (input: ResetPasswordInput) => {
  const { token, password } = input;

  const resetRecords = await PasswordReset.find({
    expiresAt: { $gt: new Date() },
  });

  let passwordReset = null;

  for (const record of resetRecords) {
    const isValid = await record.compareToken(token);

    if (isValid) {
      passwordReset = record;
      break;
    }
  }

  if (!passwordReset) {
    throw AppError.badRequest("Invalid or expired password reset token");
  }

  const user = await User.findById(passwordReset.userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  user.passwordHash = await hashValue(password);

  await user.save();

  await passwordReset.deleteOne();
};

const changePassword = async (
  input: ChangePasswordInput,
  userId: Types.ObjectId,
) => {
  const { currentPassword, newPassword } = input;

  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  const isCurrentPasswordValid = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordValid) {
    throw AppError.unauthorized("Current password is incorrect");
  }

  user.passwordHash = newPassword;

  await user.save();
};

export const authService = {
  register,
  login,
  refresh,
  logout,
  getMe,
  verifyEmailByLink,
  verifyEmailByCode,
  forgotPassword,
  resetPassword,
  changePassword,
};
