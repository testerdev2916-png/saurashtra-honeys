import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://buvpytuxbynwprnwftnd.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const posts = [
  {
    slug: "raw-honey-vs-processed-commercial-honey-purity-guide",
    title: "Raw Honey vs Processed Commercial Honey: The Ultimate Purity & Health Guide",
    category_id: "4f0e7d4c-a913-4a25-a790-76924699599c", // honey-health
    cover_image_url: "https://ik.imagekit.io/spuuavgve/saurashtra-honey/general/HOMEPAGE_BANNER_1_zMngvO2ZQ.png",
    excerpt: "Ever wondered why commercial honey never crystallizes while raw farm honey does? Discover the scientific differences between unpasteurized raw honey and heated supermarket honey, and how Saurashtra Honey preserves living enzymes.",
    seo_title: "Raw Honey vs Processed Honey: Purity Test, Truth & Health Guide | Saurashtra Honey",
    seo_description: "Discover why raw, unfiltered honey with living bee pollen and enzymes is vastly superior to factory-pasteurized syrup. Read the definitive purity guide by Saurashtra Honey.",
    tags: ["Raw Honey", "Pure Honey India", "Honey Purity Test", "Healthy Living", "Organic Honey"],
    status: "published",
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    body_markdown: `When you stroll down the grocery aisle and pick up a golden, crystal-clear bottle of honey that flows smoothly even after two years in the pantry, you are likely looking at a product that has been ultra-filtered, heated above 65°C, and stripped of everything that makes honey a superfood.

In sharp contrast, **raw, unprocessed honey** straight from the apiary is a living biological substance teeming with beneficial flora, active diastase enzymes, bioflavonoids, and natural bee pollen.

At **Saurashtra Honey**, our mission is to bring you honey in its most authentic, unaltered state — exactly as the bees sealed it inside the comb. Let’s break down the truth about raw vs processed honey so you can make an informed choice for your family’s health.

---

### What Exactly Happens During Commercial Processing?

Most large commercial honey brands prioritize shelf-life and aesthetic clarity over nutritional integrity. To prevent natural crystallization and mass-package high volumes, commercial honey undergoes:

1. **High-Heat Pasteurization (above 65°C–70°C):** High temperatures destroy heat-sensitive digestive enzymes such as invertase, glucose oxidase, and catalase.
2. **Micro-filtration under Pressure:** Honey is forced through ultra-fine filters (often down to 0.1 microns) to remove natural bee pollen grains and propolis. Why? Because pollen provides a genetic fingerprint tracing the honey's botanical and geographic origin! Without pollen, adulteration with cheap inverted sugar syrup or rice syrup is easier to hide.
3. **Moisture & Consistency Standardization:** Batches from disparate unknown origins are blended together to create a uniform flavor and color, sacrificing the unique terroir and aroma of individual floral seasons.

---

### The Living Superfood: What Real Raw Honey Retains

When honey is extracted cold using centrifugal force and gently strained through coarse stainless steel mesh (retaining natural micro-particles), it preserves the full spectrum of therapeutic benefits:

- **Active Enzymes:** Glucose oxidase naturally produces gentle hydrogen peroxide, providing the renowned antibacterial and antimicrobial qualities of real honey.
- **Micro-Nutrients & Polyphenols:** Pinocembrin, chrysin, and caffeic acid phenethyl ester (CAPE) deliver powerful antioxidant protection against oxidative cell damage.
- **Living Bee Pollen:** Nature's multivitamin, loaded with B-complex vitamins, amino acids, and minerals that help desensitize seasonal allergic sensitivities.
- **Trace Propolis:** A natural resinous bee sealant celebrated in traditional medicine for soothing irritated throats and supporting gum health.

---

### The Big Myth: Why Real Honey Crystallizes

Have you ever noticed your jar of Saurashtra Honey developing a thick, creamy, crystalline texture during winter or in cool room temperatures? 

> **Scientific Fact:** Crystallization is not a sign of spoilage or added sugar! It is the single most definitive indicator of **100% raw, unheated honey**.

Honey is a supersaturated solution of natural fructose and glucose. Raw honey retains microscopic pollen grains that act as natural "seed nuclei" around which glucose molecules crystallize into smooth, velvety crystals. Pasteurized commercial syrup never crystallizes because the heat broke down the natural matrix and the pollen was filtered out.

If you prefer liquid honey, simply place your jar in a warm water bath (below 40°C) for 15 minutes. **Never microwave honey**, as electromagnetic heat permanently destroys delicate therapeutic enzymes.

---

### Quick Comparison Table

| Attribute | Saurashtra Raw Honey | Commercial Processed Honey |
| :--- | :--- | :--- |
| **Heat Treatment** | None (Unheated, Cold Extracted) | High Heat (>65°C Pasteurization) |
| **Bee Pollen** | Intact & Present | Filtered out by micro-screens |
| **Enzyme Activity** | High Diastase & Glucose Oxidase | Inactive or destroyed |
| **Crystallization** | Natural, creamy crystals over time | Stays artificially liquid forever |
| **Flavor Profile** | Multi-layered floral notes & terroir | One-dimensional sweet corn syrup taste |
| **Origin** | Saurashtra floral farms (Traceable) | Blended bulk imports of mixed origin |

---

### How to Enjoy Pure Saurashtra Honey Everyday

- **Morning Immunity:** Stir 1 tablespoon into lukewarm water (not boiling!) with a squeeze of fresh lemon on an empty stomach.
- **Pre-Workout Fuel:** A spoonful of unrefined honey provides an optimal blend of fast-absorbing fructose and sustainable glucose without insulin spikes.
- **Natural Face Mask:** Apply a thin layer of raw honey to clean skin for 15 minutes. Its natural humectant and antibacterial properties deeply hydrate and clear blemishes.

Experience the honest taste of pure nectar harvested with love from our Saurashtra apiaries. Visit our shop and taste the raw difference today!`
  },
  {
    slug: "ajwain-honey-benefits-for-digestion-acidity-cough",
    title: "Ajwain Blossom Honey: Science-Backed Health Benefits for Digestion, Acidity & Cough Relief",
    category_id: "1ed75933-6d35-4aaf-a0bd-a5a4d030db69", // honey-guide
    cover_image_url: "https://ik.imagekit.io/spuuavgve/saurashtra-honey/products/250G_AJWAIN_FLORA_HONEY_FRONT_iIPJ_x6EF.jpg",
    excerpt: "Harvested during the short blooming season of carom (ajwain) flowers in Gujarat, single-flora Ajwain honey is revered in Ayurveda for instant digestive relief, bloating reduction, and respiratory health.",
    seo_title: "Ajwain Honey Benefits: Digestion, Cough & Acidity Relief | Saurashtra Honey",
    seo_description: "Discover the unique medicinal properties of unpasteurized single-origin Ajwain honey. Pure nectar harvested from organic carom blooms in Saurashtra, Gujarat.",
    tags: ["Ajwain Honey", "Single Flora Honey", "Ayurvedic Remedies", "Digestive Health", "Natural Cough Relief"],
    status: "published",
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    body_markdown: `Among India’s rich herbal traditions, **Ajwain (Trachyspermum ammi or Carom Seed)** holds a legendary place in every grandmother’s spice chest for soothing tummy aches, acidity, and sudden bouts of spasmodic coughing.

Now imagine capturing that ancient medicinal potency directly from the source — not by infusing crushed seeds into syrup, but by placing bee colonies amidst rolling fields of blooming white Ajwain blossoms in the heart of rural Gujarat!

The result is **Saurashtra Honey's 100% Pure Single-Flora Ajwain Honey**: a dark, rich, deeply aromatic nectar with a distinctive warm herbal finish and extraordinary therapeutic properties.

---

### What is Single-Flora (Mono-Floral) Honey?

Most commercial honeys are polyfloral blends. Mono-floral or single-flora honey is harvested during the brief 3-to-4 week window when a specific crop is in full bloom. 

Our beekeepers migrate healthy bee boxes right next to flourishing, pesticide-free ajwain fields in Gujarat. The bees forage almost exclusively on the delicate nectar of ajwain blossoms. The honey naturally inherits the essential phyto-compounds — notably **thymol** — of the parent plant.

---

### Top Health Benefits of Ajwain Blossom Honey

#### 1. Instant Relief from Acidity, Gas & Bloating
Thymol is known in pharmacology as a powerful carminative. When consumed in the form of raw honey, it gently stimulates gastric enzymes without irritating inflamed stomach linings. 
- **How to use:** Take 1 teaspoon of Ajwain Honey mixed with half a glass of warm water 30 minutes after heavy meals.

#### 2. Relieves Spasmodic Cough & Chest Congestion
Raw Ajwain honey acts as a natural bronchodilator. It helps thin out stubborn mucus in the bronchial tract while coating the throat with a protective antibacterial layer.
- **Ayurvedic combination:** Mix 1 teaspoon of Saurashtra Ajwain Honey with 1/4 teaspoon of freshly grated ginger juice and a pinch of black pepper before bedtime.

#### 3. Supports Healthy Weight Management
Unlike refined white sugar that triggers rapid insulin spikes followed by crashes, the balanced fructose and complex oligosaccharides in raw Ajwain honey nourish beneficial gut microbiome bacteria, helping regulate appetite and metabolic fire (*Agni*).

#### 4. Post-Partum & Women's Health
In traditional postpartum Ayurvedic care (*Sutika Paricharya*), Ajwain is routinely given to new mothers to promote healthy lactation, expel uterine toxins, and prevent colic in nursing infants. Ajwain honey offers all these perks in a gentle, delicious form.

---

### Tasting Notes & Visual Characteristics

- **Color:** Warm amber to rich dark mahogany.
- **Aroma:** Pungent, herbal, with distinct carom and dried spice undertones.
- **Taste:** Starts with a smooth, velvety sweetness, followed by a warm, gently spicy throat sensation.
- **Texture:** Dense, viscous, and crystallizes into a buttery, fine paste in colder months.

---

### Why Saurashtra Honey Ajwain Honey Stands Apart

- **Zero Added Flavoring or Infusion:** This is not sugar syrup mixed with ajwain extract. It is 100% natural flower nectar collected by bees.
- **Zero Heat Processing:** Bottled raw to keep the vital thymol and bio-enzymes intact.
- **Ethically Sourced:** Supporting local Gujarati farmer-beekeepers who respect organic pollination cycles.

Try a spoonful of pure nature today — explore our [250g and 1kg Ajwain Flora Honey](/shop) in the shop!`
  },
  {
    slug: "ethical-beekeeping-saurashtra-hive-to-home-journey",
    title: "Ethical Beekeeping in Saurashtra: How Raw Honey Travels from Hive to Home Without Factory Heat",
    category_id: "8069c3b5-986e-4ee9-9a28-21b92e4b1250", // our-farm
    cover_image_url: "https://saurashtrahoney.com/images/heritage/journey-beekeeper.webp",
    excerpt: "Step inside the bee yards of Saurashtra Honey in Mahuva and coastal Gujarat. Learn how ethical apiculture protects bee colonies, prevents sugar-feeding, and delivers 100% pure raw nectar to your family.",
    seo_title: "Ethical Beekeeping in Saurashtra, Gujarat | Hive to Home Pure Honey",
    seo_description: "Take a behind-the-scenes look at how Saurashtra Honey practices zero-cruelty, sustainable beekeeping in Gujarat. No boiling, no adulteration, pure raw farm harvest.",
    tags: ["Ethical Beekeeping", "Saurashtra Honey Farm", "Mahuva Gujarat", "Sustainable Apiculture", "Hive to Bottle"],
    status: "published",
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    body_markdown: `In an era of industrial mega-factories where honey is treated like an industrial commodity — pasteurized in giant steel vats, pumped through ultra-fine filters, and frequently stretched with synthetic syrups — the age-old art of authentic beekeeping is becoming rare.

At **Saurashtra Honey**, headquartered in the lush agricultural belts of Mahuva and greater Saurashtra, Gujarat, we believe that honey is not manufactured. It is harvested.

Our philosophy is simple: **we respect the bees first, and the honey naturally follows.** Here is how our ethical, hive-to-home journey unfolds across the seasons.

---

### Step 1: Following the Seasonal Floral Bloom (Nomadic Apiculture)

Bees thrive on diversity. Instead of confining bee colonies to a single barren patch and feeding them artificial white sugar water, our beekeepers follow the natural flowering cycles of Gujarat and surrounding regions:

- **Winter:** Vibrant mustard, wild fennel, and ajwain blooms across Saurashtra.
- **Spring:** Citrus, eucalyptus, and wild forest blossom flushes.
- **Summer & Monsoon:** Allowing the bees adequate rest and leaving generous reserves of natural honey in the brood boxes so the colony stays robust and healthy without chemical intervention.

---

### Step 2: The Golden Rule — Honey Belonging to the Bees Stays with the Bees

Commercial honey operations often harvest every drop of comb honey and replace the bees' winter food with cheap high-fructose corn syrup or commercial sugar solution. This weakens the bees' immune systems and leads to colony collapse.

> **Our Ethical Commitment:** We only harvest surplus honey from the upper "honey supers" (the storage frames). The lower brood chamber, where the queen lays eggs and the colony feeds, is left untouched. A well-nourished hive is a happy, disease-resistant hive.

---

### Step 3: Harvesting Only Fully Capped Honeycomb

Immature honey has high water content (above 20%), which quickly ferments. Factory brands harvest unripe honey and use artificial vacuum evaporators to boil off excess water. This extreme heat pasteurizes the honey and ruins its living biology.

We wait patiently until the worker bees naturally fan their wings over the comb to evaporate moisture to below 18% and seal each hexagonal cell with a clean cap of pure beeswax. When a comb is 90%+ capped, we know nature has finished her masterwork.

---

### Step 4: Cold Mechanical Extraction & Gentle Mesh Straining

Once the frames are collected:
1. The thin beeswax cappings are carefully uncapped by hand with an uncapping fork.
2. The frames are placed inside a manual centrifugal extractor that spins the honey out without crushing the comb structure. The empty comb is returned to the bees so they don’t waste energy rebuilding wax from scratch!
3. The honey is gently passed through dual stainless steel food-grade mesh screens to remove wax fragments and large bee debris.
4. It is **never heated, never boiled, and never micro-filtered**.

---

### Step 5: Direct Bottling in Glass & Food-Grade Jars

Finally, the honey rests in stainless steel settling tanks for 48 hours to allow natural micro-air bubbles to rise to the surface. It is then bottled, sealed, and dispatched straight from Saurashtra to your doorstep.

When you purchase Saurashtra Honey, you are directly supporting traditional rural beekeepers, preserving native bee populations, and providing your family with the unadulterated healing power of pure earth nectar.

Explore our [Our Story](/our-story) page or watch our farm documentary on the homepage to see our beekeepers in action!`
  },
  {
    slug: "warm-water-raw-honey-morning-routine-benefits",
    title: "Why Drinking Raw Honey with Warm Water Every Morning Boosts Immunity & Metabolism",
    category_id: "605158cc-b664-41d0-95a4-5f21d7f2993f", // natural-living
    cover_image_url: "https://ik.imagekit.io/spuuavgve/saurashtra-honey/categories/HONEY_uz8G7m5Ql.png",
    excerpt: "From kicking off sluggish morning metabolism to detoxifying your liver and calming gastric fire, a glass of lukewarm water with a spoon of raw unprocessed honey is a centuries-tested elixir.",
    seo_title: "Warm Water & Raw Honey Morning Routine Benefits | Saurashtra Honey",
    seo_description: "The scientifically proven health benefits of raw honey with lukewarm water every morning. How to take it correctly without killing natural bio-enzymes.",
    tags: ["Morning Routine", "Honey with Warm Water", "Immunity Boost", "Natural Weight Management", "Healthy Habits"],
    status: "published",
    published_at: new Date().toISOString(),
    body_markdown: `In the world of modern wellness trends — where complex detox cleanses and expensive powders constantly compete for attention — one of the most powerful, time-tested health rituals requires only two simple ingredients: **pure raw honey and a glass of warm water.**

Referred to in classical Ayurvedic texts as *Madhu Udaka*, this morning elixir has been celebrated for millennia. But what does modern nutritional science say about this morning ritual, and how can you do it correctly to maximize its benefits?

Let’s dive into why making raw Saurashtra Honey part of your wake-up routine can transform your daily vitality.

---

### The Science Behind the Morning Warm Honey Water

#### 1. Awakens Sluggish Digestion & Metabolism
After 7 to 8 hours of sleep, your digestive tract is in a fasting state. Drinking a glass of lukewarm water infused with raw honey:
- Stimulates natural peristaltic bowel movement, preventing morning constipation.
- Activates salivary and gastric enzyme secretion.
- Provides immediate liver glycogen replenishment without overloading blood glucose.

#### 2. Natural Detoxification & Liver Support
During the overnight fasting window, your liver works diligently to filter toxins and balance cellular repairs. The unique combination of fructose and glucose in raw honey replenishes liver glycogen reserves, enabling the liver to maintain optimal morning detoxification pathways.

#### 3. Immune System Shield
Raw, unheated honey contains natural amounts of hydrogen peroxide generated by the enzyme glucose oxidase, alongside bee propolis and flavonoids. A daily morning cup helps form a protective coating over the pharyngeal mucosa, fighting off seasonal pathogens, scratchy morning throat, and airborne irritants.

#### 4. Assists Healthy Weight Management
Replacing sugary morning chai, processed coffee syrups, or fruit juices with warm honey-lemon water reduces cravings throughout the morning. The complex carbohydrate profile of authentic raw honey keeps satiety signals stable and prevents the mid-morning 11 AM hunger slump.

---

### The Critical Mistake: The Temperature Warning

One of the most common mistakes people make is mixing honey into **boiling hot water or scalding tea**.

> **Crucial Warning:** Never mix raw honey into boiling water (above 40°C–45°C)! 

In ancient Ayurveda, heated honey is described as producing *Ama* (toxic undigested metabolic byproduct). Modern food chemistry confirms this: when honey is heated above 40°C:
1. Beneficial enzymes (invertase, diastase, glucose oxidase) are permanently denatured.
2. Levels of **Hydroxymethylfurfural (HMF)**, a byproduct of carbohydrate degradation under heat, rise dramatically.
3. Delicate volatile floral aromas evaporate.

**The Golden Rule:** Boil your water, let it cool in a cup until it is comfortable to sip (lukewarm/room-temperature warm), and *only then* stir in your raw honey!

---

### The Perfect 3-Step Morning Recipe

1. **Step 1:** Pour 250ml of filtered drinking water into a mug and warm it until lukewarm (approx 35°C–40°C).
2. **Step 2:** Add 1 tablespoon of **Saurashtra Raw Multiflora or Ajwain Honey**.
3. **Step 3:** (Optional) Squeeze in the juice of half a fresh lemon for an extra dose of Vitamin C and alkalizing electrolytes.
4. **Step 4:** Stir gently with a wooden or stainless steel spoon and sip slowly while sitting comfortably.

Make this simple practice a mindful 5-minute ritual every morning, and feel your energy, digestion, and skin radiance flourish day after day.`
  }
];

async function seed() {
  console.log(`Starting insertion of ${posts.length} authoritative SEO posts into blog_posts...`);

  for (const post of posts) {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();

    if (existing) {
      console.log(`Updating existing post: ${post.slug}`);
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: post.title,
          excerpt: post.excerpt,
          body_markdown: post.body_markdown,
          cover_image_url: post.cover_image_url,
          category_id: post.category_id,
          seo_title: post.seo_title,
          seo_description: post.seo_description,
          tags: post.tags,
          status: post.status,
          published_at: post.published_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) {
        console.error(`Failed to update ${post.slug}:`, error);
      } else {
        console.log(`Successfully updated: ${post.slug}`);
      }
    } else {
      console.log(`Inserting new post: ${post.slug}`);
      const { error } = await supabase.from("blog_posts").insert(post);
      if (error) {
        console.error(`Failed to insert ${post.slug}:`, error);
      } else {
        console.log(`Successfully inserted: ${post.slug}`);
      }
    }
  }

  console.log("\nVerifying published posts in Supabase:");
  const { data: allPosts } = await supabase
    .from("blog_posts")
    .select("slug, title, status, published_at")
    .eq("status", "published");
  console.table(allPosts);
}

seed().catch(console.error);
