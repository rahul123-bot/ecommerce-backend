const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/users.model.js");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_TOKEN, {
    expiresIn: "7d",
  });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name } = payload;

    let user = await userModel.findOne({
      email,
    });

    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: "google-login",
      });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  googleLogin,
};
