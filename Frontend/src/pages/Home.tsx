import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Linking } from 'react-native';
import { useEffect, useMemo, useState, useCallback } from "react";
import FoodCard from "@/components/FoodCard";
import Chip from "@/components/Chip";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAllFoods } from "@/hooks/useMyPosts";
import { useTransactions } from "@/hooks/useTransactions";
import { openInGoogleMaps } from "@/components/MapPreview";
import { useNavigation } from "@react-navigation/native";
import { getFoodTimes } from "@/lib/utils";

// ─── NGO data ─────────────────────────────────────────────────────────────────
interface NGO {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  types: string[];
  description?: string;
}

const ngosList: NGO[] = [
  { id: "c1", name: "Akshaya Trust", address: "Besant Nagar, Chennai", lat: 13.0005, lng: 80.2707, phone: "9444014974", types: ["Humans"], description: "Feeds thousands of Chennai's hungry daily" },
  { id: "c2", name: "Siragu Montessori School Trust", address: "Kodambakkam, Chennai", lat: 13.0514, lng: 80.2178, phone: "9382109999", types: ["Humans"], description: "Supports underprivileged children with meals" },
  { id: "c3", name: "Blue Cross of India", address: "Guindy, Chennai", lat: 13.0072, lng: 80.2209, phone: "04422354959", types: ["Animals"], description: "Animal rescue and care across Tamil Nadu" },
  { id: "c4", name: "Chennai Animal Action Group", address: "Anna Nagar, Chennai", lat: 13.0850, lng: 80.2101, phone: "9840047474", types: ["Animals"], description: "Rescues and rehabilitates street animals" },
  { id: "c5", name: "Reach India", address: "T. Nagar, Chennai", lat: 13.0418, lng: 80.2341, phone: "9841234567", types: ["Humans", "Animals"], description: "Community outreach for humans and animals" },
  { id: "c6", name: "Exnora International", address: "Nungambakkam, Chennai", lat: 13.0582, lng: 80.2427, phone: "9380123456", types: ["Humans"], description: "Waste reduction and food redistribution" },
  { id: "b1", name: "Helping Hands Foundation", address: "Koramangala, Bangalore", lat: 12.9279, lng: 77.6271, phone: "9876543210", types: ["Humans"] },
  { id: "b2", name: "Paws Rescue", address: "Indiranagar, Bangalore", lat: 12.9784, lng: 77.6408, phone: "9876543211", types: ["Animals"] },
  { id: "b3", name: "City Food Bank", address: "Jayanagar, Bangalore", lat: 12.9299, lng: 77.5826, phone: "9876543212", types: ["Humans", "Animals"] },
  { id: "d1", name: "Delhi Animal Shelter", address: "Hauz Khas, New Delhi", lat: 28.5494, lng: 77.2001, phone: "9876543214", types: ["Animals"] },
  { id: "d2", name: "Roti Bank Delhi", address: "Connaught Place, New Delhi", lat: 28.6315, lng: 77.2167, phone: "9810012345", types: ["Humans"], description: "Free meals for the homeless" },
  { id: "m1", name: "The Robin Hood Army", address: "Bandra, Mumbai", lat: 19.0596, lng: 72.8295, phone: "9820012345", types: ["Humans"], description: "Zero-waste food rescue network" },
  { id: "m2", name: "Welfare of Stray Dogs", address: "Matunga, Mumbai", lat: 19.0210, lng: 72.8447, phone: "9820023456", types: ["Animals"] },
  { id: "k1", name: "Hope Foundation Kolkata", address: "Salt Lake, Kolkata", lat: 22.5866, lng: 88.4063, phone: "9876543213", types: ["Humans"] },
  { id: "h1", name: "Sarv Seva Samithi", address: "Secunderabad, Hyderabad", lat: 17.4401, lng: 78.4985, phone: "9848012345", types: ["Humans", "Animals"] },
];

// ─── Utils ────────────────────────────────────────────────────────────────────
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

