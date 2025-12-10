import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";

const { width, height } = Dimensions.get("window");

// Calculate a safe max size that creates impact but doesn't fill the screen width
// We cap it at roughly 70% of the screen width
const BLOB_SIZE = width * 0.7;

// --- Types ---
interface BlobProps {
  color: string;
  width: number;
  height: number;
  initialTop: number;
  initialLeft: number;
  moveDuration: number;
  fadeDuration: number;
  baseOpacity: number;
  borderRadiusConfig: {
    tl: number;
    tr: number;
    br: number;
    bl: number;
  };
}

// --- Individual Organic Blob ---
const OrganicBlob: React.FC<BlobProps> = ({
  color,
  width: blobWidth,
  height: blobHeight,
  initialTop,
  initialLeft,
  moveDuration,
  fadeDuration,
  baseOpacity,
  borderRadiusConfig,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(baseOpacity);

  useEffect(() => {
    // 1. Movement (Unchanged - this part was fine)
    translateY.value = withRepeat(
      withSequence(
        withTiming(-20, {
          duration: moveDuration / 2,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: moveDuration / 2,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      true,
    );

    translateX.value = withRepeat(
      withSequence(
        withTiming(15, {
          duration: moveDuration / 3,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: moveDuration / 3,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      true,
    );

    // 2. Rotation (Unchanged)
    rotate.value = withRepeat(
      withTiming(360, { duration: moveDuration * 2, easing: Easing.linear }),
      -1,
      false,
    );

    // 3. IMPROVED BREATHING OPACITY
    opacity.value = withDelay(
      // Increase initial random delay to desynchronize blobs further
      Math.random() * 4000,
      withRepeat(
        withTiming(
          baseOpacity + 0.04, // <-- REDUCED INTENSITY (was 0.08)
          {
            duration: fadeDuration,
            easing: Easing.inOut(Easing.sin), // <-- SMOOTHER EASING (Sine wave)
          },
        ),
        -1, // Infinite
        true, // Reverse: true (This handles the fade out automatically and smoothly)
      ),
    );
  }, [baseOpacity, moveDuration, fadeDuration]); // Added dependencies for safety

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          backgroundColor: color,
          width: blobWidth,
          height: blobHeight,
          top: initialTop,
          left: initialLeft,
          // Unstructured Shape logic
          borderTopLeftRadius: borderRadiusConfig.tl,
          borderTopRightRadius: borderRadiusConfig.tr,
          borderBottomRightRadius: borderRadiusConfig.br,
          borderBottomLeftRadius: borderRadiusConfig.bl,
        },
        animatedStyle,
      ]}
    />
  );
};

// --- Main Background Component ---
const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  const isDark = theme.backgroundPrimary === "#0F172A" || theme.type === "dark";

  // Slightly higher opacity since they are smaller now
  const baseOpacity = isDark ? 0.1 : 0.15;

  const blobs = [
    {
      // 1. Top Left Corner (Violet)
      // Tucked into the corner so it doesn't cross the middle
      color: theme.primary,
      width: BLOB_SIZE,
      height: BLOB_SIZE,
      initialTop: -BLOB_SIZE * 0.4,
      initialLeft: -BLOB_SIZE * 0.3,
      moveDuration: 12000,
      fadeDuration: 8000,
      // Shape: Like a tear drop
      borderRadiusConfig: { tl: 100, tr: 60, br: 120, bl: 80 },
    },
    {
      // 2. Middle Right Edge (Cyan)
      // Positioned vertically centered, sticking out from the Right
      color: theme.secondary,
      width: BLOB_SIZE * 0.9,
      height: BLOB_SIZE * 0.9,
      initialTop: height / 2 - BLOB_SIZE / 2,
      initialLeft: width - BLOB_SIZE * 0.5, // Only half visible
      moveDuration: 15000,
      fadeDuration: 10000,
      // Shape: Elongated oval
      borderRadiusConfig: { tl: 80, tr: 150, br: 80, bl: 150 },
    },
    {
      // 3. Bottom Left Corner (Dark Violet)
      // Tucked into the bottom corner
      color: theme.buttonPrimary,
      width: BLOB_SIZE,
      height: BLOB_SIZE,
      initialTop: height - BLOB_SIZE * 0.6,
      initialLeft: -BLOB_SIZE * 0.4,
      moveDuration: 18000,
      fadeDuration: 10000,
      // Shape: Wobbly square
      borderRadiusConfig: { tl: 120, tr: 90, br: 100, bl: 60 },
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundPrimary }]}
    >
      {/* 1. Blobs Layer */}
      <View style={StyleSheet.absoluteFill}>
        {blobs.map((blob, index) => (
          <OrganicBlob key={index} {...blob} baseOpacity={baseOpacity} />
        ))}
      </View>

      {/* 2. Mist/Noise Overlay
          Helps blend the "View" shapes into the background color
      */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? "rgba(0,0,0,0.02)"
              : "rgba(255,255,255,0.4)",
          },
        ]}
      />

      {/* 3. App Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default Background;
