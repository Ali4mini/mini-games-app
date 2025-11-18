import React, { useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";
import { GameCard } from "@/components/games/GameCard";
import { GameCategories } from "@/components/games/GameCategories";
import { GAME_CATEGORIES, FEATURED_GAMES } from "@/data/dummyData";

export const FeaturedGames: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    console.log("Selected Category:", category);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("home.featuredGames")}</Text>
      <GameCategories
        categories={GAME_CATEGORIES}
        onSelectCategory={handleCategorySelect}
        // selectedCategory={selectedCategory}
      />
      <FlatList
        data={FEATURED_GAMES}
        renderItem={({ item }) => (
          <GameCard title={item.title} image={item.image} />
        )}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20 }}
      />
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textPrimary,
      paddingHorizontal: 20,
      marginBottom: 15,
    },
  });
