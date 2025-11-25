import React, { useEffect } from "react";
import { View, Text, useColorScheme, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withDelay,
} from "react-native-reanimated";
import colors from "@/constants/Colors"; // Adjust path as needed

const { width } = Dimensions.get("window");

const AirdropScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const currentColors = colors[colorScheme || "light"];

  // Animation values
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const contentTranslateY = useSharedValue(0);

  useEffect(() => {
    // 1. Pulsing Glow Animation
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite loop
      true // Reverse
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 2000 }),
        withTiming(0.5, { duration: 2000 })
      ),
      -1,
      true
    );

    // 2. Gentle Floating Animation for the whole content
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
        { backgroundColor: currentColors.backgroundPrimary },
      ]}
    >
      {/* Background ambient glow (Static or subtle animation could be added here too) */}
      <View style={[styles.ambientGlow, { backgroundColor: "rgba(244, 63, 94, 0.05)" }]} />

      <Animated.View style={[styles.content, floatStyle]}>
        
        {/* Icon Container with Animated Glow Behind it */}
        <View style={styles.iconWrapper}>
          <Animated.View
            style={[
              styles.glowRing,
              { backgroundColor: "rgba(244, 63, 94, 0.6)" },
              glowStyle,
            ]}
          />
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: "rgba(244, 63, 94, 0.1)" },
            ]}
          >
            <Text style={[styles.emoji, { color: currentColors.primary }]}>
              🎁
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: currentColors.textPrimary }]}>
          Airdrop
        </Text>

        <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>
          Coming Soon!
        </Text>

        <View
          style={[
            styles.divider,
            { backgroundColor: "rgba(244, 63, 94, 0.3)" },
          ]}
        />

        <Text
          style={[styles.description, { color: currentColors.textTertiary }]}
        >
          Get ready for exciting rewards! The airdrop is scheduled to start in{" "}
          <Text style={{ fontWeight: "700", color: currentColors.textPrimary }}>
            Q1 of 2026
          </Text>
          . Please note that this event is exclusively for users who have
          invited at least{" "}
          <Text style={{ fontWeight: "700", color: currentColors.textPrimary }}>
            20 people
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
    overflow: 'hidden', // Ensures glow doesn't spill if it gets huge
  },
  ambientGlow: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    zIndex: -1,
    // Add a very large blurry background circle if desired
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
    marginBottom: 30, // Increased margin to account for glow size
  },
  glowRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    // The blurRadius property works differently on iOS/Android. 
    // Usually standard views don't support blurRadius directly without specific libraries.
    // We simulate the glow with opacity and scaling instead for max compatibility,
    // but if you want a soft edge, you can use a shadow or an image.
    shadowColor: "#f43f5e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10, // Android shadow
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2, // Ensure icon sits on top of glow
    borderWidth: 1,
    borderColor: "rgba(244, 63, 94, 0.2)",
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 32, // Slightly larger
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.8,
    textTransform: 'uppercase', // Adds a bit of "alert" style
    letterSpacing: 2,
  },
  divider: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginVertical: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});

export default AirdropScreen;
