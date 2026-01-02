import React, { useMemo, forwardRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
  useWindowDimensions, // --- 1. Import hook ---
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
  colors: readonly [string, string, ...string[]];
  showBadge?: boolean;
  [key: string]: any;
}

const ActionButton = forwardRef<View, ActionButtonProps>(
  ({ imageSource, text, colors, showBadge, ...props }, ref) => {
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768; // --- 2. Define breakpoint ---

    // Pass isDesktop to styles
    const styles = useMemo(
      () => createStyles(theme, isDesktop),
      [theme, isDesktop],
    );

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
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.glassBackground}
        />
        <View style={styles.contentStack}>
          <View style={styles.iconArea}>
            <Image
              source={imageSource}
              style={styles.image3D}
              resizeMode="contain"
            />
            <View style={styles.iconShadow} />
          </View>
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
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  // --- 3. Use responsive styles for the main container ---
  const containerStyle = {
    flexDirection: "row" as "row",
    justifyContent: "center" as "center", // Center the group of buttons
    gap: 60, // Add space between buttons
    marginTop: isDesktop ? 15 : 5,
    marginBottom: isDesktop ? 20 : 10,
    paddingHorizontal: isDesktop ? 20 : 0,
  };

  return (
    <View style={containerStyle}>
      <Link href="/daily-check" asChild>
        <ActionButton
          text={t("home.daily", "Daily")}
          imageSource={require("@/assets/images/daily_checking_ic.png")}
          colors={["#43e97b", "#1b8270"]}
          showBadge={true}
        />
      </Link>
      <Link href="/leaderboard" asChild>
        <ActionButton
          text={t("leaderboard.title", "Leaderboard")}
          imageSource={require("@/assets/images/personal_honor_icon_event.webp")}
          colors={["#F2C94C", "#F2994A"]}
        />
      </Link>
      <Link href="/lucky-spin" asChild>
        <ActionButton
          text={t("home.spin", "Spin")}
          imageSource={require("@/assets/images/spin_icon.png")}
          colors={["#c471ed", "#9c3037"]}
        />
      </Link>
    </View>
  );
};

// --- STYLES ---
// --- 4. Make styles dependent on isDesktop ---
const createStyles = (theme: Theme, isDesktop: boolean) =>
  StyleSheet.create({
    touchableWrapper: {
      flex: 1, // Let it grow but capped by maxWidth
      maxWidth: isDesktop ? 130 : 110, // Control max button size
      height: isDesktop ? 95 : 75, // Taller button on desktop
      position: "relative",
    },
    glassBackground: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: isDesktop ? 60 : 48, // Taller background
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.4)",
      width: "100%",
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
      width: "100%",
    },
    image3D: {
      width: isDesktop ? 55 : 42, // Bigger image
      height: isDesktop ? 55 : 42,
      marginBottom: -6,
    },
    iconShadow: {
      width: isDesktop ? 30 : 24,
      height: 6,
      borderRadius: 10,
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: -1,
      transform: [{ translateY: -2 }],
    },
    textArea: {
      height: isDesktop ? 38 : 30, // More space for text
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
    },
    quickActionText: {
      color: "#fff",
      fontWeight: "900",
      fontSize: isDesktop ? 12 : 10, // Bigger font
      textTransform: "uppercase",
      letterSpacing: 0.5,
      textAlign: "center",
      width: "100%",
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    badge: {
      position: "absolute",
      top: isDesktop ? 25 : 22, // Adjust position for larger size
      right: isDesktop ? 12 : 8,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "#FF3B30",
      borderWidth: 1.5,
      borderColor: "#fff",
      zIndex: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
    },
  });
