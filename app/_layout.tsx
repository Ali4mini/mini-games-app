import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router"; // Added useRouter, useSegments
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import BlobBackground from "@/components/common/BlobBackground";
import i18n from "@/i18n";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext"; // <--- 1. Import Auth
import { UserStatsProvider } from "@/context/UserStatsContext";
import { SplashScreen as AnimatedSplash } from "@/components/common/SplashScreen";
import { enableFreeze } from "react-native-screens";

enableFreeze(false);

SplashScreen.preventAutoHideAsync();

const RootNavigator = () => {
  const theme = useTheme();

  // 2. Hooks for Auth and Navigation
  const { session, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // 3. The Gatekeeper: Manage Redirects
  useEffect(() => {
    if (authLoading) return; // Wait until supabase checks the session

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      // User is NOT logged in, and not in the login/signup screens -> Redirect to Login
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      // User IS logged in, but is on login/signup screens -> Redirect to Home
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
        {/* 4. Add the Auth Route Group */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Your Existing Routes */}
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
            {/* ADD THIS WRAPPER HERE */}
            <UserStatsProvider>
              <RootNavigator />
            </UserStatsProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
