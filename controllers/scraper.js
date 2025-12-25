// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// puppeteer.use(StealthPlugin());

// const FlipkartProduct = require("../models/scraper.js");

// const scrapeSingleProduct = async (productUrl) => {
//   let browser;

//   try {
//     if (!productUrl.includes("flipkart.com")) {
//       console.log(" Invalid Flipkart URL:", productUrl);
//       return null;
//     }

//     const exists = await FlipkartProduct.findOne({ productUrl });
//     if (exists) {
//       console.log(" Already Exists:", productUrl);
//       return exists;
//     }

//     browser = await puppeteer.launch({
//       headless: false,
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-blink-features=AutomationControlled",
//       ],
//     });

//     const page = await browser.newPage();
//     await page.setViewport({ width: 1366, height: 768 });

//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"
//     );

//     await page.goto(productUrl, {
//       waitUntil: "domcontentloaded",
//       timeout: 90000,
//     });

//     await page.waitForSelector("h1 span", { timeout: 30000 });

//     const title = await page.$eval("h1 span", (el) => el.innerText.trim());

//     const breadcrumbs = await page.$$eval(".IHPEN6 a", (els) =>
//       els.map((e) => e.innerText.trim())
//     );

//     const rating = await page
//       .$eval(".MKiFS6", (el) => parseFloat(el.innerText))
//       .catch(() => null);

//     const ratingText = await page
//       .$eval(".PvbNMB span", (el) => el.innerText)
//       .catch(() => "");

//     const totalRatings = parseInt(ratingText.split("Ratings")[0]?.trim()) || 0;
//     const totalReviews =
//       parseInt(ratingText.split("Reviews")[0]?.split("&")[1]?.trim()) || 0;

//     const price = await page.$eval(".hZ3P6w", (el) =>
//       parseInt(el.innerText.replace(/[₹,]/g, ""))
//     );

//     const originalPrice = await page
//       .$eval(".kRYCnD", (el) => parseInt(el.innerText.replace(/[₹,]/g, "")))
//       .catch(() => null);

//     const discountPercentage = await page
//       .$eval(".HQe8jr span", (el) => el.innerText.trim())
//       .catch(() => null);

//     const images = await page.$$eval(".UCc1lI", (imgs) =>
//       imgs.map((img) => img.src)
//     );

//     const highlights = await page.$$eval(".jwbTM1 ul li", (lis) =>
//       lis.map((li) => li.innerText.trim())
//     );

//     const specifications = await page.$$eval(".QZKsWF", (sections) => {
//       return sections.map((section) => {
//         const sectionTitle =
//           section.querySelector(".ZRVDNa")?.innerText.trim() || "";

//         const rows = [...section.querySelectorAll("table tbody tr")].map(
//           (row) => {
//             const label = row.querySelector(".JMeybS")?.innerText.trim() || "";
//             const value = row.querySelector(".QPlg21")?.innerText.trim() || "";
//             return { label, value };
//           }
//         );

//         return { section: sectionTitle, items: rows };
//       });
//     });

//     let brand = null,
//       model = null,
//       partNumber = null,
//       color = null,
//       portable = null;

//     specifications.forEach((sec) => {
//       sec.items.forEach((item) => {
//         if (/brand/i.test(item.label)) brand = item.value;
//         if (/model/i.test(item.label)) model = item.value;
//         if (/part/i.test(item.label)) partNumber = item.value;
//         if (/color/i.test(item.label)) color = item.value;
//         if (/portable/i.test(item.label)) portable = item.value;
//       });
//     });

//     const offers = await page.$$eval(".iOwatz .T7pkhK", (els) =>
//       els.map((offer) => {
//         const title = offer.querySelector(".cb6J_1")?.innerText || "";
//         const description =
//           offer.querySelector("span:nth-child(2)")?.innerText || "";
//         return { title, description };
//       })
//     );

//     const sellerName = await page
//       .$eval("#sellerName span", (el) => el.innerText.trim())
//       .catch(() => null);

