import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../context/ThemeContext";
import { createStyles } from "./GamesListUI.styles";
import { GameCategories } from "@/components/games/GameCategories";
import { SearchBar } from "@/components/common/SearchBar";
import { ALL_GAMES, GAME_CATEGORIES } from "@/data/dummyData";

// --- 1. DEFINE POSTER CARD LOCALLY TO ENSURE VERTICAL LOOK ---
const LibraryGameCard = ({ item, styles }: { item: any; styles: any }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => (scale.value = withSpring(0.95));
  const onPressOut = () => (scale.value = withSpring(1));

  return (
    <Link href="/games-list" asChild>
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
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={9} color="#FFD700" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>

          {/* Info Wrapper */}
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

// --- 2. MAIN COMPONENT ---
export const GamesListUI: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Optimized Filtering Logic
  const filteredGames = useMemo(() => {
    return ALL_GAMES.filter((game) => {
      const matchesCategory =
        selectedCategory === "All" || game.category === selectedCategory;
      const matchesSearch = game.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* FIXED HEADER SECTION */}
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>
          {t("gamesList.title", "Game Library")}
        </Text>

        <SearchBar
          placeholder={t("gamesList.searchPlaceholder", "Search for a game...")}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <GameCategories
          categories={GAME_CATEGORIES}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {/* SCROLLABLE GRID */}
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContentContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <LibraryGameCard item={item} styles={styles} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ color: "#888" }}>No games found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};
