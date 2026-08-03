import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect, useState, useRef } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAllFoods } from "@/hooks/useMyPosts";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // radius of Earth in km
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
  const route = useRoute();
  const { user, logout } = useAuth();
  const hideNav = route.name === "Auth";

  const { transactions, markCollected, markDonated } = useTransactions();
  const { foods } = useAllFoods();
  const [oppositeProfiles, setOppositeProfiles] = useState<Record<string, any>>({});
  const bellDistancesRef = useRef<Record<string, number>>({});

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

  const hasActiveBookings = transactions.some(t =>
    t.donor_id === user?.id &&
    t.collector_id !== user?.id &&
    t.status === "pending"
  );

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    soundEnabled,
    setSoundEnabled,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"all" | "unread">("unread");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigation.navigate("Auth");
  };

  const filteredNotifs = notifications.filter(
    (n) => activeTab === "all" || !n.is_read
  );

  return (
    <View style={styles.container}>
      {!hideNav && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.logoRow}
            activeOpacity={0.8}
          >
            <View style={styles.logoIconBg}>
              <Ionicons name="leaf" size={20} color="#ffffff" />
            </View>
            <Text style={styles.logoText}>Zerra</Text>
          </TouchableOpacity>

          {user && (
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => setDrawerOpen(true)}
                style={[styles.bellBtn, hasActiveBookings && styles.bellBtnActive]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={unreadCount > 0 || hasActiveBookings ? "notifications" : "notifications-outline"}
                  size={20}
                  color={hasActiveBookings ? "#f97316" : unreadCount > 0 ? "#309267" : "#1e382b"}
                />
                {(unreadCount > 0 || hasActiveBookings) && (
                  <View style={[styles.badgeCount, hasActiveBookings ? styles.bgOrange : styles.bgUrgent]}>
                    <Text style={styles.badgeCountText}>{hasActiveBookings ? "!" : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSignOut}
                style={styles.logoutBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Notification Drawer Modal */}
      <Modal visible={drawerOpen} animationType="slide" transparent={true} onRequestClose={() => setDrawerOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <View style={styles.modalBellIconBg}>
                  <Ionicons name="notifications" size={18} color="#309267" />
                </View>
                <Text style={styles.modalTitle}>Notifications</Text>
              </View>
              <View style={styles.modalHeaderRight}>
                <TouchableOpacity onPress={() => setSoundEnabled(!soundEnabled)} style={styles.iconBtn}>
                  <Ionicons name={soundEnabled ? "volume-high-outline" : "volume-mute-outline"} size={20} color="#5c7066" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDrawerOpen(false)} style={styles.iconBtn}>
                  <Ionicons name="close" size={24} color="#1e382b" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tabsRow}>
              <TouchableOpacity
                onPress={() => setActiveTab("unread")}
                style={[styles.tabBtn, activeTab === "unread" && styles.tabBtnActive]}
              >
                <Text style={[styles.tabBtnText, activeTab === "unread" && styles.tabBtnTextActive]}>
                  Unread ({unreadCount})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("all")}
                style={[styles.tabBtn, activeTab === "all" && styles.tabBtnActive]}
              >
                <Text style={[styles.tabBtnText, activeTab === "all" && styles.tabBtnTextActive]}>
                  All ({notifications.length})
                </Text>
              </TouchableOpacity>
            </View>

            {notifications.length > 0 && (
              <View style={styles.drawerActions}>
                {unreadCount > 0 ? (
                  <TouchableOpacity onPress={markAllAsRead}>
                    <Text style={styles.actionTextPrimary}>Check all read</Text>
                  </TouchableOpacity>
                ) : <View />}
                <TouchableOpacity onPress={clearAll}>
                  <Text style={styles.actionTextDestructive}>Clear all</Text>
                </TouchableOpacity>
              </View>
            )}

            <ScrollView style={styles.notifList} contentContainerStyle={styles.notifListContent}>
              {filteredNotifs.length === 0 ? (
                <View style={styles.emptyNotifContainer}>
                  <Text style={styles.emptyEmoji}>🍱</Text>
                  <Text style={styles.emptyTitle}>All caught up!</Text>
                  <Text style={styles.emptySubtitle}>
                    {activeTab === "unread" ? "No unread food listings found." : "No notifications posted yet."}
                  </Text>
                </View>
              ) : (
                filteredNotifs.map((notif) => (
                  <TouchableOpacity
                    key={notif.id}
                    onPress={() => {
                      navigation.navigate("FoodDetail", { id: notif.food_id });
                      markAsRead(notif.id);
                      setDrawerOpen(false);
                    }}
                    style={[styles.notifCard, !notif.is_read && styles.notifCardUnread]}
                    activeOpacity={0.8}
                  >
                    {!notif.is_read && <View style={styles.unreadDot} />}
                    <View style={styles.notifCardBody}>
                      <Text style={styles.notifTitle}>{notif.title}</Text>
                      <Text style={styles.notifMessage}>{notif.message}</Text>
                      <Text style={styles.notifTime}>{formatTimeAgo(notif.created_at)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteNotification(notif.id)}>
                      <Ionicons name="trash-outline" size={16} color="#dc2626" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.main}>{children}</View>

      {!hideNav && (
        <View style={styles.bottomNav}>
          <NavItem
            to="Home"
            icon={<Ionicons name="home-outline" size={22} color={route.name === "Home" ? "#309267" : "#5c7066"} />}
            label="Home"
            active={route.name === "Home"}
          />
          <NavItem
            to="Expired"
            icon={<Ionicons name="time-outline" size={22} color={route.name === "Expired" ? "#309267" : "#5c7066"} />}
            label="Expired"
            active={route.name === "Expired"}
          />
          <NavItem
            to="Post"
            icon={<Ionicons name="add-circle" size={32} color={route.name === "Post" ? "#309267" : "#309267"} />}
            label="Post"
            active={route.name === "Post"}
            highlight
          />
          <NavItem
            to="Activity"
            icon={<Ionicons name="person-outline" size={22} color={route.name === "Activity" ? "#309267" : "#5c7066"} />}
            label="Profile"
            active={route.name === "Activity"}
          />
        </View>
      )}
    </View>
  );
}

function NavItem({
  to,
  icon,
  label,
  active,
  highlight,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  highlight?: boolean;
}) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(to)}
      style={[styles.navItem, highlight && styles.navItemHighlight]}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f4ec',
  },
  header: {
    backgroundColor: 'rgba(246, 244, 236, 0.95)',
    borderBottomWidth: 1,
    borderColor: '#e8e6df',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 16,
    backgroundColor: '#309267',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e382b',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 16,
    backgroundColor: 'rgba(92, 112, 102, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBtnActive: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bgOrange: {
    backgroundColor: '#f97316',
  },
  bgUrgent: {
    backgroundColor: '#dc2626',
  },
  badgeCountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#dc2626',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  main: {
    flex: 1,
  },
  bottomNav: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e8e6df',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  navItemHighlight: {
    transform: [{ scale: 1.1 }],
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5c7066',
  },
  navLabelActive: {
    color: '#309267',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#e8e6df',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalBellIconBg: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(48, 146, 103, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e382b',
  },
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#f6f4ec',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 4,
    borderRadius: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#ffffff',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c7066',
  },
  tabBtnTextActive: {
    color: '#1e382b',
  },
  drawerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  actionTextPrimary: {
    fontSize: 12,
    fontWeight: '700',
    color: '#309267',
  },
  actionTextDestructive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
  notifList: {
    paddingHorizontal: 20,
  },
  notifListContent: {
    gap: 10,
    paddingVertical: 12,
  },
  emptyNotifContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 4,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e382b',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#5c7066',
  },
  notifCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    position: 'relative',
  },
  notifCardUnread: {
    backgroundColor: 'rgba(48, 146, 103, 0.05)',
    borderColor: 'rgba(48, 146, 103, 0.2)',
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#309267',
  },
  notifCardBody: {
    flex: 1,
    gap: 2,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e382b',
  },
  notifMessage: {
    fontSize: 12,
    color: '#5c7066',
  },
  notifTime: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(92, 112, 102, 0.8)',
    marginTop: 4,
  },
});
