const collectProductUrls = require("./collectProducts.js");
const scrapeSingleProduct = require("./scraper.js");
const FlipkartProduct = require("../models/scraper.js");

const scrapeAllFlipkartProducts = async () => {
  try {
    const searchUrl = "https://www.flipkart.com/search?q=projector";

    console.log("\n Collecting product URLs from 25 pages...");
    const urls = await collectProductUrls(searchUrl);

    console.log(`\n Total URLs Found: ${urls.length}\n`);

    for (const url of urls) {
      const exists = await FlipkartProduct.findOne({ productUrl: url });

      if (exists) {
        console.log(" Already exists →", url);
        continue;
      }

      console.log("➡ Scraping product:", url);
      await scrapeSingleProduct(url);
    }

    console.log("\n Scraping Completed Successfully!\n");
  } catch (err) {
    console.error(" Error in scrapeAllFlipkartProducts:", err.message);
  }
};

module.exports = { scrapeAllFlipkartProducts };
