import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native"; // <-- Import StyleSheet
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./ContinuePlaying.styles";
import { Game } from "../../types";
import { Link } from "expo-router";

// The corrected self-contained card component
const RecentGameCard: React.FC<{ game: Game }> = ({ game }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Link href="/games-list" asChild>
      <TouchableOpacity style={styles.card}>
        <ImageBackground
          source={{ uri: game.image }}
          // ADDED this to make the image fill the TouchableOpacity
          style={StyleSheet.absoluteFill}
          imageStyle={{ borderRadius: 10 }} // Apply borderRadius to the image itself
          resizeMode="cover"
        >
          <View style={styles.textOverlay}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {game.title}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Link>
  );
};

type ContinuePlayingProps = {
  data: Game[];
};

export const ContinuePlaying: React.FC<ContinuePlayingProps> = ({ data }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>Continue Playing</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <RecentGameCard game={item} />}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20 }}
      />
    </View>
  );
};
