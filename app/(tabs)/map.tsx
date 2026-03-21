import React from "react";
import { StyleSheet, View } from "react-native";
import Header from "../../components/header";
import PlatformMap from "../../components/platform-map";

export default function MapScreen() {
  return (
    <View style={styles.screen}>
      <Header />
      <View style={styles.mapContainer}>
        <PlatformMap />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
});
