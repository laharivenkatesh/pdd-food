import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform, useWindowDimensions, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { FoodItem } from "@/types/food";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import MapPreview, { openInGoogleMaps } from "./MapPreview";
import LiveCountdown from "./LiveCountdown";
import { useAuth } from "@/hooks/useAuth";
import { useMyPosts } from "@/hooks/useMyPosts";
import { useLanguage } from "@/context/LanguageContext";
import { translateFoodName } from "@/i18n/translations";

const getCategoryStyle = (category: string) => {
  switch (category) {
    case "Veg":
      return { bg: "#F0FDF4", border: "#DCFCE7", text: "#15803D", emoji: "🥗" };
    case "Non-Veg":
      return { bg: "#FEF2F2", border: "#FEE2E2", text: "#B91C1C", emoji: "🍗" };
    case "Bakery":
      return { bg: "#FFFBEB", border: "#FEF3C7", text: "#B45309", emoji: "🥐" };
    case "Fried":
      return { bg: "#FFF7ED", border: "#FFEDD5", text: "#C2410C", emoji: "🍟" };
    case "Sweets":
      return { bg: "#FDF2F8", border: "#FCE7F3", text: "#BE185D", emoji: "🍰" };
    default:
      return { bg: "#F0FDF4", border: "#DCFCE7", text: "#15803D", emoji: "🍲" };
  }
};

