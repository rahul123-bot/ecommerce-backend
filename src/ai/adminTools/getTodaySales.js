const orderModel = require("../../models/order.model");

const getTodaySales = async () => {
  // Start of today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // End of today
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Find today's orders
  const orders = await orderModel.find({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  // Total orders
  const totalOrders = orders.length;

  // Total revenue
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  // Optional: count orders by status
  const deliveredOrders = orders.filter(
    order => order.status === "Delivered"
  ).length;

  const pendingOrders = orders.filter(
    order => order.status === "Pending"
  ).length;

  return {
    totalOrders,
    totalRevenue,
    deliveredOrders,
    pendingOrders,
  };
};

module.exports = getTodaySales;