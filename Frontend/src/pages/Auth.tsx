import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React, { useState, useEffect, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { login, sendOtp, verifyOtp, resetPassword, user } = useAuth();

  const [authMode, setAuthMode] = useState<"login" | "signup" | "reset">("login");

  useEffect(() => {
    if (user && authMode !== "reset") {
      navigation.navigate("Home");
    }
  }, [user, navigation, authMode]);

  const [step, setStep] = useState<"email" | "otp">("email");
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<any[]>([]);

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

  const handleUpdatePassword = async () => {
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
      navigation.navigate("Home");
    }
  };

  const handleSendOtp = async () => {
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

  const handleVerifyOtp = async () => {
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
    navigation.navigate("Home");
  };

  useEffect(() => {
    if (otpValues.join("").length === 6) {
      handleVerifyOtp();
    }
  }, [otpValues]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.logoBg}>
            <Ionicons name="leaf" size={28} color="#ffffff" />
          </View>
          <Text style={styles.title}>Zerra Food Hub</Text>
          <Text style={styles.subtitle}>
            {authMode === "reset"
              ? "Reset your account password. Choose a strong new password."
              : step === "email"
              ? "Share leftover food, save the planet. Authenticate to continue."
              : "We have dispatched a 6-digit security code."}
          </Text>
        </View>

        {authMode === "reset" ? (
          <View style={styles.form}>
            <View>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={16} color="#5c7066" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#5c7066"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={16} color="#5c7066" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={16} color="#5c7066" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#5c7066"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={16} color="#5c7066" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleUpdatePassword} disabled={busy} style={styles.submitBtn} activeOpacity={0.8}>
              <Text style={styles.submitBtnText}>{busy ? "Updating..." : "Update Password"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setAuthMode("login")} style={styles.backBtn}>
              <Text style={styles.backBtnText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : step === "email" ? (
          <View style={styles.form}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setAuthMode("login")}
                style={[styles.tab, authMode === "login" && styles.activeTab]}
              >
                <Text style={[styles.tabText, authMode === "login" && styles.activeTabText]}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAuthMode("signup")}
                style={[styles.tab, authMode === "signup" && styles.activeTab]}
              >
                <Text style={[styles.tabText, authMode === "signup" && styles.activeTabText]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {authMode === "signup" && (
              <>
                <View>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={16} color="#5c7066" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="John Doe"
                      placeholderTextColor="#5c7066"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={16} color="#5c7066" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="9876543210"
                      placeholderTextColor="#5c7066"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                </View>
              </>
            )}

            <View>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={16} color="#5c7066" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="yourname@example.com"
                  placeholderTextColor="#5c7066"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                {authMode === "login" && (
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={16} color="#5c7066" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#5c7066"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={16} color="#5c7066" />
                </TouchableOpacity>
              </View>
            </View>

            {authMode === "signup" && (
              <View>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={16} color="#5c7066" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#5c7066"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
                    <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={16} color="#5c7066" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={handleSendOtp}
              disabled={busy}
              style={styles.submitBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBtnText}>
                {busy ? "Dispatching..." : authMode === "login" ? "Log In" : "Register & Get OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.otpHeaderCard}>
              <View style={styles.otpHeaderLeft}>
                <Text style={styles.otpHeaderLabel}>Sending OTP to</Text>
                <Text style={styles.otpHeaderEmail}>{email}</Text>
              </View>
              <TouchableOpacity onPress={() => setStep("email")} style={styles.editBtn}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.labelCenter}>6-Digit OTP Code</Text>
              <View style={styles.otpGrid}>
                {otpValues.map((val, idx) => (
                  <TextInput
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    style={styles.otpCell}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={val}
                    onChangeText={(v) => handleOtpChange(idx, v)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.timerRow}>
              <Text style={styles.timerText}>Expires in: {formatTime(expiryTimer)}</Text>
              {resendTimer > 0 ? (
                <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp} disabled={busy}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => handleVerifyOtp()}
              disabled={busy || otpValues.join("").length < 6}
              style={styles.submitBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBtnText}>{busy ? "Verifying..." : "Verify & Access"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f4ec',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e8e6df',
    gap: 20,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  logoBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#309267',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e382b',
  },
  subtitle: {
    fontSize: 12,
    color: '#5c7066',
    textAlign: 'center',
    lineHeight: 18,
  },
  form: {
    gap: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f6f4ec',
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c7066',
  },
  activeTabText: {
    color: '#309267',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5c7066',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  labelCenter: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5c7066',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  forgotText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#309267',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f4ec',
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1e382b',
  },
  eyeBtn: {
    padding: 4,
  },
  submitBtn: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#309267',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  backBtn: {
    alignItems: 'center',
    marginTop: 4,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c7066',
  },
  otpHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f6f4ec',
    padding: 12,
    borderRadius: 12,
  },
  otpHeaderLeft: {
    flex: 1,
  },
  otpHeaderLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#5c7066',
    textTransform: 'uppercase',
  },
  otpHeaderEmail: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e382b',
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  editBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#309267',
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  otpCell: {
    width: 44,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f6f4ec',
    borderWidth: 1,
    borderColor: '#e8e6df',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#1e382b',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5c7066',
  },
  resendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#309267',
  },
});