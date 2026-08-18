import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useMyPosts } from "@/hooks/useMyPosts";
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from "@/context/LanguageContext";

export default function Activity() {
  const navigation = useNavigation<any>();
  const { profile } = useAuth();
  const { userStats } = useTransactions();
  const { posts, removePost } = useMyPosts();
  const { t } = useLanguage();

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="person-circle-outline" size={64} color="#9CA3AF" />
        <Text style={styles.loadingText}>{t('pleaseLogInProfile')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Auth" as never)} style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>{t('logInOrSignUp')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = async (id: string, name: string) => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' && window.confirm ? window.confirm(`Are you sure you want to delete "${name}"?`) : true;
      if (confirmed) {
        await removePost(id);
        if (typeof window !== 'undefined' && window.alert) window.alert("Listing deleted successfully!");
      }
    } else {
      Alert.alert(
        "Delete Listing",
        `Are you sure you want to delete "${name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await removePost(id);
              Alert.alert("Success", "Listing deleted successfully!");
            },
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{t('profileTitle')}</Text>

      {/* Profile Banner */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarBox}>
            <Ionicons name="leaf" size={32} color="#6EE7B7" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userRole}>⭐ {profile.trustScore ? profile.trustScore : '5.0'} Trust Rating · {t('communityMember')}</Text>
            {profile.phone && <Text style={styles.userPhone}>📞 {profile.phone}</Text>}
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{userStats.mealsCollected}</Text>
          <Text style={styles.statLabel}>{t('mealsCollected')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{userStats.animalsFed}</Text>
          <Text style={styles.statLabel}>{t('animalsFed')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{userStats.postsMade}</Text>
          <Text style={styles.statLabel}>{t('postsMade')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{userStats.pickupSuccess}%</Text>
          <Text style={styles.statLabel}>{t('pickupSuccess')}</Text>
        </View>
      </View>

      {/* My Listings */}
      <View style={styles.listingsSection}>
        <View style={styles.listingsHeader}>
          <Text style={styles.listingsTitle}>{t('myDonations')}</Text>
          <Text style={styles.listingsCount}>{posts.length} {t('totalSuffix')}</Text>
        </View>

        {posts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 32 }}>📤</Text>
            <Text style={styles.emptyText}>{t('noPostsYet')}</Text>
          </View>
        ) : (
          <View style={styles.listingsList}>
            {posts.map((food) => (
              <TouchableOpacity
                key={food.id}
                onPress={() => navigation.navigate("FoodDetail" as never, { id: food.id } as never)}
                style={styles.postCard}
              >
                {food.image ? (
                  <Image source={{ uri: food.image }} style={styles.postImage} />
                ) : (
                  <View style={[styles.postImage, styles.noImageThumb]}>
                    <Text style={styles.noImageThumbText}>
                      {food.category === "Veg" ? "🥗" : food.category === "Non-Veg" ? "🍗" : food.category === "Bakery" ? "🥐" : food.category === "Fried" ? "🍟" : food.category === "Sweets" ? "🍰" : "🍲"}
                    </Text>
                  </View>
                )}
                <View style={styles.postInfo}>
                  <Text style={styles.postName}>{food.name}</Text>
                  <Text style={styles.postSub}>
                    {food.feeds - (food.bookedPortions || 0)} / {food.feeds} {t('remainingLabel')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(food.id, food.name)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  profileCard: {
    backgroundColor: '#022C22',
    padding: 20,
    borderRadius: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 78, 59, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    gap: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userRole: {
    fontSize: 12,
    color: '#A7F3D0',
  },
  userPhone: {
    fontSize: 11,
    color: '#6EE7B7',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statVal: {
    fontSize: 24,
    fontWeight: '800',
    color: '#16A34A',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  listingsSection: {
    gap: 12,
  },
  listingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  listingsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
  },
  listingsList: {
    gap: 8,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  postImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  postInfo: {
    flex: 1,
  },
  postName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  postSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  loginBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  noImageThumb: {
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  noImageThumbText: {
    fontSize: 24,
  },
});
