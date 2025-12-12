const { scrapeAllFlipkartProducts } = require("../controllers/scrapeAllFlipkartProducts");

const router = require("express").Router();

router.post("/scrappedProductData", scrapeAllFlipkartProducts);

module.exports = router;
