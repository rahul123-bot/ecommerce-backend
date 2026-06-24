const express = require("express");
const authController = require("../controllers/authController.js");
const { googleLogin } = require("../controllers/googleAuthController.js");
const {
sendOtp,
verifyOtp
} = require("../controllers/otpController.js");
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

authRouter.post("/google", googleLogin);
authRouter.post("/send-otp",sendOtp);

authRouter.post("/verify-otp",verifyOtp);


module.exports = authRouter;
