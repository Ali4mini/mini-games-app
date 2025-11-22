import React, { useState, useMemo } from "react";
import { View, Text, FlatList, Pressable, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const getCategoryData = (category: string) => {
  switch (category.toLowerCase()) {
    case "all":
      return { icon: "view-grid", color: "#4facfe" };
    case "action":
      return { icon: "sword", color: "#ff4b1f" };
    case "puzzle":
      return { icon: "puzzle", color: "#00b09b" };
    case "strategy":
      return { icon: "chess-rook", color: "#8E2DE2" };
    case "racing":
      return { icon: "flag-checkered", color: "#f7971e" };
    case "arcade":
      return { icon: "controller-classic", color: "#fc00ff" };
    case "sports":
      return { icon: "soccer", color: "#2af598" };
    case "adventure":
      return { icon: "compass", color: "#F4D03F" };
    default:
      return { icon: "gamepad-variant", color: "#bdc3c7" };
  }
};

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
  const { icon, color } = getCategoryData(item);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Only trigger selection on actual press completion
  const handlePress = () => {
    onPress();
  };

  return (
    <Animated.View style={[styles.tagContainer, animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        android_ripple={{
          color: isActive ? "#00000040" : `${color}40`,
          borderless: true,
          radius: 30,
        }}
        style={({ pressed }) => [
          isActive ? styles.tagActive : styles.tag,
          Platform.OS === "ios" && pressed && { opacity: 0.7 },
        ]}
      >
        {({ pressed }) => (
          <>
            <MaterialCommunityIcons
              name={icon as any}
              size={18}
              color={isActive ? "#000" : color}
              style={{ marginRight: 6 }}
            />
            <Text style={isActive ? styles.tagTextActive : styles.tagText}>
              {item}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
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
        // Prevent accidental touches during scroll
        scrollEnabled={true}
        bounces={false}
        alwaysBounceHorizontal={false}
        directionalLockEnabled={true}
      />
    </View>
  );
};
