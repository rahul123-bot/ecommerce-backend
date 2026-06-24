const orderModel = require("../../models/order.model");

const getMonthlyRevenue = async () => {

  const start = new Date();
  start.setDate(1);
  start.setHours(0,0,0,0);

  const orders = await orderModel.find({
    createdAt: { $gte: start },
    status: "Delivered"
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  return {
    totalRevenue
  };
};

module.exports = getMonthlyRevenue;