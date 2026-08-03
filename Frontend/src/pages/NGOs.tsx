import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Linking } from 'react-native';
import React, { useEffect, useState, useMemo } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import { openInGoogleMaps } from "@/components/MapPreview";
import Chip from "@/components/Chip";
import { useNavigation } from "@react-navigation/native";

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

type FilterType = "All" | "Humans" | "Animals";

export default function NGOs() {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<FilterType>("All");

  const nearbyNGOs = useMemo(() => {
    let list = ngosList;
    if (filter !== "All") {
      list = list.filter((ngo) => ngo.types.includes(filter));
    }
    return list;
  }, [filter]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby NGOs</Text>
        <Text style={styles.subtitle}>Donate directly to verified organizations within 50 km.</Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {(["All", "Humans", "Animals"] as FilterType[]).map((f) => (
          <Chip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </View>

      <View style={styles.list}>
        {nearbyNGOs.map((ngo) => (
          <View key={ngo.id} style={styles.ngoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.ngoName}>{ngo.name}</Text>
                {ngo.description && <Text style={styles.ngoDesc}>{ngo.description}</Text>}
              </View>
            </View>

            <View style={styles.typesRow}>
              {ngo.types.map((t) => (
                <Chip key={t} label={t} active={false} onClick={() => {}} />
              ))}
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#5c7066" />
              <Text style={styles.addressText}>{ngo.address}</Text>
            </View>

            <TouchableOpacity onPress={() => Linking.openURL(`tel:${ngo.phone}`)} style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color="#309267" />
              <Text style={styles.phoneText}>{ngo.phone}</Text>
            </TouchableOpacity>

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => openInGoogleMaps(ngo.lat, ngo.lng)}
                style={styles.directionsBtn}
              >
                <Feather name="navigation" size={14} color="#1e382b" />
                <Text style={styles.directionsBtnText}>Directions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Post")}
                style={styles.donateBtn}
              >
                <Ionicons name="heart-outline" size={14} color="#ffffff" />
                <Text style={styles.donateBtnText}>Donate Food</Text>
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
    backgroundColor: '#f6f4ec',
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e382b',
  },
  subtitle: {
    fontSize: 14,
    color: '#5c7066',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  list: {
    gap: 12,
  },
  ngoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e6df',
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flex: 1,
  },
  ngoName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  ngoDesc: {
    fontSize: 12,
    color: '#5c7066',
    marginTop: 2,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    fontSize: 13,
    color: '#5c7066',
    flex: 1,
  },
  phoneText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#309267',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  directionsBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f6f4ec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  directionsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e382b',
  },
  donateBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#309267',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  donateBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
});