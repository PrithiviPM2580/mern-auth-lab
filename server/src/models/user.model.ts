import { compareValue, hashValue } from "@/utils/bcrypt.util";
import mongoose, { Schema, type Document } from "mongoose";

export type TwoFactorMethod = "totp" | "hotp";

export interface OAuth {
  googleId?: string;
  githubId?: string;
}

export interface TwoFactor {
  enabled: boolean;
  method?: TwoFactorMethod;
  secret?: string;
  counter?: number;
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

  comparePassword: (password: string) => Promise<boolean>;
}

const oAuthSchema = new Schema<OAuth>(
  {
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
  {
    _id: false,
  },
);

const twoFactorSchema = new Schema<TwoFactor>(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    method: {
      type: String,
      enum: ["totp", "hotp"],
    },
    secret: {
      type: String,
    },
    counter: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

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
      type: oAuthSchema,
      default: () => ({}),
    },
    twoFactor: {
      type: twoFactorSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, any>;

        delete obj.passwordHash;
        delete obj.__v;

        if (obj.twoFactor) {
          delete obj.twoFactor.secret;
        }

        return obj;
      },
    },
  },
);

userSchema;

userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("passwordHash")) return;

  if (!this.passwordHash) return;

  this.passwordHash = await hashValue(this.passwordHash);
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return this.passwordHash
    ? await compareValue(password, this.passwordHash)
    : false;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
