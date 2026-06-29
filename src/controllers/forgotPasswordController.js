const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userModel = require("../models/users.model");
const sendEmail = require("../utils/sendEmail");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail =
      email?.toLowerCase().trim();

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset",
      `
      <h2>Password Reset Request</h2>

      <p>Click the link below:</p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>Link expires in 15 minutes.</p>
      `
    );

    res.status(200).json({
      success: true,
      message:
        "Password reset link sent",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    const user =
      await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: {
          $gt: Date.now(),
        },
      });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports={
   forgotPassword,
   resetPassword,
}
