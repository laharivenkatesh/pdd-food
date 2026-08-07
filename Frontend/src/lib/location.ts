import * as Location from 'expo-location';

export async function getReverseGeocodeAddress(lat: number, lng: number): Promise<string> {
  // 1. Try OpenStreetMap Nominatim reverse geocode
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ZerraFoodHub/1.0',
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    }
  } catch (err) {
    console.warn("Nominatim reverse geocode error:", err);
  }

  // 2. Try BigDataCloud reverse geocoding API
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (response.ok) {
      const data = await response.json();
      const parts = [
        data.locality || data.name,
        data.city || data.principalSubdivision,
        data.countryName,
      ].filter(Boolean);
      if (parts.length > 0) {
        return parts.join(", ");
      }
    }
  } catch (err) {
    console.warn("BigDataCloud geocode error:", err);
  }

  // 3. Fallback to Expo Native Location reverseGeocodeAsync
  try {
    if (typeof Location.reverseGeocodeAsync === 'function') {
      const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (places && places.length > 0) {
        const p = places[0];
        const parts = [
          p.name || p.streetNumber,
          p.street || p.district,
          p.city || p.subregion,
          p.region || p.postalCode,
        ].filter(Boolean);
        if (parts.length > 0) {
          return parts.join(", ");
        }
      }
    }
  } catch (err) {
    console.warn("Native reverse geocode error:", err);
  }

  return `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
}
