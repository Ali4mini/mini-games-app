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
import { useTranslation } from "react-i18next"; // <-- 1. Import the hook
import { SafeAreaView } from "react-native-safe-area-context"; // <-- Corrected import

// --- Local Imports ---
import { useTheme } from "@/context/ThemeContext";
import Colors from "@/constants/Colors";
import { createStyles } from "./HomePageUI.styles";

// --- Data & Component Imports ---
import {
  USER_DATA,
  FEATURED_GAMES,
  HERO_BANNER_DATA,
  RECENTLY_PLAYED_GAMES,
  GAME_CATEGORIES,
} from "@/data/dummyData";
import { GameCard } from "@/components/games/GameCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { AppTitleHeader } from "@/components/layout/AppTitleHeader";
import { ContinuePlaying } from "@/components/games/ContinuePlaying";
import { GameCategories } from "@/components/games/GameCategories";

const HomePageUI: React.FC = () => {
  const { t } = useTranslation(); // <-- 2. Initialize the hook
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleCategorySelect = (category: string) => {
    console.log("Selected Category:", category);
  };

  return (
    // Corrected to use SafeAreaView. The Provider should only be in the root layout.
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        animated={true}
        barStyle={theme === Colors.dark ? "light-content" : "dark-content"}
      />
      <AppTitleHeader appName={t("appName")} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }} // Adjusted padding for new navbar
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerWelcome}>{t("home.welcomeBack")}</Text>
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
              <Text style={styles.quickActionText}>
                {t("home.dailyCheckIn")}
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/leaderboard" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <FontAwesome5 name="leaderboard" size={24} color="#FFF" />
              <Text style={styles.quickActionText}>
                {t("leaderboard.title")}
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href="/lucky-spin" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <FontAwesome5 name="compact-disc" size={24} color="#FFF" />
              <Text style={styles.quickActionText}>{t("home.luckySpin")}</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* recently played Games Section */}
        <ContinuePlaying data={RECENTLY_PLAYED_GAMES} />

        {/* Featured Games Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("home.featuredGames")}</Text>
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
              <Text style={styles.referralTitle}>
                {t("home.referralTitle")}
              </Text>
              <Text style={styles.referralSubtitle}>
                {t("home.referralSubtitle", { count: 500 })}
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.tint} />
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePageUI;
