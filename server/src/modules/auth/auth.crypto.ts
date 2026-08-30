import crypto from "node:crypto";

export const generateVerificationCode = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};
