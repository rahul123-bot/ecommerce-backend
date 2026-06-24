const productModel = require("../../models/product.model");

const getLowStockProducts = async () => {

  return await productModel
    .find({ stock: { $lte: 5, $gt: 0 } })
    .select("name stock");

};

module.exports = getLowStockProducts;