import React from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  House,
  Gift,
  Gamepad2,
  Aperture,
  UserRound,
} from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { TabBarBackground } from "./TabBarBackground"; // Your SVG background component

// --- AnimatedIcon and TabIcon components remain unchanged ---
const AnimatedIcon = ({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) => {
  const scale = useSharedValue(1);
  React.useEffect(() => {
    if (focused) scale.value = withSequence(withSpring(1.2), withSpring(1));
    else scale.value = withSpring(1);
  }, [focused]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const TabIcon = ({
  index,
  color,
  size,
}: {
  index: number;
  color: string;
  size: number;
}) => {
  switch (index) {
    case 0:
      return <House color={color} size={size} />;
    case 1:
      return <Gift color={color} size={size} />;
    case 2:
      return <Gamepad2 color={color} size={size} />;
    case 3:
      return <Aperture color={color} size={size} />;
    case 4:
      return <UserRound color={color} size={size} />;
    default:
      return <House color={color} size={size} />;
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

  // Responsive Logic
  const isDesktop = width > 768;

  const styles = React.useMemo(
    () => createStyles(theme, insets.bottom, isDesktop),
    [theme, insets.bottom, isDesktop],
  );

  return (
    // This wrapper handles the fixed/absolute positioning and centering
    <View style={styles.wrapper}>
      {/* 
        Your SVG background. It receives the responsive width and will
        draw itself as a full-width bar on mobile and a 500px pill on desktop.
      */}
      <TabBarBackground
        width={isDesktop ? 500 : width}
        height={70 + insets.bottom}
      />

      {/* This container holds the icons and lays them out on top of the SVG */}
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

          // Center Button
          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabButton}
                activeOpacity={0.9}
              >
                <AnimatedIcon focused={isFocused}>
                  <View
                    style={[
                      styles.centerButton,
                      {
                        shadowColor: theme.primary,
                        backgroundColor: theme.primary,
                      },
                    ]}
                  >
                    <TabIcon
                      index={index}
                      color={theme.primaryContent}
                      size={32}
                    />
                  </View>
                </AnimatedIcon>
              </TouchableOpacity>
            );
          }

          // Side Buttons
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
                  color={isFocused ? theme.primary : theme.textSecondary}
                  size={26}
                />
              </AnimatedIcon>
              {isFocused && <View style={styles.indicatorDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// --- Updated Styles with Responsive and Web-Specific Logic ---
const createStyles = (
  theme: Theme,
  bottomInset: number,
  isDesktop: boolean,
) => ({
  wrapper: {
    ...Platform.select({
      web: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        paddingBottom: isDesktop ? 20 : 0,
      },
      default: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      },
    }),
  },
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: isDesktop ? 500 : "100%",
    height: 70,
    paddingBottom: bottomInset > 0 ? bottomInset - 10 : 0,
    position: "absolute",
    // On web, the wrapper's padding handles the positioning
    bottom: Platform.OS === "web" ? 0 : bottomInset,
    borderRadius: isDesktop ? 99 : 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -25 }],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  indicatorDot: {
    position: "absolute",
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.primary,
  },
});
