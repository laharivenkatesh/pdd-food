import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Switch, Platform } from 'react-native';
import { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Chip from "@/components/Chip";
import { Category, Purpose } from "@/types/food";
import { useMyPosts } from "@/hooks/useMyPosts";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import LocationPickerModal from '@/components/LocationPickerModal';
import { getReverseGeocodeAddress } from "@/lib/location";
import { uploadFoodImage } from "@/lib/storage";

const categories: Category[] = ["Veg", "Non-Veg", "Bakery", "Fried", "Sweets"];
const purposes: { key: Purpose; label: string }[] = [
  { key: "humans", label: "🧑 Humans" },
  { key: "animals", label: "🐾 Animals" },
  { key: "both", label: "♻️ Both" },
];

export default function PostFood() {
  const navigation = useNavigation<any>();
  const { addPost } = useMyPosts();
  const { user } = useAuth();

  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);
  const quantityInputRef = useRef<TextInput>(null);
  const feedsInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);

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
      if (typeof ImagePicker.requestMediaLibraryPermissionsAsync !== 'function' || typeof ImagePicker.launchImageLibraryAsync !== 'function') {
        Alert.alert("Feature Unavailable", "Gallery picker is not supported on this platform.");
        return;
      }
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
      if (typeof ImagePicker.requestCameraPermissionsAsync !== 'function' || typeof ImagePicker.launchCameraAsync !== 'function') {
        Alert.alert("Feature Unavailable", "Camera picker is not supported on this platform.");
        return;
      }
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
      if (typeof Location.requestForegroundPermissionsAsync !== 'function' || typeof Location.getCurrentPositionAsync !== 'function') {
        Alert.alert("GPS Unavailable", "GPS auto-detection is not available on this device.");
        setDetectingLoc(false);
        return;
      }
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

  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(`${title}\n${msg}`);
      } else {
        console.log(title, msg);
      }
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      showAlert("Login Required 🔒", "Please log in to publish a food post.");
      navigation.navigate("Auth" as never);
      return;
    }
    if (!name.trim()) {
      showAlert("Empty Field ⚠️", "Please fill in Food Name to publish your food post!");
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      setTimeout(() => nameInputRef.current?.focus(), 250);
      return;
    }
    if (!quantity.trim()) {
      showAlert("Empty Field ⚠️", "Please fill in Food Quantity to publish your food post!");
      scrollViewRef.current?.scrollTo({ y: 100, animated: true });
      setTimeout(() => quantityInputRef.current?.focus(), 250);
      return;
    }
    if (!feeds) {
      showAlert("Empty Field ⚠️", "Please fill in Feeds Count (how many people it feeds) to publish your food post!");
      scrollViewRef.current?.scrollTo({ y: 100, animated: true });
      setTimeout(() => feedsInputRef.current?.focus(), 250);
      return;
    }
    const finalExpiryHours = expiryHours || "4";
    const finalPreparedAt = preparedAt || "Freshly Prepared (Just Now)";
    if (!address.trim()) {
      showAlert("Empty Field ⚠️", "Please fill in or detect Pickup Address to publish your food post!");
      scrollViewRef.current?.scrollTo({ y: 350, animated: true });
      setTimeout(() => addressInputRef.current?.focus(), 250);
      return;
    }

    setBusy(true);

    let finalImageUrl = "";
    if (imageUri) {
      finalImageUrl = await uploadFoodImage(imageUri);
    }

    const res = await addPost({
      name: name.trim(),
      image: finalImageUrl,
      feeds: Number(feeds) || 1,
      price: paid ? Number(price) || 0 : 0,
      expiry_hours: Number(finalExpiryHours) || 4,
      prepared_at: finalPreparedAt,
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
      showAlert("Error Posting Food", res.error || "Failed to post food.");
      return;
    }
    showAlert("Success! 🥗", "Food post published successfully!");
    navigation.navigate("Home" as never);
  };

  const preparedTimeOptions = [
    "Freshly Prepared (Just Now)",
    "30 mins ago",
    "1 hour ago",
    "2 hours ago",
    "Custom",
  ];

  const expiryOptions = ["2", "4", "6", "12", "24", "Custom"];

  const [selectedPrepChip, setSelectedPrepChip] = useState("Freshly Prepared (Just Now)");
  const [selectedExpiryChip, setSelectedExpiryChip] = useState("4");

  return (
    <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.pageHeader}>
        <Text style={styles.title}>Post Leftover Food 🌱</Text>
        <Text style={styles.subtitle}>Share excess food with nearby community members and NGOs</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Section 1: Food Overview */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeader}>
            <Ionicons name="fast-food" size={18} color="#16A34A" />
            <Text style={styles.cardTitle}>Food Overview</Text>
          </View>

          <TextInput
            ref={nameInputRef}
            style={styles.input}
            placeholder="Food name (e.g. Biryani, Chapati & Curry)"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.inputRow}>
            <TextInput
              ref={quantityInputRef}
              style={[styles.input, { flex: 1 }]}
              placeholder="Quantity (e.g. 5 kg, 10 plates)"
              placeholderTextColor="#9CA3AF"
              value={quantity}
              onChangeText={setQuantity}
            />
            <TextInput
              ref={feedsInputRef}
              style={[styles.input, { flex: 1 }]}
              placeholder="Feeds count (e.g. 8)"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={feeds}
              onChangeText={setFeeds}
            />
          </View>
        </View>

        {/* Section 2: Preparation Time & Expiry */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={18} color="#16A34A" />
            <Text style={styles.cardTitle}>Preparation Time & Expiry</Text>
          </View>

          <View style={styles.fieldSubSection}>
            <Text style={styles.subLabel}>When was it prepared?</Text>
            <View style={styles.chipRow}>
              {preparedTimeOptions.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  active={selectedPrepChip === opt}
                  onClick={() => {
                    setSelectedPrepChip(opt);
                    if (opt !== "Custom") {
                      setPreparedAt(opt);
                    }
                  }}
                />
              ))}
            </View>
            {selectedPrepChip === "Custom" && (
              <TextInput
                style={[styles.input, { marginTop: 6 }]}
                placeholder="Enter custom prep time (e.g. Prepared at 8:00 AM)"
                placeholderTextColor="#9CA3AF"
                value={preparedAt}
                onChangeText={setPreparedAt}
              />
            )}
          </View>

          <View style={styles.fieldSubSection}>
            <Text style={styles.subLabel}>Expires In (Hours)</Text>
            <View style={styles.chipRow}>
              {expiryOptions.map((opt) => (
                <Chip
                  key={opt}
                  label={opt === "Custom" ? "Custom Hours" : `⏳ ${opt} Hours`}
                  active={selectedExpiryChip === opt}
                  onClick={() => {
                    setSelectedExpiryChip(opt);
                    if (opt !== "Custom") {
                      setExpiryHours(opt);
                    }
                  }}
                />
              ))}
            </View>
            {selectedExpiryChip === "Custom" && (
              <TextInput
                style={[styles.input, { marginTop: 6 }]}
                placeholder="Enter expiry hours (e.g. 5)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={expiryHours}
                onChangeText={setExpiryHours}
              />
            )}
          </View>
        </View>

        {/* Section 3: Pickup Location */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={18} color="#16A34A" />
            <Text style={styles.cardTitle}>Pickup Location</Text>
          </View>

          <TextInput
            ref={addressInputRef}
            style={styles.input}
            placeholder="Enter street, area, or landmark"
            placeholderTextColor="#9CA3AF"
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
        </View>

        {/* Section 4: Photo Attachment (Optional) */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeader}>
            <Ionicons name="camera" size={18} color="#16A34A" />
            <Text style={styles.cardTitle}>Food Photo</Text>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalBadgeText}>Optional</Text>
            </View>
          </View>
          <Text style={styles.subLabel}>
            Uploading a photo from camera or gallery is completely optional. If skipped, your post will be published without an image.
          </Text>

          {imageUri ? (
            <View style={styles.imagePreviewWrapper}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
              <TouchableOpacity onPress={() => setImageUri(null)} style={styles.removeImageBtn}>
                <Ionicons name="trash-outline" size={15} color="#DC2626" />
                <Text style={styles.removeImageBtnText}>Remove Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoContainer}>
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
              <View style={styles.optionalNoticeBox}>
                <Ionicons name="information-circle" size={16} color="#059669" />
                <Text style={styles.optionalNoticeText}>
                  Photo is optional. If skipped, no photo will be attached.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Section 5: Category & Purpose */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeader}>
            <Ionicons name="pricetags" size={18} color="#16A34A" />
            <Text style={styles.cardTitle}>Category & Purpose</Text>
          </View>

          <View style={styles.fieldSubSection}>
            <Text style={styles.subLabel}>Category</Text>
            <View style={styles.chipRow}>
              {categories.map((c) => (
                <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
              ))}
            </View>
          </View>

          <View style={styles.fieldSubSection}>
            <Text style={styles.subLabel}>Target Audience / Purpose</Text>
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
        </View>

        {/* Section 6: Notes & Confirm */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeader}>
            <Ionicons name="create-outline" size={18} color="#16A34A" />
            <Text style={styles.cardTitle}>Notes for Collector</Text>
          </View>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Mention pickup instructions or packaging details..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity onPress={handleSubmit} disabled={busy} style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>{busy ? "Uploading & Posting…" : "Publish Food Post 🌱"}</Text>
        </TouchableOpacity>
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
  pageHeader: {
    gap: 4,
    marginBottom: 4,
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
  formContainer: {
    gap: 16,
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldSubSection: {
    gap: 6,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#111827',
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
    borderRadius: 14,
    overflow: 'hidden',
    height: 200,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  removeImageBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  optionalBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 6,
  },
  optionalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    textTransform: 'uppercase',
  },
  photoContainer: {
    gap: 10,
  },
  optionalNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  optionalNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#047857',
    fontWeight: '500',
  },
});