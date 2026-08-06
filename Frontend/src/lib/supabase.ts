import { createClient } from "@supabase/supabase-js";

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

const CustomStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch {}
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch {}
  },
};

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
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