export default function FoodCard({ food }: { key?: React.Key; food: FoodItem }) {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { posts, removePost } = useMyPosts();
  const { t, language } = useLanguage();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(22)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  const isDonor = user?.id === food.provider.id || posts.some((p) => p.id === food.id);
  const isUrgent = food.expiryHours < 1;
  const isReserved = food.status === "reserved";
  const isCollected = food.status === "collected";

  const total = food.feeds;
  const booked = food.bookedPortions || 0;
  const remaining = Math.max(0, total - booked);
  const isFullyBooked = remaining <= 0;

  let statusText = t('availableBadge');
  let statusBg = "#16A34A";
  let statusTextColor = "#FFFFFF";

  if (isCollected) {
    statusText = t('collectedBadge');
    statusBg = "#9CA3AF";
  } else if (isReserved || isFullyBooked) {
    statusText = isFullyBooked ? t('bookedBadge') : t('bookedBadge');
    statusBg = isFullyBooked ? "#EF4444" : "#F59E0B";
  }

  const handleDelete = async () => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' && window.confirm ? window.confirm(`Are you sure you want to delete "${food.name}"?`) : true;
      if (confirmed) {
        await removePost(food.id);
        if (typeof window !== 'undefined' && window.alert) window.alert("Listing deleted successfully!");
      }
    } else {
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
              Alert.alert("Success", "Listing deleted successfully!");
            },
          },
        ]
      );
    }
  };

  const catStyle = getCategoryStyle(food.category);
  const translatedCategory = food.category === "Veg" ? t('veg') : food.category === "Non-Veg" ? t('nonVeg') : food.category === "Bakery" ? t('bakery') : food.category === "Fried" ? t('fried') : food.category === "Sweets" ? t('sweets') : food.category;
  const purposeLabel = food.purpose === "humans" ? "🧑 " + t('humansAudience') : food.purpose === "animals" ? "🐾 " + t('animalsAudience') : "♻️ " + t('bothAudience');
  const translatedTitle = translateFoodName(food.name, language);

  return (
    <Animated.View
      style={[
        styles.card,
        isDonor && styles.selfPostedCard,
        isDesktop && styles.desktopCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      {food.image ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("FoodDetail" as never, { id: food.id } as never)}
          style={styles.imageContainer}
        >
          <Image source={{ uri: food.image }} style={styles.image} />
          <View style={[styles.badge, { backgroundColor: statusBg }]}>
            <Text style={[styles.badgeText, { color: statusTextColor }]}>{statusText}</Text>
          </View>

          {isDonor && (
            <View style={styles.selfPostedBadge}>
              <Text style={styles.selfPostedBadgeText}>{t('postedByYou')}</Text>
            </View>
          )}

          {food.purpose === "animals" && (
            <View style={[styles.badge, styles.animalBadge, isDonor && { top: 40 }]}>
              <Text style={styles.animalBadgeText}>{t('animalPriority')}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : null}

      <View style={styles.body}>
        {!food.image && (
          <View style={styles.inlineBadgesRow}>
            <View style={[styles.inlineBadge, { backgroundColor: statusBg }]}>
              <Text style={[styles.badgeText, { color: statusTextColor }]}>{statusText}</Text>
            </View>
            <View style={[styles.inlineBadge, { backgroundColor: catStyle.bg, borderColor: catStyle.border, borderWidth: 1 }]}>
              <Text style={[styles.badgeText, { color: catStyle.text }]}>{catStyle.emoji} {translatedCategory}</Text>
            </View>
            {isDonor && (
              <View style={styles.inlineSelfBadge}>
                <Text style={styles.selfPostedBadgeText}>{t('postedByYou')}</Text>
              </View>
            )}
            {food.purpose === "animals" && (
              <View style={styles.inlineAnimalBadge}>
                <Text style={styles.animalBadgeText}>{t('animalPriority')}</Text>
              </View>
            )}
          </View>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("FoodDetail" as never, { id: food.id } as never)}
        >
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{translatedTitle}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>👥 {t('feedsPeople', { count: total })}</Text>
                <Text style={styles.remainingText}>📊 {t('portionsLeft', { remaining, total })}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: `${(remaining / total) * 100}%` }]} />
              </View>
            </View>
            <View>
              {food.price === 0 ? (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>{t('free')}</Text>
                </View>
              ) : (
                <Text style={styles.priceText}>₹{food.price}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.tagsRow}>
          <View style={styles.countdownBadge}>
            <LiveCountdown postedAt={food.postedAt} expiryHours={food.expiryHours} urgent={isUrgent} />
          </View>
          <View style={styles.pillAccent}>
            <Text style={styles.pillText}>{purposeLabel}</Text>
          </View>
          <View style={styles.pillMuted}>
            <Text style={styles.pillText}>
              {food.safeForAnimals ? t('safeForAnimalsTag') : t('notForAnimalsTag')}
            </Text>
          </View>
        </View>

        <Text style={styles.addressText} numberOfLines={2}>
          📍 {food.address}
        </Text>

        <MapPreview lat={food.lat} lng={food.lng} label={food.name} />

        <TouchableOpacity onPress={() => openInGoogleMaps(food.lat, food.lng)} style={styles.mapsBtn}>
          <Ionicons name="navigate-outline" size={16} color="#1F2937" />
          <Text style={styles.mapsBtnText}>{t('openInMaps')}</Text>
        </TouchableOpacity>

        <View style={styles.chipRow}>
          {food.tags.map((t) => (
            <View key={t} style={styles.chipItem}>
              <Text style={styles.chipText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.trustRow}>
          <View style={styles.trustScore}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.trustScoreText}>{food.trustScore}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.confidenceText}>{food.confidence}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {!isDonor && !isCollected && ((food.feeds || 1) - (food.bookedPortions || 0) > 0) ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("FoodDetail" as never, { id: food.id } as never)}
              style={styles.btnBook}
            >
              <Text style={styles.btnBookText}>{t('reservePortion')} 🍽️</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => navigation.navigate("FoodDetail" as never, { id: food.id } as never)}
            style={[styles.btnPrimary, isCollected && styles.btnCollected]}
          >
            <Text style={styles.btnPrimaryText}>{isCollected ? t('collectedBadge') : t('viewDetails')}</Text>
          </TouchableOpacity>
          {isDonor && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selfPostedCard: {
    borderColor: '#86EFAC',
    borderWidth: 1.5,
    backgroundColor: '#F0FDF4',
  },
  desktopCard: {
    width: '48.5%',
  },
  selfPostedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  selfPostedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  imageContainer: {
    height: 176,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  animalBadge: {
    left: 12,
    right: undefined,
    backgroundColor: '#E0E7FF',
  },
  animalBadgeText: {
    color: '#3730A3',
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: 16,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  infoRow: {
    marginTop: 4,
    gap: 2,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16A34A',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#16A34A',
  },
  freeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freeText: {
    color: '#15803D',
    fontWeight: '800',
    fontSize: 12,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  countdownBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillAccent: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillMuted: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 12,
    color: '#4B5563',
  },
  addressText: {
    fontSize: 13,
    color: '#6B7280',
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  mapsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chipItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    color: '#4B5563',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  trustScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustScoreText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#111827',
  },
  dot: {
    color: '#9CA3AF',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnBook: {
    flex: 1.2,
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnBookText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnCollected: {
    backgroundColor: '#9CA3AF',
  },
  btnPrimaryText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 14,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  inlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  inlineSelfBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  inlineAnimalBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
});