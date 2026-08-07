import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Platform } from 'react-native';
import React, { Component, ErrorInfo, ReactNode } from "react";

if (typeof window !== 'undefined') {
  if (typeof (window as any).CustomEvent !== 'function') {
    (window as any).CustomEvent = function CustomEvent(event: string, params: any) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      return { type: event, detail: params?.detail, bubbles: !!params?.bubbles, cancelable: !!params?.cancelable };
    };
  }
}
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
import * as Updates from 'expo-updates';

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
    // Auto reset error state after 300ms so app never gets stuck on error UI
    setTimeout(() => {
      this.setState({ hasError: false, error: null });
    }, 300);
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
      const updatePromise = (async () => {
        if (typeof Updates.checkForUpdateAsync === 'function') {
          const update = await Updates.checkForUpdateAsync();
          if (update && update.isAvailable) {
            this.setState({ updateStatus: "Downloading update..." });
            if (typeof Updates.fetchUpdateAsync === 'function') {
              await Updates.fetchUpdateAsync();
            }
            if (typeof Updates.reloadAsync === 'function') {
              await Updates.reloadAsync();
              return true;
            }
          }
        }
        return false;
      })();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Update fetch timeout")), 8000)
      );

      const reloaded = await Promise.race([updatePromise, timeoutPromise]);
      if (!reloaded) {
        if (typeof Updates.reloadAsync === 'function') {
          await Updates.reloadAsync();
        } else if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.reload) {
          window.location.reload();
        } else {
          this.setState({ hasError: false, error: null, checkingUpdate: false, updateStatus: "" });
        }
      }
    } catch {
      if (typeof Updates.reloadAsync === 'function') {
        try { await Updates.reloadAsync(); } catch {}
      } else if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.reload) {
        window.location.reload();
      } else {
        this.setState({ hasError: false, error: null, checkingUpdate: false, updateStatus: "App reloaded!" });
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F7F5EC', gap: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>Zerra Food Hub</Text>
          <Text style={{ fontSize: 14, color: '#4B5563', textAlign: 'center', maxWidth: 300 }}>
            Fresh update ready! Tap below to open main app.
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({ hasError: false, error: null });
              if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.reload) {
                window.location.reload();
              }
            }}
            style={{ backgroundColor: '#16A34A', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 15 }}>Open Main App 🚀</Text>
          </TouchableOpacity>
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
        if (typeof Notifications.getPermissionsAsync === 'function') {
          const { status: notifStatus } = await Notifications.getPermissionsAsync();
          if (notifStatus !== 'granted' && typeof Notifications.requestPermissionsAsync === 'function') {
            await Notifications.requestPermissionsAsync();
          }
        }
        if (typeof Location.getForegroundPermissionsAsync === 'function') {
          const { status: locStatus } = await Location.getForegroundPermissionsAsync();
          if (locStatus !== 'granted' && typeof Location.requestForegroundPermissionsAsync === 'function') {
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
