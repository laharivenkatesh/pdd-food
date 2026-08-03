import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  // Trigger fade out slightly before the 3 seconds timer ends
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 2700); // Start fade-out at 2.7s
    return () => clearTimeout(fadeTimer);
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Decorative background glow rings */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Main glass card container */}
      <View style={styles.cardContainer}>
        {/* Animated Premium Logo Container */}
        <View style={styles.logoContainer}>
          <View style={styles.logoGlow} />
          <Image
            source={require("../../public/food_splash_logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Details */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Ionicons name="leaf" size={32} color="#34d399" />
            <Text style={styles.titleText}>Zerra</Text>
          </View>
          <Text style={styles.subtitleText}>
            Connecting Communities, Saving Meals
          </Text>
        </View>

        {/* Premium Pulsing Loader */}
        <View style={styles.loaderRow}>
          <View style={[styles.dot, { backgroundColor: '#34d399' }]} />
          <View style={[styles.dot, { backgroundColor: '#6ee7b7' }]} />
          <View style={[styles.dot, { backgroundColor: '#4ade80' }]} />
        </View>
      </View>

      {/* Footer Branding */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerBranding}>
          SECURE GREEN TECHNOLOGY
        </Text>
        <Text style={styles.footerCopyright}>
          © {new Date().getFullYear()} Zerra. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#022c22',
  },
  glowTop: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: 384,
    height: 384,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 192,
  },
  glowBottom: {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    width: 384,
    height: 384,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 192,
  },
  cardContainer: {
    alignItems: 'center',
    maxWidth: 384,
    width: '90%',
    paddingHorizontal: 24,
    paddingVertical: 40,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    position: 'relative',
    width: 128,
    height: 128,
    borderRadius: 40,
    backgroundColor: 'rgba(6, 78, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 24,
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#34d399',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(167, 243, 208, 0.7)',
    letterSpacing: 0.5,
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
  footerContainer: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
    gap: 4,
  },
  footerBranding: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(16, 185, 129, 0.6)',
  },
  footerCopyright: {
    fontSize: 9,
    color: 'rgba(167, 243, 208, 0.4)',
  },
});

