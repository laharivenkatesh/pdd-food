import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useMyPosts } from "@/hooks/useMyPosts";
import { toast } from "sonner";

export default function Activity() {
  const navigation = useNavigation<any>();
  const { profile } = useAuth();
  const { userStats } = useTransactions();
  const { posts, removePost } = useMyPosts();

  if (!profile) {
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
      <Text style={styles.headerTitle}>Profile</Text>

      {/* Main Profile Banner */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarBox}>
            <Ionicons name="leaf" size={28} color="#6ee7b7" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileSub}>Community Member • ⭐ {profile.trustScore}</Text>
            {profile.phone && <Text style={styles.profileMeta}>📍 {profile.phone}</Text>}
            {profile.created_at && <Text style={styles.profileMeta}>📅 Reg: {formatDate(profile.created_at)}</Text>}
          </View>
        </View>

        <View style={styles.streakBox}>
          <Text style={styles.streakText}>🔥 {profile.streak} Day Streak</Text>
          <Text style={styles.streakSub}>Keep it going!</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.mealsCollected}</Text>
          <Text style={styles.statLabel}>Meals Collected</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.animalsFed}</Text>
          <Text style={styles.statLabel}>Animals Fed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.postsMade}</Text>
          <Text style={styles.statLabel}>Posts Made</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.pickupSuccess}%</Text>
          <Text style={styles.statLabel}>Pickup Success</Text>
        </View>
      </View>

      {/* My Listings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{posts.length} Total</Text>
          </View>
        </View>

        {posts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📤</Text>
            <Text style={styles.emptyText}>You haven't posted any food yet.</Text>
          </View>
        ) : (
          <View style={styles.postsList}>
            {posts.map((food) => {
              const remaining = food.feeds - (food.bookedPortions || 0);

              return (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => navigation.navigate("FoodDetail", { id: food.id })}
                  style={styles.foodRow}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: food.image }} style={styles.foodThumb} />
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodTitle}>{food.name}</Text>
                    <Text style={styles.foodSub}>{remaining} / {food.feeds} left</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Delete Listing",
                        `Are you sure you want to delete "${food.name}"?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: async () => {
                              await removePost(food.id);
                              toast.success("Listing deleted successfully!");
                            },
                          },
                        ]
                      );
                    }}
                    style={styles.deleteBtn}
                  >
                    <Feather name="trash-2" size={16} color="#dc2626" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgesRow}>
          {userStats.badges.length > 0 ? (
            userStats.badges.map((b) => (
              <View key={b.text} style={styles.badgePill}>
                <Text style={styles.badgeText}>{b.icon} {b.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Complete transactions to earn badges!</Text>
          )}
        </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e382b',
  },
  profileCard: {
    backgroundColor: '#064e3b',
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 78, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(110, 231, 183, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileSub: {
    fontSize: 12,
    color: '#6ee7b7',
    fontWeight: '600',
  },
  profileMeta: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  streakBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fbbf24',
  },
  streakSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6ee7b7',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e8e6df',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#309267',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c7066',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(48, 146, 103, 0.1)',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#309267',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderStyle: 'dashed',
    gap: 6,
  },
  emptyIcon: {
    fontSize: 24,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5c7066',
  },
  postsList: {
    gap: 8,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
    gap: 12,
  },
  foodThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  foodInfo: {
    flex: 1,
  },
  foodTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e382b',
  },
  foodSub: {
    fontSize: 11,
    color: '#5c7066',
  },
  deleteBtn: {
    padding: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgePill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e382b',
  },
});

