import { Router } from "express";
import passport from "@/config/passport.config";
import { authenticate } from "@/middleware/authenticate.middleware";
import { asyncHandler } from "@/middleware/async-handler.middleware";
import { oauthController } from "./oauth.controller";
import { doubleCsrfProtection } from "@/middleware/csrf.middleware";
import { twoFactorRateLimiter } from "@/middleware/rate-limiting.middleware";

const oauthRouter: Router = Router();

oauthRouter.get(
  "/google/link",
  authenticate,
  twoFactorRateLimiter,
  doubleCsrfProtection,
  asyncHandler(oauthController.googleLink),
);

oauthRouter.get(
  "/google/link/callback",
  passport.authenticate("google-link", {
    session: false,
  }),
  asyncHandler(oauthController.googleLinkCallback),
);

oauthRouter.get(
  "/github/link",
  authenticate,
  twoFactorRateLimiter,
  doubleCsrfProtection,
  asyncHandler(oauthController.githubLink),
);

oauthRouter.get(
  "/github/link/callback",
  passport.authenticate("github-link", {
    session: false,
  }),
  asyncHandler(oauthController.githubLinkCallback),
);

oauthRouter.delete(
  "/google/unlink",
  authenticate,
  twoFactorRateLimiter,
  doubleCsrfProtection,
  asyncHandler(oauthController.unlinkGoogle),
);

oauthRouter.delete(
  "/github/unlink",
  authenticate,
  twoFactorRateLimiter,
  doubleCsrfProtection,
  asyncHandler(oauthController.unlinkGithub),
);

export default oauthRouter;
