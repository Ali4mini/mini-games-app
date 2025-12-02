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

// --- Hook Import ---
import { useHomeData } from "@/hooks/useHomeData"; // Import the hook we made

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

  // 1. Use the Supabase hook
  const { loading, profile, banners, games, refetch } = useHomeData();

  console.log("profile:", profile);

  // 2. Loading State (Optional: Make a nice skeleton loader later)
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
        // 3. Add Pull-to-Refresh
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={theme.primary}
          />
        }
      >
        {/* Pass real profile data */}
        <HomeHeader
          userName={profile?.name || "Guest"}
          coins={profile?.coins || 0}
          avatarUrl={profile?.avatar || "https://via.placeholder.com/150"}
        />

        {/* Pass real banner data */}
        <HeroCarousel data={banners} />

        <QuickActions />

        {/* Pass real games data */}
        <ContinuePlaying data={games} />

        <ReferralCTA />

        {/* You might want to pass games here too, or fetch different ones inside this component */}
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
