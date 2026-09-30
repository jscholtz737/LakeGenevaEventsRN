import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/use-theme";

/**
 * @param {{
 *   title?: string,
 *   location?: string,
 *   time?: string,
 *   imageUri?: string,
 *   style?: import("react-native").StyleProp<import("react-native").ViewStyle>,
 *   emptyMessage?: string,
 *   emptySubmessage?: string,
 * }} props
 */
export default function EventCard({
  title,
  location,
  time,
  imageUri,
  style,
  emptyMessage,
  emptySubmessage,
}) {
  const { colors } = useTheme();

  if (emptyMessage) {
    return (
      <View
        style={[
          styles.card,
          styles.emptyCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        <Text
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1}
          minimumFontScale={0.7}
          numberOfLines={1}
          style={[styles.emptyMessage, { color: colors.text }]}
        >
          {emptyMessage}
        </Text>
        {emptySubmessage ? (
          <Text
            style={[
              styles.location,
              styles.emptySubmessage,
              { color: colors.mutedText },
            ]}
          >
            {emptySubmessage}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Image
        source={{ uri: imageUri }}
        style={[
          styles.eventImage,
          { backgroundColor: colors.imagePlaceholder },
        ]}
        contentFit="cover"
        placeholder={{ color: colors.imagePlaceholder }}
        transition={200}
      />
      <View style={styles.infoContainer}>
        <Text
          ellipsizeMode="tail"
          maxFontSizeMultiplier={1}
          numberOfLines={2}
          style={[styles.title, { color: colors.text }]}
        >
          {title}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.location, { color: colors.mutedText }]}
        >
          {location}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={[styles.time, { color: colors.text }]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 5,
  },
  eventImage: {
    aspectRatio: 1,
    borderRadius: 10,
    width: "25%",
  },
  emptyCard: {
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 92,
  },
  emptyMessage: {
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    textAlign: "center",
  },
  emptySubmessage: {
    textAlign: "center",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  location: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 6,
  },
  timeContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
  },
  time: {
    fontSize: 14,
    fontWeight: "600",
  },
});
