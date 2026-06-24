const express = require("express");
const {CreateOrder} = require("../controllers/paymentController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const paymentRouter = express.Router();

paymentRouter.post("/create-order",authMiddleware,CreateOrder)

module.exports = paymentRouter;