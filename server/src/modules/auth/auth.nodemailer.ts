import { appConfig } from "@/config/app.config";
import { transporter } from "@/config/nodemailer.config";
import type { EmailVerificationMethod } from "@/models/email-verification.model";

interface SendVerificationEmailInput {
  email: string;
  token: string;
  method: EmailVerificationMethod;
}

interface SendPasswordResetEmailInput {
  email: string;
  token: string;
}

export const sendVerificationEmail = async ({
  email,
  token,
  method,
}: SendVerificationEmailInput) => {
  const subject = "Verify your email";

  const verificationContent =
    method === "code"
      ? `
          <p style="
            margin: 0 0 12px;
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
          ">
            Use the verification code below to verify your email address:
          </p>

          <div style="
            margin: 24px 0;
            padding: 18px;
            background-color: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            text-align: center;
          ">
            <span style="
              color: #111827;
              font-size: 32px;
              font-weight: 700;
              letter-spacing: 8px;
            ">
              ${token}
            </span>
          </div>

          <p style="
            margin: 0;
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          ">
            This code will expire in
            <strong>${appConfig.EMAIL_VERIFICATION_EXPIRES_MINUTES} minutes</strong>.
          </p>
        `
      : `
          <p style="
            margin: 0 0 24px;
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
          ">
            Thanks for signing up! Click the button below to verify your
            email address and activate your account.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a
              href="${appConfig.FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}"
              style="
                display: inline-block;
                padding: 14px 28px;
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                font-size: 16px;
                font-weight: 600;
                border-radius: 8px;
              "
            >
              Verify Email
            </a>
          </div>

          <p style="
            margin: 0;
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          ">
            This link will expire in
            <strong>${appConfig.EMAIL_VERIFICATION_EXPIRES_MINUTES} minutes</strong>.
          </p>
        `;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <div style="
          width: 100%;
          padding: 40px 16px;
          box-sizing: border-box;
        ">
          <div style="
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          ">

            <!-- Header -->
            <div style="
              padding: 28px 32px;
              background-color: #2563eb;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 24px;
                font-weight: 700;
              ">
                Verify Your Email
              </h1>
            </div>

            <!-- Content -->
            <div style="
              padding: 36px 32px;
            ">
              <h2 style="
                margin: 0 0 16px;
                color: #111827;
                font-size: 20px;
              ">
                Welcome!
              </h2>

              ${verificationContent}

              <p style="
                margin: 32px 0 0;
                color: #4b5563;
                font-size: 15px;
                line-height: 1.6;
              ">
                If you didn't create an account, you can safely ignore this
                email.
              </p>
            </div>

            <!-- Footer -->
            <div style="
              padding: 20px 32px;
              background-color: #f9fafb;
              border-top: 1px solid #e5e7eb;
              text-align: center;
            ">
              <p style="
                margin: 0;
                color: #9ca3af;
                font-size: 13px;
              ">
                © ${new Date().getFullYear()} Your App. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html,
  });
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: SendPasswordResetEmailInput) => {
  const resetUrl = `${appConfig.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <h1>Reset your password</h1>

    <p>
      We received a request to reset your password.
    </p>

    <p>
      Click the button below to choose a new password.
    </p>

    <a href="${resetUrl}">
      Reset Password
    </a>

    <p>
      This link will expire in 15 minutes.
    </p>

    <p>
      If you didn't request a password reset, you can safely ignore this email.
    </p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your password",
    html,
  });
};
