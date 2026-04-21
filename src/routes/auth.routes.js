const { Router } = require("express");
const {
	register,
	login,
	me,
	startGoogleAuth,
	googleAuthCallback,
} = require("../controllers/auth.controller");
const { auth, authorize } = require("../middlewares/auth.middleware");

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/google", startGoogleAuth);
authRouter.get("/google/callback", googleAuthCallback);
authRouter.get("/me", auth, me);
authRouter.get("/manager-area", auth, authorize(["manager", "admin"]), (_req, res) => {
	return res.status(200).json({
		success: true,
		message: "Authorized access for manager/admin",
	});
});

module.exports = authRouter;
