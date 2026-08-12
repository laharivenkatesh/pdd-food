import { supabase } from './supabase';

export async function uploadFoodImage(uri: string): Promise<string> {
  if (!uri) return "";

  // If already a remote HTTP URL, return as is
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }

  try {
    const fileName = `food_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;

    // 1. Fetch blob from local file URI or data URI
    const response = await fetch(uri);
    const blob = await response.blob();

    // 2. Upload to Supabase Storage bucket 'food-images'
    const { data, error } = await supabase.storage
      .from("food-images")
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.warn("Supabase storage upload notice:", error);
      // Fallback: If bucket is missing or restricted, convert blob to base64 data URL so image works!
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result || "");
        };
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
    }

    // 3. Get Public CDN URL
    const { data: publicUrlData } = supabase.storage.from("food-images").getPublicUrl(fileName);
    return publicUrlData?.publicUrl || "";
  } catch (err) {
    console.warn("Image processing error:", err);
    // If data URI, use directly; otherwise return empty string
    return uri.startsWith("data:") ? uri : "";
  }
}
