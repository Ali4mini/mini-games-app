import React, { useMemo, forwardRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface ActionButtonProps {
  imageSource: ImageSourcePropType;
  text: string;
  colors: readonly [string, string, ...string[]]; // New Prop for Gradient
  showBadge?: boolean;
  [key: string]: any;
}

const ActionButton = forwardRef<View, ActionButtonProps>(
  ({ imageSource, text, colors, showBadge, ...props }, ref) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.95);
    };
    const handlePressOut = () => {
      scale.value = withSpring(1);
    };

    return (
      <AnimatedTouchableOpacity
        ref={ref}
        activeOpacity={1}
        style={[styles.touchableWrapper, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {/* 1. The Gradient Background - Dynamic Colors */}
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.glassBackground}
        />

        {/* 2. Content Stack */}
        <View style={styles.contentStack}>
          {/* Icon Area */}
          <View style={styles.iconArea}>
            <Image
              source={imageSource}
              style={styles.image3D}
              resizeMode="contain"
            />
            {/* Shadow */}
            <View style={styles.iconShadow} />
          </View>

          {/* Text Area */}
          <View style={styles.textArea}>
            <Text
              style={styles.quickActionText}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
            >
              {text}
            </Text>
          </View>

          {showBadge && <View style={styles.badge} />}
        </View>
      </AnimatedTouchableOpacity>
    );
  },
);
ActionButton.displayName = "ActionButton";

export const QuickActions: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  // const styles = useMemo(() => createStyles(theme), [theme]); // Not strictly needed here unless main container changes

  return (
    <View style={styles.mainContainer}>
      <Link href="/daily-check" asChild>
        <ActionButton
          text={t("home.daily", "Daily")}
          imageSource={require("@/assets/images/daily_checking_ic.png")}
          // Green/Teal Gradient
          colors={["#43e97b", "#1b8270"]}
          showBadge={true}
        />
      </Link>

      <Link href="/leaderboard" asChild>
        <ActionButton
          text={t("leaderboard.title", "Leaderboard")}
          imageSource={require("@/assets/images/personal_honor_icon_event.webp")}
          // Gold/Orange Gradient
          colors={["#F2C94C", "#F2994A"]}
        />
      </Link>

      <Link href="/lucky-spin" asChild>
        <ActionButton
          text={t("home.spin", "Spin")}
          imageSource={require("@/assets/images/spin_icon.png")}
          // Purple/Blue Gradient
          colors={["#c471ed", "#9c3037"]}
        />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    marginBottom: 10,
  },
});

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Keeping your exact styles as requested
    touchableWrapper: {
      flex: 1,
      height: 75,
      position: "relative",
    },
    glassBackground: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 48,
      borderRadius: 14,
      borderWidth: 1,
      // Light border to make the gradient pop
      borderColor: "rgba(255, 255, 255, 0.4)",
      width: "100%",
      // Removed backgroundColor because LinearGradient takes over
    },
    contentStack: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    iconArea: {
      marginBottom: 0,
      zIndex: 10,
      alignItems: "center",
      width: 100,
    },
    image3D: {
      width: 42,
      height: 42,
      marginBottom: -6,
    },
    iconShadow: {
      width: 24,
      height: 6,
      borderRadius: 10,
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: -1,
      transform: [{ translateY: -2 }],
    },
    textArea: {
      height: 30,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
    },
    quickActionText: {
      color: "#fff",
      fontWeight: "900",
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      textAlign: "center",
      width: "100%",
      // Added text shadow so white text is readable on bright gradients
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    badge: {
      position: "absolute",
      top: 22, // ✨ Moved down slightly
      right: 8, // ✨ Moved in slightly
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "#FF3B30",
      borderWidth: 1.5,
      borderColor: "#fff",
      zIndex: 20,
      // Add a tiny shadow to the dot too
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
    },
  });
