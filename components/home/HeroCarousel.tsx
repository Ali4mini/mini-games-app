import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Link } from "expo-router"; // Import Href type for safety
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { HeroBannerItem } from "@/types";

type HeroCarouselProps = {
  data: HeroBannerItem[];
};

const { width: screenWidth } = Dimensions.get("window");
const ITEM_HEIGHT = 200;

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ data }) => {
  const theme = useTheme();

  // 1. SAFETY CHECK: Backend might return empty array initially
  if (!data || data.length === 0) {
    return null; // Or return a Skeleton Loader here if you prefer
  }

  const renderCarouselItem = ({ item }: { item: HeroBannerItem }) => (
    // 2. ROUTING: We cast item.href to Href<string> to satisfy Expo Router types
    <Link href={item.href} asChild>
      <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
        {/* 3. IMAGE: The hook already formatted this to a full https:// URL */}
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        />

        <View style={styles.contentContainer}>
          <View style={styles.textWrapper}>
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

          <View
            style={[
              styles.playButton,
              { backgroundColor: theme.primary || "#FFC107" },
            ]}
          >
            <Ionicons
              name="play"
              size={24}
              color="#000" // Black icon usually looks best on bright primary colors
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

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    marginHorizontal: 5,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
});
