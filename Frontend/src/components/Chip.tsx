import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Chip({ label, active, onClick }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.chip, active ? styles.chipActive : styles.chipDefault]}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active ? styles.textActive : styles.textDefault]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  chipDefault: {
    backgroundColor: '#f6f4ec',
  },
  chipActive: {
    backgroundColor: '#309267',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textDefault: {
    color: '#5c7066',
  },
  textActive: {
    color: '#ffffff',
  },
});

