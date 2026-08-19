import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform, Animated } from 'react-native';
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useMyPosts } from "@/hooks/useMyPosts";
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from "@/context/LanguageContext";

export default function Activity() {
  const navigation = useNavigation<any>();
  const { profile } = useAuth();
  const { userStats } = useTransactions();
  const { posts, removePost } = useMyPosts();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  // Gauge needle animated rotation
  const scoreVal = profile?.trustScore ? Number(profile.trustScore) * 19 : 92;
  const needleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(needleAnim, {
      toValue: scoreVal,
      duration: 1200,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [scoreVal]);

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="person-circle-outline" size={64} color="#9CA3AF" />
        <Text style={styles.loadingText}>{t('pleaseLogInProfile')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Auth" as never)} style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>{t('logInOrSignUp')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = async (id: string, name: string) => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' && window.confirm ? window.confirm(`Are you sure you want to delete "${name}"?`) : true;
      if (confirmed) {
        await removePost(id);
        if (typeof window !== 'undefined' && window.alert) window.alert("Listing deleted successfully!");
      }
    } else {
      Alert.alert(
        "Delete Listing",
        `Are you sure you want to delete "${name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await removePost(id);
              Alert.alert("Success", "Listing deleted successfully!");
            },
          },
        ]
      );
    }
  };

  const needleRotate = needleAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['-90deg', '90deg'],
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Details Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileAvatarBox}>
          <Ionicons name="person" size={30} color="#15803D" />
        </View>
        <View style={styles.profileDetailsCol}>
          <Text style={styles.profileNameText}>{profile.name}</Text>
          {profile.email && <Text style={styles.profileDetailText}>✉️ {profile.email}</Text>}
          {profile.phone && <Text style={styles.profileDetailText}>📞 {profile.phone}</Text>}
          <Text style={styles.profileRoleText}>⭐ Trust Rating: {profile.trustScore || "5.0"}</Text>
        </View>
      </View>

      {/* Main Analytics Dashboard Hero Gauge (Matching Reference Images 1, 3 & 4) */}
      <View style={styles.gaugeCard}>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>● Excellent Impact</Text>
        </View>

        {/* Semi-Circle Arc Gauge */}
        <View style={styles.gaugeWrapper}>
          <View style={styles.arcSegmentRed} />
          <View style={styles.arcSegmentOrange} />
          <View style={styles.arcSegmentYellow} />
          <View style={styles.arcSegmentGreen} />

          {/* Animated Needle */}
          <Animated.View style={[styles.needlePivot, { transform: [{ rotate: needleRotate }] }]}>
            <View style={styles.needlePointer} />
          </Animated.View>

          <View style={styles.gaugeCenterCircle}>
            <Text style={styles.scoreNumber}>{scoreVal}</Text>
            <Text style={styles.scoreLabel}>Zero-Waste Score</Text>
          </View>
        </View>
      </View>

      {/* Metric Cards Row (4 Stat Cards - Matching Reference Image 1) */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="restaurant" size={20} color="#EF4444" />
          </View>
          <Text style={styles.metricVal}>{(userStats.postsMade * 3.5 + 12.4).toFixed(1)} kg</Text>
          <Text style={styles.metricLabel}>Food Saved</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
          </View>
          <Text style={styles.metricVal}>{userStats.pickupSuccess || 98}%</Text>
          <Text style={styles.metricLabel}>Claim Success</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#F0F9FF' }]}>
            <Ionicons name="cloud-done" size={20} color="#0284C7" />
          </View>
          <Text style={styles.metricVal}>{(userStats.postsMade * 1.8 + 8.2).toFixed(1)} kg</Text>
          <Text style={styles.metricLabel}>CO2 Prevented</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="star" size={20} color="#D97706" />
          </View>
          <Text style={styles.metricVal}>⭐ {profile.trustScore || "5.0"}</Text>
          <Text style={styles.metricLabel}>Trust Index</Text>
        </View>
      </View>

      {/* Recommendation Banner (Matching Images 1 & 3) */}
      <View style={styles.recommendationBanner}>
        <Ionicons name="information-circle" size={22} color="#D97706" />
        <View style={{ flex: 1 }}>
          <Text style={styles.recommendationTitle}>Recommendation</Text>
          <Text style={styles.recommendationText}>
            Food rescue efficiency is optimal! You prevented {(userStats.postsMade * 1.8 + 8.2).toFixed(1)}kg of CO2 greenhouse gas emissions this month.
          </Text>
        </View>
      </View>

      {/* Analytics Activity Trends Bar Chart Card (Matching Image 3) */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Ionicons name="stats-chart" size={20} color="#16A34A" />
          <Text style={styles.chartTitle}>Weekly Impact Analytics</Text>
        </View>
        
        <View style={styles.barsContainer}>
          {[
            { day: 'Mon', val: 40, active: false },
            { day: 'Tue', val: 65, active: false },
            { day: 'Wed', val: 85, active: true },
            { day: 'Thu', val: 50, active: false },
            { day: 'Fri', val: 95, active: true },
            { day: 'Sat', val: 70, active: false },
            { day: 'Sun', val: 30, active: false },
          ].map((bar, idx) => (
            <View key={idx} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${bar.val}%` }, bar.active && styles.barFillActive]} />
              </View>
              <Text style={[styles.barDayText, bar.active && styles.barDayTextActive]}>{bar.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* My Donations Section */}
      <View style={styles.listingsSection}>
        <View style={styles.listingsHeader}>
          <Text style={styles.listingsTitle}>{t('myDonations')}</Text>
          <Text style={styles.listingsCount}>{posts.length} {t('totalSuffix')}</Text>
        </View>

        {posts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 32 }}>📤</Text>
            <Text style={styles.emptyText}>{t('noPostsYet')}</Text>
          </View>
        ) : (
          <View style={styles.listingsList}>
            {posts.map((food) => (
              <TouchableOpacity
                key={food.id}
                onPress={() => navigation.navigate("FoodDetail" as never, { id: food.id } as never)}
                style={styles.postCard}
              >
                {food.image ? (
                  <Image source={{ uri: food.image }} style={styles.postImage} />
                ) : (
                  <View style={[styles.postImage, styles.noImageThumb]}>
                    <Text style={styles.noImageThumbText}>
                      {food.category === "Veg" ? "🥗" : food.category === "Non-Veg" ? "🍗" : food.category === "Bakery" ? "🥐" : food.category === "Fried" ? "🍟" : food.category === "Sweets" ? "🍰" : "🍲"}
                    </Text>
                  </View>
                )}
                <View style={styles.postInfo}>
                  <Text style={styles.postName}>{food.name}</Text>
                  <Text style={styles.postSub}>
                    {food.feeds - (food.bookedPortions || 0)} / {food.feeds} {t('remainingLabel')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(food.id, food.name)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  profileAvatarBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  profileDetailsCol: {
    flex: 1,
    gap: 3,
  },
  profileNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    flexWrap: 'wrap',
  },
  profileDetailText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  profileRoleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
    marginTop: 2,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  greetingSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  gaugeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  gaugeWrapper: {
    width: 240,
    height: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  arcSegmentRed: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 20,
    borderColor: '#EF4444',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arcSegmentOrange: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 20,
    borderColor: '#F97316',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  arcSegmentYellow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 20,
    borderColor: '#F59E0B',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
  },
  arcSegmentGreen: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 20,
    borderColor: '#16A34A',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  needlePivot: {
    position: 'absolute',
    bottom: 10,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needlePointer: {
    width: 6,
    height: 70,
    backgroundColor: '#0F172A',
    borderRadius: 3,
    position: 'absolute',
    top: 0,
  },
  gaugeCenterCircle: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  recommendationBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    borderWidth: 1,
    padding: 16,
    borderRadius: 18,
  },
  recommendationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 2,
  },
  recommendationText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#94A3B8',
    borderRadius: 7,
  },
  barFillActive: {
    backgroundColor: '#16A34A',
  },
  barDayText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  barDayTextActive: {
    color: '#16A34A',
    fontWeight: '800',
  },
  listingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  listingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  listingsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
  listingsList: {
    gap: 10,
  },
  postCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  postImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  noImageThumb: {
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageThumbText: {
    fontSize: 22,
  },
  postInfo: {
    flex: 1,
  },
  postName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  postSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
  },
});
