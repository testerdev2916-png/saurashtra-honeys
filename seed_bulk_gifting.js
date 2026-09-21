import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { autoRefreshToken: false, persistSession: false } });

const bulkGiftingData = {
  page_slug: 'bulk-gifting',
  section_key: 'hub_cards',
  enabled: true,
  sort_order: 1,
  settings: {
    cards: [
      {
        title: "Bulk Orders",
        desc: "Premium wholesale honey solutions for retailers, restaurants and distributors.",
        cta: "Explore Bulk Solutions",
        href: "/bulk-orders",
        iconName: "Package"
      },
      {
        title: "Corporate Gifting",
        desc: "Luxury gifting solutions crafted to impress employees and clients.",
        cta: "View Gifting Solutions",
        href: "/corporate-gifting",
        iconName: "Gift"
      },
      {
        title: "Gift Hampers",
        desc: "Curated honey gift hampers for festive, wedding and special occasions.",
        cta: "Explore Hampers",
        href: "/gift-hampers",
        iconName: "Sparkles"
      },
      {
        title: "Private Labeling",
        desc: "Launch your own premium honey brand with complete private labeling support.",
        cta: "Build Your Brand",
        href: "/private-label",
        iconName: "Tag"
      }
    ]
  }
};

async function seed() {
  console.log("Seeding CMS data for bulk-gifting...");
  
  // Clean up any existing rows
  await supabase.from('page_content').delete().eq('page_slug', 'bulk-gifting');

  const { data, error } = await supabase
    .from('page_content')
    .insert([bulkGiftingData])
    .select();

  if (error) {
    console.error('Error seeding bulk-gifting content:', error);
  } else {
    console.log('Successfully seeded bulk-gifting content into DB!', data.length, 'rows added.');
  }
}
seed();
