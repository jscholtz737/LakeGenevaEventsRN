import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import { Image } from "expo-image";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderProps = {
  onDateChange?: (date: Date) => void;
};

type WeatherState = {
  iconCode: string;
  isDay: boolean;
  tempF: number;
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
  return `${dayName}, ${month} ${day} `;
}

function startOfDay(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

const WEATHER_API_KEY = Constants.expoConfig?.extra?.weatherApiKey;

const WEATHER_ICON_ASSETS: Record<string, { day: number; night: number }> = {
  "113": {
    day: require("../assets/images/64x64/day/113.png"),
    night: require("../assets/images/64x64/night/113.png"),
  },
  "116": {
    day: require("../assets/images/64x64/day/116.png"),
    night: require("../assets/images/64x64/night/116.png"),
  },
  "119": {
    day: require("../assets/images/64x64/day/119.png"),
    night: require("../assets/images/64x64/night/119.png"),
  },
  "122": {
    day: require("../assets/images/64x64/day/122.png"),
    night: require("../assets/images/64x64/night/122.png"),
  },
  "143": {
    day: require("../assets/images/64x64/day/143.png"),
    night: require("../assets/images/64x64/night/143.png"),
  },
  "176": {
    day: require("../assets/images/64x64/day/176.png"),
    night: require("../assets/images/64x64/night/176.png"),
  },
  "179": {
    day: require("../assets/images/64x64/day/179.png"),
    night: require("../assets/images/64x64/night/179.png"),
  },
  "182": {
    day: require("../assets/images/64x64/day/182.png"),
    night: require("../assets/images/64x64/night/182.png"),
  },
  "185": {
    day: require("../assets/images/64x64/day/185.png"),
    night: require("../assets/images/64x64/night/185.png"),
  },
  "200": {
    day: require("../assets/images/64x64/day/200.png"),
    night: require("../assets/images/64x64/night/200.png"),
  },
  "227": {
    day: require("../assets/images/64x64/day/227.png"),
    night: require("../assets/images/64x64/night/227.png"),
  },
  "230": {
    day: require("../assets/images/64x64/day/230.png"),
    night: require("../assets/images/64x64/night/230.png"),
  },
  "248": {
    day: require("../assets/images/64x64/day/248.png"),
    night: require("../assets/images/64x64/night/248.png"),
  },
  "260": {
    day: require("../assets/images/64x64/day/260.png"),
    night: require("../assets/images/64x64/night/260.png"),
  },
  "263": {
    day: require("../assets/images/64x64/day/263.png"),
    night: require("../assets/images/64x64/night/263.png"),
  },
  "266": {
    day: require("../assets/images/64x64/day/266.png"),
    night: require("../assets/images/64x64/night/266.png"),
  },
  "281": {
    day: require("../assets/images/64x64/day/281.png"),
    night: require("../assets/images/64x64/night/281.png"),
  },
  "284": {
    day: require("../assets/images/64x64/day/284.png"),
    night: require("../assets/images/64x64/night/284.png"),
  },
  "293": {
    day: require("../assets/images/64x64/day/293.png"),
    night: require("../assets/images/64x64/night/293.png"),
  },
  "296": {
    day: require("../assets/images/64x64/day/296.png"),
    night: require("../assets/images/64x64/night/296.png"),
  },
  "299": {
    day: require("../assets/images/64x64/day/299.png"),
    night: require("../assets/images/64x64/night/299.png"),
  },
  "302": {
    day: require("../assets/images/64x64/day/302.png"),
    night: require("../assets/images/64x64/night/302.png"),
  },
  "305": {
    day: require("../assets/images/64x64/day/305.png"),
    night: require("../assets/images/64x64/night/305.png"),
  },
  "308": {
    day: require("../assets/images/64x64/day/308.png"),
    night: require("../assets/images/64x64/night/308.png"),
  },
  "311": {
    day: require("../assets/images/64x64/day/311.png"),
    night: require("../assets/images/64x64/night/311.png"),
  },
  "314": {
    day: require("../assets/images/64x64/day/314.png"),
    night: require("../assets/images/64x64/night/314.png"),
  },
  "317": {
    day: require("../assets/images/64x64/day/317.png"),
    night: require("../assets/images/64x64/night/317.png"),
  },
  "320": {
    day: require("../assets/images/64x64/day/320.png"),
    night: require("../assets/images/64x64/night/320.png"),
  },
  "323": {
    day: require("../assets/images/64x64/day/323.png"),
    night: require("../assets/images/64x64/night/323.png"),
  },
  "326": {
    day: require("../assets/images/64x64/day/326.png"),
    night: require("../assets/images/64x64/night/326.png"),
  },
  "329": {
    day: require("../assets/images/64x64/day/329.png"),
    night: require("../assets/images/64x64/night/329.png"),
  },
  "332": {
    day: require("../assets/images/64x64/day/332.png"),
    night: require("../assets/images/64x64/night/332.png"),
  },
  "335": {
    day: require("../assets/images/64x64/day/335.png"),
    night: require("../assets/images/64x64/night/335.png"),
  },
  "338": {
    day: require("../assets/images/64x64/day/338.png"),
    night: require("../assets/images/64x64/night/338.png"),
  },
  "350": {
    day: require("../assets/images/64x64/day/350.png"),
    night: require("../assets/images/64x64/night/350.png"),
  },
  "353": {
    day: require("../assets/images/64x64/day/353.png"),
    night: require("../assets/images/64x64/night/353.png"),
  },
  "356": {
    day: require("../assets/images/64x64/day/356.png"),
    night: require("../assets/images/64x64/night/356.png"),
  },
  "359": {
    day: require("../assets/images/64x64/day/359.png"),
    night: require("../assets/images/64x64/night/359.png"),
  },
  "362": {
    day: require("../assets/images/64x64/day/362.png"),
    night: require("../assets/images/64x64/night/362.png"),
  },
  "365": {
    day: require("../assets/images/64x64/day/365.png"),
    night: require("../assets/images/64x64/night/365.png"),
  },
  "368": {
    day: require("../assets/images/64x64/day/368.png"),
    night: require("../assets/images/64x64/night/368.png"),
  },
  "371": {
    day: require("../assets/images/64x64/day/371.png"),
    night: require("../assets/images/64x64/night/371.png"),
  },
  "374": {
    day: require("../assets/images/64x64/day/374.png"),
    night: require("../assets/images/64x64/night/374.png"),
  },
  "377": {
    day: require("../assets/images/64x64/day/377.png"),
    night: require("../assets/images/64x64/night/377.png"),
  },
  "386": {
    day: require("../assets/images/64x64/day/386.png"),
    night: require("../assets/images/64x64/night/386.png"),
  },
  "389": {
    day: require("../assets/images/64x64/day/389.png"),
    night: require("../assets/images/64x64/night/389.png"),
  },
  "392": {
    day: require("../assets/images/64x64/day/392.png"),
    night: require("../assets/images/64x64/night/392.png"),
  },
  "395": {
    day: require("../assets/images/64x64/day/395.png"),
    night: require("../assets/images/64x64/night/395.png"),
  },
};

function extractIconCode(iconUrl: string) {
  const match = iconUrl.match(/\/(\d+)\.png$/);
  return match?.[1] ?? null;
}

function formatTemperature(tempF: number) {
  return `${Math.round(tempF)}°F`;
}

export default function Header({ onDateChange }: HeaderProps) {
  const [isIOSPickerOpen, setIsIOSPickerOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(() =>
    startOfDay(new Date()),
  );
  const [weather, setWeather] = React.useState<WeatherState | null>(null);

  const selectDate = (date: Date) => {
    const normalizedDate = startOfDay(date);
    setSelectedDate(normalizedDate);
    onDateChange?.(normalizedDate);
  };

  React.useEffect(() => {
    if (!WEATHER_API_KEY) {
      return;
    }

    let isCancelled = false;

    const loadWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=53147&aqi=no`,
        );

        if (!response.ok) {
          throw new Error(
            `Weather request failed with status ${response.status}`,
          );
        }

        const payload = await response.json();
        const iconCode = extractIconCode(
          payload.current?.condition?.icon ?? "",
        );

        if (!iconCode || !WEATHER_ICON_ASSETS[iconCode] || isCancelled) {
          return;
        }

        setWeather({
          iconCode,
          isDay: payload.current?.is_day === 1,
          tempF: payload.current?.temp_f,
        });
      } catch (error) {
        console.warn("Unable to load weather", error);
      }
    };

    void loadWeather();

    return () => {
      isCancelled = true;
    };
  }, []);

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
        <Pressable
          onPress={openNativeDatePicker}
          style={styles.dropdownTrigger}
        >
          <Text style={styles.dropdownLabel}>
            {formatDateLabel(selectedDate)}
          </Text>
          <Text style={styles.caret}>▾</Text>
        </Pressable>
        <View style={styles.sideSpace} />
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
    justifyContent: "space-between",
    paddingHorizontal: 12,
    position: "relative",
  },
  sideSpace: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
  },
  dropdownTrigger: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 38,
    minWidth: 190,
    paddingHorizontal: 12,
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
    height: 28,
    width: 28,
  },
  weatherTemp: {
    color: "#10243A",
    fontSize: 11,
    fontWeight: "600",
    marginTop: -2,
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
