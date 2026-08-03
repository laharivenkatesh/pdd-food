import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import React, { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAllFoods, useMyPosts } from "@/hooks/useMyPosts";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Category, FoodItem } from "@/types/food";
import { getFoodTimes } from "@/lib/utils";
import Chip from "@/components/Chip";
import { Ionicons, Feather } from "@expo/vector-icons";

const categories: Category[] = ["Veg", "Non-Veg", "Bakery", "Fried", "Sweets"];

function ExpiredFoodCard({ food }: { food: FoodItem }) {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { posts, removePost } = useMyPosts();
  const isDonor = user?.id === food.provider.id || posts.some((p) => p.id === food.id);

  const total = food.feeds;
  const booked = food.bookedPortions || 0;
  const remaining = Math.max(0, total - booked);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate("FoodDetail", { id: food.id })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: food.image }} style={styles.cardImage} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.portionsText}>📊 {remaining} / {total} portions left</Text>
            </View>
            <Text style={styles.priceText}>{food.price === 0 ? "FREE" : `₹${food.price}`}</Text>
          </View>

          <Text style={styles.addressText}>📍 {food.address}</Text>

          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={() => navigation.navigate("FoodDetail", { id: food.id })}
              style={styles.claimBtn}
            >
              <Text style={styles.claimBtnText}>Claim Expired Food</Text>
            </TouchableOpacity>

            {isDonor && (
              <TouchableOpacity
                onPress={() => {
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
                          toast.success("Listing deleted successfully!");
                        },
                      },
                    ]
                  );
                }}
                style={styles.deleteBtn}
              >
                <Feather name="trash-2" size={16} color="#dc2626" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function Expired() {
  const navigation = useNavigation<any>();
  const { foods: dbFoods, loading, refresh } = useAllFoods();
  const [activeCats, setActiveCats] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCat = (c: Category) =>
    setActiveCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const list = useMemo(() => {
    let arr = [...dbFoods];
    const now = Date.now();

    arr = arr.filter((f) => {
      const { primaryExpiry, secondaryExpiry } = getFoodTimes(f);
      return now >= primaryExpiry && now < secondaryExpiry;
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={18} color="#1e382b" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Expired Outlet</Text>
            <Text style={styles.subtitle}>Still safe and requestable for 3 more hours.</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => refresh()} disabled={loading} style={styles.backBtn}>
          <Ionicons name="refresh" size={18} color="#5c7066" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color="#5c7066" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search expired items..."
          placeholderTextColor="#5c7066"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterRow}>
        {categories.map((c) => (
          <Chip key={c} label={c} active={activeCats.includes(c)} onClick={() => toggleCat(c)} />
        ))}
      </View>

      <View style={styles.list}>
        {list.map((f) => (
          <ExpiredFoodCard key={f.id} food={f} />
        ))}
        {list.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>Zero Food Expired!</Text>
            <Text style={styles.emptySub}>All food listings were saved before expiration.</Text>
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
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e382b',
  },
  subtitle: {
    fontSize: 12,
    color: '#5c7066',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e382b',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e6df',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  portionsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#309267',
    marginTop: 2,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  addressText: {
    fontSize: 12,
    color: '#5c7066',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  claimBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
  },
  claimBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  deleteBtn: {
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderStyle: 'dashed',
    gap: 6,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e382b',
  },
  emptySub: {
    fontSize: 12,
    color: '#5c7066',
    textAlign: 'center',
  },
});

