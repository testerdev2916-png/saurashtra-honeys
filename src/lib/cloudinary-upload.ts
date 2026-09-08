export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const cloudinaryFolder = `saurashtra-honey/${folder}`;
  const fileExt = file.name.split('.').pop();
  const uniqueId = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  
  // 1. Get signature
  const signRes = await fetch(`/api/cloudinary/sign?folder=${cloudinaryFolder}`);
  if (!signRes.ok) throw new Error("Failed to get upload signature");
  const signData = await signRes.json();

  // 2. Upload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signData.api_key);
  formData.append("timestamp", signData.timestamp.toString());
  formData.append("signature", signData.signature);
  formData.append("folder", signData.folder);
  
  const baseName = file.name.replace(`.${fileExt}`, '');
  formData.append("public_id", `${baseName}_${uniqueId}`);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${signData.cloud_name}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadRes.ok) {
    const errInfo = await uploadRes.json();
    throw new Error(errInfo.error?.message || "Failed to upload to Cloudinary");
  }

  const uploadData = await uploadRes.json();
  
  let finalUrl = uploadData.secure_url;
  finalUrl = finalUrl.replace('/image/upload/v', '/image/upload/f_auto,q_auto/v');
  finalUrl = finalUrl.replace('/video/upload/v', '/video/upload/q_auto/v');
  
  return finalUrl;
}
