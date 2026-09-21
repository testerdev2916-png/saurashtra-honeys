import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data } = await sb.from("products").select("name, images, image_url").eq("slug", "ajwain-honey").single();
  console.log(JSON.stringify(data, null, 2));
}
run();
