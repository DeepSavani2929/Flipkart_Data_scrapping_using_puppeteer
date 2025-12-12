const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const FlipkartProduct = require("../models/scraper.js");

const scrapeSingleProduct = async (productUrl) => {
  let browser;

  try {
    if (!productUrl.includes("flipkart.com")) {
      console.log(" Invalid Flipkart URL:", productUrl);
      return null;
    }

    const exists = await FlipkartProduct.findOne({ productUrl });
    if (exists) {
      console.log("⚠ Already Exists:", productUrl);
      return exists;
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"
    );

    await page.goto(productUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });

    await page.waitForSelector("h1 span", { timeout: 30000 });

    // TITLE -------------------------------------------------
    const title = await page.$eval("h1 span", (el) => el.innerText.trim());

    // BREADCRUMBS --------------------------------------------
    const breadcrumbs = await page.$$eval(".IHPEN6 a", (els) =>
      els.map((e) => e.innerText.trim())
    );

    // RATING + COUNTS ----------------------------------------
    const rating = await page
      .$eval(".MKiFS6", (el) => parseFloat(el.innerText))
      .catch(() => null);

    const ratingText = await page
      .$eval(".PvbNMB span", (el) => el.innerText)
      .catch(() => "");

    const totalRatings = parseInt(ratingText.split("Ratings")[0]?.trim()) || 0;
    const totalReviews =
      parseInt(ratingText.split("Reviews")[0]?.split("&")[1]?.trim()) || 0;

    // PRICING -------------------------------------------------
    const price = await page.$eval(".hZ3P6w", (el) =>
      parseInt(el.innerText.replace(/[₹,]/g, ""))
    );

    const originalPrice = await page
      .$eval(".kRYCnD", (el) => parseInt(el.innerText.replace(/[₹,]/g, "")))
      .catch(() => null);

    const discountPercentage = await page
      .$eval(".HQe8jr span", (el) => el.innerText.trim())
      .catch(() => null);

    // IMAGES --------------------------------------------------
    const images = await page.$$eval(".UCc1lI", (imgs) =>
      imgs.map((img) => img.src)
    );

    // HIGHLIGHTS ----------------------------------------------
    const highlights = await page.$$eval(".jwbTM1 ul li", (lis) =>
      lis.map((li) => li.innerText.trim())
    );

    // SPECIFICATIONS ------------------------------------------
    const specifications = await page.$$eval(".QZKsWF", (sections) => {
      return sections.map((section) => {
        const sectionTitle =
          section.querySelector(".ZRVDNa")?.innerText.trim() || "";

        const rows = [...section.querySelectorAll("table tbody tr")].map(
          (row) => {
            const label =
              row.querySelector(".JMeybS")?.innerText.trim() || "";
            const value =
              row.querySelector(".QPlg21")?.innerText.trim() || "";
            return { label, value };
          }
        );

        return { section: sectionTitle, items: rows };
      });
    });

    // PARSE BRAND / MODEL / COLOR / PART NUMBER FROM SPECS ----
    let brand = null,
      model = null,
      partNumber = null,
      color = null,
      portable = null;

    specifications.forEach((sec) => {
      sec.items.forEach((item) => {
        if (/brand/i.test(item.label)) brand = item.value;
        if (/model/i.test(item.label)) model = item.value;
        if (/part/i.test(item.label)) partNumber = item.value;
        if (/color/i.test(item.label)) color = item.value;
        if (/portable/i.test(item.label)) portable = item.value;
      });
    });

    // OFFERS ---------------------------------------------------
    const offers = await page.$$eval(".iOwatz .T7pkhK", (els) =>
      els.map((offer) => {
        const title = offer.querySelector(".cb6J_1")?.innerText || "";
        const description =
          offer.querySelector("span:nth-child(2)")?.innerText || "";
        return { title, description };
      })
    );

    // SELLER INFO ---------------------------------------------
    const sellerName = await page
      .$eval("#sellerName span", (el) => el.innerText.trim())
      .catch(() => null);

    const sellerRating = await page
      .$eval("#sellerName .MKiFS6", (el) => parseFloat(el.innerText.trim()))
      .catch(() => null);

    // SAVE FINAL DATA -----------------------------------------
    const productData = {
      productUrl,
      title,
      brand,
      model,
      partNumber,
      color,
      portable,
      rating,
      totalRatings,
      totalReviews,
      price,
      originalPrice,
      discountPercentage,
      images,
      highlights,
      specifications,
      offers,
      breadcrumbs,
      sellerName,
      sellerRating,
    };

    const saved = await FlipkartProduct.create(productData);

    console.log(" SCRAPED:", title);
    return saved;
  } catch (err) {
    console.error(" scrapeSingleProduct ERROR:", err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = scrapeSingleProduct;
