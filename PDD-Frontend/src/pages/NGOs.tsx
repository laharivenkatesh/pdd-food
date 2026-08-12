import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Linking, useWindowDimensions } from 'react-native';
import { useEffect, useState, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { openInGoogleMaps } from "@/components/MapPreview";
import Chip from "@/components/Chip";
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from "@/context/LanguageContext";
import { translateNGOName } from "@/i18n/translations";

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
  { id: "c5", name: "Reach India", address: "T. Nagar, Chennai", lat: 13.0418, lng: 80.2341, phone: "9841234567", types: ["Humans"], description: "Community outreach for humans" },
  { id: "c6", name: "Exnora International", address: "Nungambakkam, Chennai", lat: 13.0582, lng: 80.2427, phone: "9380123456", types: ["Humans"], description: "Waste reduction and food redistribution" },
  { id: "b1", name: "Helping Hands Foundation", address: "Koramangala, Bangalore", lat: 12.9279, lng: 77.6271, phone: "9876543210", types: ["Humans"] },
  { id: "b2", name: "Paws Rescue", address: "Indiranagar, Bangalore", lat: 12.9784, lng: 77.6408, phone: "9876543211", types: ["Animals"] },
  { id: "b3", name: "City Food Bank", address: "Jayanagar, Bangalore", lat: 12.9299, lng: 77.5826, phone: "9876543212", types: ["Humans"] },
  { id: "d1", name: "Delhi Animal Shelter", address: "Hauz Khas, New Delhi", lat: 28.5494, lng: 77.2001, phone: "9876543214", types: ["Animals"] },
  { id: "d2", name: "Roti Bank Delhi", address: "Connaught Place, New Delhi", lat: 28.6315, lng: 77.2167, phone: "9810012345", types: ["Humans"], description: "Free meals for the homeless" },
  { id: "m1", name: "The Robin Hood Army", address: "Bandra, Mumbai", lat: 19.0596, lng: 72.8295, phone: "9820012345", types: ["Humans"], description: "Zero-waste food rescue network" },
  { id: "m2", name: "Welfare of Stray Dogs", address: "Matunga, Mumbai", lat: 19.0210, lng: 72.8447, phone: "9820023456", types: ["Animals"] },
  { id: "k1", name: "Hope Foundation Kolkata", address: "Salt Lake, Kolkata", lat: 22.5866, lng: 88.4063, phone: "9876543213", types: ["Humans"] },
  { id: "h1", name: "Sarv Seva Samithi", address: "Secunderabad, Hyderabad", lat: 17.4401, lng: 78.4985, phone: "9848012345", types: ["Humans"] },
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

type FilterType = "All" | "Humans" | "Animals";

export default function NGOs() {
  const [filter, setFilter] = useState<FilterType>("All");
  const navigation = useNavigation<any>();
  const { t, language } = useLanguage();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const nearbyNGOs = useMemo(() => {
    let list = ngosList;
    if (filter !== "All") {
      list = list.filter((ngo) => ngo.types.includes(filter));
    }
    return list;
  }, [filter]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('ngoTitle')}</Text>
        <Text style={styles.subtitle}>{t('ngoSubtitle')}</Text>
      </View>

      <View style={styles.filterRow}>
        {(["All", "Humans", "Animals"] as FilterType[]).map((f) => (
          <Chip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </View>

      <View style={[styles.listContainer, isDesktop && styles.desktopGrid]}>
        {nearbyNGOs.map((ngo) => (
          <View key={ngo.id} style={[styles.card, isDesktop && styles.desktopCard]}>
            <Text style={styles.ngoName}>{translateNGOName(ngo.name, language)}</Text>
            {ngo.description && <Text style={styles.ngoDesc}>{ngo.description}</Text>}
            <Text style={styles.address}>📍 {ngo.address}</Text>

            <TouchableOpacity onPress={() => Linking.openURL(`tel:${ngo.phone}`)}>
              <Text style={styles.phoneText}>📞 {ngo.phone}</Text>
            </TouchableOpacity>

            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => openInGoogleMaps(ngo.lat, ngo.lng)} style={styles.btnNav}>
                <Ionicons name="navigate" size={16} color="#1F2937" />
                <Text style={styles.btnNavText}>{t('directionsBtn')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("PostFood" as never)} style={styles.btnDonate}>
                <Ionicons name="heart" size={16} color="#FFFFFF" />
                <Text style={styles.btnDonateText}>{t('donateFoodBtn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  listContainer: {
    gap: 12,
  },
  desktopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  desktopCard: {
    width: '48.5%',
  },
  ngoName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  ngoDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  address: {
    fontSize: 13,
    color: '#4B5563',
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  btnNav: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  btnNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  btnDonate: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  btnDonateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});