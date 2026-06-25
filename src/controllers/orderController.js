const orderModel = require("../models/order.model.js");
const cartModel = require("../models/cart.model.js");
const sendEmail = require("../utils/sendEmail.js");
const createOrder = async (req, res) => {
  try {
    const { address, city, stateRegion, postalCode, phone, paymentMethod } =
      req.body;

    const cart = await cartModel
      .findOne({ user: req.user._id })
      .populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Calculate Total
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    // 3. Create Order
    const order = await orderModel.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      shippingAddress: { address, city, state: stateRegion, postalCode, phone },
      totalPrice,
      paymentMethod,
      paymentStatus:
        paymentMethod === "COD"
          ? "Pending"
          : req.body.paymentStatus || "Pending",
      status: "Pending",
    });

    if (paymentMethod === "COD" || req.body.paymentStatus === "Paid") {
      await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } },
      );
    }

    try {
      sendEmail(
        req.user.email,
        "Order Confirmed",
        `Order ID: ${order._id}`,
      ).catch((e) => console.log("Email failed", e));

      return res.status(201).json(order);
    } catch (e) {
      console.log("Email failed", e);
    }

    return res.status(201).json(order);
  } catch (error) {
    console.log("ORDER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user._id })
      .populate("items.product", "name image price")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .select("_id status user createdAt")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      },
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status !== "Pending" && order.status !== "Processing") {
      return res.status(400).json({
        message: "Order cannot be cancelled",
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "Cancelled",
        },
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
};
