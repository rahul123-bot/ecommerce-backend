const bcrypt = require("bcryptjs");
const userModel = require("../models/users.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = await bcrypt.hash(otp, 10);

    user.otpExpire =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(
      user.email,
      "Login OTP",
      `
      <h2>AI Shop Login OTP</h2>

      <h1>${otp}</h1>

      <p>
        OTP expires in 5 minutes.
      </p>
      `
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
const config = require("../config/config");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    config.JWT_TOKEN,
    {
      expiresIn: "7d",
    }
  );
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user =
      await userModel.findOne({
        email: email
          ?.toLowerCase()
          .trim(),
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      !user.otp ||
      !user.otpExpire
    ) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const isMatch =
      await bcrypt.compare(
        otp,
        user.otp
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,

      token: generateToken(
        user._id
      ),

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports ={ sendOtp , verifyOtp};