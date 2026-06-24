const orderModel = require("../../models/order.model");

const getDeliveredOrders = async () => {

  return await orderModel.find({
    status: "Delivered"
  });

};

module.exports = getDeliveredOrders;