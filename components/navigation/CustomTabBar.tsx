import React, { useMemo } from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// 1. Updated Imports for "fresher" icons
import { 
  House,          // Modern alternative to Home
  Compass,        // Better for "Explore/Grid"
  Rocket,         // Exciting center icon (instead of Gamepad)
  Gift,           // Perfect for "Airdrop" (instead of Disc)
  UserRound,      // Softer, modern user icon
  Gamepad2,        // Kept if you strictly want a controller
PieChart,
Aperture
} from "lucide-react-native";
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  withSequence
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./CustomTabBar.styles";
import { TabBarBackground } from "./TabBarBackground";

// --- Animated Icon Wrapper ---
// Adds a subtle "pop" animation when clicked
const AnimatedIcon = ({ children, focused }: { children: React.ReactNode; focused: boolean }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSequence(withSpring(1.2), withSpring(1));
    } else {
      scale.value = withSpring(1);
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

// 2. Updated Icon Logic
const TabIcon = ({ index, color, size, focused }: { index: number; color: string; size: number; focused: boolean }) => {
  // We use the 'fill' prop to make icons solid when active
  const fillColor = "transparent"; 
  
  switch (index) {
    case 0: 
      return <House color={color} size={size} fill={fillColor} />;
    case 1: 
      // Gift implies "Rewards" or "Airdrop" much better than Disc
      return <Gift color={color} size={size} fill={fillColor} />; 
    case 2: 
      // Rocket is more dynamic for a center button. 
      // If you prefer the controller, swap this back to <Gamepad2 ... />
      return <Gamepad2 color={color} size={size} fill={fillColor} />; 
    case 3: 
      // Compass implies "Discovery" or "Browse" - looks cleaner than LayoutGrid
      return <Aperture color={color} size={size} fill={fillColor} />;
    case 4: 
      return <UserRound color={color} size={size} fill={fillColor} />;
    default: 
      return <House color={color} size={size} fill={fillColor} />;
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
                activeOpacity={0.9}
              >
                <AnimatedIcon focused={isFocused}>
                  <View style={[styles.centerButton, { 
                      shadowColor: theme.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 10,
                      elevation: 8,
                      backgroundColor: theme.primary // Ensure background is set
                  }]}>
                    {/* Center icon usually looks best white/contrasting */}
                    <TabIcon 
                      index={index} 
                      color={theme.primaryContent} 
                      size={32} 
                      focused={isFocused} 
                    />
                  </View>
                </AnimatedIcon>
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
              <AnimatedIcon focused={isFocused}>
                <TabIcon 
                  index={index} 
                  // When focused, use primary color; when not, use secondary
                  color={isFocused ? theme.primary : theme.textSecondary} 
                  size={26} 
                  focused={isFocused} 
                />
              </AnimatedIcon>

              {/* Optional: Simple Indicator Dot */}
              {isFocused && (
                 <View style={{
                    position: 'absolute',
                    bottom: -8, // Move it down a bit
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.primary,
                 }}/>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
