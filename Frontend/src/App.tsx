import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React, { Component, ErrorInfo, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./hooks/useAuth";
import { TransactionProvider } from "./hooks/useTransactions";
import { NotificationProvider } from "./hooks/useNotifications";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import FoodDetail from "./pages/FoodDetail";
import PostFood from "./pages/PostFood";
import Activity from "./pages/Activity";
import NGOs from "./pages/NGOs";
import NotFound from "./pages/NotFound";
import Expired from "./pages/Expired";
import OtaUpdateModal from "./components/OtaUpdateModal";
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

try {
  if (typeof Notifications.setNotificationHandler === 'function') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
} catch (e) {
  console.warn("Notification handler notice:", e);
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  checkingUpdate: boolean;
  updateStatus: string;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    checkingUpdate: false,
    updateStatus: "",
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, checkingUpdate: false, updateStatus: "" };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught app error:", error, errorInfo);
    this.autoCheckForUpdate();
  }

  private autoCheckForUpdate = async () => {
    try {
      if (typeof Updates.checkForUpdateAsync === 'function') {
        const update = await Updates.checkForUpdateAsync();
        if (update && update.isAvailable) {
          this.setState({ updateStatus: "New update found! Fetching..." });
          if (typeof Updates.fetchUpdateAsync === 'function') {
            await Updates.fetchUpdateAsync();
          }
          this.setState({ updateStatus: "Update ready! Tap below to apply." });
        }
      }
    } catch (e) {
      console.warn("ErrorBoundary update check notice:", e);
    }
  };

  private handleForceUpdate = async () => {
    this.setState({ checkingUpdate: true, updateStatus: "Checking for updates..." });
    try {
      if (typeof Updates.checkForUpdateAsync === 'function') {
        const update = await Updates.checkForUpdateAsync();
        if (update && update.isAvailable) {
          if (typeof Updates.fetchUpdateAsync === 'function') {
            await Updates.fetchUpdateAsync();
          }
          if (typeof Updates.reloadAsync === 'function') {
            await Updates.reloadAsync();
            return;
          }
        }
      }
      if (typeof Updates.reloadAsync === 'function') {
        await Updates.reloadAsync();
      } else if (typeof window !== 'undefined') {
        window.location.reload();
      } else {
        this.setState({ hasError: false, error: null, checkingUpdate: false, updateStatus: "Reloaded!" });
      }
    } catch {
      if (typeof window !== 'undefined') {
        window.location.reload();
      } else {
        this.setState({ hasError: false, error: null, checkingUpdate: false });
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF', gap: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#DC2626', marginBottom: 4 }}>App Notice</Text>
          <Text style={{ fontSize: 13, color: '#4B5563', textAlign: 'center', marginBottom: 8 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </Text>

          {this.state.updateStatus ? (
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#16A34A', textAlign: 'center' }}>
              {this.state.updateStatus}
            </Text>
          ) : null}

          <View style={{ flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
            {Platform.OS !== 'web' ? (
              <TouchableOpacity
                onPress={this.handleForceUpdate}
                disabled={this.state.checkingUpdate}
                style={{ backgroundColor: '#16A34A', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>
                  {this.state.checkingUpdate ? "Updating..." : "Check & Apply Update ✨"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (typeof window !== 'undefined') window.location.reload();
                }}
                style={{ backgroundColor: '#16A34A', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>
                  Reload Page 🔄
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => this.setState({ hasError: false, error: null })}
              style={{ backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' }}
            >
              <Text style={{ color: '#374151', fontWeight: '700', fontSize: 13 }}>Restart View 🌱</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const App = () => {
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (Notifications.getPermissionsAsync) {
          const { status: notifStatus } = await Notifications.getPermissionsAsync();
          if (notifStatus !== 'granted' && Notifications.requestPermissionsAsync) {
            await Notifications.requestPermissionsAsync();
          }
        }
        if (Location.getForegroundPermissionsAsync) {
          const { status: locStatus } = await Location.getForegroundPermissionsAsync();
          if (locStatus !== 'granted' && Location.requestForegroundPermissionsAsync) {
            await Location.requestForegroundPermissionsAsync();
          }
        }
      } catch (err) {
        console.warn("Startup permissions prompt notice:", err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <OtaUpdateModal />
        <AuthProvider>
          <NotificationProvider>
            <TransactionProvider>
              <View style={{ flex: 1, width: '100%', height: '100%' }}>
                <NavigationContainer>
                  <Layout>
                    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
                      <Stack.Screen name="Auth" component={Auth} />
                      <Stack.Screen name="Home" component={Home} />
                      <Stack.Screen name="Expired" component={Expired} />
                      <Stack.Screen name="FoodDetail" component={FoodDetail} />
                      <Stack.Screen name="PostFood" component={PostFood} />
                      <Stack.Screen name="Activity" component={Activity} />
                      <Stack.Screen name="NGOs" component={NGOs} />
                      <Stack.Screen name="NotFound" component={NotFound} />
                    </Stack.Navigator>
                  </Layout>
                </NavigationContainer>
              </View>
            </TransactionProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;

const styles = StyleSheet.create({});
