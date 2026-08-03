import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useEffect } from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute();

  useEffect(() => {
    if (!loading && !user && isSupabaseConfigured) {
      navigation.navigate("Auth", { from: route.name });
    }
  }, [loading, user, navigation, route]);

  if (!isSupabaseConfigured && !user) {
    return (
      <View style={styles.missingConfigContainer}>
        <Text style={styles.title}>Configuration Missing</Text>
        <Text style={styles.description}>
          It looks like your Vercel deployment is missing the Supabase environment variables.
          Please go to your Vercel Project Settings, add <Text style={styles.boldText}>VITE_SUPABASE_URL</Text> and <Text style={styles.boldText}>VITE_SUPABASE_ANON_KEY</Text>, and then <Text style={styles.boldText}>Redeploy</Text>.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  if (!user) return null;

  return children;
}

const styles = StyleSheet.create({
  missingConfigContainer: {
    padding: 32,
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: '#5c7066',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    color: '#5c7066',
    fontWeight: '700',
    fontSize: 14,
  },
});