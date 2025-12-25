const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();


const normalizeBrand = (brand = "") => {
  const b = normalize(brand);

  if (b.includes("levi")) return "levis";
  if (b.includes("lee")) return "lee";
  if (b.includes("wrangler")) return "wrangler";

  return b.replace(/\s+/g, "");
};

module.exports = function buildGlobalKey({ brand, productName }) {
  const canonicalBrand = normalizeBrand(brand);

  const text = normalize(`${canonicalBrand} ${productName}`);


  const model = text.match(/\b5\d{2}\b/)?.[0] || "";

  const fit =
    text.includes("slim") ? "slim" :
    text.includes("straight") ? "straight" :
    text.includes("tapered") ? "tapered" :
    "";

  return [canonicalBrand, model, fit]
    .filter(Boolean)
    .join("-");
};
