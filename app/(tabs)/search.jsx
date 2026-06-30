import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCard from "../../components/event-card";
import EventDetailsSheet from "../../components/event-details-sheet";
import { useEvents } from "../../hooks/use-events";

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.toLowerCase();
}

function eventSearchText(event) {
  return [
    normalizeText(event.name),
    normalizeText(event.location),
    normalizeText(event.locationDetails),
    normalizeText(event.description),
  ].join(" ");
}

export default function SearchTab() {
  const { events, isLoading, error } = useEvents();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventCardPress = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const clearSearch = () => {
    setQuery("");
    setSubmittedQuery("");
  };

  const handleSearchSubmit = useCallback(() => {
    setSubmittedQuery(query);
  }, [query]);

  const hasTypedQuery = normalizeText(query).trim().length > 0;
  const hasSubmittedQuery = normalizeText(submittedQuery).trim().length > 0;

  const filteredEvents = useMemo(() => {
    const tokens = normalizeText(submittedQuery)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!tokens.length) {
      return [];
    }

    return events.filter((event) => {
      const haystack = eventSearchText(event);
      return tokens.every((token) => haystack.includes(token));
    });
  }, [submittedQuery, events]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            placeholder="Search events"
            placeholderTextColor="#6B7D90"
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />
          {hasTypedQuery ? (
            <Pressable
              accessibilityLabel="Clear search"
              hitSlop={8}
              onPress={clearSearch}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>X</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#204A72" />
          <Text style={styles.stateText}>Loading events...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>
            Unable to load events from database.
          </Text>
        </View>
      ) : !hasSubmittedQuery ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>
            {hasTypedQuery
              ? "Press Enter to search for events."
              : "Type in the search bar to find events."}
          </Text>
        </View>
      ) : !filteredEvents.length ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>No matching events found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable onPress={() => handleEventCardPress(item)}>
              <EventCard
                title={item.name}
                location={item.location}
                time={item.time}
                imageUri={item.imageUri}
              />
            </Pressable>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      <EventDetailsSheet
        onClose={handleCloseSheet}
        description={selectedEvent?.description}
        imageUri={selectedEvent?.imageUri}
        locationDetails={selectedEvent?.locationDetails}
        startDate={selectedEvent?.startDate}
        time={selectedEvent?.time}
        title={selectedEvent?.name ?? ""}
        visible={selectedEvent !== null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  searchBarContainer: {
    backgroundColor: "#F4F7FB",
    borderBottomColor: "#DFE7EF",
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchInputWrapper: {
    position: "relative",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D3DDE8",
    borderRadius: 12,
    borderWidth: 1,
    color: "#10243A",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingRight: 40,
    paddingVertical: 10,
  },
  clearButton: {
    alignItems: "center",
    height: 22,
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -11 }],
    width: 22,
  },
  clearButtonText: {
    color: "#6B7D90",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 13,
  },
  listContent: {
    paddingBottom: 10,
    paddingTop: 8,
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
