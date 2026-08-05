import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Switch } from 'react-native';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Chip from "@/components/Chip";
import { Category, Purpose } from "@/types/food";
import { useMyPosts } from "@/hooks/useMyPosts";
import { Ionicons } from '@expo/vector-icons';

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
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !quantity.trim() || !feeds || !expiryHours || !address.trim()) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    setBusy(true);

    const res = await addPost({
      name: name.trim(),
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
      feeds: Number(feeds) || 1,
      price: paid ? Number(price) || 0 : 0,
      expiry_hours: Number(expiryHours) || 4,
      prepared_at: preparedAt || new Date().toLocaleString(),
      address: address.trim(),
      lat: 13.0827,
      lng: 80.2707,
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
      Alert.alert("Error", res.error || "Failed to post food.");
      return;
    }
    Alert.alert("Success", "Food posted! Helping the world 🌱");
    navigation.navigate("Home" as never);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Post Leftover Food</Text>

      <View style={styles.formContainer}>
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
});