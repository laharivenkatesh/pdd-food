import { useCallback, useEffect, useState } from "react";
import { FoodItem } from "@/types/food";
import { useAuth } from "./useAuth";
import { supabase } from "@/lib/supabase";

const LOCAL_STORAGE_DELETED_FOODS = "zerra_deleted_food_ids_v1";

const deletedFoodIds = new Set<string>();

try {
  if (typeof localStorage !== 'undefined' && localStorage !== null) {
    const saved = localStorage.getItem(LOCAL_STORAGE_DELETED_FOODS);
    if (saved) {
      const parsed: string[] = JSON.parse(saved);
      parsed.forEach(id => deletedFoodIds.add(id));
    }
  }
} catch (e) {}

const saveDeletedFoodId = (id: string) => {
  deletedFoodIds.add(id);
  try {
    const arr = Array.from(deletedFoodIds);
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      localStorage.setItem(LOCAL_STORAGE_DELETED_FOODS, JSON.stringify(arr));
    }
  } catch (e) {}
};

function resolveImageUrl(image: string | null | undefined): string {
  if (!image || typeof image !== 'string' || image.trim() === '' || image === 'none') return '';
  if (image.includes("address at") || image.includes("flushPassiveEffects") || image.includes("TypeError") || image.includes("bundle-")) return '';
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) return image;
  if (image.startsWith("file:") || image.startsWith("ph:") || image.startsWith("blob:")) return '';
  const { data } = supabase.storage.from("food-images").getPublicUrl(image);
  return data?.publicUrl || '';
}

function mapRow(row: any): FoodItem {
  const profileInfo = row.profiles || {};

  // Calculate donor's real trust score rating from profile or reviews
  const reviewsArr = row.reviews || [];
  let calculatedScore: number | null = profileInfo.trust_score ? Number(profileInfo.trust_score) : null;
  if (!calculatedScore && reviewsArr.length > 0) {
    const sum = reviewsArr.reduce((s: number, r: any) => s + (r.rating || 5), 0);
    calculatedScore = Number((sum / reviewsArr.length).toFixed(1));
  }
  const realScore = calculatedScore !== null ? calculatedScore : 5.0;

  return {
    id: row.id,
    name: row.name,
    image: resolveImageUrl(row.image),
    feeds: row.feeds,
    price: row.price,
    expiryHours: row.expiry_hours,
    preparedAt: row.prepared_at,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    category: row.category,
    tags: row.tags || [],
    purpose: row.purpose,
    safeForAnimals: row.safe_for_animals,
    status: row.status,
    realtimeStatus: row.realtime_status,
    quantity: row.quantity,
    notes: row.notes,
    allowSplit: row.allow_split,
    postedAt: row.created_at,
    bookedPortions: row.booked_portions || 0,
    trustScore: realScore,
    confidence: "High",
    reviews: reviewsArr.map((r: any) => ({
      id: r.id,
      user: r.user_name || "Anonymous",
      rating: r.rating,
      comment: r.comment,
      date: new Date(r.created_at).toLocaleDateString(),
    })),
    provider: {
      id: row.user_id,
      name: profileInfo.name || "Community Donor",
      trustScore: realScore,
      badges: ["🌱 Donor"],
      streak: 3,
      reliability: "high",
      avatar: profileInfo.avatar || "",
      email: profileInfo.email || "",
      phone: profileInfo.phone || "",
    },
  };
}

async function cleanupExpiredImages(rawData: any[]) {
  if (!rawData || rawData.length === 0) return;
  const now = Date.now();

  for (const item of rawData) {
    const preparedTime = new Date(item.prepared_at || item.created_at).getTime();
    const expiryTime = preparedTime + (item.expiry_hours || 4) * 3600 * 1000;
    const isExpired = now >= expiryTime || item.status === "expired";

    if (isExpired && item.image) {
      try {
        if (!item.image.startsWith("http") && !item.image.startsWith("data:")) {
          await supabase.storage.from("food-images").remove([item.image]);
        }
        await supabase
          .from("foods")
          .update({ image: "", status: "expired" })
          .eq("id", item.id);
      } catch (err) {
        console.warn("Storage cleanup notice:", err);
      }
    }
  }
}

