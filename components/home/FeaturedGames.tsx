import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { Game, Theme } from "@/types";
import { GameCategories } from "@/components/games/GameCategories";
import { GAME_CATEGORIES } from "@/data/dummyData";
import { useFeaturedGames } from "@/hooks/useFeaturedGames";

// --- AD IMPORTS ---
import { useInterstitialAd } from "@/hooks/ads/useInterstitialAd"; // <--- 1. Import Hook

const { width } = Dimensions.get("window");
const GAP = 15;
const ITEM_WIDTH = (width - 20 - 20 - GAP) / 2;

// ... [Keep FeaturedGameCard Component exactly as it is] ...
const FeaturedGameCard = ({
  item,
  styles,
  theme,
}: {
  item: Game;
  styles: any;
  theme: Theme;
}) => {
  // ... (Code hidden for brevity, keep your original code here)
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => (scale.value = withSpring(0.95));
  const onPressOut = () => (scale.value = withSpring(1));

  return (
    <Link
      href={{
        pathname: "/game-details",
        params: { ...item, description: item.description || "" },
      }}
      asChild
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.image }}
              style={styles.posterImage}
              resizeMode="cover"
            />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>
          <View style={styles.infoWrapper}>
            <View style={styles.playBtn}>
              <Ionicons
                name="play"
                size={14}
                color={theme.secondaryContent}
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

export const FeaturedGames: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { games, loading } = useFeaturedGames();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- 2. AD LOGIC START ---
  const { showInterstitial, loaded: adLoaded } = useInterstitialAd();
  const lastAdTime = useRef(0); // Tracks when we last showed an ad

  const handleCategorySelect = (category: string) => {
    const now = Date.now();
    const TIME_BETWEEN_ADS = 2 * 60 * 1000; // 2 Minutes in milliseconds

    // Show ad IF:
    // 1. Ad is actually loaded from AdMob
    // 2. It's been more than 2 minutes since the last one
    // 3. The category actually changed
    if (
      adLoaded &&
      category !== selectedCategory &&
      now - lastAdTime.current > TIME_BETWEEN_ADS
    ) {
      showInterstitial();
      lastAdTime.current = now; // Update timestamp
    }

    setSelectedCategory(category);
  };
  // --- AD LOGIC END ---

  const displayGames = useMemo(() => {
    let filtered = games;
    if (selectedCategory !== "All") {
      filtered = games.filter((game) => game.category === selectedCategory);
    }
    return filtered.slice(0, 8);
  }, [selectedCategory, games]);

  if (loading && games.length === 0) {
    return (
      <View style={[styles.section, { alignItems: "center" }]}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("home.featuredGames")}</Text>

      <GameCategories
        categories={GAME_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect} // <--- Pass our new handler
      />

      <FlatList
        data={displayGames}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <FeaturedGameCard item={item} styles={styles} theme={theme} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No games found in this category.</Text>
        }
        ListFooterComponent={
          displayGames.length > 0 ? (
            <Link href="/games-list" asChild>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All Games</Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={theme.textPrimary}
                />
              </TouchableOpacity>
            </Link>
          ) : null
        }
      />
    </View>
  );
};

// ... (Keep Styles Unchanged)
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // ... your existing styles
    section: { marginTop: 10, paddingBottom: 80 },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.textPrimary,
      paddingHorizontal: 20,
      marginBottom: 5,
    },
    gridContent: { paddingHorizontal: 20, paddingBottom: 20 },
    columnWrapper: { justifyContent: "space-between", marginBottom: 20 },
    emptyText: {
      color: theme.textTertiary,
      textAlign: "center",
      marginTop: 20,
      fontStyle: "italic",
    },
    cardContainer: {
      width: ITEM_WIDTH,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    imageWrapper: {
      width: "100%",
      height: ITEM_WIDTH * 1.1,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: "hidden",
      position: "relative",
    },
    posterImage: { width: "100%", height: "100%" },
    ratingBadge: {
      position: "absolute",
      top: 8,
      left: 8,
      backgroundColor: "rgba(0,0,0,0.6)",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
      gap: 3,
    },
    ratingText: { color: "#FFFFFF", fontSize: 10, fontWeight: "bold" },
    infoWrapper: { padding: 10, paddingTop: 15, position: "relative" },
    gameTitle: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 2,
    },
    gameCategory: { color: theme.textTertiary, fontSize: 11 },
    playBtn: {
      position: "absolute",
      top: -18,
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.secondary,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: theme.backgroundSecondary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    viewAllButton: {
      marginTop: 10,
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.backgroundTertiary,
      gap: 8,
    },
    viewAllText: { color: theme.textPrimary, fontWeight: "700", fontSize: 14 },
  });
