// const mongoose = require("mongoose");

// const FlipkartProductSchema = new mongoose.Schema(
//   {
//     productUrl: String,

//     title: String,
//     price: Number,
//     originalPrice: Number,
//     discountPercentage: String,
//     rating: Number,
//     totalRatings: Number,
//     totalReviews: Number,

//     highlights: [String],

//     specifications: [
//       {
//         section: String,
//         items: [
//           {
//             label: String,
//             value: String,
//           },
//         ],
//       },
//     ],
//     images: [String],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("flipkartDataForPriceComparision", FlipkartProductSchema);

const mongoose = require("mongoose");

const FlipkartSpecificationSchema = new mongoose.Schema(
  {
    section: String,
    items: [
      {
        label: String,
        value: String,
      },
    ],
  },
  { _id: false }
);

const FlipkartProductSchema = new mongoose.Schema(
  {
    globalProductKey: {
      type: String,
      required: true,
      index: true,
    },

    productUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    brand: {
      type: String,
      index: true,
    },

    productName: {
      type: String,
      index: true,
    },

    price: Number,
    mrp: Number,
    discount: String,

    rating: Number,
    ratingCount: String,

    images: [String],

    sizes: [String],

    highlights: [String],

    specifications: [FlipkartSpecificationSchema],

    source: {
      type: String,
      default: "flipkart",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "flipkartdataforpricecomparisions",
  FlipkartProductSchema
);
