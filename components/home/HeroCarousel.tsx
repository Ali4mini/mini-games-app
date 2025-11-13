import React, { useMemo } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Link } from "expo-router";

import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./HeroCarousel.styles";
import { HeroBannerItem } from "../../types";

type HeroCarouselProps = {
  data: HeroBannerItem[];
};

const { width: screenWidth } = Dimensions.get("window");

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ data }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, screenWidth), [theme]);

  const renderCarouselItem = ({ item }: { item: HeroBannerItem }) => (
    <Link href={item.href} asChild>
      <TouchableOpacity style={styles.slide}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textOverlay}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={screenWidth}
        height={180}
        autoPlay={true}
        autoPlayInterval={4000}
        data={data}
        scrollAnimationDuration={1000}
        renderItem={renderCarouselItem}
      />
    </View>
  );
};
