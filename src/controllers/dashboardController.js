const userModel = require("../models/users.model");
const productModel = require("../models/product.model.js");
const orderModel = require("../models/order.model.js");

const getDashboardStats = async (req, res) => {
  const users = await userModel.countDocuments();

  const products = await productModel.countDocuments();

  const orders = await orderModel.countDocuments();

  const revenue = await orderModel.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  res.json({
    users,
    products,
    orders,
    revenue: revenue[0]?.total || 0,
  });
};
const getSalesAnalytics = async (req, res) => {
  try {
    const sales = await orderModel.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          revenue: {
            $sum: "$totalPrice",
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);
    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getDashboardStats,
  getSalesAnalytics,
};
