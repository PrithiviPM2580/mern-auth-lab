import { AppError } from "@/errors/app.error";
import type { LoginInput, RegisterInput } from "./auth.validation";
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

export const authService = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
