import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

import { GOOGLE_MAP_DARK_STYLE } from "../constants/google-map-styles";
import { useTheme } from "../hooks/use-theme";

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
  const { theme } = useTheme();
  const mapViewRef = React.useRef<MapView>(null);
  const isResetting = React.useRef(false);
  const isDark = theme === "dark";

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
        customMapStyle={isDark ? GOOGLE_MAP_DARK_STYLE : []}
        initialCamera={INITIAL_CAMERA}
        key={theme}
        onRegionChangeComplete={handleRegionChangeComplete}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        userInterfaceStyle={theme}
      >
        {events.map((event) => {
          const isActive = event.id === activeEventId;

          return (
            <Marker
              coordinate={{
                latitude: event.latitude,
                longitude: event.longitude,
              }}
              key={
                Platform.OS === "android"
                  ? `${event.id}-${isActive ? "active" : "inactive"}`
                  : event.id
              }
              pinColor={isActive ? "#FF0000" : "#000099"}
              tracksViewChanges={Platform.OS === "android" && isActive}
              onPress={() => onEventPress?.(event.id)}
            />
          );
        })}
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
