const userModel = require("../models/users.model");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_TOKEN, {
    expiresIn: "7d",
  });
};
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, "Login OTP", `Your OTP is ${otp}`);

    res.json({
      message: "OTP Sent",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({
  _id:user._id,
  email:user.email,
  token:generateToken(user._id)
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
