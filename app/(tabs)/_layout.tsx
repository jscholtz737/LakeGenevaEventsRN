//layout for the tabs, defines the layout of the tabs and the icons for each tab

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

import { useTheme } from "../../hooks/use-theme";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <React.Fragment>
      <StatusBar
        backgroundColor={colors.tabBar}
        barStyle={
          colors.statusBar === "light" ? "light-content" : "dark-content"
        }
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tabIconSelected,
          tabBarInactiveTintColor: colors.tabIconDefault,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
          },
        }}
      >
        <Tabs.Screen
          name="map"
          options={{
            headerShown: false,
            tabBarLabel: "Map",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="map" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="all"
          options={{
            headerShown: false,
            tabBarLabel: "All",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            headerShown: false,
            tabBarLabel: "Search",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerShown: false,
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </React.Fragment>
  );
}
