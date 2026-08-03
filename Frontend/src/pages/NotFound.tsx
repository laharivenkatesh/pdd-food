import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React, { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

const NotFound = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", route.name);
  }, [route.name]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Oops! Page not found</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.btn}>
          <Text style={styles.btnText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f4ec',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1e382b',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5c7066',
  },
  btn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#309267',
    borderRadius: 12,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default NotFound;

