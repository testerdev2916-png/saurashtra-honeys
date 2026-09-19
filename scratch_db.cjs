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
  
  // products
  let { data: products } = await supabase.from('products').select('slug, images');
  if (products) {
    results.products = products.filter(p => p.images && p.images.some(img => typeof img === 'string' && (img.includes('supabase.co') || (!img.startsWith('http') && img.length > 0))));
  }

  // categories
  let { data: cats } = await supabase.from('categories').select('slug, image_url');
  if (cats) {
    results.categories = cats.filter(c => c.image_url && (c.image_url.includes('supabase.co') || !c.image_url.startsWith('http')));
  }

  // homepage_videos
  let { data: videos } = await supabase.from('homepage_videos').select('id, video_url, thumbnail_url');
  if (videos) {
    results.homepage_videos = videos.filter(v => 
      (v.video_url && (v.video_url.includes('supabase.co') || !v.video_url.startsWith('http'))) ||
      (v.thumbnail_url && (v.thumbnail_url.includes('supabase.co') || !v.thumbnail_url.startsWith('http')))
    );
  }

  // stories
  let { data: stories } = await supabase.from('stories').select('id, image_url, video_url');
  if (stories) {
    results.stories = stories.filter(s => 
      (s.image_url && (s.image_url.includes('supabase.co') || !s.image_url.startsWith('http'))) ||
      (s.video_url && (s.video_url.includes('supabase.co') || !s.video_url.startsWith('http')))
    );
  }

  // heritage
  let { data: heritage } = await supabase.from('heritage').select('id, image_url');
  if (heritage) {
    results.heritage = heritage.filter(h => h.image_url && (h.image_url.includes('supabase.co') || !h.image_url.startsWith('http')));
  }

  // who_we_supply
  let { data: wws } = await supabase.from('who_we_supply').select('id, logo_url');
  if (wws) {
    results.who_we_supply = wws.filter(w => w.logo_url && (w.logo_url.includes('supabase.co') || !w.logo_url.startsWith('http')));
  }

  // blog_posts
  let { data: blogs } = await supabase.from('blog_posts').select('slug, image_url');
  if (blogs) {
    results.blog_posts = blogs.filter(b => b.image_url && (b.image_url.includes('supabase.co') || !b.image_url.startsWith('http')));
  }

  // reviews
  let { data: reviews } = await supabase.from('reviews').select('id, media');
  if (reviews) {
    results.reviews = reviews.filter(r => {
      if (!r.media || !Array.isArray(r.media)) return false;
      return r.media.some(m => m.path && !m.path.startsWith('http')); // review media uses relative path in Supabase bucket
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

check().catch(console.error);
