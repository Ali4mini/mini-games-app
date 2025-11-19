import React, { useMemo } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Local Imports ---
import { useTheme } from "@/context/ThemeContext";
import Colors from "@/constants/Colors";
import { Theme } from "@/types";

// --- Data & Component Imports ---
import {
  USER_DATA,
  HERO_BANNER_DATA,
  RECENTLY_PLAYED_GAMES,
} from "@/data/dummyData";
import { AppTitleHeader } from "@/components/layout/AppTitleHeader";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ContinuePlaying } from "@/components/games/ContinuePlaying";
import { HomeHeader } from "@/components/home/HomeHeader";
import { QuickActions } from "@/components/home/QuickActions";
import { FeaturedGames } from "@/components/home/FeaturedGames";
import { ReferralCTA } from "@/components/home/ReferallCTA";

const HomePageUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        animated={true}
        barStyle={theme === Colors.dark ? "light-content" : "dark-content"}
      />
      <AppTitleHeader appName={t("appName")} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader
          userName={USER_DATA.name}
          coins={USER_DATA.coins}
          avatarUrl={USER_DATA.avatarUrl}
        />
        <HeroCarousel data={HERO_BANNER_DATA} />
        <QuickActions />
        <ContinuePlaying data={RECENTLY_PLAYED_GAMES} />
        <ReferralCTA />
        <FeaturedGames />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    scrollContent: {
      paddingBottom: 110,
    },
  });

export default HomePageUI;
