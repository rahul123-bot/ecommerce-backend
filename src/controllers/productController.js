const productModel = require("../models/product.model.js");
const imagekit = require("../config/imagekit.js");

// ======================
// CREATE PRODUCT (ImageKit)
// ======================
const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
      });

      imageUrl = uploaded.url;
    }

    const product = await productModel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock || 0,
      image: imageUrl,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Product creation failed",
    });
  }
};

// ======================
// GET PRODUCTS (SEARCH + FILTER + PAGINATION + SORT)
// ======================
const getProduct = async (req, res) => {
  try {
    const {
      search,
      category,
      page = 1,
      limit = 10,
      sort,
      minPrice,
      maxPrice,
    } = req.query;

    let query = {};

    // SEARCH
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // CATEGORY
    if (category) {
      query.category = {
        $regex: category,
        $options: "i",
      };
    }
    // PRICE FILTER
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // SORT
    let sortOption = { createdAt: -1 };

    if (sort === "price_low") sortOption = { price: 1 };
    if (sort === "price_high") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    // PAGINATION
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await productModel
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await productModel.countDocuments(query);

    res.json({
      products,
      totalProducts: total,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// GET SINGLE PRODUCT
// ======================
const getProductId = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// UPDATE PRODUCT
// ======================
const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' },
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ======================
// DELETE PRODUCT
// ======================
const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// ADD REVIEW
// ======================
const addReview = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE REVIEW
// ======================
const deleteReview = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId,
    );

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => acc + item.rating, 0) /
          product.reviews.length
        : 0;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ======================
// SEARCH SUGGESTIONS
// ======================
const getSuggestions = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim();

    if (!keyword) {
      return res.json([]);
    }

    let query = {
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    };

    // Search exact price
    if (!isNaN(keyword)) {
      query.$or.push({
        price: Number(keyword),
      });
    }

    const products = await productModel
      .find(query)
      .select("name category price image rating")
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createProduct,
  getProduct,
  getProductId,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
  getSuggestions,
};
