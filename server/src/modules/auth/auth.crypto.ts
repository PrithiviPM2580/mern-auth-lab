import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const RECOVERY_CODE_COUNT = 10;

export const generateVerificationCode = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateRecoveryCodes = () => {
  const codes: string[] = [];

  for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
    const code = crypto.randomBytes(5).toString("hex").toUpperCase();

    codes.push(code);
  }

  return codes;
};

export const hashRecoveryCode = async (code: string) => {
  return bcrypt.hash(code, 12);
};

export const verifyRecoveryCodes = async (code: string, hash: string) => {
  return bcrypt.compare(code, hash);
};
