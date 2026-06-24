import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Animated,
  Image,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EventDetailsSheetProps = {
  description?: string;
  imageUri?: string;
  locationDetails?: string;
  onClose: () => void;
  startDate?: Date | string | number | null;
  time?: Date | string | number | null;
  title: string;
  visible: boolean;
};

function ordinalSuffix(day: number) {
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

function formatDisplayDate(value: Date | string | number | null | undefined) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const weekday = date.toLocaleDateString([], { weekday: "long" });
  const month = date.toLocaleDateString([], { month: "long" });
  const day = date.getDate();

  return `${weekday}, ${month} ${day}${ordinalSuffix(day)}`;
}

function formatDisplayTime(value: Date | string | number | null | undefined) {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  if (typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    return "";
  }

  const raw = value.trim();
  if (!raw) {
    return "";
  }

  const upper = raw.toUpperCase();
  const twelveHour = upper.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/);
  if (twelveHour) {
    const hour = String(Math.max(1, Math.min(12, Number(twelveHour[1]))));
    const minute = twelveHour[2];
    const meridiem = twelveHour[3];
    return `${hour}:${minute} ${meridiem}`;
  }

  const twentyFourHour = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (twentyFourHour) {
    const hour24 = Number(twentyFourHour[1]);
    const minute = twentyFourHour[2];
    const meridiem = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour12}:${minute} ${meridiem}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return raw;
}

export default function EventDetailsSheet({
  description,
  imageUri,
  locationDetails,
  onClose,
  startDate,
  time,
  title,
  visible,
}: EventDetailsSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topBuffer =
    Platform.OS === "android"
      ? Math.max(72, insets.top + 28)
      : Math.max(56, insets.top + 12);
  const translateY = React.useRef(new Animated.Value(0)).current;
  const formattedStartDate = formatDisplayDate(startDate);
  const formattedTime = formatDisplayTime(time);
  const safeDescription =
    typeof description === "string" && description.trim().length > 0
      ? description.trim()
      : "";
  const safeImageUri =
    typeof imageUri === "string" && imageUri.trim().length > 0
      ? imageUri
      : null;

  const resetPosition = React.useCallback(() => {
    translateY.stopAnimation();
    translateY.setValue(0);
  }, [translateY]);

  const closeWithSwipe = React.useCallback(() => {
    resetPosition();
    onClose();
  }, [onClose, resetPosition]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 4,
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          gestureState.dy > 4,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 90 || gestureState.vy > 1.2) {
            closeWithSwipe();
            return;
          }

          Animated.spring(translateY, {
            bounciness: 0,
            speed: 24,
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateY, {
            bounciness: 0,
            speed: 24,
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [closeWithSwipe, translateY],
  );

  React.useEffect(() => {
    resetPosition();
  }, [resetPosition, visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={styles.backdrop} />
        <Animated.View
          style={[
            styles.sheet,
            {
              height: height - topBuffer,
              marginTop: topBuffer,
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.grabber} />
          {safeImageUri ? (
            <View style={styles.eventImageFrame}>
              <Image
                source={{ uri: safeImageUri }}
                style={styles.eventImage}
                resizeMode="contain"
              />
            </View>
          ) : null}
          <Text style={styles.title}>{title}</Text>
          {locationDetails ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={24} color="#0B8F39" />
              <Text style={styles.locationText}>{locationDetails}</Text>
            </View>
          ) : null}
          {locationDetails && formattedStartDate ? (
            <View style={styles.divider} />
          ) : null}
          {formattedStartDate ? (
            <View style={styles.locationRow}>
              <Ionicons name="calendar-outline" size={24} color="#0B8F39" />
              <Text style={styles.locationText}>{formattedStartDate}</Text>
            </View>
          ) : null}
          {formattedStartDate && formattedTime ? (
            <View style={styles.divider} />
          ) : null}
          {formattedTime ? (
            <View style={styles.locationRow}>
              <Ionicons name="time-outline" size={24} color="#0B8F39" />
              <Text style={styles.locationText}>{formattedTime}</Text>
            </View>
          ) : null}
          {formattedTime && safeDescription ? (
            <View style={styles.divider} />
          ) : null}
          {safeDescription ? (
            <View style={styles.locationRow}>
              <Ionicons name="book-outline" size={24} color="#0B8F39" />
              <Text style={styles.locationText}>{safeDescription}</Text>
            </View>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.24)",
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  grabber: {
    alignSelf: "center",
    backgroundColor: "#C7D2DE",
    borderRadius: 2,
    height: 4,
    marginBottom: 16,
    width: 44,
  },
  eventImageFrame: {
    alignSelf: "center",
    width: "70%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 50,
    backgroundColor: "#F3F6F9",
    borderWidth: 1,
    borderColor: "#DCE4EC",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  title: {
    color: "#10243A",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 30,
  },
  locationRow: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    marginTop: 14,
  },
  locationText: {
    color: "#10243A",
    flexShrink: 1,
    fontSize: 16,
    marginLeft: 20,
    textAlign: "left",
  },
  divider: {
    alignSelf: "center",
    backgroundColor: "#DCE4EC",
    height: 1,
    marginTop: 14,
    width: "75%",
  },
});
