import mongoose, { Schema, type Document } from "mongoose";

export interface OAuth {
  googleId?: string;
  githubId?: string;
}

export interface TwoFactor {
  enabled: boolean;
  secret?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  isEmailVerified: boolean;
  oauth: OAuth;
  twoFactor: TwoFactor;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    oauth: {
      type: {
        googleId: {
          type: String,
          unique: true,
          sparse: true,
        },
        githubId: {
          type: String,
          unique: true,
          sparse: true,
        },
      },
      default: {},
    },
    twoFactor: {
      type: {
        enabled: {
          type: Boolean,
          default: false,
        },
        secret: {
          type: String,
        },
      },
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
