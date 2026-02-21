import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { pb } from "@/utils/pocketbase";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the store has a valid token
    // isValid checks if the token exists and is not expired
    setIsAuthenticated(pb.authStore.isValid);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0b0d18",
        }}
      >
        <ActivityIndicator size="large" color="#D500F9" />
      </View>
    );
  }

  // If Logged In -> Go to Tabs
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // If Not Logged In -> Go to Login
  return <Redirect href="/(auth)/login" />;
}