// ─── NGO Card ─────────────────────────────────────────────────────────────────
function NGOCard({ ngo, distance, onDonate }: { ngo: NGO; distance: number | null; onDonate: () => void }) {
  return (
    <View style={styles.ngoCard}>
      <View style={styles.ngoHeader}>
        <View style={styles.ngoTitleCol}>
          <Text style={styles.ngoName}>{ngo.name}</Text>
          {ngo.description && <Text style={styles.ngoDescription}>{ngo.description}</Text>}
        </View>
        {distance !== null && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{distance.toFixed(1)} km</Text>
          </View>
        )}
      </View>

      <View style={styles.ngoTypesRow}>
        {ngo.types.map((t) => (
          <View key={t} style={styles.typeChip}>
            <Text style={styles.typeChipText}>{t}</Text>
          </View>
        ))}
      </View>

      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={14} color="#5c7066" />
        <Text style={styles.addressText}>{ngo.address}</Text>
      </View>

      <TouchableOpacity
        onPress={() => Linking.openURL(`tel:${ngo.phone}`)}
        style={styles.phoneRow}
        activeOpacity={0.7}
      >
        <Ionicons name="call-outline" size={16} color="#309267" />
        <Text style={styles.phoneText}>{ngo.phone}</Text>
      </TouchableOpacity>

      <View style={styles.ngoActionsRow}>
        <TouchableOpacity
          onPress={() => openInGoogleMaps(ngo.lat, ngo.lng)}
          style={styles.directionsBtn}
          activeOpacity={0.7}
        >
          <Feather name="navigation" size={14} color="#1e382b" />
          <Text style={styles.directionsBtnText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDonate}
          style={styles.donateBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="heart-outline" size={14} color="#ffffff" />
          <Text style={styles.donateBtnText}>Donate Food</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Home ────────────────────────────────────────────────────────────────
export default function Home() {
  const { foods: dbFoods, loading, refresh } = useAllFoods();
  const { userStats } = useTransactions();
  const navigation = useNavigation<any>();

  // Location state — no localStorage, purely in-memory
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [locGranted, setLocGranted] = useState(false);

  // NGO section state
  const [showNGOs, setShowNGOs] = useState(false);
  const [ngoFilter, setNgoFilter] = useState<"All" | "Humans" | "Animals">("All");

  // Request location only when user explicitly clicks the button
  const requestLocation = useCallback(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      setLocLoading(true);
      setLocError("");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocGranted(true);
          setLocLoading(false);
        },
        (err) => {
          setLocError("Location unavailable. Showing all food.");
          setLocLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocError("Geolocation not supported on this device.");
    }
  }, []);

  const list = useMemo(() => {
    let arr = [...dbFoods];
    
    // Filter out expired items (show only active ones)
    const now = Date.now();
    arr = arr.filter((f) => {
      const { primaryExpiry } = getFoodTimes(f);
      const remainingPortions = f.feeds - (f.bookedPortions || 0);
      return now < primaryExpiry && f.status !== "collected" && remainingPortions > 0;
    });

    if (userLoc) {
      arr = arr.filter(
        (f) => f.lat && f.lng && calculateDistance(userLoc.lat, userLoc.lng, f.lat, f.lng) <= 50
      );
    }
    return arr;
  }, [dbFoods, userLoc]);

  const nearbyNGOs = useMemo(() => {
    if (!userLoc) return [];
    
    let filtered = ngosList;
    if (ngoFilter !== "All") filtered = filtered.filter((n) => n.types.includes(ngoFilter));
    
    return filtered
      .map((n) => ({ ...n, distance: calculateDistance(userLoc.lat, userLoc.lng, n.lat, n.lng) }))
      .filter((n) => n.distance <= 40)
      .sort((a, b) => a.distance - b.distance);
  }, [userLoc, ngoFilter]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headingTitle}>Available Food</Text>
          <Text style={styles.headingSubtitle}>Rescue meals near you, today.</Text>
        </View>
        <TouchableOpacity
          onPress={() => refresh()}
          disabled={loading}
          style={styles.refreshBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color="#5c7066" />
        </TouchableOpacity>
      </View>

      {/* Stats banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statsLeft}>
          <Ionicons name="flame" size={24} color="#f97316" />
          <View>
            <Text style={styles.statsTitle}>
              {userStats.postsMade > 0 ? `${userStats.postsMade} Posts Made` : "Start Sharing Food"}
            </Text>
            <Text style={styles.statsSubtitle}>Keep saving food!</Text>
          </View>
        </View>
        <Ionicons name="ribbon-outline" size={24} color="#309267" />
      </View>

      {/* Location section */}
      <View style={styles.locationSection}>
        {!locGranted && !locLoading && !locError && (
          <TouchableOpacity
            onPress={requestLocation}
            style={styles.locBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="location-outline" size={16} color="#309267" />
            <Text style={styles.locBtnText}>Use My Location (within 50 km)</Text>
          </TouchableOpacity>
        )}
        {locLoading && (
          <View style={styles.locLoadingBox}>
            <Ionicons name="location-outline" size={16} color="#5c7066" />
            <Text style={styles.locLoadingText}>Detecting your location…</Text>
          </View>
        )}
        {locGranted && userLoc && (
          <View style={styles.locActiveBox}>
            <View style={styles.locActiveRow}>
              <Ionicons name="location-outline" size={16} color="#309267" />
              <Text style={styles.locActiveText}>Showing items within 50 km</Text>
            </View>
            <TouchableOpacity onPress={() => { setUserLoc(null); setLocGranted(false); setLocError(""); }}>
              <Text style={styles.clearLocText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
        {locError !== "" && (
          <View style={styles.locErrorBox}>
            <Text style={styles.locErrorText}>{locError}</Text>
          </View>
        )}
      </View>

      {/* Food list */}
      {loading && (
        <View style={styles.foodListGap}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonLine1} />
                <View style={styles.skeletonLine2} />
              </View>
            </View>
          ))}
        </View>
      )}

      {!loading && (
        <View style={styles.foodListGap}>
          {list.map((f) => <FoodCard key={f.id} food={f} />)}
          {list.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🍱</Text>
              <Text style={styles.emptyTitle}>No food listings found</Text>
              <Text style={styles.emptySubtitle}>
                {userLoc ? "No available food within 50 km. Check back soon!" : "No items match your filters."}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* ── NGO Section (inline, collapsible) ───────────────────────────────── */}
      <View style={styles.ngoSectionContainer}>
        <TouchableOpacity
          onPress={() => setShowNGOs((v) => !v)}
          style={styles.ngoHeaderBtn}
          activeOpacity={0.8}
        >
          <View style={styles.ngoHeaderLeft}>
            <Ionicons name="heart" size={20} color="#309267" />
            <Text style={styles.ngoHeaderTitle}>Nearby NGOs</Text>
            <View style={styles.ngoCountBadge}>
              <Text style={styles.ngoCountText}>{nearbyNGOs.length}</Text>
            </View>
          </View>
          <Ionicons name={showNGOs ? "chevron-up" : "chevron-down"} size={16} color="#5c7066" />
        </TouchableOpacity>

        {showNGOs && (
          <View style={styles.ngoContent}>
            <Text style={styles.ngoSubtitle}>
              {userLoc ? "Showing NGOs within 50 km of your location." : "Enable location to see NGOs near you, or browse all below."}
            </Text>

            {/* Filter chips */}
            <View style={styles.ngoChipsRow}>
              {(["All", "Humans", "Animals"] as const).map((f) => (
                <Chip key={f} label={f} active={ngoFilter === f} onClick={() => setNgoFilter(f)} />
              ))}
            </View>

            {nearbyNGOs.length === 0 ? (
              <View style={styles.ngoEmpty}>
                <Text style={styles.emptyEmoji}>🏢</Text>
                <Text style={styles.emptyTitle}>No NGOs found nearby</Text>
                <Text style={styles.emptySubtitle}>Enable location or try a different filter.</Text>
              </View>
            ) : (
              <View style={styles.foodListGap}>
                {nearbyNGOs.map((ngo) => (
                  <NGOCard
                    key={ngo.id}
                    ngo={ngo}
                    distance={ngo.distance}
                    onDonate={() => navigation.navigate("Post")}
                  />
                ))}
              </View>
            )}
          </View>
        )}
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e382b',
  },
  headingSubtitle: {
    fontSize: 14,
    color: '#5c7066',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsBanner: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e382b',
  },
  statsSubtitle: {
    fontSize: 12,
    color: '#5c7066',
  },
  locationSection: {
    gap: 8,
  },
  locBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#309267',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  locBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#309267',
  },
  locLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(246, 244, 236, 0.5)',
  },
  locLoadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5c7066',
  },
  locActiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(48, 146, 103, 0.1)',
  },
  locActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locActiveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#309267',
  },
  clearLocText: {
    fontSize: 12,
    color: '#5c7066',
  },
  locErrorBox: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  locErrorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  foodListGap: {
    gap: 16,
  },
  skeletonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  skeletonImage: {
    height: 176,
    backgroundColor: '#f6f4ec',
  },
  skeletonContent: {
    padding: 16,
    gap: 12,
  },
  skeletonLine1: {
    height: 20,
    backgroundColor: '#f6f4ec',
    borderRadius: 8,
    width: '66%',
  },
  skeletonLine2: {
    height: 16,
    backgroundColor: '#f6f4ec',
    borderRadius: 8,
    width: '50%',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e382b',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#5c7066',
    textAlign: 'center',
  },
  ngoSectionContainer: {
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  ngoHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ngoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ngoHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  ngoCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: '#bbf7d0',
  },
  ngoCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#14532d',
  },
  ngoContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  ngoSubtitle: {
    fontSize: 12,
    color: '#5c7066',
  },
  ngoChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ngoEmpty: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  ngoCard: {
    backgroundColor: '#f6f4ec',
    padding: 16,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  ngoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  ngoTitleCol: {
    flex: 1,
  },
  ngoName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  ngoDescription: {
    fontSize: 12,
    color: '#5c7066',
    marginTop: 2,
  },
  distanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: '#e8e6df',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5c7066',
  },
  ngoTypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: '#ffffff',
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5c7066',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressText: {
    fontSize: 12,
    color: '#5c7066',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#309267',
  },
  ngoActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  directionsBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  directionsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e382b',
  },
  donateBtn: {
    flex: 2,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#309267',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  donateBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});