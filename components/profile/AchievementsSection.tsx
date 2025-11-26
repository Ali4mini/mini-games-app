import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; // Import hook
import { useTheme } from "@/context/ThemeContext";

// 1. Store keys instead of hardcoded names
const BADGE_DATA = [
  { id: 1, key: "firstWin", icon: "trophy", unlocked: true },
  { id: 2, key: "sniper", icon: "crosshairs", unlocked: true },
  { id: 3, key: "bigSpender", icon: "coins", unlocked: true },
  { id: 4, key: "veteran", icon: "medal", unlocked: false },
  { id: 5, key: "speedster", icon: "bolt", unlocked: false },
  { id: 6, key: "legend", icon: "crown", unlocked: false },
];

export const AchievementsSection = () => {
  const { t } = useTranslation(); // 2. Init hook
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const unlockedCount = BADGE_DATA.filter(b => b.unlocked).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {/* 3. Translate Title */}
        <Text style={styles.title}>{t("achievements.title", "ACHIEVEMENTS")}</Text>
        <Text style={styles.subtitle}>
          {t("achievements.progress", { count: unlockedCount, total: BADGE_DATA.length })}
        </Text>
      </View>

      <View style={styles.grid}>
        {BADGE_DATA.map((badge) => (
          <View key={badge.id} style={styles.badgeWrapper}>
            <View style={[styles.badgeCircle, !badge.unlocked && styles.lockedCircle]}>
              <FontAwesome5 
                name={badge.icon} 
                size={22} 
                color={badge.unlocked ? theme.secondaryContent : theme.textTertiary} 
              />
              {!badge.unlocked && (
                <View style={styles.lockIcon}>
                  <FontAwesome5 name="lock" size={8} color={theme.backgroundSecondary} />
                </View>
              )}
            </View>
            
            {/* 4. Translate Badge Name dynamically */}
            <Text style={[styles.badgeName, !badge.unlocked && styles.lockedText]} numberOfLines={1}>
              {t(`achievements.names.${badge.key}`)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};


const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { marginTop: 24, paddingHorizontal: 24 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    title: { fontSize: 14, fontWeight: "800", color: theme.textSecondary, letterSpacing: 1 },
    subtitle: { fontSize: 10, fontWeight: "700", color: theme.secondary },
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
    badgeWrapper: { width: "30%", alignItems: "center", marginBottom: 16 },
    badgeCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.secondary, alignItems: "center", justifyContent: "center", marginBottom: 8, shadowColor: theme.secondary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
    lockedCircle: { backgroundColor: theme.backgroundTertiary, borderWidth: 2, borderColor: theme.textTertiary, borderStyle: "dashed", shadowOpacity: 0, elevation: 0 },
    lockIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: theme.textTertiary, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: theme.backgroundPrimary },
    badgeName: { fontSize: 11, fontWeight: "700", color: theme.textPrimary, textAlign: "center" },
    lockedText: { color: theme.textTertiary, fontWeight: "500" },
  });
