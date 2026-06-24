const searchProducts = require("./tools/searchProducts.js");
const filterProducts = require("./tools/filterProducts.js");
const compareProducts = require("./tools/compareProducts.js");
const addToCart = require("./tools/addToCart.js");
const formatProducts = require("./tools/formatProducts.js");
const getOrderStatus = require("./tools/getOrderStatus.js");
const cancelOrder = require("./tools/cancelOrder.js");
const getCart = require("./tools/getCart.js");
const removeFromCart = require("./tools/removeFromCart.js");
const clearCart = require("./tools/clearCart.js");
const getOrderHistory = require("./tools/getOrderHistory.js");
const recommendProducts = require("./tools/recommendProduct.js");
const generateResponse = require("../service/openaiService.js");
const productModel = require("../models/product.model.js");
const generateFinalResponse = require("../service/finalResponseService.js");
const generateAdminResponse = require("../service/adminResponseService");
const tools = require("./tools/tool.js");
const adminTools = require("./adminTools/adminTool.js");
const getTodaySales = require("./adminTools/getTodaySales");
const getMonthlyRevenue = require("./adminTools/getMonthlyRevenue.js");
const getLowStockProducts = require("./adminTools/getLowStockProducts.js");
const getOutOfStockProducts = require("./adminTools/getOutStockProducts.js");
const getCancelledOrders = require("./adminTools/getCancelledOrders.js");
const getDeliveredOrders = require("./adminTools/getDeliveredOrders.js");
const getPendingOrders = require("./adminTools/getPendingOrders.js");
const getUserCount = require("./adminTools/getUsersCount.js");
const getTopSellingProducts = require("./adminTools/getTopSellingProducts");
const getTopCustomers = require("./adminTools/getTopCustomers");
const getDashboardSummary = require("./adminTools/getDashboardSummary");

