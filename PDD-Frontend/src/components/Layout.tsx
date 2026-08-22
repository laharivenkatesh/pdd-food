import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Modal, Platform, Alert, useWindowDimensions, Animated } from 'react-native';
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useTransactions } from "@/hooks/useTransactions";
import { useAllFoods } from "@/hooks/useMyPosts";
import { supabase } from "@/lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from "@/context/LanguageContext";

function NavTabItem({ name, route, icon, label, currentRoute, onPress }: { name: string; route: string; icon: any; label: string; currentRoute: string; onPress: () => void }) {
  const isActive = currentRoute === route || currentRoute === name;
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

function SidebarNavItem({ name, route, icon, label, currentRoute, onPress }: { name: string; route: string; icon: any; label: string; currentRoute: string; onPress: () => void }) {
  const isActive = currentRoute === route || currentRoute === name;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.sidebarNavItem,
        isActive && styles.sidebarNavItemActive,
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color={isActive ? "#16A34A" : "#4B5563"}
      />
      <Text
        style={[
          styles.sidebarNavLabel,
          isActive && styles.sidebarNavLabelActive,
        ]}
      >
        {label}
      </Text>
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
      if (!state || !state.routes || state.routes.length === 0) return "";
      const currentRoute = state.routes[state.index];
      return currentRoute ? currentRoute.name : "";
    } catch {
      return "";
    }
  });
  const { user, profile, logout } = useAuth();
  const isAuthPage = currentRouteName === "Auth" && !user;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const { t, setLanguage, currentLanguageOption, languageOptions } = useLanguage();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const { foods } = useAllFoods();

  const { markDonated } = useTransactions();

  const {
    notifications,
    unreadCount,
    markAsRead,
  } = useNotifications();

  const handleSignOut = async () => {
    await logout();
    navigation.navigate("Auth" as never);
  };

  return (
    <View style={[styles.container, isDesktop && styles.desktopRootContainer]}>
      {/* Sidebar for Desktop / Laptop / PC */}
      {isDesktop && !isAuthPage && (
        <View style={styles.sidebar}>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("Home" as never)} style={styles.sidebarBrand}>
              <View style={styles.logoBadge}>
                <Ionicons name="restaurant" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.sidebarBrandTitle}>Zerra</Text>
                <Text style={styles.sidebarBrandSubtitle}>Food Hub 🌱</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.sidebarNavList}>
              <SidebarNavItem
                name="Home"
                route="Home"
                icon="home-outline"
                label={t('navHome')}
                currentRoute={currentRouteName}
                onPress={() => navigation.navigate("Home" as never)}
              />
              <SidebarNavItem
                name="Expired"
                route="Expired"
                icon="time-outline"
                label={t('navExpired')}
                currentRoute={currentRouteName}
                onPress={() => navigation.navigate("Expired" as never)}
              />
              <SidebarNavItem
                name="PostFood"
                route="PostFood"
                icon="add-circle-outline"
                label={t('navPost')}
                currentRoute={currentRouteName}
                onPress={() => navigation.navigate("PostFood" as never)}
              />
              <SidebarNavItem
                name="NGOs"
                route="NGOs"
                icon="heart-outline"
                label={t('navNGOs')}
                currentRoute={currentRouteName}
                onPress={() => navigation.navigate("NGOs" as never)}
              />
              <SidebarNavItem
                name="Profile"
                route="Activity"
                icon="person-outline"
                label={t('profileTitle')}
                currentRoute={currentRouteName}
                onPress={() => navigation.navigate("Activity" as never)}
              />
            </View>
          </View>

          {user && (
            <View style={styles.sidebarFooter}>
              <TouchableOpacity onPress={handleSignOut} style={styles.sidebarLogoutBtn}>
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text style={styles.sidebarLogoutText}>{t('logOut')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={[styles.mainArea, isDesktop && styles.desktopMainArea]}>
        {/* Top Header - Hide on Desktop Auth page for full-screen split login */}
        {(!isAuthPage || !isDesktop) && (
          <View style={[styles.header, isDesktop && styles.desktopHeader]}>
            {!isDesktop ? (
              <TouchableOpacity onPress={() => navigation.navigate("Home" as never)} style={styles.brandRow}>
                <View style={styles.logoBadge}>
                  <Ionicons name="restaurant" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.brandText}>Zerra</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

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
                    <Ionicons name="notifications-outline" size={18} color="#1F2937" />
                    {unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  {!isDesktop && (
                    <TouchableOpacity onPress={handleSignOut} style={styles.logoutBtn}>
                      <Text style={styles.logoutBtnText}>{t('logOut')}</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>
        )}

        {/* Main Content Area */}
        <View style={[styles.content, isDesktop && styles.desktopContent]}>
          {children}
        </View>
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
              {(() => {
                const now = Date.now();
                const activeRecentNotifs = notifications.filter((n) => {
                  const notifTime = new Date(n.created_at).getTime();
                  const isRecent = (now - notifTime) <= 24 * 3600 * 1000;
                  if (n.food_id) {
                    const food = foods.find(f => f.id === n.food_id);
                    if (food) {
                      const fStatus = String(food.status);
                      if (fStatus === "expired" || fStatus === "deleted" || fStatus === "collected") {
                        return false;
                      }
                    }
                  }
                  return isRecent;
                });

                if (activeRecentNotifs.length === 0) {
                  return <Text style={styles.emptyNotifText}>No active notifications for today</Text>;
                }

                return activeRecentNotifs.map((n) => {
                  const isClaimNotif = n.title.includes("Claimed") || n.title.includes("Booked");

                  return (
                    <View
                      key={n.id}
                      style={[styles.notifCard, !n.is_read && styles.notifUnread]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          markAsRead(n.id);
                          setDrawerOpen(false);
                          if (n.food_id) navigation.navigate("FoodDetail" as never, { id: n.food_id } as never);
                        }}
                      >
                        <Text style={styles.notifTitle}>{n.title}</Text>
                        <Text style={styles.notifMessage}>{n.message}</Text>
                        <Text style={styles.notifTime}>{formatTimeAgo(n.created_at)}</Text>
                      </TouchableOpacity>

                      {isClaimNotif && n.food_id && (
                        <View style={styles.notifActionsRow}>
                          <TouchableOpacity
                            onPress={async () => {
                              try {
                                const { data: txs } = await supabase
                                  .from("transactions")
                                  .select("id")
                                  .eq("food_id", n.food_id)
                                  .neq("status", "completed")
                                  .neq("status", "cancelled");

                                if (txs && txs.length > 0) {
                                  await markDonated(txs[0].id);
                                } else {
                                  await supabase.from("foods").update({ status: "collected", realtime_status: "Not Available" }).eq("id", n.food_id);
                                }

                                markAsRead(n.id);
                                if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
                                  window.alert("🎉 Marked food as collected & handed over!");
                                } else {
                                  Alert.alert("Success", "Marked food as collected & handed over!");
                                }
                              } catch (err) {
                                console.warn("Error marking collected from notification:", err);
                              }
                            }}
                            style={styles.notifCollectedBtn}
                          >
                            <Ionicons name="checkmark-circle" size={15} color="#FFFFFF" />
                            <Text style={styles.notifCollectedBtnText}>Mark Collected / Handed Over</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                });
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation for Mobile Devices only */}
      {!isAuthPage && !isDesktop && (
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
            name="NGOs"
            route="NGOs"
            icon="heart-outline"
            label={t('navNGOs')}
            currentRoute={currentRouteName}
            onPress={() => navigation.navigate("NGOs" as never)}
          />
          <NavTabItem
            name="Profile"
            route="Activity"
            icon="person-outline"
            label={t('profileTitle')}
            currentRoute={currentRouteName}
            onPress={() => navigation.navigate("Activity" as never)}
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
  desktopRootContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F5',
    width: '100%',
    height: '100%',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    height: '100%',
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  sidebarBrandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  sidebarBrandSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  sidebarNavList: {
    gap: 8,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  sidebarNavItemActive: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  sidebarNavLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  sidebarNavLabelActive: {
    color: '#16A34A',
    fontWeight: '800',
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 16,
    gap: 10,
  },
  sidebarImpactWidget: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 4,
  },
  sidebarImpactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sidebarImpactTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sidebarImpactVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  sidebarImpactSub: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2,
  },
  sidebarUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 12,
  },
  sidebarUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarUserName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    flexWrap: 'wrap',
  },
  sidebarUserEmail: {
    fontSize: 11,
    color: '#475569',
    flexWrap: 'wrap',
  },
  sidebarUserPhone: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  sidebarUserRole: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  sidebarLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
  },
  sidebarLogoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  mainArea: {
    flex: 1,
    flexDirection: 'column',
  },
  desktopMainArea: {
    flex: 1,
    height: '100%',
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
    paddingHorizontal: 24,
  },
  desktopContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 34,
    height: 34,
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
  notifActionsRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  notifCollectedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  notifCollectedBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});