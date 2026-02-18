import React, { useMemo } from "react";
import { View, Text, StyleSheet, Platform, ViewStyle, TextStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

// Define strict types for styling helper
type RankStyle = {
  color: string;
  icon?: string;
  size?: number;
};

// Assuming your types are defined elsewhere, but for clarity:
type LeaderboardEntry = {
  rank: number;
  name: string;
  coins: number;
  isCurrentUser?: boolean;
  avatarUrl?: string; // Optional if you have it
};

type LeaderboardPreviewProps = {
  data: LeaderboardEntry[];
};

export const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({
  data,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Logic: Get Top 3, and ensure current user is found
  const topThree = data.filter((item) => item.rank <= 3).sort((a, b) => a.rank - b.rank);
  const currentUser = data.find((item) => item.isCurrentUser);

  // Helper to get Rank Color/Icon
  const getRankConfig = (rank: number): RankStyle => {
    switch (rank) {
      case 1: return { color: "#FFD700", icon: "trophy", size: 16 }; // Gold
      case 2: return { color: "#C0C0C0", icon: "medal", size: 16 };  // Silver
      case 3: return { color: "#CD7F32", icon: "medal", size: 16 };  // Bronze
      default: return { color: theme.textTertiary, icon: "circle", size: 8 }; // Gray dot
    }
  };

  const renderRow = (item: LeaderboardEntry, isHighlight: boolean = false) => {
    const config = getRankConfig(item.rank);
    
    return (
      <View 
        key={item.rank} 
        style={[styles.row, isHighlight && styles.userRow]}
      >
        {/* Left: Rank & Icon */}
        <View style={styles.rankContainer}>
          <View style={{ width: 24, alignItems: 'center' }}>
            {item.rank <= 3 ? (
               <FontAwesome5 name={config.icon} size={config.size} color={config.color} />
            ) : (
               <Text style={styles.rankNumber}>{item.rank}</Text>
            )}
          </View>
        </View>

        {/* Center: Name */}
        <View style={styles.infoContainer}>
          <Text 
            style={[styles.name, isHighlight && styles.userName]} 
            numberOfLines={1}
          >
            {isHighlight ? t("profile.you", "YOU") : item.name}
          </Text>
        </View>

        {/* Right: Score */}
        <View style={styles.scoreContainer}>
          <Text style={[styles.coins, isHighlight && styles.userCoins]}>
            {item.coins.toLocaleString()}
          </Text>
          {/* Tiny Coin Icon */}
          <FontAwesome5 
            name="coins" 
            size={10} 
            color={isHighlight ? theme.secondaryContent : theme.warning} 
            style={{ marginLeft: 4, opacity: 0.8 }} 
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* Table Header (Optional: Remove if you want just the list) */}
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>{t("common.rank", "RANK")}</Text>
        <Text style={styles.headerLabel}>{t("common.player", "PLAYER")}</Text>
        <Text style={styles.headerLabel}>{t("common.score", "SCORE")}</Text>
      </View>

      {/* Render Top 3 */}
      {topThree.map((item) => renderRow(item))}

      {/* Separator if user is far down, or just spacing */}
      {currentUser && currentUser.rank > 3 && (
        <>
          <View style={styles.divider}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          {/* User Row (Highlighted) */}
          {renderRow(currentUser, true)}
        </>
      )}
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.backgroundSecondary, // Matches Profile Card
      borderRadius: 24,
      paddingVertical: 16,
      paddingHorizontal: 16,
      // Soft Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
      marginBottom: 20,
    },
    headerRow: {
      flexDirection: 'row',
      marginBottom: 12,
      paddingHorizontal: 8,
      opacity: 0.5,
    },
    headerLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      flex: 1,
    },
    
    // --- Row ---
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.backgroundPrimary, // Inset look (darker than card)
      marginBottom: 8,
    },
    
    // --- Current User Highlight Style ---
    userRow: {
      backgroundColor: theme.secondary, // Cyan Background
      borderColor: theme.secondary,
      marginTop: 4,
      // Glow effect for user
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },

    // --- Columns ---
    rankContainer: {
      width: 40,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    rankNumber: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textSecondary,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },

    infoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.textPrimary,
    },
    userName: {
      color: theme.secondaryContent || "#000", // Dark text on Cyan bg
      fontWeight: "800",
    },

    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minWidth: 80,
    },
    coins: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.textPrimary,
      fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
      letterSpacing: -0.5,
    },
    userCoins: {
        color: theme.secondaryContent || "#000",
    },

    // --- Divider ---
    divider: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 4,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.textTertiary,
        opacity: 0.3,
    },
  });
