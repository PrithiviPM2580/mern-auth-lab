import { AppError } from "@/errors/app.error";
import User from "@/models/user.model";
import type { Profile as GoogleProfile } from "passport-google-oauth20";
import type { Profile as GithubProfile } from "passport-github2";

const findOrCreateGoogleUser = async (profile: GoogleProfile) => {
  const googleId = profile.id;

  let user = await User.findOne({
    "oauth.googleId": googleId,
  });

  if (user) {
    return user;
  }

  const email = profile.emails?.[0]?.value;

  if (!email) {
    throw AppError.badRequest(
      "Google profile does not contain an email address",
    );
  }

  user = await User.findOne({ email });

  if (user) {
    user.oauth.googleId = googleId;
    await user.save();
    return user;
  }

  user = await User.create({
    name: profile.displayName,
    email,
    isEmailVerified: true,
    oauth: {
      googleId,
    },
    twoFactor: {
      enabled: false,
    },
  });

  return user;
};

const findOrCreateGitHubUser = async (profile: GithubProfile) => {
  const githubId = profile.id;

  let user = await User.findOne({
    "oauth.githubId": githubId,
  });

  if (user) {
    return user;
  }

  const email = profile.emails?.[0]?.value;

  if (!email) {
    throw AppError.badRequest(
      "GitHub profile does not contain an email address",
    );
  }

  user = await User.findOne({ email });

  if (user) {
    user.oauth.githubId = githubId;
    await user.save();
    return user;
  }

  user = await User.create({
    name: profile.displayName || profile.username,
    email,
    isEmailVerified: true,
    oauth: {
      githubId,
    },
    twoFactor: {
      enabled: false,
    },
  });

  return user;
};

export const passportAuthService = {
  findOrCreateGoogleUser,
  findOrCreateGitHubUser,
};
