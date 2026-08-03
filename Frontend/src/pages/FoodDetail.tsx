import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAllFoods, useMyPosts } from "@/hooks/useMyPosts";
import MapPreview, { openInGoogleMaps } from "@/components/MapPreview";
import ReviewSection from "@/components/ReviewSection";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { RealtimeStatus } from "@/types/food";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import LiveCountdown from "@/components/LiveCountdown";
import { supabase } from "@/lib/supabase";
import { getFoodTimes } from "@/lib/utils";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function FoodDetail() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const id = route.params?.id;

  const { user, profile } = useAuth();
  const { transactions, requestFood, markCollected, markDonated } = useTransactions();

  const { foods, loading: foodsLoading } = useAllFoods();
  const { posts, removePost } = useMyPosts();
  const food = foods.find((f) => f.id === id);
  const [rt, setRt] = useState<RealtimeStatus>("Still Available");
  const [oppositeProfiles, setOppositeProfiles] = useState<Record<string, any>>({});
  const [selectedPortions, setSelectedPortions] = useState(1);
  const [bookingBusy, setBookingBusy] = useState(false);
  const prevDistancesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (food) {
      setRt(food.realtimeStatus);
    }
  }, [food]);

  const isDonor = food && (user?.id === food.provider.id || posts.some((p) => p.id === food.id));
  const foodTxs = food ? transactions.filter(t => t.food_id === food.id && t.status !== "cancelled") : [];
  const myTx = user ? foodTxs.find(t => t.collector_id === user.id) : undefined;
  const isCollector = !!myTx;

  useEffect(() => {
    const fetchOppositeProfiles = async () => {
      if (foodTxs.length > 0 && user && food) {
        const isDonorCheck = user?.id === food.provider.id;
        const profileIds = isDonorCheck 
          ? foodTxs.map(t => t.collector_id) 
          : [food.provider.id];

        if (profileIds.length > 0) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .in("id", profileIds);

          if (data) {
            const profileMap: Record<string, any> = {};
            data.forEach(p => {
              profileMap[p.id] = p;
            });
            setOppositeProfiles(profileMap);
          }
        }
      }
    };
    fetchOppositeProfiles();
  }, [id, user, food, transactions]);

  const { primaryExpiry, secondaryExpiry } = food ? getFoodTimes(food) : { primaryExpiry: 0, secondaryExpiry: 0 };
  const now = Date.now();
  const isExpired = food ? now >= primaryExpiry : false;
  const isHardExpired = food ? now >= secondaryExpiry : false;

  useEffect(() => {
    if (isHardExpired) {
      toast.error("This listing has hard-expired and is no longer available.");
      navigation.navigate("Home");
    }
  }, [isHardExpired, navigation]);

  if (foodsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading food details...</Text>
      </View>
    );
  }

  if (!food || isHardExpired) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Food not found or expired.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.goHomeText}>Go home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isReserved = food.status === "reserved" && foodTxs.length === 0;
  const isUrgent = food.expiryHours < 1;
  const isCollected = food.status === "collected";

  const total = food.feeds;
  const booked = food.bookedPortions || 0;
  const remaining = Math.max(0, total - booked);
  const isFullyBooked = remaining <= 0;

  const handleDeleteListing = () => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this food listing? This will cancel all bookings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removePost(food.id);
            toast.success("Listing deleted successfully!");
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  const renderPortionBooking = () => {
    if (isDonor) {
      let donorStatusMsg = "👑 You are the provider of this listing. Waiting for bookings...";
      if (isCollected) {
        donorStatusMsg = "👑 You are the provider of this listing. Status: Collected & Closed";
      } else if (isFullyBooked || food.status === "reserved") {
        donorStatusMsg = "👑 You are the provider of this listing. Status: Fully Booked / Reserved";
      }

      return (
        <View style={styles.bookingBox}>
          <View style={styles.donorMsgBox}>
            <Text style={styles.donorMsgText}>{donorStatusMsg}</Text>
          </View>
          <TouchableOpacity onPress={handleDeleteListing} style={styles.deleteListingBtn}>
            <Feather name="trash-2" size={16} color="#dc2626" />
            <Text style={styles.deleteListingBtnText}>Delete This Listing</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isCollected || isFullyBooked || food.status === "reserved" || isCollector) {
      return null;
    }

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingCardHeader}>
          <Text style={styles.bookingCardTitle}>Select Portions to Book</Text>
          <View style={styles.portionsBadge}>
            <Text style={styles.portionsBadgeText}>{remaining} left</Text>
          </View>
        </View>

        <View style={styles.bookingRow}>
          <View style={styles.portionCounter}>
            <TouchableOpacity
              onPress={() => setSelectedPortions(Math.max(1, selectedPortions - 1))}
              style={styles.counterBtn}
            >
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.portionCountText}>{selectedPortions}</Text>
            <TouchableOpacity
              onPress={() => setSelectedPortions(Math.min(remaining, selectedPortions + 1))}
              style={styles.counterBtn}
            >
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={async () => {
              if (!user) {
                toast.error("Please login to book food");
                navigation.navigate("Auth");
                return;
              }
              setBookingBusy(true);
              try {
                await requestFood(food.id, food.provider.id, selectedPortions);
                toast.success(`Booked ${selectedPortions} portions successfully!`);
              } catch (e: any) {
                toast.error(e.message || "Failed to book portions");
              } finally {
                setBookingBusy(false);
              }
            }}
            disabled={bookingBusy || remaining <= 0}
            style={styles.bookNowBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.bookNowBtnText}>🍽️ Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageHeader}>
        <Image source={{ uri: food.image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#1e382b" />
        </TouchableOpacity>
        {isDonor && (
          <TouchableOpacity onPress={handleDeleteListing} style={styles.headerDeleteBtn} activeOpacity={0.8}>
            <Feather name="trash-2" size={18} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <View style={styles.badgesRow}>
              <View style={[styles.badgePill, statusBadgeStyle]}>
                <Text style={styles.badgeText}>{statusText}</Text>
              </View>
              <View style={[styles.badgePill, styles.badgePrimary]}>
                <Text style={styles.badgePrimaryText}>📊 {remaining} / {total} portions left</Text>
              </View>
            </View>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.metaText}>Quantity: {food.quantity}</Text>
            <Text style={styles.metaText}>Prepared: {food.preparedAt}</Text>
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

        <View style={styles.countdownBox}>
          <LiveCountdown postedAt={food.postedAt} expiryHours={food.expiryHours} urgent={isUrgent} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Address</Text>
          <Text style={styles.addressText}>{food.address}</Text>
          <MapPreview lat={food.lat} lng={food.lng} label={food.name} height="h-48" interactive />
          <TouchableOpacity onPress={() => openInGoogleMaps(food.lat, food.lng)} style={styles.mapsBtn}>
            <Feather name="navigation" size={16} color="#1e382b" />
            <Text style={styles.mapsBtnText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <View style={styles.avatarBg}>
              <Text style={styles.avatarText}>{food.provider.avatar || "🧑"}</Text>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{food.provider.name}</Text>
              <Text style={styles.trustScoreText}>⭐ {food.provider.trustScore} Trust Score</Text>
            </View>
          </View>
        </View>

        {food.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notes from provider</Text>
            <Text style={styles.notesText}>{food.notes}</Text>
          </View>
        )}

        {renderPortionBooking()}

        <ReviewSection foodId={food.id} providerId={food.provider.id} initial={food.reviews} />
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
    paddingBottom: 24,
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
  notFoundContainer: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  notFoundText: {
    fontSize: 16,
    color: '#1e382b',
  },
  goHomeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#309267',
  },
  imageHeader: {
    position: 'relative',
    height: 256,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDeleteBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleLeft: {
    flex: 1,
    gap: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
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
  badgePrimary: {
    backgroundColor: 'rgba(48, 146, 103, 0.1)',
  },
  badgePrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#309267',
  },
  foodName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e382b',
  },
  metaText: {
    fontSize: 14,
    color: '#5c7066',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e382b',
  },
  countdownBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  addressText: {
    fontSize: 14,
    color: '#5c7066',
  },
  mapsBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e382b',
  },
  providerCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(48, 146, 103, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  trustScoreText: {
    fontSize: 12,
    color: '#5c7066',
  },
  notesCard: {
    backgroundColor: 'rgba(246, 244, 236, 0.6)',
    padding: 16,
    borderRadius: 16,
    gap: 4,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e382b',
  },
  notesText: {
    fontSize: 14,
    color: '#5c7066',
  },
  bookingBox: {
    gap: 12,
  },
  donorMsgBox: {
    backgroundColor: 'rgba(246, 244, 236, 0.5)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  donorMsgText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c7066',
    textAlign: 'center',
  },
  deleteListingBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteListingBtnText: {
    color: '#dc2626',
    fontWeight: '800',
    fontSize: 14,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
    gap: 12,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5c7066',
    textTransform: 'uppercase',
  },
  portionsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(48, 146, 103, 0.1)',
  },
  portionsBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#309267',
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  portionCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderRadius: 12,
    backgroundColor: '#f6f4ec',
  },
  counterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  counterBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  portionCountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e382b',
    paddingHorizontal: 8,
  },
  bookNowBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    backgroundColor: '#309267',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
});