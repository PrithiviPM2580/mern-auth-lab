import { appConfig } from "./app.config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: appConfig.SMTP_HOST,
  port: appConfig.SMTP_PORT,
  secure: true,
  auth: {
    user: appConfig.SMTP_USER,
    pass: appConfig.SMTP_PASSWORD,
  },
});
