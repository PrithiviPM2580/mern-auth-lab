import { AppError } from "@/errors/app.error";
import type {
  AccessTokenPayload,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailByCodeBody,
  VerifyEmailByLinkQuery,
  VerifyTwoFactorLoginInput,
} from "./auth.validation";
import User from "@/models/user.model";
import { ERROR_CODE } from "@/constants/error-code.constant";
import {
  createAuthTokens,
  signAccessToken,
  signRefreshToken,
  signTwoFactorChallenge,
  verifyRefreshToken,
  verifyTwoFactorChallenge,
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
import { totpService } from "./two-factor/totp.service";
import { twoFactorService } from "./two-factor/two-factor.service";
import { MAX_LOGIN_ATTEMPTS, LOCK_TIME_MS } from "@/constants/index.constant";

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

  // Check whether the account is currently locked
  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    throw AppError.tooManyRequests(
      "Too many failed login attempts. Please try again later.",
    );
  }

  // Lock period has expired
  if (user.lockedUntil && user.lockedUntil.getTime() <= Date.now()) {
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    await user.save();
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCK_TIME_MS);
    }

    await user.save();

    throw AppError.unauthorized("Invalid email or password");
  }

  // Password is correct, reset failed-login state
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;

  await user.save();

  if (!user.isEmailVerified) {
    throw AppError.unauthorized("Email is not verified");
  }

  if (user.twoFactor?.enabled) {
    const twoFactorToken = signTwoFactorChallenge({
      userId: user._id,
      type: "2fa",
    });

    return {
      requiresTwoFactor: true,
      twoFactorToken,
    };
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
    requiresTwoFactor: false,
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

  await Session.deleteMany({
    userId: user._id,
  });

  await passwordReset.deleteOne();
};

const changePassword = async (
  input: ChangePasswordInput,
  userId: Types.ObjectId,
  currentSessionId: Types.ObjectId,
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

  await Session.deleteMany({
    userId,
    _id: { $ne: currentSessionId },
  });
};

const completeOAuthLogin = async (user: any) => {
  const session = await Session.create({
    userId: user._id,
    expiresAt: expireIn(),
  });

  const tokenPayload: AccessTokenPayload = {
    userId: user._id,
    sessionId: session._id,
  };

  const { accessToken, refreshToken } = await createAuthTokens(tokenPayload);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const verifyTwoFactorLogin = async (input: VerifyTwoFactorLoginInput) => {
  const { twoFactorToken, code, userAgent } = input;

  const challenge = verifyTwoFactorChallenge(twoFactorToken);

  const user = await User.findById(challenge.userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  if (!user.twoFactor?.enabled || !user.twoFactor.secret) {
    throw AppError.badRequest(
      "Two factor authentication is not enabled for this user",
    );
  }

  const isCodeValid = totpService.verifyTotp(code, user.twoFactor.secret);

  if (!isCodeValid) {
    const isRecoveryCodeValid = await twoFactorService.verifyRecoveryCode(
      user,
      code,
    );
    if (!isRecoveryCodeValid) {
      throw AppError.unauthorized("Invalid two factor authentication code");
    }
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

  return {
    user,
    accessToken,
    refreshToken,
  };
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
  completeOAuthLogin,
  verifyTwoFactorLogin,
};
