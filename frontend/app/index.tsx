import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { supabase } from "@/utils/supabase";

export default function Index() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if we have an active session in storage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  // 2. While checking, show a spinner (or your Splash Screen)
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

  // 3. If Logged In -> Go to Tabs (This enables the Navbar)
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  // 4. If Not Logged In -> Go to Login
  return <Redirect href="/(auth)/login" />;
}
