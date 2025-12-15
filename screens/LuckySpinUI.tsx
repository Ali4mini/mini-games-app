import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions, // Use this instead of Dimensions for responsive web
  Platform,
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
  cancelAnimation,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { supabase } from "@/utils/supabase";

// --- CONTEXTS & HOOKS ---
import { useTheme } from "@/context/ThemeContext";
import { useUserStats } from "@/context/UserStatsContext";
import { useDailyTimer } from "@/hooks/useDailyTimer";
import { useLuckySpin } from "@/hooks/useLuckySpin";
import { useRewardAd } from "@/hooks/ads/useRewardedAd";

// --- COMPONENTS & DATA ---
import { SPIN_WHEEL_PRIZES } from "@/data/dummyData";
import { SvgSpinWheel } from "@/components/lucky-spin/SvgSpinWheel";
import { SvgSpinPointer } from "@/components/lucky-spin/SvgSpinPointer";
import { WinModal } from "@/components/lucky-spin/WinModal";
import { Theme } from "@/types";

// --- CONSTANTS ---
const WHEEL_SEGMENTS = SPIN_WHEEL_PRIZES.length;
const WHEEL_SIZE = 340;
const CENTER_BUTTON_SIZE = 80;
const MAX_WIDTH = 1024; // Desktop constraint
const TAB_BAR_OFFSET = 120; // Standardized bottom offset

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

  // 1. RESPONSIVE DIMENSIONS
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const containerWidth = Math.min(windowWidth, MAX_WIDTH);

  // Pass dynamic width to styles
  const styles = useMemo(
    () => createStyles(theme, insets, containerWidth),
    [theme, insets, containerWidth],
  );

  // --- HOOKS ---
  const { playSpin } = useLuckySpin();
  const { stats, refreshStats } = useUserStats();
  const timeLeft = useDailyTimer();
  const { showAd, isAdLoaded } = useRewardAd();

  // --- LOCAL STATE ---
  const rotation = useSharedValue(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  // Modal Data
  const [winningPrizeLabel, setWinningPrizeLabel] = useState("");
  const [winningAmount, setWinningAmount] = useState(0);

  const confettiRef = useRef<ConfettiCannon>(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // --- EVENT: SPIN FINISHED ---
  const onSpinComplete = (rewardAmount: number) => {
    let prizeText = `+${rewardAmount} COINS`;
    if (rewardAmount >= 5000) prizeText = "JACKPOT! (+5000)";

    setWinningPrizeLabel(prizeText);
    setWinningAmount(rewardAmount);

    setShowConfetti(true);
    setTimeout(() => confettiRef.current?.start(), 100);
    setTimeout(() => setShowWinModal(true), 600);
    setIsSpinning(false);

    refreshStats();
  };

  // --- LOGIC: WATCH AD FOR FREE SPIN ---
  const handleWatchAdForSpin = () => {
    if (!isAdLoaded) {
      Alert.alert("Loading...", "Please wait a moment for the video to load.");
      return;
    }

    showAd(async () => {
      const { error } = await supabase.rpc("add_one_spin");
      if (error) {
        Alert.alert("Error", "Could not add spin. Please try again.");
      } else {
        Alert.alert("Success!", "You've earned 1 Free Spin!");
      }
    });
  };

  // --- LOGIC: MAIN SPIN ACTION ---
  const handleSpin = async () => {
    if (stats.spinsLeft <= 0) {
      handleWatchAdForSpin();
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);

    const startRotation = rotation.value;
    rotation.value = withTiming(startRotation + 360 * 50, {
      duration: 10000,
      easing: Easing.linear,
    });

    try {
      const [result] = await Promise.all([
        playSpin(),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      if (!result) {
        cancelAnimation(rotation);
        rotation.value = startRotation;
        setIsSpinning(false);
        return;
      }

      const { winnerIndex, rewardAmount } = result;

      cancelAnimation(rotation);
      const currentRotation = rotation.value;
      const segmentAngle = 360 / WHEEL_SEGMENTS;

      const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.5);
      const winningAngle = -(winnerIndex * segmentAngle) + randomOffset;

      const normalizedCurrent = currentRotation % 360;
      let distanceToAngle = winningAngle - normalizedCurrent;
      while (distanceToAngle < 0) distanceToAngle += 360;

      const extraRotations = 360 * 2;
      const finalRotation = currentRotation + distanceToAngle + extraRotations;

      rotation.value = withTiming(
        finalRotation,
        {
          duration: 2500,
          easing: Easing.bezier(0.1, 0.4, 0.2, 1),
        },
        (finished) => {
          if (finished) runOnJS(onSpinComplete)(rewardAmount);
        },
      );
    } catch (e) {
      console.error(e);
      cancelAnimation(rotation);
      setIsSpinning(false);
      Alert.alert("Error", "Connection failed. Please try again.");
    }
  };

  // --- LOGIC: WATCH AD TO DOUBLE REWARD ---
  const handleDoubleReward = () => {
    if (!isAdLoaded) {
      Alert.alert("Ad Loading", "Please wait for the video to load.");
      return;
    }

    showAd(async () => {
      const { error } = await supabase.rpc("add_coins", {
        amount: winningAmount,
      });

      if (error) {
        Alert.alert("Error", "Could not double coins.");
      } else {
        handleModalClose();
        setTimeout(() => {
          Alert.alert(
            "Doubled!",
            `You received an extra ${winningAmount} coins!`,
          );
        }, 500);
      }
    });
  };

  const handleModalClose = () => {
    setShowWinModal(false);
    setTimeout(() => setShowConfetti(false), 500);
  };

  const hasSpins = stats.spinsLeft > 0;

  return (
    // ROOT BACKGROUND: Centers the app on Desktop
    <View style={styles.rootBackground}>
      <View style={styles.container}>
        {/* BACKGROUND GLOW */}
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

          {/* WHEEL SECTION */}
          <View style={styles.wheelSection}>
            <View
              style={[
                styles.outerRing,
                { borderColor: theme.backgroundTertiary },
              ]}
            >
              {/* POINTER */}
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
                {/* SPINNING WHEEL SVG */}
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
                  disabled={isSpinning}
                  activeOpacity={0.9}
                  style={styles.centerButtonOuter}
                >
                  <LinearGradient
                    colors={
                      isSpinning
                        ? ["#475569", "#1e293b"]
                        : !hasSpins
                          ? ["#F59E0B", "#D97706"]
                          : ["#38bdf8", "#2563eb"]
                    }
                    style={styles.centerButtonInner}
                  >
                    <View style={styles.centerButtonHighlight} />

                    {isSpinning ? (
                      <Text style={styles.centerButtonText}>...</Text>
                    ) : !hasSpins ? (
                      <View style={{ alignItems: "center" }}>
                        <MaterialCommunityIcons
                          name="play-box-outline"
                          size={24}
                          color="#FFF"
                        />
                        <Text
                          style={[styles.centerButtonText, { fontSize: 10 }]}
                        >
                          FREE
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.centerButtonText}>SPIN</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* HUD STATS */}
          <View style={styles.hudContainer}>
            <View style={styles.statsRow}>
              {/* SPINS LEFT */}
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
                        color: hasSpins
                          ? theme.textPrimary
                          : theme.textTertiary,
                      },
                    ]}
                  >
                    {stats.spinsLeft}
                  </Text>
                </View>
              </View>

              {/* NEXT FREE TIMER */}
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

        {/* CONFETTI - Must remain outside SafeAreaView but inside Container */}
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

        {/* WIN MODAL */}
        <WinModal
          visible={showWinModal}
          prizeLabel={winningPrizeLabel}
          prizeValue={winningAmount}
          onClose={handleModalClose}
          onDoubleClaim={handleDoubleReward}
          isAdLoaded={isAdLoaded}
          theme={theme}
        />
      </View>
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme, insets: any, containerWidth: number) => {
  return StyleSheet.create({
    rootBackground: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
      alignItems: "center", // Center the container
    },
    container: {
      flex: 1,
      width: "100%",
      maxWidth: MAX_WIDTH, // Desktop constraint
      backgroundColor: theme.backgroundPrimary,
      overflow: "hidden", // Important for confetti not to trigger scrollbars on web
      ...Platform.select({
        web: {
          boxShadow: "0px 0px 24px rgba(0,0,0,0.15)",
        },
      }),
    },
    ambientGlowContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      zIndex: 0,
    },
    ambientGlow: {
      // Logic: Scaled based on container width, but capped for cleaner desktop look
      width: containerWidth * 1.3,
      height: containerWidth * 1.3,
      borderRadius: containerWidth,
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
    centerButtonInner: {
      width: 66,
      height: 66,
      borderRadius: 33,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
    },
    centerButtonHighlight: {
      position: "absolute",
      top: 6,
      width: 40,
      height: 20,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.25)",
    },
    centerButtonOuter: {
      position: "absolute",
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: "#e2e8f0",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 20,
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
    },
    centerButtonText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 16,
      letterSpacing: 1,
    },
    hudContainer: {
      paddingHorizontal: 20,
      // Fix: Add TAB_BAR_OFFSET so stats aren't hidden behind the floating nav
      paddingBottom: insets.bottom + TAB_BAR_OFFSET,
      width: "100%",
      alignItems: "center", // Center the stats row on Desktop
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 15,
      width: "100%",
      maxWidth: 500, // Constraint Stats width on Desktop so they don't look spread out
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
