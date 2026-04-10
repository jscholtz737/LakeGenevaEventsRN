import { Image, StyleSheet, Text, View } from "react-native";

export default function EventCard({ title, location, time, imageUri }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.eventImage} />
      <View style={styles.infoContainer}>
        <Text numberOfLines={2} style={styles.title}>
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
    height: 150,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  eventImage: {
    aspectRatio: 1,
    borderRadius: 10,
    width: "25%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 12,
  },
  title: {
    color: "#10243A",
    fontSize: 20,
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
    fontSize: 16,
    fontWeight: "600",
  },
});
