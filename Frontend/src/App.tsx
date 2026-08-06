import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from "react";
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

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const App = () => {
  return (
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
  );
};

export default App;

const styles = StyleSheet.create({});
