import React, { useMemo } from "react";
import { View, TouchableOpacity, useWindowDimensions, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Import Lucide Icons
import { 
  Home, 
  LayoutGrid, 
  Gamepad2, 
  Disc, 
  User, 
  Hexagon 
} from "lucide-react-native";
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  withTiming 
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./CustomTabBar.styles";
import { TabBarBackground } from "./TabBarBackground";

// Map index to Icon Component
const TabIcon = ({ index, color, size, focused }: { index: number; color: string; size: number; focused: boolean }) => {
  // You can customize the stroke width: thicker when focused looks nice
  const strokeWidth = focused ? 2.5 : 2; 

  switch (index) {
    case 0: return <Home color={color} size={size} strokeWidth={strokeWidth} />;
    case 1: return <LayoutGrid color={color} size={size} strokeWidth={strokeWidth} />;
    case 2: return <Gamepad2 color={color} size={size} strokeWidth={strokeWidth} />; // Center Game Icon
    case 3: return <Disc color={color} size={size} strokeWidth={strokeWidth} />; // Airdrop/Token Icon
    case 4: return <User color={color} size={size} strokeWidth={strokeWidth} />;
    default: return <Home color={color} size={size} strokeWidth={strokeWidth} />;
  }
};

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

          // --- Center Button Logic ---
          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabButton}
                activeOpacity={0.8}
              >
                {/* 
                   To make the center button stand out more, we can use a Hexagon 
                   or filled shape behind the icon, or just styling from styles.centerButton 
                */}
                <View style={[styles.centerButton, { 
                    shadowColor: theme.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5
                }]}>
                  <TabIcon 
                    index={index} 
                    color={theme.primaryContent} // Usually white or dark depending on button bg
                    size={32} 
                    focused={isFocused} 
                  />
                </View>
              </TouchableOpacity>
            );
          }

          // --- Side Buttons Logic ---
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
               {/* Optional: Add a subtle glow/indicator behind active tab */}
              {isFocused && (
                <View 
                  style={{
                    position: 'absolute',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.primary,
                    opacity: 0.15, 
                  }} 
                />
              )}
              
              <TabIcon 
                index={index} 
                color={isFocused ? theme.primary : theme.textSecondary} 
                size={26} 
                focused={isFocused} 
              />
              
              {/* Optional: Add a tiny dot below active tab */}
              {isFocused && (
                 <View style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.primary,
                    marginTop: 4
                 }}/>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
