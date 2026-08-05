import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!loading && !user && isSupabaseConfigured) {
      navigation.navigate("Auth" as never);
    }
  }, [user, loading, navigation]);

  if (!isSupabaseConfigured && !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Configuration Missing</Text>
        <Text style={styles.description}>
          It looks like your deployment is missing the Supabase environment variables.
          Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env configuration.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    marginTop: 80,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
});