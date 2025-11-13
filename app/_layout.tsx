import React, { useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "../context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load the custom fonts
  const [fontsLoaded, fontError] = useFonts({
    LilitaOne: require("../assets/fonts/LilitaOne-Regular.ttf"),
  });

  // This effect will hide the splash screen once the fonts are loaded or an error occurs
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If the fonts are not loaded yet, render nothing. The splash screen will be visible.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Render the layout
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
