import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import { StatusBar, View, ActivityIndicator } from "react-native"; // Added View/ActivityIndicator
import BlobBackground from "@/components/common/BlobBackground";
import i18n from "@/i18n";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { UserStatsProvider } from "@/context/UserStatsContext";
import { enableFreeze } from "react-native-screens";

import { AdManager } from "@/utils/adsManager";
import { useAppOpenAd } from "@/hooks/ads/useAppOpenAd";

enableFreeze(false);
SplashScreen.preventAutoHideAsync();

const RootNavigator = () => {
  const theme = useTheme();
  const { session, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Use a ref to track if we've handled the initial navigation
  const isInitialNav = React.useRef(true);

  useEffect(() => {
    // Wait for Auth and Fonts
    if (authLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }

    isInitialNav.current = false;
  }, [session, authLoading, segments, router]);

  // While loading, show a screen that MATCHES your background
  // to make the transition seamless
  if (authLoading) {
    return <View style={{ flex: 1, backgroundColor: "#0B0B15" }} />;
  }

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
