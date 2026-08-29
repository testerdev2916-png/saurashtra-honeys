-- Enhance blog_posts table with new D2C editorial fields
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_popular BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reading_time TEXT DEFAULT '5 min read',
  ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Saurashtra Honey Editorial Team',
  ADD COLUMN IF NOT EXISTS category_name TEXT;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS blog_posts_featured_idx ON public.blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS blog_posts_popular_idx ON public.blog_posts(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_cat_name_idx ON public.blog_posts(category_name);

-- Seed default D2C categories if not already present
INSERT INTO public.blog_categories (slug, name, description, sort_order)
VALUES
  ('honey-health', 'Honey & Health', 'Research-backed nutritional & daily immunity benefits of raw honey', 10),
  ('ayurveda-remedies', 'Ayurveda & Remedies', 'Ancient Ayurvedic wisdom and daily wellness rituals', 20),
  ('beekeeping-stories', 'Beekeeping Stories', 'Inside our floral farms, bee care, and natural harvesting', 30),
  ('recipes-pairings', 'Recipes & Pairings', 'Culinary pairings, summer coolers, and soothing teas', 40),
  ('sustainability', 'Sustainability', 'Protecting indigenous bees and agricultural biodiversity', 50)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- Seed initial published blog posts so database has real editable/deletable production-ready records
INSERT INTO public.blog_posts (
  slug,
  title,
  excerpt,
  body_markdown,
  category_name,
  author_name,
  reading_time,
  status,
  is_featured,
  is_popular,
  published_at
)
VALUES
  (
    '7-health-benefits-of-raw-honey',
    '7 Health Benefits of Raw Honey You Should Know',
    'From boosting daily immunity to supporting gut flora, unheated raw floral honey is nature''s most enduring medicine.',
    '## What is Raw Honey?

Raw honey is honey that has never been heated or filtered past what is needed to remove wax and debris. Keeping it in its natural state preserves the enzymes, pollen and antioxidants that make honey more than a sweetener.

### 1. Antioxidant Powerhouse
Rich in antioxidants such as flavonoids and phenolic acids, raw honey helps the body fight oxidative stress. A daily spoonful can support long-term cellular health.

### 2. Gentle Throat Soother & Cough Relief
Traditionally used to soothe sore throats and coughs, honey coats the throat and offers gentle antimicrobial support — a reason it is a staple in home remedies across generations.

### 3. Gut Microbiome Support
Its natural enzymes aid digestion and act as a mild prebiotic, feeding the good bacteria in your gut for a healthier microbiome.

### 4. Natural Pre-Workout Energy
Because raw honey contains natural sugars alongside minerals, it delivers steady energy without the crash of refined sugar — a smart pre-workout swap.

### 5. Skin & Topical Healing
Topically, honey has been used for centuries on minor burns and cuts thanks to its natural antibacterial properties.

### 6. Daily Ayurvedic Rituals
Enjoy raw honey in warm (not hot) water with lemon, drizzled over fruit, or straight off the spoon. Avoid boiling it to preserve its living enzymes.',
    'Honey & Health',
    'Saurashtra Honey Editorial Team',
    '5 min read',
    'published',
    true,
    false,
    '2024-05-14T10:00:00Z'
  ),
  (
    'inside-our-bee-farms',
    'Inside Our Bee Farms: Where Pure Honey Begins',
    'A deep dive into natural beekeeping practices in Saurashtra and how we harvest without harming the colonies.',
    '## The Floral Belts of Saurashtra

Our farms sit in the fertile floral belts of Saurashtra, where diverse wildflowers, ajwain, fennel and mustard bloom across the seasons.

### Low-Intervention Beekeeping
We work with small family beekeepers who share a commitment to natural, low-intervention beekeeping — no antibiotics, no artificial feeding when nectar is flowing.

### Ethical Harvesting
Every hive is inspected regularly for colony health. Strong, calm colonies produce cleaner, better-tasting honey. Honey is harvested only when the combs are naturally capped by the bees, ensuring the right moisture and ripeness in every jar.

### Minimal Processing
After harvest we strain out wax and debris — nothing more. No heating past hive temperature, no ultra-filtration, no additives. The result is honey that still crystallises, still tastes of its floral origin, and still carries the enzymes nature intended.',
    'Beekeeping Stories',
    'Saurashtra Honey Editorial Team',
    '6 min read',
    'published',
    false,
    false,
    '2024-05-10T10:00:00Z'
  ),
  (
    'raw-vs-processed-honey',
    'Raw Honey vs Processed Honey: Why Purity Matters',
    'Understanding HMF, live pollen, and enzymes — why store-bought supermarket honey is often nutritionally dead.',
    '## What Happens During Commercial Processing?

Processed honey is typically pasteurised at high temperatures and ultra-filtered to give it a uniform look and long shelf life on supermarket shelves.

### The Nutritional Loss
That processing strips away pollen, enzymes and much of the antioxidant content — leaving behind mostly sweet syrup.

### Why Raw Honey Behaves Differently
Raw honey looks and behaves like a living food: it varies in colour, aroma and texture depending on flora and season, and it crystallises naturally over time.

For everyday sweetness both will do; for the goodness people actually associate with honey, raw is the real thing.',
    'Ayurveda & Remedies',
    'Saurashtra Honey Editorial Team',
    '4 min read',
    'published',
    false,
    false,
    '2024-05-08T10:00:00Z'
  ),
  (
    'refreshing-summer-drinks',
    '5 Refreshing Summer Drinks & Pairings with Honey',
    'Beat the heat naturally with artisanal floral honeys paired with citrus, mint, and soothing herbal teas.',
    '## Natural Refreshment Under the Sun

Beat the summer heat naturally with these easy and healthy honey-based summer drinks.

### 1. Honey Lemonade
Cold water, fresh lemon juice, a spoon of raw honey, and mint leaves. Stir well and serve over ice.

### 2. Honey Iced Tea
Cool a light black or green tea, sweeten with honey and finish with a lemon wedge.

### 3. Honey Mint Cooler
Muddle mint with honey, top up with sparkling water for a crisp, herbal drink.

### 4. Honey Buttermilk
Whisk chilled buttermilk with a spoon of honey, a pinch of black salt and roasted cumin.

### 5. Honey Ginger Refresher
Brew ginger in warm water, cool, sweeten with honey and add lime for a zesty pick-me-up.',
    'Recipes & Pairings',
    'Saurashtra Honey Editorial Team',
    '3 min read',
    'published',
    false,
    false,
    '2024-05-05T10:00:00Z'
  ),
  (
    'how-bees-help-planet-bloom',
    'How Bees Help Our Ecosystem Bloom',
    'Why protecting indigenous bee species in Saurashtra is critical for agricultural biodiversity across India.',
    '## Pollinators of India

Bees pollinate a large share of the fruits, vegetables and nuts we eat — protecting bees means protecting our food supply.

### Beyond Agriculture
Beyond crops, wild pollination keeps forests and grasslands healthy, supporting biodiversity from soil microbes to birds.

### What You Can Do
Simple actions help: plant native flowers, avoid pesticides, and choose honey from beekeepers who prioritise colony health. Supporting small-batch, natural beekeepers keeps traditional pollination-first practices alive.',
    'Sustainability',
    'Saurashtra Honey Editorial Team',
    '6 min read',
    'published',
    false,
    false,
    '2024-05-02T10:00:00Z'
  ),
  (
    'life-cycle-of-honey-bee',
    'Understanding the Life Cycle of a Honey Bee',
    'From queen cells to foraging scouts — explore the fascinating social architecture of the beehive.',
    '## The Fascinating Social Architecture of the Hive

A honey bee life begins as a tiny egg laid in a hexagonal comb cell by the colony queen.

### From Larva to Worker Bee
The egg hatches into a larva, cared for and fed by nurse bees for several days. The cell is capped and the larva pupates, transforming into an adult over about a week.

### Roles Across Seasons
Newly emerged workers first tend to the hive, then progress to guarding and foraging as they mature. The queen can live for years, while workers live only weeks in the busy season — a rhythm that keeps the colony thriving.',
    'Beekeeping Stories',
    'Saurashtra Honey Editorial Team',
    '6 min read',
    'published',
    false,
    false,
    '2024-04-30T10:00:00Z'
  ),
  (
    'how-to-identify-pure-honey',
    'How to Identify Pure Honey at Home',
    'Simple ways to tell raw, pure honey from adulterated supermarket blends and understand crystallization.',
    '## The Crystallization Test

Pure honey tends to crystallise over time — a natural sign of authenticity, not spoilage. Adulterated syrup honey rarely crystallises naturally.

### Aroma & Floral Signature
Look for varietal aroma and flavour that reflects the flora it came from. Single-flora honeys like Ajwain and Fennel carry distinct aroma profiles.

### NABL Lab Reports
Check for a lab report; reputable brands share moisture, HMF and sugar-profile results. Trust small-batch producers who name their farms and floral sources.',
    'Honey & Health',
    'Saurashtra Honey Editorial Team',
    '4 min read',
    'published',
    false,
    true,
    '2024-04-28T10:00:00Z'
  ),
  (
    'best-flora-for-honey',
    'Best Flora for Honey: Ajwain, Fennel & Wildflower',
    'A tour of the single-flora honeys that make Saurashtra special and how floral origins shape taste.',
    '## Single-Flora Specialties of Saurashtra

Ajwain honey has a warm, savoury note and is traditionally valued as a digestive aid.

### Fennel & Lychee
Fennel honey is mildly sweet with a soothing herbal aroma — great in warm water. Lychee honey is delicate and floral, ideal drizzled over fruit or yoghurt.

### Multiflora Wildflower
Multiflora honey blends the character of many wildflowers into a rounded, everyday jar.',
    'Ayurveda & Remedies',
    'Saurashtra Honey Editorial Team',
    '6 min read',
    'published',
    false,
    true,
    '2024-04-25T10:00:00Z'
  ),
  (
    'honey-lemon-water-benefits',
    'Honey & Lemon Water: Ayurveda Daily Routine',
    'A simple morning ritual that supports hydration, immunity, and gentle digestive wellness.',
    '## Why Warm Water Matters

Warm (not boiling) water preserves honey natural enzymes. High temperatures can destroy live enzymes and convert natural sugars.

### Vitamin C & Bright Flavor
Half a lemon adds vitamin C and a bright, wake-up flavour. Drink on an empty stomach to gently kickstart digestion.

### Consistency Over Detox Trends
Stay consistent — small daily habits do more than occasional detox trends.',
    'Recipes & Pairings',
    'Saurashtra Honey Editorial Team',
    '3 min read',
    'published',
    false,
    true,
    '2024-04-22T10:00:00Z'
  ),
  (
    'how-we-ensure-unadulterated-drops',
    'How We Ensure Every Drop is NABL Lab Verified',
    'Behind-the-scenes look at our quality process from hive to jar and why traceability is everything.',
    '## Our Quality Promise

Every batch is tested for moisture, HMF, fructose/glucose ratio and any sign of adulteration.

### Zero Syrup Blending
We only harvest capped combs and never blend with imported syrup honey.

### Complete Farm Traceability
Traceability starts at the farm: each jar can be traced back to its batch and floral source. Purity is a system, not a marketing claim — and our lab reports back it up.',
    'Sustainability',
    'Saurashtra Honey Editorial Team',
    '5 min read',
    'published',
    false,
    true,
    '2024-04-20T10:00:00Z'
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  body_markdown = EXCLUDED.body_markdown,
  category_name = EXCLUDED.category_name,
  author_name = EXCLUDED.author_name,
  reading_time = EXCLUDED.reading_time,
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured,
  is_popular = EXCLUDED.is_popular,
  published_at = EXCLUDED.published_at;
