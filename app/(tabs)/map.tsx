import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import EventCard from "../../components/event-card";
import Header from "../../components/header";
import PlatformMap from "../../components/platform-map";
import { useEvents } from "../../hooks/use-events";

type EventMapItem = {
  id: string;
  imageUri: string;
  latitude: number | null;
  location: string;
  longitude: number | null;
  name: string;
  startDate: Date | null;
  time: string;
};

function startOfDay(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

function isSameDay(left: Date | null, right: Date) {
  if (!(left instanceof Date)) {
    return false;
  }

  return startOfDay(left).getTime() === startOfDay(right).getTime();
}

export default function MapScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const cardWidth = Math.max(Dimensions.get("window").width - 32, 280);
  const snapInterval = cardWidth + 16;
  const [selectedDate, setSelectedDate] = React.useState(() =>
    startOfDay(new Date()),
  );
  const [activeEventId, setActiveEventId] = React.useState<string | null>(null);
  const flatListRef = React.useRef<FlatList<EventMapItem>>(null);
  const { events } = useEvents() as { events: EventMapItem[] };

  const mapEvents = React.useMemo(
    () =>
      events.filter(
        (event: EventMapItem) =>
          isSameDay(event.startDate, selectedDate) &&
          typeof event.latitude === "number" &&
          typeof event.longitude === "number",
      ),
    [events, selectedDate],
  );

  const handleScroll = React.useCallback(
    (event: any) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const cardIndex = Math.round(scrollPosition / snapInterval);
      if (cardIndex >= 0 && cardIndex < mapEvents.length) {
        setActiveEventId(mapEvents[cardIndex].id);
      }
    },
    [mapEvents, snapInterval],
  );

  const handleEventPress = React.useCallback(
    (eventId: string) => {
      const index = mapEvents.findIndex((event) => event.id === eventId);

      if (index !== -1) {
        setActiveEventId(eventId);
        flatListRef.current?.scrollToIndex({ animated: true, index });
      }
    },
    [mapEvents],
  );

  React.useEffect(() => {
    if (mapEvents.length > 0 && !activeEventId) {
      setActiveEventId(mapEvents[0].id);
    }
  }, [mapEvents, activeEventId]);

  return (
    <View style={styles.screen}>
      <Header onDateChange={setSelectedDate} />
      <View style={styles.mapContainer}>
        <PlatformMap
          activeEventId={activeEventId}
          events={mapEvents}
          onEventPress={handleEventPress}
        />
      </View>
      {!!mapEvents.length && (
        <View style={[styles.carouselContainer, { bottom: tabBarHeight - 50 }]}>
          <FlatList
            ref={flatListRef}
            data={mapEvents}
            decelerationRate="fast"
            disableIntervalMomentum
            horizontal
            keyExtractor={(event) => event.id}
            onMomentumScrollEnd={handleScroll}
            snapToAlignment="start"
            snapToInterval={snapInterval}
            renderItem={({ item }) => (
              <EventCard
                title={item.name}
                location={item.location}
                time={item.time}
                imageUri={item.imageUri}
                style={[styles.mapEventCard, { width: cardWidth }]}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  carouselContainer: {
    left: 0,
    position: "absolute",
    right: 0,
  },
  carouselContent: {
    paddingHorizontal: 8,
  },
  mapEventCard: {
    marginHorizontal: 8,
  },
});
