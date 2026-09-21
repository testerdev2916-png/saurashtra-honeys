import React from 'react';
import { fetchProduct } from './src/lib/product-catalog.ts';
async function run() {
  const p = await fetchProduct('ajwain-honey');
  console.log(JSON.stringify(p, null, 2));
}
run();
