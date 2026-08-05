import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 2700);
    return () => clearTimeout(fadeTimer);
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Text style={{ fontSize: 50 }}>🍱</Text>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Ionicons name="leaf" size={32} color="#34D399" />
            <Text style={styles.titleText}>Zerra</Text>
          </View>
          <Text style={styles.subtitleText}>
            Connecting Communities, Saving Meals
          </Text>
        </View>

        <View style={styles.loaderRow}>
          <View style={[styles.dot, { backgroundColor: '#34D399' }]} />
          <View style={[styles.dot, { backgroundColor: '#6EE7B7' }]} />
          <View style={[styles.dot, { backgroundColor: '#4ADE80' }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>SECURE GREEN TECHNOLOGY</Text>
        <Text style={styles.footerCopy}>
          © {new Date().getFullYear()} Zerra. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#022C22',
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '85%',
    maxWidth: 340,
    gap: 24,
  },
  logoContainer: {
    width: 128,
    height: 128,
    borderRadius: 40,
    backgroundColor: 'rgba(6, 78, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#34D399',
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(167, 243, 208, 0.7)',
    textAlign: 'center',
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
    gap: 4,
  },
  footerBrand: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(16, 185, 129, 0.6)',
  },
  footerCopy: {
    fontSize: 9,
    color: 'rgba(167, 243, 208, 0.4)',
  },
});
