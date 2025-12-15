import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
// 1. Import Hook
import { useLeaderboard, LeaderboardItem } from "@/hooks/useLeaderboard";
import { Stack } from "expo-router";

// --- Sub-Components (Unchanged) ---
const FilterTabs = ({ activeTab, onTabChange, theme }: any) => (
  <View
    style={[styles.filterContainer, { backgroundColor: "rgba(0,0,0,0.2)" }]}
  >
    {["All Time", "Weekly"].map((tab) => {
      const isActive = activeTab === tab;
      return (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          style={[
            styles.filterTab,
            isActive && { backgroundColor: theme.buttonSecondary },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: isActive
                  ? theme.secondaryContent
                  : "rgba(255,255,255,0.6)",
              },
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const PodiumItem = ({ user, size, delay, theme }: any) => {
  // Guard clause if data is loading/missing
  if (!user) return <View style={{ width: size }} />;

  const isFirst = user.rank === 1;
  const crownColor = isFirst
    ? "#FFD700"
    : user.rank === 2
      ? "#C0C0C0"
      : "#CD7F32";
  const borderColor = isFirst
    ? "#FFD700"
    : user.rank === 2
      ? "#C0C0C0"
      : "#CD7F32";
  const pedestalHeight = isFirst ? 140 : user.rank === 2 ? 110 : 90;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[styles.podiumItem, { height: pedestalHeight + 90 }]}
    >
      {isFirst && (
        <View style={styles.crownContainer}>
          <MaterialCommunityIcons name="crown" size={32} color="#FFD700" />
        </View>
      )}
      <View
        style={[
          styles.avatarContainer,
          {
            width: size,
            height: size,
            borderColor: borderColor,
            borderWidth: isFirst ? 4 : 2,
          },
        ]}
      >
        <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        <View style={[styles.rankBadge, { backgroundColor: borderColor }]}>
          <Text style={styles.rankText}>{user.rank}</Text>
        </View>
      </View>
      <Text style={styles.podiumName} numberOfLines={1}>
        {user.username}
      </Text>
      <Text style={[styles.podiumScore, { color: theme.buttonSecondary }]}>
        {user.score.toLocaleString()}
      </Text>
    </Animated.View>
  );
};

const LeaderboardRow = ({ item, isCurrentUser, theme }: any) => {
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: isCurrentUser ? theme.primary + "30" : "transparent",
        }, // Stronger highlight
        isCurrentUser && { borderColor: theme.primary, borderWidth: 1 },
      ]}
    >
      <Text
        style={[
          styles.rowRank,
          { color: isCurrentUser ? theme.primary : theme.textSecondary },
        ]}
      >
        {item.rank}
      </Text>
      <Image source={{ uri: item.avatar }} style={styles.rowAvatar} />
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, { color: theme.textPrimary }]}>
          {item.username} {isCurrentUser ? "(You)" : ""}
        </Text>
      </View>
      <Text style={[styles.rowScore, { color: theme.textPrimary }]}>
        {item.score?.toLocaleString()}
      </Text>
    </View>
  );
};

export const LeaderboardUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("All Time");

  // 2. USE REAL DATA
  const { leaderboard, currentUser, loading, refetch } = useLeaderboard();

  const flatListRef = useRef<FlatList>(null);

  // 3. Separate Data into Top 3 and List
  const topThree = useMemo(() => {
    // Safety: Ensure we have at least empty objects if list is short
    const [first, second, third] = leaderboard;
    return [first, second, third];
  }, [leaderboard]);

  const unifiedListData = useMemo(() => {
    // List starts from rank 4
    const restOfList = leaderboard.filter((u) => u.rank > 3);
    const data: any[] = [...restOfList];

    // Logic: If current user exists but is NOT in the visible list (and not in top 3)
    if (currentUser && currentUser.rank > 3) {
      const isUserInList = restOfList.find((u) => u.id === currentUser.id);

      // If they are not in the fetched list (e.g. rank 55 and we only fetched 50)
      // Add them to the bottom with a spacer
      if (!isUserInList) {
        data.push({ id: "spacer", type: "spacer" });
        data.push({ ...currentUser, type: "user" });
      }
    }
    return data;
  }, [leaderboard, currentUser]);

  // Scroll to user on mount
  useEffect(() => {
    if (unifiedListData.length > 0 && currentUser) {
      const userIndex = unifiedListData.findIndex(
        (item) => item.id === currentUser.id,
      );

      if (userIndex !== -1) {
        const timer = setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: userIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [unifiedListData, currentUser]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "spacer") {
      return (
        <View style={styles.spacerContainer}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={theme.textSecondary}
          />
        </View>
      );
    }
    return (
      <LeaderboardRow
        item={item}
        isCurrentUser={currentUser && item.id === currentUser.id}
        theme={theme}
      />
    );
  };

  if (loading && leaderboard.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0f172a",
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[theme.primary, "#1e1b4b", "#0f172a"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Animated.Text
            entering={FadeInUp.delay(100)}
            style={styles.headerTitle}
          >
            {t("leaderboard.title", "Leaderboard")}
          </Animated.Text>
          <FilterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            theme={theme}
          />
        </View>

        {/* PODIUM SECTION */}
        <View style={styles.podiumContainer}>
          {/* Order: 2nd, 1st, 3rd visually */}
          <PodiumItem user={topThree[1]} size={80} delay={400} theme={theme} />
          <PodiumItem user={topThree[0]} size={100} delay={200} theme={theme} />
          <PodiumItem user={topThree[2]} size={80} delay={600} theme={theme} />
        </View>

        <Animated.View
          entering={FadeInDown.delay(800).springify()}
          style={[
            styles.listSheet,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <View style={styles.sheetHandle} />

          <FlatList
            ref={flatListRef}
            data={unifiedListData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refetch}
                tintColor={theme.primary}
              />
            }
            onScrollToIndexFailed={(info) => {
              flatListRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: true,
              });
            }}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  color: theme.textSecondary,
                }}
              >
                No players found yet. Be the first!
              </Text>
            }
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "LilitaOne",
    color: "#FFFFFF",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  filterContainer: {
    flexDirection: "row",
    borderRadius: 25,
    padding: 4,
    width: "70%",
    justifyContent: "space-between",
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    gap: 15,
  },
  podiumItem: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  crownContainer: {
    marginBottom: -10,
    zIndex: 20,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  avatarContainer: {
    borderRadius: 60,
    marginBottom: 10,
    position: "relative",
    backgroundColor: "#333", // Fallback bg if image loads slow
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  rankBadge: {
    position: "absolute",
    bottom: -5,
    alignSelf: "center",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  rankText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  podiumName: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
    maxWidth: 80,
  },
  podiumScore: {
    fontSize: 12,
    fontWeight: "800",
  },
  listSheet: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  rowRank: {
    fontSize: 16,
    fontWeight: "bold",
    width: 30,
    textAlign: "center",
  },
  rowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
    backgroundColor: "#ccc",
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  spacerContainer: {
    alignItems: "center",
    paddingVertical: 10,
    opacity: 0.5,
  },
});
