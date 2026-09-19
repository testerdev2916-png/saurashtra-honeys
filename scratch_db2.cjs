const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?(.*?)"?$/);
  if (match) env[match[1]] = match[2];
});
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const results = {};
  
  let { data: products } = await supabase.from('products').select('slug, images');
  console.log('Total products:', products ? products.length : 'error');
  if (products) {
    const filtered = products.filter(p => p.images && p.images.some(img => typeof img === 'string' && (img.includes('supabase.co') || (!img.startsWith('http') && img.length > 0))));
    if (filtered.length > 0) results.products = filtered;
  }

  let { data: reviews } = await supabase.from('reviews').select('id, media');
  console.log('Total reviews:', reviews ? reviews.length : 'error');
  if (reviews) {
    const filtered = reviews.filter(r => {
      if (!r.media || !Array.isArray(r.media)) return false;
      return r.media.some(m => m.path && !m.path.startsWith('http')); 
    });
    if (filtered.length > 0) results.reviews = filtered;
  }

  console.log("Found:", JSON.stringify(results, null, 2));
}
check().catch(console.error);
