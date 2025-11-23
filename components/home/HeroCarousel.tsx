import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // New dependency for pro UI
import { Ionicons } from "@expo/vector-icons"; // Assuming you use Expo vector icons

import { useTheme } from "../../context/ThemeContext";
import { HeroBannerItem } from "../../types";

type HeroCarouselProps = {
  data: HeroBannerItem[];
};

const { width: screenWidth } = Dimensions.get("window");
// We make the card slightly smaller than screen width to show the "peek" effect
const ITEM_WIDTH = screenWidth * 0.92;
const ITEM_HEIGHT = 200;

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ data }) => {
  const theme = useTheme();

  const renderCarouselItem = ({ item }: { item: HeroBannerItem }) => (
    <Link href={item.href} asChild>
      <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
        {/* 1. The Game Art */}
        <Image source={item.image} style={styles.image} resizeMode="cover" />

        {/* 2. Gradient Overlay for Text Readability */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        />

        {/* 3. Content & CTA */}
        <View style={styles.contentContainer}>
          <View style={styles.textWrapper}>
            {/* Optional: Add a badge like "NEW" or "HOT" here */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>FEATURED</Text>
            </View>

            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              {item.subtitle}
            </Text>
          </View>

          {/* Play Button Icon */}
          <View
            style={[
              styles.playButton,
              { backgroundColor: theme.primary || "#FFC107" },
            ]}
          >
            <Ionicons
              name="play"
              size={24}
              color="#000"
              style={{ marginLeft: 2 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={screenWidth}
        height={ITEM_HEIGHT}
        autoPlay={true}
        autoPlayInterval={5000}
        data={data}
        scrollAnimationDuration={800}
        // Parallax makes it look 3D and high-end
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={renderCarouselItem}
      />
    </View>
  );
};

// Styles defined here for simplicity, but you can move them to .styles.ts
const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 24, // Large rounded corners for a modern "Game Card" look
    overflow: "hidden",
    backgroundColor: "#1a1a1a", // Fallback color
    marginHorizontal: 5, // Small gap between slides
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  textWrapper: {
    flex: 1,
    marginRight: 15,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: "#e0e0e0",
    fontSize: 14,
    fontWeight: "500",
  },
  playButton: {
    width: 50, // Slightly larger
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,

    // ✨ NEW: Add this white border to make it pop off the background
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  badge: {
    // ✨ UPDATED: Darker background for better contrast
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,

    // ✨ NEW: subtle border to define the shape
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "80%", // ✨ UPDATED: Increased from 60% to 70% for safer text reading
  },
});
