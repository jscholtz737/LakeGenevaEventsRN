import Constants from "expo-constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CHICAGO_COORDS = {
  latitude: 41.8781,
  longitude: -87.6298,
};

const GOOGLE_MAPS_API_KEY =
  Constants.expoConfig?.extra?.googleMapsApiKey ||
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function PlatformMapWeb() {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.messageTitle}>Google Maps key is missing</Text>
        <Text style={styles.messageText}>
          Add GOOGLE_MAPS_API_KEY to your .env file.
        </Text>
      </View>
    );
  }

  const mapSrc =
    `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}` +
    `&center=${CHICAGO_COORDS.latitude},${CHICAGO_COORDS.longitude}&zoom=11&maptype=roadmap`;

  return (
    <View style={styles.container}>
      <iframe
        title="Google Map"
        src={mapSrc}
        style={styles.iframe as unknown as React.CSSProperties}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iframe: {
    borderWidth: 0,
    flex: 1,
    height: "100%",
    width: "100%",
  },
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  messageText: {
    fontSize: 14,
    textAlign: "center",
  },
});
