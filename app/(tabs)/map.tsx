import React from "react";
import { StyleSheet, Text } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Text
      style={[
        styles.text,
        { color: colorScheme === "dark" ? "black" : "white" },
      ]}
    >
      map screen
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
});