const runAgent = async (message, userId, role) => {
  try {
    const availableTools = role === "admin" ? [...tools, ...adminTools] : tools;

    const aiMessage = await generateResponse(message, availableTools);

    console.log(aiMessage);

    const toolCall = aiMessage.tool_calls?.[0];

    if (!toolCall) {
      return aiMessage.content;
    }

    const functionName = toolCall.function.name;

    const args = JSON.parse(toolCall.function.arguments);

    const adminFunctions = [
      "getTodaySales",
      "getMonthlyRevenue",
      "getTopSellingProducts",
      "getLowStockProducts",
      "getOutOfStockProducts",
      "getPendingOrders",
      "getCancelledOrders",
      "getDeliveredOrders",
      "getUserCount",
      "getTopCustomers",
    ];

    if (role !== "admin" && adminFunctions.includes(functionName)) {
      return "❌ Access denied. Admin only.";
    }

    if (functionName === "searchProducts") {
      const products = await searchProducts(args.query);

      if (!products.length) {
        return "No products found.";
      }

      const simplifiedProducts = products.slice(0, 5).map((p) => ({
        name: p.name,
        price: p.price,
        category: p.category,
        rating: p.rating,
        stock: p.stock,
      }));

      if (simplifiedProducts.length > 2) {
        return formatProducts(simplifiedProducts);
      }

      return await generateFinalResponse(message, simplifiedProducts);
    }
    if (functionName === "filterProducts") {
      const products = await filterProducts({
        minPrice: args.minPrice,
        maxPrice: args.maxPrice,
        category: args.category,
        brand: args.brand,
      });
      const simplifiedProducts = products.slice(0, 5).map((p) => ({
        name: p.name,
        price: p.price,
        category: p.category,
        rating: p.rating,
        stock: p.stock,
      }));

      if (simplifiedProducts.length > 2) {
        return formatProducts(simplifiedProducts);
      }

      return await generateFinalResponse(message, simplifiedProducts);
    }

    if (functionName === "compareProducts") {
      const products = await compareProducts(args.productNames);

      if (!products.length) {
        return "Products not found";
      }

      const simplifiedProducts = products.slice(0, 5).map((p) => ({
        name: p.name,
        price: p.price,
        category: p.category,
        rating: p.rating,
        stock: p.stock,
      }));

      console.log(
        "Sending to final GPT:",
        JSON.stringify(simplifiedProducts).length,
      );

      return await generateFinalResponse(message, simplifiedProducts);
    }

    if (functionName === "addToCart") {
      const product = await productModel.findOne({
        name: new RegExp(args.productName, "i"),
      });

      if (!product) {
        return "Product not found";
      }
      await addToCart(userId, product._id);

      return await generateFinalResponse(message, {
        action: "add_to_cart",
        success: true,
        product: {
          name: product.name,
          price: product.price,
          category: product.category,
          stock: product.stock,
        },
      });
    }
    if (functionName === "getCart") {
      const cart = await getCart(userId);

      if (!cart) {
        return "Your cart is empty.";
      }

      return await generateFinalResponse(message, {
        action: "view_cart",
        ...cart,
      });
    }
    if (functionName === "removeFromCart") {
      const result = await removeFromCart(userId, args.productName);

      if (!result) {
        return "Cart not found.";
      }

      if (!result.success) {
        return result.message;
      }

      return `✅ ${args.productName} removed from cart.`;
    }
    if (functionName === "clearCart") {
      await clearCart(userId);

      return "🗑️ Your cart has been cleared.";
    }
    if (functionName === "getOrderStatus") {
      const order = await getOrderStatus(userId, args.productName);

      if (!order) {
        return args.productName
          ? `No order found for ${args.productName}.`
          : "You don't have any orders yet.";
      }

      return await generateFinalResponse(message, {
        action: "order_status",
        ...order,
      });
    }
    if (functionName === "cancelOrder") {
      const result = await cancelOrder(userId, args.productName);

      if (!result) {
        return args.productName
          ? `No order found for ${args.productName}.`
          : "You don't have any orders.";
      }

      if (!result.success) {
        return result.message;
      }

      return await generateFinalResponse(message, {
        action: "cancel_order",
        ...result,
      });
    }
    if (functionName === "getOrderHistory") {
      const orders = await getOrderHistory(userId);

      if (!orders) {
        return "You don't have any orders.";
      }

      return await generateFinalResponse(message, {
        action: "order_history",
        orders,
      });
    }
    if (functionName === "recommendProducts") {
      const products = await recommendProducts({
        category: args.category,
        brand: args.brand,
        maxPrice: args.maxPrice,
      });

      if (!products.length) {
        return "No products found.";
      }

      const simplifiedProducts = products.map((product) => ({
        name: product.name,
        price: product.price,
        category: product.category,
        brand: product.brand,
        rating: product.rating,
        stock: product.stock,
      }));

      return await generateFinalResponse(message, {
        action: "recommendation",
        products: simplifiedProducts,
      });
    }
//admin ai featurs//
    if (functionName === "getTodaySales") {
      const data = await getTodaySales();

      return await generateAdminResponse(message, {
        action: "monthly_revenue",
        ...data,
      });
    }
    if (functionName === "getMonthlyRevenue") {
      const data = await getMonthlyRevenue();

      return await generateAdminResponse(message, {
        action: "monthly_revenue",
        ...data,
      });
    }
    if (functionName === "getTopCustomers") {
      const customers = await getTopCustomers();

      return await generateAdminResponse(message, {
        action: "top_customers",
        customers,
      });
    }
    if (functionName === "getLowStockProducts") {
      const products = await getLowStockProducts();

      return await generateAdminResponse(message, {
        action: "low_stock",
        products,
      });
    }

    if (functionName === "getOutOfStockProducts") {
      const products = await getOutOfStockProducts();

      return await generateAdminResponse(message, {
        action: "out_of_stock",
        products,
      });
    }
    if (functionName === "getCancelledOrders") {
      const orders = await getCancelledOrders();

      return await generateAdminResponse(message, {
        action: "cancelled_orders",
        orders,
      });
    }
    if (functionName === "getDeliveredOrders") {
      const orders = await getDeliveredOrders();

      return await generateAdminResponse(message, {
        action: "delivered_orders",
        orders,
      });
    }
    if (functionName === "getUserCount") {
      const totalUsers = await getUserCount();

      return await generateAdminResponse(message, {
        action: "user_count",
        totalUsers,
      });
    }
    if (functionName === "getTopCustomers") {
      const customers = await getTopCustomers();

      return await generateAdminResponse(message, {
        action: "top_customers",
        customers,
      });
    }
    if (functionName === "getPendingOrders") {
      const orders = await getPendingOrders();

      return await generateAdminResponse(message, {
        action: "pending_orders",
        orders,
      });
    }
    if (functionName === "getTopSellingProducts") {
      const products = await getTopSellingProducts();

      return await generateAdminResponse(message, {
        action: "top_products",
        products,
      });
    }
    if (functionName === "getDashboardSummary") {

  const data = await getDashboardSummary();

  return await generateAdminResponse(
    message,
    {
      action: "dashboard_summary",
      ...data
    }
  );

}
    return "No tool executed";
  } catch (error) {
    console.log(error);

    return "Agent error";
  }
};

module.exports = runAgent;
