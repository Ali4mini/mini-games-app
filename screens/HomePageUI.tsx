import React, { useMemo } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  View,
  RefreshControl,
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
import { SmartBanner } from "@/components/ads/SmartBanner"; // <--- 1. IMPORT THIS

const HomePageUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { loading, profile, banners, games, refetch } = useHomeData();

  if (loading && !profile) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

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
          avatarUrl={profile?.avatar || "https://via.placeholder.com/150"}
        />

        <HeroCarousel data={banners} />

        <QuickActions />

        <ContinuePlaying data={games} />

        {/* --- 2. ADD BANNER HERE --- */}
        {/* Good UX: Separates the horizontal list from the large card */}
        <SmartBanner />

        <ReferralCTA />

        <FeaturedGames />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      paddingBottom: 110,
    },
  });

export default HomePageUI;
