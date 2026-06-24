const cartModel = require("../../models/cart.model.js");

const addToCart = async (userId, productId) => {

  let cart = await cartModel.findOne({
    user: userId
  });

  if (!cart) {

    cart = await cartModel.create({
      user: userId,
      items: []
    });

  }

  const existingItem = cart.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (existingItem) {

    existingItem.quantity += 1;

  } else {

    cart.items.push({
      product: productId,
      quantity: 1
    });

  }

  await cart.save();

  await cart.populate("items.product");

  return cart;
};

module.exports = addToCart;