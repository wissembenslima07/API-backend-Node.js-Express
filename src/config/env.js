const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/recouvra_plus",
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:4200",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
};

module.exports = env;
