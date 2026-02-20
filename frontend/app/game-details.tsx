import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  useWindowDimensions, // Import for responsive width
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

// --- ADS IMPORTS ---
import { SmartBanner } from "@/components/ads/SmartBanner";
import { useInterstitialAd } from "@/hooks/ads/useInterstitialAd";
import { getAdUnitId } from "@/utils/adsConfig";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";
import { FEATURED_GAMES } from "@/data/dummyData";
import Colors from "@/constants/Colors";

const INTERSTITIAL_ID = getAdUnitId("interstitial");
const MAX_WIDTH = 1024; // Desktop constraint

export default function GameDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();

  // 1. RESPONSIVE DIMENSIONS
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isDesktop = windowWidth > 768;

  // 2. MEMOIZED STYLES
  // We pass windowWidth to styles so the Hero Image can resize dynamically
  const styles = useMemo(
    () => createStyles(theme, windowWidth, windowHeight, isDesktop),
    [theme, windowWidth, windowHeight, isDesktop],
  );

  // --- INTERSTITIAL AD LOGIC ---
  const { isLoaded, isClosed, load, show } = useInterstitialAd(
    INTERSTITIAL_ID,
    { requestNonPersonalizedAdsOnly: true },
  );

  useEffect(() => {
    // Only load ads on mobile
    if (Platform.OS !== "web") {
      load();
    }
  }, [load]);

  useEffect(() => {
    if (isClosed) {
      navigateToGame();
    }
  }, [isClosed]);

  const navigateToGame = () => {
    router.push({
      pathname: "/game-player",
      params: {
        url: game.url,
        title: game.title,
        orientation: game.orientation,
      },
    });
  };

  const handlePlayPress = () => {
    // On Web, show() does nothing or throws, so we skip straight to game
    if (Platform.OS !== "web" && isLoaded) {
      show();
    } else {
      navigateToGame();
    }
  };

  const game = {
    id: params.id,
    title: params.title as string,
    image: params.image as string,
    category: (params.category as string) || "Arcade",
    rating: params.rating || "4.5",
    description: (params.description as string) || "Experience the thrill...",
    url: params.url as string,
    orientation: params.orientation as string,
  };

  return (
    // ROOT WRAPPER: Centers content on Desktop
    <View style={styles.rootBackground}>
      {/* MAX WIDTH CONTAINER */}
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar
          animated={true}
          barStyle={theme === Colors.dark ? "light-content" : "dark-content"}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          bounces={false}
        >
          {/* HERO IMAGE */}
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: game.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", theme.backgroundPrimary]}
              style={styles.heroGradient}
            />

            {/* Nav Back Button */}
            <SafeAreaView style={styles.headerNav} edges={["top"]}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            </SafeAreaView>
          </View>

          {/* MAIN CONTENT */}
          <View style={styles.contentContainer}>
            <View style={styles.headerSection}>
              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>{game.category}</Text>
              </View>
              <Text style={styles.title}>{game.title}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.statText}>{game.rating} Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Ionicons name="game-controller" size={16} color="#888" />
                  <Text style={styles.statText}>10k+ Plays</Text>
                </View>
              </View>
            </View>

            {/* PLAY BUTTON */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.playButton}
              onPress={handlePlayPress}
            >
              <LinearGradient
                colors={[theme.primary, "#FF9966"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.playButtonGradient}
              >
                <Ionicons
                  name="play"
                  size={28}
                  color="#000"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.playButtonText}>PLAY NOW</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* --- SMART BANNER INTEGRATION (Hidden on Web if preferred) --- */}
            {Platform.OS !== "web" && (
              <View style={styles.adContainer}>
                <Text style={styles.adLabel}>SPONSORED</Text>
                <View style={styles.adWrapper}>
                  <SmartBanner />
                </View>
              </View>
            )}

            {/* REST OF CONTENT */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>About this Game</Text>
              <Text style={styles.description}>{game.description}</Text>

              <Text style={styles.sectionTitle}>You Might Also Like</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 10 }}
              >
                {FEATURED_GAMES.slice(0, 5).map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.relatedCard}
                    onPress={() =>
                      router.push({
                        pathname: "/game-details",
                        params: { ...item },
                      })
                    }
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.relatedImage}
                    />
                    <Text style={styles.relatedTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (
  theme: Theme,
  windowWidth: number,
  windowHeight: number,
  isDesktop: boolean,
) =>
  StyleSheet.create({
    // Root wrapper for Desktop background
    rootBackground: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
      alignItems: "center",
    },
    container: {
      flex: 1,
      width: "100%",
      maxWidth: MAX_WIDTH, // Constrain width
      backgroundColor: theme.backgroundPrimary,
      // Add subtle shadow on Desktop
      ...Platform.select({
        web: {
          boxShadow: "0px 0px 30px rgba(0,0,0,0.2)",
        },
      }),
    },
    heroContainer: {
      // Logic: On mobile, use 45% of height. On desktop, fix the height so it doesn't take up whole screen.
      height: isDesktop ? 400 : windowHeight * 0.45,
      width: "100%",
      position: "relative",
    },
    heroImage: {
      width: "100%",
      height: "100%",
    },
    heroGradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "40%",
    },
    headerNav: {
      position: "absolute",
      top: 0,
      left: 0,
      padding: 20,
      zIndex: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      // Fix: Android safe area handling inside absolute position
      marginTop: Platform.OS === "android" ? 30 : 0,
      cursor: "pointer", // Pointer for web
    },
    contentContainer: {
      marginTop: -40, // Overlap the Hero Image
      paddingHorizontal: 20,
      // Desktop: Add extra padding for readability
      paddingBottom: 40,
    },
    headerSection: {
      marginBottom: 20,
    },
    categoryChip: {
      alignSelf: "flex-start",
      backgroundColor: "rgba(255, 193, 7, 0.2)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    categoryText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    title: {
      fontSize: isDesktop ? 48 : 32, // Larger title on Desktop
      fontWeight: "900",
      color: theme.textPrimary,
      marginBottom: 10,
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 5,
    },
    statsRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    statText: {
      color: "#ccc",
      fontSize: 14,
      fontWeight: "500",
    },
    statDivider: {
      width: 1,
      height: 15,
      backgroundColor: "#444",
      marginHorizontal: 15,
    },
    playButton: {
      width: "100%",
      height: 60,
      borderRadius: 30,
      marginBottom: 25,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 10,
      cursor: "pointer", // Pointer for web
    },
    playButtonGradient: {
      flex: 1,
      borderRadius: 30,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    playButtonText: {
      color: "#000",
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: 1,
    },
    adContainer: {
      backgroundColor: "#1e1e1e",
      borderRadius: 12,
      paddingTop: 10,
      paddingBottom: 10,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: "#333",
      alignItems: "center",
    },
    adLabel: {
      fontSize: 10,
      color: "#666",
      marginBottom: 5,
      fontWeight: "700",
      alignSelf: "flex-start",
      marginLeft: 10,
    },
    adWrapper: {
      minHeight: 50,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    infoSection: {
      // Optional: On desktop you could make this max-width smaller for better reading measure
      maxWidth: "100%",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 10,
      marginTop: 10,
    },
    description: {
      fontSize: 16, // Slightly larger text for better readability
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: 30,
    },
    relatedCard: {
      width: 140, // Slightly bigger cards
      marginRight: 15,
      cursor: "pointer",
    },
    relatedImage: {
      width: 140,
      height: 140,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: "#333",
    },
    relatedTitle: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "600",
    },
  });
