import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "@/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load the custom fonts
  const [fontsLoaded, fontError] = useFonts({
    LilitaOne: require("../assets/fonts/LilitaOne-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Stack>
            {/* This screen points to our entire tab navigator */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* You can add other screens here that are NOT part of the tab bar,
              like a modal settings screen or a game-playing screen. */}
            {/* e.g., <Stack.Screen name="settings" options={{ presentation: 'modal' }} /> */}
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
