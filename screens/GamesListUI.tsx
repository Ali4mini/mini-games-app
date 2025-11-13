import React, { useState, useMemo, useEffect } from "react";
import { View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { createStyles } from "./GamesListUI.styles";
import { Game } from "../types";
import { GameCard } from "@/components/games/GameCard";
import { GameCategories } from "@/components/games/GameCategories";
import { SearchBar } from "@/components/common/SearchBar";
import { ALL_GAMES, GAME_CATEGORIES } from "@/data/dummyData";

export const GamesListUI: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // State for managing user filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredGames, setFilteredGames] = useState<Game[]>(ALL_GAMES);

  // Effect to apply filters whenever search query or category changes
  useEffect(() => {
    let games = ALL_GAMES;

    // 1. Filter by category
    if (selectedCategory !== "All") {
      games = games.filter((game) => game.category === selectedCategory);
    }

    // 2. Filter by search query (on the result of the category filter)
    if (searchQuery) {
      games = games.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredGames(games);
  }, [searchQuery, selectedCategory]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SearchBar
        placeholder="Search for a game..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <GameCategories
        categories={GAME_CATEGORIES}
        onSelectCategory={setSelectedCategory}
      />
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContentContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.gameCardContainer}>
            <GameCard title={item.title} image={item.image} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};
