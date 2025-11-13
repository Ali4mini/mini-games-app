import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./GameCategories.styles";

type GameCategoriesProps = {
  categories: string[];
  onSelectCategory: (category: string) => void; // A function to handle category changes
};

export const GameCategories: React.FC<GameCategoriesProps> = ({
  categories,
  onSelectCategory,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [activeCategory, setActiveCategory] = useState(categories[0] || "All");

  const handlePress = (category: string) => {
    setActiveCategory(category);
    onSelectCategory(category);
    // In a real app, this is where you would trigger the game list to filter
  };

  const renderTag = ({ item }: { item: string }) => {
    const isActive = item === activeCategory;
    return (
      <TouchableOpacity
        style={isActive ? styles.tagActive : styles.tag}
        onPress={() => handlePress(item)}
      >
        <Text style={isActive ? styles.tagTextActive : styles.tagText}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderTag}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
};
