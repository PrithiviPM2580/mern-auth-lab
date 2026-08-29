import { AppError } from "@/errors/app.error";
import type { RegisterInput } from "./auth.validation";
import User from "@/models/user.model";
import { ERROR_CODE } from "@/constants/error-code.constant";

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

export const authService = {
  register,
};
