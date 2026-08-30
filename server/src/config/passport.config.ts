import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, type Profile } from "passport-github2";
import { appConfig } from "./app.config";
import { passportAuthService } from "@/modules/auth/auth.passport";

passport.use(
  new GoogleStrategy(
    {
      clientID: appConfig.GOOGLE_CLIENT_ID,
      clientSecret: appConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: appConfig.GOOGLE_CALLBACK_URL,
    },
    async (_accessTokenSchema, _refreshTokenSchema, profile, done) => {
      try {
        const user = await passportAuthService.findOrCreateGoogleUser(profile);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: appConfig.GITHUB_CLIENT_ID,
      clientSecret: appConfig.GITHUB_CLIENT_SECRET,
      callbackURL: appConfig.GITHUB_CALLBACK_URL,
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: Profile,
      done: any,
    ) => {
      try {
        const user = await passportAuthService.findOrCreateGitHubUser(profile);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

export default passport;
