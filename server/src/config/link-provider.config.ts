import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, type Profile } from "passport-github2";
import { appConfig } from "./app.config";

passport.use(
  "google-link",
  new GoogleStrategy(
    {
      clientID: appConfig.GOOGLE_CLIENT_ID,
      clientSecret: appConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: appConfig.GOOGLE_LINK_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        done(null, profile);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.use(
  "github-link",
  new GitHubStrategy(
    {
      clientID: appConfig.GITHUB_CLIENT_ID,
      clientSecret: appConfig.GITHUB_CLIENT_SECRET,
      callbackURL: appConfig.GITHUB_LINK_CALLBACK_URL,
    },
    async (
      _accessToken: any,
      _refreshToken: any,
      profile: Profile,
      done: any,
    ) => {
      try {
        done(null, profile);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

export default passport;
