import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://buvpytuxbynwprnwftnd.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Starting product image alignment...");

  // 1. Multiflora 1KG:
  // The true FRONT of bottle is: 1KG_MULTI_FLORA_HONEY_BACK_YZY6DwNZv.jpg
  // The true BACK of bottle is:  1KG_MULTI_FLORA_HONEY_FRONT_9Qd0Xkiw-.jpg
  const multiFront = "https://ik.imagekit.io/spuuavgve/saurashtra-honey/products/1KG_MULTI_FLORA_HONEY_BACK_YZY6DwNZv.jpg";
  const multiBack = "https://ik.imagekit.io/spuuavgve/saurashtra-honey/products/1KG_MULTI_FLORA_HONEY_FRONT_9Qd0Xkiw-.jpg";

  // Update product multiflora-honey-1KG
  const { error: errMultiProd } = await supabase
    .from("products")
    .update({
      image_url: multiFront,
      images: [multiFront, multiBack],
      updated_at: new Date().toISOString(),
    })
    .eq("slug", "multiflora-honey-1KG");

  if (errMultiProd) console.error("Error updating multiflora-honey-1KG product:", errMultiProd);
  else console.log("✓ Updated multiflora-honey-1KG product: primary image set to front view");

  // Update variant 1kg under multiflora-honey-250GM
  const { data: m250 } = await supabase.from("products").select("id").eq("slug", "multiflora-honey-250GM").single();
  if (m250) {
    const { error: errMultiVar } = await supabase
      .from("product_variants")
      .update({
        image_url: multiFront,
        images: [multiFront, multiBack],
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", m250.id)
      .eq("label", "1kg");

    if (errMultiVar) console.error("Error updating multiflora 250GM 1kg variant:", errMultiVar);
    else console.log("✓ Updated multiflora-honey-250GM 1kg variant images: front is first, back is second");
  }

  // 2. Bee Wax:
  // 1kg is the decorative honeycomb block: ChatGPT_Image_Sep_21__2026_at_07_54_04_PM_guLcRkyAM.png
  // 10kg is the circular bulk wax blocks: ChatGPT_Image_Sep_26__2026_at_09_11_08_PM_oX6HkWQjn.png
  // Gallery 2 for 10kg is:                ChatGPT_Image_Sep_26__2026_at_09_15_02_PM_fvUSawdz7c.png
  const wax10kgMain = "https://ik.imagekit.io/spuuavgve/saurashtra-honey/products/ChatGPT_Image_Sep_26__2026_at_09_11_08_PM_oX6HkWQjn.png";
  const wax10kgGallery2 = "https://ik.imagekit.io/spuuavgve/saurashtra-honey/products/ChatGPT_Image_Sep_26__2026_at_09_15_02_PM_fvUSawdz7c.png";
  const wax1kgMain = "https://ik.imagekit.io/spuuavgve/saurashtra-honey/products/ChatGPT_Image_Sep_21__2026_at_07_54_04_PM_guLcRkyAM.png";

  // Update Bee Wax product (id: 24735bf8-66cf-4a32-85a1-9a5cc7bb5f0b)
  const { data: beeWaxProd } = await supabase.from("products").select("id").eq("slug", "Bee Wax").single();
  if (beeWaxProd) {
    // Update variant 10kg on Bee Wax
    const { error: errWax10 } = await supabase
      .from("product_variants")
      .update({
        image_url: wax10kgMain,
        images: [wax10kgMain, wax10kgGallery2],
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", beeWaxProd.id)
      .eq("label", "10kg");

    if (errWax10) console.error("Error updating Bee Wax 10kg variant:", errWax10);
    else console.log("✓ Updated Bee Wax 10kg variant with 10kg circular block image");

    // Update variant 1kg on Bee Wax
    const { error: errWax1 } = await supabase
      .from("product_variants")
      .update({
        image_url: wax1kgMain,
        images: [wax1kgMain],
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", beeWaxProd.id)
      .eq("label", "1kg");

    if (errWax1) console.error("Error updating Bee Wax 1kg variant:", errWax1);
    else console.log("✓ Updated Bee Wax 1kg variant with 1kg honeycomb image");
  }

  // Update Bee Wax 10kg product (slug: Bee Wax-10Kg)
  const { data: beeWax10Prod } = await supabase.from("products").select("id").eq("slug", "Bee Wax-10Kg").single();
  if (beeWax10Prod) {
    const { error: errWax10Prod } = await supabase
      .from("products")
      .update({
        image_url: wax10kgMain,
        images: [wax10kgMain, wax10kgGallery2],
        updated_at: new Date().toISOString(),
      })
      .eq("id", beeWax10Prod.id);

    const { error: errWax10ProdVar } = await supabase
      .from("product_variants")
      .update({
        image_url: wax10kgMain,
        images: [wax10kgMain, wax10kgGallery2],
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", beeWax10Prod.id);

    if (errWax10Prod) console.error("Error updating Bee Wax-10Kg product:", errWax10Prod);
    else console.log("✓ Updated Bee Wax-10Kg product & variant with 10kg circular blocks image");
  }

  console.log("All product images aligned successfully!");
}

run().catch(console.error);

