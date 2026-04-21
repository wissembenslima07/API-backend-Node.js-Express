const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const env = require("../config/env");

function sanitizeUser(userDocument) {
  return {
    id: userDocument._id.toString(),
    fullName: userDocument.fullName,
    email: userDocument.email,
    role: userDocument.role,
    isActive: userDocument.isActive,
    createdAt: userDocument.createdAt,
    updatedAt: userDocument.updatedAt,
  };
}

function signAccessToken(userDocument) {
  return jwt.sign(
    {
      sub: userDocument._id.toString(),
      role: userDocument.role,
      email: userDocument.email,
    },
    env.jwtSecret,
    { expiresIn: "1d" }
  );
}

function createAuthPayload(userDocument) {
  return {
    token: signAccessToken(userDocument),
    user: sanitizeUser(userDocument),
  };
}

async function registerUser(payload) {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email.toLowerCase(),
    passwordHash,
    authProvider: "local",
    role: payload.role || "agent",
  });

  return createAuthPayload(user);
}

async function loginUser(payload) {
  const user = await User.findOne({ email: payload.email.toLowerCase() });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.passwordHash) {
    const error = new Error("This account uses social login");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("User is inactive");
    error.statusCode = 403;
    throw error;
  }

  return createAuthPayload(user);
}

async function findUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
}

function buildGoogleProfilePayload(profile) {
  const primaryEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

  if (!primaryEmail) {
    const error = new Error("Google account email not available");
    error.statusCode = 400;
    throw error;
  }

  const normalizedFullName =
    profile.displayName ||
    [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(" ").trim() ||
    primaryEmail;

  return {
    googleId: profile.id,
    email: primaryEmail.toLowerCase(),
    fullName: normalizedFullName,
  };
}

async function upsertGoogleUser(payload) {
  const user = await User.findOne({
    $or: [{ googleId: payload.googleId }, { email: payload.email }],
  });

  if (!user) {
    return User.create({
      fullName: payload.fullName,
      email: payload.email,
      authProvider: "google",
      googleId: payload.googleId,
      role: "agent",
      passwordHash: null,
    });
  }

  if (!user.isActive) {
    const error = new Error("User is inactive");
    error.statusCode = 403;
    throw error;
  }

  user.authProvider = "google";
  user.googleId = user.googleId || payload.googleId;
  if (!user.fullName) {
    user.fullName = payload.fullName;
  }

  await user.save();
  return user;
}

module.exports = {
  registerUser,
  loginUser,
  findUserById,
  createAuthPayload,
  buildGoogleProfilePayload,
  upsertGoogleUser,
};
