import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";

// --- CONSTANTS ---
const MAX_WIDTH = 1024;
const TAB_BAR_OFFSET = 120; // Ensure content isn't hidden behind nav

const AirdropScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Use Memo for styles to recalculate only when theme changes
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Animation values
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const contentTranslateY = useSharedValue(0);

  useEffect(() => {
    // 1. Pulsing Glow Animation
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 2000 }),
        withTiming(0.6, { duration: 2000 }),
      ),
      -1,
      true,
    );

    // 2. Gentle Floating Animation
    contentTranslateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, []);

  // Animated Styles
  const glowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: glowScale.value }],
      opacity: glowOpacity.value,
    };
  });

  const floatStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  return (
    // 1. ROOT BACKGROUND: Centers content on Desktop
    <View style={styles.rootBackground}>
      {/* 2. RESPONSIVE CONTAINER: Max Width 1024px */}
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <Animated.View style={[styles.content, floatStyle]}>
            {/* --- ICON WRAPPER --- */}
            <View style={styles.iconWrapper}>
              {/* Pulsing Ring Behind */}
              <Animated.View
                style={[
                  styles.glowRing,
                  {
                    backgroundColor: theme.primary,
                    shadowColor: theme.primary,
                  },
                  glowStyle,
                ]}
              />

              {/* Main Icon Circle */}
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.backgroundTertiary,
                  },
                ]}
              >
                <Ionicons name="gift" size={36} color={theme.primary} />
              </View>
            </View>

            {/* --- TEXT CONTENT --- */}
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {t("airdrop.title", "Airdrop")}
            </Text>

            <Text style={[styles.subtitle, { color: theme.secondary }]}>
              {t("airdrop.subtitle", "Coming Soon!")}
            </Text>

            {/* Divider Line */}
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.tabBarInactive },
              ]}
            />

            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {t(
                "airdrop.descriptionPre",
                "Get ready for exciting rewards! The airdrop starts in ",
              )}
              <Text style={{ fontWeight: "700", color: theme.primary }}>
                {t("airdrop.date", "Q1 of 2026")}
              </Text>
              {t(
                "airdrop.descriptionMid",
                ". This event is exclusively for users who have invited at least ",
              )}
              <Text style={{ fontWeight: "700", color: theme.secondary }}>
                {t("airdrop.requirement", "20 people")}
              </Text>
              .
            </Text>
          </Animated.View>
        </SafeAreaView>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Root wrapper to center the app on wide screens
    rootBackground: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
      alignItems: "center",
    },
    // Constrained container
    container: {
      flex: 1,
      width: "100%",
      maxWidth: MAX_WIDTH,
      backgroundColor: theme.backgroundPrimary,
      ...Platform.select({
        web: {
          boxShadow: "0px 0px 24px rgba(0,0,0,0.15)",
        },
      }),
    },
    safeArea: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      // Add bottom padding so content isn't covered by Tab Bar
      paddingBottom: TAB_BAR_OFFSET,
      overflow: "hidden",
    },
    content: {
      maxWidth: 400, // Keeps text readable
      width: "100%",
      alignItems: "center",
    },
    iconWrapper: {
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },
    glowRing: {
      position: "absolute",
      width: 90,
      height: 90,
      borderRadius: 45,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 10,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      marginBottom: 8,
      textAlign: "center",
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 24,
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 2,
    },
    divider: {
      width: 60,
      height: 4,
      borderRadius: 2,
      marginBottom: 24,
      opacity: 0.3,
    },
    description: {
      fontSize: 16,
      lineHeight: 26,
      textAlign: "center",
      paddingHorizontal: 16,
    },
  });

export default AirdropScreen;
