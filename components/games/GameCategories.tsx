import React, { useState, useMemo } from "react";
import { View, Text, FlatList, Pressable, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next"; // 1. Import hook

import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./GameCategories.styles";

type GameCategoriesProps = {
  categories: string[];
  onSelectCategory: (category: string) => void;
};

// Helper to get icon/color based on the ID/Key
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
  item,      // This is the ID (e.g., "action") used for logic
  label,     // This is the Translated Text (e.g., "Action" or "Azione")
  isActive,
  onPress,
  styles,
}: {
  item: string;
  label: string;
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
            {/* 2. Render the translated label instead of the raw item key */}
            <Text style={isActive ? styles.tagTextActive : styles.tagText}>
              {label}
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
  const { t } = useTranslation(); // 3. Init translation
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
            // 4. Translate here. We convert key to lowercase to match JSON keys.
            // Example: "Action" -> t("categories.action") -> "Action" (or translated)
            label={t(`categories.${item.toLowerCase()}`, { defaultValue: item })}
            isActive={item === activeCategory}
            onPress={() => handlePress(item)}
            styles={styles}
          />
        )}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        scrollEnabled={true}
        bounces={false}
        alwaysBounceHorizontal={false}
        directionalLockEnabled={true}
      />
    </View>
  );
};
