module.exports = [
  {
    type: "function",
    function: {
      name: "getTodaySales",
      description:
        "Get today's sales report including total revenue and total orders. Use when asked about today's sales, today's income, today's revenue or today's report.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getMonthlyRevenue",
      description:
        "Get current month's total revenue. Use when asked about monthly sales, monthly revenue or monthly income.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getTopSellingProducts",
      description:
        "Get top selling products with highest quantity sold.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getLowStockProducts",
      description:
        "Show products with low stock that may need restocking.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getOutOfStockProducts",
      description:
        "Show products that are completely out of stock.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getPendingOrders",
      description:
        "Show all orders whose status is Pending.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getCancelledOrders",
      description:
        "Show all cancelled orders.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getDeliveredOrders",
      description:
        "Show all delivered orders.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getUserCount",
      description:
        "Get total number of registered users.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getTopCustomers",
      description:
        "Show customers who spent the most money and placed the most orders.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
  type: "function",
  function: {
    name: "getDashboardSummary",
    description:
      "Get dashboard summary including sales, revenue, top products, low stock products and users",

    parameters: {
      type: "object",
      properties: {}
    }
  }
}
];