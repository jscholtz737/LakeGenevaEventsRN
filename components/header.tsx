import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTraffic } from "../services/traffic-api";
import {
  WEATHER_ICON_ASSETS,
  formatTemperature,
  useWeather,
} from "../services/weather-api";

type HeaderProps = {
  onDateChange?: (date: Date) => void;
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDateLabel(date: Date) {
  const dayName = WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return { dayName, monthDay: `${month} ${day}` };
}

function startOfDay(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

export default function Header({ onDateChange }: HeaderProps) {
  const [isIOSPickerOpen, setIsIOSPickerOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(() =>
    startOfDay(new Date()),
  );
  const weather = useWeather();
  const traffic = useTraffic();

  const selectDate = (date: Date) => {
    const normalizedDate = startOfDay(date);
    setSelectedDate(normalizedDate);
    onDateChange?.(normalizedDate);
  };

  const weatherIconSource =
    weather && WEATHER_ICON_ASSETS[weather.iconCode]
      ? WEATHER_ICON_ASSETS[weather.iconCode][weather.isDay ? "day" : "night"]
      : null;

  const openNativeDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode: "date",
        value: selectedDate,
        onChange: (event: DateTimePickerEvent, date?: Date) => {
          if (event.type === "set" && date) {
            selectDate(date);
          }
        },
      });
      return;
    }

    if (Platform.OS === "ios") {
      setIsIOSPickerOpen((value) => !value);
    }
  };

  const onIOSDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      selectDate(date);
      setIsIOSPickerOpen(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.navBar}>
        <View style={styles.leftContainer}>
          <Pressable
            onPress={openNativeDatePicker}
            style={styles.dropdownTrigger}
          >
            <View style={styles.dateContainer}>
              <Text style={styles.dayName}>
                {formatDateLabel(selectedDate).dayName}
              </Text>
              <Text style={styles.monthDay}>
                {formatDateLabel(selectedDate).monthDay}
              </Text>
            </View>
            <Text style={styles.caret}>▾</Text>
          </Pressable>
        </View>
        <View style={styles.divider} />
        <View style={styles.rightContainer}>
          <View style={styles.sideSpace}>
            {weather && weatherIconSource ? (
              <View style={styles.weatherContainer}>
                <Image source={weatherIconSource} style={styles.weatherIcon} />
                <Text style={styles.weatherTemp}>
                  {formatTemperature(weather.tempF)}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.sideSpace}>
            <Text
              style={[
                styles.trafficValue,
                traffic.isSuccess ? styles.trafficSuccess : styles.trafficError,
              ]}
            >
              {traffic.value}
            </Text>
          </View>
        </View>
        {Platform.OS === "ios" && isIOSPickerOpen ? (
          <View style={styles.pickerPanel}>
            <DateTimePicker
              mode="date"
              value={selectedDate}
              display="inline"
              themeVariant="light"
              onChange={onIOSDateChange}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const NAV_BAR_HEIGHT = 56;
const CENTER_GUTTER = 20;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
    zIndex: 20,
  },
  navBar: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomColor: "#E8EDF2",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: NAV_BAR_HEIGHT,
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    position: "relative",
  },
  leftContainer: {
    alignItems: "flex-start",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingRight: CENTER_GUTTER,
  },
  rightContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: CENTER_GUTTER,
  },
  sideSpace: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
  },
  divider: {
    backgroundColor: "#000000",
    height: 32,
    left: "50%",
    marginLeft: -0.5,
    position: "absolute",
    top: 12,
    width: 1,
  },
  dropdownTrigger: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    maxWidth: "100%",
    minHeight: 38,
    paddingHorizontal: 12,
  },
  dateContainer: {
    alignItems: "center",
    flexDirection: "column",
    flexShrink: 1,
    justifyContent: "center",
  },
  dayName: {
    color: "#10243A",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  monthDay: {
    color: "#10243A",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  dropdownLabel: {
    color: "#10243A",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  caret: {
    color: "#4A5D73",
    fontSize: 42,
    marginLeft: 8,
    marginTop: 1,
  },
  weatherContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  weatherIcon: {
    height: 36,
    width: 36,
  },
  weatherTemp: {
    color: "#10243A",
    fontSize: 12,
    fontWeight: "600",
    marginTop: -8,
  },
  trafficValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  trafficSuccess: {
    color: "#0B8F39",
  },
  trafficError: {
    color: "#B42318",
  },
  pickerPanel: {
    backgroundColor: "#ffffff",
    borderTopColor: "#E8EDF2",
    borderTopWidth: 1,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    right: 0,
    shadowColor: "#0A1C2F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    top: NAV_BAR_HEIGHT,
    zIndex: 50,
  },
});
