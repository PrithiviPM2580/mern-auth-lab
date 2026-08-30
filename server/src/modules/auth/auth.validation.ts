import { Types } from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value), {
    error: "Invalid ObjectId",
  })
  .transform((value) => new Types.ObjectId(value));

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  userAgent: z.string().optional(),
});

export const accessTokenSchema = z.object({
  userId: objectIdSchema,
  sessionId: objectIdSchema,
});

export const refreshTokenSchema = z.object({
  sessionId: objectIdSchema,
});

export const verifyEmailByLinkQuery = z.object({
  token: z.string().min(1, "Token is required"),
});

export const verifyEmailByCodeBody = z.object({
  email: z.email("Invalid email address"),
  code: z.string().min(6, "Code must be at least 6 characters long"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AccessTokenPayload = z.infer<typeof accessTokenSchema>;
export type RefreshTokenPayload = z.infer<typeof refreshTokenSchema>;
export type VerifyEmailByLinkQuery = z.infer<typeof verifyEmailByLinkQuery>;
export type VerifyEmailByCodeBody = z.infer<typeof verifyEmailByCodeBody>;
