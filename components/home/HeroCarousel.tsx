import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions, // <--- 1. Import hook
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Link, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { HeroBannerItem } from "@/types";

type HeroCarouselProps = {
  data: HeroBannerItem[];
};

// Define heights for different screen sizes
const MOBILE_ITEM_HEIGHT = 200;
const DESKTOP_ITEM_HEIGHT = 320; // <--- Taller for desktop

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ data }) => {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  // 2. Determine if the screen is "desktop" size
  // 768px is a common tablet breakpoint
  const isDesktop = windowWidth > 768;

  // 3. Calculate width and height based on screen size
  const carouselWidth = Math.min(windowWidth, 1024); // Cap at container width
  const itemHeight = isDesktop ? DESKTOP_ITEM_HEIGHT : MOBILE_ITEM_HEIGHT;

  if (!data || data.length === 0) {
    return null;
  }

  const renderCarouselItem = ({ item }: { item: HeroBannerItem }) => (
    <Link href={item.href} asChild>
      <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
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
        width={carouselWidth}
        height={itemHeight} // <--- 4. Use dynamic height
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

// Styles remain unchanged as they are relative
const styles = StyleSheet.create({
  // ... (no changes needed to the styles object)
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
