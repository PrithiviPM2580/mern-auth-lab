import { Types } from "mongoose";
import { z } from "zod";

export const twoFactorChallengeSchema = z.object({
  userId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), "Invalid user ID")
    .transform((val) => new Types.ObjectId(val)),
  type: z.literal("2fa"),
});

export const twoFactorSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters long"),
});

export type TwoFactorChallengePayload = z.infer<
  typeof twoFactorChallengeSchema
>;
export type TwoFactorSchema = z.infer<typeof twoFactorSchema>;
