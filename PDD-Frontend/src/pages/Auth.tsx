import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Platform, useWindowDimensions } from 'react-native';
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from "@/context/LanguageContext";

export default function Auth() {
  const navigation = useNavigation<any>();
  const { user, loading, login, sendOtp, verifyOtp, resetPassword, updateUserPassword } = useAuth();
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

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
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expiryTimer, setExpiryTimer] = useState(180);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (authMode === "verify_otp") {
      interval = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        setExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authMode]);

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setResending(true);
    const res = await sendOtp(email, password, name, phone, otpReason === "recovery" ? "login" : "signup");
    setResending(false);
    if (!res.ok) {
      const rawErr = "error" in res ? String(res.error) : "Failed to resend OTP code.";
      setErrorMessage(rawErr);
      Alert.alert("Resend Failed", rawErr);
      return;
    }
    setResendCooldown(60);
    setExpiryTimer(180);
    const msg = "A new OTP has been sent.";
    setSuccessMessage(msg);
    Alert.alert("OTP Resent ✉️", msg);
  };

  const formatMinutesSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, "0")} MIN`;
  };

  const getUiText = (key: string, fallback: string, params?: Record<string, string | number>) => {
    try {
      const val = t(key, params);
      if (!val || val === key) return fallback;
      return val;
    } catch {
      return fallback;
    }
  };

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
      if (expiryTimer === 0) {
        const msg = "This OTP has expired. Please request a new OTP.";
        setErrorMessage(msg);
        Alert.alert("OTP Expired", msg);
        return;
      }
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
        const friendlyErr = "error" in res ? String(res.error) : t('registrationErr');
        setErrorMessage(friendlyErr);
        Alert.alert(t('regFailedTitle'), friendlyErr);
        return;
      }
      setErrorMessage(null);
      setOtpReason("signup");
      Alert.alert(t('otpSentTitle'), t('otpSentMsg', { email }));
      setAuthMode("verify_otp");
    }
  };

  const renderFormContent = () => (
    <View style={styles.form}>
      {errorMessage && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color="#DC2626" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {successMessage && (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      {authMode === "reset_link_sent" ? (
        <View style={styles.resetSuccessContainer}>
          <View style={styles.mailBadge}>
            <Ionicons name="mail-open-outline" size={40} color="#16A34A" />
          </View>
          <Text style={styles.resetSuccessTitle}>{getUiText('resetLinkSentHeader', 'Password Reset Link Sent! ✉️')}</Text>
          <Text style={styles.resetSuccessMessage}>
            {getUiText('resetLinkSentBody', `We sent a password reset link to ${email}. Please check your inbox.`, { email })}
          </Text>

          <TouchableOpacity
            onPress={() => {
              setErrorMessage(null);
              setAuthMode("login");
            }}
            style={styles.resetBackBtn}
          >
            <Text style={styles.resetBackBtnText}>{getUiText('backToLoginBtn', '← Back to Login')}</Text>
          </TouchableOpacity>
        </View>
      ) : authMode === "reset_password" ? (
        <>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, paddingRight: 40 }]}
              placeholder={getUiText('newPasswordPlaceholder', 'New Password (at least 6 characters)')}
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

          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, paddingRight: 40 }]}
              placeholder={getUiText('confirmPasswordPlaceholder', 'Confirm New Password')}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>
              {busy ? getUiText('updatingPasswordState', 'Updating password...') : getUiText('updatePasswordBtn', 'Update Password & Log In')}
            </Text>
          </TouchableOpacity>
        </>
      ) : authMode === "forgot_password" ? (
        <>
          <TextInput
            style={styles.input}
            placeholder={getUiText('emailInputPlaceholder', 'Enter your registered email address')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>
              {busy ? getUiText('sendingLinkState', 'Sending link...') : getUiText('sendResetEmailBtn', 'Send Password Reset Email')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setErrorMessage(null);
              setAuthMode("login");
            }}
            style={styles.backToLoginBtn}
          >
            <Text style={styles.backToLoginText}>{getUiText('backToLoginBtn', '← Back to Login')}</Text>
          </TouchableOpacity>
        </>
      ) : authMode === "verify_otp" ? (
        <>
          <View style={styles.timerBox}>
            <Ionicons name="time-outline" size={16} color="#059669" />
            <Text style={styles.timerText}>
              {expiryTimer > 0
                ? getUiText('codeExpiresIn', `Code expires in ${formatMinutesSeconds(expiryTimer)}`, { time: formatMinutesSeconds(expiryTimer) })
                : getUiText('codeExpiredMsg', 'Code expired! Please resend a new OTP.')}
            </Text>
          </View>

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

          <TouchableOpacity onPress={handleSubmit} disabled={busy || expiryTimer === 0} style={[styles.submitBtn, expiryTimer === 0 && { opacity: 0.6 }]}>
            <Text style={styles.submitBtnText}>
              {busy ? getUiText('verifyingState', 'Verifying...') : getUiText('verifyCodeBtn', 'Verify Code & Log In')}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendCooldown > 0 || resending}
              style={[styles.resendBtn, resendCooldown > 0 && styles.resendBtnDisabled]}
            >
              <Text style={[styles.resendBtnText, resendCooldown > 0 && styles.resendBtnTextDisabled]}>
                {resending
                  ? getUiText('resendingState', 'Resending...')
                  : resendCooldown > 0
                  ? getUiText('resendOtpIn', `Resend OTP in ${resendCooldown}s`, { seconds: resendCooldown })
                  : getUiText('resendOtpBtn', 'Resend OTP')}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {authMode === "signup" && (
            <>
              <TextInput
                style={styles.input}
                placeholder={getUiText('fullNamePlaceholder', 'Full Name')}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder={getUiText('phoneNumberPlaceholder', 'Phone Number')}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder={getUiText('emailPlaceholder', 'Email Address')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, paddingRight: 40 }]}
              placeholder={getUiText('passwordPlaceholder', 'Password')}
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
              <Text style={styles.forgotBtnText}>{getUiText('forgotPasswordLink', 'Forgot Password?')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>
              {busy ? getUiText('processingState', 'Processing...') : authMode === "login" ? getUiText('loginTab', 'Log In') : getUiText('registerAccountBtn', 'Register Account')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  // Desktop Split Screen View (Matching 2nd Image)
  if (isDesktop) {
    return (
      <View style={styles.splitDesktopRoot}>
        {/* Left Side: Brand Hero Panel (Matching Image 2) */}
        <View style={styles.leftHeroPanel}>
          <View style={styles.heroContent}>
            <View style={styles.heroLogoBadge}>
              <Ionicons name="restaurant" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.heroTitle}>Zerra Food Hub</Text>
            <Text style={styles.heroSubtitle}>Zero Waste, Full Bellies 🌱</Text>

            <View style={styles.heroFeatureList}>
              <View style={styles.heroFeatureItem}>
                <View style={styles.heroFeatureIcon}><Ionicons name="radio-outline" size={18} color="#FFFFFF" /></View>
                <Text style={styles.heroFeatureText}>Live Community Donors</Text>
              </View>
              <View style={styles.heroFeatureItem}>
                <View style={styles.heroFeatureIcon}><Ionicons name="grid-outline" size={18} color="#FFFFFF" /></View>
                <Text style={styles.heroFeatureText}>Real-time Food Claiming</Text>
              </View>
              <View style={styles.heroFeatureItem}>
                <View style={styles.heroFeatureIcon}><Ionicons name="notifications-outline" size={18} color="#FFFFFF" /></View>
                <Text style={styles.heroFeatureText}>Background Push Alerts</Text>
              </View>
              <View style={styles.heroFeatureItem}>
                <View style={styles.heroFeatureIcon}><Ionicons name="stats-chart-outline" size={18} color="#FFFFFF" /></View>
                <Text style={styles.heroFeatureText}>Weekly Analytics & Trends</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right Side: Form Container (Matching Image 2) */}
        <View style={styles.rightFormPanel}>
          <View style={styles.desktopFormContainer}>
            {authMode !== "login" && (
              <TouchableOpacity
                onPress={() => {
                  setErrorMessage(null);
                  setAuthMode("login");
                  setOtp("");
                }}
                style={styles.desktopBackLink}
              >
                <Ionicons name="chevron-back" size={16} color="#16A34A" />
                <Text style={styles.desktopBackLinkText}>Back to Login</Text>
              </TouchableOpacity>
            )}

            <View style={styles.desktopHeaderRow}>
              <Text style={styles.desktopFormTitle}>
                {authMode === "signup" ? "Create account" : authMode === "login" ? "Log In" : "Account Access"}
              </Text>
              <Text style={styles.desktopFormSubtitle}>
                {authMode === "signup" ? "Start sharing and rescuing food today." : "Welcome back! Sign in to continue."}
              </Text>
            </View>

            {authMode !== "verify_otp" && authMode !== "forgot_password" && authMode !== "reset_password" && authMode !== "reset_link_sent" && (
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  onPress={() => setAuthMode("login")}
                  style={[styles.tab, authMode === "login" && styles.activeTab]}
                >
                  <Text style={[styles.tabText, authMode === "login" && styles.activeTabText]}>{getUiText('loginTab', 'Log In')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAuthMode("signup")}
                  style={[styles.tab, authMode === "signup" && styles.activeTab]}
                >
                  <Text style={[styles.tabText, authMode === "signup" && styles.activeTabText]}>{getUiText('signUpTab', 'Sign Up')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {renderFormContent()}

            <View style={styles.desktopFooterLinkRow}>
              {authMode === "signup" ? (
                <Text style={styles.desktopFooterText}>
                  Already have an account? <Text onPress={() => setAuthMode("login")} style={styles.desktopFooterLinkText}>Log In</Text>
                </Text>
              ) : authMode === "login" ? (
                <Text style={styles.desktopFooterText}>
                  Don't have an account? <Text onPress={() => setAuthMode("signup")} style={styles.desktopFooterLinkText}>Create account</Text>
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Mobile View
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
                ? (getUiText('resetPassSubtitle', 'Create a new password for your account'))
                : authMode === "forgot_password"
                  ? (getUiText('forgotPassSubtitle', 'Enter your email to receive reset instructions'))
                  : authMode === "verify_otp"
                    ? (email ? `Enter the 6-digit OTP sent to ${email}` : getUiText('otpSubtitle', 'Enter the 6-digit OTP sent to your email'))
                    : authMode === "login"
                      ? (getUiText('loginSubtitle', 'Welcome back! Sign in to continue.'))
                      : (getUiText('signupSubtitle', 'Create an account to start sharing food.'))}
            </Text>
          </View>
        )}

        {authMode !== "verify_otp" && authMode !== "forgot_password" && authMode !== "reset_password" && authMode !== "reset_link_sent" && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setAuthMode("login")}
              style={[styles.tab, authMode === "login" && styles.activeTab]}
            >
              <Text style={[styles.tabText, authMode === "login" && styles.activeTabText]}>{getUiText('loginTab', 'Log In')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAuthMode("signup")}
              style={[styles.tab, authMode === "signup" && styles.activeTab]}
            >
              <Text style={[styles.tabText, authMode === "signup" && styles.activeTabText]}>{getUiText('signUpTab', 'Sign Up')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {renderFormContent()}
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
  splitDesktopRoot: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 32,
  },
  leftHeroPanel: {
    flex: 1,
    maxWidth: 440,
    maxHeight: 580,
    backgroundColor: '#1C7B50',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  heroContent: {
    width: '100%',
    alignItems: 'center',
  },
  heroLogoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#86EFAC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A7F3D0',
    marginBottom: 20,
    textAlign: 'center',
  },
  heroFeatureList: {
    width: '100%',
    gap: 10,
  },
  heroFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  heroFeatureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFeatureText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rightFormPanel: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  desktopFormContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    gap: 18,
  },
  desktopBackLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: -4,
  },
  desktopBackLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  desktopHeaderRow: {
    gap: 4,
    marginBottom: 4,
  },
  desktopFormTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  desktopFormSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  desktopFooterLinkRow: {
    alignItems: 'center',
    marginTop: 10,
  },
  desktopFooterText: {
    fontSize: 13,
    color: '#64748B',
  },
  desktopFooterLinkText: {
    color: '#16A34A',
    fontWeight: '800',
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
    backgroundColor: '#F1F5F9',
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
    color: '#64748B',
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
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  otpSegmentBox: {
    width: 44,
    height: 52,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
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
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  successText: {
    flex: 1,
    color: '#166534',
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
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  resendBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendBtnDisabled: {
    opacity: 0.6,
  },
  resendBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  resendBtnTextDisabled: {
    color: '#9CA3AF',
  },
});