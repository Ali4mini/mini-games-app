import React, { useEffect, useState, useRef } from "react";
import { AppState, AppStateStatus } from "react-native"; // 1. Import AppState
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import BlobBackground from "@/components/common/BlobBackground";
import i18n from "@/i18n";

// --- 2. ADMOB IMPORTS ---
import { AppOpenAd, AdEventType } from "react-native-google-mobile-ads";
import { getAdUnitId } from "@/utils/adsConfig"; // Your helper file

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { UserStatsProvider } from "@/context/UserStatsContext";
import { SplashScreen as AnimatedSplash } from "@/components/common/SplashScreen";
import { enableFreeze } from "react-native-screens";
import { AdManager } from "@/utils/adsManager";

enableFreeze(false);

SplashScreen.preventAutoHideAsync();

// --- 3. INITIALIZE AD OUTSIDE COMPONENT ---
// This ensures the ad object isn't recreated on every render
const appOpenAd = AppOpenAd.createForAdRequest(getAdUnitId("appOpen"), {
  requestNonPersonalizedAdsOnly: true,
});

const RootNavigator = () => {
  useEffect(() => {
    // Start the ad engine
    AdManager.initialize();
  }, []);
  const theme = useTheme();
  const { session, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Track if ad is ready to show
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  // --- 4. APP OPEN AD LOGIC ---
  useEffect(() => {
    // A. Event Listener: When Ad Loads
    const loadListener = appOpenAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setIsAdLoaded(true);
      },
    );

    // B. Event Listener: When Ad Closes (Load the NEXT one immediately)
    const closeListener = appOpenAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsAdLoaded(false);
        appOpenAd.load();
      },
    );

    // C. Event Listener: App State Changes (Background -> Foreground)
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active" && isAdLoaded) {
          // Show ad when user comes back to app
          appOpenAd.show();
        }
      },
    );

    // D. Initial Load (Cold Start)
    appOpenAd.load();

    // Cleanup listeners on unmount
    return () => {
      loadListener();
      closeListener();
      appStateListener.remove();
    };
  }, [isAdLoaded]);

  // --- AUTH REDIRECT LOGIC ---
  useEffect(() => {
    if (authLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, authLoading, segments]);

  return (
    <BlobBackground>
      <StatusBar style={theme.type === "dark" ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "transparent" },
          headerTransparent: true,
          headerTintColor: theme.textPrimary,
          headerTitleStyle: { fontFamily: "LilitaOne", fontSize: 20 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="game-details" options={{ headerShown: false }} />
        <Stack.Screen
          name="game-player"
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000" },
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
          <AuthProvider>
            <UserStatsProvider>
              <RootNavigator />
            </UserStatsProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
