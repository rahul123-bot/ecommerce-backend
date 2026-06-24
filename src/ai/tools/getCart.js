const cartModel = require("../../models/cart.model.js");

const getCart = async (userId) => {

  const cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product");

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return {
    items: cart.items.map(item => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }))
  };
};

module.exports = getCart;