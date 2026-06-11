import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

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

const POSITION_THRESHOLD = 0.01;

type PlatformMapNativeProps = {
  activeEventId?: string | null;
  events?: MapEvent[];
  onEventPress?: (eventId: string) => void;
  onMapMoved?: (moved: boolean) => void;
  resetKey?: number;
};

export default function PlatformMapNative({
  activeEventId,
  events = [],
  onEventPress,
  onMapMoved,
  resetKey,
}: PlatformMapNativeProps) {
  const mapViewRef = React.useRef<MapView>(null);
  const isResetting = React.useRef(false);

  React.useEffect(() => {
    if (!resetKey) return;
    isResetting.current = true;
    mapViewRef.current?.animateCamera(INITIAL_CAMERA, { duration: 600 });
    const timer = setTimeout(() => {
      isResetting.current = false;
    }, 900);
    return () => clearTimeout(timer);
  }, [resetKey]);

  const handleRegionChangeComplete = React.useCallback(
    (region: Region) => {
      if (isResetting.current) return;
      const latDiff = Math.abs(region.latitude - GENEVA_LAKE_COORDS.latitude);
      const lngDiff = Math.abs(region.longitude - GENEVA_LAKE_COORDS.longitude);
      onMapMoved?.(
        latDiff > POSITION_THRESHOLD || lngDiff > POSITION_THRESHOLD,
      );
    },
    [onMapMoved],
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        initialCamera={INITIAL_CAMERA}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {events.map((event) => (
          <Marker
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            description={event.location}
            key={
              Platform.OS === "android"
                ? `${event.id}-${event.id === activeEventId ? "active" : "inactive"}`
                : event.id
            }
            pinColor={event.id === activeEventId ? "#FF0000" : "#000099"}
            title={event.name}
            tracksViewChanges={
              Platform.OS === "android" && event.id === activeEventId
            }
            onPress={() => onEventPress?.(event.id)}
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
