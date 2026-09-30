//entry point for the app, defines the layout of the app and the navigation structure for expo router

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";

import { EventsProvider } from "../hooks/use-events";
import { ThemeProvider, useTheme } from "../hooks/use-theme";

function RootNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationThemeProvider
      value={theme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <EventsProvider>
        <RootNavigator />
      </EventsProvider>
    </ThemeProvider>
  );
}
