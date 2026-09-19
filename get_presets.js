import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: 'yzmffalu',
  api_key: '645738617487176',
  api_secret: 'XNDiOlEilV0LTmgF3JyHicpFkfs',
  secure: true
});
cloudinary.api.upload_presets()
  .then(result => console.log(JSON.stringify(result.presets, null, 2)))
  .catch(error => console.error("Error:", error));
