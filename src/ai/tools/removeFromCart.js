const cartModel = require("../../models/cart.model.js");

const removeFromCart = async (
  userId,
  productName
) => {

  const cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product");

  if (!cart) {
    return null;
  }

  const oldLength = cart.items.length;

  cart.items = cart.items.filter(
    item =>
      !item.product.name
        .toLowerCase()
        .includes(productName.toLowerCase())
  );

  if (oldLength === cart.items.length) {
    return {
      success: false,
      message: "Product not found in cart"
    };
  }

  await cart.save();

  return {
    success: true
  };
};

module.exports = removeFromCart;