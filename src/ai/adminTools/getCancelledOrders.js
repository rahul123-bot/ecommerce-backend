const orderModel = require("../../models/order.model");

const getCancelledOrders = async () => {

  return await orderModel.find({
    status: "Cancelled"
  });

};

module.exports = getCancelledOrders;