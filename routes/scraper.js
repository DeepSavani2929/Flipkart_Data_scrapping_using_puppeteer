const scrapeAllFlipkartProducts  = require("../controllers/scrapeAllFlipkartProducts.js");

const router = require("express").Router();
console.log("fsdfs")

router.post("/scrappedProductData", scrapeAllFlipkartProducts);

module.exports = router;
