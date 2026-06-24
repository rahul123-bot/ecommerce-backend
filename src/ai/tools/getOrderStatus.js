const orderModel = require("../../models/order.model");

const getOrderStatus = async (
  userId,
  productName = ""
) => {

  const orders = await orderModel
    .find({ user: userId })
    .populate("items.product", "name")
    .sort({ createdAt: -1 });

  if (!orders.length) {
    return null;
  }

  let order;

  // Specific order
  if (productName && productName.trim() !== "") {

    order = orders.find(order =>
      order.items.some(item =>
        item.product?.name
          .toLowerCase()
          .includes(productName.toLowerCase())
      )
    );

  } else {

    // Latest order
    order = orders[0];

  }

  if (!order) {
    return null;
  }

  return {
    products: order.items.map(
      item => item.product.name
    ),
    status: order.status,
    totalPrice: order.totalPrice,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt
  };
};

module.exports = getOrderStatus;