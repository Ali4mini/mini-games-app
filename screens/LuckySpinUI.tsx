import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/context/ThemeContext";
// 1. IMPORT GLOBAL STATS (For Realtime Coins/Spins)
import { useUserStats } from "@/context/UserStatsContext";
// 2. IMPORT TIMER
import { useDailyTimer } from "@/hooks/useDailyTimer";
// 3. IMPORT GAME LOGIC
import { useLuckySpin } from "@/hooks/useLuckySpin";

import { SPIN_WHEEL_PRIZES } from "@/data/dummyData";
import { SvgSpinWheel } from "@/components/lucky-spin/SvgSpinWheel";
import { SvgSpinPointer } from "@/components/lucky-spin/SvgSpinPointer";
import { WinModal } from "@/components/lucky-spin/WinModal";

const WHEEL_SEGMENTS = SPIN_WHEEL_PRIZES.length;
const WHEEL_SIZE = 340;
const CENTER_BUTTON_SIZE = 80;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SEGMENT_COLORS = [
  "#F72585",
  "#7209B7",
  "#3A0CA3",
  "#4361EE",
  "#4CC9F0",
  "#F59E0B",
  "#10B981",
  "#F43F5E",
];

export const LuckySpinUI: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, insets), [theme, insets]);

  // --- HOOKS ---
  const { playSpin } = useLuckySpin(); // Logic for spinning
  const { stats } = useUserStats(); // Global Realtime Data (Coins/Spins)
  const timeLeft = useDailyTimer(); // Countdown Hook

  const rotation = useSharedValue(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winningPrize, setWinningPrize] = useState<string | number | null>(
    null,
  );

  const confettiRef = useRef<ConfettiCannon>(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const onSpinComplete = (rewardAmount: number) => {
    let prizeText = `+${rewardAmount} COINS`;
    if (rewardAmount >= 5000) prizeText = "JACKPOT! (+5000)";

    setWinningPrize(prizeText);
    setShowConfetti(true);
    setTimeout(() => confettiRef.current?.start(), 100);
    setTimeout(() => setShowWinModal(true), 600);
    setIsSpinning(false);
  };

  const handleSpin = async () => {
    // Check against global stats
    if (isSpinning || stats.spinsLeft <= 0) return;

    setIsSpinning(true);

    const result = await playSpin();

    if (!result) {
      setIsSpinning(false);
      return;
    }

    const { winnerIndex, rewardAmount } = result;

    const segmentAngle = 360 / WHEEL_SEGMENTS;
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.6);
    const targetAngle = -(winnerIndex * segmentAngle) + randomOffset;

    const currentRotation = rotation.value;
    const rotations = 360 * 5;
    const nextRotation =
      currentRotation + rotations + (targetAngle - (currentRotation % 360));

    rotation.value = withTiming(
      nextRotation,
      { duration: 4000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
      (finished) => {
        if (finished) runOnJS(onSpinComplete)(rewardAmount);
      },
    );
  };

  const handleModalClose = () => {
    setShowWinModal(false);
    setWinningPrize(null);
    setTimeout(() => setShowConfetti(false), 500);
  };

  // --- DERIVED STATE ---
  const hasSpins = stats.spinsLeft > 0;

  return (
    <View style={styles.container}>
      <View style={styles.ambientGlowContainer}>
        <View
          style={[styles.ambientGlow, { backgroundColor: theme.primary }]}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {t("luckySpin.title", "LUCKY WHEEL")}
          </Text>
          <Text style={styles.subtitle}>
            {t("luckySpin.subtitle", "Spin to win exclusive prizes!")}
          </Text>
        </View>

        {/* WHEEL */}
        <View style={styles.wheelSection}>
          <View
            style={[
              styles.outerRing,
              { borderColor: theme.backgroundTertiary },
            ]}
          >
            <View style={styles.pointerContainer}>
              <SvgSpinPointer
                size={55}
                color={theme.secondary}
                strokeColor={theme.backgroundPrimary}
              />
            </View>

            <View
              style={[
                styles.innerRing,
                { borderColor: theme.backgroundTertiary },
              ]}
            >
              <Animated.View style={[styles.wheelContainer, animatedStyle]}>
                <SvgSpinWheel
                  size={WHEEL_SIZE}
                  segments={SPIN_WHEEL_PRIZES}
                  colors={SEGMENT_COLORS}
                  theme={theme}
                />
              </Animated.View>

              {/* CENTER BUTTON */}
              <TouchableOpacity
                onPress={handleSpin}
                disabled={isSpinning || !hasSpins}
                activeOpacity={0.9}
                style={[styles.centerButtonWrapper]}
              >
                <LinearGradient
                  colors={
                    isSpinning || !hasSpins
                      ? [theme.textTertiary, theme.backgroundTertiary]
                      : theme.buttonGradient
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.centerButtonGradient}
                >
                  <View style={styles.centerButtonInnerRim}>
                    <Text style={styles.centerButtonText}>
                      {isSpinning ? "..." : "SPIN"}
                    </Text>
                  </View>
                </LinearGradient>

                <View
                  style={[
                    styles.centerButtonShadow,
                    { borderColor: theme.backgroundPrimary },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* HUD STATS */}
        <View style={styles.hudContainer}>
          <View style={styles.statsRow}>
            {/* SPINS LEFT CARD */}
            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.backgroundTertiary,
                },
              ]}
            >
              <Ionicons
                name="ticket"
                size={24}
                color={hasSpins ? theme.primary : theme.textTertiary}
              />
              <View style={styles.statTextContainer}>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  {t("luckySpin.spins", "SPINS")}
                </Text>
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: hasSpins ? theme.textPrimary : theme.textTertiary,
                    },
                  ]}
                >
                  {stats.spinsLeft}
                </Text>
              </View>
            </View>

            {/* NEXT FREE CARD (THE TIMER) */}
            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.backgroundTertiary,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="timer-outline"
                size={24}
                color={!hasSpins ? theme.secondary : theme.textTertiary}
              />
              <View style={styles.statTextContainer}>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  {t("luckySpin.nextFree", "NEXT FREE")}
                </Text>

                {/* 
                   LOGIC: 
                   If they have spins, show "READY".
                   If 0 spins, show Countdown.
                */}
                <Text
                  style={[
                    styles.statValue,
                    { color: !hasSpins ? theme.secondary : theme.success },
                  ]}
                >
                  {hasSpins ? "READY" : timeLeft}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={60}
          origin={{ x: -10, y: 0 }}
          fallSpeed={3500}
          fadeOut={true}
          colors={[theme.primary, theme.secondary, "#FFD700", "#FFF"]}
        />
      )}

      {winningPrize && (
        <WinModal
          visible={showWinModal}
          prize={winningPrize}
          onClose={handleModalClose}
          theme={theme}
        />
      )}
    </View>
  );
};

