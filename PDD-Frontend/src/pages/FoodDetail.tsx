import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform, Linking } from 'react-native';
import { useState, useEffect, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAllFoods, useMyPosts } from "@/hooks/useMyPosts";
import MapPreview, { openInGoogleMaps } from "@/components/MapPreview";
import ReviewSection from "@/components/ReviewSection";
import LiveCountdown from "@/components/LiveCountdown";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { supabase } from "@/lib/supabase";
import { getFoodTimes } from "@/lib/utils";
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from "@/context/LanguageContext";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
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
  const { transactions, requestFood, markDonated } = useTransactions();
  const { foods, loading: foodsLoading } = useAllFoods();
  const { posts, removePost } = useMyPosts();

  const food = foods.find((f) => f.id === id);
  const [selectedPortions, setSelectedPortions] = useState(1);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [collectorProfiles, setCollectorProfiles] = useState<Record<string, any>>({});

  const isDonor = food && (user?.id === food.provider.id || posts.some((p) => p.id === food.id));
  const foodTxs = food ? transactions.filter(t => t.food_id === food.id && t.status !== "cancelled") : [];
  const myTx = user ? foodTxs.find(t => t.collector_id === user.id) : undefined;
  const isCollector = !!myTx;

  useEffect(() => {
    const fetchCollectorProfiles = async () => {
      if (foodTxs.length > 0) {
        const collectorIds = Array.from(new Set(foodTxs.map(t => t.collector_id)));
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .in("id", collectorIds);
        if (data) {
          const map: Record<string, any> = {};
          data.forEach(p => { map[p.id] = p; });
          setCollectorProfiles(map);
        }
      }
    };
    fetchCollectorProfiles();
  }, [foodTxs.length]);

  const { primaryExpiry } = food ? getFoodTimes(food) : { primaryExpiry: 0 };
  const now = Date.now();
  const isExpired = food ? now >= primaryExpiry : false;

  if (foodsLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading food details...</Text>
      </View>
    );
  }

  if (!food) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Food not found.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home" as never)}>
          <Text style={styles.linkText}>Go back Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCollected = food.status === "collected";
  const total = food.feeds;
  const booked = food.bookedPortions || 0;
  const remaining = Math.max(0, total - booked);
  const isFullyBooked = remaining <= 0;

  const handleBookPortions = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to book food");
      navigation.navigate("Auth" as never);
      return;
    }
    setBookingBusy(true);

    try {
      await requestFood(food.id, food.provider.id, selectedPortions);
      Alert.alert("Success", `Booked ${selectedPortions} portions successfully!`);
    } catch (e: any) {
      Alert.alert("Booking Failed", e.message || "Failed to book portions");
    } finally {
      setBookingBusy(false);
    }
  };

  const handleDelete = async () => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' && window.confirm ? window.confirm("Are you sure you want to delete this listing?") : true;
      if (confirmed) {
        await removePost(food.id);
        if (typeof window !== 'undefined' && window.alert) window.alert("Listing deleted successfully!");
        navigation.navigate("Home" as never);
      }
    } else {
      Alert.alert(
        "Delete Listing",
        "Are you sure you want to delete this listing?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await removePost(food.id);
              Alert.alert("Success", "Listing deleted successfully!");
              navigation.navigate("Home" as never);
            },
          },
        ]
      );
    }
  };

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

  const catStyle = getCategoryStyle(food.category);
  const { t } = useLanguage();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      {food.image && typeof food.image === 'string' && food.image.trim() !== '' && (food.image.startsWith("http://") || food.image.startsWith("https://") || food.image.startsWith("data:")) ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: food.image }} style={styles.image} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>
          {isDonor && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.noImageTopBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarBackBtn}>
            <Ionicons name="arrow-back" size={20} color="#111827" />
            <Text style={styles.topBarBackText}>{t('backToFeed')}</Text>
          </TouchableOpacity>
          {isDonor && (
            <TouchableOpacity onPress={handleDelete} style={styles.topBarDeleteBtn}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text style={styles.topBarDeleteText}>{t('delete')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleCol}>
            <Text style={styles.title}>{food.name}</Text>
            <Text style={styles.subtitle}>Quantity: {food.quantity} · Prepared: {food.preparedAt}</Text>
          </View>
          <Text style={styles.price}>{food.price === 0 ? "FREE" : `₹${food.price}`}</Text>
        </View>

        {/* Portions Bar */}
        <View style={styles.portionsCard}>
          <View style={styles.portionsHeader}>
            <Text style={styles.portionsLabel}>Portions Booked</Text>
            <Text style={[styles.portionsVal, isFullyBooked && { color: "#EF4444" }]}>
              {booked} / {total} Claimed {isFullyBooked ? "🔴 Fully Booked" : ""}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${Math.min(100, (booked / total) * 100)}%`, backgroundColor: isFullyBooked ? "#EF4444" : "#16A34A" }]} />
          </View>
        </View>

        {/* Countdown */}
        <View style={styles.countdownBox}>
          <LiveCountdown postedAt={food.postedAt} expiryHours={food.expiryHours} urgent={isExpired} />
        </View>

        {/* Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Address</Text>
          <Text style={styles.addressText}>{food.address}</Text>
          <MapPreview lat={food.lat} lng={food.lng} label={food.name} height={180} interactive />
          <TouchableOpacity onPress={() => openInGoogleMaps(food.lat, food.lng)} style={styles.mapsBtn}>
            <Ionicons name="navigate-outline" size={16} color="#1F2937" />
            <Text style={styles.mapsBtnText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Provider */}
        <View style={styles.providerCard}>
          <View style={styles.providerRow}>
            {food.provider.avatar && typeof food.provider.avatar === 'string' && (food.provider.avatar.startsWith("http://") || food.provider.avatar.startsWith("https://")) ? (
              <Image source={{ uri: food.provider.avatar }} style={styles.providerAvatarImage} />
            ) : (
              <View style={styles.providerAvatarBadge}>
                <Ionicons name="person" size={20} color="#15803D" />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.providerName}>{food.provider.name}</Text>
              {food.provider.trustScore !== null && food.provider.trustScore !== undefined ? (
                <Text style={styles.providerSub}>
                  ⭐ {food.provider.trustScore} · {food.provider.reviewCount} {food.provider.reviewCount === 1 ? "review" : "reviews"}
                </Text>
              ) : (
                <Text style={styles.providerSub}>No ratings yet</Text>
              )}
            </View>
          </View>
        </View>

        {food.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Notes from provider</Text>
            <Text style={styles.notesText}>{food.notes}</Text>
          </View>
        )}

        {/* Fully Booked Banner for Collectors */}
        {!isDonor && !isCollected && isFullyBooked && (
          <View style={styles.fullyBookedCard}>
            <Ionicons name="lock-closed" size={28} color="#EF4444" />
            <View style={{ flex: 1 }}>
              <Text style={styles.fullyBookedTitle}>Fully Booked / All Portions Claimed</Text>
              <Text style={styles.fullyBookedSub}>All portions of this food listing have already been booked by community members.</Text>
            </View>
          </View>
        )}

        {/* Booking Section for Collectors */}
        {!isDonor && !isCollected && !isFullyBooked && (
          <View style={styles.bookingBox}>
            <Text style={styles.bookingTitle}>Choose Portions ({remaining} remaining)</Text>

            <View style={styles.portionChipsRow}>
              <TouchableOpacity
                onPress={() => setSelectedPortions(1)}
                style={[styles.portionChip, selectedPortions === 1 && styles.portionChipActive]}
              >
                <Text style={[styles.portionChipText, selectedPortions === 1 && styles.portionChipTextActive]}>1 Portion</Text>
              </TouchableOpacity>

              {remaining >= 2 && (
                <TouchableOpacity
                  onPress={() => setSelectedPortions(Math.ceil(remaining / 2))}
                  style={[styles.portionChip, selectedPortions === Math.ceil(remaining / 2) && selectedPortions !== 1 && styles.portionChipActive]}
                >
                  <Text style={[styles.portionChipText, selectedPortions === Math.ceil(remaining / 2) && selectedPortions !== 1 && styles.portionChipTextActive]}>
                    Half ({Math.ceil(remaining / 2)})
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setSelectedPortions(remaining)}
                style={[styles.portionChip, selectedPortions === remaining && selectedPortions !== 1 && styles.portionChipActive]}
              >
                <Text style={[styles.portionChipText, selectedPortions === remaining && selectedPortions !== 1 && styles.portionChipTextActive]}>
                  Full ({remaining})
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.counterRow}>
              <TouchableOpacity
                onPress={() => setSelectedPortions(prev => Math.max(1, prev - 1))}
                style={styles.counterBtn}
              >
                <Ionicons name="remove" size={18} color="#16A34A" />
              </TouchableOpacity>

              <Text style={styles.counterVal}>{selectedPortions} Portion{selectedPortions > 1 ? 's' : ''}</Text>

              <TouchableOpacity
                onPress={() => setSelectedPortions(prev => Math.min(remaining, prev + 1))}
                style={styles.counterBtn}
              >
                <Ionicons name="add" size={18} color="#16A34A" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleBookPortions} disabled={bookingBusy} style={styles.bookBtn}>
              <Text style={styles.bookBtnText}>
                {bookingBusy ? "Booking..." : `🍽️ Book ${selectedPortions} Portion${selectedPortions > 1 ? 's' : ''}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Donor View: Booked Collectors Details */}
        {isDonor && (
          <View style={styles.donorTxsCard}>
            <View style={styles.donorTxsHeader}>
              <Ionicons name="people" size={20} color="#16A34A" />
              <Text style={styles.donorTxsTitle}>Booked Collectors ({foodTxs.length})</Text>
            </View>

            {foodTxs.length === 0 ? (
              <Text style={styles.emptyTxsText}>No collector has claimed this food post yet.</Text>
            ) : (
              foodTxs.map((t) => {
                const cProfile = collectorProfiles[t.collector_id];
                const cName = cProfile?.name || "Community Member";
                const cPhone = cProfile?.phone || "";
                const cEmail = cProfile?.email || "";

                return (
                  <View key={t.id} style={styles.collectorCard}>
                    <View style={styles.collectorHeader}>
                      <View style={styles.collectorInfo}>
                        <Text style={styles.collectorName}>{cName}</Text>
                        {cPhone ? <Text style={styles.collectorSub}>📞 {cPhone}</Text> : null}
                        {cEmail ? <Text style={styles.collectorSub}>✉️ {cEmail}</Text> : null}
                      </View>
                      <View style={styles.portionBadge}>
                        <Text style={styles.portionBadgeText}>{t.portions} Portion{t.portions > 1 ? 's' : ''}</Text>
                      </View>
                    </View>

                    <View style={styles.collectorActions}>
                      {cPhone ? (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`tel:${cPhone}`)}
                          style={styles.callBtn}
                        >
                          <Ionicons name="call" size={14} color="#FFFFFF" />
                          <Text style={styles.callBtnText}>Call Collector</Text>
                        </TouchableOpacity>
                      ) : null}

                      {t.status !== "completed" && (
                        <TouchableOpacity
                          onPress={async () => {
                            await markDonated(t.id);
                            Alert.alert("Handed Over! 🎉", "Marked as completed.");
                          }}
                          style={styles.completeBtn}
                        >
                          <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                          <Text style={styles.completeBtnText}>Mark Handed Over</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        <ReviewSection foodId={food.id} providerId={food.provider.id} initial={food.reviews} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
  },
  emptyText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  linkText: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 14,
  },
  imageContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#16A34A',
  },
  portionsCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  portionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portionsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  portionsVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#16A34A',
  },
  countdownBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
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
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    marginTop: 6,
  },
  mapsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  providerAvatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  providerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  providerSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  notesBox: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 16,
    gap: 4,
  },
  notesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  notesText: {
    fontSize: 13,
    color: '#4B5563',
  },
  bookingBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 12,
    alignItems: 'center',
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  bookBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  portionChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  portionChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  portionChipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  portionChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  portionChipTextActive: {
    color: '#16A34A',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 4,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  donorTxsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  donorTxsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  donorTxsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  emptyTxsText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 12,
  },
  collectorCard: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  collectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  collectorInfo: {
    gap: 2,
  },
  collectorName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  collectorSub: {
    fontSize: 12,
    color: '#4B5563',
  },
  portionBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  portionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  collectorActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  callBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  completeBtn: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  completeBtnText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
  },
  noImageTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topBarBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  topBarBackText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  topBarDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  topBarDeleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  fullyBookedCard: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fullyBookedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
  },
  fullyBookedSub: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
  },
});