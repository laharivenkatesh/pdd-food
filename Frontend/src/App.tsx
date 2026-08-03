import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import Dashboard from "./pages/Dashboard";
import Expired from "./pages/Expired";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner position="top-center" />
        {showSplash && <SplashScreen />}
        <NavigationContainer>
          <AuthProvider>
            <NotificationProvider>
              <TransactionProvider>
                <Layout>
                  <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Auth" component={Auth} />
                    <Stack.Screen name="Home">
                      {(props) => (
                        <RequireAuth>
                          <Home {...props} />
                        </RequireAuth>
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="Expired">
                      {(props) => (
                        <RequireAuth>
                          <Expired {...props} />
                        </RequireAuth>
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="FoodDetail">
                      {(props) => (
                        <RequireAuth>
                          <FoodDetail {...props} />
                        </RequireAuth>
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="Post">
                      {(props) => (
                        <RequireAuth>
                          <PostFood {...props} />
                        </RequireAuth>
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="Activity">
                      {(props) => (
                        <RequireAuth>
                          <Activity {...props} />
                        </RequireAuth>
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="NGOs">
                      {(props) => (
                        <RequireAuth>
                          <NGOs {...props} />
                        </RequireAuth>
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="Dashboard">
                      {(props) => (
                        <RequireAuth>
                          <Dashboard {...props} />
                        </RequireAuth>
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="NotFound" component={NotFound} />
                  </Stack.Navigator>
                </Layout>
              </TransactionProvider>
            </NotificationProvider>
          </AuthProvider>
        </NavigationContainer>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

