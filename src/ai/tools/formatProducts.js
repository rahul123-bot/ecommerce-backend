const formatProducts = (products) => {

  if (!products.length) {
    return "❌ No products found.";
  }

  let response = "🛍️ Here are some products I found:\n\n";

  products.forEach((product, index) => {

    response +=
`${index + 1}️⃣ ${product.name}
💰 Price: ₹${product.price}
🏷 Category: ${product.category}

`;

  });

  response +=
"Would you like me to compare them or add one to your cart?";

  return response;

};

module.exports = formatProducts;