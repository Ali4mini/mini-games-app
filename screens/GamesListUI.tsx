import React, { useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  Platform,
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
import { Theme, Game } from "@/types";
import { GameCategories } from "@/components/games/GameCategories";
import { SearchBar } from "@/components/common/SearchBar";
import { useGameCatalog } from "@/hooks/useGameCatalog";

// --- CONSTANTS ---
const TAB_BAR_OFFSET = 120; // Space for the bottom tab bar
const GAP = 15;
const PADDING = 20;
const MAX_WIDTH = 1024;

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
const LibraryGameCard = ({
  item,
  cardWidth,
  theme,
  styles,
}: {
  item: Game;
  cardWidth: number;
  theme: Theme;
  styles: any;
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => (scale.value = withSpring(0.95));
  const onPressOut = () => (scale.value = withSpring(1));

  const detailsLink: Href = {
    pathname: "/game-details",
    params: {
      id: item.id,
      title: item.title,
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
        <Animated.View
          style={[
            styles.cardContainer,
            animatedStyle,
            { width: cardWidth }, // Dynamic Width
          ]}
        >
          {/* Image Wrapper */}
          <View style={[styles.imageWrapper, { height: cardWidth * 1.1 }]}>
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

  // 1. Responsive Dimensions Hook
  const { width: windowWidth } = useWindowDimensions();

  // 2. Calculate Responsive Layout Logic
  // We constrain the width to MAX_WIDTH (1024px) for the content area
  const containerWidth = Math.min(windowWidth, MAX_WIDTH);

  // Determine column count based on available width
  // < 600px = 2 cols, 600-900px = 3 cols, > 900px = 4 cols
  const numColumns = containerWidth > 900 ? 4 : containerWidth > 600 ? 3 : 2;

  // Calculate specific card width dynamically
  const itemWidth =
    (containerWidth - PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  // Memoize styles
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Backend Hook
  const {
    games,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refresh,
    loadingMore,
    loadMore,
  } = useGameCatalog();

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  };

  return (
    // ROOT VIEW: Fills the screen with background color
    <View style={styles.rootBackground}>
      {/* SAFE AREA: Constrained width, centered */}
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* HEADER SECTION */}
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>
            {t("gamesList.title", "Game Library")}
          </Text>

          <SearchBar
            placeholder={t(
              "gamesList.searchPlaceholder",
              "Search for a game...",
            )}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <GameCategories
            categories={CATEGORY_LIST}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>

        {/* GAMES GRID */}
        {loading && games.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <FlatList
            // IMPORTANT: Changing 'key' forces FlatList to re-render when columns change
            key={`games-grid-${numColumns}`}
            data={games}
            keyExtractor={(item) => item.id}
            // Dynamic Columns
            numColumns={numColumns}
            contentContainerStyle={styles.listContentContainer}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <LibraryGameCard
                item={item}
                cardWidth={itemWidth}
                theme={theme}
                styles={styles}
              />
            )}
            // Pagination & Refresh
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
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
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    rootBackground: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
      alignItems: "center", // This centers the container on the screen
    },
    container: {
      flex: 1,
      width: "100%",
      maxWidth: MAX_WIDTH, // Constrains width on Desktop
      backgroundColor: theme.backgroundPrimary,
      ...Platform.select({
        web: {
          boxShadow: "0px 0px 24px rgba(0,0,0,0.15)", // Nice drop shadow for web
        },
      }),
    },

    // --- Header ---
    headerContainer: {
      paddingHorizontal: PADDING,
      paddingTop: 10,
      paddingBottom: 5,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.textPrimary,
      marginBottom: 15,
      letterSpacing: 0.5,
    },

    // --- Grid Layout ---
    listContentContainer: {
      paddingHorizontal: PADDING,
      // Fix: Use the constant so content isn't hidden behind tab bar
      paddingBottom: TAB_BAR_OFFSET,
      paddingTop: 10,
    },
    columnWrapper: {
      // 'space-between' works perfectly with the calculated itemWidth
      justifyContent: "space-between",
      marginBottom: 20,
    },

    // --- Loading & Empty ---
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 50,
      opacity: 0.7,
    },

    // --- Card Styles ---
    cardContainer: {
      // Width is handled dynamically inline
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageWrapper: {
      width: "100%",
      // Height is handled dynamically inline
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: "hidden",
      position: "relative",
    },
    gameImage: {
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
      gap: 4,
    },
    ratingText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "bold",
    },

    // --- Info Section ---
    infoWrapper: {
      padding: 12,
      paddingTop: 16,
      position: "relative",
    },
    gameTitle: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 4,
    },
    gameCategory: {
      color: theme.textTertiary,
      fontSize: 11,
      fontWeight: "500",
    },

    // --- Floating Play Button ---
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
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    },
  });
