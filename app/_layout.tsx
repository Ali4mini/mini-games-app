import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import { StatusBar } from "expo-status-bar"; // Optional: to control status bar color
import i18n from "@/i18n";

// Imports from your project
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { SplashScreen as AnimatedSplash } from "@/components/common/SplashScreen";

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// 1. Create a separate component for Navigation
// This allows us to use the useTheme hook because it is INSIDE ThemeProvider
const RootNavigator = () => {
  const theme = useTheme();

  return (
    <>
      {/* Optional: Adapts status bar icons (light/dark) based on your theme */}
      <StatusBar style={theme.type === "dark" ? "light" : "dark"} />

      <Stack
        screenOptions={{
          // 1. Background color of the Header
          headerStyle: {
            backgroundColor: theme.backgroundPrimary,
          },
          // 2. Color of the Back Button and Title text
          headerTintColor: theme.textPrimary,
          // 3. Font style for the title (using your loaded font)
          headerTitleStyle: {
            fontFamily: "LilitaOne", 
            fontSize: 20,
          },
          // 4. Remove the thin line under the header (looks cleaner)
          headerShadowVisible: false,
          // 5. Background color of the screen BEHIND the content
          contentStyle: {
            backgroundColor: theme.backgroundPrimary,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="game-details" options={{ headerShown: false }} />
        <Stack.Screen name="game-player" options={{ headerShown: false }} />
        <Stack.Screen name="airdrop" options={{ headerShown: false }} />
        
        {/* Any other screen added automatically will now inherit the theme styles above */}
      </Stack>
    </>
  );
};

// 2. The Main Layout Wrapper
export default function RootLayout() {
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  
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
        {/* The Provider wraps the Navigator */}
        <ThemeProvider>
          
          {/* The Navigator now has access to the theme */}
          <RootNavigator />

          {/* Splash sits on top */}
          {showAnimatedSplash && (
            <AnimatedSplash onFinish={() => setShowAnimatedSplash(false)} />
          )}
          
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
