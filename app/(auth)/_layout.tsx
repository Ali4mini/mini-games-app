import React from "react";
import { Stack } from "expo-router";
import Background from "@/components/common/BlobBackground"; // Adjust path to where you saved Background.tsx

export default function AuthLayout() {
  return (
    <Background>
      <Stack
        screenOptions={{
          headerShown: false,
          // CRITICAL: Make the screens transparent so the Background component shows through
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
