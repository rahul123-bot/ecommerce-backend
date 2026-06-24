
const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
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
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/profile", protect, getProfile);
userRouter.put("/profile", protect, updateProfile);
userRouter.put("/change-password", protect, changePassword);

// ADDRESS
userRouter.get("/address", protect, getAddresses);
userRouter.post("/address", protect, addAddress);
userRouter.put("/address/:id", protect, updateAddress);
userRouter.delete("/address/:id", protect, deleteAddress);
userRouter.put("/address/default/:id", protect, setDefaultAddress);

// ADMIN
userRouter.get("/", protect, adminOnly, getUsers);
userRouter.delete("/:id", protect, adminOnly, deleteUser);
userRouter.put("/:id/admin", protect, adminOnly, makeAdmin);
module.exports = userRouter;
