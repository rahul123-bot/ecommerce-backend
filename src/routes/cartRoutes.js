const express = require("express");
const cartController = require("../controllers/cartController.js");
const protect = require("../middleware/authMiddleware.js");

const cartRouter = express.Router();
cartRouter.post("/add",protect,cartController.addToCart);
cartRouter.get("/",protect,cartController.getCart);
cartRouter.delete("/:productId",protect,cartController.removeFromCart);

module.exports = cartRouter