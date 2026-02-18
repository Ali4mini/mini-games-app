import { supabase } from "@/utils/supabase";

// Replace this with your computer's IP if .env fails, or keep it dynamic
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

export const getStorageUrl = (
  bucket: string,
  path: string | null | undefined,
) => {
  if (!path) return "https://via.placeholder.com/300"; // Fallback
  if (path.startsWith("http")) return path; // Already a full URL

  // Get the public URL from Supabase
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  let finalUrl = data.publicUrl;

  // FIX: If running on device/simulator, localhost won't work.
  // We allow the .env to override the localhost part if needed.
  if (finalUrl.includes("localhost") && SUPABASE_URL) {
    const ipUrl = new URL(SUPABASE_URL); // Parse your EXPO_PUBLIC_URL
    finalUrl = finalUrl.replace("localhost", ipUrl.hostname);
  }

  return finalUrl;
};
