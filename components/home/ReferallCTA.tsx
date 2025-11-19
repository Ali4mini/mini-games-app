import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types";

export const ReferralCTA: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Link href="/profile" asChild>
      <TouchableOpacity activeOpacity={0.9} style={styles.containerWrapper}>
        <LinearGradient
          // Deep Purple -> Electric Blue (High Contrast & "Tech" feel)
          colors={["#6a11cb", "#2575fc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Left: Floating Icon Circle */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="gift-open-outline"
              size={28}
              color="#fff"
            />
          </View>

          {/* Center: Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {t("home.referralTitle", "Refer a Friend")}
            </Text>
            <Text style={styles.subtitle}>
              {t("home.referralSubtitle", {
                count: 500,
                defaultValue: "Get 500 coins!",
              })}
            </Text>
          </View>

          {/* Right: Action Button */}
          <View style={styles.actionBtn}>
            <Text style={styles.btnText}>INVITE</Text>
            <Ionicons name="arrow-forward" size={12} color="#2575fc" />
          </View>

          {/* Decorative Background Elements for Texture */}
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />
        </LinearGradient>
      </TouchableOpacity>
    </Link>
  );
};

// --- STYLES ---
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    containerWrapper: {
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 10,
      // Shadow for the whole card
      shadowColor: "#2575fc",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    gradient: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      position: "relative",
      overflow: "hidden", // Clips the decorative circles
    },

    // ICON
    iconCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(255,255,255,0.2)", // Glassy effect
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
      zIndex: 2,
    },

    // TEXT
    textContainer: {
      flex: 1,
      zIndex: 2,
    },
    title: {
      fontSize: 16,
      fontWeight: "800",
      color: "#fff", // Always white on this gradient
      marginBottom: 2,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 12,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },

    // BUTTON
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 4,
      zIndex: 2,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    btnText: {
      color: "#2575fc", // Matches the gradient end color
      fontSize: 10,
      fontWeight: "800",
    },

    // DECORATION (Subtle circles in background)
    decoCircle1: {
      position: "absolute",
      top: -20,
      left: -20,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "rgba(255,255,255,0.08)",
      zIndex: 1,
    },
    decoCircle2: {
      position: "absolute",
      bottom: -30,
      right: 50, // Behind the text
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.05)",
      zIndex: 1,
    },
  });
