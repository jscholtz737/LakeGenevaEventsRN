import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCard from "../../components/event-card";
import { useEvents } from "../../hooks/use-events";

function dateSortValue(value) {
  if (!(value instanceof Date)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return value.getTime();
}

function dateKey(value) {
  if (!(value instanceof Date)) {
    return "date-tbd";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateLabel(value) {
  if (!(value instanceof Date)) {
    return "Date TBD";
  }

  return value.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildSectionRows(events) {
  const sortedEvents = [...events].sort(
    (a, b) => dateSortValue(a.startDate) - dateSortValue(b.startDate),
  );

  const rows = [];
  let currentDateKey = null;

  sortedEvents.forEach((event) => {
    const nextDateKey = dateKey(event.startDate);

    if (nextDateKey !== currentDateKey) {
      rows.push({
        id: `header-${nextDateKey}`,
        type: "header",
        label: dateLabel(event.startDate),
      });
      currentDateKey = nextDateKey;
    }

    rows.push({
      id: event.id,
      type: "event",
      event,
    });
  });

  return rows;
}

export default function AllTab() {
  const { events, isLoading, error } = useEvents();
  const sectionRows = useMemo(() => buildSectionRows(events), [events]);
  const stickyHeaderIndices = useMemo(
    () =>
      sectionRows
        .map((item, index) => (item.type === "header" ? index : -1))
        .filter((index) => index >= 0),
    [sectionRows],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#204A72" />
          <Text style={styles.stateText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!events.length) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>
            {error
              ? "Unable to load events from database."
              : "No events found in database."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FlatList
        data={sectionRows}
        stickyHeaderIndices={stickyHeaderIndices}
        renderItem={({ item }) => {
          if (item.type === "header") {
            return <Text style={styles.dateHeader}>{item.label}</Text>;
          }

          return (
            <EventCard
              title={item.event.name}
              location={item.event.location}
              time={item.event.time}
              imageUri={item.event.imageUri}
            />
          );
        }}
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
    paddingBottom: 8,
  },
  dateHeader: {
    backgroundColor: "#F4F7FB",
    color: "#10243A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    marginHorizontal: 16,
    marginTop: 0,
    paddingBottom: 6,
    paddingTop: 12,
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
