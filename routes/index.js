const router = require("express").Router();
const products = require("./scraper.js");

router.use("/productsData", products);

module.exports = router;
