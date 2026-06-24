const tools = [
  {
    type: "function",
    function: {
      name: "searchProducts",
      description: "Search products by keyword",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
          },
        },
        required: ["query"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "filterProducts",
      description: "Filter products by price, category and brand",
      parameters: {
        type: "object",
        properties: {
          minPrice: {
            type: "number",
          },

          maxPrice: {
            type: "number",
          },

          category: {
            type: "string",
          },

          brand: {
            type: "string",
          },
        },
      },
    },
  },

{
  type: "function",
  function: {
    name: "compareProducts",
    description:
      "Compare two or more products by their names",

    parameters: {
      type: "object",

      properties: {

        productNames: {
          type: "array",

          items: {
            type: "string"
          }
        }

      },

      required: ["productNames"]
    }
  }
},

  {
    type: "function",
    function: {
      name: "addToCart",
      description: "Add a product to the user's cart using the product name",

      parameters: {
        type: "object",

        properties: {
          productName: {
            type: "string",
          },
        },

        required: ["productName"],
      },
    },
  },
  {
  type: "function",
  function: {
    name: "getCart",
    description: "Show user's cart items",
    parameters: {
      type: "object",
      properties: {}
    }
  }
},
{
  type: "function",
  function: {
    name: "removeFromCart",
    description: "Remove a product from cart",
    parameters: {
      type: "object",
      properties: {
        productName: {
          type: "string"
        }
      },
      required: ["productName"]
    }
  }
},
{
  type: "function",
  function: {
    name: "clearCart",
    description: "Remove all items from cart",
    parameters: {
      type: "object",
      properties: {}
    }
  }
},
 {
  type: "function",
  function: {
    name: "getOrderStatus",
    description:
      "Get the user's latest order status. If a product name is provided, return that specific order.",
    parameters: {
      type: "object",
      properties: {
        productName: {
          type: "string",
          description: "Optional product name"
        }
      }
    }
  }
},
{
  type: "function",
  function: {
    name: "cancelOrder",
    description: "Cancel latest order or specific product order",
    parameters: {
      type: "object",
      properties: {
        productName: {
          type: "string"
        }
      }
    }
  }
},
{
  type: "function",
  function: {
    name: "getOrderHistory",
    description: "Show all previous orders",
    parameters: {
      type: "object",
      properties: {}
    }
  }
},
{
  type: "function",
  function: {
    name: "recommendProducts",
    description:
      "Recommend products by category, brand and maximum price",

    parameters: {
      type: "object",

      properties: {
        category: {
          type: "string",
          description: "Product category"
        },

        brand: {
          type: "string",
          description: "Product brand"
        },

        maxPrice: {
          type: "number",
          description: "Maximum price"
        }
      }
    }
  }
},
];


module.exports = tools;