// ... Styles remain the same ...
const createStyles = (theme: any, insets: any) => {
  return StyleSheet.create({
    // ... (Keep existing styles from previous step)
    container: {
      flex: 1,
      overflow: "hidden",
    },
    ambientGlowContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      zIndex: 0,
    },
    ambientGlow: {
      width: SCREEN_WIDTH * 1.3,
      height: SCREEN_WIDTH * 1.3,
      borderRadius: SCREEN_WIDTH,
      opacity: 0.05,
      position: "absolute",
      top: -50,
    },
    safeArea: {
      flex: 1,
      zIndex: 1,
      justifyContent: "space-between",
    },
    header: {
      alignItems: "center",
      marginTop: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: "900",
      color: theme.textPrimary,
      letterSpacing: 1.5,
    },
    subtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 4,
    },
    wheelSection: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      flex: 1,
    },
    outerRing: {
      width: WHEEL_SIZE + 24,
      height: WHEEL_SIZE + 24,
      borderRadius: (WHEEL_SIZE + 24) / 2,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(125,125,125,0.05)",
      position: "relative",
    },
    innerRing: {
      width: WHEEL_SIZE + 8,
      height: WHEEL_SIZE + 8,
      borderRadius: (WHEEL_SIZE + 8) / 2,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    wheelContainer: {
      width: WHEEL_SIZE,
      height: WHEEL_SIZE,
      justifyContent: "center",
      alignItems: "center",
    },
    pointerContainer: {
      position: "absolute",
      top: -14,
      zIndex: 30,
      alignSelf: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
    },
    centerButtonWrapper: {
      position: "absolute",
      width: CENTER_BUTTON_SIZE,
      height: CENTER_BUTTON_SIZE,
      borderRadius: CENTER_BUTTON_SIZE / 2,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    centerButtonGradient: {
      width: "100%",
      height: "100%",
      borderRadius: CENTER_BUTTON_SIZE / 2,
      padding: 3,
      justifyContent: "center",
      alignItems: "center",
    },
    centerButtonInnerRim: {
      flex: 1,
      width: "100%",
      borderRadius: CENTER_BUTTON_SIZE / 2,
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    centerButtonText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 16,
      letterSpacing: 1,
    },
    centerButtonShadow: {
      position: "absolute",
      width: CENTER_BUTTON_SIZE + 6,
      height: CENTER_BUTTON_SIZE + 6,
      borderRadius: (CENTER_BUTTON_SIZE + 6) / 2,
      borderWidth: 3,
      zIndex: -1,
      opacity: 0.2,
    },
    hudContainer: {
      paddingHorizontal: 20,
      paddingBottom: insets.bottom + 120,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 15,
    },
    statBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 16,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    statTextContainer: {
      marginLeft: 12,
    },
    statLabel: {
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "800",
    },
  });
};
