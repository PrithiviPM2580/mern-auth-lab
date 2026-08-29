import { AppError } from "@/errors/app.error";
import type { LoginInput, RegisterInput } from "./auth.validation";
import User from "@/models/user.model";
import { ERROR_CODE } from "@/constants/error-code.constant";
import { signAccessToken, signRefreshToken } from "./auth.jwt";
import Session from "@/models/session.model";
import { expireIn } from "@/utils/index.util";

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

export const authService = {
  register,
  login,
};
