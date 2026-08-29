import { hashValue } from "@/utils/bcrypt.util";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;
  userAgent?: string;
  refreshTokenHash?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
    },
    refreshTokenHash: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, any>;

        delete obj.__v;
        delete obj.refreshTokenHash;

        return obj;
      },
    },
  },
);

sessionSchema.pre<ISession>("save", async function () {
  if (!this.isModified("refreshTokenHash")) return;

  if (!this.refreshTokenHash) return;

  this.refreshTokenHash = await hashValue(this.refreshTokenHash);
});

const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;
