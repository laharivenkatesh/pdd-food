import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// These are read from .env (Vite). After connecting Supabase, add to a .env file:
// VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
// VITE_SUPABASE_ANON_KEY=eyJhbGciOi... (anon/publishable key — safe to expose)
const DEFAULT_SUPABASE_URL = "https://ulxjsvznpwokczrruipr.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVseGpzdnpucHdva2N6cnJ1aXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMzEwNDEsImV4cCI6MjEwMTYwNzA0MX0.-5E-3YKN-s4dQ_2ikGauOz78bwJJ4uWNJ3WBA7TyK60";

const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

const SUPABASE_URL = (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_SUPABASE_URL) || (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) || (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.startsWith("http")
);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Zerra] Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env",
  );
}

const inMemoryStorage: Record<string, string> = {};

const CustomStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== "undefined" && localStorage !== null) {
        return localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn("Storage getItem notice:", e);
      return inMemoryStorage[key] || null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== "undefined" && localStorage !== null) {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("Storage setItem notice:", e);
    }
    inMemoryStorage[key] = value;
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== "undefined" && localStorage !== null) {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("Storage removeItem notice:", e);
    }
    delete inMemoryStorage[key];
  },
};

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: Platform.OS === 'web' && typeof window !== 'undefined' && Boolean(window.location?.search),
      storage: CustomStorage,
    },
  },
);

// ==== DB row types (must match the SQL schema below) ====
export interface ProfileRow {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  role: string;
  created_at: string;
}

export interface FoodRow {
  id: string;
  user_id: string;
  name: string;
  image: string | null;
  feeds: number;
  price: number;
  expiry_hours: number;
  prepared_at: string;
  address: string;
  lat: number;
  lng: number;
  category: "Veg" | "Non-Veg" | "Bakery" | "Fried" | "Sweets";
  tags: string[];
  purpose: "humans" | "animals" | "both";
  safe_for_animals: boolean;
  status: "available" | "reserved" | "collected";
  realtime_status: "Still Available" | "Almost Gone" | "Not Available";
  quantity: string;
  notes: string | null;
  allow_split: boolean;
  booked_portions: number;
  created_at: string;
}
