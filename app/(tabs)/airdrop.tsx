import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
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

const AirdropScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Animation values
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const contentTranslateY = useSharedValue(0);

  useEffect(() => {
    // 1. Pulsing Glow Animation
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 2000 }),
        withTiming(0.6, { duration: 2000 })
      ),
      -1,
      true
    );

    // 2. Gentle Floating Animation
    contentTranslateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
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
    <View
      style={[
        styles.container,
        // { backgroundColor: theme.backgroundPrimary },
      ]}
    >
      <Animated.View style={[styles.content, floatStyle]}>
        
        {/* --- ICON WRAPPER --- */}
        <View style={styles.iconWrapper}>
          {/* Pulsing Ring Behind */}
          <Animated.View
            style={[
              styles.glowRing,
              { 
                backgroundColor: theme.primary, // Violet
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
                backgroundColor: theme.backgroundSecondary, // Card Color
                borderColor: theme.backgroundTertiary,     // Subtle Border
              },
            ]}
          >
            {/* Using Icon instead of Emoji for cleaner vector look */}
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
            { backgroundColor: theme.tabBarInactive }, // Muted color
          ]}
        />

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {t("airdrop.descriptionPre", "Get ready for exciting rewards! The airdrop starts in ")}
          
          <Text style={{ fontWeight: "700", color: theme.primary }}>
            {t("airdrop.date", "Q1 of 2026")}
          </Text>
          
          {t("airdrop.descriptionMid", ". This event is exclusively for users who have invited at least ")}
          
          <Text style={{ fontWeight: "700", color: theme.secondary }}>
             {t("airdrop.requirement", "20 people")}
          </Text>
          .
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    overflow: 'hidden',
  },
  content: {
    maxWidth: 400,
    width: "100%",
    alignItems: "center",
  },
  iconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  glowRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    // Soft Glow logic
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
    // Add a slight internal shadow/elevation
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
    textTransform: 'uppercase',
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
