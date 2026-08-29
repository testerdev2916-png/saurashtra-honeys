# CHANGELOG: Admin Video CMS & Dynamic Product Categories Update

**Date:** 2026-07-28  
**Project:** Saurashtra Honey — E-Commerce Website  
**Version:** 4.1.0 (Admin Video CMS + Dynamic Categories + Supabase Integration)

---

## 1. Summary of Changes

### New Files Created
1. `supabase/migrations/20260728100000_admin_video_cms_and_dynamic_categories.sql`
   - Complete Supabase PostgreSQL migration for the `homepage_videos` table and dynamic categories normalization.
   - Adds `homepage_videos` table with columns: `id`, `title`, `subtitle`, `badge`, `video_url`, `thumbnail_url`, `product_slug`, `link_url`, `status`, `is_active`, `display_order`, `created_at`, `updated_at`.
   - Adds Row Level Security (RLS) policies allowing public read of active/published videos and restricted staff (admin/manager/editor) CRUD operations.
   - Configures storage limits in Supabase `storage.buckets` (`media` and `product-images`) to allow files up to **200 MB** (`209715200` bytes) and allowed MIME types (`video/mp4`, `video/webm`, `video/quicktime`, etc.).
   - Inserts default normalized categories into `public.categories` (`Single Flora Honey`, `Multiflora Honey`, `Raw Unfiltered Honey`, `Honey Comb`, `Gift Packs & Combos`) and sets generic `'Honey'` to inactive (`active = false`).
   - Re-assigns legacy product category strings (`Single Flora`, `Raw Honey`, `Gift Packs`, etc.) to the normalized category names in `public.products`.
2. `src/lib/homepage-videos.ts`
   - Client/server utility module providing `HomepageVideoItem` type, `DEFAULT_HOMEPAGE_VIDEOS` fallback dataset, and `fetchHomepageVideos()` to fetch active published videos from `public.homepage_videos` ordered by `display_order` and `created_at`.
3. `src/routes/admin.stories.tsx`
   - Full Admin CMS page at `/admin/stories` for **Homepage Management → Video / Story Section**.
   - Features:
     - Interactive table of story cards showing display order, poster thumbnail preview, video badge, title, subtitle, product link, status pill, and reorder up/down controls.
     - Full Add/Edit Form with card metadata, badge label, dropdown to link any product from the catalog, and custom URL override.
     - Direct Supabase Storage upload to the `media` bucket for **poster thumbnails** (`stories/thumbnails/`) and **9:16 vertical videos** (`stories/videos/`) with interactive upload progress bar.
     - Client-side validation enforcing **<= 200 MB per video** and **<= 10 MB per thumbnail**.
     - **9:16 Vertical Live Preview Card** embedded directly in the Admin editor with play/pause controls.
4. `CHANGELOG_ADMIN_VIDEO_CMS_DYNAMIC_CATEGORIES.md` (this file)
   - Comprehensive documentation and setup guide.

### Modified Files
1. `src/lib/admin-cms.functions.ts`
   - Added server RPC functions:
     - `listHomepageVideos`: returns all story cards ordered by `display_order ASC, created_at ASC`.
     - `upsertHomepageVideo`: creates or updates a story card with audit logging.
     - `deleteHomepageVideo`: deletes a story card by ID with audit logging.
     - `reorderHomepageVideos`: updates display order for a list of story cards with audit logging.
2. `src/components/site/StorySection.tsx`
   - Upgraded `StorySection` to fetch dynamic homepage video/story cards from `fetchHomepageVideos()` with seamless fallback to `DEFAULT_HOMEPAGE_VIDEOS`.
   - Preserves 100% of the existing typography, colors, animations, and responsive layout.
   - Enforces **9:16 vertical aspect ratio** (`aspect-[9/16]`) on all story cards.
   - Implements **poster-first lazy loading**: renders poster image with Ken Burns animation by default; no video is downloaded until the customer interacts with the card.
   - Displays dynamic products in "Shop The Story" linked to the active published story cards.
3. `src/components/admin/AdminShell.tsx`
   - Updated Admin sidebar navigation to show:
     - `Homepage → Hero Banner` (`/admin/hero`)
     - `Homepage → Video / Story` (`/admin/stories`)
