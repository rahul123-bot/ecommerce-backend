const express = require("express");
const authController = require("../controllers/authController.js");
const { googleLogin } = require("../controllers/googleAuthController.js");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/forgotPasswordController.js");
const { sendOtp, verifyOtp } = require("../controllers/otpController");

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

authRouter.post("/google", googleLogin);
authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/reset-password/:token", resetPassword);

authRouter.post("/send-otp", sendOtp);

authRouter.post("/verify-otp", verifyOtp);

module.exports = authRouter;
