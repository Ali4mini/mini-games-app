import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

// --- Import Backend Hook ---
import { useAchievements } from "@/hooks/useAchievements";
import { Theme } from "@/types";

export const AchievementsSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  // 1. RESPONSIVE LAYOUT LOGIC
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const styles = useMemo(
    () => createStyles(theme, isDesktop),
    [theme, isDesktop],
  );

  // 2. Fetch Real Data
  const { achievements, loading } = useAchievements();

  // 3. Calculate Progress
  const unlockedCount = achievements.filter((b) => b.is_completed).length;
  const totalCount = achievements.length;

  if (loading && totalCount === 0) {
    return (
      <View style={[styles.container, { alignItems: "center", height: 100 }]}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  // Safety check if empty
  if (!loading && totalCount === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {t("achievements.title", "ACHIEVEMENTS")}
        </Text>
        <Text style={styles.subtitle}>
          {t("achievements.progress", {
            count: unlockedCount,
            total: totalCount,
          })}
        </Text>
      </View>

      <View style={styles.grid}>
        {achievements.map((badge) => (
          <View key={badge.id} style={styles.badgeWrapper}>
            <View
              style={[
                styles.badgeCircle,
                // Check 'is_completed' from DB
                !badge.is_completed && styles.lockedCircle,
              ]}
            >
              <FontAwesome5
                // DB stores icon string like "trophy" or "coins"
                name={(badge.icon as any) || "trophy"}
                size={isDesktop ? 26 : 22}
                color={
                  badge.is_completed
                    ? theme.secondaryContent
                    : theme.textTertiary
                }
              />
              {!badge.is_completed && (
                <View style={styles.lockIcon}>
                  <FontAwesome5
                    name="lock"
                    size={8}
                    color={theme.backgroundSecondary}
                  />
                </View>
              )}
            </View>

            {/* Title from Database */}
            <Text
              style={[
                styles.badgeName,
                !badge.is_completed && styles.lockedText,
              ]}
              numberOfLines={2} // Allow 2 lines on smaller screens
            >
              {badge.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      marginTop: 0,
      paddingHorizontal: Platform.OS === "web" ? 0 : 24,
      width: "100%",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 14,
      fontWeight: "800",
      color: theme.textSecondary,
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.secondary,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      // Mobile: 'space-between' (3 cols). Desktop: 'flex-start' (many cols)
      justifyContent: isDesktop ? "flex-start" : "space-between",
      gap: isDesktop ? 20 : 12,
    },
    badgeWrapper: {
      // Mobile: 3 columns (~30%). Desktop: Fixed width for cleaner density.
      width: isDesktop ? 100 : "30%",
      alignItems: "center",
      marginBottom: 16,
    },
    badgeCircle: {
      width: isDesktop ? 72 : 64,
      height: isDesktop ? 72 : 64,
      borderRadius: isDesktop ? 36 : 32,
      backgroundColor: theme.secondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 5,
      // Web Shadow
      ...Platform.select({
        web: {
          boxShadow: `0px 4px 15px ${theme.secondary}60`, // 60 = hex opacity
          transition: "transform 0.2s ease", // Hover effect
        },
      }),
    } as ViewStyle,
    lockedCircle: {
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 2,
      borderColor: theme.textTertiary,
      borderStyle: "dashed",
      shadowOpacity: 0,
      elevation: 0,
      ...Platform.select({
        web: {
          boxShadow: "none",
        },
      }),
    } as ViewStyle,
    lockIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: theme.textTertiary,
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.backgroundPrimary,
    },
    badgeName: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.textPrimary,
      textAlign: "center",
      minHeight: 28, // Ensure uniform height for multi-line text
    },
    lockedText: {
      color: theme.textTertiary,
      fontWeight: "500",
    },
  });
