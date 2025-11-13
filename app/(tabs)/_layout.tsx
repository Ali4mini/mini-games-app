import React from "react";
import { Tabs } from "expo-router";
import { CustomTabBar } from "@/components/navigation/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      // This tells Expo Router to use our custom component for everything.
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute", // This is also needed to remove default layout behavior
          borderTopWidth: 0,
          elevation: 0, // Remove shadow on Android
        },
      }}
    >
      {/* Reorder your screens to match the icon order */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="daily-check" />
      <Tabs.Screen name="games-list" />
      <Tabs.Screen name="lucky-spin" />
      <Tabs.Screen name="referral" />
    </Tabs>
  );
}
