import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../hooks/use-theme";

const ANDROID_PACKAGE = "com.josephscholtz.lakegenevaeventsrn";
const IOS_APP_STORE_ID = "6737480035";

function getRateAppUrl() {
  if (Platform.OS === "ios") {
    return `itms-apps://apps.apple.com/app/id${IOS_APP_STORE_ID}?action=write-review`;
  }

  if (Platform.OS === "android") {
    return `market://details?id=${ANDROID_PACKAGE}&showAllReviews=true`;
  }

  return `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&showAllReviews=true`;
}

function getRateAppFallbackUrl() {
  if (Platform.OS === "ios") {
    return `https://apps.apple.com/app/id${IOS_APP_STORE_ID}?action=write-review`;
  }

  return `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&showAllReviews=true`;
}

async function openRateApp() {
  const url = getRateAppUrl();
  const fallbackUrl = getRateAppFallbackUrl();

  try {
    await Linking.openURL(url);
  } catch {
    await Linking.openURL(fallbackUrl);
  }
}

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
        <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
        <Pressable
          accessibilityHint="Opens the store page to rate this app"
          accessibilityLabel="Rate this app"
          accessibilityRole="link"
          onPress={() => {
            void openRateApp();
          }}
          style={({ pressed }) => [
            styles.row,
            pressed ? styles.rowPressed : null,
          ]}
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            Rate this app
          </Text>
          <FontAwesome6
            color={colors.mutedText}
            name="arrow-up-right-from-square"
            size={18}
          />
        </Pressable>
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
  rowPressed: {
    opacity: 0.7,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    paddingRight: 12,
  },
});
