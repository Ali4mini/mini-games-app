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
  Platform,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/context/AuthContext";
import { getStorageUrl } from "@/utils/imageHelpers";

// --- CONSTANTS ---
const MAX_WIDTH = 1024;
const TAB_BAR_OFFSET = 120;

// --- SUB-COMPONENTS ---
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
  if (!user) return <View style={{ width: size }} />;

  const isFirst = user.rank === 1;
  const rankColors: any = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
  const color = rankColors[user.rank] || "#FFF";
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
            borderColor: color,
            borderWidth: isFirst ? 4 : 2,
          },
        ]}
      >
        <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        <View style={[styles.rankBadge, { backgroundColor: color }]}>
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
        },
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
  const { session } = useAuth(); // Local user details

  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;

  // DATA HOOK: Custom Go Route Integration
  const { leaderboard, currentUserRank, loading, refetch } = useLeaderboard();

  const flatListRef = useRef<FlatList>(null);

  const topThree = useMemo(() => {
    // Top 3 from the leaderboard array
    return [leaderboard[0], leaderboard[1], leaderboard[2]];
  }, [leaderboard]);

  const unifiedListData = useMemo(() => {
    // 1. Get everyone from rank 4 downwards
    const restOfList = leaderboard.filter((u) => u.rank > 3);
    const data: any[] = [...restOfList];

    // 2. Logic: If I'm not in the top 50, show me at the bottom with a spacer
    const amInTopList = leaderboard.some((u) => u.id === session?.id);

    if (!amInTopList && currentUserRank > 50 && session) {
      data.push({ id: "spacer", type: "spacer" });
      data.push({
        id: session.id,
        username: session.username || session.name || "Player",
        // Using session object for image resolution
        avatar: getStorageUrl(session, session.avatar),
        score: session.coins || 0,
        rank: currentUserRank,
        type: "user",
      });
    }
    return data;
  }, [leaderboard, currentUserRank, session]);

  // Handle auto-scroll to current user
  useEffect(() => {
    if (unifiedListData.length > 0 && session) {
      const userIndex = unifiedListData.findIndex(
        (item) => item.id === session.id,
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
  }, [unifiedListData, session?.id]);

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
        isCurrentUser={session?.id === item.id}
        theme={theme}
      />
    );
  };

  if (loading && leaderboard.length === 0) {
    return (
      <View
        style={[
          styles.rootBackground,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.rootBackground}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={[theme.primary, "#1e1b4b", "#0f172a"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.container}>
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

          <View style={styles.podiumContainer}>
            <PodiumItem
              user={topThree[1]}
              size={80}
              delay={400}
              theme={theme}
            />
            <PodiumItem
              user={topThree[0]}
              size={100}
              delay={200}
              theme={theme}
            />
            <PodiumItem
              user={topThree[2]}
              size={80}
              delay={600}
              theme={theme}
            />
          </View>

          <Animated.View
            entering={FadeInDown.delay(800).springify()}
            style={[
              styles.listSheet,
              {
                backgroundColor: theme.backgroundSecondary,
                borderBottomLeftRadius: isDesktop ? 30 : 0,
                borderBottomRightRadius: isDesktop ? 30 : 0,
                marginBottom: isDesktop ? 20 : 0,
              },
            ]}
          >
            <View style={styles.sheetHandle} />

            <FlatList
              ref={flatListRef}
              data={unifiedListData}
              renderItem={renderItem}
              keyExtractor={(item, index) =>
                item.id === "spacer" ? `spacer-${index}` : item.id
              }
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
                  No players found yet.
                </Text>
              }
            />
          </Animated.View>
        </SafeAreaView>
      </View>
    </View>
  );
};

// ... (Styles remain identical to your provided CSS)

// --- STYLES ---
const styles = StyleSheet.create({
  // New Root for Gradient Background
  rootBackground: {
    flex: 1,
    backgroundColor: "#0f172a", // Fallback color
    alignItems: "center",
  },
  // Centered Container for Desktop
  container: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_WIDTH,
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
    // fontFamily: "LilitaOne", // Make sure this font is loaded or use system font
    fontWeight: "900",
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
    maxWidth: 400, // Limit width on desktop
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
    cursor: "pointer", // Web pointer
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
    backgroundColor: "#333",
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
    textAlign: "center",
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
    // Add margin for Web/Desktop to look like a floating card
    ...Platform.select({
      web: {
        boxShadow: "0px -5px 20px rgba(0,0,0,0.2)",
      },
    }),
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
    paddingBottom: TAB_BAR_OFFSET, // Ensure spacing for bottom tab bar
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    // Web hover effect
    ...Platform.select({
      web: {
        cursor: "default",
      },
    }),
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
