import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Switch } from 'react-native';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Chip from "@/components/Chip";
import { Category, Purpose } from "@/types/food";
import { useMyPosts } from "@/hooks/useMyPosts";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import LocationPickerModal from '@/components/LocationPickerModal';
import { getReverseGeocodeAddress } from "@/lib/location";

const categories: Category[] = ["Veg", "Non-Veg", "Bakery", "Fried", "Sweets"];
const purposes: { key: Purpose; label: string }[] = [
  { key: "humans", label: "🧑 Humans" },
  { key: "animals", label: "🐾 Animals" },
  { key: "both", label: "♻️ Both" },
];

export default function PostFood() {
  const navigation = useNavigation<any>();
  const { addPost } = useMyPosts();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preparedAt, setPreparedAt] = useState("");
  const [expiryHours, setExpiryHours] = useState("");
  const [address, setAddress] = useState("");
  const [feeds, setFeeds] = useState("");
  const [category, setCategory] = useState<Category>("Veg");
  const [purpose, setPurpose] = useState<Purpose>("humans");
  const [safe, setSafe] = useState(true);
  const [paid, setPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [lat, setLat] = useState<number>(13.0827);
  const [lng, setLng] = useState<number>(80.2707);
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [busy, setBusy] = useState(false);

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Needed", "Please grant photo gallery permissions to upload food pictures.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn("Gallery pick error:", err);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Needed", "Please grant camera permissions to take food photos.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn("Camera pick error:", err);
    }
  };

  const detectLocation = async () => {
    setDetectingLoc(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location permission is required to detect your current position.");
        setDetectingLoc(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const currentLat = pos.coords.latitude;
      const currentLng = pos.coords.longitude;
      setLat(currentLat);
      setLng(currentLng);

      const formattedAddr = await getReverseGeocodeAddress(currentLat, currentLng);
      setAddress(formattedAddr);
      Alert.alert("Address Located! 📍", formattedAddr);
    } catch (err: any) {
      console.warn("Native location error:", err);
      Alert.alert("Location Error", "Could not fetch GPS coordinates. Please check your phone's GPS settings.");
    } finally {
      setDetectingLoc(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Field", "Please enter food name.");
      return;
    }
    if (!quantity.trim()) {
      Alert.alert("Missing Field", "Please enter food quantity.");
      return;
    }
    if (!feeds) {
      Alert.alert("Missing Field", "Please enter number of people it feeds.");
      return;
    }
    if (!expiryHours) {
      Alert.alert("Missing Field", "Please enter expiry hours.");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Missing Field", "Please enter or detect your address.");
      return;
    }

    setBusy(true);

    const defaultFallbackImage = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80";

    const res = await addPost({
      name: name.trim(),
      image: imageUri || defaultFallbackImage,
      feeds: Number(feeds) || 1,
      price: paid ? Number(price) || 0 : 0,
      expiry_hours: Number(expiryHours) || 4,
      prepared_at: preparedAt || new Date().toLocaleString(),
      address: address.trim(),
      lat,
      lng,
      category,
      tags: [],
      purpose,
      safe_for_animals: safe,
      status: "available",
      realtime_status: "Still Available",
      quantity: quantity.trim(),
      notes: notes.trim() || null,
      allow_split: true,
    });

    setBusy(false);
    if (!res.ok) {
      Alert.alert("Error Posting Food", res.error || "Failed to post food.");
      return;
    }
    Alert.alert("Success! 🥗", "Food post published successfully!");
    navigation.navigate("Home" as never);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Post Leftover Food</Text>

      <View style={styles.formContainer}>
        {/* Food Photo Picker */}
        <View style={styles.fieldSection}>
          <Text style={styles.sectionLabel}>Food Photo</Text>
          {imageUri ? (
            <View style={styles.imagePreviewWrapper}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity onPress={() => setImageUri(null)} style={styles.removeImageBtn}>
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageBtnRow}>
              <TouchableOpacity onPress={takePhotoWithCamera} style={styles.imageBtn}>
                <Ionicons name="camera" size={20} color="#16A34A" />
                <Text style={styles.imageBtnText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImageFromGallery} style={styles.imageBtn}>
                <Ionicons name="images" size={20} color="#16A34A" />
                <Text style={styles.imageBtnText}>Choose Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Food name (e.g. Biryani, Rotis)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity (e.g. 5 kg, 10 plates)"
          value={quantity}
          onChangeText={setQuantity}
        />
        <TextInput
          style={styles.input}
          placeholder="Feeds how many people? (e.g. 8)"
          keyboardType="numeric"
          value={feeds}
          onChangeText={setFeeds}
        />
        <TextInput
          style={styles.input}
          placeholder="When was it prepared? (e.g. 1 hour ago)"
          value={preparedAt}
          onChangeText={setPreparedAt}
        />
        <TextInput
          style={styles.input}
          placeholder="Expires in how many hours? (e.g. 4)"
          keyboardType="numeric"
          value={expiryHours}
          onChangeText={setExpiryHours}
        />

        <TextInput
          style={styles.input}
          placeholder="Pickup address"
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.locationBtnRow}>
          <TouchableOpacity onPress={detectLocation} style={styles.detectBtn}>
            <Ionicons name="navigate" size={15} color="#16A34A" />
            <Text style={styles.detectBtnText}>
              {detectingLoc ? "Detecting..." : "Auto-Detect GPS"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowMapPicker(true)} style={styles.mapPinBtn}>
            <Ionicons name="map" size={15} color="#2563EB" />
            <Text style={styles.mapPinBtnText}>Drag Pin on Map 📍</Text>
          </TouchableOpacity>
        </View>

        <LocationPickerModal
          visible={showMapPicker}
          initialLat={lat}
          initialLng={lng}
          onClose={() => setShowMapPicker(false)}
          onSelectLocation={(newLat, newLng, newAddress) => {
            setLat(newLat);
            setLng(newLng);
            setAddress(newAddress);
          }}
        />

        {/* Category */}
        <View style={styles.fieldSection}>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.chipRow}>
            {categories.map((c) => (
              <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.fieldSection}>
          <Text style={styles.sectionLabel}>Purpose</Text>
          <View style={styles.chipRow}>
            {purposes.map((p) => (
              <Chip key={p.key} label={p.label} active={purpose === p.key} onClick={() => setPurpose(p.key)} />
            ))}
          </View>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Safe for animals</Text>
          <Switch value={safe} onValueChange={setSafe} trackColor={{ true: '#16A34A' }} />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>{paid ? "Paid listing" : "Free listing"}</Text>
          <Switch value={paid} onValueChange={setPaid} trackColor={{ true: '#16A34A' }} />
        </View>

        {paid && (
          <TextInput
            style={styles.input}
            placeholder="Price in ₹ (e.g. 50)"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        )}

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Notes for collector..."
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>{busy ? "Posting…" : "Post Food 🌱"}</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  formContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fieldSection: {
    gap: 6,
    marginVertical: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  toggleRow: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  submitBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  locationBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  detectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  detectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  mapPinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  mapPinBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  imageBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  imageBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  imagePreviewWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
});