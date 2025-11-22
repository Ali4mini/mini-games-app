import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "@/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

// Import the animated component we created
// Aliased as 'AnimatedSplash' to avoid naming conflict with the Expo library
import { SplashScreen as AnimatedSplash } from "@/components/common/SplashScreen";

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. State to control the Animated Splash visibility
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  // 2. Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    LilitaOne: require("../assets/fonts/LilitaOne-Regular.ttf"),
  });

  // 3. Hide the NATIVE static image once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // We hide the native splash, revealing our <AnimatedSplash /> component underneath
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until fonts are ready
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <ThemeProvider>
          {/* THE MAIN APP CONTENT */}
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Add your other screens here */}
            <Stack.Screen
              name="game-details"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="game-player" options={{ headerShown: false }} />
            <Stack.Screen name="airdrop" options={{ headerShown: false }} />
          </Stack>

          {/* THE ANIMATED SPLASH OVERLAY */}
          {/* This sits ON TOP of the Stack (Z-Index handled in component) */}
          {showAnimatedSplash && (
            <AnimatedSplash onFinish={() => setShowAnimatedSplash(false)} />
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
