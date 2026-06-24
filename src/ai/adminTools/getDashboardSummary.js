const orderModel = require("../../models/order.model");
const productModel = require("../../models/product.model");
const userModel = require("../../models/users.model");

const getDashboardSummary = async () => {
  // Today's orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await orderModel.find({
    createdAt: { $gte: today }
  });

  const totalOrders = todayOrders.length;

  const totalRevenue = todayOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  // Low stock products
  const lowStockProducts = await productModel.find({
    stock: { $lte: 5 }
  }).select("name stock");

  // Total users
  const totalUsers = await userModel.countDocuments();

  // Top selling products
  const topProducts = await orderModel.aggregate([
    { $unwind: "$items" },

    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" }
      }
    },

    {
      $sort: {
        totalSold: -1
      }
    },

    {
      $limit: 5
    },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },

    {
      $unwind: "$product"
    },

    {
      $project: {
        name: "$product.name",
        totalSold: 1
      }
    }
  ]);

  return {
    totalOrders,
    totalRevenue,
    lowStockProducts,
    totalUsers,
    topProducts
  };
};

module.exports = getDashboardSummary;