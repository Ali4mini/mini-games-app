import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { supabase } from "@/utils/supabase";
import { LandingPage } from "@/screens/LandingPageUI"; // Import your new module

export default function Index() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
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

  // 1. If Logged In -> Go to Tabs (Same as mobile)
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  // 2. WEB ONLY: If Not Logged In -> Show Landing Page
  // We do NOT redirect to login here, we just show the landing module
  return <LandingPage />;
}
