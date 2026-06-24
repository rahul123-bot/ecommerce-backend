const userModel = require("../models/users.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_TOKEN, {
    expiresIn: "30d",
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "user already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,

      email,

      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "invalid email and password",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    res.json({
      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  register,
  login,
};
