import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/use-theme";
import { useTraffic } from "../services/traffic-api";
import {
  WEATHER_ICON_ASSETS,
  formatTemperature,
  useWeather,
} from "../services/weather-api";
import TrafficGauge from "./traffic-gauge";

type HeaderProps = {
  selectedDate: Date;
  onDateChange?: (date: Date) => void;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

function addDays(date: Date, count: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + count);
  return result;
}

export default function Header({ selectedDate, onDateChange }: HeaderProps) {
  const { colors, theme } = useTheme();
  const [isIOSPickerOpen, setIsIOSPickerOpen] = React.useState(false);
  const weather = useWeather();
  const traffic = useTraffic();
  const minimumDate = startOfDay(new Date());
  const maximumDate = addDays(minimumDate, 45);

  const selectDate = (date: Date) => {
    const normalizedDate = startOfDay(date);
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
        minimumDate,
        maximumDate,
        value: selectedDate,
        themeVariant: theme,
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
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: colors.surface }]}
    >
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <View style={styles.leftContainer}>
          <Pressable
            onPress={openNativeDatePicker}
            style={styles.dropdownTrigger}
          >
            <View style={styles.dateContainer}>
              <Text style={[styles.dayName, { color: colors.text }]}>
                {formatDateLabel(selectedDate).dayName}
              </Text>
              <Text style={[styles.monthDay, { color: colors.text }]}>
                {formatDateLabel(selectedDate).monthDay}
              </Text>
            </View>
            <Text style={[styles.caret, { color: colors.mutedText }]}>▾</Text>
          </Pressable>
        </View>
        <View
          style={[styles.divider, { backgroundColor: colors.headerDivider }]}
        />
        <View style={styles.rightContainer}>
          <View style={styles.sideSpace}>
            {weather && weatherIconSource ? (
              <View style={styles.weatherContainer}>
                <Image source={weatherIconSource} style={styles.weatherIcon} />
                <Text style={[styles.weatherTemp, { color: colors.text }]}>
                  {formatTemperature(weather.tempF)}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.conditionsContainer}>
            <Text style={[styles.conditionsLabel, { color: colors.text }]}>
              {"Current\nConditions"}
            </Text>
          </View>
          <View style={styles.sideSpace}>
            <View style={styles.gaugeContainer}>
              <TrafficGauge
                value={traffic.value}
                isSuccess={traffic.isSuccess}
              />
              <Text style={[styles.gaugeLabel, { color: colors.text }]}>
                Congestion
              </Text>
            </View>
          </View>
        </View>
        {Platform.OS === "ios" && isIOSPickerOpen ? (
          <View
            style={[
              styles.pickerPanel,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.divider,
              },
            ]}
          >
            <DateTimePicker
              mode="date"
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              value={selectedDate}
              display="inline"
              themeVariant={theme}
              onChange={onIOSDateChange}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const NAV_BAR_HEIGHT = 56;
const styles = StyleSheet.create({
  safeArea: {
    zIndex: 20,
  },
  navBar: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: NAV_BAR_HEIGHT,
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    position: "relative",
  },
  leftContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingRight: 8,
  },
  rightContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 12,
  },
  sideSpace: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
  },
  conditionsContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  divider: {
    height: 32,
    marginRight: 12,
    width: 2,
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
    fontSize: 26,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  monthDay: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  dropdownLabel: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  caret: {
    fontSize: 42,
    marginLeft: 8,
    marginTop: 1,
  },
  weatherContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  weatherIcon: {
    height: 40,
    width: 40,
  },
  weatherTemp: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: -3,
  },
  conditionsLabel: {
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "600",
    lineHeight: 12,
    textAlign: "center",
  },
  gaugeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeLabel: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 12,
    marginTop: -2,
    textAlign: "center",
  },
  pickerPanel: {
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
