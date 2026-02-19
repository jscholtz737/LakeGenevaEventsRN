import { StyleSheet, Text, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          { color: colorScheme === "dark" ? "black" : "white" },
        ]}
      >
        search screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
  },
});
