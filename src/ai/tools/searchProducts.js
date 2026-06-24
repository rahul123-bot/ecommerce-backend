const productModel = require("../../models/product.model.js");

const searchProducts = async (query) => {

  const products = await productModel.find({
    $or: [
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
      {
        category: {
          $regex: query,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  });

  return products;
};

module.exports = searchProducts;