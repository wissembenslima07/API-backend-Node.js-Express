const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const env = require("./env");
const {
  buildGoogleProfilePayload,
  upsertGoogleUser,
  createAuthPayload,
} = require("../services/auth.service");

let googleAuthEnabled = false;

if (env.googleClientId && env.googleClientSecret && env.googleCallbackUrl) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Strategy pattern: delegate provider-specific profile mapping to auth service.
          const payload = buildGoogleProfilePayload(profile);
          const user = await upsertGoogleUser(payload);
          const authPayload = createAuthPayload(user);
          return done(null, authPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  googleAuthEnabled = true;
}

module.exports = {
  passport,
  googleAuthEnabled,
};
