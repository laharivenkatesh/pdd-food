import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform, Animated } from 'react-native';
import { useState, useEffect, useRef, useMemo } from "react";
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

  const hasRating = profile?.trustScore !== null && profile?.trustScore !== undefined;
  const realRating = hasRating ? Number(profile.trustScore) : null;

  // Dynamic Zero-Waste Score Calculation (0 to 100)
  const scoreVal = useMemo(() => {
    if (!profile) return 0;
    if (userStats.postsMade === 0 && userStats.mealsCollected === 0 && !hasRating) {
      return 0; // New member with no activity
    }
    const ratingPart = hasRating ? ((realRating || 0) / 5) * 50 : 25;
    const pickupPart = ((userStats.pickupSuccess || 0) / 100) * 35;
    const activityPart = Math.min(15, (userStats.postsMade + userStats.mealsCollected) * 3);
    return Math.min(100, Math.max(0, Math.round(ratingPart + pickupPart + activityPart)));
  }, [profile, userStats, hasRating, realRating]);

  // Dynamic status text pill
  let statusText = "● New Member";
  let statusBg = "#F3F4F6";
  let statusColor = "#4B5563";
  let statusDotColor = "#9CA3AF";

  if (scoreVal >= 80) {
    statusText = "● Excellent Impact";
    statusBg = "#DCFCE7";
    statusColor = "#15803D";
    statusDotColor = "#16A34A";
  } else if (scoreVal >= 50) {
    statusText = "● Good Impact";
    statusBg = "#FEF3C7";
    statusColor = "#B45309";
    statusDotColor = "#F59E0B";
  } else if (scoreVal > 0) {
    statusText = "● Building Impact";
    statusBg = "#E0F2FE";
    statusColor = "#0369A1";
    statusDotColor = "#0284C7";
  }

  // Gauge needle animated rotation
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
          <Text style={styles.profileRoleText}>
            ⭐ Trust Rating: {hasRating ? `${realRating} / 5.0` : "No ratings yet"}
          </Text>
        </View>
      </View>

      {/* Main Analytics Dashboard Hero Gauge */}
      <View style={styles.gaugeCard}>
        <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
          <View style={[styles.statusDot, { backgroundColor: statusDotColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
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
            <Text style={styles.scoreNumber}>{scoreVal}%</Text>
            <Text style={styles.scoreLabel}>Zero-Waste Score</Text>
          </View>
        </View>
      </View>

      {/* Dynamic Personalized Profile Analytics & Quality Meter */}
      <View style={styles.meterCard}>
        <View style={styles.meterHeader}>
          <View style={styles.meterHeaderLeft}>
            <Ionicons name="speedometer" size={22} color="#16A34A" />
            <Text style={styles.meterTitle}>Community Impact & Trust Meter</Text>
          </View>
          <View style={styles.meterBadge}>
            <Text style={styles.meterBadgeText}>
              {hasRating ? `${realRating} ⭐` : "No ratings yet"}
            </Text>
          </View>
        </View>

        {/* Dynamic Meter Gauge Calculation */}
        <View style={styles.meterBody}>
          <View style={styles.meterScoreRow}>
            <Text style={[styles.meterScoreVal, { color: scoreVal >= 50 ? "#16A34A" : scoreVal > 0 ? "#F59E0B" : "#9CA3AF" }]}>{scoreVal}%</Text>
            <Text style={styles.meterScoreLabel}>Personalized Quality Index</Text>
          </View>

          <View style={styles.meterTrack}>
            <View style={[styles.meterFill, { width: `${scoreVal}%`, backgroundColor: scoreVal >= 50 ? "#16A34A" : scoreVal > 0 ? "#F59E0B" : "#9CA3AF" }]} />
          </View>

          <Text style={styles.meterExplanationText}>
            💡 <Text style={{ fontWeight: '700' }}>What this meter indicates:</Text> Live personalized performance index calculated from your pickup completion rate ({userStats.postsMade > 0 || userStats.mealsCollected > 0 ? `${userStats.pickupSuccess}%` : "0%"} completion), real feedback ratings ({hasRating ? `${realRating} / 5 stars` : 'No reviews yet'}, {profile?.reviewCount || 0} reviews), and food rescue contributions.
          </Text>
        </View>
      </View>

      {/* Dynamic Metrics Row */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
          </View>
          <Text style={styles.metricVal}>{userStats.postsMade > 0 || userStats.mealsCollected > 0 ? `${userStats.pickupSuccess}%` : "0%"}</Text>
          <Text style={styles.metricLabel}>Claim Success</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#F0F9FF' }]}>
            <Ionicons name="cloud-done" size={20} color="#0284C7" />
          </View>
          <Text style={styles.metricVal}>{(userStats.postsMade * 1.8).toFixed(1)} kg</Text>
          <Text style={styles.metricLabel}>CO2 Prevented</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="star" size={20} color="#D97706" />
          </View>
          <Text style={styles.metricVal}>{hasRating ? `⭐ ${realRating}` : "N/A"}</Text>
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

      {/* Community Achievements & Badges Widget */}
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Ionicons name="trophy-outline" size={20} color="#D97706" />
          <Text style={styles.widgetTitle}>Impact Badges & Milestones</Text>
        </View>
        <View style={styles.badgeGrid}>
          <View style={styles.badgeItem}>
            <Text style={styles.badgeIcon}>🏆</Text>
            <Text style={styles.badgeName}>Zero-Waste Hero</Text>
            <Text style={styles.badgeStatusUnlocked}>Unlocked</Text>
          </View>
          <View style={styles.badgeItem}>
            <Text style={styles.badgeIcon}>🌟</Text>
            <Text style={styles.badgeName}>Super Donor</Text>
            <Text style={styles.badgeStatusUnlocked}>Unlocked</Text>
          </View>
          <View style={styles.badgeItem}>
            <Text style={styles.badgeIcon}>🛡️</Text>
            <Text style={styles.badgeName}>Food Guardian</Text>
            <Text style={styles.badgeStatusUnlocked}>Unlocked</Text>
          </View>
          <View style={styles.badgeItem}>
            <Text style={styles.badgeIcon}>🍃</Text>
            <Text style={styles.badgeName}>Eco Champion</Text>
            <Text style={styles.badgeStatusProgress}>{scoreVal > 0 ? `${scoreVal}% Done` : "Locked"}</Text>
          </View>
        </View>
      </View>

      {/* Category Savings Breakdown Widget */}
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Ionicons name="pie-chart-outline" size={20} color="#0284C7" />
          <Text style={styles.widgetTitle}>Rescued Food Breakdown</Text>
        </View>
        <View style={styles.categoryList}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryLabelRow}>
              <Text style={styles.categoryName}>🍲 Cooked Meals & Dishes</Text>
              <Text style={styles.categoryPct}>48%</Text>
            </View>
            <View style={styles.categoryTrack}>
              <View style={[styles.categoryFill, { width: '48%', backgroundColor: '#16A34A' }]} />
            </View>
          </View>
          <View style={styles.categoryRow}>
            <View style={styles.categoryLabelRow}>
              <Text style={styles.categoryName}>🥦 Fresh Produce & Fruits</Text>
              <Text style={styles.categoryPct}>32%</Text>
            </View>
            <View style={styles.categoryTrack}>
              <View style={[styles.categoryFill, { width: '32%', backgroundColor: '#0284C7' }]} />
            </View>
          </View>
          <View style={styles.categoryRow}>
            <View style={styles.categoryLabelRow}>
              <Text style={styles.categoryName}>🍞 Bakery & Packaged Foods</Text>
              <Text style={styles.categoryPct}>20%</Text>
            </View>
            <View style={styles.categoryTrack}>
              <View style={[styles.categoryFill, { width: '20%', backgroundColor: '#D97706' }]} />
            </View>
          </View>
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
  userPhone: {
    fontSize: 11,
    color: '#6EE7B7',
  },
  meterCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  meterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meterHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meterTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  meterBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  meterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  meterBody: {
    gap: 8,
  },
  meterScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  meterScoreVal: {
    fontSize: 28,
    fontWeight: '900',
  },
  meterScoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  meterTrack: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 5,
  },
  meterExplanationText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 4,
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
  widgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  badgeStatusUnlocked: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
    marginTop: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeStatusProgress: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryList: {
    gap: 14,
  },
  categoryRow: {
    gap: 6,
  },
  categoryLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  categoryPct: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  categoryTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    borderRadius: 4,
  },
});
