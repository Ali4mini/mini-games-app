import React, { useState, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";

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
              colors={theme.accentButtonGradient}
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
              <Text style={styles.buttonText}>
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
