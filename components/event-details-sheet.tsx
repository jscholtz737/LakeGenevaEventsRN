import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React from "react";
import {
  Animated,
  type LayoutChangeEvent,
  Linking,
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
import { useTheme } from "../hooks/use-theme";

type EventDetailsSheetProps = {
  description?: string;
  imageUri?: string;
  link?: string;
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
  link,
  locationDetails,
  onClose,
  startDate,
  time,
  title,
  visible,
}: EventDetailsSheetProps) {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [imageAspectRatio, setImageAspectRatio] = React.useState(1);
  const [detailsHeight, setDetailsHeight] = React.useState(0);
  const topBuffer =
    Platform.OS === "android"
      ? Math.max(72, insets.top + 28)
      : Math.max(56, insets.top + 12);
  const sheetHeight = height - topBuffer;
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
  const safeLink =
    typeof link === "string" && link.trim().length > 0 ? link.trim() : null;
  const maximumImageWidth = width * 0.7;
  const nonImageVerticalSpace = 118;
  const availableImageHeight = Math.max(
    0,
    sheetHeight - detailsHeight - nonImageVerticalSpace,
  );
  const maximumImageHeight = Math.min(sheetHeight * 0.3, availableImageHeight);
  const displayedImageWidth = Math.min(
    maximumImageWidth,
    maximumImageHeight * imageAspectRatio,
  );
  const displayedImageHeight = displayedImageWidth / imageAspectRatio;

  const openEventLink = React.useCallback(() => {
    if (safeLink) void Linking.openURL(safeLink);
  }, [safeLink]);

  const handleDetailsLayout = React.useCallback((event: LayoutChangeEvent) => {
    const nextHeight = Math.ceil(event.nativeEvent.layout.height);
    setDetailsHeight((currentHeight) =>
      currentHeight === nextHeight ? currentHeight : nextHeight,
    );
  }, []);

  React.useEffect(() => {
    setImageAspectRatio(1);
  }, [safeImageUri]);

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
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <Pressable onPress={onClose} style={styles.backdrop} />
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              height: sheetHeight,
              marginTop: topBuffer,
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={[styles.grabber, { backgroundColor: colors.grabber }]} />
          {safeImageUri ? (
            <View
              style={[
                styles.eventImageFrame,
                {
                  backgroundColor: colors.imagePlaceholder,
                  height: displayedImageHeight,
                  width: displayedImageWidth,
                },
              ]}
            >
              <Image
                source={{ uri: safeImageUri }}
                style={styles.eventImage}
                contentFit="contain"
                transition={200}
                onLoad={(e) => {
                  const { width: w, height: h } = e.source;
                  if (w > 0 && h > 0) setImageAspectRatio(w / h);
                }}
              />
            </View>
          ) : null}
          <View onLayout={handleDetailsLayout} style={styles.details}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {locationDetails ? (
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={colors.iconAccent}
                />
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {locationDetails}
                </Text>
              </View>
            ) : null}
            {locationDetails && formattedStartDate ? (
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            ) : null}
            {formattedStartDate ? (
              <View style={styles.locationRow}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={colors.iconAccent}
                />
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {formattedStartDate}
                </Text>
              </View>
            ) : null}
            {formattedStartDate && formattedTime ? (
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            ) : null}
            {formattedTime ? (
              <View style={styles.locationRow}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={colors.iconAccent}
                />
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {formattedTime}
                </Text>
              </View>
            ) : null}
            {formattedTime && safeDescription ? (
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            ) : null}
            {safeDescription ? (
              <View style={styles.locationRow}>
                <Ionicons
                  name="book-outline"
                  size={24}
                  color={colors.iconAccent}
                />
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {safeDescription}
                </Text>
              </View>
            ) : null}
            {safeDescription && safeLink ? (
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            ) : null}
            {safeLink ? (
              <View style={styles.locationRow}>
                <Ionicons
                  name="open-outline"
                  size={24}
                  color={colors.iconAccent}
                />
                <Pressable
                  accessibilityRole="link"
                  onPress={openEventLink}
                  style={styles.linkPressable}
                >
                  <Text
                    style={[
                      styles.locationText,
                      styles.linkText,
                      { color: colors.text },
                    ]}
                  >
                    More information
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  grabber: {
    alignSelf: "center",
    borderRadius: 2,
    height: 4,
    marginBottom: 16,
    width: 44,
  },
  eventImageFrame: {
    alignSelf: "center",
    borderRadius: 20,
    elevation: 4,
    marginBottom: 50,
    shadowColor: "#10243A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
  eventImage: {
    borderRadius: 20,
    width: "100%",
    height: "100%",
  },
  details: {
    alignSelf: "stretch",
  },
  title: {
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
    flexShrink: 1,
    fontSize: 16,
    marginLeft: 20,
    textAlign: "left",
  },
  linkPressable: {
    flexShrink: 1,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  divider: {
    alignSelf: "center",
    height: 1,
    marginTop: 14,
    width: "75%",
  },
});
