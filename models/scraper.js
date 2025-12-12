const mongoose = require("mongoose");

const FlipkartProductSchema = new mongoose.Schema(
  {
    productUrl: String,

    title: String,
    price: Number,
    originalPrice: Number,
    discountPercentage: String,
    rating: Number,
    totalRatings: Number,
    totalReviews: Number,

    highlights: [String],

    specifications: [
      {
        section: String,
        items: [
          {
            label: String,
            value: String,
          },
        ],
      },
    ],
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlipkartHTMLProduct", FlipkartProductSchema);
