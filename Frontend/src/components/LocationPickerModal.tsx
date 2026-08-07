import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface LocationPickerModalProps {
  visible: boolean;
  initialLat: number;
  initialLng: number;
  onClose: () => void;
  onSelectLocation: (lat: number, lng: number, address: string) => void;
}

import { getReverseGeocodeAddress } from '@/lib/location';

export default function LocationPickerModal({
  visible,
  initialLat,
  initialLng,
  onClose,
  onSelectLocation,
}: LocationPickerModalProps) {
  const [selectedLat, setSelectedLat] = useState(initialLat || 13.0827);
  const [selectedLng, setSelectedLng] = useState(initialLng || 80.2707);
  const [address, setAddress] = useState("Loading address...");
  const [geocoding, setGeocoding] = useState(false);

  const updateAddress = async (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    setGeocoding(true);
    try {
      const formatted = await getReverseGeocodeAddress(lat, lng);
      setAddress(formatted);
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setGeocoding(false);
    }
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'location_selected') {
        updateAddress(data.lat, data.lng);
      }
    } catch (e) {
      console.warn("Location picker WebView message error:", e);
    }
  };

  const leafletHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
        .pin-hint {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: rgba(0,0,0,0.75);
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-family: sans-serif;
          font-size: 12px;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="pin-hint">📍 Tap or drag marker anywhere on map</div>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${initialLat || 13.0827}, ${initialLng || 80.2707}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: 'OpenStreetMap'
        }).addTo(map);

        var marker = L.marker([${initialLat || 13.0827}, ${initialLng || 80.2707}], {
          draggable: true
        }).addTo(map);

        function notifyLocation(lat, lng) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'location_selected',
              lat: lat,
              lng: lng
            }));
          }
        }

        marker.on('dragend', function(e) {
          var position = marker.getLatLng();
          notifyLocation(position.lat, position.lng);
        });

        map.on('click', function(e) {
          marker.setLatLng(e.latlng);
          notifyLocation(e.latlng.lat, e.latlng.lng);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Drag Pin on Map 📍</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Interactive Map WebView */}
        <WebView
          originWhitelist={['*']}
          source={{ html: leafletHtml }}
          onMessage={handleMessage}
          style={{ flex: 1 }}
        />

        {/* Selected Address Display Card & Confirm Button */}
        <View style={styles.footer}>
          <View style={styles.addressBox}>
            <Ionicons name="location" size={20} color="#16A34A" />
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>Selected Address:</Text>
              {geocoding ? (
                <ActivityIndicator size="small" color="#16A34A" style={{ alignSelf: 'flex-start' }} />
              ) : (
                <Text style={styles.addressText}>{address}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              onSelectLocation(selectedLat, selectedLng, address);
              onClose();
            }}
            style={styles.confirmBtn}
          >
            <Text style={styles.confirmBtnText}>Confirm Location 📍</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  closeBtn: {
    padding: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  addressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  confirmBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
