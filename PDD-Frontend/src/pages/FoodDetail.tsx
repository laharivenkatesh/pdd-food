import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform } from 'react-native';
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
  const { transactions, requestFood } = useTransactions();
  const { foods, loading: foodsLoading } = useAllFoods();
  const { posts, removePost } = useMyPosts();

  const food = foods.find((f) => f.id === id);
  const [selectedPortions, setSelectedPortions] = useState(1);
  const [bookingBusy, setBookingBusy] = useState(false);

  const isDonor = food && (user?.id === food.provider.id || posts.some((p) => p.id === food.id));
  const foodTxs = food ? transactions.filter(t => t.food_id === food.id && t.status !== "cancelled") : [];
  const myTx = user ? foodTxs.find(t => t.collector_id === user.id) : undefined;
  const isCollector = !!myTx;

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

  return (
    <ScrollView style={styles.container}>
      {/* Image & Header */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: food.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80" }}
          style={styles.image}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        {isDonor && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

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
            <Text style={styles.portionsVal}>{booked} / {total} Claimed</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${(booked / total) * 100}%` }]} />
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
            <Text style={{ fontSize: 32 }}>{food.provider.avatar || "🧑"}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.providerName}>{food.provider.name}</Text>
              <Text style={styles.providerSub}>⭐ {food.provider.trustScore} Trust Score</Text>
            </View>
          </View>
        </View>

        {food.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Notes from provider</Text>
            <Text style={styles.notesText}>{food.notes}</Text>
          </View>
        )}

        {/* Booking Section */}
        {!isDonor && !isCollected && !isFullyBooked && (
          <View style={styles.bookingBox}>
            <Text style={styles.bookingTitle}>Book Portions ({remaining} available)</Text>
            <TouchableOpacity onPress={handleBookPortions} disabled={bookingBusy} style={styles.bookBtn}>
              <Text style={styles.bookBtnText}>{bookingBusy ? "Booking..." : "🍽️ Book Portions"}</Text>
            </TouchableOpacity>
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
});