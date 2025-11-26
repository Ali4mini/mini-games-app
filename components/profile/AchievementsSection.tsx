import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

// Dummy Data
const BADGES = [
  { id: 1, name: "First Win", icon: "trophy", unlocked: true },
  { id: 2, name: "Sniper", icon: "crosshairs", unlocked: true },
  { id: 3, name: "Rich", icon: "coins", unlocked: true },
  { id: 4, name: "Veteran", icon: "medal", unlocked: false }, // Locked
  { id: 5, name: "Speed", icon: "bolt", unlocked: false },    // Locked
  { id: 6, name: "King", icon: "crown", unlocked: false },     // Locked
];

export const AchievementsSection = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>BADGES</Text>
        <Text style={styles.subtitle}>3 / 6 UNLOCKED</Text>
      </View>

      <View style={styles.grid}>
        {BADGES.map((badge) => (
          <View key={badge.id} style={styles.badgeWrapper}>
            <View style={[styles.badgeCircle, !badge.unlocked && styles.lockedCircle]}>
              <FontAwesome5 
                name={badge.icon} 
                size={20} 
                color={badge.unlocked ? theme.secondaryContent : theme.textTertiary} 
              />
              {/* Lock Overlay */}
              {!badge.unlocked && (
                <View style={styles.lockIcon}>
                  <FontAwesome5 name="lock" size={10} color={theme.textTertiary} />
                </View>
              )}
            </View>
            <Text style={[styles.badgeName, !badge.unlocked && styles.lockedText]}>
              {badge.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textPrimary,
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.secondary, // Cyan
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12,
    },
    badgeWrapper: {
      width: "30%", // 3 per row
      alignItems: "center",
      marginBottom: 16,
    },
    badgeCircle: {
      width: 60,
      height: 60,
      borderRadius: 30, // Circle (or use 12 for rounded square)
      backgroundColor: theme.secondary, // Cyan Background (Unlocked)
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      
      // Neon Glow
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 5,
    },
    lockedCircle: {
      backgroundColor: theme.backgroundTertiary, // Dark Gray
      borderWidth: 1,
      borderColor: theme.textTertiary,
      borderStyle: "dashed",
      shadowOpacity: 0, // No glow
      elevation: 0,
    },
    lockIcon: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: theme.backgroundPrimary,
        borderRadius: 10,
        padding: 4,
    },
    badgeName: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.textPrimary,
      textAlign: "center",
    },
    lockedText: {
      color: theme.textTertiary,
    },
  });
