import { StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../hooks/use-theme";

export default function SettingsTab() {
  const { colors, setTheme, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.pageTitle, { color: colors.text }]}>Settings</Text>
      <View
        style={[
          styles.list,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            Dark mode
          </Text>
          <Switch
            accessibilityLabel="Dark mode"
            ios_backgroundColor={colors.switchTrackOff}
            onValueChange={(value) => setTheme(value ? "dark" : "light")}
            thumbColor={colors.switchThumb}
            trackColor={{
              false: colors.switchTrackOff,
              true: colors.switchTrackOn,
            }}
            value={isDark}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  list: {
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    paddingRight: 12,
  },
});
