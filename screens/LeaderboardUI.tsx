import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { LeaderboardUser } from "@/types";

// --- Mock Data ---
const TOP_THREE = [
  { id: "2", username: "Alex", avatar: "https://i.pravatar.cc/150?u=2", score: 5850, rank: 2 },
  { id: "1", username: "Sarah", avatar: "https://i.pravatar.cc/150?u=1", score: 6200, rank: 1 },
  { id: "3", username: "Mike", avatar: "https://i.pravatar.cc/150?u=3", score: 5100, rank: 3 },
];

const MOCK_OTHERS = Array.from({ length: 27 }, (_, i) => ({
  id: `user-${i + 4}`,
  username: `Player ${i + 4}`,
  avatar: `https://i.pravatar.cc/150?u=${i + 4}`,
  score: 5000 - i * 100,
  rank: i + 4,
}));

const CURRENT_USER: LeaderboardUser = {
  id: "current-user",
  username: "You",
  avatar: "https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=Y",
  coins: 4250,
  rank: 25,
  dailyStreak: 7,
  totalGamesPlayed: 32,
  isOnline: true,
};

// --- Sub-Components ---
const FilterTabs = ({ activeTab, onTabChange, theme }: any) => (
  <View style={[styles.filterContainer, { backgroundColor: "rgba(0,0,0,0.2)" }]}>
    {["Weekly", "All Time"].map((tab) => {
      const isActive = activeTab === tab;
      return (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          style={[styles.filterTab, isActive && { backgroundColor: theme.buttonSecondary }]}
        >
          <Text style={[styles.filterText, { color: isActive ? theme.secondaryContent : "rgba(255,255,255,0.6)" }]}>
            {tab}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const PodiumItem = ({ user, size, delay, theme }: any) => {
  const isFirst = user.rank === 1;
  const crownColor = isFirst ? "#FFD700" : user.rank === 2 ? "#C0C0C0" : "#CD7F32";
  const borderColor = isFirst ? "#FFD700" : user.rank === 2 ? "#C0C0C0" : "#CD7F32";
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
      <View style={[styles.avatarContainer, { width: size, height: size, borderColor: borderColor, borderWidth: isFirst ? 4 : 2 }]}>
        <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        <View style={[styles.rankBadge, { backgroundColor: borderColor }]}>
          <Text style={styles.rankText}>{user.rank}</Text>
        </View>
      </View>
      <Text style={styles.podiumName} numberOfLines={1}>{user.username}</Text>
      <Text style={[styles.podiumScore, { color: theme.buttonSecondary }]}>{user.score.toLocaleString()}</Text>
    </Animated.View>
  );
};

const LeaderboardRow = ({ item, isCurrentUser, theme }: any) => {
  return (
    <View style={[
      styles.row, 
      { backgroundColor: isCurrentUser ? theme.primary + "15" : "transparent" },
      isCurrentUser && { borderColor: theme.primary, borderWidth: 1 }
    ]}>
      <Text style={[styles.rowRank, { color: isCurrentUser ? theme.primary : theme.textSecondary }]}>
        {item.rank}
      </Text>
      <Image source={{ uri: item.avatar }} style={styles.rowAvatar} />
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, { color: theme.textPrimary }]}>{item.username}</Text>
      </View>
      <Text style={[styles.rowScore, { color: theme.textPrimary }]}>{item.score?.toLocaleString()}</Text>
    </View>
  );
};

export const LeaderboardUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("Weekly");
  
  // 1. Create a ref for the FlatList
  const flatListRef = useRef<FlatList>(null);

  const unifiedListData = useMemo(() => {
    const topList = MOCK_OTHERS.filter(u => u.rank >= 4 && u.rank <= 10);
    const data: any[] = [...topList];
    const isUserInTop10 = CURRENT_USER.rank <= 10;

    if (!isUserInTop10) {
      data.push({ id: "spacer", type: "spacer" });
      data.push({ ...CURRENT_USER, type: "user" });
    }
    return data;
  }, []);

  // 2. Scroll to user on mount (after a delay for animation)
  useEffect(() => {
    if (unifiedListData.length > 0) {
      // Find the index of the current user
      const userIndex = unifiedListData.findIndex(item => item.id === CURRENT_USER.id);
      
      if (userIndex !== -1) {
        // Wait 1.2s for the entry animations to finish so the scroll is smooth and visible
        const timer = setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: userIndex,
            animated: true,
            viewPosition: 0.5, // 0.5 means center the item in the list
          });
        }, 1200);

        return () => clearTimeout(timer);
      }
    }
  }, [unifiedListData]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "spacer") {
      return (
        <View style={styles.spacerContainer}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.textSecondary} />
        </View>
      );
    }
    return (
      <LeaderboardRow 
        item={item} 
        isCurrentUser={item.id === CURRENT_USER.id} 
        theme={theme} 
      />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, "#1e1b4b", "#0f172a"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Animated.Text entering={FadeInUp.delay(100)} style={styles.headerTitle}>
            {t("leaderboard.title", "Leaderboard")}
          </Animated.Text>
          <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} theme={theme} />
        </View>

        <View style={styles.podiumContainer}>
          <PodiumItem user={TOP_THREE[0]} size={80} delay={400} theme={theme} />
          <PodiumItem user={TOP_THREE[1]} size={100} delay={200} theme={theme} />
          <PodiumItem user={TOP_THREE[2]} size={80} delay={600} theme={theme} />
        </View>

        <Animated.View 
          entering={FadeInDown.delay(800).springify()}
          style={[styles.listSheet, { backgroundColor: theme.backgroundSecondary }]}
        >
          <View style={styles.sheetHandle} />
          
          <FlatList
            ref={flatListRef} // Attach Ref
            data={unifiedListData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            // Prevents crash if scroll layout isn't ready
            onScrollToIndexFailed={(info) => {
              flatListRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: true,
              });
            }}
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
