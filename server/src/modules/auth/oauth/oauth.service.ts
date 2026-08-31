import { AppError } from "@/errors/app.error";
import User from "@/models/user.model";
import { Types } from "mongoose";

const linkGoogle = async (userId: Types.ObjectId, googleId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  if (user.oauth.googleId) {
    throw AppError.badRequest("Google account already linked");
  }

  const existingUser = await User.findOne({ "oauth.googleId": googleId });

  if (existingUser) {
    throw AppError.conflict("Google account already linked to another user");
  }

  user.oauth.googleId = googleId;

  await user.save();

  return {
    provider: "google",
    linked: true,
  };
};

const linkGithub = async (userId: Types.ObjectId, githubId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  if (user.oauth.githubId) {
    throw AppError.badRequest("GitHub account already linked");
  }

  const existingUser = await User.findOne({ "oauth.githubId": githubId });

  if (existingUser) {
    throw AppError.conflict("GitHub account already linked to another user");
  }

  user.oauth.githubId = githubId;

  await user.save();

  return {
    provider: "github",
    linked: true,
  };
};

export const oauthService = {
  linkGoogle,
  linkGithub,
};
