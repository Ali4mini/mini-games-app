import React from "react";
import { Platform, View } from "react-native";
import { Tabs, Slot } from "expo-router";
import { CustomTabBar } from "@/components/navigation/CustomTabBar";
import { WebTabBar } from "@/components/navigation/WebTabBar"; // We will create this

export default function TabLayout() {
  // ---------------------------------------------------------
  // WEB LAYOUT: Uses <Slot> to ensure old pages are removed
  // ---------------------------------------------------------
  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1 }}>
        {/* Slot renders ONLY the active route. No stacking. */}
        <Slot
          screenOptions={{
            // Ensure transparency allows root gradient to show
            sceneStyle: { backgroundColor: "transparent" },
          }}
        />

        {/* We place the TabBar manually at the bottom */}
        <WebTabBar />
      </View>
    );
  }

  // ---------------------------------------------------------
  // MOBILE LAYOUT: Uses <Tabs> for standard app behavior
  // ---------------------------------------------------------
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="airdrop" />
      <Tabs.Screen name="games-list" />
      <Tabs.Screen name="lucky-spin" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
