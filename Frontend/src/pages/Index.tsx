import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from 'react';

const Index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Zerra Food Hub</Text>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCFBF8',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});
