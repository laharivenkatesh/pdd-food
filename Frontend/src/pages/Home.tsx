import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Linking } from 'react-native';
import { useEffect, useMemo, useState, useCallback } from "react";
import FoodCard from "@/components/FoodCard";
import Chip from "@/components/Chip";
import { useAllFoods } from "@/hooks/useMyPosts";
import { useTransactions } from "@/hooks/useTransactions";
import { openInGoogleMaps } from "@/components/MapPreview";
import { useNavigation } from "@react-navigation/native";
import { getFoodTimes } from "@/lib/utils";
import { Ionicons } from '@expo/vector-icons';

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

function NGOCard({ ngo, distance, onDonate }: { key?: React.Key; ngo: NGO; distance: number | null; onDonate: () => void }) {
  return (
    <View style={styles.ngoCard}>
      <View style={styles.ngoCardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.ngoCardTitle}>{ngo.name}</Text>
          {ngo.description && <Text style={styles.ngoCardDesc}>{ngo.description}</Text>}
        </View>
        {distance !== null && (
          <View style={styles.distBadge}>
            <Text style={styles.distText}>{distance.toFixed(1)} km</Text>
          </View>
        )}
      </View>

      <Text style={styles.ngoAddress}>📍 {ngo.address}</Text>

      <TouchableOpacity onPress={() => Linking.openURL(`tel:${ngo.phone}`)}>
        <Text style={styles.ngoPhone}>📞 {ngo.phone}</Text>
      </TouchableOpacity>

      <View style={styles.ngoBtnRow}>
        <TouchableOpacity onPress={() => openInGoogleMaps(ngo.lat, ngo.lng)} style={styles.btnNav}>
          <Ionicons name="navigate-outline" size={14} color="#1F2937" />
          <Text style={styles.btnNavText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDonate} style={styles.btnDonate}>
          <Ionicons name="heart" size={14} color="#FFFFFF" />
          <Text style={styles.btnDonateText}>Donate Food</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Home() {
  const { foods: dbFoods, loading, refresh } = useAllFoods();
  const { userStats } = useTransactions();
  const navigation = useNavigation<any>();

  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [showNGOs, setShowNGOs] = useState(true);
  const [ngoFilter, setNgoFilter] = useState<"All" | "Humans" | "Animals">("All");

  const list = useMemo(() => {
    let arr = [...dbFoods];
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
    let filtered = ngosList;
    if (ngoFilter !== "All") filtered = filtered.filter((n) => n.types.includes(ngoFilter));
    
    if (userLoc) {
      return filtered
        .map((n) => ({ ...n, distance: calculateDistance(userLoc.lat, userLoc.lng, n.lat, n.lng) }))
        .filter((n) => n.distance <= 50)
        .sort((a, b) => a.distance - b.distance);
    }
    return filtered.map((n) => ({ ...n, distance: null }));
  }, [userLoc, ngoFilter]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Available Food</Text>
          <Text style={styles.subtitle}>Rescue meals near you, today.</Text>
        </View>
        <TouchableOpacity onPress={() => refresh()} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={18} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statsLeft}>
          <Ionicons name="flame" size={24} color="#EF4444" />
          <View>
            <Text style={styles.statsTitle}>
              {userStats.postsMade > 0 ? `${userStats.postsMade} Posts Made` : "Start Sharing Food"}
            </Text>
            <Text style={styles.statsSubtitle}>Keep saving food!</Text>
          </View>
        </View>
        <Ionicons name="trophy" size={24} color="#16A34A" />
      </View>

      {/* Food Listings */}
      {loading ? (
        <Text style={styles.loadingText}>Loading available food...</Text>
      ) : (
        <View style={styles.listContainer}>
          {list.map((f) => <FoodCard key={f.id} food={f} />)}
          {list.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 40 }}>🍱</Text>
              <Text style={styles.emptyTitle}>No food listings found</Text>
              <Text style={styles.emptySubtitle}>Check back soon for fresh listings!</Text>
            </View>
          )}
        </View>
      )}

      {/* NGO Section */}
      <View style={styles.ngoSection}>
        <TouchableOpacity onPress={() => setShowNGOs(!showNGOs)} style={styles.ngoHeader}>
          <View style={styles.ngoHeaderLeft}>
            <Ionicons name="heart" size={20} color="#16A34A" />
            <Text style={styles.ngoHeaderTitle}>Nearby NGOs</Text>
            <View style={styles.ngoCountBadge}>
              <Text style={styles.ngoCountText}>{nearbyNGOs.length}</Text>
            </View>
          </View>
          <Ionicons name={showNGOs ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
        </TouchableOpacity>

        {showNGOs && (
          <View style={styles.ngoBody}>
            <View style={styles.chipRow}>
              {(["All", "Humans", "Animals"] as const).map((f) => (
                <Chip key={f} label={f} active={ngoFilter === f} onClick={() => setNgoFilter(f)} />
              ))}
            </View>

            <View style={styles.ngoList}>
              {nearbyNGOs.map((ngo) => (
                <NGOCard
                  key={ngo.id}
                  ngo={ngo}
                  distance={ngo.distance}
                  onDonate={() => navigation.navigate("PostFood" as never)}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
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
  statsBanner: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  statsSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 32,
  },
  listContainer: {
    gap: 16,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  ngoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  ngoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  ngoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ngoHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  ngoCountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ngoCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  ngoBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ngoList: {
    gap: 12,
  },
  ngoCard: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  ngoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ngoCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  ngoCardDesc: {
    fontSize: 11,
    color: '#6B7280',
  },
  distBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  distText: {
    fontSize: 11,
    color: '#4B5563',
  },
  ngoAddress: {
    fontSize: 12,
    color: '#4B5563',
  },
  ngoPhone: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  ngoBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  btnNav: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  btnNavText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  btnDonate: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  btnDonateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});