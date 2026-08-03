import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Leaf, 
  Mail, 
  Phone, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  KeyRound, 
  User as UserIcon, 
  Eye, 
  EyeOff,
  Users,
  Globe,
  Sprout
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sendOtp, verifyOtp, resetPassword, user } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const [authMode, setAuthMode] = useState<"login" | "signup" | "reset">(
    new URLSearchParams(location.search).get("mode") === "reset" ? "reset" : "login"
  );

  useEffect(() => {
    if (user && authMode !== "reset") {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from, authMode]);

  const [step, setStep] = useState<"email" | "otp">("email");
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [resendTimer, setResendTimer] = useState(30);
  const [expiryTimer, setExpiryTimer] = useState(300);

  const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startResendTimer = () => {
    setResendTimer(30);
    if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
    resendIntervalRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startExpiryTimer = () => {
    setExpiryTimer(300);
    if (expiryIntervalRef.current) clearInterval(expiryIntervalRef.current);
    expiryIntervalRef.current = setInterval(() => {
      setExpiryTimer((prev) => {
        if (prev <= 1) {
          if (expiryIntervalRef.current) clearInterval(expiryIntervalRef.current);
          toast.error("Your verification code has expired. Please request a new one.");
          setStep("email");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
      if (expiryIntervalRef.current) clearInterval(expiryIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }
    setBusy(true);
    const res = await resetPassword(email);
    setBusy(false);
    
    if (!res.ok) {
      toast.error("error" in res ? res.error : "Failed to send reset email.");
      return;
    }
    toast.success("Password reset email sent! Check your inbox.");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: password });
    setBusy(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      navigate("/", { replace: true });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address format.");
      return;
    }

    if (authMode === "signup") {
      if (!name.trim()) {
        toast.error("Please enter your full name.");
        return;
      }
      if (!phone.trim()) {
        toast.error("Please enter your mobile number.");
        return;
      }
      if (!password) {
        toast.error("Please enter a password.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match. Please verify.");
        return;
      }
      if (!agreed) {
        toast.error("Please accept the food quality and sharing guidelines.");
        return;
      }
    }

    if (authMode === "login") {
      if (!password) {
        toast.error("Please enter a password.");
        return;
      }
      setBusy(true);
      const res = await login(email, password);
      setBusy(false);

      if (!res.ok) {
        toast.error("error" in res ? res.error : "Failed to log in.");
        return;
      }
      toast.success("Login successful!");
      return;
    }

    setBusy(true);
    const res = await sendOtp(
      email, 
      password, 
      name, 
      phone, 
      authMode === "signup" ? "signup" : "login"
    );
    setBusy(false);

    if (!res.ok) {
      toast.error("error" in res ? res.error : "An error occurred");
      return;
    }

    toast.success("Verification code dispatched successfully!");

    setStep("otp");
    startResendTimer();
    startExpiryTimer();
    setOtpValues(Array(6).fill(""));
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setBusy(true);
    const res = await sendOtp(
      email, 
      authMode === "signup" ? password : undefined, 
      authMode === "signup" ? name : undefined, 
      authMode === "signup" ? phone : undefined, 
      authMode === "signup" ? "signup" : "login"
    );
    setBusy(false);

    if (!res.ok) {
      toast.error("error" in res ? res.error : "An error occurred");
      return;
    }

    toast.success("A fresh verification code has been sent!");

    startResendTimer();
    startExpiryTimer();
    setOtpValues(Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleOtpChange = (index: number, val: string) => {
    if (/[^0-9]/.test(val)) return;

    const newValues = [...otpValues];
    newValues[index] = val;
    setOtpValues(newValues);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newValues = [...otpValues];
        newValues[index - 1] = "";
        setOtpValues(newValues);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newValues = [...otpValues];
        newValues[index] = "";
        setOtpValues(newValues);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedText)) {
      toast.error("Please paste a valid 6-digit numeric verification code.");
      return;
    }

    const digits = pastedText.split("");
    setOtpValues(digits);
    inputRefs.current[5]?.focus();
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otpValues.join("");

    if (otpCode.length < 6) {
      toast.error("Please complete the 6-digit verification grid.");
      return;
    }

    setBusy(true);
    const res = await verifyOtp(
      email,
      otpCode,
      authMode === "signup" ? "signup" : "magiclink"
    );
    setBusy(false);

    if (!res.ok) {
      toast.error("error" in res ? res.error : "An error occurred");
      return;
    }

    toast.success("Access authorized. Redirecting to home dashboard...");
    navigate(from, { replace: true });
  };

  useEffect(() => {
    if (otpValues.join("").length === 6) {
      handleVerifyOtp();
    }
  }, [otpValues]);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* ── Left Hero Panel (Desktop) ── */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-[#f4f6f0] relative overflow-hidden border-r border-[#e8e6df]">
          {/* Curved background glow */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#e6ede1]/60 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
          
          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1c7b50] flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-[#1e382b] tracking-tight">
              Zerra <span className="text-[#1c7b50]">Food Hub</span>
            </span>
          </div>

          {/* Main Hero Content */}
          <div className="relative z-10 my-auto max-w-lg space-y-8 pt-8">
            <div>
              <h1 className="text-4xl font-extrabold text-[#1e382b] leading-[1.25] tracking-tight font-serif">
                Share leftover food, <br />
                <span className="text-[#1c7b50]">save the planet.</span>
              </h1>
              <p className="text-sm text-[#5c7066] mt-4 leading-relaxed font-medium">
                Zerra Food Hub connects communities to reduce food waste and help those in need.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-5 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#e3efe8] flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-5 h-5 text-[#1c7b50]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1e382b]">Reduce Waste</h4>
                  <p className="text-xs text-[#5c7066] mt-0.5 leading-relaxed">
                    Give food a second life and reduce landfill waste.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#e3efe8] flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-5 h-5 text-[#1c7b50]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1e382b]">Help Communities</h4>
                  <p className="text-xs text-[#5c7066] mt-0.5 leading-relaxed">
                    Support those in need by sharing surplus food.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#e3efe8] flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-5 h-5 text-[#1c7b50]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1e382b]">Save the Planet</h4>
                  <p className="text-xs text-[#5c7066] mt-0.5 leading-relaxed">
                    Together, we can build a sustainable future.
                  </p>
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#e2e0d8] shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e3efe8] flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5 text-[#1c7b50]" />
              </div>
              <div className="text-xs">
                <p className="text-[#5c7066] font-medium">Every meal shared makes a difference.</p>
                <p className="font-extrabold text-[#1c7b50] mt-0.5">Be a part of the change.</p>
              </div>
            </div>
          </div>

          {/* Bottom Right Image Decoration */}
          <div className="absolute right-0 bottom-0 w-[420px] h-[480px] pointer-events-none overflow-hidden flex items-end justify-end">
            <img 
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=900&auto=format&fit=crop" 
              alt="Fresh salad bowl" 
              className="w-full h-full object-cover object-left-top opacity-90 rounded-tl-[120px] shadow-2xl" 
            />
          </div>

          {/* Left Footer Copyright */}
          <div className="relative z-10 text-[11px] text-[#7a8c82] font-semibold pt-6">
            © 2025 Zerra Food Hub. All rights reserved.
          </div>
        </div>

        {/* ── Right Form Panel (Desktop & Mobile) ── */}
        <div className="flex flex-col justify-between p-6 sm:p-12 bg-[#faf8f5] overflow-y-auto">
          <div className="my-auto w-full max-w-md mx-auto">
            {/* White Form Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-xl border border-[#e8e6df]/80 space-y-6">
              
              {/* Form Top Badge & Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#e3efe8] text-[#1c7b50] flex items-center justify-center mx-auto shadow-sm">
                  <Leaf className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#1e382b] tracking-tight font-serif">
                  {authMode === "reset"
                    ? "Reset Password"
                    : step === "otp"
                    ? "Verify Verification Code"
                    : "Welcome back!"}
                </h2>
                <p className="text-xs text-[#5c7066] font-medium">
                  {authMode === "reset"
                    ? "Enter your new password below."
                    : step === "otp"
                    ? "Enter the 6-digit code sent to your email."
                    : "Authenticate to continue."}
                </p>
              </div>

              {authMode === "reset" ? (
                <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-extrabold text-[#1e382b] mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-[#7a8c82]">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-[#d6d4cb] focus:ring-2 focus:ring-[#1c7b50]/30 focus:border-[#1c7b50] transition-all bg-[#faf8f5]/50 outline-none"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-[#7a8c82] hover:text-[#1e382b] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#1e382b] mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-[#7a8c82]">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-[#d6d4cb] focus:ring-2 focus:ring-[#1c7b50]/30 focus:border-[#1c7b50] transition-all bg-[#faf8f5]/50 outline-none"
                        placeholder="••••••••"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3.5 text-[#7a8c82] hover:text-[#1e382b] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full py-3.5 bg-[#1c7b50] hover:bg-[#15613e] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    {busy ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      <>
                        Update Password <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      navigate("/auth", { replace: true });
                    }}
                    className="w-full text-center text-xs font-extrabold text-[#5c7066] hover:text-[#1e382b] pt-2"
                  >
                    Back to Login
                  </button>
                </form>
              ) : step === "email" ? (
                <div className="space-y-5">
                  {/* Segmented Tab Switcher */}
                  <div className="flex p-1 bg-[#f4f3ed] rounded-xl border border-[#e2e0d8]">
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className={`flex-1 py-2.5 text-center text-xs font-extrabold rounded-lg transition-all ${
                        authMode === "login" 
                          ? "bg-white text-[#1c7b50] shadow-sm border border-[#e2e0d8]" 
                          : "text-[#5c7066] hover:text-[#1e382b]"
                      }`}
                    >
                      Log In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className={`flex-1 py-2.5 text-center text-xs font-extrabold rounded-lg transition-all ${
                        authMode === "signup" 
                          ? "bg-white text-[#1c7b50] shadow-sm border border-[#e2e0d8]" 
                          : "text-[#5c7066] hover:text-[#1e382b]"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    {authMode === "signup" && (
                      <>
                        <div>
                          <label className="block text-xs font-extrabold text-[#1e382b] mb-1.5">
                            Full Name
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3.5 text-[#7a8c82]">
                              <UserIcon className="w-4 h-4" />
                            </span>
                            <input
                              className="w-full pl-10 py-3 text-sm rounded-xl border border-[#d6d4cb] focus:ring-2 focus:ring-[#1c7b50]/30 focus:border-[#1c7b50] transition-all bg-[#faf8f5]/50 outline-none text-[#1e382b]"
                              placeholder="John Doe"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required={authMode === "signup"}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-[#1e382b] mb-1.5">
                            Phone Number
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3.5 text-[#7a8c82]">
                              <Phone className="w-4 h-4" />
                            </span>
                            <input
                              className="w-full pl-10 py-3 text-sm rounded-xl border border-[#d6d4cb] focus:ring-2 focus:ring-[#1c7b50]/30 focus:border-[#1c7b50] transition-all bg-[#faf8f5]/50 outline-none text-[#1e382b]"
                              placeholder="9876543210"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required={authMode === "signup"}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-extrabold text-[#1e382b] mb-1.5">
                        Email address
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3.5 text-[#7a8c82]">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          className="w-full pl-10 py-3 text-sm rounded-xl border border-[#d6d4cb] focus:ring-2 focus:ring-[#1c7b50]/30 focus:border-[#1c7b50] transition-all bg-[#faf8f5]/50 outline-none text-[#1e382b]"
                          placeholder="yourname@example.com"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-extrabold text-[#1e382b]">
                          Password
                        </label>
                        {authMode === "login" && (
                          <button 
                            type="button" 
                            onClick={handleForgotPassword}
                            className="text-xs font-extrabold text-[#1c7b50] hover:underline"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3.5 text-[#7a8c82]">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-[#d6d4cb] focus:ring-2 focus:ring-[#1c7b50]/30 focus:border-[#1c7b50] transition-all bg-[#faf8f5]/50 outline-none text-[#1e382b]"
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-[#7a8c82] hover:text-[#1e382b] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {authMode === "signup" && (
                      <>
                        <div>
                          <label className="block text-xs font-extrabold text-[#1e382b] mb-1.5">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3.5 text-[#7a8c82]">
                              <Lock className="w-4 h-4" />
                            </span>
                            <input
                              className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-[#d6d4cb] focus:ring-2 focus:ring-[#1c7b50]/30 focus:border-[#1c7b50] transition-all bg-[#faf8f5]/50 outline-none text-[#1e382b]"
                              placeholder="••••••••"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required={authMode === "signup"}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3.5 top-3.5 text-[#7a8c82] hover:text-[#1e382b] transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="pt-1">
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={agreed}
                              onChange={(e) => setAgreed(e.target.checked)}
                              className="w-4 h-4 rounded border-[#d6d4cb] text-[#1c7b50] focus:ring-[#1c7b50] cursor-pointer"
                            />
                            <span className="text-xs text-[#5c7066] font-medium">
                              I accept food quality & sharing guidelines.
                            </span>
                          </label>
                        </div>
                      </>
                    )}

                    {authMode === "login" && (
                      <div className="flex items-center gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-[#d6d4cb] text-[#1c7b50] focus:ring-[#1c7b50] cursor-pointer"
                        />
                        <label htmlFor="rememberMe" className="text-xs text-[#5c7066] font-medium cursor-pointer select-none">
                          Remember me
                        </label>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={busy || (authMode === "signup" && !agreed)}
                      className="w-full py-3.5 bg-[#1c7b50] hover:bg-[#15613e] text-white font-extrabold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
                    >
                      {busy ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          {authMode === "login" ? "Log In" : "Register & Get OTP"} <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social Login Divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#e2e0d8]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-[#7a8c82] font-semibold">
                        or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      type="button"
                      onClick={() => toast.info("Google authentication in progress")}
                      className="py-2.5 border border-[#e2e0d8] rounded-xl flex items-center justify-center bg-white hover:bg-[#faf8f5] transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </button>

                    <button 
                      type="button"
                      onClick={() => toast.info("Facebook authentication in progress")}
                      className="py-2.5 border border-[#e2e0d8] rounded-xl flex items-center justify-center bg-white hover:bg-[#faf8f5] transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>

                    <button 
                      type="button"
                      onClick={() => toast.info("Apple authentication in progress")}
                      className="py-2.5 border border-[#e2e0d8] rounded-xl flex items-center justify-center bg-white hover:bg-[#faf8f5] transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.82c.62-.75 1.04-1.8 1.04-2.82 0-.14-.01-.28-.04-.42-1 .04-2.2.67-2.92 1.51-.57.66-1.07 1.73-1.07 2.76 0 .15.02.3.04.42 1.13-.09 2.29-.7 2.95-1.45z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* OTP Verification Step */
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="flex items-center justify-between p-3 bg-[#f4f3ed] rounded-xl border border-[#e2e0d8]">
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-[10px] text-[#7a8c82] font-extrabold uppercase">Sending OTP to</p>
                      <p className="text-xs font-extrabold text-[#1e382b] truncate">{email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="px-2.5 py-1 text-[10px] font-extrabold text-[#1c7b50] bg-white border border-[#e2e0d8] rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1 shrink-0"
                    >
                      <ArrowLeft className="w-3 h-3" /> Edit
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-[#1e382b] text-center">
                      6-Digit OTP Code
                    </label>
                    <div className="flex justify-between gap-1.5">
                      {otpValues.map((val, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (inputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={val}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? handleOtpPaste : undefined}
                          className="w-10 h-12 text-center text-lg font-extrabold text-[#1e382b] bg-[#faf8f5] focus:bg-white focus:ring-2 focus:ring-[#1c7b50]/30 focus:border-[#1c7b50] border border-[#d6d4cb] rounded-xl transition-all shadow-sm outline-none"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <div className="flex items-center gap-1 text-[#7a8c82]">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Expires in:</span>
                      <span className="text-red-500">{formatTime(expiryTimer)}</span>
                    </div>

                    {resendTimer > 0 ? (
                      <span className="text-[#7a8c82]">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={busy}
                        className="text-[#1c7b50] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3 animate-pulse" /> Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={busy || otpValues.join("").length < 6}
                    className="w-full py-3.5 bg-[#1c7b50] hover:bg-[#15613e] text-white font-extrabold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {busy ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" /> Verify & Access
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Footer Links */}
          <div className="flex items-center justify-center gap-6 text-xs text-[#5c7066] font-bold pt-8">
            <a href="#" className="hover:text-[#1c7b50] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1c7b50] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1c7b50] transition-colors">Contact Us</a>
          </div>
        </div>

      </div>
    </div>
  );
}