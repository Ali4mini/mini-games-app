import React, { useState, useMemo, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./DailyCheckInUI.styles";
import { DAILY_REWARDS } from "@/data/dummyData";
import { DailyReward } from "@/types";

const TODAY_INDEX = 3;

export const DailyCheckInUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const confettiRef = useRef<ConfettiCannon>(null);

  const [rewards, setRewards] = useState<DailyReward[]>(DAILY_REWARDS);

  // Calculate progress based on claimed days
  const claimedCount = rewards.filter((reward) => reward.claimed).length;
  const progressPercentage = (claimedCount / rewards.length) * 100;

  // Animated progress value
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    // Animate the progress bar when rewards change
    animatedProgress.value = withTiming(progressPercentage, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });
  }, [progressPercentage, animatedProgress]);

  const todayReward = rewards[TODAY_INDEX];
  const canClaim = todayReward && !todayReward.claimed;

  const handleClaimReward = () => {
    if (!canClaim) return;

    const updatedRewards = rewards.map((reward, index) => {
      if (index === TODAY_INDEX) {
        return { ...reward, claimed: true };
      }
      return reward;
    });
    setRewards(updatedRewards);

    // Trigger confetti after a short delay
    setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    }, 300);
  };

  // Animated style for the progress bar fill
  const animatedProgressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value}%`,
    };
  });

  const renderDayCell = (item: DailyReward, index: number) => {
    const isToday = index === TODAY_INDEX;
    const isFuture = index > TODAY_INDEX;
    const isGrandPrize = item.day === 7;

    return (
      <View
        key={item.day}
        style={[
          styles.dayCell,
          item.claimed && styles.dayCellClaimed,
          isToday && styles.dayCellToday,
          isFuture && !item.claimed && styles.dayCellFuture,
          isGrandPrize &&
            !isToday &&
            !item.claimed && [
              styles.dayCellGrandPrize,
              { width: "60%", aspectRatio: 0.9 },
            ],
          isGrandPrize &&
            (isToday || item.claimed) && [
              styles.dayCellToday,
              styles.dayCellGrandPrize,
              { width: "60%", aspectRatio: 0.9 },
            ],
        ]}
      >
        <Text style={[styles.dayText, item.claimed && styles.dayTextClaimed]}>
          {t("dailyCheckIn.day", { day: item.day })}
        </Text>
        <Text
          style={[styles.rewardText, item.claimed && styles.rewardTextClaimed]}
        >
          💰 {item.reward}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("dailyCheckIn.title")}</Text>
        <Text style={styles.subtitle}>{t("dailyCheckIn.subtitle")}</Text>

        {/* Progress Bar Section */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarHeader}>
            <Text style={styles.progressText}>
              {t("dailyCheckIn.progress", {
                claimed: claimedCount,
                total: rewards.length,
              })}
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          <View
            style={[
              styles.progressBarBackground,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBarFill,
                animatedProgressBarStyle,
                { backgroundColor: theme.buttonSecondary },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.daysGrid}>
          {rewards.map((item, index) => renderDayCell(item, index))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleClaimReward} disabled={!canClaim}>
          {canClaim ? (
            <LinearGradient
              colors={theme.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>
                {t("dailyCheckIn.claimButton", { reward: todayReward.reward })}
              </Text>
            </LinearGradient>
          ) : (
            <View style={[styles.gradient, styles.buttonDisabled]}>
              <Text style={styles.buttonDisabledText}>
                {todayReward.claimed
                  ? t("dailyCheckIn.claimedButton")
                  : t("dailyCheckIn.comeBackTomorrow")}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Confetti Cannon - Hidden until triggered */}
      <ConfettiCannon
        ref={confettiRef}
        count={150}
        origin={{ x: -50, y: 0 }}
        fallSpeed={2000}
        colors={[
          "#ff0000",
          "#00ff00",
          "#0000ff",
          "#ffff00",
          "#ff00ff",
          "#00ffff",
        ]}
        fadeOut={true}
        autoStart={false}
        explosionSpeed={500}
      />
    </SafeAreaView>
  );
};
