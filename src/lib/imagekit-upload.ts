import ImageKit from "imagekit-javascript";
import imageCompression from 'browser-image-compression';
import { supabase } from "@/integrations/supabase/client";

// Cache the ImageKit instance so we don't recreate it on every upload
let ikInstance: ImageKit | null = null;

const getIkConfig = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const sessionToken = session?.access_token;
  
  if (!sessionToken) {
      throw new Error("Not authenticated for ImageKit API");
  }

  // Fetch the configuration (public key) and initial signature from our secure server endpoint
  const response = await fetch("/api/imagekit/auth", {
    headers: {
      "Authorization": `Bearer ${sessionToken}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ImageKit Auth API error:", response.status, errorText);
    throw new Error(`Authentication request failed: ${response.status}`);
  }

  const data = await response.json();
  const { signature, expire, token, publicKey, urlEndpoint } = data;

  if (!publicKey) {
    console.error("[ImageKit Client] Missing publicKey in API response. The server environment is missing IMAGEKIT_PUBLIC_KEY.");
    throw new Error("Missing public key for upload configuration");
  }

  if (!ikInstance) {
    ikInstance = new ImageKit({
      publicKey,
      urlEndpoint,
    });
  }

  return { ikInstance, signature, expire, token };
};

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
  
  const { ikInstance, signature, expire, token } = await getIkConfig();

  return new Promise((resolve, reject) => {
    ikInstance.upload({
      file: fileToUpload,
      fileName: fileToUpload.name,
      folder: imagekitFolder,
      useUniqueFileName: true,
      signature,
      expire,
      token,
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
