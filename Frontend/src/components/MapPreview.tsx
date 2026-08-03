import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Linking } from 'react-native';
import MapView, { Marker } from "react-native-maps";

interface MapPreviewProps {
  lat: number;
  lng: number;
  label?: string;
  height?: string;
  interactive?: boolean;
}

const getHeightValue = (h?: string) => {
  if (h === "h-48") return 192;
  if (h === "h-64") return 256;
  if (h === "h-full") return "100%";
  return 128; // default h-32
};

export default function MapPreview({ lat, lng, label, height = "h-32", interactive = false }: MapPreviewProps) {
  const mapHeight = getHeightValue(height);

  return (
    <View style={[styles.container, { height: mapHeight }]}>
      <MapView
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={interactive}
        pitchEnabled={interactive}
        style={styles.map}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} title={label} />
      </MapView>
    </View>
  );
}

export function openInGoogleMaps(lat: number, lng: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  Linking.openURL(url);
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

