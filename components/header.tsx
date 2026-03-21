import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

type HeaderProps = {
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
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS[date.getMonth()];
  return `${dayName}, ${day} ${month}`;
}

function startOfDay(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

function isSameDay(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function getCalendarDays(monthDate: Date) {
  const firstDayOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0,
  );

  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const calendarEnd = new Date(lastDayOfMonth);
  calendarEnd.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

  const days: Date[] = [];
  const cursor = new Date(calendarStart);

  while (cursor <= calendarEnd) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export default function Header({ onDateChange }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(() =>
    startOfDay(new Date()),
  );
  const [visibleMonth, setVisibleMonth] = React.useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  const calendarDays = React.useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const monthTitle = `${MONTHS[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;
  const today = React.useMemo(() => startOfDay(new Date()), []);

  const toggleDropdown = () => {
    setVisibleMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );
    setIsOpen((value) => !value);
  };

  const shiftMonth = (delta: number) => {
    setVisibleMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + delta,
          1,
        ),
    );
  };

  const selectDate = (date: Date) => {
    const normalizedDate = startOfDay(date);
    setSelectedDate(normalizedDate);
    setIsOpen(false);
    onDateChange?.(normalizedDate);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.navBar}>
        <View style={styles.sideSpace} />
        <Pressable onPress={toggleDropdown} style={styles.dropdownTrigger}>
          <Text style={styles.dropdownLabel}>
            {formatDateLabel(selectedDate)}
          </Text>
          <Text style={styles.caret}>▾</Text>
        </Pressable>
        <View style={styles.sideSpace} />

        {isOpen ? (
          <View
            style={[
              styles.dropdownPanel,
              {
                top: insets.top + NAV_BAR_HEIGHT + 8,
              },
            ]}
          >
            <View style={styles.calendarHeaderRow}>
              <Pressable
                onPress={() => shiftMonth(-1)}
                style={styles.monthButton}
              >
                <Text style={styles.monthButtonText}>{"<"}</Text>
              </Pressable>
              <Text style={styles.monthTitle}>{monthTitle}</Text>
              <Pressable
                onPress={() => shiftMonth(1)}
                style={styles.monthButton}
              >
                <Text style={styles.monthButtonText}>{">"}</Text>
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((weekday) => (
                <Text key={weekday} style={styles.weekdayLabel}>
                  {weekday}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((dateOption) => {
                const inCurrentMonth =
                  dateOption.getMonth() === visibleMonth.getMonth();
                const isSelected = isSameDay(dateOption, selectedDate);
                const isToday = isSameDay(dateOption, today);

                return (
                  <Pressable
                    key={dateOption.toISOString()}
                    onPress={() => selectDate(dateOption)}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                      isToday && styles.dayCellToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayCellText,
                        !inCurrentMonth && styles.dayCellTextMuted,
                        isSelected && styles.dayCellTextSelected,
                      ]}
                    >
                      {dateOption.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
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
    width: 36,
  },
  dropdownTrigger: {
    alignItems: "center",
    borderColor: "#D5DEE7",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 38,
    minWidth: 190,
    paddingHorizontal: 12,
  },
  dropdownLabel: {
    color: "#10243A",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  caret: {
    color: "#4A5D73",
    fontSize: 14,
    marginLeft: 8,
    marginTop: 1,
  },
  dropdownPanel: {
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderColor: "#D5DEE7",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    position: "absolute",
    left: 12,
    right: 12,
    shadowColor: "#0A1C2F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    zIndex: 50,
  },
  calendarHeaderRow: {
    alignItems: "center",
    borderBottomColor: "#E8EDF2",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  monthButton: {
    alignItems: "center",
    borderColor: "#D5DEE7",
    borderRadius: 8,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  monthButtonText: {
    color: "#334A60",
    fontSize: 14,
    fontWeight: "700",
  },
  monthTitle: {
    color: "#10243A",
    fontSize: 16,
    fontWeight: "700",
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  weekdayLabel: {
    color: "#73879B",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    width: "14.2857%",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    rowGap: 4,
  },
  dayCell: {
    alignItems: "center",
    borderRadius: 9,
    justifyContent: "center",
    marginVertical: 2,
    paddingVertical: 8,
    width: "14.2857%",
  },
  dayCellToday: {
    borderColor: "#9FC6DA",
    borderWidth: 1,
  },
  dayCellSelected: {
    backgroundColor: "#0A7EA4",
  },
  dayCellText: {
    color: "#1F2F40",
    fontSize: 14,
    fontWeight: "600",
  },
  dayCellTextMuted: {
    color: "#9FB0BE",
  },
  dayCellTextSelected: {
    color: "#ffffff",
  },
});
