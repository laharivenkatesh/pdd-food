import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import React, { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';

export default function OtaUpdateModal() {
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function checkOtaUpdate() {
      try {
        if (__DEV__) return;
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setTimeout(() => {
            setShowModal(true);
          }, 2000);
        }
      } catch (e) {
        console.warn("OTA update check error:", e);
      }
    }
    checkOtaUpdate();
  }, []);

  const handleUpdateAndRestart = async () => {
    setIsUpdating(true);
    try {
      await Updates.reloadAsync();
    } catch {
      setIsUpdating(false);
      setShowModal(false);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#6B7280" />
        </TouchableOpacity>

        <View style={styles.headerBadge}>
          <View style={styles.sparkleIcon}>
            <Ionicons name="sparkles" size={28} color="#16A34A" />
          </View>
          <Text style={styles.badgeText}>OTA UPDATE AVAILABLE</Text>
        </View>

        <View style={styles.textContent}>
          <Text style={styles.title}>New Update Ready! 🚀</Text>
          <Text style={styles.description}>
            A fresh Over-The-Air update for Zerra Food Hub is ready to install with performance improvements.
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <View style={styles.highlightItem}>
            <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
            <Text style={styles.highlightText}>Instant live sync & bug fixes</Text>
          </View>
          <View style={styles.highlightItem}>
            <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
            <Text style={styles.highlightText}>No full APK download required</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={handleUpdateAndRestart} 
            disabled={isUpdating}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>
              {isUpdating ? "Downloading Update..." : "Update & Restart App ↗"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDismiss} disabled={isUpdating} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Remind Me Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 380,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  headerBadge: {
    alignItems: 'center',
    gap: 8,
  },
  sparkleIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 1,
  },
  textContent: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  highlightBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  actions: {
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 13,
  },
});
