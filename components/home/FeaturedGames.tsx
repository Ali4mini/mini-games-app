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

const FeaturedGameCard = ({ item, styles, theme }: { item: Game; styles: any, theme: Theme }) => {
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
          description: item.description || "This is a super fun game...",
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

            {/* Rating Badge - Keep hardcoded colors here as it overlays image */}
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
                color={theme.secondaryContent} // Text color on button (e.g., White or Dark Blue)
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
        data={displayGames}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          // Pass theme prop so icon colors can resolve correctly
          <FeaturedGameCard item={item} styles={styles} theme={theme} />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => console.log("Go to full library")}
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
      paddingBottom: 80,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.textPrimary, // Changed from hardcoded black/white
      paddingHorizontal: 20,
      marginBottom: 5,
    },
    // Grid Styles
    gridContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    columnWrapper: {
      justifyContent: "space-between",
      marginBottom: 20,
    },
    emptyText: {
      color: theme.textTertiary, // Changed from #888
      textAlign: "center",
      marginTop: 20,
      fontStyle: "italic",
    },

    // --- CARD STYLES ---
    cardContainer: {
      width: ITEM_WIDTH,
      backgroundColor: theme.backgroundSecondary, // White (Light) or Slate 800 (Dark)
      borderRadius: 16,
      // Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1, // Softer shadow for light mode validity
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
    posterImage: {
      width: "100%",
      height: "100%",
    },
    ratingBadge: {
      position: "absolute",
      top: 8,
      left: 8,
      backgroundColor: "rgba(0,0,0,0.6)", // Stays dark translucent
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
      gap: 3,
    },
    ratingText: {
      color: "#FFFFFF", // Always white because background is always dark overlay
      fontSize: 10,
      fontWeight: "bold",
    },

    // Info Area
    infoWrapper: {
      padding: 10,
      paddingTop: 15,
      position: "relative",
    },
    gameTitle: {
      color: theme.textPrimary, // Changed from #fff
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 2,
    },
    gameCategory: {
      color: theme.textTertiary, // Changed from #888
      fontSize: 11,
    },

    // Floating Play Button
    playBtn: {
      position: "absolute",
      top: -18,
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.secondary, // Cyan (Pop color)
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: theme.backgroundSecondary, // IMPORTANT: Matches card bg to create "cutout" look
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
      backgroundColor: theme.backgroundSecondary, // Changed from #2a2a2a
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.backgroundTertiary, // Changed from #333
      gap: 8,
    },
    viewAllText: {
      color: theme.textPrimary,
      fontWeight: "700",
      fontSize: 14,
    },
  });
