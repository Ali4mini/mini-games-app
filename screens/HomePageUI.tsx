import React, { useMemo } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  View,
  RefreshControl,
  Platform, // <--- 1. Import Platform for web specifics
} from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Local Imports ---
import { useTheme } from "@/context/ThemeContext";
import Colors from "@/constants/Colors";
import { Theme } from "@/types";
import { useHomeData } from "@/hooks/useHomeData";

// --- Component Imports ---
import { AppTitleHeader } from "@/components/layout/AppTitleHeader";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ContinuePlaying } from "@/components/games/ContinuePlaying";
import { HomeHeader } from "@/components/home/HomeHeader";
import { QuickActions } from "@/components/home/QuickActions";
import { FeaturedGames } from "@/components/home/FeaturedGames";
import { ReferralCTA } from "@/components/home/ReferallCTA";
import { SmartBanner } from "@/components/ads/SmartBanner";

// --- A. DEFINE A CONSTANT FOR THE TAB BAR'S HEIGHT ---
// It's good practice to define this so you can reuse it.
// Your bar is 70px high + we'll add extra for padding and the safe area.
const TAB_BAR_OFFSET = 120; // A generous value to clear the tab bar

const HomePageUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  // Pass theme to styles to access colors
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { loading, profile, banners, games, refetch } = useHomeData();

  if (loading && !profile) {
    // Uses rootBackground to ensure full screen color while loading
    return (
      <View style={[styles.rootBackground, styles.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    // 2. ROOT VIEW: Handles the background for the full browser window
    <View style={styles.rootBackground}>
      {/* 3. SAFE AREA: Constrained to max-width */}
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar
          animated={true}
          barStyle={theme === Colors.dark ? "light-content" : "dark-content"}
        />
        <AppTitleHeader appName={t("appName")} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={theme.primary}
            />
          }
        >
          <HomeHeader
            userName={profile?.name || "Guest"}
            coins={profile?.coins || 0}
            avatarUrl={profile?.avatar_url}
          />

          <HeroCarousel data={banners} />

          <QuickActions />

          <ContinuePlaying data={games} />

          <SmartBanner />

          <ReferralCTA />

          <FeaturedGames />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    rootBackground: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
      alignItems: "center",
    },
    container: {
      flex: 1,
      width: "100%",
      maxWidth: 1024,
      backgroundColor: theme.backgroundPrimary,
      ...Platform.select({
        web: {
          boxShadow: "0px 0px 24px rgba(0,0,0,0.15)",
        },
      }),
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    // --- C. APPLY THE FIX HERE ---
    scrollContent: {
      // Old: paddingBottom: 110,
      // New: Use the offset constant
      paddingBottom: TAB_BAR_OFFSET,
    },
  });

export default HomePageUI;
