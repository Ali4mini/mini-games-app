import React, { useEffect } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type SplashScreenProps = {
  onFinish: () => void;
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Shared Values for Animation
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    // 1. HEARTBEAT ANIMATION (Thump-Thump... Pause)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 300 }), // Big Thump
        withTiming(1, { duration: 200 }), // Relax
        withTiming(1.1, { duration: 300 }), // Small Thump
        withTiming(1, { duration: 600 }), // Pause/Rest
      ),
      -1, // Infinite Loop
      true, // No reverse, just restart sequence
    );

    // 2. SUBTLE GLOW PULSE
    glowOpacity.value = withRepeat(
      withTiming(0.8, { duration: 1000 }),
      -1,
      true,
    );

    // 3. EXIT SEQUENCE (After 2.5 seconds)
    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 600 }, () => {
        runOnJS(onFinish)();
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* 1. DEEP DARK BACKGROUND */}
      <LinearGradient
        // Deep Black -> Dark Navy -> Deep Violet
        colors={["#000000", "#0f0c29", "#240b36"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.centerContent}>
        {/* 2. BACKGROUND GLOW (Atmosphere behind text) */}
        <Animated.View style={[styles.glowBlob, glowStyle]} />

        {/* 3. MAIN TEXT (Heartbeat) */}
        <Animated.Text style={[styles.title, textStyle]}>
          MysteryPlay
        </Animated.Text>

        {/* 4. SUBTITLE */}
        <Text style={styles.subtitle}>PLAY. WIN. EARN.</Text>
      </View>

      {/* 5. MINIMAL LOADER BAR */}
      <View style={styles.bottomLoader}>
        <LinearGradient
          colors={["#8E2DE2", "#4A00E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
  },
  // The Glow Effect behind the text
  glowBlob: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#8E2DE2", // Purple Glow
    opacity: 0.4,
    // Extremely high blur to make it look like light/fog
    shadowColor: "#8E2DE2",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 20, // For Android
  },
  title: {
    color: "#fff",
    // Using the font you loaded in _layout.tsx
    fontFamily: "LilitaOne",
    fontSize: 56, // Massive size
    letterSpacing: 2,
    textShadowColor: "rgba(142, 45, 226, 0.8)", // Neon purple shadow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  bottomLoader: {
    position: "absolute",
    bottom: 60,
    width: width * 0.4,
    height: 4,
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
    overflow: "hidden",
  },
});
