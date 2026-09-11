import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

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
  if (emptyMessage) {
    return (
      <View style={[styles.card, styles.emptyCard, style]}>
        <Text
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1}
          minimumFontScale={0.7}
          numberOfLines={1}
          style={styles.emptyMessage}
        >
          {emptyMessage}
        </Text>
        {emptySubmessage ? (
          <Text style={[styles.location, styles.emptySubmessage]}>
            {emptySubmessage}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.card, style]}>
      <Image
        source={{ uri: imageUri }}
        style={styles.eventImage}
        contentFit="cover"
        placeholder={{ color: "#31465A" }}
        transition={200}
      />
      <View style={styles.infoContainer}>
        <Text
          ellipsizeMode="tail"
          maxFontSizeMultiplier={1}
          numberOfLines={2}
          style={styles.title}
        >
          {title}
        </Text>
        <Text numberOfLines={2} style={styles.location}>
          {location}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#DCE4EC",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 5,
  },
  eventImage: {
    aspectRatio: 1,
    backgroundColor: "#31465A",
    borderRadius: 10,
    width: "25%",
  },
  emptyCard: {
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 92,
  },
  emptyMessage: {
    color: "#10243A",
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
    color: "#10243A",
    fontSize: 16,
    fontWeight: "700",
  },
  location: {
    color: "#4A5D73",
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
    color: "#10243A",
    fontSize: 14,
    fontWeight: "600",
  },
});
