import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import * as Notifications from 'expo-notifications';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch {}

export async function sendNativeStatusBarNotification(title: string, body: string) {
  try {
    if (typeof Notifications.getPermissionsAsync !== 'function') return;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted' && typeof Notifications.requestPermissionsAsync === 'function') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === 'granted' && typeof Notifications.scheduleNotificationAsync === 'function') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null,
      });
    }
  } catch (err) {
    console.warn("Native notification trigger notice:", err);
  }
}

export interface DbNotification {
  id: string;
  user_id: string;
  food_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextValue {
  notifications: DbNotification[];
  loading: boolean;
  unreadCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Synthesize a beautiful double-tone chime using Web Audio API
export const playNotificationSound = () => {
  try {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    
    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0.08, startTime); // Subtle volume
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    const now = audioCtx.currentTime;
    playTone(523.25, now, 0.35); // C5
    playTone(659.25, now + 0.08, 0.45); // E5
  } catch (e) {
    console.warn("Web Audio API is not supported", e);
  }
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (typeof Notifications.getPermissionsAsync === 'function') {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          if (existingStatus !== 'granted' && typeof Notifications.requestPermissionsAsync === 'function') {
            await Notifications.requestPermissionsAsync();
          }
        }
      } catch (err) {
        console.warn("Notification permission prompt notice:", err);
      }
    })();
  }, []);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      if (typeof localStorage === "undefined") return true;
      const saved = localStorage.getItem("zerra-notification-sound");
      return saved === null ? true : saved === "true";
    } catch {
      return true;
    }
  });

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("zerra-notification-sound", String(enabled));
      }
    } catch {}
  }, []);

  const refresh = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data || []);
      }
    } catch (err) {
      console.error("Exception fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Handle initialization and real-time subscription
  useEffect(() => {
    if (authLoading) return;

    if (!user || !isSupabaseConfigured) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    refresh();

    const pollInterval = setInterval(() => {
      refresh();
    }, 1000);

    // Subscribe to realtime changes on notifications table for current user
    const channelId = `notifications-user-${user.id}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newNotif = payload.new as DbNotification;
            
            // Add to local state
            setNotifications((prev) => {
              if (prev.some(n => n.id === newNotif.id)) return prev;
              return [newNotif, ...prev];
            });

            // Play sound chime if enabled
            if (soundEnabled) {
              playNotificationSound();
            }

            // Trigger Android status bar push notification!
            sendNativeStatusBarNotification("🍱 " + newNotif.title, newNotif.message);

            // Show interactive toast popup
            toast("🍱 " + newNotif.title, {
              description: newNotif.message,
              duration: 6000,
              action: {
                label: "View",
                onClick: () => {
                  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
                    try {
                      window.location.hash = `#/food/${newNotif.food_id}`;
                      const evt = typeof CustomEvent === 'function'
                        ? new CustomEvent("view-food-notification", { detail: newNotif })
                        : { type: "view-food-notification", detail: newNotif };
                      window.dispatchEvent(evt as any);
                    } catch (e) {
                      console.warn("Event dispatch notice:", e);
                    }
                  }
                },
              },
            });
          } else if (payload.eventType === "DELETE") {
            const oldId = payload.old.id;
            setNotifications((prev) => prev.filter((n) => n.id !== oldId));
          } else {
            refresh();
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [user, refresh, soundEnabled, authLoading]);

  const markAsRead = useCallback(async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif) return;

    const isBookingNotif = notif.title.includes("Booking") || notif.title.includes("Confirmed");

    let hasActiveTx = false;
    if (isBookingNotif && isSupabaseConfigured) {
      try {
        const { data: txs } = await supabase
          .from("transactions")
          .select("status")
          .eq("food_id", notif.food_id)
          .neq("status", "completed")
          .neq("status", "cancelled");
        hasActiveTx = (txs && txs.length > 0) || false;
      } catch (err) {
        console.error("Error checking active transactions for notification cleanup:", err);
      }
    }

    if (isBookingNotif && hasActiveTx) {
      // Keep it, just mark as read
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      if (isSupabaseConfigured) {
        try {
          await supabase.from("notifications").update({ is_read: true }).eq("id", id);
        } catch (err) {
          console.error("Error updating notification status:", err);
        }
      }
    } else {
      // Automatically delete it!
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (isSupabaseConfigured) {
        try {
          await supabase.from("notifications").delete().eq("id", id);
        } catch (err) {
          console.error("Error deleting notification:", err);
        }
      }
    }
  }, [notifications]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    if (!isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        console.error("Error marking all as read:", error);
        refresh();
      }
    } catch (err) {
      console.error("Exception marking all as read:", err);
    }
  }, [user, refresh]);

  const deleteNotification = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    if (!isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting notification:", error);
        refresh();
      }
    } catch (err) {
      console.error("Exception deleting notification:", err);
    }
  }, [refresh]);

  const clearAll = useCallback(async () => {
    if (!user) return;

    setNotifications([]);

    if (!isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error clearing notifications:", error);
        refresh();
      }
    } catch (err) {
      console.error("Exception clearing notifications:", err);
    }
  }, [user, refresh]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        unreadCount,
        soundEnabled,
        setSoundEnabled,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        refresh,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside <NotificationProvider>");
  return ctx;
}
