import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

async function seed() {
  const sections = [
    {
      page_slug: 'our-story',
      section_key: 'hero',
      settings: {
        eyebrow: 'OUR STORY',
        heading: 'Born in Saurashtra.\nMade by Nature.',
        description: 'A journey from wildflowers and healthy hives to pure honey, carefully brought to your home.',
        cta_text: 'DISCOVER OUR JOURNEY'
      }
    },
    {
      page_slug: 'our-story',
      section_key: 'where_it_began',
      settings: {
        eyebrow: 'WHERE IT BEGAN',
        heading: 'It started with the bees.',
        description: 'In the heart of Saurashtra, where the land blooms with wildflowers and the winds carry stories of tradition, our journey began with a deep respect for nature.\n\nWhat started as a small passion for beekeeping has grown into a promise to deliver honey that is raw, pure and honest.\n\nEvery jar you hold is a reflection of our love for bees, our land and our commitment to quality.\n\nThis is where our story begins.'
      }
    },
    {
      page_slug: 'our-story',
      section_key: 'saurashtra_land',
      settings: {
        eyebrow: 'THE LAND THAT GIVES US HONEY',
        heading: 'Saurashtra',
        description: 'Where the land, flowers, seasons and bees come together.'
      }
    },
    {
      page_slug: 'our-story',
      section_key: 'heart_of_everything',
      settings: {
        eyebrow: 'THE HEART OF EVERYTHING',
        heading: 'Without healthy bees, there is no honey.',
        feature1_title: 'Healthy Colonies',
        feature1_desc: 'We nurture strong, disease-free colonies.',
        feature2_title: 'Natural Foraging',
        feature2_desc: 'Our bees collect nectar from diverse wildflowers.',
        feature3_title: 'Pollination Heroes',
        feature3_desc: 'They help pollinate crops and support the ecosystem.',
        feature4_title: 'Gentle Care',
        feature4_desc: 'We follow natural, non-invasive beekeeping with minimum intervention.'
      }
    },
    {
      page_slug: 'our-story',
      section_key: 'hive_to_jar',
      settings: {
        eyebrow: 'FROM HIVE TO JAR',
        heading: 'A journey of care in every step.',
        step1_title: 'The Hive',
        step1_desc: 'Our journey begins inside the hive, where bees build, protect and create magic.',
        step2_title: 'The Harvest',
        step2_desc: 'Harvested carefully at the right time to respect the wellbeing of the colony.',
        step3_title: 'The Honey',
        step3_desc: 'Extracted gently and filtered naturally to preserve enzymes and nutrients.',
        step4_title: 'The Jar',
        step4_desc: 'Packed with care and delivered to your home just as nature intended.'
      }
    },
    {
      page_slug: 'our-story',
      section_key: 'our_promise',
      settings: {
        eyebrow: 'OUR PROMISE',
        heading: 'Keep it close to nature.',
        promise1_title: 'RAW',
        promise1_desc: 'As close to nature as possible.',
        promise2_title: 'HONEST',
        promise2_desc: 'No unnecessary additions.',
        promise3_title: 'RESPONSIBLE',
        promise3_desc: 'Care for bees, land & people.'
      }
    },
    {
      page_slug: 'our-story',
      section_key: 'responsible_beekeeping',
      settings: {
        eyebrow: 'RESPONSIBLE BEEKEEPING',
        heading: 'We don\'t just take from nature.\nWe care for it.',
        feature1_title: 'Gentle Harvesting',
        feature1_desc: 'We harvest honey with respect for the colony.',
        feature2_title: 'Natural Foraging',
        feature2_desc: 'Natural bee forage away from pesticides.',
        feature3_title: 'Healthy Hives',
        feature3_desc: 'We prioritize the health and strength of every hive.',
        feature4_title: 'Eco Balance',
        feature4_desc: 'We support local biodiversity.'
      }
    },
    {
      page_slug: 'our-story',
      section_key: 'the_people',
      settings: {
        eyebrow: 'THE PEOPLE BEHIND THE HONEY',
        heading: 'A family connected by nature.',
        description: 'Saurashtra Honey is a family initiative built on trust, tradition and a deep connection with nature.\n\nFrom managing hives to packing each jar, we do everything with our own hands and a lot of heart.\n\nFor us, this is not just honey. It\'s our way of life.',
        signature_text: '— The Saurashtra Honey Family'
      }
    },
    {
      page_slug: 'our-story',
      section_key: 'life_around_hives',
      settings: {
        eyebrow: 'LIFE AROUND OUR HIVES',
        heading: 'Moments from our everyday life.'
      }
    },
    {
      page_slug: 'our-story',
      section_key: 'final_cta',
      settings: {
        eyebrow: 'EXPERIENCE SAURASHTRA',
        heading: 'Taste the purity of nature.',
        cta_text: 'SHOP OUR COLLECTION'
      }
    }
  ];

  for (const s of sections) {
    const { error } = await supabase
      .from('page_content')
      .upsert({ ...s }, { onConflict: 'page_slug, section_key' });
    
    if (error) {
      console.error(`Error inserting ${s.section_key}:`, error);
    } else {
      console.log(`Successfully seeded ${s.section_key}`);
    }
  }
}

seed();
