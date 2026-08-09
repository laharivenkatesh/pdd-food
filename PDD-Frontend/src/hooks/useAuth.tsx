import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

const toastFn = (msg: string) => {
  if (Platform.OS === 'web') console.log(msg);
  else Alert.alert("Notice", msg);
};
const toast = Object.assign(toastFn, {
  success: (msg: string) => toastFn(msg),
  error: (msg: string) => toastFn(msg),
  info: (msg: string) => toastFn(msg),
});

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  role: string;
  trustScore: number | null;
  reviewCount: number;
}

export interface JWTUser {
  id: string;
  phone?: string;
  email: string;
  name?: string;
}

interface AuthContextValue {
  user: JWTUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  sendOtp: (email: string, password?: string, name?: string, phone?: string, mode?: "signup" | "login") => Promise<{ ok: true } | { ok: false; error: string }>;
  verifyOtp: (
    email: string,
    otp: string,
    type: "signup" | "recovery" | "magiclink"
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  resetPassword: (email: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  updateUserPassword: (newPassword: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  loginWithOAuth: (provider: "google" | "facebook" | "apple") => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const LOCAL_STORAGE_USER = "pdd_auth_user_session_v2";
const LOCAL_STORAGE_PROFILE = "pdd_auth_profile_session_v2";

// Helper to save session state across browser reloads & app restarts
const saveAuthToStorage = async (u: JWTUser | null, p: UserProfile | null) => {
  try {
    if (u && p) {
      const uStr = JSON.stringify(u);
      const pStr = JSON.stringify(p);
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined' && localStorage !== null) {
        localStorage.setItem(LOCAL_STORAGE_USER, uStr);
        localStorage.setItem(LOCAL_STORAGE_PROFILE, pStr);
      }
      await AsyncStorage.setItem(LOCAL_STORAGE_USER, uStr);
      await AsyncStorage.setItem(LOCAL_STORAGE_PROFILE, pStr);
    }
  } catch (e) {
    console.warn("Storage save notice:", e);
  }
};

// Helper to clear session storage ONLY when user manually logs out
const clearAuthFromStorage = async () => {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined' && localStorage !== null) {
      localStorage.removeItem(LOCAL_STORAGE_USER);
      localStorage.removeItem(LOCAL_STORAGE_PROFILE);
    }
    await AsyncStorage.removeItem(LOCAL_STORAGE_USER);
    await AsyncStorage.removeItem(LOCAL_STORAGE_PROFILE);
  } catch (e) {
    console.warn("Storage clear notice:", e);
  }
};

const getInitialUser = (): JWTUser | null => {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined' && localStorage !== null) {
      const stored = localStorage.getItem(LOCAL_STORAGE_USER);
      if (stored) return JSON.parse(stored);
    }
  } catch (e) {}
  return null;
};

