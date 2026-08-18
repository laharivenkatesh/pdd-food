import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Modal, Platform, useWindowDimensions, Animated } from 'react-native';
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useTransactions } from "@/hooks/useTransactions";
import { useAllFoods } from "@/hooks/useMyPosts";
import { supabase } from "@/lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from "@/context/LanguageContext";

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

function NavTabItem({ name, route, icon, label, currentRoute, onPress }: { name: string; route: string; icon: any; label: string; currentRoute: string; onPress: () => void }) {
  const isActive = currentRoute === route;
  const scaleAnim = useRef(new Animated.Value(isActive ? 1.15 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.15 : 1,
      friction: 5,
      tension: 60,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.navItem}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <Ionicons name={icon} size={name === "PostFood" ? 30 : 22} color={isActive ? "#16A34A" : "#6B7280"} />
        <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function formatTimeAgo(dateStr: string) {
  try {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    if (isNaN(diffMs) || diffMs < 0) return "Just now";
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "Recently";
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation<any>();
  const currentRouteName = useNavigationState(state => {
    try {
      if (!state || !state.routes || state.routes.length === 0) return "Auth";
      const currentRoute = state.routes[state.index];
      return currentRoute ? currentRoute.name : "";
    } catch {
      return "";
    }
  });
  const { user, logout } = useAuth();
  const isAuthPage = currentRouteName === "Auth";

  const { transactions } = useTransactions();
  const { foods } = useAllFoods();
  const [oppositeProfiles, setOppositeProfiles] = useState<Record<string, any>>({});
  const bellDistancesRef = useRef<Record<string, number>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const { t, setLanguage, currentLanguageOption, languageOptions } = useLanguage();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  useEffect(() => {
    const fetchProfiles = async () => {
      if (transactions.length > 0 && user) {
        const otherUserIds = Array.from(new Set(
          transactions.map(t => t.donor_id === user.id ? t.collector_id : t.donor_id)
        ));

        if (otherUserIds.length > 0) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .in("id", otherUserIds);

          if (data) {
            const profileMap: Record<string, any> = {};
            data.forEach(p => {
              profileMap[p.id] = p;
            });
            setOppositeProfiles(profileMap);
          }
        }
      }
    };
    fetchProfiles();
  }, [transactions, user]);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const handleSignOut = async () => {
    await logout();
    navigation.navigate("Auth" as never);
  };

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      {/* Top Header - Always Visible */}
      <View style={[styles.header, isDesktop && styles.desktopHeader]}>
        <TouchableOpacity onPress={() => navigation.navigate("Home" as never)} style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="restaurant" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.brandText}>Zerra</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setLangModalOpen(true)} style={styles.langBtn}>
            <Ionicons name="globe-outline" size={16} color="#16A34A" />
            <Text style={styles.langBtnFlag}>{currentLanguageOption.flag}</Text>
            <Text style={styles.langBtnText}>{currentLanguageOption.nativeLabel}</Text>
            <Ionicons name="chevron-down" size={13} color="#374151" />
          </TouchableOpacity>

          {user && (
            <>
              <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={22} color="#1F2937" />
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignOut} style={styles.logoutBtn}>
                <Text style={styles.logoutBtnText}>{t('logOut')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Main Content Area */}
      <View style={[styles.content, isDesktop && styles.desktopContent]}>
        {children}
      </View>

      {/* Language Picker Modal */}
      <Modal visible={langModalOpen} animationType="fade" transparent>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setLangModalOpen(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.langModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="globe-outline" size={20} color="#16A34A" />
                <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
              </View>
              <TouchableOpacity onPress={() => setLangModalOpen(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.langOptionsList}>
              {languageOptions.map((opt) => {
                const active = currentLanguageOption.code === opt.code;
                return (
                  <TouchableOpacity
                    key={opt.code}
                    onPress={() => {
                      setLanguage(opt.code);
                      setLangModalOpen(false);
                    }}
                    style={[styles.langOptionItem, active && styles.langOptionActive]}
                  >
                    <Text style={styles.langOptionFlag}>{opt.flag}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.langOptionNative, active && styles.langTextActive]}>
                        {opt.nativeLabel}
                      </Text>
                      <Text style={styles.langOptionSub}>{opt.label}</Text>
                    </View>
                    {active && <Ionicons name="checkmark-circle" size={20} color="#16A34A" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Notifications Drawer Modal */}
      <Modal visible={drawerOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('notifications')}</Text>
              <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.notifList}>
              {notifications.length === 0 ? (
                <Text style={styles.emptyNotifText}>No notifications</Text>
              ) : (
                notifications.map((n) => (
                  <TouchableOpacity
                    key={n.id}
                    onPress={() => {
                      markAsRead(n.id);
                      setDrawerOpen(false);
                      if (n.food_id) navigation.navigate("FoodDetail" as never, { id: n.food_id } as never);
                    }}
                    style={[styles.notifCard, !n.is_read && styles.notifUnread]}
                  >
                    <Text style={styles.notifTitle}>{n.title}</Text>
                    <Text style={styles.notifMessage}>{n.message}</Text>
                    <Text style={styles.notifTime}>{formatTimeAgo(n.created_at)}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation - Hidden ONLY on Auth/Login Page */}
      {!isAuthPage && (
        <View style={styles.bottomNav}>
          <NavTabItem
            name="Home"
            route="Home"
            icon="home-outline"
            label={t('navHome')}
            currentRoute={currentRouteName}
            onPress={() => navigation.navigate("Home" as never)}
          />
          <NavTabItem
            name="Expired"
            route="Expired"
            icon="time-outline"
            label={t('navExpired')}
            currentRoute={currentRouteName}
            onPress={() => navigation.navigate("Expired" as never)}
          />
          <NavTabItem
            name="PostFood"
            route="PostFood"
            icon="add-circle"
            label={t('navPost')}
            currentRoute={currentRouteName}
            onPress={() => navigation.navigate("PostFood" as never)}
          />
          <NavTabItem
            name="Activity"
            route="Activity"
            icon="list-outline"
            label={t('navActivity')}
            currentRoute={currentRouteName}
            onPress={() => navigation.navigate("Activity" as never)}
          />
          <NavTabItem
            name="NGOs"
            route="NGOs"
            icon="heart-outline"
            label={t('navNGOs')}
            currentRoute={currentRouteName}
            onPress={() => navigation.navigate("NGOs" as never)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  desktopContainer: {
    backgroundColor: '#FAF8F5',
  },
  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  desktopHeader: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  desktopContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  updateBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  updateBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  iconBtn: {
    position: 'relative',
    padding: 6,
  },
  unreadBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHighlight: {
    marginTop: -10,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#16A34A',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  notifList: {
    gap: 12,
  },
  emptyNotifText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 32,
  },
  notifCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  notifUnread: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  notifMessage: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  notifTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langBtnFlag: {
    fontSize: 14,
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  langModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    padding: 20,
    marginTop: 'auto',
  },
  langOptionsList: {
    marginTop: 10,
  },
  langOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  langOptionActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  langOptionFlag: {
    fontSize: 22,
  },
  langOptionNative: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  langOptionSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  langTextActive: {
    color: '#15803D',
  },
});