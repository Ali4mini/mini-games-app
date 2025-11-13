import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

// A reusable component for rendering tab icons
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.card === "#FFFFFF" ? "#E2E8F0" : theme.card,
        },
        headerShown: false, // We handle headers inside each screen or the root layout
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="games-list"
        options={{
          title: "All Games",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="gamepad" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lucky-spin"
        options={{
          title: "Lucky Spin",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compact-disc" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily-check"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar-check" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="referral"
        options={{
          title: "Referral",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user-friends" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
