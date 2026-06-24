const bcrypt = require("bcryptjs");
const userModel = require("../models/users.model.js");

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      message: "User Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.role = "admin";

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      newPassword,
      salt
    );

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
  // ADD ADDRESS
const addAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newAddress = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      pincode: req.body.pincode,
      state: req.body.state,
      city: req.body.city,
      houseNo: req.body.houseNo,
      area: req.body.area,
      landmark: req.body.landmark,
      type: req.body.type,
      isDefault:
        user.addresses.length === 0 ? true : false,
    };

    user.addresses.push(newAddress);

    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ADDRESSES
const getAddresses = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE ADDRESS
const updateAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    address.fullName =
      req.body.fullName || address.fullName;

    address.phone =
      req.body.phone || address.phone;

    address.pincode =
      req.body.pincode || address.pincode;

    address.state =
      req.body.state || address.state;

    address.city =
      req.body.city || address.city;

    address.houseNo =
      req.body.houseNo || address.houseNo;

    address.area =
      req.body.area || address.area;

    address.landmark =
      req.body.landmark || address.landmark;

    address.type =
      req.body.type || address.type;

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE ADDRESS
const deleteAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    user.addresses.pull(req.params.id);

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SET DEFAULT ADDRESS
const setDefaultAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    user.addresses.forEach((address) => {
      address.isDefault = false;
    });

    const selectedAddress =
      user.addresses.id(req.params.id);

    if (!selectedAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    selectedAddress.isDefault = true;

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getUsers,
  deleteUser,
  makeAdmin,
  getProfile,
  updateProfile,
  changePassword,

  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
