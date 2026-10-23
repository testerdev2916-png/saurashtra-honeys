import { createClient } from '@supabase/supabase-js';
import process from 'process';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const defaults = [
  { title: "Pure No Additives", icon: "/images/trust/pure_no_additives.png", enabled: true, sort_order: 1 },
  { title: "Raw & Unprocessed", icon: "/images/trust/raw_unprocessed.png", enabled: true, sort_order: 2 },
  { title: "Natural Floral Sources", icon: "/images/trust/natural_floral.png", enabled: true, sort_order: 3 },
  { title: "Rich in Nutrients", icon: "/images/trust/rich_nutrients.png", enabled: true, sort_order: 4 },
  { title: "Lab Tested", icon: "/images/trust/lab_tested.png", enabled: true, sort_order: 5 },
  { title: "Ethical Beekeeping", icon: "/images/trust/ethical_beekeeping.png", enabled: true, sort_order: 6 },
];

async function seed() {
  const { data, error } = await supabase.from("homepage_trust_items").select("*");
  if (data && data.length > 0) {
    console.log("Trust items already exist.");
    return;
  }
  
  const res = await supabase.from("homepage_trust_items").insert(defaults);
  if (res.error) {
    console.error("Insert failed:", res.error);
  } else {
    console.log("Inserted defaults!");
  }
}
seed();
