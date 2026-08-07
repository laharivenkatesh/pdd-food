import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Platform } from "react-native";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

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
  loginWithOAuth: (provider: "google" | "facebook" | "apple") => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JWTUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userId = session.user.id;

        // Set active user session & profile INSTANTLY (< 1ms)
        setUser({
          id: userId,
          email: session.user.email || "",
          phone: session.user.user_metadata?.phone || "",
        });

        setProfile({
          id: userId,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Community Member",
          email: session.user.email || "",
          phone: session.user.user_metadata?.phone || "",
          created_at: session.user.created_at,
          role: session.user.user_metadata?.role || "Community Member",
          trustScore: null,
          reviewCount: 0,
        });

        // Unblock auth loading state immediately
        setLoading(false);

        // Perform non-blocking background fetch for user review ratings
        (async () => {
          try {
            const { data: foodsData } = await supabase
              .from("foods")
              .select("id")
              .eq("user_id", userId);

            if (foodsData && foodsData.length > 0) {
              const foodIds = foodsData.map((f: any) => f.id);
              const { data: reviewsData } = await supabase
                .from("reviews")
                .select("rating")
                .in("food_id", foodIds);

              if (reviewsData && reviewsData.length > 0) {
                const total = reviewsData.reduce((acc: number, curr: any) => acc + (curr.rating || 5), 0);
                const avg = Number((total / reviewsData.length).toFixed(1));
                setProfile((prev) => prev ? { ...prev, trustScore: avg, reviewCount: reviewsData.length } : null);
              }
            }
          } catch (e) {
            // Non-critical background computation error swallowed
          }
        })();
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    } catch (err) {
      console.error("Auth restoration error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Handle OAuth PKCE code exchange if redirected with ?code=
    const handleInitialAuth = async () => {
      if (Platform.OS === 'web' && typeof window !== "undefined" && window.location) {
        const params = new URLSearchParams(window.location.search || "");
        const code = params.get("code");
        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(code);
          } catch (e) {
            console.error("OAuth code exchange error:", e);
          }
        }
      }
      await refreshProfile();
    };

    handleInitialAuth();

    // Listen to Supabase auth changes dynamically in background
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          phone: session.user.user_metadata?.phone || "",
        });
        setProfile((prev) => prev || {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Community Member",
          email: session.user.email || "",
          phone: session.user.user_metadata?.phone || "",
          created_at: session.user.created_at,
          role: session.user.user_metadata?.role || "Community Member",
          trustScore: null,
          reviewCount: 0,
        });
        setLoading(false);

        if (Platform.OS === 'web' && _event === "PASSWORD_RECOVERY" && typeof window !== "undefined" && window.location) {
          window.location.href = "/auth?mode=reset";
        }
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Separate async effect to load extended database profile attributes
  useEffect(() => {
    if (!user) return;

    let active = true;

    const syncAndFetchDbProfile = async () => {
      try {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        const email = user.email || "";
        const phone = user.phone || "";

        if (!existingProfile) {
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              name: "User",
              phone: phone,
              email: email,
              role: "Community Member"
            })
            .select()
            .single();

          if (newProfile && active) {
            setProfile((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                name: newProfile.name,
                phone: newProfile.phone || "",
                role: newProfile.role,
                email: newProfile.email || email,
              };
            });
          }
        } else {
          if (!existingProfile.email) {
            await supabase
              .from("profiles")
              .update({ email: email })
              .eq("id", user.id);
          }

          if (active) {
            setProfile((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                name: existingProfile.name || prev.name,
                phone: existingProfile.phone || prev.phone,
                role: existingProfile.role || prev.role,
                email: existingProfile.email || email,
              };
            });
          }
        }
      } catch (err) {
        console.error("Error syncing and fetching db profile:", err);
      }
    };

    syncAndFetchDbProfile();

    return () => {
      active = false;
    };
  }, [user]);

  /**
   * Logs in a user using email and password
   */
  const login = async (email: string, password?: string) => {
    try {
      if (!password) throw new Error("Password is required for login.");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
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
        // Sign up logic - sends an OTP to email automatically if confirm email is enabled!
        const { data, error } = await supabase.auth.signUp({
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
        // Login Logic - Since they want OTP on login, we use signInWithOtp
        const { error } = await supabase.auth.signInWithOtp({
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

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: verificationType,
      });

      if (error) throw error;

      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
          phone: data.session.user.user_metadata?.phone || "",
        });
        setProfile({
          id: data.session.user.id,
          name: data.session.user.user_metadata?.name || "Community Member",
          email: data.session.user.email || "",
          phone: data.session.user.user_metadata?.phone || "",
          created_at: data.session.user.created_at,
          role: data.session.user.user_metadata?.role || "Community Member",
          trustScore: null,
          reviewCount: 0,
        });
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth?mode=reset`,
      });
      if (error) throw error;
      return { ok: true as const };
    } catch (err: any) {
      return { ok: false as const, error: err.message || "Failed to send password reset link." };
    }
  };

  /**
   * Triggers social OAuth login via Supabase (Google, Facebook, Apple)
   */
  const loginWithOAuth = async (provider: "google" | "facebook" | "apple") => {
    try {
      const origin = (Platform.OS === 'web' && typeof window !== "undefined" && window.location) ? window.location.origin : "";
      const redirectTo = `${origin}/auth`;
      const { error } = await supabase.auth.signInWithOAuth({
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
   * Logs out the user from the current session
   */
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      toast.success("Successfully logged out.");
    } catch (err) {
      console.error("Logout error:", err);
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