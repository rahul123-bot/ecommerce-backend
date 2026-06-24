const productModel = require("../../models/product.model.js");

const filterProducts = async ({
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  category,
  brand,
}) => {

  const query = {
    price: {
      $gte: minPrice,
      $lte: maxPrice,
    },
  };

  if (category)
    query.category = new RegExp(category, "i");

  if (brand)
    query.brand = new RegExp(brand, "i");

  return await productModel.find(query);
};
module.exports = filterProducts;