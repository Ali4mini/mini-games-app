import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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

// 1. Import Hook
import { useDailyCheckIn, DailyRewardItem } from "@/hooks/useDailyCheckIn";

export const DailyCheckInUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const confettiRef = useRef<ConfettiCannon>(null);

  // 2. Use Real Data
  const { gridData, loading, canClaim, claimReward, currentStreak } =
    useDailyCheckIn();

  // Animation logic
  const claimedCount = gridData.filter((r) => r.isClaimed).length;
  // Progress is 0-100 based on 7 days
  const progressPercentage = (claimedCount / 7) * 100;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progressPercentage, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });
  }, [progressPercentage, animatedProgress]);

  const handleClaimPress = async () => {
    if (!canClaim) return;

    // Call server
    const reward = await claimReward();

    if (reward) {
      // Only fire confetti if successful
      setTimeout(() => confettiRef.current?.start(), 100);
    }
  };

  const animatedProgressBarStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  const renderDayCell = (item: DailyRewardItem) => {
    const isGrandPrize = item.day === 7;

    // Style Mapping based on Hook Data
    const cellStyle = [
      styles.dayCell,
      item.isClaimed && styles.dayCellClaimed,
      item.isToday && styles.dayCellToday, // "Today" in CSS means Active Target
      // If it's future and not active
      !item.isClaimed && !item.isToday && styles.dayCellFuture,
      isGrandPrize && styles.dayCellGrandPrize,
    ];

    return (
      <View key={item.day} style={cellStyle}>
        <Text style={[styles.dayText, item.isClaimed && styles.dayTextClaimed]}>
          {t("dailyCheckIn.day", { day: item.day })}
        </Text>
        <Text
          style={[
            styles.rewardText,
            item.isClaimed && styles.rewardTextClaimed,
          ]}
        >
          💰 {item.reward}
        </Text>
        {/* Optional: Add Checkmark Icon if claimed */}
        {item.isClaimed && (
          <Text
            style={{ position: "absolute", bottom: 5, right: 5, fontSize: 10 }}
          >
            ✅
          </Text>
        )}
      </View>
    );
  };

  if (loading && gridData.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Determine current active reward to show on button
  const nextReward = gridData.find((d) => d.isToday)?.reward || 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("dailyCheckIn.title")}</Text>
          <Text style={styles.subtitle}>{t("dailyCheckIn.subtitle")}</Text>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarHeader}>
              <Text style={styles.progressText}>
                {/* Show Streak instead of "3/7" claimed, it feels better */}
                Current Streak: {currentStreak} Days
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
            {gridData.map((item) => renderDayCell(item))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity onPress={handleClaimPress} disabled={!canClaim}>
          {canClaim ? (
            <LinearGradient
              colors={theme.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>
                {t("dailyCheckIn.claimButton", { reward: nextReward })}
              </Text>
            </LinearGradient>
          ) : (
            <View style={[styles.gradient, styles.buttonDisabled]}>
              <Text style={styles.buttonDisabledText}>
                {t("dailyCheckIn.comeBackTomorrow")}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ConfettiCannon
        ref={confettiRef}
        count={60}
        origin={{ x: -10, y: 0 }}
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
      />
    </SafeAreaView>
  );
};
