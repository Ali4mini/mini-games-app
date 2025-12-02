import React, { useMemo } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Link, Href } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./ContinuePlaying.styles";
import { Game } from "@/types";

const RecentGameCard: React.FC<{ game: Game }> = ({ game }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Ensure we have a valid route structure for Expo Router
  const gameLink: Href = {
    pathname: "/game-player",
    params: {
      url: game.url,
      title: game.title,
      orientation: game.orientation,
    },
  };

  return (
    <Link href={gameLink} asChild>
      <TouchableOpacity activeOpacity={0.8} style={styles.card}>
        {/* 1. Background Image (Hook already fixed the URL) */}
        <Image
          source={{ uri: game.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* 2. Center Play Icon */}
        <View style={styles.playIconContainer}>
          <View style={styles.playButtonBubble}>
            <Ionicons
              name="play"
              size={14}
              color="#fff"
              style={{ marginLeft: 2 }}
            />
          </View>
        </View>

        {/* 3. Gradient Fade */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.gradientOverlay}
        >
          <Text style={styles.cardTitle} numberOfLines={1}>
            {game.title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Link>
  );
};

type ContinuePlayingProps = {
  data: Game[];
};

export const ContinuePlaying: React.FC<ContinuePlayingProps> = ({ data }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Safety check: Don't render if no games
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>
        {t("home.continuePlaying", "Continue Playing")}
      </Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <RecentGameCard game={item} />}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
      />
    </View>
  );
};
