import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import * as Clipboard from "expo-clipboard";
import { FontAwesome5 } from "@expo/vector-icons";

import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "./ProfileUI.styles";
import { USER_DATA, LEADERBOARD_DATA } from "@/data/dummyData";
import { LeaderboardPreview } from "@/components/profile/LeaderboardPreview";
import LanguageSelector from "@/components/profile/LanguageSelector"; // Ensure path is correct

export const ProfileUI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(USER_DATA.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 
        We moved the Settings/Header OUTSIDE the ScrollView 
        so it stays pinned at the top (optional), or just to 
        manage layout better. Here it is inside ScrollView 
        but with specific 'headerRow' styling.
      */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        
        {/* --- HEADER / SETTINGS BAR --- */}
        <View style={styles.headerRow}>
          {/* Spacer to push content to the right */}
          <View style={{ flex: 1 }} />
          
          {/* Language Selector (Top Right) */}
          <LanguageSelector />
        </View>

        {/* --- User Identity Section --- */}
        <View style={styles.identitySection}>
          <Image source={{ uri: USER_DATA.avatarUrl }} style={styles.avatar} />
          
          <Text style={styles.username}>{USER_DATA.name}</Text>
          
          <View style={styles.coinsContainer}>
            <FontAwesome5 name="coins" size={18} color={theme.warning} style={{ marginRight: 8 }} />
            <Text style={styles.coinsText}>
              {USER_DATA.coins.toLocaleString()}
            </Text>
          </View>
          
          <Text style={styles.joinDate}>
            {t("profile.joinDate", {
              date: new Date(USER_DATA.joinDate).toLocaleDateString(),
            })}
          </Text>
        </View>

        {/* --- Referral Code Section --- */}
        <View style={styles.referralSection}>
          <Text style={styles.referralTitle}>
            {t("profile.yourReferralCode")}
          </Text>
          <View style={styles.referralBox}>
            <Text style={styles.referralCodeText}>
              {USER_DATA.referralCode}
            </Text>
            <TouchableOpacity
              onPress={handleCopyCode}
              style={styles.copyButton}
              activeOpacity={0.7}
            >
              <Text style={styles.copyButtonText}>
                {copied ? t("profile.copied") : t("profile.copyCode")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Leaderboard Preview Section --- */}
        <LeaderboardPreview data={LEADERBOARD_DATA} />
      </ScrollView>
    </SafeAreaView>
  );
};
