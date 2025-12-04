import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

// --- Local Imports ---
import { useTheme } from "@/context/ThemeContext";
import LanguageSelector from "@/components/profile/LanguageSelector";
import ThemeToggle from "@/components/profile/ThemeToggle";
import ReferralSection from "@/components/profile/ReferralSection";
import { AchievementsSection } from "@/components/profile/AchievementsSection";
// Note: ContactAction is now moved inside settings, or you can keep it as a footer

// --- Utilities & Types ---
import { getStorageUrl } from "@/utils/imageHelpers";
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
  const [isSettingsVisible, setSettingsVisible] = useState(false); // New State for Modal

  // --- Data Fetching ---
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      const { data: rankData } = await supabase
        .from("leaderboard")
        .select("rank")
        .eq("user_id", userId)
        .maybeSingle();

      setProfile({
        id: profileData.id,
        username: profileData.username,
        name: profileData.name || profileData.username || "Player",
        avatar: getStorageUrl("assets", profileData.avatar_url),
        coins: profileData.coins,
        joinDate: profileData.created_at,
        level: profileData.level,
        referralCode: profileData.referral_code,
      } as unknown as UserProfile);

      if (rankData) setRank(rankData.rank);
    } catch (error: any) {
      console.error("Error loading profile:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // --- Actions ---
  const handleContactPress = () => {
    setSettingsVisible(false);
    router.push("/contact-us");
  };

  const handleLogout = async () => {
    setSettingsVisible(false); // Close modal first
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error signing out", error.message);
    }
  };

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
        {/* --- HEADER BAR (Cleaned Up) --- */}
        <View style={styles.headerRow}>
          {/* Left side: Empty or Logo */}
          <View />

          {/* Right side: Settings Button */}
          <TouchableOpacity
            style={styles.iconButtonWrapper}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
        </View>

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

            <View style={styles.identityContent}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text style={styles.username}>{profile?.name || "Guest"}</Text>
                {/* Tiny Edit Icon - Functionality to be added later */}
                <Ionicons name="pencil" size={14} color={theme.textTertiary} />
              </View>
              <Text style={styles.userTitle}>
                {t("profile.playerTitle", "Cyber Runner")}
              </Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <TouchableOpacity style={styles.statBox}>
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
              </TouchableOpacity>

              <View style={styles.verticalDivider} />

              <TouchableOpacity style={styles.statBox}>
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
              </TouchableOpacity>

              <View style={styles.verticalDivider} />

              <TouchableOpacity style={styles.statBox}>
                {/* Changed from Clock to Fire for Streak/Retention vibes */}
                <MaterialCommunityIcons
                  name="fire"
                  size={18}
                  color="#FF6B6B"
                  style={{ marginBottom: 4 }}
                />
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>STREAK</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* --- REFERRAL SECTION --- */}
          <View style={styles.sectionContainer}>
            <ReferralSection code={profile?.referralCode || "LOADING"} />
          </View>

          {/* --- ACHIEVEMENTS --- */}
          <AchievementsSection />

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* --- SETTINGS MODAL / SIDE PANEL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSettingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSettingsVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Settings</Text>
                  <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                    <Ionicons
                      name="close-circle"
                      size={28}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Section: Preferences */}
                <Text style={styles.sectionHeader}>PREFERENCES</Text>
                <View style={styles.settingRow}>
                  <View style={styles.settingLabelContainer}>
                    <Ionicons
                      name="moon-outline"
                      size={20}
                      color={theme.textPrimary}
                    />
                    <Text style={styles.settingText}>Dark Mode</Text>
                  </View>
                  <ThemeToggle />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingLabelContainer}>
                    <Ionicons
                      name="language-outline"
                      size={20}
                      color={theme.textPrimary}
                    />
                    <Text style={styles.settingText}>Language</Text>
                  </View>
                  <LanguageSelector />
                </View>

                {/* Section: Support */}
                <Text style={styles.sectionHeader}>SUPPORT</Text>
                <TouchableOpacity
                  style={styles.settingRow}
                  onPress={handleContactPress}
                >
                  <View style={styles.settingLabelContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={theme.textPrimary}
                    />
                    <Text style={styles.settingText}>Contact Us</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.textTertiary}
                  />
                </TouchableOpacity>

                {/* Section: Account */}
                <Text style={styles.sectionHeader}>ACCOUNT</Text>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#FF4444" />
                  <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Earnado v1.0.0</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary || "#12141D", // Fallback to dark
    },
    safeArea: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: 50,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 10,
      marginBottom: 5,
    },
    iconButtonWrapper: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 12,
      padding: 8,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.05)",
    },
    profileCard: {
      marginTop: 35,
      marginHorizontal: 20,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 24,
      alignItems: "center",
      paddingTop: 50,
      paddingBottom: 25,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.05)",
      // Cyberpunk glow effect
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
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
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 3,
      borderColor: theme.primary,
    },
    levelBadge: {
      position: "absolute",
      bottom: -6,
      backgroundColor: theme.secondary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.backgroundSecondary,
    },
    levelText: {
      color: theme.textOnSecondary || "#fff",
      fontSize: 11,
      fontWeight: "bold",
    },
    identityContent: {
      alignItems: "center",
      marginBottom: 24,
    },
    username: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    userTitle: {
      fontSize: 13,
      color: theme.textTertiary,
      marginTop: 2,
      letterSpacing: 1,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: theme.backgroundPrimary, // Inner card background
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 10,
    },
    statBox: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 17,
      fontWeight: "800",
      color: theme.textPrimary,
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    statLabel: {
      fontSize: 10,
      color: theme.textSecondary,
      marginTop: 4,
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

    // --- MODAL STYLES ---
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.backgroundSecondary,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 24,
      paddingBottom: 40,
      minHeight: "50%",
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.1)",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 30,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    sectionHeader: {
      fontSize: 12,
      color: theme.textTertiary,
      fontWeight: "bold",
      marginTop: 15,
      marginBottom: 10,
      letterSpacing: 1,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.05)",
    },
    settingLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    settingText: {
      fontSize: 16,
      color: theme.textPrimary,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 30,
      paddingVertical: 15,
      backgroundColor: "rgba(255, 68, 68, 0.1)",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(255, 68, 68, 0.3)",
    },
    logoutText: {
      color: "#FF4444",
      fontWeight: "bold",
      fontSize: 16,
    },
    versionText: {
      textAlign: "center",
      color: theme.textTertiary,
      fontSize: 12,
      marginTop: 20,
    },
  });
