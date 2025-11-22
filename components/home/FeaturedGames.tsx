import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { Game, Theme } from "@/types";
import { GameCategories } from "@/components/games/GameCategories";
import { GAME_CATEGORIES, FEATURED_GAMES } from "@/data/dummyData";

// Get screen width to calculate grid size
const { width } = Dimensions.get("window");
const GAP = 15;
// Width = (Screen - PaddingLeft - PaddingRight - Gap) / 2
const ITEM_WIDTH = (width - 20 - 20 - GAP) / 2;

const FeaturedGameCard = ({ item, styles }: { item: Game; styles: any }) => {
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
        params: {
          id: item.id,
          title: item.title,
          image: item.image,
          category: item.category,
          url: item.url,
          orientation: item.orientation,
          description: item.description || "This is a super fun game...", // Pass description if you have it
        },
      }}
      asChild
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          {/* Image Area */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.image }}
              style={styles.posterImage}
              resizeMode="cover"
            />

            {/* Rating Badge */}
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>

          {/* Info Area */}
          <View style={styles.infoWrapper}>
            {/* Floating Play Button */}
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

export const FeaturedGames: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- 1. FILTER LOGIC ---
  const filteredGames = useMemo(() => {
    if (selectedCategory === "All") return FEATURED_GAMES;
    return FEATURED_GAMES.filter((game) => game.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const displayGames = useMemo(() => {
    return filteredGames.slice(0, 8);
  }, [filteredGames]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("home.featuredGames")}</Text>

      <GameCategories
        categories={GAME_CATEGORIES}
        onSelectCategory={handleCategorySelect}
      />

      <FlatList
        data={displayGames} // <--- USE THE SLICED DATA
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <FeaturedGameCard item={item} styles={styles} />
        )}
        // 2. ADD "VIEW ALL" BUTTON AT BOTTOM
        ListFooterComponent={
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => {
              // Navigate to your full Game Library Screen
              // router.push('/library');
              console.log("Go to full library");
            }}
          >
            <Text style={styles.viewAllText}>View All Games</Text>
            <Ionicons name="chevron-down" size={16} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginTop: 10,
      paddingBottom: 80, // Extra space at bottom for tab bar
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.textPrimary,
      paddingHorizontal: 20,
      marginBottom: 5, // Reduced margin as Categories have their own margin
    },
    // Grid Styles
    gridContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    columnWrapper: {
      justifyContent: "space-between", // Pushes items to edges
      marginBottom: 20, // Vertical Gap between rows
    },
    emptyText: {
      color: "#888",
      textAlign: "center",
      marginTop: 20,
      fontStyle: "italic",
    },

    // --- CARD STYLES ---
    cardContainer: {
      width: ITEM_WIDTH,
      backgroundColor: "#2a2a2a", // Dark card bg
      borderRadius: 16,
      // Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    imageWrapper: {
      width: "100%",
      height: ITEM_WIDTH * 1.1, // Portrait Aspect Ratio (Taller than wide)
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: "hidden",
      position: "relative",
    },
    posterImage: {
      width: "100%",
      height: "100%",
    },
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
    ratingText: {
      color: "#fff",
      fontSize: 10,
      fontWeight: "bold",
    },

    // Info Area
    infoWrapper: {
      padding: 10,
      paddingTop: 15, // Space for floating button
      position: "relative",
    },
    gameTitle: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 2,
    },
    gameCategory: {
      color: "#888",
      fontSize: 11,
    },

    // Floating Play Button
    playBtn: {
      position: "absolute",
      top: -18, // Moves it up to bridge the image and text
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primary, // Your Gold/Pink theme color
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3, // Thick border to separate from image
      borderColor: "#2a2a2a", // Matches card background
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
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
      backgroundColor: "#2a2a2a",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#333",
      gap: 8,
    },
    viewAllText: {
      color: theme.textPrimary, // White/Light Grey
      fontWeight: "700",
      fontSize: 14,
    },
  });
