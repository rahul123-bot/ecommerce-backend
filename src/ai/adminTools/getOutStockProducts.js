const productModel = require("../../models/product.model");

const getOutOfStockProducts = async () => {

  return await productModel
    .find({ stock: 0 })
    .select("name");

};

module.exports = getOutOfStockProducts;