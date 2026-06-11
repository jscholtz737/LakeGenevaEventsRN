import { Image, StyleSheet, Text, View } from "react-native";

export default function EventCard({ title, location, time, imageUri, style }) {
  return (
    <View style={[styles.card, style]}>
      <Image source={{ uri: imageUri }} style={styles.eventImage} />
      <View style={styles.infoContainer}>
        <Text
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1}
          minimumFontScale={0.7}
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
    borderRadius: 10,
    width: "25%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  title: {
    color: "#10243A",
    fontSize: 18,
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
