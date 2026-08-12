import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from "@/context/LanguageContext";

export default function Auth() {
  const navigation = useNavigation<any>();
  const { user, loading, login, sendOtp, verifyOtp, resetPassword, updateUserPassword } = useAuth();
  const { t } = useLanguage();

  const [authMode, setAuthMode] = useState<"login" | "signup" | "verify_otp" | "forgot_password" | "reset_link_sent" | "reset_password">("login");
  const [otpReason, setOtpReason] = useState<"signup" | "recovery">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigation.navigate("Home" as never);
    }
  }, [user, loading, navigation]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== "undefined") {
      const search = window.location.search || "";
      const hash = window.location.hash || "";
      if (search.includes("mode=reset") || hash.includes("type=recovery") || hash.includes("access_token")) {
        setAuthMode("reset_password");
      }
    }
  }, []);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (authMode === "reset_password") {
      if (!newPassword || newPassword.length < 6) {
        const msg = "New password must be at least 6 characters long.";
        setErrorMessage(msg);
        Alert.alert("Invalid Password", msg);
        return;
      }
      if (newPassword !== confirmPassword) {
        const msg = "Passwords do not match. Please type the same password in both fields.";
        setErrorMessage(msg);
        Alert.alert("Password Mismatch", msg);
        return;
      }
      setBusy(true);
      const res = await updateUserPassword(newPassword);
      setBusy(false);
      if (!res.ok) {
        const err = "error" in res ? String(res.error) : "Failed to update password.";
        setErrorMessage(err);
        Alert.alert("Update Failed", err);
        return;
      }
      setErrorMessage(null);
      Alert.alert("Success! 🎉", "Your password has been updated successfully!");
      navigation.navigate("Home" as never);
      return;
    }

    if (authMode === "forgot_password") {
      if (!email.trim()) {
        const msg = "Please enter your email address to receive password reset instructions.";
        setErrorMessage(msg);
        Alert.alert("Email Required", msg);
        return;
      }
      setBusy(true);
      const res = await resetPassword(email.trim());
      setBusy(false);
      if (!res.ok) {
        const err = "error" in res ? String(res.error) : "Failed to send reset email.";
        setErrorMessage(err);
        Alert.alert("Reset Failed", err);
        return;
      }
      setErrorMessage(null);
      setAuthMode("reset_link_sent");
      return;
    }

    if (authMode === "verify_otp") {
      if (!otp.trim() || otp.trim().length < 6) {
        const msg = "Please enter the 6-digit OTP code sent to your email.";
        setErrorMessage(msg);
        Alert.alert("Invalid Code", msg);
        return;
      }
      setBusy(true);
      const res = await verifyOtp(email, otp.trim(), otpReason);
      setBusy(false);
      if (!res.ok) {
        const rawErr = "error" in res ? String(res.error) : "Invalid verification code.";
        setErrorMessage(rawErr);
        Alert.alert("Verification Failed", rawErr);
        return;
      }
      setErrorMessage(null);
      if (otpReason === "recovery") {
        Alert.alert("Code Verified! 🎉", "Please enter your new password below.");
        setAuthMode("reset_password");
      } else {
        Alert.alert("Success", "Account verified successfully!");
        navigation.navigate("Home" as never);
      }
      return;
    }

    if (!email || !password) {
      const msg = "Please enter your email and password.";
      setErrorMessage(msg);
      Alert.alert("Missing Fields", msg);
      return;
    }

    setBusy(true);
    if (authMode === "login") {
      const res = await login(email, password);
      setBusy(false);
      if (!res.ok) {
        let friendlyErr = "error" in res ? String(res.error) : "Failed to log in.";
        if (friendlyErr.toLowerCase().includes("invalid login credentials")) {
          friendlyErr = "Incorrect email or password. If you haven't created an account yet, please tap 'Sign Up' first!";
        } else if (friendlyErr.toLowerCase().includes("user not found")) {
          friendlyErr = "No account exists for this email address. Please tap 'Sign Up' to create one!";
        } else if (friendlyErr.toLowerCase().includes("email not confirmed")) {
          friendlyErr = "Your email address is not verified yet. Please check your inbox for the verification code.";
        }
        setErrorMessage(friendlyErr);
        Alert.alert("Login Failed", friendlyErr);
        return;
      }
      setErrorMessage(null);
      navigation.navigate("Home" as never);
    } else {
      const res = await sendOtp(email, password, name, phone, "signup");
      setBusy(false);
      if (!res.ok) {
        const friendlyErr = "error" in res ? String(res.error) : "An error occurred during registration.";
        setErrorMessage(friendlyErr);
        Alert.alert("Registration Failed", friendlyErr);
        return;
      }
      setErrorMessage(null);
      setOtpReason("signup");
      Alert.alert("Verification Code Sent", `Check ${email} for your 6-digit OTP verification code!`);
      setAuthMode("verify_otp");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        {authMode !== "login" && (
          <TouchableOpacity
            onPress={() => {
              setErrorMessage(null);
              setAuthMode("login");
              setOtp("");
            }}
            style={styles.closeBtn}
          >
            <Ionicons name="close-circle" size={28} color="#9CA3AF" />
          </TouchableOpacity>
        )}

        {authMode !== "reset_link_sent" && (
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="leaf" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Zerra Food Hub</Text>
            <Text style={styles.subtitle}>
              {authMode === "reset_password"
                ? "Create a new password for your account"
                : authMode === "forgot_password"
                ? "Enter your email to receive reset instructions"
                : authMode === "verify_otp"
                ? `Enter the 6-digit ${otpReason === "recovery" ? "password reset " : ""}OTP sent to ${email}`
                : authMode === "login"
                ? "Welcome back! Sign in to continue."
                : "Create an account to start sharing food."}
            </Text>
          </View>
        )}

        {authMode !== "verify_otp" && authMode !== "forgot_password" && authMode !== "reset_password" && authMode !== "reset_link_sent" && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setAuthMode("login")}
              style={[styles.tab, authMode === "login" && styles.activeTab]}
            >
              <Text style={[styles.tabText, authMode === "login" && styles.activeTabText]}>{t('loginTab')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAuthMode("signup")}
              style={[styles.tab, authMode === "signup" && styles.activeTab]}
            >
              <Text style={[styles.tabText, authMode === "signup" && styles.activeTabText]}>{t('signUpTab')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.form}>
          {errorMessage && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {authMode === "reset_link_sent" ? (
            <View style={styles.resetSuccessContainer}>
              <View style={styles.mailBadge}>
                <Ionicons name="mail-open-outline" size={40} color="#16A34A" />
              </View>
              <Text style={styles.resetSuccessTitle}>Password Reset Link Sent! ✉️</Text>
              <Text style={styles.resetSuccessMessage}>
                We've sent a password reset link to <Text style={{ fontWeight: '800', color: '#111827' }}>{email}</Text>. Please check your inbox and spam folder, then tap the link to reset your password.
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setErrorMessage(null);
                  setAuthMode("login");
                }}
                style={styles.resetBackBtn}
              >
                <Text style={styles.resetBackBtnText}>← Back to Log In</Text>
              </TouchableOpacity>
            </View>
          ) : authMode === "reset_password" ? (
            <>
              {/* New Password Input */}
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, paddingRight: 40 }]}
                  placeholder="New Password (min 6 characters)"
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm New Password Input */}
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, paddingRight: 40 }]}
                  placeholder="Confirm New Password"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>
                  {busy ? "Updating Password..." : "Update Password & Log In"}
                </Text>
              </TouchableOpacity>
            </>
          ) : authMode === "forgot_password" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your registered email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>
                  {busy ? "Sending Link..." : "Send Password Reset Email"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setErrorMessage(null);
                  setAuthMode("login");
                }}
                style={styles.backToLoginBtn}
              >
                <Text style={styles.backToLoginText}>← Back to Log In</Text>
              </TouchableOpacity>
            </>
          ) : authMode === "verify_otp" ? (
            <>
              {/* Single Unified 6-Digit OTP Input Field */}
              <View style={styles.otpContainer}>
                <View style={styles.otpBoxesRow}>
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const char = otp[index] || "";
                    const isFocused = otp.length === index;
                    const isLast = index === 5;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.otpSegmentBox,
                          isFocused && styles.otpSegmentBoxFocused,
                          Boolean(char) && styles.otpSegmentBoxFilled,
                          isLast && styles.otpSegmentBoxLast
                        ]}
                      >
                        <Text style={styles.otpSegmentChar}>{char}</Text>
                      </View>
                    );
                  })}
                </View>

                {/* Hidden input overlaying the boxes for seamless typing */}
                <TextInput
                  style={styles.hiddenOtpInput}
                  value={otp}
                  onChangeText={(val) => {
                    const digits = val.replace(/[^0-9]/g, "").slice(0, 6);
                    setOtp(digits);
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus={true}
                  caretHidden={true}
                />
              </View>

              <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>
                  {busy ? "Verifying..." : "Verify Code & Log In"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {authMode === "signup" && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </>
              )}

              <TextInput
                style={styles.input}
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              {/* Password Input with Eye / Eye-Off Toggle */}
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, paddingRight: 40 }]}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {authMode === "login" && (
                <TouchableOpacity
                  onPress={() => {
                    setErrorMessage(null);
                    setAuthMode("forgot_password");
                  }}
                  style={styles.forgotBtn}
                >
                  <Text style={styles.forgotBtnText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>
                  {busy ? "Processing..." : authMode === "login" ? "Log In" : "Register Account"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022C22',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 20,
    position: 'relative',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#16A34A',
  },
  form: {
    gap: 12,
  },
  passwordWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    padding: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
  },
  otpContainer: {
    position: 'relative',
    marginVertical: 12,
    alignItems: 'center',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxLast: {
    borderRightWidth: 0,
  },
  otpBoxFilled: {
    backgroundColor: '#F0FDF4',
  },
  otpBoxFocused: {
    backgroundColor: '#DCFCE7',
  },
  otpChar: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  hiddenOtpInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01,
  },
  submitBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  secondaryBtnText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 13,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    marginTop: -4,
    marginBottom: 4,
  },
  forgotBtnText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '700',
  },
  backToLoginBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
  backToLoginText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '700',
  },
  otpSegmentBox: {
    width: 44,
    height: 52,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpSegmentBoxLast: {
    borderRightWidth: 0,
  },
  otpSegmentBoxFilled: {
    backgroundColor: '#F0FDF4',
  },
  otpSegmentBoxFocused: {
    backgroundColor: '#DCFCE7',
  },
  otpSegmentChar: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  resetSuccessContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 14,
    width: '100%',
  },
  mailBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    marginBottom: 4,
  },
  resetSuccessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  resetSuccessMessage: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  resetBackBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
    maxWidth: 280,
  },
  resetBackBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});