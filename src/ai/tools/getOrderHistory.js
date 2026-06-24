const orderModel = require("../../models/order.model");

const getOrderHistory = async (userId) => {

  const orders = await orderModel
    .find({ user: userId })
    .populate("items.product", "name")
    .sort({ createdAt: -1 });

  if (!orders.length) {
    return null;
  }

  return orders.map(order => ({
    products: order.items.map(
      item => item.product.name
    ),
    totalPrice: order.totalPrice,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt
  }));
};

module.exports = getOrderHistory;