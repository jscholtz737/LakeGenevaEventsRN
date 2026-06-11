import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const GENEVA_LAKE_COORDS = {
  latitude: 42.5722,
  longitude: -88.4975,
};

const INITIAL_CAMERA = {
  center: GENEVA_LAKE_COORDS,
  heading: 0,
  pitch: 0,
  zoom: 11.3,
};

type MapEvent = {
  id: string;
  latitude: number;
  longitude: number;
  location?: string;
  name: string;
};

type PlatformMapNativeProps = {
  activeEventId?: string | null;
  events?: MapEvent[];
};

export default function PlatformMapNative({
  activeEventId,
  events = [],
}: PlatformMapNativeProps) {
  return (
    <View style={styles.container}>
      <MapView
        initialCamera={INITIAL_CAMERA}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
      >
        {events.map((event) => (
          <Marker
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            description={event.location}
            key={event.id}
            pinColor={event.id === activeEventId ? "#FF0000" : "#000099"}
            title={event.name}
          />
        ))}
      </MapView>
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
