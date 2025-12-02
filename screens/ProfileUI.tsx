import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
  Alert,
  Button,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

// --- Local Imports ---
import { useTheme } from "@/context/ThemeContext";
import LanguageSelector from "@/components/profile/LanguageSelector";
import ThemeToggle from "@/components/profile/ThemeToggle";
import ReferralSection from "@/components/profile/ReferralSection";
import { AchievementsSection } from "@/components/profile/AchievementsSection";
import { ContactAction } from "@/components/profile/ContactAction";

// --- Utilities & Types ---
import { getStorageUrl } from "@/utils/imageHelpers"; // Make sure you have this
import { UserProfile } from "@/types";

export const ProfileUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rank, setRank] = useState<number>(0);

  // --- Data Fetching ---
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // 1. Fetch Profile Info
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // 2. Fetch Rank from Leaderboard View
      const { data: rankData } = await supabase
        .from("leaderboard")
        .select("rank")
        .eq("user_id", userId)
        .maybeSingle();

      // 3. Set State
      setProfile({
        id: profileData.id,
        username: profileData.username,
        name: profileData.name || profileData.username || "Player",
        // Use the helper to resolve full URL or placeholder
        avatar: getStorageUrl("assets", profileData.avatar_url),
        coins: profileData.coins,
        joinDate: profileData.created_at,
        level: profileData.level,
        referralCode: profileData.referral_code,
      } as unknown as UserProfile);

      if (rankData) {
        setRank(rankData.rank);
      }
    } catch (error: any) {
      console.error("Error loading profile:", error.message);
      Alert.alert("Error", "Could not load profile data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // --- Actions ---
  const handleContactPress = () => {
    router.push("/contact-us");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error signing out", error.message);
    }
    // AuthContext handles redirect
  };

  // --- Derived State ---
  // Calculate level based on coins (1 Level per 1000 coins)
  const playerLevel = profile ? Math.floor(profile.coins / 1000) + 1 : 1;

  if (loading && !profile) {
    return (
      <View
        style={[
          styles.mainContainer,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchProfileData}
              tintColor={theme.primary}
            />
          }
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
                  source={{ uri: profile?.avatar }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>LVL {playerLevel}</Text>
              </View>
            </View>

            {/* Logout Button (Moved inside card for better layout or keep at bottom) */}
            <View style={{ position: "absolute", top: 10, right: 10 }}>
              {/* Optional: Small logout icon here instead of big button */}
            </View>

            <View style={styles.identityContent}>
              <Text style={styles.username}>{profile?.name || "Guest"}</Text>
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
                  {profile?.coins?.toLocaleString() || "0"}
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
                <Text style={styles.statValue}>#{rank > 0 ? rank : "-"}</Text>
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
                  {profile?.joinDate
                    ? new Date(profile.joinDate).getFullYear()
                    : new Date().getFullYear()}
                </Text>
                <Text style={styles.statLabel}>
                  {t("profile.since", "MEMBER")}
                </Text>
              </View>
            </View>

            {/* Added Log Out button inside card or below stats */}
            <View style={{ marginTop: 20, width: "100%" }}>
              <Button title="Log Out" onPress={handleLogout} color="#ff4444" />
            </View>
          </View>

          {/* --- REFERRAL SECTION --- */}
          <View style={styles.sectionContainer}>
            <ReferralSection code={profile?.referralCode || "LOADING"} />
          </View>

          {/* --- ACHIEVEMENTS --- */}
          <AchievementsSection />

          {/* --- CONTACT SUPPORT --- */}
          <ContactAction onPress={handleContactPress} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// --- STYLES (Unchanged from your snippet) ---
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
