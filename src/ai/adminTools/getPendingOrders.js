const orderModel = require("../../models/order.model");

const getPendingOrders = async () => {

  return await orderModel.find({
    status: "Pending"
  });

};

module.exports = getPendingOrders;