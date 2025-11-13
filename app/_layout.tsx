import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return (
    // Wrap the entire app with the ThemeProvider
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="games-list" options={{ title: "All Games" }} />
        <Stack.Screen
          name="daily-check"
          options={{ title: "Daily Check-in" }}
        />
        <Stack.Screen name="lucky-spin" options={{ title: "Lucky Spin" }} />
        <Stack.Screen name="referral" options={{ title: "Refer a Friend" }} />
      </Stack>
    </ThemeProvider>
  );
}
