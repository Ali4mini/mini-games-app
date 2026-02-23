import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Alert,
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
import { Stack } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";
import { useDailyCheckIn, DailyRewardItem } from "@/hooks/useDailyCheckIn";

const MAX_WIDTH = 1024;
const TAB_BAR_OFFSET = 120;

export const DailyCheckInUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;

  const styles = useMemo(
    () => createStyles(theme, insets, isDesktop),
    [theme, insets, isDesktop],
  );

  const confettiRef = useRef<ConfettiCannon>(null);

  // --- HOOK INTEGRATION ---
  // gridData: Array of 7 days with isClaimed, isToday, reward
  // claimReward: Calls the /api/claim-daily-reward custom Go route
  const { gridData, loading, canClaim, claimReward, currentStreak } =
    useDailyCheckIn();

  const [isClaiming, setIsClaiming] = useState(false);

  // Animation logic for the progress bar
  const claimedCount = gridData.filter((r) => r.isClaimed).length;
  const progressPercentage = (claimedCount / 7) * 100;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progressPercentage, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });
  }, [progressPercentage]);

  const handleClaimPress = async () => {
    if (!canClaim || isClaiming) return;

    setIsClaiming(true);
    try {
      const rewardAmount = await claimReward();
      if (rewardAmount) {
        // Trigger confetti!
        setTimeout(() => confettiRef.current?.start(), 100);
      }
    } catch (err) {
      console.error("Claim error", err);
    } finally {
      setIsClaiming(false);
    }
  };

  const animatedProgressBarStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  const renderDayCell = (item: DailyRewardItem) => {
    const isGrandPrize = item.day === 7;

    return (
      <View
        key={item.day}
        style={[
          styles.dayCell,
          isGrandPrize && styles.dayCellGrandPrize,
          item.isClaimed && styles.dayCellClaimed,
          item.isToday && !item.isClaimed && styles.dayCellToday,
          !item.isClaimed && !item.isToday && styles.dayCellFuture,
        ]}
      >
        <Text style={[styles.dayText, item.isClaimed && styles.dayTextClaimed]}>
          {t("dailyCheckIn.day", { day: item.day })}
        </Text>

        <Text
          style={[
            styles.rewardText,
            item.isClaimed && styles.rewardTextClaimed,
            isGrandPrize && { fontSize: 24 },
          ]}
        >
          💰 {item.reward}
        </Text>

        {item.isClaimed && (
          <View style={styles.checkMarkContainer}>
            <Text style={{ fontSize: 12 }}>✅</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading && gridData.length === 0) {
    return (
      <View style={[styles.rootBackground, { justifyContent: "center" }]}>
        <Stack.Screen options={{ headerShown: false, animation: "fade" }} />
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Find the amount for the current day to show on the button
  const nextReward = gridData.find((d) => d.isToday)?.reward || 0;

  return (
    <View style={styles.rootBackground}>
      <Stack.Screen options={{ headerShown: false, animation: "fade" }} />

      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>
                {t("dailyCheckIn.title", "Daily Login")}
              </Text>
              <Text style={styles.subtitle}>
                {t(
                  "dailyCheckIn.subtitle",
                  "Claim rewards every day you log in!",
                )}
              </Text>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarHeader}>
                  <Text style={styles.progressText}>
                    Streak: {currentStreak} Days
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

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleClaimPress}
              disabled={!canClaim || isClaiming}
              activeOpacity={0.8}
            >
              {isClaiming ? (
                <View style={[styles.gradient, styles.buttonDisabled]}>
                  <ActivityIndicator color={theme.textPrimary} />
                </View>
              ) : canClaim ? (
                <LinearGradient
                  colors={theme.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradient}
                >
                  <Text style={styles.buttonText}>
                    {/* {t("dailyCheckIn.claimButton", { reward: nextReward })} */}
                    fuck off
                  </Text>
                </LinearGradient>
              ) : (
                <View style={[styles.gradient, styles.buttonDisabled]}>
                  <Text style={styles.buttonDisabledText}>
                    {t("dailyCheckIn.comeBackTomorrow", "Come Back Tomorrow")}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 999,
              pointerEvents: "none",
            }}
          >
            <ConfettiCannon
              ref={confettiRef}
              count={60}
              origin={{ x: -10, y: 0 }}
              fallSpeed={2000}
              colors={[theme.primary, theme.secondary, "#FFD700"]}
              fadeOut={true}
              autoStart={false}
            />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

// --- MERGED STYLES ---
const createStyles = (theme: Theme, insets: any, isDesktop: boolean) =>
  StyleSheet.create({
    rootBackground: {
      flex: 1,
      // Change this to use your theme background on ALL platforms
      backgroundColor: "transparent",
      alignItems: "center",
    },
    container: {
      flex: 1,
      width: "100%",
      maxWidth: MAX_WIDTH,
      backgroundColor:
        Platform.OS === "web" ? theme.backgroundPrimary : "transparent",
      ...Platform.select({
        web: {
          boxShadow: "0px 0px 24px rgba(0,0,0,0.15)",
        },
      }),
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: TAB_BAR_OFFSET + 100, // Extra space for floating footer
    },
    header: {
      padding: 24,
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.textPrimary,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 24,
      textAlign: "center",
    },
    // Progress Bar
    progressBarContainer: {
      width: "100%",
      marginTop: 10,
    },
    progressBarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    progressText: {
      color: theme.textPrimary,
      fontWeight: "700",
      fontSize: 12,
    },
    progressPercentage: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: "600",
    },
    progressBarBackground: {
      height: 12,
      borderRadius: 6,
      width: "100%",
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 6,
    },
    // Grid
    gridContainer: {
      paddingHorizontal: 20,
    },
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12, // Gap usually works on newer RN versions, fallback is margins
    },
    dayCell: {
      // Logic: 3 columns. (100% - 2 gaps) / 3
      width: isDesktop ? "31%" : "30%",
      aspectRatio: 1,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.05)",
      marginBottom: 10,
    },
    dayCellGrandPrize: {
      width: "100%", // Day 7 takes full width
      aspectRatio: 2.5, // Wider aspect ratio
      backgroundColor: "rgba(255, 215, 0, 0.1)", // Gold tint
      borderColor: "#FFD700",
      marginTop: 5,
    },
    dayCellToday: {
      borderColor: theme.primary,
      borderWidth: 2,
      backgroundColor: "rgba(var(--primary-rgb), 0.1)", // Fallback if you don't use variables
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    dayCellClaimed: {
      opacity: 0.6,
      backgroundColor: theme.backgroundTertiary,
    },
    dayCellFuture: {
      opacity: 0.8,
    },
    dayText: {
      color: theme.textSecondary,
      fontSize: 12,
      marginBottom: 4,
      fontWeight: "600",
    },
    dayTextClaimed: {
      textDecorationLine: "line-through",
    },
    rewardText: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "800",
    },
    rewardTextClaimed: {
      color: theme.textTertiary,
    },
    checkMarkContainer: {
      position: "absolute",
      bottom: 5,
      right: 5,
    },
    // Footer
    footer: {
      position: "absolute",
      bottom: TAB_BAR_OFFSET - 20, // Sit just above the tab bar area
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: "center",
    },
    gradient: {
      width: isDesktop ? 400 : "100%", // Button width constraint on Desktop
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
      cursor: "pointer",
    },
    buttonDisabled: {
      backgroundColor: theme.backgroundTertiary,
      shadowOpacity: 0,
      elevation: 0,
    },
    buttonText: {
      color: "#000",
      fontWeight: "800",
      fontSize: 16,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    buttonDisabledText: {
      color: theme.textTertiary,
      fontWeight: "700",
      fontSize: 14,
    },
  });
