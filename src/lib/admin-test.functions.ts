import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const testStorageUpload = createServerFn({ method: "POST" })
  .handler(async () => {
    console.log("Running minimal server-only storage test...");
    
    let dbStatus = "PENDING";
    let uploadStatus = "PENDING";
    let httpStatus = 0;
    let errorCode = "";
    let errorMessage = "";
    let listStatus = "PENDING";
    let deleteStatus = "PENDING";

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const keyType = key.startsWith("sb_secret_") ? "sb_secret" : (key ? "legacy service_role" : "missing");

    try {
        console.log("1. Reading one known database row...");
        const { data: dbData, error: dbError } = await supabaseAdmin.from("categories").select("slug").limit(1);
        if (dbError) {
            dbStatus = `FAILED: ${dbError.message}`;
            console.error("DB Error:", dbError);
        } else {
            dbStatus = "SUCCESS";
        }

        console.log("2. Uploading tiny JSON test object to existing bucket (media)...");
        const jsonStr = JSON.stringify({ test: "hello world" });
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from("media")
            .upload("public_cache/debug-cache-auth-test.json", jsonStr, {
                contentType: "application/json",
                upsert: true,
                cacheControl: "0"
            });
            
        if (uploadError) {
            uploadStatus = "FAILED";
            httpStatus = (uploadError as any).statusCode || (uploadError as any).status || 0;
            errorCode = (uploadError as any).error || uploadError.name;
            errorMessage = uploadError.message;
        } else {
            uploadStatus = "SUCCESS";
            
            console.log("3. Reading/listing that object server-side...");
            const { data: listData, error: listError } = await supabaseAdmin.storage.from("media").list("public_cache", { limit: 10, search: "debug-cache-auth-test.json" });
            if (listError) {
                listStatus = `FAILED: ${listError.message}`;
            } else {
                listStatus = "SUCCESS";
            }

            console.log("4. Deleting temporary test object...");
            const { error: deleteError } = await supabaseAdmin.storage.from("media").remove(["public_cache/debug-cache-auth-test.json"]);
            if (deleteError) {
                deleteStatus = `FAILED: ${deleteError.message}`;
            } else {
                deleteStatus = "SUCCESS";
            }
        }
    } catch (e: any) {
        uploadStatus = "EXCEPTION";
        errorMessage = e.message;
    }

    return {
        UPLOAD_STATUS: uploadStatus,
        HTTP_STATUS: httpStatus,
        SUPABASE_ERROR_CODE: errorCode,
        SUPABASE_ERROR_MESSAGE: errorMessage,
        CLIENT_TYPE: "server-admin",
        KEY_TYPE: keyType,
        BUCKET: "media",
        PATH: "public_cache/debug-cache-auth-test.json",
        DB_STATUS: dbStatus,
        LIST_STATUS: listStatus,
        DELETE_STATUS: deleteStatus
    };
  });
