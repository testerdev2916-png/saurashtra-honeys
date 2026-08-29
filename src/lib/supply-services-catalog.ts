import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertStaff(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("is_staff", { _user_id: userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

export type SupplyServiceRow = {
  id: string;
  title: string;
  short_description: string;
  image_key: string | null;
  image_url: string | null;
  icon_name: string;
  detail_title: string;
  subtitle: string;
  full_description: string;
  key_points: string[];
  cta_text: string;
  cta_message: string;
  is_active: boolean;
  sort_order: number;
};

export const DEFAULT_SUPPLY_SERVICES: SupplyServiceRow[] = [
  {
    id: "retail-chains",
    title: "Retail Chains",
    short_description: "Grocery, organic and speciality stores",
    image_key: "prod-multiflora",
    image_url: null,
    icon_name: "Store",
    detail_title: "Retail Chains",
    subtitle: "Premium Natural Honey for Modern Retail",
    full_description:
      "Partner with Saurashtra Honey to bring authentic, quality honey products to your customers. We supply retail-ready products suitable for supermarkets, grocery stores, organic stores and specialty retail outlets.",
    key_points: [
      "Multiple honey varieties and pack sizes",
      "Retail-ready branded packaging",
      "Bulk ordering support",
      "Consistent supply for retail partners",
      "Wholesale/business pricing",
      "Support for recurring orders",
    ],
    cta_text: "Enquire for Retail Supply",
    cta_message:
      "Hello Saurashtra Honey, I’m interested in Retail Supply. Please share business pricing, MOQ and available products.",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "horeca",
    title: "HORECA",
    short_description: "Hotels, restaurants and luxury cafes",
    image_key: "prod-liquid",
    image_url: null,
    icon_name: "Factory",
    detail_title: "HORECA Supply",
    subtitle: "Honey Solutions for Hotels, Restaurants & Cafés",
    full_description:
      "Reliable honey supply for hospitality and food-service businesses, from boutique cafés to hotels and restaurants.",
    key_points: [
      "Bulk honey supply",
      "Multiple packaging options",
      "Suitable for hotels, restaurants and cafés",
      "Consistent quality and supply",
      "Business quantity ordering",
      "Custom requirements based on volume",
    ],
    cta_text: "Enquire for HORECA Supply",
    cta_message:
      "Hello Saurashtra Honey, I’m interested in HORECA Supply. Please share bulk options, MOQ and pricing.",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "corporate-gifting",
    title: "Corporate Gifting",
    short_description: "Diwali, employee & executive gifts",
    image_key: "prod-giftpack",
    image_url: null,
    icon_name: "Gift",
    detail_title: "Corporate Gifting",
    subtitle: "Premium Honey Gifts for Every Occasion",
    full_description:
      "Create memorable corporate gifts with premium Saurashtra Honey products. Suitable for festive gifting, employee appreciation, client gifting and executive gift requirements.",
    key_points: [
      "Premium honey gift boxes",
      "Corporate bulk orders",
      "Custom gift combinations",
      "Festive gifting options",
      "Employee and client gifting",
      "Custom branding/packaging where available",
    ],
    cta_text: "Enquire for Corporate Gifting",
    cta_message:
      "Hello Saurashtra Honey, I’m interested in Corporate Gifting. Please share available gift options, MOQ and pricing.",
    is_active: true,
    sort_order: 3,
  },
  {
    id: "private-label",
    title: "Private Label",
    short_description: "Your brand, our NABL purity",
    image_key: "team-beekeepers",
    image_url: null,
    icon_name: "Users2",
    detail_title: "Private Label",
    subtitle: "Your Brand. Our Honey Expertise.",
    full_description:
      "For businesses looking to launch honey products under their own brand, provide a professional private-label enquiry experience.",
    key_points: [
      "Bulk honey sourcing",
      "Private-label opportunities",
      "Packaging options",
      "Custom quantity requirements",
      "Business-to-business supply",
      "Quality-focused sourcing and production",
    ],
    cta_text: "Enquire for Private Label",
    cta_message:
      "Hello Saurashtra Honey, I’m interested in Private Label services. Please share MOQ, packaging options and business details.",
    is_active: true,
    sort_order: 4,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function seedWhoWeSupplyIfEmpty(supabase: any) {
  try {
    const { count, error } = await supabase
      .from("who_we_supply_services")
      .select("id", { count: "exact", head: true });
    if (!error && (count === 0 || count === null)) {
      const rowsToInsert = [
        {
          title: "Premium Bakeries & Patisseries",
          description: "Artisanal bakeries across India trust our pure honey and beeswax to create signature pastries, glazes, and naturally sweetened baked goods.",
          image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60",
          sort_order: 1,
          active: true
        },
        {
          title: "Luxury Hotels & Resorts",
          description: "Five-star hospitality brands feature Saurashtra Honey at breakfast buffets, in premium rooms, and as part of exclusive wellness retreats.",
          image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=60",
          sort_order: 2,
          active: true
        },
        {
          title: "Ayurvedic & Wellness Brands",
          description: "Leading natural health companies source our raw honey and bee pollen as foundational ingredients for traditional remedies and modern supplements.",
          image_url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=60",
          sort_order: 3,
          active: true
        },
        {
          title: "Boutique Cafés",
          description: "Specialty coffee shops and organic cafés serve our unique monofloral honeys to complement artisanal beverages and healthy breakfast bowls.",
          image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60",
          sort_order: 4,
          active: true
        }
      ];
      await supabase.from("who_we_supply_services").insert(rowsToInsert as never);
    }
  } catch (e) {
    console.error("Failed to seed who we supply:", e);
  }
}

export const listPublicSupplyServices = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ rows: SupplyServiceRow[] }> => {
    try {
      await seedWhoWeSupplyIfEmpty(supabase);
      const { data, error } = await supabase
        .from("who_we_supply_services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error || !data || data.length === 0) {
        return { rows: DEFAULT_SUPPLY_SERVICES };
      }
      return { rows: data as unknown as SupplyServiceRow[] };
    } catch {
      return { rows: DEFAULT_SUPPLY_SERVICES };
    }
  },
);

export const listAdminSupplyServices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: SupplyServiceRow[] }> => {
    await assertStaff(context.supabase, context.userId);
        await seedWhoWeSupplyIfEmpty(context.supabase);
    const { data, error } = await context.supabase
      .from("who_we_supply_services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      if (error.message.includes("does not exist")) {
        return { rows: DEFAULT_SUPPLY_SERVICES };
      }
      throw new Error(error.message);
    }
    return { rows: (data ?? []) as unknown as SupplyServiceRow[] };
  });

const supplyServiceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required").max(150),
  short_description: z.string().min(1, "Short description is required").max(300),
  image_key: z.string().max(120).nullable().optional(),
  image_url: z.string().max(2000).nullable().optional(),
  icon_name: z.string().min(1).max(50).default("Store"),
  detail_title: z.string().min(1, "Detail title is required").max(150),
  subtitle: z.string().min(1, "Subtitle is required").max(250),
  full_description: z.string().min(1, "Full description is required").max(3000),
  key_points: z.array(z.string().min(1)).default([]),
  cta_text: z.string().min(1, "CTA text is required").max(100),
  cta_message: z.string().min(1, "CTA message is required").max(1000),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const upsertSupplyService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof supplyServiceSchema>) => supplyServiceSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
        const { id, ...rest } = data;
    if (id) {
      const { error } = await context.supabase
        .from("who_we_supply_services")
        .update(rest as never)
        .eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    const { error } = await context.supabase.from("who_we_supply_services").insert(rest as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSupplyService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
        const { error } = await context.supabase.from("who_we_supply_services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
