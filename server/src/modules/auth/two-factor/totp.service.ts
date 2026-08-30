import { appConfig } from "@/config/app.config";
import { generateSecret, generate, verify, generateURI } from "otplib";

const createSecret = () => {
  return generateSecret();
};

const generateOtpAuthUri = (email: string, secret: string) => {
  return generateURI({
    issuer: appConfig.JWT_ISSUER,
    label: email,
    secret,
  });
};

const generateTotp = (secret: string) => {
  return generate({
    secret,
  });
};

const verifyTotp = (token: string, secret: string) => {
  return verify({
    token,
    secret,
  });
};

export const totpService = {
  createSecret,
  generateOtpAuthUri,
  generateTotp,
  verifyTotp,
};