async function fetchFoodsQuery(userId?: string) {
  let query = supabase.from("foods").select("*, profiles(*)");
  if (userId) {
    query = query.eq("user_id", userId);
  }
  query = query.order("created_at", { ascending: false });

  const res = await query;
  let result = res;
  if (res.error) {
    let fallbackQuery = supabase.from("foods").select("*");
    if (userId) {
      fallbackQuery = fallbackQuery.eq("user_id", userId);
    }
    fallbackQuery = fallbackQuery.order("created_at", { ascending: false });
    result = await fallbackQuery;
  }

  if (result.data) {
    cleanupExpiredImages(result.data);
  }
  return result;
}

let globalMyPostsCache: FoodItem[] = [];
let globalMyPostsLoaded = false;

const allFoodsListeners = new Set<() => void>();

function notifyAllFoodsListeners() {
  allFoodsListeners.forEach((listener) => {
    try { listener(); } catch {}
  });
}

export function useMyPosts() {
  const { user, profile, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<FoodItem[]>(globalMyPostsCache);
  const [loading, setLoading] = useState(!globalMyPostsLoaded);

  const refresh = useCallback(async (isBackground = false) => {
    if (!user) {
      setPosts([]);
      globalMyPostsCache = [];
      globalMyPostsLoaded = false;
      return;
    }
    try {
      if (!isBackground && !globalMyPostsLoaded) setLoading(true);

      const { data, error } = await fetchFoodsQuery(user.id);

      if (error) {
        console.error("useMyPosts fetch error:", error);
        return;
      }

      const mapped = (data || []).map(mapRow).filter((f) => (f.status as string) !== "deleted" && !deletedFoodIds.has(f.id));
      globalMyPostsCache = mapped;
      globalMyPostsLoaded = true;
      setPosts(mapped);
    } catch (err) {
      console.error("Exception in useMyPosts refresh:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    refresh();

    if (!user) return;

    const pollInterval = setInterval(() => {
      refresh(true);
    }, 1000);

    const channelId = `my-posts-realtime-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "foods", filter: `user_id=eq.${user.id}` },
        () => {
          refresh(true);
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [refresh, authLoading, user]);

  const addPost = useCallback(
    async (input: any) => {
      if (!user) return { ok: false as const, error: "Not authenticated" };

      // Ensure profile exists in public.profiles table before inserting food
      try {
        await supabase.from("profiles").upsert({
          id: user.id,
          name: profile?.name || user.name || user.email?.split("@")[0] || "Community Member",
          email: user.email || null,
          phone: user.phone || null
        }, { onConflict: "id" });
      } catch (e) {
        console.warn("Profile auto-sync notice:", e);
      }

      const { data, error } = await supabase
        .from("foods")
        .insert({
          user_id: user.id,
          name: input.name,
          image: input.image,
          feeds: input.feeds,
          price: input.price,
          expiry_hours: input.expiry_hours,
          prepared_at: input.prepared_at,
          address: input.address,
          lat: input.lat,
          lng: input.lng,
          category: input.category,
          tags: input.tags,
          purpose: input.purpose,
          safe_for_animals: input.safe_for_animals,
          status: input.status,
          realtime_status: input.realtime_status,
          quantity: input.quantity,
          notes: input.notes,
          allow_split: input.allow_split,
        })
        .select("*")
        .single();

      if (error) {
        console.error("addPost error:", error);
        return { ok: false as const, error: error.message };
      }

      const newFood = mapRow(data);
      globalMyPostsCache = [newFood, ...globalMyPostsCache];
      setPosts((prev) => [newFood, ...prev]);

      // Location-based broadcast of food post notification & background push notification
      (async () => {
        try {
          const { data: profiles } = await supabase.from("profiles").select("*").neq("id", user.id);
          if (profiles && profiles.length > 0) {
            const foodLat = Number(input.lat);
            const foodLng = Number(input.lng);
            const donorName = profile?.name || user.name || user.email?.split("@")[0] || "A community donor";

            const notifs: any[] = [];
            const pushTokens: string[] = [];

            for (const p of profiles) {
              let isNearby = true;
              let distText = "";

              const userLat = Number(p.lat);
              const userLng = Number(p.lng);

              // Calculate exact distance between food location and user's saved GPS location
              if (!isNaN(foodLat) && !isNaN(foodLng) && !isNaN(userLat) && !isNaN(userLng) && userLat !== 0 && userLng !== 0) {
                const R = 6371;
                const dLat = ((userLat - foodLat) * Math.PI) / 180;
                const dLon = ((userLng - foodLng) * Math.PI) / 180;
                const a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos((foodLat * Math.PI) / 180) *
                  Math.cos((userLat * Math.PI) / 180) *
                  Math.sin(dLon / 2) *
                  Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distKm = R * c;

                // Filter users within 50 km radius
                isNearby = distKm <= 50;
                distText = distKm < 1 ? ` (${Math.round(distKm * 1000)}m away)` : ` (${distKm.toFixed(1)}km away)`;
              }

              if (isNearby) {
                notifs.push({
                  user_id: p.id,
                  food_id: data.id,
                  title: "🍱 Fresh Food Available Nearby!",
                  message: `${donorName} posted "${input.name}"${distText} at ${input.address || 'your area'}. Tap to view and claim!`,
                  is_read: false,
                });

                if (p.expo_push_token) {
                  pushTokens.push(p.expo_push_token);
                }
              }
            }

            if (notifs.length > 0) {
              for (const n of notifs) {
                try {
                  await supabase.from("notifications").insert(n);
                } catch (e) {}
              }
            }

            // Send background Expo Push Notification to nearby devices even if app is closed!
            if (pushTokens.length > 0) {
              const pushMessages = pushTokens.map(token => ({
                to: token,
                sound: 'default',
                title: '🍱 Fresh Food Available Nearby!',
                body: `${donorName} posted "${input.name}" near you! Tap to claim.`,
                data: { foodId: data.id },
              }));

              await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Accept-encoding': 'gzip, deflate',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(pushMessages),
              });
            }
          }
        } catch (err) {
          console.warn("Location-based food post notification notice:", err);
        }
      })();

      return { ok: true as const, data: newFood };
    },
    [user, profile]
  );

  const removePost = useCallback(async (id: string) => {
    saveDeletedFoodId(id);

    try {
      // 1. Delete associated transactions, notifications, and reviews in Supabase
      try { await supabase.from("transactions").delete().eq("food_id", id); } catch {}
      try { await supabase.from("notifications").delete().eq("food_id", id); } catch {}
      try { await supabase.from("reviews").delete().eq("food_id", id); } catch {}
      
      // 2. Perform direct deletion and status soft-delete in Supabase
      const { error } = await supabase.from("foods").delete().eq("id", id);
      if (error) {
        console.warn("Supabase direct delete notice, applying status fallback:", error);
      }
      await supabase.from("foods").update({ status: "deleted" }).eq("id", id);
    } catch (err) {
      console.warn("Exception deleting post:", err);
    }

    globalMyPostsCache = globalMyPostsCache.filter((p) => p.id !== id && !deletedFoodIds.has(p.id));
    globalFoodsCache = globalFoodsCache.filter((p) => p.id !== id && !deletedFoodIds.has(p.id));
    setPosts((prev) => prev.filter((p) => p.id !== id && !deletedFoodIds.has(p.id)));
    notifyAllFoodsListeners();
  }, []);

  const getLastPostTime = useCallback(() => {
    if (posts.length === 0) return 0;
    const sorted = [...posts].sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
    return new Date(sorted[0].postedAt).getTime();
  }, [posts]);

  return { posts: posts.filter((p) => !deletedFoodIds.has(p.id)), loading, addPost, removePost, refresh, getLastPostTime };
}

let globalFoodsCache: FoodItem[] = [];
let globalFoodsLoaded = false;

export function useAllFoods() {
  const { loading: authLoading } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>(() => globalFoodsCache.filter((f) => !deletedFoodIds.has(f.id)));
  const [loading, setLoading] = useState(!globalFoodsLoaded);

  useEffect(() => {
    const listener = () => {
      setFoods([...globalFoodsCache.filter((f) => !deletedFoodIds.has(f.id))]);
    };
    allFoodsListeners.add(listener);
    return () => {
      allFoodsListeners.delete(listener);
    };
  }, []);

  const refresh = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground && !globalFoodsLoaded) setLoading(true);
      
      const { data, error } = await fetchFoodsQuery();

      if (error) {
        console.error("useAllFoods fetch error:", error);
        return;
      }

      const mapped = (data || []).map(mapRow).filter((f) => (f.status as string) !== "deleted" && !deletedFoodIds.has(f.id));
      globalFoodsCache = mapped;
      globalFoodsLoaded = true;
      setFoods(mapped);
    } catch (err) {
      console.error("Exception in useAllFoods refresh:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    refresh();

    const pollInterval = setInterval(() => {
      refresh(true);
    }, 1000);

    const channelId = `foods-realtime-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "foods" },
        () => {
          refresh(true);
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [refresh, authLoading]);

  return { foods, loading, refresh };
}