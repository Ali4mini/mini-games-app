import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. ADMOB IMPORTS
import {
  BannerAd,
  BannerAdSize,
  useInterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";

// 2. IMPORT YOUR HELPER
// (Adjust this path to where you saved adsConfig.ts)
import { getAdUnitId } from "@/utils/adsConfig";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";
import { FEATURED_GAMES } from "@/data/dummyData";
import Colors from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

// Get Unit IDs from your helper
const BANNER_ID = getAdUnitId("banner");
const INTERSTITIAL_ID = getAdUnitId("interstitial");

export default function GameDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();

  // --- INTERSTITIAL AD LOGIC (Optional: Loads ad for the Play button) ---
  const { isLoaded, isClosed, load, show } = useInterstitialAd(
    INTERSTITIAL_ID,
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );

  useEffect(() => {
    // Start loading the interstitial when screen opens
    load();
  }, [load]);

  useEffect(() => {
    // If user closes the ad, navigate to the game
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
    if (isLoaded) {
      show();
    } else {
      // If ad isn't ready yet, just go to game
      navigateToGame();
    }
  };
  // ---------------------------------------------------------------------

  const game = {
    id: params.id,
    title: params.title as string,
    image: params.image as string,
    category: (params.category as string) || "Arcade",
    rating: params.rating || "4.5",
    description:
      (params.description as string) ||
      "Experience the thrill of this amazing game! Navigate through challenging levels, collect rewards, and beat the high score.",
    url: params.url as string,
    orientation: params.orientation as string,
  };

  const styles = createStyles(theme);

  return (
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
          <SafeAreaView style={styles.headerNav}>
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

          {/* PLAY BUTTON (Modified to trigger Interstitial) */}
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

          {/* --- NATIVE AD PLACEHOLDER INTEGRATION --- */}
          <View style={styles.adContainer}>
            <Text style={styles.adLabel}>SPONSORED</Text>
            <View style={styles.adWrapper}>
              <BannerAd
                unitId={BANNER_ID}
                // LARGE_BANNER is 320x100, perfect for your 100px height container
                size={BannerAdSize.LARGE_BANNER}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
                onAdFailedToLoad={(error) => {
                  console.error("Banner failed to load: ", error);
                }}
              />
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>About this Game</Text>
          <Text style={styles.description}>{game.description}</Text>

          {/* RELATED GAMES */}
          <Text style={styles.sectionTitle}>You Might Also Like</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {FEATURED_GAMES.slice(0, 5).map((item, index) => (
              <TouchableOpacity key={index} style={styles.relatedCard}>
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
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    heroContainer: {
      height: height * 0.45,
      width: width,
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
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      marginTop: Platform.OS === "android" ? 10 : 0,
    },
    contentContainer: {
      marginTop: -40,
      paddingHorizontal: 20,
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
      fontSize: 32,
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

    // --- UPDATED AD STYLES ---
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
      minHeight: 100, // Keeps structure if ad fails to load
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 10,
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: 30,
    },
    relatedCard: {
      width: 120,
      marginRight: 15,
    },
    relatedImage: {
      width: 120,
      height: 120,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: "#333",
    },
    relatedTitle: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
    },
  });
