import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import BlobBackground from "@/components/common/BlobBackground"; // Your new component
// import PatternBackground from "@/components/common/PatternBackground"; // Your new component
import i18n from "@/i18n";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { SplashScreen as AnimatedSplash } from "@/components/common/SplashScreen";

SplashScreen.preventAutoHideAsync();

const RootNavigator = () => {
  const theme = useTheme();

  return (
    <BlobBackground> 
      {/* ^^^ 1. WRAP EVERYTHING IN BACKGROUND ^^^ */}
      
      <StatusBar style={theme.type === "dark" ? "light" : "dark"} />

      <Stack
        screenOptions={{
          // 2. Make the Header Transparent so blobs float behind it
          headerStyle: {
            backgroundColor: 'transparent', 
          },
          headerTransparent: true, // This allows content to scroll under the header
          
          headerTintColor: theme.textPrimary,
          headerTitleStyle: {
            fontFamily: "LilitaOne",
            fontSize: 20,
          },
          headerShadowVisible: false,

          // 3. CRITICAL: Make the screen background transparent
          // If this is set to theme.backgroundPrimary, it covers the blobs!
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="game-details" options={{ headerShown: false }} />
        
        {/* 4. EXCEPTION: The Game Player usually needs a solid background */}
        {/* We override the transparency here to focus on gameplay */}
        <Stack.Screen 
          name="game-player" 
          options={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#000' } // Keep game player dark/solid
          }} 
        />
        
        <Stack.Screen name="airdrop" options={{ headerShown: false }} />
      </Stack>
    </BlobBackground>
  );
};

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
        <ThemeProvider>
          <RootNavigator />
          {showAnimatedSplash && (
            <AnimatedSplash onFinish={() => setShowAnimatedSplash(false)} />
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
