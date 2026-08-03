import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { FoodItem } from "@/types/food";
import MapPreview, { openInGoogleMaps } from "./MapPreview";
import LiveCountdown from "./LiveCountdown";
import { useAuth } from "@/hooks/useAuth";
import { useMyPosts } from "@/hooks/useMyPosts";
import { toast } from "sonner";

const purposeIcon = (p: string) => (p === "humans" ? "🧑 Humans" : p === "animals" ? "🐾 Animals" : "♻️ Both");

export default function FoodCard({ food }: { food: FoodItem }) {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { posts, removePost } = useMyPosts();
  const isDonor = user?.id === food.provider.id || posts.some((p) => p.id === food.id);
  const isUrgent = food.expiryHours < 1;
  const isReserved = food.status === "reserved";
  const isCollected = food.status === "collected";

  const total = food.feeds;
  const booked = food.bookedPortions || 0;
  const remaining = Math.max(0, total - booked);
  const isFullyBooked = remaining <= 0;

  let statusText = food.status as string;
  let statusBadgeStyle = styles.badgeSuccess;

  if (isCollected) {
    statusText = "collected";
    statusBadgeStyle = styles.badgeMuted;
  } else if (isReserved || isFullyBooked) {
    statusText = isFullyBooked ? "booked" : "reserved";
    statusBadgeStyle = isFullyBooked ? styles.badgeDestructive : styles.badgeWarning;
  } else {
    statusText = "available";
    statusBadgeStyle = styles.badgeSuccess;
  }

  const handleDelete = () => {
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
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate("FoodDetail", { id: food.id })}
        activeOpacity={0.9}
        style={styles.imageContainer}
      >
        <Image
          source={{ uri: food.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.badgePill, statusBadgeStyle, styles.statusBadgePosition]}>
          <Text style={styles.badgeText}>{statusText}</Text>
        </View>
        {food.purpose === "animals" && (
          <View style={[styles.badgePill, styles.badgeSecondary, styles.animalBadgePosition]}>
            <Text style={styles.badgeSecondaryText}>🐾 Animal Priority</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.navigate("FoodDetail", { id: food.id })}
          activeOpacity={0.8}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.foodName} numberOfLines={1}>{food.name}</Text>
              <View style={styles.feedsRow}>
                <View style={styles.inlineIcon}>
                  <Ionicons name="people-outline" size={14} color="#5c7066" />
                  <Text style={styles.feedsText}> Feeds {total} people</Text>
                </View>
                <Text style={styles.remainingText}>📊 {remaining} / {total} portions left</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View
                  style={[styles.progressBarFill, { width: `${(remaining / total) * 100}%` }]}
                />
              </View>
            </View>

            <View style={styles.priceContainer}>
              {food.price === 0 ? (
                <View style={[styles.badgePill, styles.badgeSuccess]}>
                  <Text style={styles.badgeText}>FREE</Text>
                </View>
              ) : (
                <Text style={styles.priceText}>₹{food.price}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.badgesRow}>
          <View style={[styles.badgePill, isUrgent ? styles.badgeUrgent : styles.badgeMuted]}>
            <LiveCountdown postedAt={food.postedAt} expiryHours={food.expiryHours} urgent={isUrgent} />
          </View>
          <View style={[styles.badgePill, styles.badgeAccent]}>
            <Text style={styles.badgeAccentText}>{purposeIcon(food.purpose)}</Text>
          </View>
          {food.safeForAnimals ? (
            <View style={[styles.badgePill, styles.badgePrimary]}>
              <Text style={styles.badgePrimaryText}>✔ Safe for animals</Text>
            </View>
          ) : (
            <View style={[styles.badgePill, styles.badgeMuted]}>
              <Text style={styles.badgeMutedText}>⚠️ Not for animals</Text>
            </View>
          )}
        </View>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color="#5c7066" />
          <Text style={styles.addressText} numberOfLines={2}>{food.address}</Text>
        </View>

        <MapPreview lat={food.lat} lng={food.lng} label={food.name} />

        <TouchableOpacity
          onPress={() => openInGoogleMaps(food.lat, food.lng)}
          style={styles.mapsBtn}
          activeOpacity={0.7}
        >
          <Feather name="navigation" size={16} color="#1e382b" />
          <Text style={styles.mapsBtnText}>Open in Maps</Text>
        </TouchableOpacity>

        <View style={styles.tagsRow}>
          {food.tags.map((t) => (
            <View key={t} style={styles.tagChip}>
              <Text style={styles.tagChipText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={styles.trustScore}>{food.trustScore}</Text>
            <Text style={styles.dotSeparator}>·</Text>
            <Text style={[
              styles.confidenceText,
              food.confidence === "High" ? styles.textSuccess : food.confidence === "Medium" ? styles.textWarning : styles.textDestructive
            ]}>
              {food.confidence}
            </Text>
          </View>

          {food.provider.reliability === "low" && (
            <View style={styles.lowReliabilityContainer}>
              <Ionicons name="warning-outline" size={12} color="#dc2626" />
              <Text style={styles.lowReliabilityText}>Low reliability</Text>
            </View>
          )}
        </View>

        {isReserved && (
          <View style={styles.reservedAlert}>
            <Text style={styles.reservedAlertText}>⚠️ Already Reserved</Text>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate("FoodDetail", { id: food.id })}
            style={[styles.detailsBtn, isCollected && styles.collectedBtn]}
            activeOpacity={0.8}
          >
            <Text style={[styles.detailsBtnText, isCollected && styles.collectedBtnText]}>
              {isCollected ? "Collected" : "View Details"}
            </Text>
          </TouchableOpacity>

          {isDonor && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteBtn}
              activeOpacity={0.7}
            >
              <Feather name="trash-2" size={18} color="#dc2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e6df',
    marginVertical: 6,
  },
  imageContainer: {
    position: 'relative',
    height: 176,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadgePosition: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  animalBadgePosition: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#ffffff',
  },
  badgeSuccess: {
    backgroundColor: '#309267',
  },
  badgeWarning: {
    backgroundColor: '#f59e0b',
  },
  badgeDestructive: {
    backgroundColor: '#dc2626',
  },
  badgeMuted: {
    backgroundColor: 'rgba(92, 112, 102, 0.3)',
  },
  badgeMutedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5c7066',
  },
  badgeSecondary: {
    backgroundColor: '#fde68a',
  },
  badgeSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350f',
  },
  badgeAccent: {
    backgroundColor: '#fde68a',
  },
  badgeAccentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350f',
  },
  badgePrimary: {
    backgroundColor: '#bbf7d0',
  },
  badgePrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#14532d',
  },
  badgeUrgent: {
    backgroundColor: '#f97316',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerLeft: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e382b',
  },
  feedsRow: {
    gap: 4,
    marginTop: 4,
  },
  inlineIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c7066',
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#309267',
  },
  progressBarBg: {
    width: '100%',
    backgroundColor: '#f6f4ec',
    height: 6,
    borderRadius: 9999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e6df',
    marginTop: 6,
  },
  progressBarFill: {
    backgroundColor: '#309267',
    height: '100%',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e382b',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  addressText: {
    fontSize: 14,
    color: '#5c7066',
    flex: 1,
  },
  mapsBtn: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f6f4ec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e382b',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#f6f4ec',
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5c7066',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#e8e6df',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e382b',
  },
  dotSeparator: {
    color: '#5c7066',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSuccess: {
    color: '#309267',
  },
  textWarning: {
    color: '#f59e0b',
  },
  textDestructive: {
    color: '#dc2626',
  },
  lowReliabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lowReliabilityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#dc2626',
  },
  reservedAlert: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  reservedAlertText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350f',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#309267',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  collectedBtn: {
    backgroundColor: '#f6f4ec',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  collectedBtnText: {
    color: '#5c7066',
  },
  deleteBtn: {
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});