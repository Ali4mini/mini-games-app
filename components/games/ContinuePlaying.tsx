import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Link, Href } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { Theme, Game } from "@/types";

// --- SUB-COMPONENT: CARD ---
const RecentGameCard: React.FC<{ game: Game; theme: Theme; styles: any }> = ({
  game,
  theme,
  styles,
}) => {
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
        {/* 1. Background Image */}
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
          colors={["transparent", "rgba(0,0,0,0.85)"]}
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

// --- MAIN COMPONENT ---
type ContinuePlayingProps = {
  data: Game[];
};

export const ContinuePlaying: React.FC<ContinuePlayingProps> = ({ data }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme), [theme]);

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
        renderItem={({ item }) => (
          <RecentGameCard game={item} theme={theme} styles={styles} />
        )}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        // Improve web scrolling feel
        decelerationRate="fast"
        snapToInterval={175} // Card width (160) + Margin (15)
      />
    </View>
  );
};

// --- STYLES ---
const CARD_WIDTH = 160;
const CARD_HEIGHT = 100;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    sectionContainer: {
      marginTop: 25,
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
      marginBottom: 15,
      paddingHorizontal: 20,
      letterSpacing: 0.5,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    // Card Styles
    card: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 12,
      marginRight: 15,
      overflow: "hidden",
      backgroundColor: theme.backgroundSecondary,
      position: "relative",
      // Web Pointer
      ...Platform.select({
        web: {
          cursor: "pointer",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)", // Nice shadow on web
          transition: "transform 0.2s ease", // Smooth hover effect setup
        },
        default: {
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
      }),
    },
    image: {
      width: "100%",
      height: "100%",
    },
    playIconContainer: {
      ...StyleSheet.absoluteFillObject, // Fills the card
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    playButtonBubble: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.4)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.6)",
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(4px)", // Works on some web browsers for glass effect
    },
    gradientOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "50%",
      justifyContent: "flex-end",
      padding: 10,
      zIndex: 1,
    },
    cardTitle: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
      textShadowColor: "rgba(0,0,0,0.8)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  });
