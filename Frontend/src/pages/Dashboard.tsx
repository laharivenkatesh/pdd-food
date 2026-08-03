import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Dashboard() {
  const navigation = useNavigation<any>();
  const { user, profile, logout, refreshProfile } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleRefresh = async () => {
    setBusy(true);
    await refreshProfile();
    setBusy(false);
    toast.success("Profile reloaded from database!");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of this session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.navigate("Auth");
          },
        },
      ]
    );
  };

  if (!user || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading secure session profile...</Text>
      </View>
    );
  }

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backLink}>
          <Ionicons name="arrow-back" size={16} color="#309267" />
          <Text style={styles.backLinkText}>Back to Foods Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRefresh} disabled={busy} style={styles.iconBtn}>
          <Ionicons name="refresh" size={18} color="#5c7066" />
        </TouchableOpacity>
      </View>

      {/* Main Profile Showcase Card */}
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>🧑</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>Community Member</Text>
            </View>
            {profile.phone && <Text style={styles.metaText}>📍 {profile.phone}</Text>}
            {profile.created_at && <Text style={styles.metaText}>📅 Reg: {formatDate(profile.created_at)}</Text>}
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={16} color="#ffffff" />
          <Text style={styles.logoutBtnText}>Secure Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sharing Streak</Text>
            <Text style={styles.statValue}>🔥 {profile.streak} Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Trust Score</Text>
            <Text style={styles.statValue}>⭐ {profile.trustScore} / 5</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Browse Available Food</Text>
          <Ionicons name="chevron-forward" size={16} color="#5c7066" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Post")} style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Create Leftover Food Post</Text>
          <Ionicons name="chevron-forward" size={16} color="#5c7066" />
        </TouchableOpacity>
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
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#5c7066',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#309267',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  card: {
    backgroundColor: '#064e3b',
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(6, 78, 59, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  badgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: '#309267',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  metaText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e382b',
  },
});

