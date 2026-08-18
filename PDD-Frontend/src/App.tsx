import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Platform, Animated, ActivityIndicator } from 'react-native';
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
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { LanguageProvider } from "./context/LanguageContext";
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
import { Ionicons } from '@expo/vector-icons';
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
    setTimeout(() => {
      this.setState({ hasError: false, error: null });
    }, 300);
  }

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

const SplashScreen = () => {
  const scaleAnim = React.useRef(new Animated.Value(0.85)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  return (
    <View style={splashStyles.container}>
      <Animated.View style={[splashStyles.logoWrapper, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={splashStyles.iconBadge}>
          <Ionicons name="restaurant" size={48} color="#FFFFFF" />
        </View>
        <Text style={splashStyles.title}>Zerra Food Hub</Text>
        <Text style={splashStyles.subtitle}>Zero Waste, Full Bellies 🌱</Text>
        <ActivityIndicator size="small" color="#A7F3D0" style={{ marginTop: 28 }} />
      </Animated.View>
    </View>
  );
};

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C7B50',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#86EFAC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A7F3D0',
    marginTop: 6,
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();
  const navigation = useNavigation<any>();
  const [isSplashing, setIsSplashing] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashing(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!isSplashing && !loading) {
      if (user) {
        navigation.navigate("Home" as never);
      } else {
        navigation.navigate("Auth" as never);
      }
    }
  }, [isSplashing, loading, user, navigation]);

  if (isSplashing) {
    return <SplashScreen />;
  }

  return (
    <Layout>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? "Home" : "Auth"}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Expired" component={Expired} />
        <Stack.Screen name="FoodDetail" component={FoodDetail} />
        <Stack.Screen name="PostFood" component={PostFood} />
        <Stack.Screen name="Activity" component={Activity} />
        <Stack.Screen name="Profile" component={Activity} />
        <Stack.Screen name="NGOs" component={NGOs} />
        <Stack.Screen name="NotFound" component={NotFound} />
      </Stack.Navigator>
    </Layout>
  );
};

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
          <LanguageProvider>
            <NotificationProvider>
              <TransactionProvider>
                <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#1C7B50' }}>
                  <NavigationContainer>
                    <AppContent />
                  </NavigationContainer>
                </View>
              </TransactionProvider>
            </NotificationProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;

const styles = StyleSheet.create({});
