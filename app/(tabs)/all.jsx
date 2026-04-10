import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCard from "../../components/event-card";
import { firestore } from "../../lib/firebase";

const FALLBACK_IMAGE_URI =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80";

function formatEventTime(value) {
  if (!value) {
    return "TBD";
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return "TBD";
}

export default function AllTab() {
  const [events, setEvents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const eventsQuery = query(collection(firestore, "events"), orderBy("time"));

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const nextEvents = snapshot.docs.map((doc) => {
          const data = doc.data();

          const imageUri =
            typeof data.imageName === "string" &&
            data.imageName.startsWith("http")
              ? data.imageName
              : FALLBACK_IMAGE_URI;

          return {
            id: doc.id,
            description: data.description ?? "",
            endDate: data.endDate ?? null,
            imageName: data.imageName ?? "",
            imageUri,
            latitude: typeof data.latitude === "number" ? data.latitude : null,
            link: data.link ?? "",
            location: data.location ?? "Location TBD",
            locationDetails: data.locationDetails ?? "",
            longitude:
              typeof data.longitude === "number" ? data.longitude : null,
            name: data.name ?? "Untitled Event",
            recurring: data.recurring ?? "",
            startDate: data.startDate ?? null,
            time: formatEventTime(data.time),
          };
        });

        setEvents(nextEvents);
        setIsLoading(false);
      },
      () => {
        setEvents([]);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#204A72" />
          <Text style={styles.stateText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!events.length) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>No events found in Firestore.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventCard
            title={item.name}
            location={item.location}
            time={item.time}
            imageUri={item.imageUri}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  listContent: {
    paddingVertical: 8,
  },
  stateContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  stateText: {
    color: "#4A5D73",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
});
