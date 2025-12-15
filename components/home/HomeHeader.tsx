import React, { useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions, // --- 1. Import hook ---
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";

interface HomeHeaderProps {
  userName: string;
  coins: number;
  avatarUrl: string;
  userLevel?: number;
  userStreak?: number;
}

const GOLD_GRADIENT = ["#FBBF24", "#F59E0B"] as const;
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName,
  coins,
  avatarUrl,
  userLevel = 1,
  userStreak = 0,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768; // --- 2. Define breakpoint ---

  // Pass isDesktop to styles
  const styles = useMemo(
    () => createStyles(theme, isDesktop),
    [theme, isDesktop],
  );

  // Animations (no changes needed here)
  const scale = useSharedValue(1);
  const avatarScale = useSharedValue(0);
  const greetingOpacity = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      avatarScale.value = withSpring(1, { damping: 8, stiffness: 150 });
      greetingOpacity.value = withSpring(1, { damping: 10, stiffness: 120 });
    }, 100);
  }, []);

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const animatedGreetingStyle = useAnimatedStyle(() => ({
    opacity: greetingOpacity.value,
  }));

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
    <View style={styles.header}>
      <Animated.View style={[styles.userContainer, animatedGreetingStyle]}>
        <Animated.View style={[styles.avatarContainer, animatedAvatarStyle]}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          {userLevel > 0 && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{userLevel}</Text>
            </View>
          )}
        </Animated.View>
        <View style={styles.userInfo}>
          <Text style={styles.headerWelcome}>{t("home.welcomeBack")}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headerUsername}
          >
            {userName}
          </Text>
          {userStreak > 0 && (
            <View style={styles.streakContainer}>
              <MaterialIcons
                name="local-fire-department"
                size={isDesktop ? 16 : 14} // Slightly larger icon
                color="#F97316"
              />
              <Text style={styles.streakText}> {userStreak} days</Text>
            </View>
          )}
        </View>
      </Animated.View>

      <AnimatedTouchableOpacity
        activeOpacity={1}
        style={[animatedStyle, styles.coinsContainerOuter]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient colors={GOLD_GRADIENT} style={styles.coinsContainer}>
          <FontAwesome5
            name="coins"
            size={isDesktop ? 24 : 20} // Larger icon
            color="rgba(255, 255, 255, 0.9)"
          />
          <Text style={styles.coinsText}>{coins}</Text>
        </LinearGradient>
      </AnimatedTouchableOpacity>
    </View>
  );
};

// --- STYLES ---
// --- 3. Make styles dependent on isDesktop ---
const createStyles = (theme: Theme, isDesktop: boolean) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      paddingTop: isDesktop ? 24 : 16, // More top padding
      paddingBottom: isDesktop ? 32 : 24, // More bottom padding
    },
    userContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      flex: 1,
    },
    avatarContainer: {
      position: "relative",
      marginRight: isDesktop ? 16 : 12,
    },
    avatar: {
      width: isDesktop ? 64 : 52, // Larger avatar
      height: isDesktop ? 64 : 52,
      borderRadius: isDesktop ? 32 : 26,
      borderWidth: 2,
      borderColor: theme.backgroundSecondary,
    },
    levelBadge: {
      position: "absolute",
      bottom: -2,
      right: -2,
      backgroundColor: theme.primary,
      borderRadius: 12, // Larger radius
      minWidth: isDesktop ? 24 : 20,
      height: isDesktop ? 24 : 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.backgroundPrimary,
    },
    levelText: {
      color: theme.backgroundPrimary,
      fontSize: isDesktop ? 12 : 10,
      fontWeight: "bold",
    },
    userInfo: {
      justifyContent: "center",
    },
    headerWelcome: {
      fontSize: isDesktop ? 14 : 12, // Larger font
      color: theme.textSecondary,
      marginBottom: 2,
    },
    headerUsername: {
      fontSize: isDesktop ? 22 : 18, // Larger font
      fontWeight: "700",
      color: theme.textPrimary,
      maxWidth: isDesktop ? 250 : 140, // Allow more space for username
    },
    streakContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    streakText: {
      fontSize: isDesktop ? 14 : 12, // Larger font
      color: "#F97316",
      fontWeight: "500",
    },
    coinsContainerOuter: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 8,
    },
    coinsContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: isDesktop ? 20 : 18,
      paddingVertical: isDesktop ? 14 : 12,
      borderRadius: 30,
    },
    coinsText: {
      marginLeft: isDesktop ? 8 : 6,
      fontSize: isDesktop ? 20 : 18, // Larger font
      fontWeight: "bold",
      color: "#422006",
    },
  });
