import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { LeaderboardUser } from "@/types";

export const LeaderboardUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Mock current user data - in a real app, this would come from your auth system
  const currentUser: LeaderboardUser = {
    id: "current-user",
    username: "You",
    avatar: "https://via.placeholder.com/40x40/FF6B6B/FFFFFF?textPrimary=Y",
    coins: 4250,
    rank: 25,
    dailyStreak: 7,
    totalGamesPlayed: 32,
    isOnline: true,
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <Leaderboard
          currentUser={currentUser}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
