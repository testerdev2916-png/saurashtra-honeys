import { fetchProduct } from "./src/lib/product-catalog.js";
async function run() {
  const p = await fetchProduct("ajwain-honey");
  console.log("Product mapped:", JSON.stringify(p, null, 2));
}
run();