4. `src/routes/admin.products.tsx`
   - Upgraded the **Category** input field inside Admin -> Products -> Add/Edit Product (`ProductForm`) from a plain text input to a dynamic category combobox selector.
   - Fetches all existing categories from `public.categories`.
   - Admins can select an existing category OR type a new category name.
   - When a product with a new category is saved, the category is **automatically created** in the `public.categories` table in Supabase.
5. `src/components/site/Navbar.tsx`
   - Upgraded navigation (Desktop Mega Menu & Mobile Hamburger Menu) to fetch categories dynamically from Supabase (`fetchShopCategories`) with fallback to catalog categories.
   - Ensures any new category created by the Admin immediately appears in the navigation menus without code changes.
6. `src/routes/shop.tsx`
   - Added support for both `category` and `cat` URL search parameters so category links from Navbar mega menus and category cards seamlessly filter shop products.
7. `src/integrations/supabase/types.ts`
   - Added `homepage_videos` table schema to TypeScript `Database.public.Tables` definitions for strict type safety.

---

## 2. Supabase Setup Instructions

To activate the Video CMS and Dynamic Categories in your Supabase project, execute the SQL migration file in your Supabase SQL Editor:

### Step 1: Open Supabase SQL Editor
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. In the left sidebar, click on **SQL Editor** (`/project/<id>/sql`).
4. Click **+ New Query**.

### Step 2: Execute the Migration Script
1. Open the file `supabase/migrations/20260728100000_admin_video_cms_and_dynamic_categories.sql` from your project folder.
2. Copy the entire SQL contents.
3. Paste into the Supabase SQL Editor and click **Run**.
4. Verify that the output shows `Success. No rows returned.`

### What the Migration Does Automatically:
- Creates `public.homepage_videos` table with RLS policies and trigger for `updated_at`.
- Updates `storage.buckets` (`media` and `product-images`) with `file_size_limit = 209715200` (200 MB) and allowed video/image MIME types.
- Seeds default `public.categories` rows (`Single Flora Honey`, `Multiflora Honey`, `Raw Unfiltered Honey`, `Honey Comb`, `Gift Packs & Combos`).
- Migrates existing product records in `public.products` from legacy category strings to the normalized category names.
- Updates RLS policies for `public.categories` to allow staff CRUD operations.

---

## 3. Verification & Testing Guide

1. **Verify Admin Video CMS (`/admin/stories`):**
   - Navigate to `/admin/stories` in your browser.
   - Click **NEW STORY CARD**.
   - Upload a poster image and a 9:16 vertical video clip (up to 200 MB). Notice the interactive upload progress bar and vertical preview card.
   - Select a linked product (e.g., *Ajwain Honey*) and click **SAVE STORY CARD**.
   - Use the **Up/Down arrow buttons** in the list to reorder story cards.
2. **Verify Homepage Story Section (`/`):**
   - Open the homepage (`/`) and scroll to **Why Choose Us — A Promise in Every Jar**.
   - Verify that your story cards appear with their poster images and vertical 9:16 layout.
   - Click the **Play button** on any card to confirm smooth video playback.
3. **Verify Dynamic Category Creation & Sync:**
   - Go to **Admin → Products** (`/admin/products`) and click **NEW PRODUCT** or edit an existing product.
   - In the **Category** dropdown, select **+ Create new category...** and type a new name (e.g., `Wildflower Specials`).
   - Save the product.
   - Refresh the site and check the **Navbar Shop Mega Menu** and **Shop Page** (`/shop`) — the new category is automatically present and filters products correctly.

---

## 4. Creating the ZIP Archives (Patch ZIP & Complete Website ZIP)

We have provided a zero-dependency Node.js script [scripts/create_zips.mjs](file:///Users/rahicreativemedia/Downloads/Natural_Ecom_Elevate_4_category-images_FIXED/scripts/create_zips.mjs) that automatically packages the project into two clean ZIP archives:
1. **`Saurashtra_Honey_Admin_Video_CMS_Patch.zip`** — Contains ONLY the newly created and modified files along with this CHANGELOG.
2. **`Saurashtra_Honey_Complete_Website_Updated.zip`** — Contains the complete updated e-commerce website (excluding `node_modules`, `.git`, and temporary build artifacts).

### How to generate the ZIP archives:
Open your terminal in the project root directory and run:
```bash
node scripts/create_zips.mjs
```
Both ZIP files will be generated in the root directory immediately.
