const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const collectProductUrls = async (baseUrl) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1366,768",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1366, height: 768 });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
  });

  let productUrls = new Set();

  for (let pageNo = 1; pageNo <= 2; pageNo++) {
    const url = `${baseUrl}&page=${pageNo}`;
    console.log(`\n Loading Page ${pageNo}: ${url}`);

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
    } catch (err) {
      console.log("Retry page load...");
      await delay(2000);
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
    }

    await delay(3000);

    await autoScroll(page);
    await delay(2000);

    const urls = await page.$$eval('a[href*="/p/"]', (links) =>
      links.map((a) => a.href.split("?")[0])
    );

    urls.forEach((u) => productUrls.add(u));

    console.log(`Total collected so far: ${productUrls.size}`);

    await delay(2000);
  }

  await browser.close();

  return [...productUrls];
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
}

module.exports = collectProductUrls;
