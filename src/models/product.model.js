const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      default: 0,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    image: String,

    slug: {
      type: String,
      unique: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      index: true,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },

        name: String,

        rating: Number,

        comment: String,
      },
    ],

    numReviews: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: "text", category: 1, price: 1 });

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
