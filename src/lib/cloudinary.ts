type TransformOptions = {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
  videoCodec?: string;
};

export function buildCloudinaryUrl(url: string | null | undefined, options: TransformOptions = {}): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url; // Pass through if not cloudinary

  // Typical url structure:
  // https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/v<version>/<public_id>
  // We want to insert transformations before /v<version>/

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Find the version part (starts with 'v' followed by digits)
    const versionIndex = pathParts.findIndex(part => /^v\d+$/.test(part));
    
    if (versionIndex === -1) {
      return url; // Couldn't find version, return as is
    }

    const transformations: string[] = [];

    if (options.format !== 'none') {
        transformations.push(`f_${options.format || 'auto'}`);
    }
    
    transformations.push(`q_${options.quality || 'auto'}`);

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.videoCodec) transformations.push(`vc_${options.videoCodec}`);

    const transformString = transformations.join(',');

    // Insert transformations right before the version
    pathParts.splice(versionIndex, 0, transformString);

    urlObj.pathname = pathParts.join('/');
    return urlObj.toString();
  } catch (e) {
    console.error("Error transforming Cloudinary URL", e);
    return url;
  }
}
