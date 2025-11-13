import React, { useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";

// --- Local Imports ---
import { useTheme } from "../context/ThemeContext";
import Colors from "../constants/Colors";
import { createStyles } from "./HomePageUI.styles";

// --- Type Imports ---
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  USER_DATA,
  FEATURED_GAMES,
  HERO_BANNER_DATA,
  RECENTLY_PLAYED_GAMES,
  GAME_CATEGORIES,
} from "../data/dummyData";
import { GameCard } from "../components/games/GameCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { AppTitleHeader } from "@/components/layout/AppTitleHeader";
import { ContinuePlaying } from "@/components/games/ContinuePlaying";
import { GameCategories } from "@/components/games/GameCategories";

const HomePageUI: React.FC = () => {
  const theme = useTheme();

  // Create styles using the imported function, memoized for performance
  const styles = useMemo(() => createStyles(theme), [theme]);

  // NOTE: In a real app, this state would be used to filter FEATURED_GAMES
  const handleCategorySelect = (category: string) => {
    console.log("Selected Category:", category);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar
        animated={true}
        barStyle={theme === Colors.dark ? "light-content" : "dark-content"}
      />
      <AppTitleHeader appName="earnado" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerWelcome}>Welcome back,</Text>
            <Text style={styles.headerUsername}>{USER_DATA.name}</Text>
          </View>
          <View style={styles.coinsContainer}>
            <FontAwesome5 name="coins" size={20} color="#FFD700" />
            <Text style={styles.coinsText}>{USER_DATA.coins}</Text>
          </View>
        </View>

        {/* Hero Banner Section */}
        <HeroCarousel data={HERO_BANNER_DATA} />

        {/* Quick Actions Section */}
        <View style={styles.quickActionsContainer}>
          <Link href="/daily-check" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <Feather name="calendar" size={24} color="#FFF" />
              <Text style={styles.quickActionText}>Daily Check-in</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/lucky-spin" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <FontAwesome5 name="compact-disc" size={24} color="#FFF" />
              <Text style={styles.quickActionText}>Lucky Spin</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* recently played Games Section */}
        <ContinuePlaying data={RECENTLY_PLAYED_GAMES} />

        {/* Featured Games Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Games</Text>
          {/* === ADD THE NEW CATEGORIES COMPONENT HERE === */}
          <GameCategories
            categories={GAME_CATEGORIES}
            onSelectCategory={handleCategorySelect}
          />
          <FlatList
            data={FEATURED_GAMES}
            renderItem={({ item }) => (
              <GameCard title={item.title} image={item.image} />
            )}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
          />
        </View>

        {/* Refer a Friend CTA Section */}
        <Link href="/referral" asChild>
          <TouchableOpacity style={styles.referralContainer}>
            <FontAwesome5 name="user-friends" size={30} color={theme.tint} />
            <View style={styles.referralText}>
              <Text style={styles.referralTitle}>Refer a Friend!</Text>
              <Text style={styles.referralSubtitle}>
                Earn 500 coins for every friend you invite.
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.tint} />
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default HomePageUI;
