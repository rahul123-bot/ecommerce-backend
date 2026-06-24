const orderModel = require("../../models/order.model");

const cancelOrder = async (userId, productName = "") => {

  const orders = await orderModel
    .find({ user: userId })
    .populate("items.product", "name")
    .sort({ createdAt: -1 });

  if (!orders.length) {
    return null;
  }

  let order;

  // Specific order
  if (productName) {

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

  if (
    order.status === "Delivered" ||
    order.status === "Cancelled"
  ) {

    return {
      success: false,
      message: `Order already ${order.status}`
    };

  }

  order.status = "Cancelled";

  await order.save();

  return {
    success: true,
    products: order.items.map(
      item => item.product.name
    ),
    totalPrice: order.totalPrice
  };

};

module.exports = cancelOrder;