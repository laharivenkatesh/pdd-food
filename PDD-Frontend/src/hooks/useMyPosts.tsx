import { useCallback, useEffect, useState } from "react";
import { FoodItem } from "@/types/food";
import { useAuth } from "./useAuth";
import { supabase } from "@/lib/supabase";

const deletedFoodIds = new Set<string>();

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
    trustScore: 92,
    confidence: "High",
    reviews: (row.reviews || []).map((r: any) => ({
      id: r.id,
      user: r.user_name || "Anonymous",
      rating: r.rating,
      comment: r.comment,
      date: new Date(r.created_at).toLocaleDateString(),
    })),
    provider: {
      id: row.user_id,
      name: profileInfo.name || "Community Donor",
      trustScore: 92,
      badges: ["🌱 Donor"],
      streak: 3,
      reliability: "high",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
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

      const mapped = (data || []).map(mapRow);
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
      return { ok: true as const, data: newFood };
    },
    [user]
  );

  const removePost = useCallback(async (id: string) => {
    deletedFoodIds.add(id);

    try {
      // 1. Delete child records individually with try-catch so one failure doesn't block the rest
      try { await supabase.from("transactions").delete().eq("food_id", id); } catch {}
      try { await supabase.from("notifications").delete().eq("food_id", id); } catch {}
      try { await supabase.from("reviews").delete().eq("food_id", id); } catch {}
      
      // 2. Delete parent food row
      const { error } = await supabase.from("foods").delete().eq("id", id);
      if (error) {
        console.warn("Supabase direct delete notice, applying status fallback:", error);
        // Fallback update in case Supabase RLS blocks direct delete
        await supabase.from("foods").update({ status: "deleted" }).eq("id", id);
      }
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