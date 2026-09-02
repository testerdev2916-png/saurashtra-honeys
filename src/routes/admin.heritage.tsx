import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Upload, Video, Save, Eye, Trash2, Pause, Play, CheckCircle2, ImageOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  fetchAdminHeritageVideo, 
  upsertHeritageVideo, 
  type HeritageVideo, 
} from "@/lib/heritage";
import { BtnGhost, BtnPrimary, Card, Field, inp, PageHeader, StatusPill } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/heritage")({ component: HeritageManager });

function HeritageManager() {
  const [section, setSection] = useState<HeritageVideo | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ignore = false;
    
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchAdminHeritageVideo();
        if (ignore) return;
        
        if (data) {
          setSection(data);
        } else {
          setSection({
            id: "",
            eyebrow: "OUR HERITAGE",
            title: "Where Purity Begins",
            video_url: "",
            poster_url: "",
            is_active: true,
            created_at: "",
            updated_at: "",
          });
        }
      } catch (e: any) {
        if (ignore) return;
        console.error("HERITAGE LOAD ERROR:", e);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => { ignore = true; };
  }, []);

  async function handleSave(dataToSave?: HeritageVideo) {
    const s = dataToSave || section;
    if (!s) return;
    setSaving(true);
    try {
      const updatedSection = await upsertHeritageVideo(s.id || null, {
        eyebrow: s.eyebrow,
        title: s.title,
        video_url: s.video_url,
        poster_url: s.poster_url,
        is_active: s.is_active,
      });
      
      setSection((prev) => prev ? { ...prev, ...s, id: updatedSection.id } : null);
      
      toast.success("Heritage section saved");
    } catch (e: any) {
      toast.error("Save Error: " + (e.message || "Failed to save heritage section"));
    } finally {
      setSaving(false);
    }
  }

  // ---- File Upload Helpers ----
  async function uploadFile(file: File, folder: string): Promise<string> {
    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `heritage/${folder}/${Date.now()}_${safeName}`;

    const { data, error } = await supabase.storage.from("media").upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw new Error(error.message);

    const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
    return pubData.publicUrl;
  }

  async function onUploadVideo(file: File) {
    if (!file.type.startsWith("video/")) return toast.error("Please choose a valid video");
    setVideoUploading(true);
    try {
      const url = await uploadFile(file, "videos");
      const next = { ...section!, video_url: url };
      setSection(next);
      await handleSave(next);
      toast.success("Documentary video uploaded");
    } catch (e) {
      toast.error("Upload Error: " + (e as Error).message);
    } finally {
      setVideoUploading(false);
    }
  }

  async function onUploadPoster(file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Please choose a valid image");
    setThumbUploading(true);
    try {
      const url = await uploadFile(file, "posters");
      const next = { ...section!, poster_url: url };
      setSection(next);
      await handleSave(next);
      toast.success("Video poster uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setThumbUploading(false);
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Loading Heritage Section...</div>;
  }

  if (!section) return null;

  const hasVideo = !!section.video_url;

  return (
    <div>
      <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUploadVideo(e.target.files[0])} />
      <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUploadPoster(e.target.files[0])} />

      <PageHeader 
        title="Our Heritage Video" 
        subtitle="Manage the 16:9 documentary video displayed on the Home Page" 
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start mt-6">
        
        {/* Main Video Manager Card */}
        <div className="lg:col-span-7">
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-border bg-cream/30 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-forest-dark uppercase tracking-widest">
                Our Heritage Video
              </h3>
              {hasVideo && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Status:</span>
                  <StatusPill s={section.is_active ? "active" : "disabled"} />
                </div>
              )}
            </div>
            
            <div className="p-6">
              {hasVideo ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-3">Current Video:</span>
                    <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-cream-deep border border-border relative group shadow-sm">
                      {previewPlaying ? (
                        <video 
                          ref={videoPreviewRef}
                          src={section.video_url ?? undefined} 
                          poster={section.poster_url ?? undefined}
                          className="w-full h-full object-cover" 
                          controls
                          autoPlay
                        />
                      ) : (
                        <>
                          {section.poster_url ? (
                            <img src={section.poster_url} alt="Poster" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-black/5">
                              <Video className="size-8 mb-2 opacity-40" />
                              <span className="text-xs font-medium">No Poster Image</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <button 
                              onClick={() => setPreviewPlaying(true)}
                              className="size-14 rounded-full bg-cream/90 text-forest-dark flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            >
                              <Play className="size-6 ml-1" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <BtnGhost disabled={videoUploading} onClick={() => videoRef.current?.click()} className="text-xs font-bold tracking-widest">
                      <Upload className="size-3.5" />
                      {videoUploading ? "UPLOADING..." : "REPLACE VIDEO"}
                    </BtnGhost>
                    
                    <BtnGhost disabled={thumbUploading} onClick={() => thumbRef.current?.click()} className="text-xs font-bold tracking-widest">
                      <ImageOff className="size-3.5" />
                      {thumbUploading ? "UPLOADING..." : "CHANGE POSTER"}
                    </BtnGhost>
                    
                    <BtnGhost 
                      onClick={() => {
                        if (!previewPlaying) setPreviewPlaying(true);
                        else {
                          setPreviewPlaying(false);
                          if (videoPreviewRef.current) videoPreviewRef.current.pause();
                        }
                      }} 
                      className="text-xs font-bold tracking-widest"
                    >
                      <Eye className="size-3.5" />
                      {previewPlaying ? "STOP PREVIEW" : "PREVIEW"}
                    </BtnGhost>
                    
                    <BtnGhost 
                      onClick={() => {
                        const next = { ...section, is_active: !section.is_active };
                        setSection(next);
                        handleSave(next);
                      }} 
                      className={`text-xs font-bold tracking-widest ${section.is_active ? "text-burnt-orange hover:text-burnt-orange hover:bg-burnt-orange/10" : "text-forest-dark"}`}
                    >
                      {section.is_active ? (
                        <><Pause className="size-3.5" /> DISABLE</>
                      ) : (
                        <><CheckCircle2 className="size-3.5" /> ENABLE</>
                      )}
                    </BtnGhost>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl bg-cream/30">
                  <div className="size-16 rounded-full bg-cream-deep flex items-center justify-center text-muted-foreground mb-4">
                    <Video className="size-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-forest-dark mb-2">No Heritage Video Added</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    Upload a high-quality 16:9 documentary video to activate this section on the Home Page.
                  </p>
                  <BtnPrimary disabled={videoUploading} onClick={() => videoRef.current?.click()}>
                    <Upload className="size-4" />
                    {videoUploading ? "UPLOADING VIDEO..." : "UPLOAD DOCUMENTARY VIDEO"}
                  </BtnPrimary>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Settings Card */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <h3 className="font-serif text-lg font-bold text-forest-dark mb-4 border-b border-border pb-3 uppercase tracking-widest">
              Section Settings
            </h3>
            <div className="space-y-4">
              <Field label="Eyebrow Text">
                <input
                  value={section.eyebrow || ""}
                  onChange={(e) => setSection({ ...section, eyebrow: e.target.value })}
                  className={inp}
                  placeholder="OUR HERITAGE"
                />
              </Field>
              <Field label="Main Heading">
                <input
                  value={section.title || ""}
                  onChange={(e) => setSection({ ...section, title: e.target.value })}
                  className={inp}
                  placeholder="Where Purity Begins"
                />
              </Field>
              
              <div className="pt-4 border-t border-border flex justify-end">
                <BtnPrimary onClick={() => handleSave()} disabled={saving}>
                  <Save className="size-3.5" />
                  {saving ? "SAVING..." : "SAVE SETTINGS"}
                </BtnPrimary>
              </div>
            </div>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
