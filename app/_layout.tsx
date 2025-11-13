import React from "react";
import { Stack } from "expo-router";

/**
 * This is the root navigator for the entire app.
 * All other screens will be children of this Stack navigator.
 */
export default function RootLayout() {
  return (
    <Stack>
      {/* 
        This screen corresponds to `app/index.tsx`.
        We hide the default header because our HomePageUI component has its own custom header.
      */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      {/* 
        These screens correspond to the other pages in the app directory.
        Expo Router automatically creates routes for them.
        We can set the header title for each page here.
      */}
      <Stack.Screen name="games-list" options={{ title: "All Games" }} />
      <Stack.Screen name="daily-check" options={{ title: "Daily Check-in" }} />
      <Stack.Screen name="lucky-spin" options={{ title: "Lucky Spin" }} />
      <Stack.Screen name="referral" options={{ title: "Refer a Friend" }} />
    </Stack>
  );
}
