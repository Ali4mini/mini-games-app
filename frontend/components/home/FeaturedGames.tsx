import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions, // --- 1. Import hook ---
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
import { useInterstitialAd } from "@/hooks/ads/useInterstitialAd";

// Card component is now passed itemWidth and styles
const FeaturedGameCard = ({
  item,
  styles,
  theme,
  itemWidth, // <-- Receive calculated width
}: {
  item: Game;
  styles: any;
  theme: Theme;
  itemWidth: number;
}) => {
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
        {/* --- Apply dynamic width and height --- */}
        <Animated.View
          style={[styles.cardContainer, { width: itemWidth }, animatedStyle]}
        >
          <View style={[styles.imageWrapper, { height: itemWidth * 1.1 }]}>
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
  const { games, loading } = useFeaturedGames();
  console.log("games;", games);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- 2. RESPONSIVE LAYOUT LOGIC ---
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const numColumns = isDesktop ? 4 : 2;
  const styles = useMemo(
    () => createStyles(theme, isDesktop),
    [theme, isDesktop],
  );

  // Dynamically calculate item width based on screen size and columns
  const containerPadding = 20;
  const gap = 15;
  const effectiveWidth = Math.min(windowWidth, 1024) - containerPadding * 2;
  const totalGapWidth = (numColumns - 1) * gap;
  const itemWidth = (effectiveWidth - totalGapWidth) / numColumns;

  // Ad logic (no changes needed)
  const { showInterstitial, loaded: adLoaded } = useInterstitialAd();
  const lastAdTime = useRef(0);

  const handleCategorySelect = (category: string) => {
    const now = Date.now();
    const TIME_BETWEEN_ADS = 2 * 60 * 1000;
    if (
      adLoaded &&
      category !== selectedCategory &&
      now - lastAdTime.current > TIME_BETWEEN_ADS
    ) {
      showInterstitial();
      lastAdTime.current = now;
    }
    setSelectedCategory(category);
  };

  const displayGames = useMemo(() => {
    let filtered = games;
    if (selectedCategory !== "All") {
      filtered = games.filter((game) => game.category === selectedCategory);
    }
    return filtered.slice(0, isDesktop ? 8 : 6); // Show more items on desktop
  }, [selectedCategory, games, isDesktop]);

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
        onSelectCategory={handleCategorySelect}
      />
      <FlatList
        key={numColumns} // --- 3. Add key to force re-render on column change ---
        data={displayGames}
        keyExtractor={(item) => item.id}
        numColumns={numColumns} // Use dynamic number of columns
        scrollEnabled={false}
        columnWrapperStyle={{ gap }} // Use gap for spacing
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <FeaturedGameCard
            item={item}
            styles={styles}
            theme={theme}
            itemWidth={itemWidth} // Pass calculated width to the card
          />
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

// --- 4. UPDATE STYLES TO BE RESPONSIVE ---
const createStyles = (theme: Theme, isDesktop: boolean) =>
  StyleSheet.create({
    section: {
      marginTop: isDesktop ? 20 : 10,
      paddingBottom: 80,
    },
    sectionTitle: {
      fontSize: isDesktop ? 24 : 20, // Bigger title
      fontWeight: "800",
      color: theme.textPrimary,
      paddingHorizontal: 20,
      marginBottom: 5,
    },
    gridContent: {
      paddingHorizontal: 20,
      paddingTop: 10, // Add a little top padding for the grid
    },
    // No longer need columnWrapperStyle, gap is better
    emptyText: {
      color: theme.textTertiary,
      textAlign: "center",
      marginTop: 20,
      fontStyle: "italic",
    },
    cardContainer: {
      // width is now set dynamically via inline style
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
      marginBottom: isDesktop ? 24 : 20, // Responsive margin
    },
    imageWrapper: {
      // height is now set dynamically
      width: "100%",
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
      fontSize: isDesktop ? 15 : 13, // Bigger font
      fontWeight: "700",
      marginBottom: 2,
    },
    gameCategory: {
      color: theme.textTertiary,
      fontSize: isDesktop ? 12 : 11,
    },
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
      padding: isDesktop ? 18 : 15, // Bigger button
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.backgroundTertiary,
      gap: 8,
    },
    viewAllText: {
      color: theme.textPrimary,
      fontWeight: "700",
      fontSize: isDesktop ? 16 : 14, // Bigger text
    },
  });
