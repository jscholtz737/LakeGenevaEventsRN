//entry point for the app, defines the layout of the app and the navigation structure for expo router

import { Stack } from "expo-router";
import React from "react";
import { EventsProvider } from "../hooks/use-events";

export default function TabLayout() {
  return (
    <EventsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </EventsProvider>
  );
}
