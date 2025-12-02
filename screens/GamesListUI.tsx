import React, { useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Link, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// --- Local Imports ---
import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./GamesListUI.styles";
import { GameCategories } from "@/components/games/GameCategories";
import { SearchBar } from "@/components/common/SearchBar";
import { Game } from "@/types";

// --- Backend Hook ---
import { useGameCatalog } from "@/hooks/useGameCatalog";

// Constants
const CATEGORY_LIST = [
  "All",
  "Puzzle",
  "Action",
  "Strategy",
  "Racing",
  "Sports",
  "Adventure",
  "Casual",
  "Arcade",
];

// --- 1. POSTER CARD (Vertical) ---
const LibraryGameCard = ({ item, styles }: { item: Game; styles: any }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => (scale.value = withSpring(0.95));
  const onPressOut = () => (scale.value = withSpring(1));

  // Construct Link params safely
  const detailsLink: Href = {
    pathname: "/game-details",
    params: {
      id: item.id,
      title: item.title,
      // Pass the full URL (already fixed by hook)
      image: item.image,
      category: item.category,
      url: item.url,
      orientation: item.orientation,
      description: item.description || "",
    },
  };

  return (
    <Link href={detailsLink} asChild>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          {/* Image Wrapper */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.image }}
              style={styles.gameImage}
              resizeMode="cover"
            />
            {/* Optional: Add rating logic here later */}
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={9} color="#FFD700" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>

          {/* Info Wrapper */}
          <View style={styles.infoWrapper}>
            <View style={styles.playBtn}>
              <Ionicons
                name="play"
                size={14}
                color="#000"
                style={{ marginLeft: 2 }}
              />
            </View>
            <Text style={styles.gameTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.gameCategory}>{item.category || "Arcade"}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

// --- 2. MAIN COMPONENT ---
export const GamesListUI: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // --- CONNECT TO BACKEND ---
  // Use the hook instead of local state/dummy data
  const {
    games,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refresh,
  } = useGameCatalog();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER SECTION */}
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>
          {t("gamesList.title", "Game Library")}
        </Text>

        <SearchBar
          placeholder={t("gamesList.searchPlaceholder", "Search for a game...")}
          value={searchQuery}
          onChangeText={setSearchQuery} // Updates hook state -> triggers fetch
        />

        <GameCategories
          categories={CATEGORY_LIST}
          selectedCategory={selectedCategory} // Pass current selection
          onSelectCategory={setSelectedCategory} // Updates hook state -> triggers fetch
        />
      </View>

      {/* GAMES GRID */}
      {loading && games.length === 0 ? (
        // Initial Loading State
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContentContainer}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <LibraryGameCard item={item} styles={styles} />
          )}
          // Add Pull-to-Refresh
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={theme.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={{ color: theme.textSecondary }}>
                {loading ? "Searching..." : "No games found."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};