//     const sellerRating = await page
//       .$eval("#sellerName .MKiFS6", (el) => parseFloat(el.innerText.trim()))
//       .catch(() => null);

//     const productData = {
//       productUrl,
//       title,
//       brand,
//       model,
//       partNumber,
//       color,
//       portable,
//       rating,
//       totalRatings,
//       totalReviews,
//       price,
//       originalPrice,
//       discountPercentage,
//       images,
//       highlights,
//       specifications,
//       offers,
//       breadcrumbs,
//       sellerName,
//       sellerRating,
//     };

//     const saved = await FlipkartProduct.create(productData);

//     console.log(" SCRAPED:", title);
//     return saved;
//   } catch (err) {
//     console.error(" scrapeSingleProduct ERROR:", err.message);
//     return null;
//   } finally {
//     if (browser) await browser.close();
//   }
// };

// module.exports = scrapeSingleProduct;


// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// puppeteer.use(StealthPlugin());

// const FlipkartProduct = require("../models/scraper.js");


// const normalize = (text) =>
//   text
//     ?.toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");

// const scrapeSingleProduct = async (productUrl) => {
//   let browser;

//   try {
//     if (!productUrl.includes("flipkart.com")) {
//       console.log(" Invalid Flipkart URL");
//       return null;
//     }

//     const exists = await FlipkartProduct.findOne({ productUrl });
//     if (exists) {
//       console.log("⏭️ Already exists");
//       return exists;
//     }

//     browser = await puppeteer.launch({
//       headless: false,
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-blink-features=AutomationControlled",
//       ],
//     });

//     const page = await browser.newPage();
//     await page.setViewport({ width: 1366, height: 768 });

//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36"
//     );

//     await page.goto(productUrl, {
//       waitUntil: "domcontentloaded",
//       timeout: 90000,
//     });

//     await page.waitForSelector("h1", { timeout: 30000 });

//     const data = await page.evaluate(() => {
//       const brand =
//         document.querySelector("h1 span.qbKhdn")?.innerText.trim() ||
//         document
//           .querySelector('[class*="Brand"]')
//           ?.innerText.trim() ||
//         null;

//       const productName =
//         document.querySelector("h1 span.LMizgS")?.innerText.trim() ||
//         document.querySelector("h1")?.innerText.trim() ||
//         null;

//       const price =
//         Number(
//           document
//             .querySelector(".hZ3P6w")
//             ?.innerText.replace(/[₹,]/g, "")
//         ) || null;

//       const mrp =
//         Number(
//           document
//             .querySelector(".kRYCnD")
//             ?.innerText.replace(/[₹,]/g, "")
//         ) || null;

//       const discount =
//         document.querySelector(".HQe8jr span")?.innerText.trim() || null;

//       const rating =
//         Number(
//           document.querySelector(".MKiFS6")?.innerText.trim()
//         ) || null;

//       const ratingCount =
//         document.querySelector(".PvbNMB span")?.innerText.trim() || null;

//       const images = Array.from(
//         document.querySelectorAll("img.MZeksS")
//       )
//         .map((img) => img.src)
//         .filter(Boolean);

//       const sizes = Array.from(
//         document.querySelectorAll("li[id^='swatch-'] a")
//       ).map((a) => a.innerText.trim());

//       const highlights = Array.from(
//         document.querySelectorAll(".jwbTM1 ul li")
//       ).map((li) => li.innerText.trim());

//       const specifications = Array.from(
//         document.querySelectorAll(".QZKsWF")
//       ).map((section) => {
//         const sectionTitle =
//           section.querySelector(".ZRVDNa")?.innerText.trim() || "";

//         const items = Array.from(
//           section.querySelectorAll("table tbody tr")
//         ).map((row) => ({
//           label:
//             row.querySelector(".JMeybS")?.innerText.trim() || "",
//           value:
//             row.querySelector(".QPlg21")?.innerText.trim() || "",
//         }));

//         return { section: sectionTitle, items };
//       });

