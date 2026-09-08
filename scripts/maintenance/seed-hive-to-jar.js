import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const newSettings = {
  eyebrow: "FROM HIVE TO JAR",
  heading: "A Journey of Care in Every Drop.",
  description: "From a bee visiting a flower to the moment a jar reaches your home, every drop of Saurashtra Honey follows a careful journey. We let the bees do what nature intended, harvest with care, filter gently, test for quality, and pack the honey for its journey to you.",
  closing_eyebrow: "FROM SAURASHTRA, WITH CARE",
  closing_heading: "Every Jar Carries a Little Piece of Where It Began.",
  closing_description: "From a flower visited by a bee to a jar delivered to your home — that's the journey behind every jar of Saurashtra Honey.",
  closing_cta_text: "SHOP OUR HONEY",
  steps: [
    {
      number: "01",
      category: "THE BEGINNING",
      title: "From Flower to Hive",
      description: "Our journey begins in the fields. Bees move from flower to flower, naturally collecting nectar from the surrounding flora. They carry this nectar back to their hive, where the transformation into honey begins.",
      active: true
    },
    {
      number: "02",
      category: "THE BEES",
      title: "Where Nectar Becomes Honey",
      description: "Back inside the hive, the bees work together to transform the collected nectar into honey. They place it into the honeycomb, where it naturally develops and matures before the honey is ready to be harvested.",
      active: true
    },
    {
      number: "03",
      category: "HIVE CHECK",
      title: "Harvested When It's Ready",
      description: "Before harvesting, the beekeeper carefully checks the hive and honeycomb. Only when the honey is ready do we begin the harvesting process, while taking care to respect the colony and leave the bees with what they need.",
      active: true
    },
    {
      number: "04",
      category: "EXTRACTION",
      title: "From Honeycomb to Drum",
      description: "The selected honey frames are placed inside a honey extractor. The frames are slowly rotated, allowing centrifugal force to release the honey from the comb. The honey flows down and is collected in a clean collection drum.",
      active: true
    },
    {
      number: "05",
      category: "COLLECTION",
      title: "Freshly Extracted Honey",
      description: "Once extracted, the honey is carefully collected into a clean container before moving to the next stage of the process. At this stage, the honey remains close to the way it came from the hive.",
      active: true
    },
    {
      number: "06",
      category: "FILTRATION",
      title: "Filtered by Gravity, Not Heat",
      description: "The collected honey is gently filtered using gravity and a clean cotton cloth. The honey slowly passes through the cloth, helping separate natural wax particles and visible impurities without relying on a heating process.",
      active: true
    },
    {
      number: "07",
      category: "QUALITY CHECK",
      title: "Tested Before It Reaches You",
      description: "Before the honey is packed, it goes through quality checks. The moisture level is checked along with the required quality parameters to ensure the honey meets our standards before it moves forward for packing.",
      active: true
    },
    {
      number: "08",
      category: "PACKING",
      title: "Filled, Labelled & Sealed",
      description: "Once the honey has passed our quality checks, it is carefully filled into jars, labelled and sealed. Every jar is prepared with the same care that went into the honey's journey from the hive.",
      active: true
    },
    {
      number: "09",
      category: "DELIVERY",
      title: "Packed With Care. Sent to You.",
      description: "The finished jars are carefully packed for their journey and prepared for dispatch. From our farm in Saurashtra to the doorstep of the person who ordered it, the journey comes full circle.",
      active: true
    }
  ]
};

async function migrate() {
  const { error } = await supabase
    .from('page_content')
    .update({ settings: newSettings })
    .eq('page_slug', 'our-story')
    .eq('section_key', 'hive_to_jar');

  if (error) {
    console.error("Migration failed:", error);
  } else {
    console.log("Successfully migrated hive_to_jar process steps!");
  }
}

migrate();
