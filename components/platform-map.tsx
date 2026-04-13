import React from "react";
import { StyleSheet, Text, View } from "react-native";

type PlatformMapFallbackProps = {
  activeEventId?: string | null;
  events?: unknown[];
};

export default function PlatformMapFallback(_props: PlatformMapFallbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map is unavailable on this platform.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
  },
});
