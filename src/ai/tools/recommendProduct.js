const productModel = require("../../models/product.model.js");

const recommendProducts = async ({
  category,
  brand,
  maxPrice,
}) => {

  let searchText = "";

  if (brand) {
    searchText += brand + " ";
  }

  if (category) {
    searchText += category;
  }

  const query = {};

  // Search by product name OR category
  if (searchText.trim()) {
    query.$or = [
      {
        name: {
          $regex: searchText,
          $options: "i",
        },
      },
      {
        category: {
          $regex: searchText,
          $options: "i",
        },
      },
    ];
  }

  if (maxPrice) {
    query.price = {
      $lte: maxPrice,
    };
  }

  console.log("Recommendation query:", query);

  const products = await productModel
    .find(query)
    .sort({ rating: -1, price: 1 })
    .limit(5);

  console.log(
    "Products found:",
    products.map((p) => ({
      name: p.name,
      category: p.category,
      price: p.price,
    }))
  );

  return products;
};

module.exports = recommendProducts;