//       return {
//         brand,
//         productName,
//         price,
//         mrp,
//         discount,
//         rating,
//         ratingCount,
//         images,
//         sizes,
//         highlights,
//         specifications,
//         productUrl: window.location.href,
//       };
//     });

//     await page.close();

//     if (!data || !data.productName) return null;

//     const globalProductKey = normalize(
//       `${data.brand} ${data.productName}`
//     );

//     const saved = await FlipkartProduct.create({
//       ...data,
//       globalProductKey,
//     });

//     console.log(" SCRAPED:", data.productName);
//     return saved;
//   } catch (err) {
//     console.error(" scrapeSingleProduct ERROR:", err.message);
//     return null;
//   } finally {
//     if (browser) await browser.close();
//   }
// };

// module.exports = scrapeSingleProduct;



const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const FlipkartProduct = require("../models/scraper.js");
const buildGlobalKey = require("../uti/buildGlobalKeY.JS");


const normalize = (text) =>
  text
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const scrapeSingleProduct = async (productUrl) => {
  let browser;

  try {
    if (!productUrl.includes("flipkart.com")) {
      console.log(" Invalid Flipkart URL");
      return null;
    }

    const exists = await FlipkartProduct.findOne({ productUrl });
    if (exists) {
      console.log("⏭️ Already exists");
      return exists;
    }

    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36"
    );

    await page.goto(productUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });

    await page.waitForSelector("h1", { timeout: 30000 });

    const data = await page.evaluate(() => {
      const brand =
        document.querySelector("h1 span.qbKhdn")?.innerText.trim() ||
        document
          .querySelector('[class*="Brand"]')
          ?.innerText.trim() ||
        null;

      const productName =
        document.querySelector("h1 span.LMizgS")?.innerText.trim() ||
        document.querySelector("h1")?.innerText.trim() ||
        null;

      const price =
        Number(
          document
            .querySelector(".hZ3P6w")
            ?.innerText.replace(/[₹,]/g, "")
        ) || null;

      const mrp =
        Number(
          document
            .querySelector(".kRYCnD")
            ?.innerText.replace(/[₹,]/g, "")
        ) || null;

      const discount =
        document.querySelector(".HQe8jr span")?.innerText.trim() || null;

      const rating =
        Number(
          document.querySelector(".MKiFS6")?.innerText.trim()
        ) || null;

      const ratingCount =
        document.querySelector(".PvbNMB span")?.innerText.trim() || null;

      const images = Array.from(
        document.querySelectorAll("img.MZeksS")
      )
        .map((img) => img.src)
        .filter(Boolean);

      const sizes = Array.from(
        document.querySelectorAll("li[id^='swatch-'] a")
      ).map((a) => a.innerText.trim());

      const highlights = Array.from(
        document.querySelectorAll(".jwbTM1 ul li")
      ).map((li) => li.innerText.trim());

      const specifications = Array.from(
        document.querySelectorAll(".QZKsWF")
      ).map((section) => {
        const sectionTitle =
          section.querySelector(".ZRVDNa")?.innerText.trim() || "";

        const items = Array.from(
          section.querySelectorAll("table tbody tr")
        ).map((row) => ({
          label:
            row.querySelector(".JMeybS")?.innerText.trim() || "",
          value:
            row.querySelector(".QPlg21")?.innerText.trim() || "",
        }));

        return { section: sectionTitle, items };
      });

      return {
        brand,
        productName,
        price,
        mrp,
        discount,
        rating,
        ratingCount,
        images,
        sizes,
        highlights,
        specifications,
        productUrl: window.location.href,
      };
    });

    await page.close();

    if (!data || !data.productName) return null;

  const globalProductKey = buildGlobalKey({
    brand: data.brand,
    productName: data.productName,
  });

    const saved = await FlipkartProduct.create({
      ...data,
      globalProductKey,
    });

    console.log(" SCRAPED:", data.productName);
    return saved;
  } catch (err) {
    console.error(" scrapeSingleProduct ERROR:", err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = scrapeSingleProduct;
