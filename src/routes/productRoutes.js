const express = require("express");
const productController = require("../controllers/productController.js");
const protect = require("../middleware/authMiddleware.js");
const adminOnly = require("../middleware/adminMiddleware.js");
const upload = require("../middleware/upload");

const productRouter = express.Router();

// ======================
// PRODUCTS (GET + CREATE)
// ======================
productRouter
  .route("/")
  .get(productController.getProduct)
  .post(
    protect,
    adminOnly,
    upload.single("image"),
    productController.createProduct
  );

// ======================
// SINGLE PRODUCT CRUD
// ======================
productRouter.get(
  "/suggestions",
  productController.getSuggestions
);
productRouter
  .route("/:id")
  .get(productController.getProductId)
  .put(protect, adminOnly, productController.updateProduct)
  .delete(protect, adminOnly, productController.deleteProduct);

// ======================
// REVIEWS
// ======================
productRouter.post(
  "/:id/reviews",
  protect,
  productController.addReview
);

productRouter.delete(
  "/:productId/reviews/:reviewId",
  protect,
  productController.deleteReview
);

module.exports = productRouter;