const Wishlist = require("../models/wishlist.model");

const addToWishlist =
async (req, res) => {

  try {

    const { productId } =
      req.body;

    let wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    if (!wishlist) {

      wishlist =
        await Wishlist.create({
          user: req.user._id,
          products: [],
        });

    }

    if (
      !wishlist.products.includes(
        productId
      )
    ) {

      wishlist.products.push(
        productId
      );

      await wishlist.save();

    }

    res.json(wishlist);

  } catch (error) {

    res.status(500).json({
      message:
      error.message,
    });

  }

};

const getWishlist =
async (req, res) => {

  try {

    const wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      }).populate("products");

    res.json(
      wishlist || {
        products: [],
      }
    );

  } catch (error) {

    res.status(500).json({
      message:
      error.message,
    });

  }

};

const removeWishlist =
async (req, res) => {

  try {

    const wishlist =
      await Wishlist.findOne({
        user: req.user._id,
      });

    wishlist.products =
      wishlist.products.filter(

        (id) =>

          id.toString() !==
          req.params.id

      );

    await wishlist.save();

    res.json(wishlist);

  } catch (error) {

    res.status(500).json({
      message:
      error.message,
    });

  }

};

module.exports = {
  addToWishlist,
  getWishlist,
  removeWishlist,
};