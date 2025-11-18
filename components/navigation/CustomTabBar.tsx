import React, { useMemo } from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./CustomTabBar.styles";
import { TabBarBackground } from "./TabBarBackground";

// Icons to match your screenshot
const ICONS = [
  "home-outline",
  "apps-sharp",
  "game-controller-outline",
  "radio-button-off-outline",
  "person-outline",
];
const ACTIVE_ICONS = [
  "home",
  "apps-sharp",
  "game-controller",
  "disc-sharp",
  "person",
];

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(theme, insets.bottom),
    [theme, insets.bottom],
  );

  return (
    <View>
      <TabBarBackground width={width} height={70 + insets.bottom} />

      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isCenter = index === 2;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = isFocused ? ACTIVE_ICONS[index] : ICONS[index];

          // --- Center Button Logic (remains the same) ---
          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabButton}
              >
                <View style={styles.centerButton}>
                  <Ionicons
                    name={iconName as any}
                    size={32}
                    color={theme.primaryContent}
                  />
                </View>
              </TouchableOpacity>
            );
          }

          // --- CORRECTED Side Buttons Logic ---
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
            >
              <Ionicons
                name={iconName as any}
                size={28}
                color={isFocused ? theme.primary : theme.textSecondary}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
