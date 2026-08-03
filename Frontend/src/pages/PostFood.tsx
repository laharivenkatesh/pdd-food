import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Switch, Modal } from 'react-native';
import React, { useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import MapPreview from "@/components/MapPreview";
import Chip from "@/components/Chip";
import { Category, Purpose } from "@/types/food";
import { useMyPosts } from "@/hooks/useMyPosts";
import { toast } from "sonner";

const categories: Category[] = ["Veg", "Non-Veg", "Bakery", "Fried", "Sweets"];
const purposes: { key: Purpose; label: string }[] = [
  { key: "humans", label: "🧑 Humans" },
  { key: "animals", label: "🐾 Animals" },
  { key: "both", label: "♻️ Both" },
];

export default function PostFood() {
  const navigation = useNavigation<any>();
  const { addPost, getLastPostTime } = useMyPosts();

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preparedAt, setPreparedAt] = useState("");
  const [expiryHours, setExpiryHours] = useState("");
  const [graceHours, setGraceHours] = useState("3");

  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("13.0827");
  const [lng, setLng] = useState("80.2707");
  const [feeds, setFeeds] = useState("");
  const [category, setCategory] = useState<Category>("Veg");
  const [purpose, setPurpose] = useState<Purpose>("humans");
  const [safe, setSafe] = useState(true);
  const [paid, setPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [allowSplit, setAllowSplit] = useState(true);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleInitialSubmit = () => {
    if (!lat || !lng) {
      toast.error("Please set a pickup location.");
      return;
    }
    const lastPostTime = getLastPostTime();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    if (Date.now() - lastPostTime < TWO_HOURS) {
      setShowConfirm(true);
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = async () => {
    setShowConfirm(false);
    setBusy(true);
    const res = await addPost({
      name: name.trim(),
      image: image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
      feeds: Number(feeds) || 1,
      price: paid ? Number(price) || 0 : 0,
      expiry_hours: Number(expiryHours) || 4,
      prepared_at: preparedAt || new Date().toLocaleString(),
      address: address.trim(),
      lat: Number(lat) || 13.0827,
      lng: Number(lng) || 80.2707,
      category,
      tags: [`grace-hours:${graceHours}`],
      purpose,
      safe_for_animals: safe,
      status: "available",
      realtime_status: "Still Available",
      quantity: quantity.trim(),
      notes: notes.trim() || null,
      allow_split: allowSplit,
    });

    setBusy(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Food posted! Helping the world 🌱");
    navigation.navigate("Home");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Post Leftover Food</Text>

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Post Frequency Warning</Text>
            <Text style={styles.modalText}>
              You posted food less than 2 hours ago. Is this new food prepared or being cooked in less than 5–6 hours?
            </Text>
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => setShowConfirm(false)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelText}>No, Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={executeSubmit} style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmText}>Yes, Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.form}>
        {/* Photo Section */}
        <TouchableOpacity
          onPress={() => {
            setImage("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80");
          }}
          style={styles.imagePicker}
          activeOpacity={0.8}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={32} color="#5c7066" />
              <Text style={styles.imagePlaceholderText}>Tap to set photo sample</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Food name (e.g. Biryani, Rotis)"
          placeholderTextColor="#5c7066"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity (e.g. 5 kg, 10 plates, 2 boxes)"
          placeholderTextColor="#5c7066"
          value={quantity}
          onChangeText={setQuantity}
        />
        <TextInput
          style={styles.input}
          placeholder="Feeds how many people? (e.g. 8)"
          placeholderTextColor="#5c7066"
          keyboardType="number-pad"
          value={feeds}
          onChangeText={setFeeds}
        />
        <TextInput
          style={styles.input}
          placeholder="When was it prepared? (e.g. 1 hour ago)"
          placeholderTextColor="#5c7066"
          value={preparedAt}
          onChangeText={setPreparedAt}
        />
        <TextInput
          style={styles.input}
          placeholder="Expires in how many hours? (e.g. 4)"
          placeholderTextColor="#5c7066"
          keyboardType="numeric"
          value={expiryHours}
          onChangeText={setExpiryHours}
        />

        <TextInput
          style={styles.input}
          placeholder="Pickup address (e.g. 12 Anna Salai, Chennai)"
          placeholderTextColor="#5c7066"
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.coordsRow}>
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="Latitude"
            placeholderTextColor="#5c7066"
            value={lat}
            onChangeText={setLat}
          />
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="Longitude"
            placeholderTextColor="#5c7066"
            value={lng}
            onChangeText={setLng}
          />
        </View>

        <MapPreview lat={Number(lat) || 13.0827} lng={Number(lng) || 80.2707} label={name || "Pickup location"} height="h-48" interactive />

        {/* Category */}
        <View style={styles.chipSection}>
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.chipRow}>
            {categories.map((c) => (
              <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.chipSection}>
          <Text style={styles.sectionLabel}>Purpose</Text>
          <View style={styles.chipRow}>
            {purposes.map((p) => (
              <Chip key={p.key} label={p.label} active={purpose === p.key} onClick={() => setPurpose(p.key)} />
            ))}
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Safe for animals</Text>
          <Switch value={safe} onValueChange={setSafe} trackColor={{ true: '#309267' }} />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>{paid ? "Paid listing" : "Free listing"}</Text>
          <Switch value={paid} onValueChange={setPaid} trackColor={{ true: '#309267' }} />
        </View>

        {paid && (
          <TextInput
            style={styles.input}
            placeholder="Price in ₹ (e.g. 50)"
            placeholderTextColor="#5c7066"
            keyboardType="number-pad"
            value={price}
            onChangeText={setPrice}
          />
        )}

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Allow split among multiple users</Text>
          <Switch value={allowSplit} onValueChange={setAllowSplit} trackColor={{ true: '#309267' }} />
        </View>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any notes for the collector? (e.g. spicy, doorstep pickup)"
          placeholderTextColor="#5c7066"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity onPress={handleInitialSubmit} disabled={busy} style={styles.submitBtn} activeOpacity={0.8}>
          <Text style={styles.submitBtnText}>{busy ? "Posting..." : "Post Food 🌱"}</Text>
        </TouchableOpacity>
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
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e382b',
  },
  form: {
    gap: 12,
  },
  imagePicker: {
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e8e6df',
    borderStyle: 'dashed',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c7066',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e382b',
  },
  flex1: {
    flex: 1,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  chipSection: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5c7066',
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e382b',
  },
  submitBtn: {
    backgroundColor: '#309267',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e382b',
  },
  modalText: {
    fontSize: 13,
    color: '#5c7066',
    lineHeight: 18,
  },
  modalRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f6f4ec',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c7066',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#309267',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});