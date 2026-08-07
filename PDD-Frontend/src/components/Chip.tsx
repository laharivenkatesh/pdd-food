import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from 'react';

interface ChipProps {
  key?: React.Key;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Chip({ label, active, onClick }: ChipProps) {
  return (
    <TouchableOpacity 
      onPress={onClick} 
      style={[styles.chip, active ? styles.chipActive : styles.chipDefault]}
    >
      <Text style={[styles.text, active ? styles.textActive : styles.textDefault]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  chipDefault: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textDefault: {
    color: '#374151',
  },
  textActive: {
    color: '#FFFFFF',
  },
});
