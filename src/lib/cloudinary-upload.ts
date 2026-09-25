import imageCompression from 'browser-image-compression';

export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  let fileToUpload = file;
  
  // Cloudinary free tier has a 10MB limit for images.
  // We compress images larger than 2MB down to < 8MB automatically.
  if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
    try {
      const options = {
        maxSizeMB: 8,
        maxWidthOrHeight: 4000,
        useWebWorker: true,
      };
      const compressedBlob = await imageCompression(file, options);
      // Convert back to File to retain original name/type properties for FormData
      fileToUpload = new File([compressedBlob], file.name, { type: file.type });
    } catch (error) {
      console.warn('Image compression failed, proceeding with original file', error);
    }
  }

  const cloudinaryFolder = `saurashtra-honey/${folder}`;
  const fileExt = file.name.split('.').pop();
  const uniqueId = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  
  // Get cloud name and preset from env vars (available in browser)
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "yzmffalu";
  
  // Default to the generated unsigned preset if env variable is not set
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "zpt6ts5g";

  const formData = new FormData();
  formData.append("file", fileToUpload);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", cloudinaryFolder);
  
  const baseName = file.name.replace(`.${fileExt}`, '');
  formData.append("public_id", `${baseName}_${uniqueId}`);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadRes.ok) {
    const errInfo = await uploadRes.json();
    console.error("Cloudinary Upload Error:", errInfo);
    throw new Error(errInfo.error?.message || "Failed to upload to Cloudinary");
  }

  const uploadData = await uploadRes.json();
  
  let finalUrl = uploadData.secure_url;
  finalUrl = finalUrl.replace('/image/upload/v', '/image/upload/f_auto,q_auto/v');
  finalUrl = finalUrl.replace('/video/upload/v', '/video/upload/q_auto/v');
  
  return finalUrl;
}
