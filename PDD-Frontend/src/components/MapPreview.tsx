import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/context/LanguageContext';

interface MapPreviewProps {
  lat: number;
  lng: number;
  label?: string;
  height?: number;
  interactive?: boolean;
}

export default function MapPreview({ lat, lng, label, height = 128, interactive = false }: MapPreviewProps) {
  const { t } = useLanguage();
  return (
    <TouchableOpacity 
      onPress={() => openInGoogleMaps(lat, lng)}
      style={[styles.container, { height }]}
    >
      <View style={styles.content}>
        <Ionicons name="location-sharp" size={28} color="#16A34A" />
        <Text style={styles.label}>{label || t('viewLocationOnMaps')}</Text>
        <Text style={styles.subtext}>Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}</Text>
        <Text style={styles.actionText}>{t('tapToOpenMaps')}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function openInGoogleMaps(lat: number, lng: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  subtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
    marginTop: 6,
  },
});
