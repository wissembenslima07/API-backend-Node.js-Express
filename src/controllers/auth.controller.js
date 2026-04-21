const { validateRegister, validateLogin } = require("../validators/auth.validator");
const { registerUser, loginUser, findUserById } = require("../services/auth.service");
const env = require("../config/env");
const { passport, googleAuthEnabled } = require("../config/passport");

function formatJoiError(error) {
  return error.details.map((detail) => detail.message);
}

async function register(req, res, next) {
  try {
    const { error, value } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const result = await registerUser(value);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { error, value } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const result = await loginUser(value);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await findUserById(req.user.sub);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return next(err);
  }
}

function startGoogleAuth(req, res, next) {
  if (!googleAuthEnabled) {
    return res.status(503).json({
      success: false,
      message: "Google authentication is not configured",
    });
  }

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: true,
  })(req, res, next);
}

function googleAuthCallback(req, res, next) {
  if (!googleAuthEnabled) {
    return res.status(503).json({
      success: false,
      message: "Google authentication is not configured",
    });
  }

  const frontendBaseUrl = env.frontendUrl.replace(/\/+$/, "");

  return passport.authenticate("google", { session: false }, (error, authPayload) => {
    if (error) {
      return next(error);
    }

    if (!authPayload) {
      return res.redirect(`${frontendBaseUrl}/login?oauth=failed`);
    }

    // Fragment strategy keeps OAuth payload out of server logs and referrer headers.
    const fragment = new URLSearchParams({
      token: authPayload.token,
      user: JSON.stringify(authPayload.user),
    }).toString();

    return res.redirect(`${frontendBaseUrl}/oauth/callback#${fragment}`);
  })(req, res, next);
}

module.exports = {
  register,
  login,
  me,
  startGoogleAuth,
  googleAuthCallback,
};
