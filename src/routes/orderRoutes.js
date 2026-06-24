const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getMyOrders,
  cancelOrder,
} = require("../controllers/orderController.js");
const adminOnly = require("../middleware/adminMiddleware.js");
const orderRouter = express.Router();

orderRouter.post("/", protect, createOrder);
orderRouter.get("/", protect, adminOnly, getAllOrders);
orderRouter.get("/myorders", protect, getMyOrders);
orderRouter.put("/:id/status", protect, adminOnly, updateOrderStatus);
orderRouter.patch("/:id/cancel",protect,cancelOrder);


module.exports = orderRouter;
