import { asyncHandler } from "@/middleware/async-handler.middleware";
import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "@/middleware/validate-request.middleware";
import {
  loginSchema,
  registerSchema,
  verifyEmailByLinkQuery,
  verifyEmailByCodeBody,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyTwoFactorLoginSchema,
} from "./auth.validation";
import { authenticate } from "@/middleware/authenticate.middleware";
import passport from "@/config/passport.config";
import {
  authRateLimiter,
  strictAuthRateLimiter,
  twoFactorRateLimiter,
} from "@/middleware/rate-limiting.middleware";

const authRouter: Router = Router();

authRouter
  .route("/register")
  .post(
    authRateLimiter,
    validateRequest({ body: registerSchema }),
    asyncHandler(authController.register),
  );

authRouter
  .route("/login")
  .post(
    strictAuthRateLimiter,
    validateRequest({ body: loginSchema }),
    asyncHandler(authController.login),
  );

authRouter
  .route("/refresh")
  .post(authRateLimiter, asyncHandler(authController.refresh));

authRouter
  .route("/logout")
  .post(authenticate, asyncHandler(authController.logout));

authRouter.route("/me").get(authenticate, asyncHandler(authController.getMe));

authRouter
  .route("/verify-email/link")
  .get(
    strictAuthRateLimiter,
    validateRequest({ query: verifyEmailByLinkQuery }),
    asyncHandler(authController.verifyEmailByLink),
  );

authRouter
  .route("/verify-email/code")
  .post(
    strictAuthRateLimiter,
    validateRequest({ body: verifyEmailByCodeBody }),
    asyncHandler(authController.verifyEmailByCode),
  );

authRouter
  .route("/forgot-password")
  .post(
    strictAuthRateLimiter,
    validateRequest({ body: forgotPasswordSchema }),
    asyncHandler(authController.forgotPassword),
  );

authRouter
  .route("/reset-password")
  .post(
    strictAuthRateLimiter,
    validateRequest({ body: resetPasswordSchema }),
    asyncHandler(authController.resetPassword),
  );

authRouter
  .route("/change-password")
  .post(
    authenticate,
    strictAuthRateLimiter,
    validateRequest({ body: changePasswordSchema }),
    asyncHandler(authController.changePassword),
  );

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  asyncHandler(authController.googleCallback),
);

authRouter.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
  }),
  asyncHandler(authController.githubCallback),
);

authRouter
  .route("/2fa/login")
  .post(
    twoFactorRateLimiter,
    validateRequest({ body: verifyTwoFactorLoginSchema }),
    asyncHandler(authController.verifyTwoFactorLogin),
  );

export default authRouter;
