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

function ordinalSuffix(day) {
  const mod10 = day % 10;
  const mod100 = day % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return "st";
  }

  if (mod10 === 2 && mod100 !== 12) {
    return "nd";
  }

  if (mod10 === 3 && mod100 !== 13) {
    return "rd";
  }

  return "th";
}

function dateLabel(value) {
  if (!(value instanceof Date)) {
    return "Date TBD";
  }

  const weekday = value.toLocaleDateString([], {
    weekday: "long",
  });
  const month = value.toLocaleDateString([], {
    month: "long",
  });
  const day = value.getDate();

  return `${weekday}, ${month} ${day}${ordinalSuffix(day)}`;
}

function buildSectionRows(events) {
  const sortedEvents = [...events].sort(
    (a, b) => dateSortValue(a.startDate) - dateSortValue(b.startDate),
  );

  const rows = [];
  let index = 0;

  while (index < sortedEvents.length) {
    const firstEventForDate = sortedEvents[index];
    const currentDateKey = dateKey(firstEventForDate.startDate);
    const startIndex = index;

    while (
      index < sortedEvents.length &&
      dateKey(sortedEvents[index].startDate) === currentDateKey
    ) {
      index += 1;
    }

    const eventsForDate = sortedEvents.slice(startIndex, index);

    rows.push({
      id: `header-${currentDateKey}`,
      type: "header",
      label: dateLabel(firstEventForDate.startDate),
    });

    eventsForDate.forEach((event, eventIndexInGroup) => {
      rows.push({
        id: event.id,
        type: "event",
        event,
        hasMultipleEventsOnDate: eventsForDate.length > 1,
        eventIndexInGroup,
      });
    });
  }

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
              style={
                item.hasMultipleEventsOnDate
                  ? { marginTop: item.eventIndexInGroup === 0 ? 5 : 2 }
                  : null
              }
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
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "700",
    marginBottom: 0,
    marginHorizontal: 16,
    marginTop: 20,
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
