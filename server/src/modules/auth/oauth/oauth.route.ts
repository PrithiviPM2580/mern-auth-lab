import { Router } from "express";
import passport from "@/config/passport.config";
import { authenticate } from "@/middleware/authenticate.middleware";
import { asyncHandler } from "@/middleware/async-handler.middleware";
import { oauthController } from "./oauth.controller";

const oauthRouter: Router = Router();

oauthRouter.get(
  "/google/link",
  authenticate,
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
  asyncHandler(oauthController.githubLink),
);

oauthRouter.get(
  "/github/link/callback",
  passport.authenticate("github-link", {
    session: false,
  }),
  asyncHandler(oauthController.githubLinkCallback),
);

export default oauthRouter;
