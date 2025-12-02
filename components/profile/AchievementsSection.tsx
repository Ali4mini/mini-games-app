import React, { useMemo } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

// --- Import Backend Hook ---
import { useAchievements } from "@/hooks/useAchievements";

export const AchievementsSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 1. Fetch Real Data
  const { achievements, loading } = useAchievements();

  // 2. Calculate Progress
  const unlockedCount = achievements.filter((b) => b.is_completed).length;
  const totalCount = achievements.length;

  if (loading && totalCount === 0) {
    return (
      <View style={[styles.container, { alignItems: "center" }]}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

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
                name={badge.icon as any}
                size={22}
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

            {/* 
               3. Use Title from Database directly. 
               This allows you to add new achievements in Supabase 
               without redeploying the app code for translations.
            */}
            <Text
              style={[
                styles.badgeName,
                !badge.is_completed && styles.lockedText,
              ]}
              numberOfLines={1}
            >
              {badge.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// --- STYLES (Unchanged) ---
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { marginTop: 24, paddingHorizontal: 24 },
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
    subtitle: { fontSize: 10, fontWeight: "700", color: theme.secondary },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12,
    },
    badgeWrapper: { width: "30%", alignItems: "center", marginBottom: 16 },
    badgeCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.secondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 5,
    },
    lockedCircle: {
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 2,
      borderColor: theme.textTertiary,
      borderStyle: "dashed",
      shadowOpacity: 0,
      elevation: 0,
    },
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
    },
    lockedText: { color: theme.textTertiary, fontWeight: "500" },
  });
