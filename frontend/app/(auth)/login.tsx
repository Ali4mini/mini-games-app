import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

// --- Imports from separated files ---
import LoginForm from "@/components/auth/LoginForm";
import WebLandingPage from "@/components/auth/WebLandingPage";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();

  // Breakpoint: Tablet/Desktop
  const isDesktopWeb = Platform.OS === "web" && width > 960;

  // Mobile Gradient Text Helper
  const MobileGradientText = (props: any) => (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={["#00E5FF", "#D500F9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            !isDesktopWeb && { minHeight: height },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isDesktopWeb ? (
            // --- WEB LAYOUT ---
            <WebLandingPage />
          ) : (
            // --- MOBILE LAYOUT ---
            <View style={styles.responsiveContainer}>
              <Animated.View
                entering={FadeInDown.delay(100).springify()}
                style={styles.headerContainer}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="game-controller" size={40} color="#fff" />
                </View>
                <MobileGradientText style={styles.brandTitle}>
                  {t("appName") || "MysteryPlay"}
                </MobileGradientText>
                <Text style={styles.subHeader}>Welcome back, Player 1</Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200).springify()}>
                {/* Reusing the Logic Component */}
                <LoginForm />
              </Animated.View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B15",
  },
  scrollContent: {
    flexGrow: 1,
  },
  // MOBILE SPECIFIC STYLES
  responsiveContainer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxWidth: 450,
    alignSelf: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerContainer: { alignItems: "center", marginBottom: 40 },
  iconContainer: {
    marginBottom: 15,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: "900",
    fontFamily: "LilitaOne",
    marginBottom: 5,
  },
  subHeader: { fontSize: 16, color: "#8F90A6" },
});
