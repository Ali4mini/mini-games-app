import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Best for game icons
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./GameCategories.styles";

type GameCategoriesProps = {
  categories: string[];
  onSelectCategory: (category: string) => void;
};

// --- 1. ICON MAPPING HELPER ---
// Returns an icon name and a specific "Identity Color" for that genre
const getCategoryData = (category: string) => {
  switch (category.toLowerCase()) {
    case "all":
      return { icon: "view-grid", color: "#4facfe" }; // Blue
    case "action":
      return { icon: "sword", color: "#ff4b1f" }; // Red
    case "puzzle":
      return { icon: "puzzle", color: "#00b09b" }; // Teal
    case "strategy":
      return { icon: "chess-rook", color: "#8E2DE2" }; // Purple
    case "racing":
      return { icon: "flag-checkered", color: "#f7971e" }; // Orange
    case "arcade":
      return { icon: "controller-classic", color: "#fc00ff" }; // Pink
    case "sports":
      return { icon: "soccer", color: "#2af598" }; // Green
    case "adventure":
      return { icon: "compass", color: "#F4D03F" }; // Yellow
    default:
      return { icon: "gamepad-variant", color: "#bdc3c7" }; // Grey default
  }
};

// --- 2. CHIP COMPONENT ---
const CategoryChip = ({
  item,
  isActive,
  onPress,
  styles,
}: {
  item: string;
  isActive: boolean;
  onPress: () => void;
  styles: any;
}) => {
  const scale = useSharedValue(1);

  // Get the icon and specific color for this genre
  const { icon, color } = getCategoryData(item);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    onPress();
  };

  return (
    <Animated.View style={[styles.tagContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={isActive ? styles.tagActive : styles.tag}
      >
        {/* ICON LOGIC:
            - Active: Icon turns Black/White (depending on theme primary)
            - Inactive: Icon shows its specific 'Genre Color' (e.g., Red for Action)
        */}
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          // If active, use Black to contrast with Gold background.
          // If inactive, use the genre's specific color.
          color={isActive ? "#000" : color}
          style={{ marginRight: 6 }}
        />

        <Text style={isActive ? styles.tagTextActive : styles.tagText}>
          {item}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- 3. MAIN COMPONENT ---
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
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryChip
            item={item}
            isActive={item === activeCategory}
            onPress={() => handlePress(item)}
            styles={styles}
          />
        )}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
};
