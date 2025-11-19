import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons"; // Added MaterialIcons
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";

interface HomeHeaderProps {
  userName: string;
  coins: number;
  avatarUrl: string;
  userLevel?: number; // Optional level to display
  userStreak?: number; // Optional streak to display
}

// A beautiful golden gradient for our new coin counter
const GOLD_GRADIENT = ["#FBBF24", "#F59E0B"] as const;
const USER_GRADIENT = ["#4F46E5", "#7C3AED"]; // Example: Modern Blue to Rose (adjust to your palette)
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName,
  coins,
  avatarUrl,
  userLevel = 1, // Default to level 1 if not provided
  userStreak = 0, // Default to 0 streak if not provided
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // --- Animation Setup ---
  const scale = useSharedValue(1);
  const avatarScale = useSharedValue(0); // For initial animation
  const greetingOpacity = useSharedValue(0); // For initial animation

  // Animate avatar and greeting on mount
  React.useEffect(() => {
    // Delay slightly for smoother sequence
    setTimeout(() => {
      avatarScale.value = withSpring(1, { damping: 8, stiffness: 150 });
      greetingOpacity.value = withSpring(1, { damping: 10, stiffness: 120 });
    }, 100);
  }, []);

  const animatedAvatarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: avatarScale.value }],
    };
  });

  const animatedGreetingStyle = useAnimatedStyle(() => {
    return {
      opacity: greetingOpacity.value,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View style={styles.header}>
      {/* --- User Greeting Section with Gradient Background --- */}
      <Animated.View style={[styles.userContainer, animatedGreetingStyle]}>
        <Animated.View style={[styles.avatarContainer, animatedAvatarStyle]}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          {/* Optional Level Badge */}
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
          {/* Optional Streak Info */}
          {userStreak > 0 && (
            <View style={styles.streakContainer}>
              <MaterialIcons
                name="local-fire-department"
                size={14}
                color="#F97316"
              />
              <Text style={styles.streakText}> {userStreak} days</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* --- Gamified Coin Counter --- */}
      <AnimatedTouchableOpacity
        activeOpacity={1}
        style={[animatedStyle, styles.coinsContainerOuter]} // Added outer container for better shadow handling
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient colors={GOLD_GRADIENT} style={styles.coinsContainer}>
          <FontAwesome5
            name="coins"
            size={20}
            color="rgba(255, 255, 255, 0.9)" // Slightly brighter icon
          />
          <Text style={styles.coinsText}>{coins}</Text>
        </LinearGradient>
      </AnimatedTouchableOpacity>
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start", // Align to top
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
    },
    userContainer: {
      flexDirection: "row",
      alignItems: "flex-start", // Align avatar and text to top
      flex: 1, // Take up available space
    },
    avatarContainer: {
      position: "relative", // For badge positioning
      marginRight: 12,
    },
    avatar: {
      width: 52, // Slightly larger
      height: 52,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: theme.backgroundSecondary,
    },
    levelBadge: {
      position: "absolute",
      bottom: -2,
      right: -2,
      backgroundColor: theme.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.backgroundPrimary,
    },
    levelText: {
      color: theme.backgroundPrimary,
      fontSize: 10,
      fontWeight: "bold",
    },
    userInfo: {
      justifyContent: "center", // Vertically center text
    },
    headerWelcome: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    headerUsername: {
      fontSize: 18, // Slightly smaller for long names
      fontWeight: "700",
      color: theme.textPrimary,
      maxWidth: 140, // Prevents pushing coins off screen
    },
    streakContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    streakText: {
      fontSize: 12,
      color: "#F97316", // Orange color for fire/streak
      fontWeight: "500",
    },
    coinsContainerOuter: {
      // Container for the shadow effect
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 8,
    },
    coinsContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18, // Slightly wider
      paddingVertical: 12, // Slightly taller
      borderRadius: 30,
    },
    coinsText: {
      marginLeft: 6, // Tighter spacing with icon
      fontSize: 18, // Larger font
      fontWeight: "bold",
      color: "#422006",
    },
  });
