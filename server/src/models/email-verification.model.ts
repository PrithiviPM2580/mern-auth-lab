import { compareValue } from "@/utils/bcrypt.util";
import mongoose, { Schema, Document, Types } from "mongoose";

export type EmailVerificationMethod = "code" | "link";

export interface IEmailVerification extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  method: EmailVerificationMethod;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  compareToken(token: string): Promise<boolean>;
}

const emailVerificationSchema: Schema<IEmailVerification> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    method: { type: String, enum: ["code", "link"], required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  {
    timestamps: true,
  },
);

emailVerificationSchema.methods.compareToken = async function (
  token: string,
): Promise<boolean> {
  return compareValue(token, this.tokenHash);
};

const EmailVerification = mongoose.model<IEmailVerification>(
  "EmailVerification",
  emailVerificationSchema,
);

export default EmailVerification;
