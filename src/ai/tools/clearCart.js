const cartModel = require("../../models/cart.model.js");

const clearCart = async (userId) => {

  const cart = await cartModel.findOne({
    user: userId
  });

  if (!cart) {
    return null;
  }

  cart.items = [];

  await cart.save();

  return {
    success: true
  };
};

module.exports = clearCart;