import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

import { pb } from "@/utils/pocketbase";
import { useTheme } from "@/context/ThemeContext";
import LanguageSelector from "@/components/profile/LanguageSelector";
import ThemeToggle from "@/components/profile/ThemeToggle";
import ReferralSection from "@/components/profile/ReferralSection";
import { AchievementsSection } from "@/components/profile/AchievementsSection";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { getStorageUrl } from "@/utils/imageHelpers";
import { UserProfile, Theme } from "@/types";

// IMPORT INTENTS
// We restore openStoreForReview to handle the click
import { openStoreForReview, shareApp, contactSupport } from "@/utils/intents";

// ==========================================
// BUILD CONFIGURATION
// Change this to "google", "bazaar", or "myket" before building!
// ==========================================
const TARGET_STORE: "google" | "bazaar" | "myket" = "bazaar";

const MAX_WIDTH = 1024;
const TAB_BAR_OFFSET = 120;

export const ProfileUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 900;

  const styles = useMemo(
    () => createStyles(theme, isDesktop),
    [theme, isDesktop],
  );

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rank, setRank] = useState<number>(0);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [isEditVisible, setEditVisible] = useState(false);

  const fetchProfileData = useCallback(async () => {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      const [profileData, leaderboardData] = await Promise.all([
        pb.collection("users").getOne(userId, { requestKey: "profile_fetch" }),
        pb.send("/api/leaderboard", {
          method: "GET",
          requestKey: "rank_fetch",
        }),
      ]);

      setProfile({
        id: profileData.id,
        username: profileData.username,
        name: profileData.name || profileData.username || "Player",
        avatar: getStorageUrl(profileData, profileData.avatar_url),
        coins: profileData.coins,
        joinDate: profileData.created,
        level: profileData.level,
        referralCode: profileData.referral_code,
      } as unknown as UserProfile);

      if (leaderboardData.user_rank) {
        setRank(leaderboardData.user_rank);
      }
    } catch (error: any) {
      if (!error.isAbort) {
        console.error("Error loading profile:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();

    const userId = pb.authStore.model?.id;
    if (userId) {
      pb.collection("users").subscribe(userId, (e) => {
        if (e.action === "update") {
          const updated = e.record;
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  coins: updated.coins,
                  name: updated.name || updated.username,
                  avatar: getStorageUrl(updated, updated.avatar),
                }
              : null,
          );
        }
      });
    }

    return () => {
      if (userId) pb.collection("users").unsubscribe(userId);
    };
  }, [fetchProfileData]);

  const handleLogout = async () => {
    setSettingsVisible(false);
    pb.authStore.clear();
  };

  // Helper to render the correct rate button
  const renderRateUsButton = () => {
    switch (TARGET_STORE) {
      case "google":
        return (
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => openStoreForReview("google")}
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="logo-google-playstore"
                size={20}
                color={theme.textPrimary}
              />
              <Text style={styles.settingText}>Rate on Google Play</Text>
            </View>
            <Ionicons
              name="star-outline"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        );
      case "bazaar":
        return (
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => openStoreForReview("bazaar")}
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="basket-outline"
                size={20}
                color={theme.textPrimary}
              />
              <Text style={styles.settingText}>Rate on Cafe Bazaar</Text>
            </View>
            <Ionicons
              name="star-outline"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        );
      case "myket":
        return (
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => openStoreForReview("myket")}
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="apps-outline"
                size={20}
                color={theme.textPrimary}
              />
              <Text style={styles.settingText}>Rate on Myket</Text>
            </View>
            <Ionicons
              name="star-outline"
              size={20}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const playerLevel = profile ? Math.floor(profile.coins / 1000) + 1 : 1;

  if (loading && !profile) {
    return (
      <View
        style={[
          styles.rootBackground,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.rootBackground}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          {/* HEADER BAR */}
          <View style={styles.headerRow}>
            <View />
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
                onRefresh={() => {
                  setLoading(true);
                  fetchProfileData();
                }}
                tintColor={theme.primary}
              />
            }
          >
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
                  <Text style={styles.username}>
                    {profile?.name || "Guest"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setEditVisible(true)}
                    hitSlop={10}
                  >
                    <Ionicons name="pencil" size={16} color={theme.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.userTitle}>
                  {t("profile.playerTitle", "Cyber Runner")}
                </Text>
              </View>

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
                    name="fire"
                    size={18}
                    color="#FF6B6B"
                    style={{ marginBottom: 4 }}
                  />
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statLabel}>STREAK</Text>
                </View>
              </View>
            </View>

            <View style={isDesktop ? styles.desktopRow : styles.mobileColumn}>
              {isDesktop ? (
                <>
                  <View style={{ flex: 2 }}>
                    <AchievementsSection />
                  </View>
                  <View style={{ flex: 1.2 }}>
                    <ReferralSection
                      code={profile?.referralCode || "LOADING"}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.sectionContainer}>
                    <ReferralSection
                      code={profile?.referralCode || "LOADING"}
                    />
                  </View>
                  <AchievementsSection />
                </>
              )}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>

        <EditProfileModal
          visible={isEditVisible}
          onClose={() => setEditVisible(false)}
          currentUser={profile}
          onProfileUpdate={fetchProfileData}
        />

        {/* SETTINGS MODAL */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isSettingsVisible}
          onRequestClose={() => setSettingsVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setSettingsVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
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

                  {/* Wrapped in ScrollView to prevent overflow on small screens */}
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* PREFERENCES SECTION */}
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

                    {/* COMMUNITY & SUPPORT SECTION */}
                    <Text style={styles.sectionHeader}>
                      COMMUNITY & SUPPORT
                    </Text>
                    <TouchableOpacity
                      style={styles.settingRow}
                      onPress={shareApp}
                    >
                      <View style={styles.settingLabelContainer}>
                        <Ionicons
                          name="share-social-outline"
                          size={20}
                          color={theme.textPrimary}
                        />
                        <Text style={styles.settingText}>Invite Friends</Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={theme.textTertiary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.settingRow}
                      onPress={() => contactSupport("support@test.com")}
                    >
                      <View style={styles.settingLabelContainer}>
                        <Ionicons
                          name="mail-outline"
                          size={20}
                          color={theme.textPrimary}
                        />
                        <Text style={styles.settingText}>Contact Support</Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={theme.textTertiary}
                      />
                    </TouchableOpacity>

                    {/* RATE US SECTION - DYNAMIC */}
                    <Text style={styles.sectionHeader}>RATE US</Text>
                    {renderRateUsButton()}

                    {/* ACCOUNT SECTION */}
                    <Text style={styles.sectionHeader}>ACCOUNT</Text>
                    <TouchableOpacity
                      style={styles.logoutButton}
                      onPress={handleLogout}
                    >
                      <Ionicons
                        name="log-out-outline"
                        size={20}
                        color="#FF4444"
                      />
                      <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

                    <View style={{ height: 20 }} />
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme, isDesktop: boolean) =>
  StyleSheet.create({
    rootBackground: {
      flex: 1,
      backgroundColor:
        Platform.OS === "web" ? theme.backgroundPrimary : "transparent",
      alignItems: "center",
    },
    container: {
      flex: 1,
      width: "100%",
      maxWidth: MAX_WIDTH,
      backgroundColor:
        Platform.OS === "web" ? theme.backgroundPrimary : "transparent",
      ...Platform.select({
        web: {
          boxShadow: "0px 0px 24px rgba(0,0,0,0.15)",
        },
      }),
    },
    safeArea: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: TAB_BAR_OFFSET,
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
      color: theme.secondaryContent || "#fff",
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
      marginTop: 15,
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
      maxWidth: isDesktop ? 600 : "100%",
      backgroundColor: theme.backgroundPrimary,
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
    mobileColumn: {
      flexDirection: "column",
    },
    desktopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      marginTop: 24,
      gap: 24,
    },
    sectionContainer: {
      marginTop: 24,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: isDesktop ? "center" : "flex-end",
      alignItems: isDesktop ? "center" : undefined,
    },
    modalContent: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: isDesktop ? 24 : 30,
      borderTopLeftRadius: isDesktop ? 24 : 30,
      borderTopRightRadius: isDesktop ? 24 : 30,
      borderBottomLeftRadius: isDesktop ? 24 : 0,
      borderBottomRightRadius: isDesktop ? 24 : 0,
      padding: 24,
      paddingBottom: 40,
      width: isDesktop ? 450 : "100%",
      maxHeight: "85%", // Added max height so the scrollview works properly
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.1)",
      ...Platform.select({
        web: { boxShadow: "0px 10px 40px rgba(0,0,0,0.5)" },
      }),
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20, // Reduced slightly since we have scrolling now
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
      paddingVertical: 14, // increased slightly for better tap targets
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
      marginTop: 20,
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
  });
