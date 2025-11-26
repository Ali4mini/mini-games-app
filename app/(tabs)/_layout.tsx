import React from "react";
import { Tabs } from "expo-router";
import { CustomTabBar } from "@/components/navigation/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        
        // 1. Ensure the tab "scene" (the page content) is transparent
        // so the Root Layout's background shows through.
        sceneStyle: { backgroundColor: 'transparent' },

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
