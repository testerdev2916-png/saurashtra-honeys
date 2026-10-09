import ImageKit from "imagekit-javascript";
import imageCompression from 'browser-image-compression';
import { supabase } from "@/integrations/supabase/client";

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || "";
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/fqbnkx3tz";

const authenticator = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    if (!token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch("/api/imagekit/auth", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token: auth_token } = data;
    return { signature, expire, token: auth_token };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const ik = new ImageKit({
  publicKey,
  urlEndpoint,
  authenticator,
});

export async function uploadToImageKit(file: File, folder: string): Promise<string> {
  let fileToUpload = file;
  
  // Compress images larger than 1.5MB
  if (file.type.startsWith('image/') && file.size > 1.5 * 1024 * 1024) {
    try {
      const options = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 2560,
        useWebWorker: true,
      };
      const compressedBlob = await imageCompression(file, options);
      // Convert back to File to retain original name/type properties for FormData
      fileToUpload = new File([compressedBlob], file.name, { type: file.type });
    } catch (error) {
      console.warn('Image compression failed, proceeding with original file', error);
    }
  }

  const imagekitFolder = `/saurashtra-honey/${folder}`;
  
  return new Promise((resolve, reject) => {
    ik.upload({
      file: fileToUpload,
      fileName: fileToUpload.name,
      folder: imagekitFolder,
      useUniqueFileName: true,
    }, function(err, result) {
      if (err) {
        console.error("ImageKit Upload Error:", err);
        reject(new Error(err.message || "Failed to upload to ImageKit"));
      } else if (result) {
        resolve(result.url);
      } else {
        reject(new Error("Unknown error during upload"));
      }
    });
  });
}
