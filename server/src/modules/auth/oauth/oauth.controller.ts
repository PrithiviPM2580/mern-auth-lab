import type { NextFunction, Request, Response } from "express";
import type { Profile as GoogleProfile } from "passport-google-oauth20";
import type { Profile as GithubProfile } from "passport-github2";

import passport from "@/config/link-provider.config";
import { AppError } from "@/errors/app.error";
import {
  createOAuthLinkState,
  verifyOAuthLinkState,
} from "@/utils/oauth-state.util";
import { oauthService } from "./oauth.service";

const googleLink = async (req: Request, res: Response, next: NextFunction) => {
  const state = createOAuthLinkState(req.auth!.userId, "google");

  return passport.authenticate("google-link", {
    scope: ["profile", "email"],
    state,
  })(req, res, next);
};

const githubLink = async (req: Request, res: Response, next: NextFunction) => {
  const state = createOAuthLinkState(req.auth!.userId, "github");

  return passport.authenticate("github-link", {
    scope: ["user:email"],
    state,
  })(req, res, next);
};

const googleLinkCallback = async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized("OAuth account not authenticated");
  }

  const state = req.query.state;

  if (typeof state !== "string") {
    throw AppError.unauthorized("Invalid OAuth state");
  }

  const { userId } = verifyOAuthLinkState(state, "google");

  const profile = req.user as GoogleProfile;

  const result = await oauthService.linkGoogle(userId, profile.id);

  return res.status(200).json({
    message: "Google account linked successfully",
    result,
  });
};

const githubLinkCallback = async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized("OAuth account not authenticated");
  }

  const state = req.query.state;

  if (typeof state !== "string") {
    throw AppError.unauthorized("Invalid OAuth state");
  }

  const { userId } = verifyOAuthLinkState(state, "github");

  const profile = req.user as GithubProfile;

  const result = await oauthService.linkGithub(userId, profile.id);

  return res.status(200).json({
    message: "GitHub account linked successfully",
    result,
  });
};

export const oauthController = {
  googleLink,
  githubLink,
  googleLinkCallback,
  githubLinkCallback,
};
