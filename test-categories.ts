import { fetchShopCategories } from './src/lib/category-catalog';

async function main() {
  const cats = await fetchShopCategories();
  console.log("CATEGORIES:");
  cats.forEach(c => console.log(`- ${c.name} -> /shop/${c.slug}`));
}

main().catch(console.error);
