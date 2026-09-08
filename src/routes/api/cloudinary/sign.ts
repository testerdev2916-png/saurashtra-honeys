// @ts-ignore - Route file that is currently resolving fine but typescript complains
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const APIRoute = createAPIFileRoute("/api/cloudinary/sign")({
  GET: async ({ request }: { request: Request }) => {
    try {
      // You should add auth checks here in production, ensuring only admins can get signatures
      
      const url = new URL(request.url);
      const folder = url.searchParams.get("folder") || "saurashtra-honey/uploads";
      
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      // We explicitly pass the parameters that must be signed
      const signatureParams = {
        timestamp: timestamp,
        folder: folder,
      };

      const signature = cloudinary.utils.api_sign_request(
        signatureParams,
        process.env.CLOUDINARY_API_SECRET!
      );

      return new Response(
        JSON.stringify({
          timestamp,
          signature,
          api_key: process.env.CLOUDINARY_API_KEY,
          cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
          folder
        }),
        { headers: { "content-type": "application/json" } }
      );
    } catch (e) {
      console.error("Cloudinary sign error", e);
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  },
});
