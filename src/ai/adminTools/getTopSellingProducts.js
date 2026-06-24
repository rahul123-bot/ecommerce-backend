const orderModel = require("../../models/order.model");

const getTopSellingProducts = async () => {

  const products = await orderModel.aggregate([
    {
      $unwind: "$items"
    },

    {
      $group: {
        _id: "$items.product",
        totalSold: {
          $sum: "$items.quantity"
        }
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
        _id: 0,
        name: "$product.name",
        category: "$product.category",
        price: "$product.price",
        totalSold: 1
      }
    }
  ]);

  return products;
};

module.exports = getTopSellingProducts;