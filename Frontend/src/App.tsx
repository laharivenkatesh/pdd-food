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
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught app error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#DC2626', marginBottom: 8 }}>App Notice</Text>
          <Text style={{ fontSize: 13, color: '#4B5563', textAlign: 'center', marginBottom: 16 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: null })}
            style={{ backgroundColor: '#16A34A', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>Restart View 🌱</Text>
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
            </TransactionProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;

const styles = StyleSheet.create({});
