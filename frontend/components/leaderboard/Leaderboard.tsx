import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { LeaderboardUser } from "@/types";
import { LEADERBOARD_USERS } from "@/data/dummyData";
import { TFunction } from "i18next";

interface LeaderboardProps {
  currentUser?: LeaderboardUser;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUser,
  onRefresh,
  refreshing = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Combine current user with leaderboard data if they're not already included
  const allUsers = useMemo(() => {
    if (
      currentUser &&
      !LEADERBOARD_USERS.some((user) => user.id === currentUser.id)
    ) {
      return [...LEADERBOARD_USERS, currentUser].sort(
        (a, b) => b.coins - a.coins,
      );
    }
    return LEADERBOARD_USERS;
  }, [currentUser]);

  // Add rank to each user
  const usersWithRanks = useMemo(() => {
    return allUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }, [allUsers]);

  const renderUser = ({ item }: { item: LeaderboardUser }) => (
    <UserRow user={item} currentUser={currentUser} t={t} />
  );

  const currentUserIndex = currentUser
    ? usersWithRanks.findIndex((user) => user.id === currentUser.id)
    : -1;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundPrimary }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {t("leaderboard.title")}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t("leaderboard.subtitle")}
        </Text>
      </View>

      {/* Current User Card (if exists and not in top 10) */}
      {currentUser && currentUserIndex >= 10 && (
        <CurrentUserCard user={currentUser} t={t} />
      )}

      {/* Leaderboard List */}
      <FlatList
        data={usersWithRanks.slice(0, 20)} // Show top 20
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.buttonSecondary]}
            tintColor={theme.buttonSecondary}
          />
        }
      />
    </View>
  );
};

// Individual user row component
const UserRow: React.FC<{
  user: LeaderboardUser;
  currentUser?: LeaderboardUser;
  t: TFunction<"translation", undefined>;
}> = ({ user, currentUser, t }) => {
  const theme = useTheme();
  const isCurrentUser = currentUser?.id === user.id;

  // Determine medal for top 3
  const getMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { backgroundColor: "#FFD700", color: "#000" }; // Gold
    if (rank === 2) return { backgroundColor: "#C0C0C0", color: "#000" }; // Silver
    if (rank === 3) return { backgroundColor: "#CD7F32", color: "#FFF" }; // Bronze
    return {
      backgroundColor: theme.backgroundSecondary,
      color: theme.textPrimary,
    };
  };

  return (
    <View
      style={[
        styles.userRow,
        isCurrentUser && styles.currentUserRow,
        {
          backgroundColor: isCurrentUser
            ? theme.primary
            : theme.backgroundSecondary,
        },
      ]}
    >
      {/* Rank */}
      <View style={[styles.rankContainer, getRankStyle(user.rank)]}>
        {getMedal(user.rank) ? (
          <Text
            style={[styles.rankText, { color: getRankStyle(user.rank).color }]}
          >
            {getMedal(user.rank)}
          </Text>
        ) : (
          <Text
            style={[styles.rankText, { color: getRankStyle(user.rank).color }]}
          >
            {user.rank}
          </Text>
        )}
      </View>

      {/* Avatar */}
      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text
          style={[
            styles.username,
            { color: theme.textPrimary },
            isCurrentUser && styles.currentUserText,
          ]}
        >
          {user.username}
        </Text>
        <View style={styles.statsRow}>
          <Text style={[styles.stat, { color: theme.textSecondary }]}>
            {user.dailyStreak} {t("leaderboard.days")}
          </Text>
          <Text style={[styles.stat, { color: theme.textSecondary }]}>
            {user.totalGamesPlayed} {t("leaderboard.games")}
          </Text>
        </View>
      </View>

      {/* Coins */}
      <View style={styles.coinsContainer}>
        <Text style={[styles.coins, { color: theme.buttonSecondary }]}>
          💰 {user.coins.toLocaleString()}
        </Text>
        {user.isOnline && <View style={styles.onlineIndicator} />}
      </View>
    </View>
  );
};

// Current user card when they're not in top 10
const CurrentUserCard: React.FC<{
  user: LeaderboardUser;
  t: TFunction<"translation", undefined>;
}> = ({ user, t }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.currentUserCard,
        { backgroundColor: theme.backgroundSecondary },
      ]}
    >
      <Text style={[styles.currentUserCardText, { color: theme.textPrimary }]}>
        {t("leaderboard.yourRank", { rank: user.rank })}
      </Text>
      <Text
        style={[styles.currentUserCardCoins, { color: theme.buttonSecondary }]}
      >
        💰 {user.coins.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "LilitaOne",
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
  },
  currentUserRow: {
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  stat: {
    fontSize: 12,
    opacity: 0.7,
  },
  coinsContainer: {
    alignItems: "flex-end",
  },
  coins: {
    fontWeight: "bold",
    fontSize: 16,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginTop: 4,
  },
  currentUserCard: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentUserCardText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currentUserCardCoins: {
    fontSize: 18,
    fontWeight: "bold",
  },
  currentUserText: {
    color: "#4A90E2",
  },
});
