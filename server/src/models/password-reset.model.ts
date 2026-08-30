import { compareValue } from "@/utils/bcrypt.util";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface PasswordResetDocument extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  compareToken(token: string): Promise<boolean>;
}

const passwordResetSchema = new Schema<PasswordResetDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

passwordResetSchema.methods.compareToken = async function (
  token: string,
): Promise<boolean> {
  return compareValue(token, this.tokenHash);
};

const PasswordReset = mongoose.model<PasswordResetDocument>(
  "PasswordReset",
  passwordResetSchema,
);

export default PasswordReset;
