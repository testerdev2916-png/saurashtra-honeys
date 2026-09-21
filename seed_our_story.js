import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { autoRefreshToken: false, persistSession: false } });

const ourStorySections = [
  {
    page_slug: 'our-story',
    section_key: 'where_it_began',
    enabled: true,
    sort_order: 1,
    settings: {
      eyebrow: "WHERE IT BEGAN",
      heading: "It started with the bees.",
      description: "In the heart of Saurashtra, where the land blooms with wildflowers and the winds carry stories of tradition, our journey began with a deep respect for nature.\n\nEstablished in 2016, what started with just 5 beehives and a vision for naturally prepared honey has grown into a promise to deliver honey that is pure and honest.\n\nEvery jar you hold is a reflection of our love for bees, our land, and our commitment to quality.\n\nThis is where our story begins."
    }
  },
  {
    page_slug: 'our-story',
    section_key: 'the_people',
    enabled: true,
    sort_order: 2,
    settings: {
      eyebrow: "OUR GROWTH & OUR TEAM",
      heading: "From 5 beehives to 1,200.",
      description: "What began in 2016 with just 5 beehives has now grown into a journey of 1,200 beehives.\n\nThis growth represents years of hard work, beekeeping experience, and the trust placed in us by our customers. Today, our dedicated team of 10 people works together across every stage of the process—from harvesting to filtration and packing.\n\nWe remain a family connected by nature, doing everything with our own hands and a lot of heart.",
      signature_text: "— The Saurashtra Honey Family"
    }
  },
  {
    page_slug: 'our-story',
    section_key: 'heart_of_everything',
    enabled: true,
    sort_order: 3,
    settings: {
      eyebrow: "THE HEART OF EVERYTHING",
      heading: "Nature creates it. We wait for it.",
      feature1_title: "100% Naturally Ripened",
      feature1_desc: "We harvest honey only after it has naturally ripened inside the hive and the bees have sealed it.",
      feature2_title: "Never Rushed",
      feature2_desc: "We let the bees finish the honey naturally. We never harvest before it is naturally ready.",
      feature3_title: "No Artificial Sweetening",
      feature3_desc: "Zero added sugar or syrup. Just pure nectar transformed by the bees' own natural enzymes.",
      feature4_title: "Gentle Care",
      feature4_desc: "We follow natural, non-invasive beekeeping with minimum intervention."
    }
  },
  {
    page_slug: 'our-story',
    section_key: 'saurashtra_land',
    enabled: true,
    sort_order: 4,
    settings: {
      eyebrow: "NOMADIC BEEKEEPING",
      heading: "Following the Blooms",
      description: "We move our beehives across different districts of Gujarat, chasing the natural flowering crops and seasons to bring you diverse, single-origin honey."
    }
  },
  {
    page_slug: 'our-story',
    section_key: 'honey_varieties',
    enabled: true,
    sort_order: 5,
    settings: {
      eyebrow: "PURE DIVERSITY",
      heading: "Our Natural Honey Varieties",
      description: "Because we follow the natural blooming seasons across Gujarat, our bees are able to produce several distinct varieties of honey—each with its own unique aroma, taste, and character."
    }
  },
  {
    page_slug: 'our-story',
    section_key: 'responsible_beekeeping',
    enabled: true,
    sort_order: 6,
    settings: {
      eyebrow: "FARMERS & NATURE",
      heading: "A beautiful journey of collaboration.",
      feature1_title: "Empowering Farmers",
      feature1_desc: "We place our hives near farms to support local agriculture and crop yields.",
      feature2_title: "Natural Foraging",
      feature2_desc: "Our bees collect nectar safely from natural, suitable environments.",
      feature3_title: "Pollination Heroes",
      feature3_desc: "They help pollinate crops naturally, supporting the entire ecosystem.",
      feature4_title: "Healthy Hives",
      feature4_desc: "We prioritize the health and strength of every single colony we manage."
    }
  },
  {
    page_slug: 'our-story',
    section_key: 'hive_to_jar',
    enabled: true,
    sort_order: 7,
    settings: {
      eyebrow: "FROM HIVE TO JAR",
      heading: "A Journey of Care in Every Drop.",
      description: "From a bee visiting a flower to the moment a jar reaches your home, every drop of Saurashtra Honey follows a careful journey. We let the bees do what nature intended, harvest when naturally mature, carefully filter through clean cloth to remove wax, test for quality, and pack the honey for its journey to you."
    }
  },
  {
    page_slug: 'our-story',
    section_key: 'life_around_hives',
    enabled: true,
    sort_order: 8,
    settings: {
      eyebrow: "LIFE AROUND OUR HIVES",
      heading: "Moments from our everyday life."
    }
  },
  {
    page_slug: 'our-story',
    section_key: 'our_promise',
    enabled: true,
    sort_order: 9,
    settings: {
      eyebrow: "OUR PROMISE",
      heading: "Keep it close to nature.",
      promise1_title: "RAW",
      promise1_desc: "As close to nature as possible.",
      promise2_title: "HONEST",
      promise2_desc: "No unnecessary additions.",
      promise3_title: "RESPONSIBLE",
      promise3_desc: "Care for bees, land & people."
    }
  },
  {
    page_slug: 'our-story',
    section_key: 'final_cta',
    enabled: true,
    sort_order: 10,
    settings: {
      eyebrow: "PURE HONEY YOU CAN TRUST",
      heading: "From our bees to your business and home.",
      cta_text: "SHOP OUR HONEY",
      cta_link: "/shop"
    }
  }
];

async function seed() {
  console.log("Seeding CMS data for our-story...");
  
  // Clean up any existing rows to prevent sort order issues
  await supabase.from('page_content').delete().eq('page_slug', 'our-story');

  const { data, error } = await supabase
    .from('page_content')
    .insert(ourStorySections)
    .select();

  if (error) {
    console.error('Error seeding our-story content:', error);
  } else {
    console.log('Successfully seeded our-story content into DB!', data.length, 'rows added.');
  }
}
seed();
