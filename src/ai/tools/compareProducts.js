const productModel = require("../../models/product.model.js")
const compareProducts = async (productNames = []) => {

  if (!productNames.length) return [];

  const conditions = productNames.map(name => ({
    name: new RegExp(name, "i")
  }));

  return await productModel.find({
    $or: conditions
  });
};

module.exports = compareProducts;