const getInitialProfile = (): UserProfile | null => {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined' && localStorage !== null) {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILE);
      if (stored) return JSON.parse(stored);
    }
  } catch (e) {}
  return null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<JWTUser | null>(getInitialUser());
  const [profile, setProfileState] = useState<UserProfile | null>(getInitialProfile());
  const [loading, setLoading] = useState<boolean>(!getInitialUser());

  const setUser = (u: JWTUser | null) => {
    setUserState(u);
    if (u) {
      const p = profile || {
        id: u.id,
        name: u.name || u.email.split("@")[0] || "Community Member",
        email: u.email,
        phone: u.phone || "",
        created_at: new Date().toISOString(),
        role: "Community Member",
        trustScore: null,
        reviewCount: 0,
      };
      saveAuthToStorage(u, p);
    }
  };

  const setProfile = (p: UserProfile | null) => {
    setProfileState(p);
    if (p) {
      const u = user || { id: p.id, email: p.email, name: p.name, phone: p.phone };
      saveAuthToStorage(u, p);
    }
  };

  const refreshProfile = async () => {
    try {
      const auth = supabase.auth as any;
      const { data: { session } } = await auth.getSession();
      if (session?.user) {
        const userId = session.user.id;

        const newUser: JWTUser = {
          id: userId,
          email: session.user.email || "",
          phone: session.user.user_metadata?.phone || "",
        };

        const newProfile: UserProfile = {
          id: userId,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Community Member",
          email: session.user.email || "",
          phone: session.user.user_metadata?.phone || "",
          created_at: session.user.created_at,
          role: session.user.user_metadata?.role || "Community Member",
          trustScore: null,
          reviewCount: 0,
        };

        setUserState(newUser);
        setProfileState(newProfile);
        saveAuthToStorage(newUser, newProfile);
      }
    } catch (err) {
      console.warn("Auth restoration notice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        let uStr: string | null = null;
        let pStr: string | null = null;

        if (Platform.OS === 'web' && typeof localStorage !== 'undefined' && localStorage !== null) {
          uStr = localStorage.getItem(LOCAL_STORAGE_USER);
          pStr = localStorage.getItem(LOCAL_STORAGE_PROFILE);
        }

        if (!uStr) {
          uStr = await AsyncStorage.getItem(LOCAL_STORAGE_USER);
          pStr = await AsyncStorage.getItem(LOCAL_STORAGE_PROFILE);
        }

        if (uStr && pStr) {
          const loadedUser = JSON.parse(uStr);
          const loadedProfile = JSON.parse(pStr);
          setUserState(loadedUser);
          setProfileState(loadedProfile);
          setLoading(false);
          // Background sync with Supabase session without logging user out if offline/unreachable
          refreshProfile();
          return;
        }
      } catch (e) {
        console.warn("Error restoring stored session:", e);
      }

      await refreshProfile();
    };

    restoreSession();

    // Listen to Supabase auth changes dynamically in background
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        const newUser: JWTUser = {
          id: session.user.id,
          email: session.user.email || "",
          phone: session.user.user_metadata?.phone || "",
        };

        const newProfile: UserProfile = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Community Member",
          email: session.user.email || "",
          phone: session.user.user_metadata?.phone || "",
          created_at: session.user.created_at,
          role: session.user.user_metadata?.role || "Community Member",
          trustScore: null,
          reviewCount: 0,
        };

        setUserState(newUser);
        setProfileState(newProfile);
        saveAuthToStorage(newUser, newProfile);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Logs in a user using email and password
   */
  const login = async (email: string, password?: string) => {
    try {
      if (!password) throw new Error("Password is required for login.");
      const { data, error } = await (supabase.auth as any).signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data?.session?.user) {
        const newUser: JWTUser = {
          id: data.session.user.id,
          email: data.session.user.email || "",
          phone: data.session.user.user_metadata?.phone || "",
        };
        const newProfile: UserProfile = {
          id: data.session.user.id,
          name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || data.session.user.email?.split("@")[0] || "Community Member",
          email: data.session.user.email || "",
          phone: data.session.user.user_metadata?.phone || "",
          created_at: data.session.user.created_at,
          role: data.session.user.user_metadata?.role || "Community Member",
          trustScore: null,
          reviewCount: 0,
        };
        setUserState(newUser);
        setProfileState(newProfile);
        await saveAuthToStorage(newUser, newProfile);
      }
      return { ok: true as const };
    } catch (err: any) {
      return { ok: false as const, error: err.message || "Failed to log in." };
    }
  };

  /**
   * Triggers OTP sending via Supabase Auth
   */
  const sendOtp = async (email: string, password?: string, name?: string, phone?: string, mode?: "signup" | "login") => {
    try {
      if (mode === "signup" && password) {
        const { error } = await (supabase.auth as any).signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              phone: phone
            }
          }
        });
        if (error) throw error;
        return { ok: true as const };
      } else {
        const { error } = await (supabase.auth as any).signInWithOtp({
          email,
        });
        if (error) throw error;
        return { ok: true as const };
      }
    } catch (err: any) {
      return { ok: false as const, error: err.message || "Failed to send OTP code." };
    }
  };

  /**
   * Verifies the 6-digit OTP code entered by the user
   */
  const verifyOtp = async (email: string, otp: string, type: "signup" | "recovery" | "magiclink" = "signup") => {
    try {
      let verificationType: any = "signup";
      if (type === "recovery") verificationType = "recovery";
      else if (type === "magiclink") verificationType = "magiclink";
      else verificationType = "email";

      const { data, error } = await (supabase.auth as any).verifyOtp({
        email,
        token: otp,
        type: verificationType,
      });

      if (error) throw error;

      if (data.session?.user) {
        const newUser: JWTUser = {
          id: data.session.user.id,
          email: data.session.user.email || "",
          phone: data.session.user.user_metadata?.phone || "",
        };
        const newProfile: UserProfile = {
          id: data.session.user.id,
          name: data.session.user.user_metadata?.name || "Community Member",
          email: data.session.user.email || "",
          phone: data.session.user.user_metadata?.phone || "",
          created_at: data.session.user.created_at,
          role: data.session.user.user_metadata?.role || "Community Member",
          trustScore: null,
          reviewCount: 0,
        };
        setUserState(newUser);
        setProfileState(newProfile);
        await saveAuthToStorage(newUser, newProfile);
      }

      return { ok: true as const };
    } catch (err: any) {
      return { ok: false as const, error: err.message || "Invalid verification code." };
    }
  };

  /**
   * Resets user password by sending a reset link
   */
  const resetPassword = async (email: string) => {
    try {
      const origin = (Platform.OS === 'web' && typeof window !== "undefined" && window.location) ? window.location.origin : "";
      const redirectTo = origin ? `${origin}/auth` : undefined;
      const { error } = await (supabase.auth as any).resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
      return { ok: true as const };
    } catch (err: any) {
      console.error("Supabase resetPasswordForEmail error:", err);
      return { ok: false as const, error: err.message || "Failed to send password reset link." };
    }
  };

  /**
   * Updates user password once authenticated via reset link
   */
  const updateUserPassword = async (newPassword: string) => {
    try {
      const { error } = await (supabase.auth as any).updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { ok: true as const };
    } catch (err: any) {
      return { ok: false as const, error: err.message || "Failed to update password." };
    }
  };

  /**
   * Triggers social OAuth login via Supabase (Google, Facebook, Apple)
   */
  const loginWithOAuth = async (provider: "google" | "facebook" | "apple") => {
    try {
      const origin = (Platform.OS === 'web' && typeof window !== "undefined" && window.location) ? window.location.origin : "";
      const redirectTo = `${origin}/auth`;
      const { error } = await (supabase.auth as any).signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });
      if (error) throw error;
      return { ok: true as const };
    } catch (err: any) {
      return { ok: false as const, error: err.message || `Failed to sign in with ${provider}` };
    }
  };

  /**
   * Logs out the user from the current session ONLY when manually clicked
   */
  const logout = async () => {
    try {
      await clearAuthFromStorage();
      await (supabase.auth as any).signOut();
      setUserState(null);
      setProfileState(null);
      toast.success("Successfully logged out.");
    } catch (err) {
      console.error("Logout error:", err);
      setUserState(null);
      setProfileState(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        sendOtp,
        verifyOtp,
        resetPassword,
        updateUserPassword,
        loginWithOAuth,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}