import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Background from "@/components/common/BlobBackground";
import LanguageSelector from "@/components/profile/LanguageSelector"; // <--- Import your component

export default function AuthLayout() {
  return (
    <Background>
      {/* --- FLOATING HEADER --- */}
      <View style={styles.floatingHeader}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <LanguageSelector />
          </View>
        </SafeAreaView>
      </View>

      {/* --- SCREEN CONTENT --- */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
    </Background>
  );
}

const styles = StyleSheet.create({
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Ensures it sits above the form inputs
  },
  headerContent: {
    alignItems: "flex-end", // Pushes the button to the right
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
