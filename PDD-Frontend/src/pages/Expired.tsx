import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform } from 'react-native';
import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAllFoods, useMyPosts } from "@/hooks/useMyPosts";
import { useAuth } from "@/hooks/useAuth";
import { Category, FoodItem } from "@/types/food";
import { getFoodTimes } from "@/lib/utils";
import Chip from "@/components/Chip";
import { Ionicons } from '@expo/vector-icons';

const categories: Category[] = ["Veg", "Non-Veg", "Bakery", "Fried", "Sweets"];

function GraceCountdown({ secondaryExpiry }: { secondaryExpiry: number }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = secondaryExpiry - now;
      if (diff <= 0) {
        setTimeLeft("Gone");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (num: number) => num.toString().padStart(2, "0");
      setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [secondaryExpiry]);

  return (
    <Text style={styles.graceText}>
      ⏳ Gone in {timeLeft}
    </Text>
  );
}

function ExpiredFoodCard({ food }: { food: FoodItem }) {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { posts, removePost } = useMyPosts();
  const isDonor = user?.id === food.provider.id || posts.some((p) => p.id === food.id);
  const { secondaryExpiry } = getFoodTimes(food);
  const isReserved = food.status === "reserved";
  const isCollected = food.status === "collected";

  const total = food.feeds;
  const booked = food.bookedPortions || 0;
  const remaining = Math.max(0, total - booked);
  const isFullyBooked = remaining <= 0;

  let statusText = food.status as string;
  let statusBg = "#16A34A";

  if (isCollected) {
    statusText = "collected";
    statusBg = "#9CA3AF";
  } else if (isReserved || isFullyBooked) {
    statusText = isFullyBooked ? "booked" : "reserved";
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

  return (
    <View style={styles.card}>
      {food.image ? (
        <TouchableOpacity 
          onPress={() => navigation.navigate("FoodDetail" as never, { id: food.id } as never)} 
          style={styles.imageContainer}
        >
          <Image source={{ uri: food.image }} style={styles.image} />
          <View style={[styles.badge, { backgroundColor: statusBg }]}>
            <Text style={styles.badgeText}>{statusText}</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={styles.body}>
        {!food.image && (
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
            <View style={[styles.badge, { backgroundColor: statusBg, position: 'relative', top: 0, left: 0 }]}>
              <Text style={styles.badgeText}>{statusText}</Text>
            </View>
          </View>
        )}
        <View style={styles.titleRow}>
          <View style={styles.titleCol}>
            <Text style={styles.title}>{food.name}</Text>
            <Text style={styles.infoText}>👥 Feeds {total} people · {remaining} remaining</Text>
          </View>
          <Text style={styles.priceText}>{food.price === 0 ? "FREE" : `₹${food.price}`}</Text>
        </View>

        <View style={styles.tagsRow}>
          <View style={styles.graceBadge}>
            <GraceCountdown secondaryExpiry={secondaryExpiry} />
          </View>
        </View>

        <Text style={styles.addressText} numberOfLines={2}>📍 {food.address}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate("FoodDetail" as never, { id: food.id } as never)}
            style={[styles.btnPrimary, isCollected && styles.btnCollected]}
          >
            <Text style={styles.btnPrimaryText}>{isCollected ? "Collected" : "Claim Expired Food"}</Text>
          </TouchableOpacity>
          {isDonor && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export default function Expired() {
  const navigation = useNavigation<any>();
  const { foods: dbFoods, loading, refresh } = useAllFoods();
  const [activeCats, setActiveCats] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCat = (c: Category) =>
    setActiveCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const list = useMemo(() => {
    let arr = [...dbFoods];
    const now = Date.now();

    arr = arr.filter((f) => {
      const { primaryExpiry, secondaryExpiry } = getFoodTimes(f);
      return (now >= primaryExpiry || f.status === "expired") && now < secondaryExpiry;
    });

    if (activeCats.length) {
      arr = arr.filter((f) => activeCats.includes(f.category));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      arr = arr.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.address.toLowerCase().includes(query) ||
          f.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return arr;
  }, [activeCats, searchQuery, dbFoods]);

  return (
    <ScrollView style={styles.pageContainer} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Home" as never)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageTitle}>Expired Outlet</Text>
            <Text style={styles.pageSubtitle}>Requestable for 3 more hours</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => refresh()} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={18} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="time" size={20} color="#D97706" />
        <Text style={styles.infoBannerText}>
          💡 Sustainability Spotlight: These items remain requestable for pets, composting, or quick consumption for another 3 hours.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          placeholder="Search expired items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {categories.map((c) => (
          <Chip key={c} label={c} active={activeCats.includes(c)} onClick={() => toggleCat(c)} />
        ))}
      </ScrollView>

      {/* Food Listings */}
      {loading ? (
        <Text style={styles.loadingText}>Loading expired items...</Text>
      ) : (
        <View style={styles.listContainer}>
          {list.map((f) => (
            <ExpiredFoodCard key={f.id} food={f} />
          ))}
          {list.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={{ fontSize: 40 }}>🎉</Text>
              <Text style={styles.emptyTitle}>Zero Food Expired!</Text>
              <Text style={styles.emptySubtitle}>All food listings were saved before they reached expiration.</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoBanner: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  chipScroll: {
    flexDirection: 'row',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 32,
  },
  listContainer: {
    gap: 16,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  body: {
    padding: 14,
    gap: 10,
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
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D97706',
  },
  tagsRow: {
    flexDirection: 'row',
  },
  graceBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  graceText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  addressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#D97706',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnCollected: {
    backgroundColor: '#9CA3AF',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageBannerExpired: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  noImageEmojiExpired: {
    fontSize: 42,
  },
  noImageCategoryTextExpired: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
});
