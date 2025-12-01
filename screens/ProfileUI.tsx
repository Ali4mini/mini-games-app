import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
  Alert,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

import { useTheme } from "@/context/ThemeContext";
import { USER_DATA } from "@/data/dummyData";
import LanguageSelector from "@/components/profile/LanguageSelector";
import ThemeToggle from "@/components/profile/ThemeToggle";

// --- Components ---
import ReferralSection from "@/components/profile/ReferralSection";
import { AchievementsSection } from "@/components/profile/AchievementsSection"; // New
import { ContactAction } from "@/components/profile/ContactAction"; // New

export const ProfileUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();

  const playerLevel = Math.floor(USER_DATA.coins / 1000) + 1;

  const handleContactPress = () => {
    // Navigate to your Contact Page
    router.push("/contact-us");

    // Fallback if no page exists yet:
    // Alert.alert("Contact Support", "Redirecting to support center...");
  };
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Error signing out", error.message);
    }
    // No need to manually router.replace().
    // The AuthContext in _layout.tsx will see the session vanish and redirect you.
  };

  return (
    <View style={styles.mainContainer}>
      {/* --- HERO BACKGROUND --- */}
      {/* <View style={styles.splashContainer}> */}
      {/*   <LinearGradient */}
      {/*     colors={[theme.primary, theme.backgroundPrimary]}  */}
      {/*     start={{ x: 0.5, y: 0 }} */}
      {/*     end={{ x: 0.5, y: 1 }} */}
      {/*     style={styles.headerSplash} */}
      {/*   /> */}
      {/* </View> */}

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- HEADER BAR --- */}
          <View style={styles.headerRow}>
            <View style={styles.iconButtonWrapper}>
              <ThemeToggle />
            </View>
            <View style={styles.iconButtonWrapper}>
              <LanguageSelector />
            </View>
          </View>

          {/* --- PLAYER IDENTITY CARD --- */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{ uri: USER_DATA.avatarUrl }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>LVL {playerLevel}</Text>
              </View>
            </View>

            <View style={styles.mainContainer}>
              {/* Other profile info... */}

              <Button title="Log Out" onPress={handleLogout} color="#ff4444" />
            </View>

            <View style={styles.identityContent}>
              <Text style={styles.username}>{USER_DATA.name}</Text>
              <Text style={styles.userTitle}>
                {t("profile.playerTitle", "Cyber Runner")}
              </Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <FontAwesome5
                  name="coins"
                  size={16}
                  color={theme.warning}
                  style={{ marginBottom: 4 }}
                />
                <Text style={styles.statValue}>
                  {USER_DATA.coins.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>
                  {t("profile.credits", "CREDITS")}
                </Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statBox}>
                <FontAwesome5
                  name="trophy"
                  size={16}
                  color={theme.secondary}
                  style={{ marginBottom: 4 }}
                />
                <Text style={styles.statValue}>#42</Text>
                <Text style={styles.statLabel}>
                  {t("profile.rank", "GLOBAL")}
                </Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.statBox}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color={theme.textTertiary}
                  style={{ marginBottom: 4 }}
                />
                <Text style={styles.statValue}>
                  {new Date(USER_DATA.joinDate).getFullYear()}
                </Text>
                <Text style={styles.statLabel}>
                  {t("profile.since", "MEMBER")}
                </Text>
              </View>
            </View>
          </View>

          {/* --- REFERRAL SECTION (The Ticket) --- */}
          <View style={styles.sectionContainer}>
            <ReferralSection code={USER_DATA.referralCode} />
          </View>

          {/* --- ACHIEVEMENTS (Replacing Leaderboard) --- */}
          {/* No container wrapper needed as component handles padding */}
          <AchievementsSection />

          {/* --- CONTACT SUPPORT BUTTON --- */}
          <ContactAction onPress={handleContactPress} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      // backgroundColor: theme.backgroundPrimary,
    },
    safeArea: {
      flex: 1,
    },
    splashContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 280,
      overflow: "hidden",
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
    },
    headerSplash: {
      flex: 1,
      opacity: 0.8,
    },
    scrollViewContent: {
      paddingBottom: 120,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 10,
      marginBottom: 10,
    },
    iconButtonWrapper: {
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: 30,
      padding: 4,
    },
    profileCard: {
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 24,
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 20,
      paddingHorizontal: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 5,
    },
    avatarContainer: {
      position: "absolute",
      top: -40,
      alignItems: "center",
      zIndex: 10,
    },
    avatarBorder: {
      padding: 4,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 60,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    levelBadge: {
      position: "absolute",
      bottom: -6,
      backgroundColor: theme.secondary,
      paddingHorizontal: 12,
      paddingVertical: 3,
      borderRadius: 12,
    },
    levelText: {
      color: theme.secondaryContent || "#000",
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    identityContent: {
      alignItems: "center",
      marginBottom: 20,
    },
    username: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 4,
    },
    userTitle: {
      fontSize: 13,
      color: theme.textTertiary,
      fontWeight: "500",
      letterSpacing: 1,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      // backgroundColor: theme.backgroundPrimary,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 10,
    },
    statBox: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.textPrimary,
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    statLabel: {
      fontSize: 9,
      color: theme.textSecondary,
      marginTop: 2,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    verticalDivider: {
      width: 1,
      backgroundColor: theme.textTertiary,
      opacity: 0.1,
      marginHorizontal: 4,
    },
    sectionContainer: {
      marginTop: 24,
    },
  });
