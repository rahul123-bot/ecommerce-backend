const orderModel = require("../../models/order.model");

const getTopCustomers = async () => {

  const customers = await orderModel.aggregate([
    {
      $group: {
        _id: "$user",
        totalSpent: {
          $sum: "$totalPrice"
        },

        totalOrders: {
          $sum: 1
        }
      }
    },

    {
      $sort: {
        totalSpent: -1
      }
    },

    {
      $limit: 5
    },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },

    {
      $unwind: "$user"
    },

    {
      $project: {
        _id: 0,
        name: "$user.name",
        email: "$user.email",
        totalSpent: 1,
        totalOrders: 1
      }
    }
  ]);

  return customers;
};

module.exports = getTopCustomers;