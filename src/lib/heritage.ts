import { supabase } from "@/integrations/supabase/client";

export interface HeritageVideo {
  id: string;
  eyebrow: string | null;
  title: string | null;
  video_url: string | null;
  poster_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches the active heritage video for the public frontend.
 * Returns null if no active video is found, which is a normal state.
 */
export async function fetchActiveHeritageVideo(signal?: AbortSignal): Promise<HeritageVideo | null> {
  const { data, error } = await (supabase as any)
    .from("homepage_heritage_video")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .abortSignal(signal as any)
    .maybeSingle();

  if (error) {
    console.error("Error fetching active heritage video:", error);
    return null;
  }
  return data as HeritageVideo;
}

/**
 * Fetches the heritage video for the Admin panel, regardless of active status.
 */
export async function fetchAdminHeritageVideo(): Promise<HeritageVideo | null> {
  const { data, error } = await (supabase as any)
    .from("homepage_heritage_video")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data as HeritageVideo;
}

/**
 * Upserts the heritage video configuration. 
 * Since there's only meant to be one, this updates the existing record or inserts a new one.
 */
export async function upsertHeritageVideo(
  videoId: string | null,
  data: Partial<HeritageVideo>
): Promise<HeritageVideo> {
  if (videoId) {
    const { data: updated, error } = await (supabase as any)
      .from("homepage_heritage_video")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", videoId)
      .select()
      .single();
    if (error) throw error;
    return updated as HeritageVideo;
  } else {
    const { data: inserted, error } = await (supabase as any)
      .from("homepage_heritage_video")
      .insert([
        {
          ...data,
          is_active: data.is_active ?? true,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return inserted as HeritageVideo;
  }
}
