const express =
require("express");

const protect =
require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeWishlist,
} =
require(
  "../controllers/wishlistController"
);

const wishlistrouter =
express.Router();

wishlistrouter.get(
  "/",
  protect,
  getWishlist
);

wishlistrouter.post(
  "/add",
  protect,
  addToWishlist
);

wishlistrouter.delete(
  "/:id",
  protect,
  removeWishlist
);

module.exports =
wishlistrouter;