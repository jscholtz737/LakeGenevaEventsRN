import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const GENEVA_LAKE_COORDS = {
  latitude: 42.5722,
  longitude: -88.4975,
};

export default function PlatformMapNative() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...GENEVA_LAKE_COORDS,
          latitudeDelta: 0.3,
          longitudeDelta: 0.1,
        }}
      ></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
