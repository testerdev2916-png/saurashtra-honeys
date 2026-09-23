import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertPerm(supabase: any, userId: string, key: string) {
  const { data, error } = await supabase.rpc("has_permission", {
    _user_id: userId,
    _permission_key: key,
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Forbidden: missing permission ${key}`);
}

async function audit(
  supabase: any,
  actor: string,
  action: string,
  entity_type?: string,
  entity_id?: string,
  metadata?: any
) {
  await supabase.from("audit_logs").insert({
    actor_id: actor,
    action,
    entity_type,
    entity_id,
    metadata,
  });
}

export const listAchievements = createServerFn()
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("achievements_gallery")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    
    if (error) {
      if (error.message.includes("Could not find the table") || error.message.includes("relation") || error.message.includes("schema cache")) {
        console.warn("achievements_gallery table not found, returning empty array. Push migration to Supabase to fix.");
        return { rows: [] };
      }
      throw new Error(error.message);
    }
    return { rows: data };
  });

export const upsertAchievement = createServerFn()
  .validator(
    z.object({
      id: z.string().optional(),
      media_type: z.enum(["image", "video"]),
      media_url: z.string().min(1, "Media URL is required"),
      thumbnail_url: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      display_order: z.number().default(0),
      is_active: z.boolean().default(true),
    })
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data: payload, context }) => {
    const { supabase, userId } = context;
    await assertPerm(supabase, userId, "settings.manage");
    
    if (payload.id) {
      const { data, error } = await supabase
        .from("achievements_gallery")
        .update(payload)
        .eq("id", payload.id)
        .select()
        .single();
      
      if (error) {
        if (error.message.includes("Could not find the table") || error.message.includes("relation")) {
          throw new Error("achievements_gallery table not found. Please push the database migration to Supabase first.");
        }
        throw new Error(error.message);
      }
      
      if (data) {
        await audit(supabase, userId, "update_achievement", "achievements_gallery", payload.id, { title: payload.title });
        return { success: true, item: data };
      }
      throw new Error("Update failed: no data returned");
    } else {
      const { data, error } = await supabase
        .from("achievements_gallery")
        .insert(payload)
        .select()
        .single();
        
      if (error) {
        if (error.message.includes("Could not find the table") || error.message.includes("relation")) {
          throw new Error("achievements_gallery table not found. Please push the database migration to Supabase first.");
        }
        throw new Error(error.message);
      }
      
      if (data) {
        await audit(supabase, userId, "create_achievement", "achievements_gallery", data.id, { title: payload.title });
        return { success: true, item: data };
      }
      throw new Error("Insert failed: no data returned");
    }
  });

export const deleteAchievement = createServerFn()
  .validator(z.object({ id: z.string() }))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data: { id }, context }) => {
    const { supabase, userId } = context;
    await assertPerm(supabase, userId, "settings.manage");

    const { error } = await supabase.from("achievements_gallery").delete().eq("id", id);
    if (error) throw new Error(error.message);
    
    await audit(supabase, userId, "delete_achievement", "achievements_gallery", id);
    return { success: true };
  });

export const reorderAchievements = createServerFn()
  .validator(
    z.object({
      items: z.array(z.object({ id: z.string(), display_order: z.number() })),
    })
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data: { items }, context }) => {
    const { supabase, userId } = context;
    await assertPerm(supabase, userId, "settings.manage");
    for (const item of items) {
      const { error } = await supabase
        .from("achievements_gallery")
        .update({ display_order: item.display_order })
        .eq("id", item.id);
      if (error) throw new Error(error.message);
    }

    await audit(supabase, userId, "reorder_achievements", "achievements_gallery", undefined, { count: items.length });
    return { success: true };
  });
