import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export function ImageUpload({
  value,
  onChange,
  bucket = "media",
  folder = "homepage",
  className = "",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  folder?: string;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(publicUrlData.publicUrl);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {value ? (
        <div className="relative group rounded-md overflow-hidden border border-border/50 bg-muted/20 flex items-center justify-center">
          <img 
            src={value} 
            alt="Uploaded media" 
            className="w-full h-auto max-h-[200px] object-contain"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onChange(null)}
              className="bg-white/10 hover:bg-red-500/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <label className="relative flex flex-col items-center justify-center w-full h-[150px] border-2 border-dashed border-border/60 rounded-lg hover:bg-muted/30 hover:border-brand-orange/50 transition-colors cursor-pointer bg-white">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
            {uploading ? (
              <Loader2 className="w-8 h-8 mb-3 animate-spin text-brand-orange" />
            ) : (
              <Upload className="w-8 h-8 mb-3 text-muted-foreground/50" />
            )}
            <p className="mb-2 text-sm font-semibold">
              {uploading ? "Uploading..." : "Click to upload image"}
            </p>
            <p className="text-xs opacity-70">PNG, JPG, WEBP (Max 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp" 
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
