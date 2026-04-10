import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { StatusBar } from "react-native";

export default function TabLayout() {
  return (
    <React.Fragment>
      <StatusBar />
      <Tabs>
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
      </Tabs>
    </React.Fragment>
  );
}
