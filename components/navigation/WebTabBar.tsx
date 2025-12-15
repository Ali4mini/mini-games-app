import React from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  House,
  Gift,
  Gamepad2,
  Aperture,
  UserRound,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { TabBarBackground } from "./TabBarBackground";

// Define your routes
const routes = [
  { name: "index", path: "/", icon: House },
  { name: "airdrop", path: "/airdrop", icon: Gift },
  { name: "games-list", path: "/games-list", icon: Gamepad2 },
  { name: "lucky-spin", path: "/lucky-spin", icon: Aperture },
  { name: "profile", path: "/profile", icon: UserRound },
];

export const WebTabBar = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isDesktop = width > 768;

  // 1. FIX HEIGHT: On web, insets.bottom is 0, making the bar too short.
  // We force a minimum bottom padding (20px) so the SVG curve looks natural.
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 20;
  const tabBarHeight = 70 + bottomPadding;

  // 2. FIX WIDTH: 500px might be too small. Let's bump it to 600px
  // or use a percentage for better scaling.
  const tabBarWidth = isDesktop ? 600 : width;

  const styles = {
    wrapper: {
      position: "fixed" as any,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center" as any,
      // Lift it up slightly on desktop so it floats nicely
      paddingBottom: isDesktop ? 0 : 0,
      zIndex: 100,
      pointerEvents: "box-none" as any, // Let clicks pass through empty areas
    },
    // The container for the SVG and Buttons
    innerWrapper: {
      width: tabBarWidth,
      height: tabBarHeight,
      position: "relative" as any,
      alignItems: "center" as any,
      // Add a nice shadow on web so it pops out
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
    },
    container: {
      flexDirection: "row" as any,
      alignItems: "center" as any,
      width: "100%", // Fill the innerWrapper
      height: 70, // Keep content in the top 70px (ignoring the bottom padding)
      position: "absolute" as any,
      top: 0,
    },
    button: {
      flex: 1,
      justifyContent: "center" as any,
      alignItems: "center" as any,
      cursor: "pointer",
    },
    centerButton: {
      width: 64, // Slightly larger for desktop feel
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.primary,
      justifyContent: "center" as any,
      alignItems: "center" as any,
      transform: [{ translateY: -28 }], // Move up slightly more
      boxShadow: "0px 8px 16px rgba(0,0,0,0.4)", // Stronger shadow for the button
    },
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.innerWrapper}>
        {/* Background SVG */}
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <TabBarBackground width={tabBarWidth} height={tabBarHeight} />
        </View>

        {/* Buttons Container */}
        <View style={styles.container}>
          {routes.map((route, index) => {
            const isFocused =
              pathname === route.path ||
              (route.path === "/" && pathname === "/index");
            const isCenter = index === 2;
            const Icon = route.icon;

            return (
              <TouchableOpacity
                key={route.name}
                onPress={() => router.replace(route.path)}
                style={styles.button}
                activeOpacity={0.8}
              >
                {isCenter ? (
                  <View style={styles.centerButton}>
                    <Icon color={theme.primaryContent} size={34} />
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      height: 40,
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      color={isFocused ? theme.primary : theme.textSecondary}
                      size={isDesktop ? 28 : 26} // Slightly bigger icons on desktop
                      strokeWidth={2.5}
                    />
                    {isFocused && (
                      <View
                        style={{
                          position: "absolute",
                          bottom: -6,
                          width: 5,
                          height: 5,
                          borderRadius: 3,
                          backgroundColor: theme.primary,
                        }}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};
