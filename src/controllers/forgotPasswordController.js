const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userModel = require("../models/users.model");
const sendEmail = require("../utils/sendEmail");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const clientUrl =
      process.env.CLIENT_URL?.replace(/\/$/, "") ||
      req.headers.origin?.replace(/\/$/, "") ||
      `${req.protocol}://${req.get("host")}`;

    const resetUrl =
      `${clientUrl}/reset-password/${resetToken}`;
    console.log("RESET URL:", resetUrl);
    await sendEmail(
      user.email,
      "Password Reset Request",
      `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
        <h2>Password Reset Request</h2>

        <p>Hello ${user.name},</p>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            background:#f97316;
            color:white;
            text-decoration:none;
            padding:12px 20px;
            border-radius:6px;
            font-weight:bold;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:20px;">
          This link will expire in 15 minutes.
        </p>

        <p>
          If you did not request this password reset,
          please ignore this email.
        </p>
      </div>
      `
    );

    return res.status(200).json({
      success: true,
      message: "Password reset link sent",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        error.message ||
        "Failed to send password reset email",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};