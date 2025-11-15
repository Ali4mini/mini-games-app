import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./LuckySpinUI.styles";
import { SPIN_WHEEL_PRIZES } from "@/data/dummyData";
import { SvgSpinWheel } from "@/components/lucky-spin/SvgSpinWheel";
import { SvgSpinPointer } from "@/components/lucky-spin/SvgSpinPointer";

const WHEEL_SEGMENTS = SPIN_WHEEL_PRIZES.length;
const WHEEL_SIZE = 300;
const SEGMENT_COLORS = [
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#64748B",
  "#EC4899",
  "#6366F1",
];

export const LuckySpinUI: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const rotation = useSharedValue(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(1); //BUG: the speed of the spinner is very slow for more other spins except the first one

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Helper function to be called from worklet context
  const onSpinComplete = (prize: string | number) => {
    Alert.alert("Congratulations!", `You won: ${prize}`);
    setIsSpinning(false);
  };

  const handleSpin = () => {
    if (isSpinning || spinsLeft === 0) return;

    setIsSpinning(true);
    setSpinsLeft((prev) => prev - 1);

    // Select a random winner index
    const winnerIndex = Math.floor(Math.random() * WHEEL_SEGMENTS);
    const segmentAngle = 360 / WHEEL_SEGMENTS;

    // Calculate the current rotation (normalized to 0-360 range)
    const currentRotation = rotation.value % 360;
    const normalizedCurrentRotation =
      currentRotation < 0 ? currentRotation + 360 : currentRotation;

    // The center of the winning segment should end up at 0 degrees (top, where the pointer is)
    // The center of the winning segment is currently at: normalizedCurrentRotation + (winnerIndex * segmentAngle + segmentAngle/2)
    // We need to rotate it so that it ends up at 0 degrees
    // So: normalizedCurrentRotation + additionalRotation + (winnerIndex * segmentAngle + segmentAngle/2) = 0 (or 360)
    // additionalRotation = -normalizedCurrentRotation - (winnerIndex * segmentAngle + segmentAngle/2)

    const winningSegmentCenterOffset =
      winnerIndex * segmentAngle + segmentAngle / 2;
    let additionalRotation =
      -normalizedCurrentRotation - winningSegmentCenterOffset;

    // Add multiple full rotations for the spinning effect
    additionalRotation += 360 * 5;

    // Add a small random offset to make it more realistic
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
    const finalRotation =
      normalizedCurrentRotation + additionalRotation + randomOffset;

    // Store the actual prize to be shown when animation completes
    const actualPrize = SPIN_WHEEL_PRIZES[winnerIndex];

    rotation.value = withTiming(
      finalRotation,
      { duration: 4000, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) {
          runOnJS(onSpinComplete)(actualPrize);
        }
      },
    );
  };

  const countdown = "Next free spin in: 23:59:59";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>Lucky Spin</Text>

      <View style={styles.wheelContainer}>
        <TouchableOpacity
          onPress={handleSpin}
          disabled={isSpinning || spinsLeft === 0}
          activeOpacity={0.7}
        >
          <Animated.View style={[animatedStyle]}>
            <SvgSpinWheel
              size={WHEEL_SIZE}
              segments={SPIN_WHEEL_PRIZES}
              colors={SEGMENT_COLORS}
              isSpinning={isSpinning}
              spinsLeft={spinsLeft}
              theme={theme}
            />
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.pointer}>
          <SvgSpinPointer
            size={40}
            color={theme.primary}
            strokeColor={theme.background}
          />
        </View>
      </View>

      {/* Information container below the wheel */}
      <View style={styles.infoContainer}>
        <Text style={styles.spinsLeftText}>
          {spinsLeft > 0 ? `${spinsLeft} Free Spin Left` : "No Free Spins Left"}
        </Text>
        {spinsLeft === 0 && (
          <Text style={styles.countdownText}>{countdown}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};
