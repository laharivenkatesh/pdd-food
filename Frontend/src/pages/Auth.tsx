import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';

export default function Auth() {
  const navigation = useNavigation<any>();
  const { login, sendOtp } = useAuth();

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    setBusy(true);
    if (authMode === "login") {
      const res = await login(email, password);
      setBusy(false);
      if (!res.ok) {
        Alert.alert("Login Failed", "error" in res ? res.error : "Failed to log in.");
        return;
      }
      Alert.alert("Success", "Login successful!");
      navigation.navigate("Home" as never);
    } else {
      const res = await sendOtp(email, password, name, phone, "signup");
      setBusy(false);
      if (!res.ok) {
        Alert.alert("Registration Failed", "error" in res ? res.error : "An error occurred.");
        return;
      }
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Home" as never);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="leaf" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Zerra Food Hub</Text>
          <Text style={styles.subtitle}>
            {authMode === "login" ? "Welcome back! Sign in to continue." : "Create an account to start sharing food."}
          </Text>
        </View>

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

        <View style={styles.form}>
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

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>
              {busy ? "Processing..." : authMode === "login" ? "Log In" : "Register Account"}
            </Text>
          </TouchableOpacity>
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
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
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
});